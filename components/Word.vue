<template>
    <span
        :class="{
            'isActive': active,
            'isCompletedCorrect': completedCorrect,
            'isCompletedInvalid': completedInvalid,
        }"
        class="word"
    >
        <span class="wrapper">
            <span
                v-for="(char, index) in characters"
                :key="index"
                :class="{
                    'isValid': active && char === input[index],
                    'isInvalid': active && input[index] && char !== input[index],
                }"
                class="char"
            >{{ char }}</span>
        </span>&nbsp;
    </span>
</template>

<script>
export default {
    props: {
        word: {
            type: String,
            required: true,
        },
        active: {
            type: Boolean,
            required: true,
        },
        input: {
            type: String,
            required: true,
        },
        completedCorrect: {
            type: Boolean,
            required: true,
        },
        completedInvalid: {
            type: Boolean,
            required: true,
        },
    },
    computed: {
        characters() {
            return this.word.split('');
        },
    },
};
</script>

<style lang="scss" scoped>
.isActive .wrapper {
    background-color: #fc83ff6b;
}
.isValid {
    color: #fff;
}
.isInvalid {
    color: #fb2121
}
.isCompletedCorrect {
    color: #009688;
}
.isCompletedInvalid {
    color: #F44336;
}
</style>
