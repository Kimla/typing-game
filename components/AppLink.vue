<template>
    <component
        :is="typeOfElement(url)"
        :class="classes"
        :target="target"
        v-bind="setUrlAttr(url)"
        v-html="title"
    />
</template>

<script>
import { baseUrl } from '../utils/config';
import { makeUrlRelative } from '../utils/helpers';

export default {
    props: {
        url: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: '',
        },
        target: {
            type: String,
            default: '',
        },
        classes: {
            type: String,
            default: '',
        },
    },
    methods: {
        setUrlAttr(url) {
            if (url.indexOf(baseUrl) !== -1) {
                return { to: makeUrlRelative(url) };
            }

            return { href: url };
        },
        typeOfElement(url) {
            if (url.indexOf(baseUrl) !== -1) {
                return 'nuxt-link';
            }

            return 'a';
        },
    },
};
</script>
