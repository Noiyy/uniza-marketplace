<template>
    <div class="auth">
        <AuthContent
            :mode="mode"
        ></AuthContent>
    </div>
</template>

<script>
import AuthContent from '../src/components/AuthContent.vue'

export default {
    head() {
        return {
            title: `Auth - UNIZA Marketplace`,
            meta: [
                { name: "robots", content: "noindex, nofollow" },
            ]
        }
    },

    name: "AuthView",

    props: {
        mode: {
            type: String,
            required: true
        }
    },

    components: {
        AuthContent
    },
}
</script>