<template>
    <div class="result text-center mt-8">
        <p class="score">Score: {{ score }} wpm</p>
    </div>
</template>

<script>
export default {
    props: {
        score: {
            type: String,
            required: true,
        },
    },
};
</script>

<style lang="scss" scoped>
.result {
    margin-bottom: 40px;
}
</style>
