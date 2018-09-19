<template>
    <div class="scoreList text-center">
        <h3 class="heading">Highscore</h3>
        <p
            v-for="score in scores"
            :key="score.key"
        >
            {{ score.name }} - {{ score.wpm }}
        </p>
    </div>
</template>

<script>
export default {
    props: {
        heading: {
            type: String,
            required: true,
        },
        scores: {
            type: Array,
            required: true,
        },
    },
};
</script>

<style lang="scss" scoped>
.heading {
    color: $primaryColor;
    margin-bottom: 20px;
}
</style>
