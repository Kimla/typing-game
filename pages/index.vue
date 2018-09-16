<template>
    <div class="page py-8">
        <div class="container">
            <h1 class="heading text-center">Typing game</h1>
            <p class="words">
                <Word
                    v-for="(word, index) in words"
                    :key="index"
                    :word="word"
                    :active="index === currentWord"
                />
            </p>
            <div class="inputHolder">
                <input
                    v-model="input"
                    :disabled="ended"
                    type="text"
                    class="input"
                    placeholder="Enter text..."
                    @input="checkWord"
                >
            </div>
            <div class="counterHolder">
                <Counter
                    ref="counter"
                />
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
        };
    },
    mounted() {
        const words = this.importedWords.split('\n').filter(word => word.length > 0);
        const choosen = [];

        for (let i = 0; i < 30; i++) {
            const number = Math.floor(Math.random() * words.length);
            choosen.push(words[number]);
        }

        this.words = choosen;
    },
    methods: {
        checkWord() {
            if (!this.started) {
                this.$refs.counter.start();
                this.started = true;
            }

            if (this.input === this.words[this.currentWord].trim()) {
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
    padding: 12px 0;
    border-bottom: 2px solid #ddd;
    width: 100%;
    font-size: 20px;
    font-weight: 400;
    line-height: normal;
    &::placeholder {
        color: inherit;
        opacity: 1;
    }
}
</style>
