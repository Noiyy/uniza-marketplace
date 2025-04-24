<template>
    <div class="chat d-flex gap-8">
        <div class="chat-nav-cont">
            <div class="chat-nav d-flex pos-relative">
                <div class="pattern" :style="patternBgStyle"></div>
    
                <div class="chat-nav-content pos-relative">
                    <div class="nav-heading d-flex align-items-center gap-16">
                        <div class="search-bar flex-1 pos-relative">
                            <input type="text" />
                            <Icon icon="material-symbols:search" class="search-icon" />
                        </div>
        
                        <Icon icon="ic:baseline-plus" class="plus-icon" @click="showAddUserModal()"/>
                    </div>
        
                    <div class="nav-chats d-flex flex-column gap-8">
                        <div class="chat-item d-flex gap-16 align-items-center pos-relative" v-for="(user, index) in openedChatUsers" :key="index"
                            :class="user.openedWindow ? 'active' : '' "
                            @click="openChat(user)">
                            <div class="user-avatar-wrapper d-flex gap-8 align-items-center">
                                <div class="user-avatar-cont pos-relative">
                                    <span class="admin-badge-small user-badge" v-if="user.data.isAdmin"> A </span>
                                    <span class="admin-badge-small banned-badge user-badge" v-if="user.data.ban && user.data.ban.isBanned"> B </span>
                                    <div class="online-indicator" :class="user.isOnline ? 'online' : ''"></div>

                                    <img :src="getAssetUrl(`img/userAvatars/${user.data.avatarPath}`)" class="user-avatar" alt="User avatar" v-if="user.data.avatarPath">
                                    <div class="default-avatar-cont" v-else>
                                        <Icon icon="akar-icons:person" class="default-avatar-icon" />
                                    </div>
                                </div>
                            </div>

                            <div class="chat-item-main d-flex gap-8 align-items-center justify-content-between flex-1">
                                <div class="chat-info d-flex flex-column gap-8">
                                    <div class="user-name gradient-text"> {{ user.data.username }} </div>
                                    <div class="latest-msg"> 
                                        <span v-if="user.latestMsg.content && user.latestMsg.sender != 'self'"> You: </span>
                                        {{ user.latestMsg ? user.latestMsg.content : "" }}
                                    </div>
                                </div>
    
                                <div class="unread-indicator" v-if="user.unreadCount"> {{ user.unreadCount }} </div>
                            </div>

                            <div class="chat-item-remove" @click.prevent.stop="removeUserFromChat(user)">
                                <Icon icon="mdi:remove" class="remove-icon" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Okno so správami -->
        <div class="chat-window d-flex flex-column">
            <div class="chat-window-heading d-flex flex-column gap-8" v-if="activeUser">
                <div class="heading-cont d-flex justify-content-between align-items-center gap-24">
                    <div class="d-flex gap-8 align-items-center">
                        <router-link :to="`/user/${activeUser.data._id}`" class="user-avatar-wrapper d-flex gap-8 align-items-center">
                            <div class="user-avatar-cont pos-relative">
                                <div class="avatar-overlay"></div>

                                <img :src="getAssetUrl(`img/userAvatars/${activeUser.data.avatarPath}`)" class="user-avatar" alt="User avatar" v-if="activeUser.data.avatarPath">
                                <div class="default-avatar-cont" v-else>
                                    <Icon icon="akar-icons:person" class="default-avatar-icon" />
                                </div>
                            </div>
                        </router-link>

                        <h1 class="username gradient-text">
                            {{ activeUser.data.username }}
                        </h1>
                    </div>

                    <div class="d-flex gap-8 align-items-center online-cont" :class="activeUser.isOnline ? 'online' : ''">
                        {{ activeUser.isOnline ? 'Online' : 'Offline' }}
                        <div class="online-indicator" ></div>
                    </div>
                </div>

                <div class="line-divider"></div>
            </div>

            <div class="chat-window-content flex-1 d-flex flex-column">
                <div class="chat-messages pos-relative d-flex flex-column align-items-start gap-8">
                    <template v-if="activeUser">
                        <template v-for="(msg, index) in activeMessages[activeUser.data._id]" :key="index">
                            <div class="chat-bubble-msg" 
                                :class="msg.sender == getLoggedUser._id ? 'self' : ''">

                                <div class="new-msg-marker" v-if="msg.sender != getLoggedUser._id && !msg.seenAt"></div>
                                <div class="time-track"> {{ isoToDayTime(msg.timestamp) }} </div>
                                {{ msg.content }}
                            </div>
                        </template>
    
                        <div class="no-messages d-flex flex-column align-items-center" v-if="!activeMessages[activeUser.data._id] || !activeMessages[activeUser.data._id].length">
                            Seems like there are no messages yet!   
                            <span> Be the first one to say hi :) </span>
                            <Icon icon="game-icons:capybara" class="no-messages-icon" />
                        </div>
                    </template>

                    <div class="no-selected-chat d-flex align-items-center justify-content-center text-center" v-else>
                        Select a chat to send & view messages
                    </div>
                </div>

                <form class="chat-input-wrapper d-flex justify-content-between gap-24" @submit.prevent="null">
                    <div class="chat-input-cont flex-1">
                        <input type="text" v-model="msgToSend" :disabled="!activeUser ? true : false">
                        
                        <div class="line-divider"></div>
                    </div>

                    <button type="submit" class="send-icon-cont" @click.prevent="sendMessage()" :class="!activeUser ? 'disabled' : ''">
                        <Icon icon="mingcute:send-fill" class="send-icon" />
                    </button>
                </form>
            </div>
        </div>

        <!-- Add user to chat modal -->
        <Modal
            v-model:is-shown="isShowAddUserModal"
            :header-text="`Add user to chat`"
            :modal-id="'add-user-chat-modal'"
            @close="closeAddUserModal">
            <template #body>
                <div class="add-user-body d-flex flex-column gap-32">
                    <div class="input-cont d-flex flex-column gap-8 flex-1">
                        <div class="input-tag"> User </div>
                        <Multiselect
                            v-model="userToAdd"
                            :options="availableUsersToAdd"
                            :allow-empty="true"
                            :multiple="false"
                            :show-labels="false"
                            :track-by="'_id'"
                            @search-change="onUserSearchChange" 
                            :internal-search="false"
                            >
                            <template #option="props">
                                <div class="user-avatar-wrapper d-flex gap-8 align-items-center">
                                    <div class="user-avatar-cont pos-relative">
                                        <img :src="getAssetUrl(`img/userAvatars/${props.option.avatarPath}`)" class="user-avatar" alt="User avatar" v-if="props.option.avatarPath">
                                        <div class="default-avatar-cont" v-else>
                                            <Icon icon="akar-icons:person" class="default-avatar-icon" />
                                        </div>
                                    </div>
                                    <div class="user-name text-center">
                                        {{ props.option.username }}
                                        <span class="admin-badge-small" v-if="props.option.isAdmin"> Admin </span>
                                        <span class="admin-badge-small banned-badge" v-if="props.option.ban && props.option.ban.isBanned"> Banned </span>
                                    </div>
                                </div>
                            </template>
                            <template #singleLabel="props">
                                <div class="user-avatar-wrapper d-flex gap-8 align-items-center">
                                    <div class="user-avatar-cont pos-relative">
                                        <img :src="getAssetUrl(`img/userAvatars/${props.option.avatarPath}`)" class="user-avatar" alt="User avatar" v-if="props.option.avatarPath">
                                        <div class="default-avatar-cont" v-else>
                                            <Icon icon="akar-icons:person" class="default-avatar-icon" />
                                        </div>
                                    </div>
                                    <div class="user-name text-center">
                                        {{ props.option.username }} 
                                        <span class="admin-badge-small" v-if="props.option.isAdmin"> Admin </span>
                                        <span class="admin-badge-small banned-badge" v-if="props.option.ban && props.option.ban.isBanned"> Banned </span>
                                    </div>
                                </div>
                            </template>
                        </Multiselect>
                    </div>

                    <div class="btns-wrapper justify-content-end d-flex gap-24">
                        <button class="btn primary" @click="addUserToChat()"> Add </button>
                        <button class="btn secondary" @click="closeAddUserModal()"> Cancel </button>
                    </div>
                </div>
            </template>
        </Modal>
    </div>
