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
                    type="text"
                    class="input"
                    placeholder="Enter text..."
                    @input="checkWord"
                >
            </div>
        </div>
    </div>
</template>

<script>
import Word from '../components/Word.vue';
import importedWords from '../utils/words';

export default {
    components: {
        Word,
    },
    data() {
        return {
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
            if (this.input === this.words[this.currentWord].trim()) {
                this.currentWord++;
                this.input = '';
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
}
.input {
    padding: 12px 0;
    border-bottom: 2px solid #ddd;
    width: 100%;
    font-size: 20px;
    font-weight: 400;
    &::placeholder {
        color: inherit;
        opacity: 1;
    }
}

</style>
