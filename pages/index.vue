<template>
    <div class="page py-8">
        <h1 class="heading text-center">Typing game</h1>
        <div
            v-if="!name"
            class="inputHolder text-center"
        >
            <input
                v-model="nameInput"
                type="text"
                class="input mb-8"
                placeholder="Enter name..."
                autofocus
                @keyup.enter="setName"
            >
            <button
                class="button"
                @click="setName"
            >
                Start
            </button>
        </div>
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
            <div class="counterHolder">
                <Counter
                    ref="counter"
                />
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
        <div class="highscore text-center mt-8">
            <h3>Highscore</h3>
            <p
                v-for="score in scores"
                :key="score.key"
            >
                {{ score.name }} - {{ score.wpm }}
            </p>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase';
import Counter from '../components/Counter.vue';
import Word from '../components/Word.vue';
import importedWords from '../utils/words';

const config = {
    apiKey: 'AIzaSyDf0dDJp_WiAcqwvrSfBmzJTgXQN5Enwa4',
    authDomain: 'typing-game-80af6.firebaseapp.com',
    databaseURL: 'https://typing-game-80af6.firebaseio.com',
    projectId: 'typing-game-80af6',
    storageBucket: 'typing-game-80af6.appspot.com',
    messagingSenderId: '786274798919',
};
firebase.initializeApp(config);

export default {
    components: {
        Counter,
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
            scores: [],
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
        this.setWords();

        const scoresRef = firebase.database().ref('scores').orderByChild('wpm').limitToLast(10);
        scoresRef.on('value', (snapshot) => {
            const scores = [];
            snapshot.forEach((child) => {
                scores.push(child.val());
            });

            this.scores = scores.reverse();
        });
    },
    methods: {
        setName() {
            if (this.nameInput.length > 0) {
                this.name = this.nameInput;
            }
        },
        restart() {
            this.started = false;
            this.ended = false;
            this.currentWord = 0;
            this.input = '';
            this.wordsCompleted = [];
            this.inputs = 0;
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
                const key = Date.now();
                firebase.database().ref(`scores/${key}`).set({
                    name: this.name,
                    wpm: this.score,
                    key,
                });
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
.inputHolder {
    width: 500px;
    margin: 0 auto;
    max-width: 100%;
    margin-bottom: 30px;
}
.input {
    padding: 8px 0;
    border-bottom: 2px solid $primaryColor;
    width: 100%;
    font-size: 20px;
    font-weight: 400;
    line-height: normal;
    &::placeholder {
        color: inherit;
        opacity: 1;
    }
}
.button {
    background-color: $primaryColor;
    padding: 14px 30px;
    font-size: 14px;
    font-weight: bold;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #fff;
}
h3 {
    color: $primaryColor;
    margin-bottom: 20px;
}
</style>