</template>

<script>
import { Icon } from '@iconify/vue';

import Multiselect from 'vue-multiselect';
import "vue-multiselect/dist/vue-multiselect.min.css";

import { mapGetters, mapActions } from 'vuex';
import Modal from '../Modal.vue';

import { socket, state as socketState } from '../../socket';

export default {
    name: 'ChatNormal',

    inject: ['emitter', 'userApi', 'messageApi'],
    emits: ['has-unread'],

    props: {

    },

    components: {
        Multiselect,
        Modal,
        Icon
    },

    data() {
        return {
            patternImgSrc: this.getAssetUrl("img/noise_texture.png"),
            isShowAddUserModal: false,

            userToAdd: null,
            allUsers: [],
            availableUsersToAdd: [],

            onlineUsers: [],
            openedChatUsers: [],

            activeMessages: {},
            activeUser: null,
            msgToSend: "",

            openedToUserOnStart: false,
            seenAtInterval: null
        }
    },

    methods: {
        ...mapActions(
            {
                storeAddUserToChat: "user/addUserToChat",
                storeRemoveUserFromChat: "user/removeUserFromChat"
            }
        ),

        showAddUserModal() {
            this.isShowAddUserModal = true;
        },

        closeAddUserModal() {
            this.isShowAddUserModal = false;
            this.userToAdd = null;
        },

        async addUserToChat() {
            if (!this.userToAdd) {
                this.$toast.error("InvalidSelectedUserToAddChat");
                return;
            }
            this.emitter.emit("show-loader");

            const resp = await this.userApi.addUserToChat(this.getLoggedUser._id, this.userToAdd._id);
            console.log("did?", resp);
            if (resp.data.success) {
                this.storeAddUserToChat(resp.data.addedUserId);
                console.log("hm", this.getLoggedUser);
                this.getAvailableUsersToAdd();
                this.setupChatUsersData(resp.data.addedUserId);
                this.closeAddUserModal();
            }

            this.emitter.emit("hide-loader");
        },

        async removeUserFromChat(user) {
            if (!user) return;
            this.emitter.emit("show-loader");

            const resp = await this.userApi.removeUserFromChat(this.getLoggedUser._id, user.data._id);
            console.log("did?", resp);
            if (resp.data.success) {
                this.storeRemoveUserFromChat(resp.data.removedUserId);
                console.log("hm", this.getLoggedUser);
                this.getAvailableUsersToAdd();
                this.openedChatUsers = this.openedChatUsers.filter(usr => usr.data._id != resp.data.removedUserId);
            }

            this.emitter.emit("hide-loader");
        },

        async openChat(user) {
            if (user.openedWindow) return;

            if (this.seenAtInterval) clearInterval(this.seenAtInterval);

            this.openedChatUsers.forEach(usr => usr.openedWindow = false);
            user.openedWindow = true;

            const messages = await this.messageApi.getMsgsBetweenUsers(this.getLoggedUser._id, user.data._id);
            this.activeMessages[user.data._id] = messages.data;
            this.activeUser = user;
            this.msgToSend = "";
            // console.log("active messages", this.activeMessages);

            const msgsToSetRead = this.activeMessages[user.data._id].filter(msg => msg.recipient == this.getLoggedUser._id && !msg.seenAt);

            // nastav správy ako videné po 5s
            if (msgsToSetRead && msgsToSetRead.length) this.setMessagesAsRead(msgsToSetRead);

            // scroll uplne dole keď su viacere spravy
            this.$nextTick(() => {
                const chatMsgEl = document.querySelector(".chat-messages");
                chatMsgEl.scrollTop = chatMsgEl.scrollHeight;
            });
        },

        async setMessagesAsRead(msgs) {
            this.seenAtInterval = setTimeout(async () => {
                this.seenAtInterval = null;
                console.log("dp", msgs);

                if (msgs && msgs.length) {
                    const resp = await this.messageApi.markMsgsAsSeen(msgs, this.getLoggedUser._id);
                    console.log("did mark?", resp);
                    if (resp.data.success) {
                        const updatedMsgs = resp.data.updatedMsgs;
                        let senderId;

                        msgs.forEach(msg => {
                            senderId = msg.sender;
                            const match = updatedMsgs.find(msgg => msgg._id === msg._id);
                            if (match) {
                                msg.seenAt = match.seenAt;
                            }
                        })

                        const chatToUpdate = this.openedChatUsers.find(usr => usr.data._id == senderId);
                        chatToUpdate.unreadCount = 0;

                        console.log("updated msgs?", msgs);
                        console.log(this.activeMessages[this.activeUser.data._id]);
                    }
                }
            }, 5000);
        },

        onUserSearchChange() {

        },

        async getAvailableUsersToAdd() {
            const resp = await this.userApi.getAllUsers();
            this.allUsers = resp.data;

            let allOtherUsers = resp.data.filter(usr => usr._id != this.getLoggedUser._id && !usr.ban);
            this.availableUsersToAdd = allOtherUsers.filter(usr => !this.getLoggedUser.openedChats.includes(usr._id));
            console.log("aval to add", this.availableUsersToAdd);
        },

        async setupChatUsersData(addedUserId) {
            const onlineResp = await this.messageApi.getOnlineUsers();
            this.onlineUsers = onlineResp.data;
            // this.onlineUsers = [...socketState.onlineUsers];
            console.log("online?", this.onlineUsers);

            const users = this.getLoggedUser.openedChats.map(usrId => this.allUsers.find(usr => usr._id == usrId));
            if (!addedUserId) {
                this.openedChatUsers = users.map(usr => ({
                    data: usr,
                    openedWindow: false,
                    unreadCount: 0,
                    isOnline: this.onlineUsers.includes(usr._id),
                    latestMsg: { content: "‎", sender: "self" }
                }));
            } else {
                const usr = users.find(usr => usr._id == addedUserId);
                this.openedChatUsers.push({
                    data: usr,
                    openedWindow: false,
                    unreadCount: 0,
                    isOnline: this.onlineUsers.includes(usr._id),
                    latestMsg: { content: "‎", sender: "self" }
                });
            }

            let anyHasUnread = false;
            this.openedChatUsers.forEach(async (usr) => {
                if (addedUserId) usr.isOnline = this.onlineUsers.includes(usr._id);

                const resp = await this.messageApi.getUnreadMsgsFromUser(this.getLoggedUser._id, usr.data._id);
                usr.unreadCount = resp.data.length;
                if (usr.unreadCount) anyHasUnread = true;

                const latestMsg = await this.messageApi.getLatestMsgFromUser(this.getLoggedUser._id, usr.data._id);
                usr.latestMsg = { 
                    content: latestMsg.data.content, 
                    sender: latestMsg.data.sender == usr.data._id ? "self" : "other"
                };

                if (this.userToOpen && !this.openedToUserOnStart && usr.data._id == this.userToOpen) {
                    this.openedToUserOnStart = true;
                    this.openChat(usr);
                }
            });

            this.$emit("has-unread", anyHasUnread)
            console.log("opened chats", this.openedChatUsers);
        },

        sendMessage() {
            if (!this.activeUser) return;

            console.log("send");

            socket.emit('direct-message', {
                senderId: this.getLoggedUser._id,
                recipientId: this.activeUser.data._id,
                content: this.msgToSend
            });

            this.$nextTick(() => {
                this.msgToSend = "";
            });
        }
    },
    
    computed: {
        ...mapGetters(
            {
                getLoggedUser: "user/getUser"
            }
        ),

        patternBgStyle() {
            return `
                background: url(${this.patternImgSrc}) 0% 0% / 165% 150% repeat`;
        },

        userToOpen() {
            return this.$route.query.openUserId;
        }
    },

    created() {
        socket.on("new-message", (message) => {
            console.log("hello");
            if (this.activeUser) {
                if ([message.sender, message.recipient].includes(this.activeUser.data._id)) {
                    this.activeMessages[this.activeUser.data._id].push(message);
                    // scroll to bottom
                    this.$nextTick(() => {
                        const chatMsgEl = document.querySelector(".chat-messages");
                        chatMsgEl.scrollTop = chatMsgEl.scrollHeight;
                    });

                    this.setMessagesAsRead([this.activeMessages[this.activeUser.data._id].find(msg => msg._id == message._id)]);
                }
            }
        });

        this.emitter.on("update-onlineUsers", async () => {
            const onlineResp = await this.messageApi.getOnlineUsers();
            this.onlineUsers = onlineResp.data;
            this.openedChatUsers.forEach(usr => {
                usr.isOnline = this.onlineUsers.includes(usr.data._id);
            });
        });
    },

    async mounted() {
        this.emitter.emit("show-loader");

        await this.getAvailableUsersToAdd();
        this.setupChatUsersData();

        this.emitter.emit("hide-loader");
    },

    unmounted() {
        if (this.seenAtInterval) clearInterval(this.seenAtInterval);
    }
}
</script>

