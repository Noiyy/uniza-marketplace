<template>
    <div class="loader-wrapper justify-content-center align-items-center">
        <BounceLoader :loading="true" :color="'var(--secondary)'" :size="'128px'"></BounceLoader>  
    </div>
</template>

<script>
import { BounceLoader } from 'vue-spinner/dist/vue-spinner.min.js'

export default {
    name: 'Loader',

    components: {
        BounceLoader
    },
}
</script>

<style scoped>
.loader-wrapper{
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.66);
    z-index: 100;
}
</style>