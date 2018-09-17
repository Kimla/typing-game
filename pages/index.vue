<template>
    <div class="page py-8">
        <div class="container">
            <h1 class="heading text-center">Typing game</h1>
            <p class="words">
                <Word
                    v-for="(word, index) in words"
                    :key="index"
                    :word="word"
                    :input="input"
                    :active="index === currentWord"
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
    </div>
</template>

<script>
import Counter from '../components/Counter.vue';
import Word from '../components/Word.vue';
import importedWords from '../utils/words';

export default {
    components: {
        Counter,
        Word,
    },
    data() {
        return {
            started: false,
            ended: false,
            currentWord: 0,
            input: '',
            importedWords,
            words: [],
            wordsCompleted: [],
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
            const time = this.$refs.counter.counter;
            const wordsPerSecond = this.correctWords / time;
            return parseFloat(wordsPerSecond * 60).toFixed(2);
        },
    },
    mounted() {
        this.setWords();
    },
    methods: {
        restart() {
            this.started = false;
            this.ended = false;
            this.currentWord = 0;
            this.input = '';
            this.$refs.counter.reset();
            this.setWords();
        },
        setWords() {
            const words = this.importedWords.split('\n').filter(word => word.length > 0);
            const choosen = [];

            for (let i = 0; i < 30; i++) {
                const number = Math.floor(Math.random() * words.length);
                choosen.push(words[number]);
            }

            this.words = choosen;
        },
        checkWord(event) {
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
                this.$refs.counter.stop();
                this.ended = true;
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
</style>
