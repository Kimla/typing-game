<template>
    <div class="page py-8">
        <h1 class="heading text-center">Typing game</h1>
        <Name
            v-if="!name"
            @changed="(val) => name = val"
        />
        <div
            v-if="name"
            class="container"
        >
            <p class="words">
                <Word
                    v-for="(word, index) in words"
                    :key="index"
                    :word="word"
                    :input="input"
                    :active="index === currentWord"
                    :completed-correct="currentWord > index
                        && words[index] === wordsCompleted[index]
                    "
                    :completed-invalid="currentWord > index
                        && words[index] !== wordsCompleted[index]
                    "
                />
            </p>
            <div
                v-if="!ended"
                class="inputHolder"
            >
                <input
                    v-model="input"
                    type="text"
                    class="input"
                    placeholder="Enter text..."
                    autofocus
                    @keyup="checkWord"
                >
            </div>
            <div class="w-64 mx-auto flex justify-between items-center">
                <Counter
                    ref="counter"
                />
                <button
                    class="button"
                    @click="restart()"
                >
                    Restart
                </button>
            </div>
            <div
                v-if="ended"
                class="ended text-center mt-8"
            >
                <p class="score">Score: {{ score }} wpm</p>

                <button
                    class="button"
                    @click="restart()"
                >
                    Play again
                </button>
            </div>
        </div>
        <div class="container">
            <div class="flex mt-8 pt-6">
                <ScoreList
                    :scores="highScores"
                    heading="High score"
                    class="w-1/2"
                />
                <ScoreList
                    :scores="latestScores"
                    heading="Latest"
                    class="w-1/2"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Counter from '../components/Counter.vue';
import Name from '../components/Name.vue';
import ScoreList from '../components/ScoreList.vue';
import Word from '../components/Word.vue';
import importedWords from '../utils/words';
import db from '../utils/firebase';

export default {
    components: {
        Counter,
        Name,
        ScoreList,
        Word,
    },
    data() {
        return {
            nameInput: null,
            name: null,
            started: false,
            ended: false,
            currentWord: 0,
            input: '',
            importedWords,
            words: [],
            wordsCompleted: [],
            inputs: 0,
            highScores: [],
            latestScores: [],
        };
    },
    computed: {
        correctWords() {
            let completed = 0;

            for (let i = 0; i < this.words.length; i++) {
                if (this.words[i].trim() === this.wordsCompleted[i].trim()) {
                    completed++;
                }
            }

            return completed;
        },
        score() {
            const time = this.$refs.counter.counter / 60;
            return parseFloat(this.correctWords / time).toFixed(2);
        },
    },
    mounted() {
        this.checkIfNameExists();
        this.setWords();
        this.initHighScore();
        this.initLatestScore();
    },
    methods: {
        checkIfNameExists() {
            this.name = window.localStorage.getItem('name');
        },
        initHighScore() {
            db.ref('scores').orderByChild('wpm').limitToLast(10)
                .on('value', (snapshot) => {
                    const scores = [];
                    snapshot.forEach((child) => {
                        scores.push(child.val());
                    });
                    this.highScores = scores.reverse();
                });
        },
        initLatestScore() {
            db.ref('scores').limitToLast(10)
                .on('value', (snapshot) => {
                    const scores = [];
                    snapshot.forEach((child) => {
                        scores.push(child.val());
                    });
                    this.latestScores = scores.reverse();
                });
        },
        addScore(name, wpm) {
            const key = Date.now();
            db.ref(`scores/${key}`).set({
                name,
                wpm,
                key,
            });
        },
        restart() {
            this.started = false;
            this.ended = false;
            this.currentWord = 0;
            this.input = '';
            this.wordsCompleted = [];
            this.inputs = 0;
            this.$refs.counter.stop();
            this.$refs.counter.reset();
            this.setWords();
        },
        setWords() {
            const words = this.importedWords.split('\n').filter(word => word.length > 0);
            const choosen = [];

            for (let i = 0; i < 50; i++) {
                const number = Math.floor(Math.random() * words.length);
                choosen.push(words[number]);
            }

            this.words = choosen;
        },
        checkWord(event) {
            this.inputs++;

            if (!this.started) {
                this.$refs.counter.start();
                this.started = true;
            }

            const value = event.target.value.trim();

            if (event.keyCode === 32 && value.length > 0) {
                this.wordsCompleted.push(value);
                this.currentWord++;
                this.input = '';
            }

            if (this.currentWord >= this.words.length) {
                if (this.inputs < this.words.length * 3) {
                    window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
                    return;
                }
                this.$refs.counter.stop();
                this.ended = true;
                this.addScore(this.name, this.score);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.heading {
    margin-bottom: 50px;
    color: $primaryColor;
}
.words {
    width: 800px;
    margin: 0 auto;
    max-width: 100%;
    margin-bottom: 50px;
    font-size: 20px;
    line-height: 1.6;
}
</style>