<style scoped>
.chat-nav {
    flex: 1;
    height: 100%;
}

.chat-window {
    flex: 2;
}


.chat-nav .pattern {
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    border-radius: 16px; /* 96px */
}
.chat-nav .pattern::before {
    content: "";
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 16px; /* 6px */

    background: rgba(26, 21, 18, 0.96);
    backdrop-filter: blur(18px);
}

.chat {
    min-height: 60vh;
    max-height: 60vh;
    border-radius: 8px;
}

.chat-nav-cont {
    padding: 1px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(255, 154, 158, 0.5) 0%, rgba(255, 154, 158, 0) 100%);
}
.chat-nav-cont .chat-nav {
    /* border-radius: 16px; */
    padding: 15px;
    position: relative;
}

.chat-nav-content {
    z-index: 2;
}

.chat-nav .plus-icon {
    font-size: 32px;
    transition: transform 0.15s ease-in;
}
.chat-nav .plus-icon:hover {
    cursor: pointer;
    transform: scale(1.2);
}

.chat-nav .search-bar {
    border-radius: 8px;
    background-color: var(--white-5a);
    padding: 8px;
    font-size: 15px;
    border: 2px solid transparent;
    transition: border 0.15s ease-in;
}

.chat-nav .search-bar input {
    background-color: transparent;
    border: 0;
    padding: 0;
    outline: none;
    width: 100%;
}

