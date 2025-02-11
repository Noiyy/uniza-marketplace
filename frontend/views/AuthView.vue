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
            title: `UNIZA Marketplace`,
            meta: [
                { name: "robots", content: "noindex, nofollow" },
            ]
        }
    },

    name: "404-PageNotFound",

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