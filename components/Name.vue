<template>
    <div class="inputHolder text-center">
        <form @submit.prevent="submitHandler">
            <input
                v-model="name"
                type="text"
                class="input mb-8"
                placeholder="Enter name..."
                autofocus
            >
            <button
                class="button"
                type="submit"
            >
                Start
            </button>
        </form>
    </div>
</template>

<script>
export default {
    data: () => ({
        name: '',
    }),
    methods: {
        submitHandler() {
            if (this.name.length > 0) {
                this.$emit('changed', this.name);
            }
        },
    },
};
</script>

<style>

</style>
