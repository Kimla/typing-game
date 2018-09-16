<template>
    <span
        :class="{'isActive': active}"
        class="word"
    >
        <span class="wrapper">{{ word }}</span>&nbsp;
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
    },
};
</script>

<style lang="scss" scoped>
.isActive .wrapper {
    background-color: aquamarine;
}
</style>