.chat-nav .search-bar:has(input:focus-within) {
    border: 2px solid var(--white-15a); 
}

.chat-nav .search-bar .search-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 4px;
    font-size: 20px;
    opacity: 0.5;
    user-select: none;
    pointer-events: none;
}

.user-avatar-wrapper:hover {
    color: var(--white);
}

.user-avatar-cont, .default-avatar-cont {
    flex: 1;
    width: 48px;
    height: 48px;
    max-width: 48px;
    max-height: 48px;
    border-radius: 50%;
    display: flex;
}
.user-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    aspect-ratio: 1 / 1;
}

.default-avatar-cont {
    font-size: 28px;
    background: var(--white-7a);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.nav-chats {
    margin-top: 16px;
}

.chat-item {
    padding: 8px;
    border: 2px solid transparent;
    border-radius: 16px;
    transition: background-color 0.15s ease-in;
}
.chat-item:hover {
    cursor: pointer;
    background-color: var(--white-2a);
}

.chat-item .user-name {
    font-weight: bold;
}

.chat-item .latest-msg {
    font-size: 14px;
}

.chat-item .latest-msg span {
    opacity: 0.5;
}

.chat-item .unread-indicator {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: 900;
    background-color: var(--red);
    /* color: var(--black); */
}

.chat-item .online-indicator {
    width: 16px;
    height: 16px;
    border: 4px solid var(--black);
    background-color: var(--white-50a);
    border-radius: 50%;
    position: absolute; 
    top: -2px;
    left: -2px;
}
.chat-item .online-indicator.online {
    background-color: var(--green);
}

.chat-item .user-badge {
    position: absolute;
    bottom: 0;
    left: 0;
}

.chat-item.active {
    background-color: var(--white-7a);
    border: 2px solid var(--white-5a);
}

.chat-item .chat-item-remove {
    position: absolute;
    top: -2px;
    right: -2px;
    opacity: 0;
    background-color: var(--white-15a);
    border-radius: 50%;
    padding: 2px;
    transition: opacity 0.1s ease-in;
}

.chat-item:hover .chat-item-remove {
    opacity: 0.35;
}

.chat-item .chat-item-remove:hover {
    opacity: 0.66;
}

.add-user-body .input-cont {
    margin-top: 32px;
}


.chat-window {
    max-height: 100%;
    overflow: hidden;
}

.chat-window .user-avatar-wrapper:hover .avatar-overlay {
    opacity: 1;
}

.chat-window .avatar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.33);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.15s ease-in;
}

