<template>
    <div class="ratings-wrapper d-flex flex-column gap-24" v-if="ratings.length">
        <template v-for="(rating, index) in ratings" :key="index">
            <RatingItem v-if="rating"
                :rating-data="rating"
            ></RatingItem>
        </template>
    </div>

    <div class="ratings-wrapper no-items text-center pos-relative" v-else>
        <span> No ratings were found! :( </span>
        <Icon icon="game-icons:capybara" class="no-items-icon" />
    </div>
</template>

<script>
import RatingItem from './RatingItem.vue';
import { Icon } from '@iconify/vue';

export default {
    name: 'RatingsList',

    inject: ['axios', 'emitter'],
    emits: [],

    props: {
        ratings: {
            type: Array,
            default: []
        },
    },

    components: {
        RatingItem,
        Icon
    },

    data() {
        return {

        }
    },
}
</script>

<style scoped>

</style>