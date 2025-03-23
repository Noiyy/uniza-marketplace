<template>
    <div class="users-wrapper d-flex flex-column gap-24" v-if="users.length">
        <template v-for="(user, index) in users" :key="index">
            <UserItem v-if="user"
                :user-data="user"
            ></UserItem>
        </template>
    </div>

    <div class="users-wrapper no-items text-center pos-relative" v-else>
        <span> No users were found! :( </span>
        <Icon icon="game-icons:capybara" class="no-items-icon" />
    </div>
</template>

<script>
import UserItem from './UserItem.vue';
import { Icon } from '@iconify/vue';

export default {
    name: 'UsersList',

    inject: ['emitter'],
    emits: [],

    props: {
        users: {
            type: Array,
            default: []
        },
    },

    components: {
        UserItem,
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