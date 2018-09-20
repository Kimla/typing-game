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
            <Result
                v-if="ended"
                :score="score"
            />
            <div class="w-128 mx-auto flex justify-between items-center">
                <button
                    class="button"
                    @click="name = false"
                >
                    Change name
                </button>
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
        </div>
        <ScoreLists/>
    </div>
</template>

<script>
import Counter from '../components/Counter.vue';
import Name from '../components/Name.vue';
import Result from '../components/Result.vue';
import ScoreLists from '../components/ScoreLists.vue';
import Word from '../components/Word.vue';
import db from '../utils/firebase';
import getWords from '../utils/helpers';

export default {
    components: {
        Counter,
        Name,
        Result,
        ScoreLists,
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
            words: [],
            wordsCompleted: [],
            inputs: 0,
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
            if (!this.ended) return false;

            const time = this.$refs.counter.counter / 60;
            return parseFloat(this.correctWords / time).toFixed(2);
        },
    },
    mounted() {
        this.checkIfNameExists();
        this.setWords();
    },
    methods: {
        checkIfNameExists() {
            this.name = window.localStorage.getItem('name');
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
            this.words = getWords(30);
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
