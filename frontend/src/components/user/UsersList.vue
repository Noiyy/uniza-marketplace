<template>
    <div class="users-wrapper d-flex flex-column gap-24" v-if="users.length">
        <template v-for="(user, index) in users" :key="index">
            <UserItem v-if="user"
                :user-data="user"
                @show-ban-modal="showBanModal"
            ></UserItem>
        </template>
    </div>

    <div class="users-wrapper no-items text-center pos-relative" v-else>
        <span> No users were found! :( </span>
        <Icon icon="game-icons:capybara" class="no-items-icon" />
    </div>

    <!-- Ban modal -->
     <Modal
        v-model:is-shown="isShowBanModal"
        :header-text="`Ban user`"
        :modal-id="'ban-modal'"
        @close="closeBanModal">
        <template #body>
            <div class="ban-modal-body d-flex flex-column gap-32" v-if="userToBan">
                <div class="ban-user-name">
                    <i> Username:</i> <span> {{ userToBan.username }} </span>
                </div>

                <div class="input-cont d-flex flex-column gap-8">
                    <div class="input-tag"> Reason </div>
                    <textarea v-model="banReason" type="text" class="styled" :placeholder="'Reason'"></textarea>
                </div>

                <div class="btns-wrapper justify-content-end d-flex gap-24">
                    <button class="btn primary" @click="banUser()"> Ban </button>
                    <button class="btn secondary" @click="closeBanModal()"> Cancel </button>
                </div>
            </div>
        </template>
    </Modal>
</template>

<script>
import Modal from '../Modal.vue';
import UserItem from './UserItem.vue';
import { Icon } from '@iconify/vue';

export default {
    name: 'UsersList',

    inject: ['emitter', 'userApi'],
    emits: [],

    props: {
        users: {
            type: Array,
            default: []
        },
    },

    components: {
        UserItem,
        Modal,
        Icon
    },

    data() {
        return {
            isShowBanModal: false,
            userToBan: null,
            banReason: ""
        }
    },

    methods: {
        showBanModal(userData) {
            this.isShowBanModal = true;
            this.userToBan = userData;
        },

        closeBanModal() {
            this.isShowBanModal = false;
            this.userToBan = null;
            this.banReason = "";
        },

        async banUser() {
            this.emitter.emit("show-loader");

            const resp = await this.userApi.banUser(this.userToBan._id, this.banReason);
            console.log(resp);
            if (resp.data.success) {
                this.$toast.success("UserBanSuccess");
                this.closeBanModal();
                this.emitter.emit("user-ban-success");
            } else {
                this.$toast.error("UserBanFailed");
            }

            this.emitter.emit("hide-loader");
        }
    }
}
</script>

<style scoped>
.ban-modal-body .ban-user-name i {
    font-weight: 300    ;
}

.ban-modal-body .ban-user-name span {
    padding: 0 16px;
}

.ban-modal-body textarea {
    min-height: 75px;
    max-height: 30vh;
}
</style>