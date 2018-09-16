<template>
    <div class="counter text-center">
        {{ counter }}
    </div>
</template>

<script>
export default {
    data() {
        return {
            counter: 0,
            interval: false,
        };
    },
    methods: {
        start() {
            this.interval = setInterval(() => this.counter++, 1000);
        },
        stop() {
            clearInterval(this.interval);
        },
        reset() {
            this.counter = 0;
        },
    },
};
</script>

<style lang="scss" scoped>
.counter {
    font-size: 26px;
}
</style>
