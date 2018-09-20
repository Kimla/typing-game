<template>
    <div class="scoreLists">
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
import ScoreList from './ScoreList.vue';
import db from '../utils/firebase';

export default {
    components: {
        ScoreList,
    },
    data: () => ({
        highScores: [],
        latestScores: [],
    }),
    mounted() {
        this.initHighScore();
        this.initLatestScore();
    },
    methods: {
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
    },
};
</script>

<style lang="scss" scoped>

</style>