.chat-window .chat-input-wrapper {
    padding: 16px;
    background-color: var(--white-2a);
    border-radius: 16px;
}

.chat-window .send-icon-cont {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: var(--white);
    cursor: pointer;
    border: none;
    transition: filter 0.15s ease-in;
}
.chat-window .send-icon-cont:hover {
    filter: brightness(0.75)
}

.chat-window .send-icon-cont.disabled {
    opacity: 0.33;
    cursor: not-allowed;
}
.chat-window .send-icon-cont.disabled:hover {
    filter: initial;
}

.chat-window .send-icon {
    color: var(--black);
    font-size: 32px;
}

.chat-window .chat-input-wrapper input {
    background-color: transparent;
    outline: none;
    border: none;
    padding: 0;
    width: 100%;
    height: 100%;
}

.chat-window .chat-input-wrapper .line-divider {
    background-color: var(--white-33a);
}

.chat-window .no-messages {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    line-height: 100%;
    gap: 4px;
}

.chat-window .no-messages span {
    opacity: 0.5;
}

.chat-window .no-messages .no-messages-icon {
    color: var(--white-5a);
    font-size: 128px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.chat-window .username {
    font-weight: bold;
    font-size: 18px;
}

.chat-window .online-cont {
    font-weight: bold;
    color: var(--white-50a);
}

.chat-window .online-cont .online-indicator {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: var(--black);
    border: 4px solid var(--white-50a);
}

.chat-window .online-cont.online {
    color: var(--green);
}

.chat-window .online-cont.online .online-indicator {
    background-color: var(--green);
    border-color: var(--green);
}

.chat-window .chat-bubble-msg {
    position: relative;
    background-color: var(--white-15a);
    padding: 8px 16px;
    border-radius: 16px;
    border-bottom-left-radius: 0;
    display: inline;
    position: relative;
    font-size: 15px;
    line-height: 100%;
}

.chat-window .chat-bubble-msg .time-track {
    position: absolute;
    top: -18px;
    left: 0;
    font-size: 13px;
    opacity: 0.33;
}

.chat-window .chat-bubble-msg.self {
    align-self: flex-end;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 0;
    background-color: var(--primary);
    color: var(--black);
}

.chat-window .chat-bubble-msg.self .time-track {
    left: initial;
    right: 0;
    color: var(--white);
}

.chat-window .chat-bubble-msg .new-msg-marker {
    width: 4px;
    height: 4px;
    background-color: var(--red);
    border-radius: 50%;
    left: 0;
    top: 0px;
    position: absolute;
}

.chat-window .no-selected-chat {
    font-size: 14px;
    font-weight: 200;
    opacity: 0.75;
    width: 100%;
    height: 100%;
}

.chat-window .chat-window-content {
    overflow: hidden;
}

.chat-window .chat-messages {
    overflow: auto;
    min-width: 0;
    flex-grow: 1;
    height: 100%;
    padding: 32px 0 8px 0;
}
</style>