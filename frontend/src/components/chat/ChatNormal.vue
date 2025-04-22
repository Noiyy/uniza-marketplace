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
        
                        <Icon icon="ic:baseline-plus" class="plus-icon" />
                    </div>
        
                    <div class="nav-chats d-flex flex-column gap-8">
                        <div class="chat-item active d-flex gap-16 align-items-center" v-for="(item, index) in [0]" :key="index">
                            <div class="user-avatar-wrapper d-flex gap-8 align-items-center">
                                <div class="user-avatar-cont pos-relative">
                                    <div class="online-indicator"></div>

                                    <img :src="getAssetUrl(`img/userAvatars/${item.avatarPath}`)" class="user-avatar" alt="User avatar" v-if="item && item.avatarPath">
                                    <div class="default-avatar-cont" v-else>
                                        <Icon icon="akar-icons:person" class="default-avatar-icon" />
                                    </div>
                                </div>
                            </div>

                            <div class="chat-item-main d-flex gap-8 align-items-center">
                                <div class="chat-info d-flex flex-column gap-8">
                                    <div class="user-name gradient-text"> Noiyy </div>
                                    <div class="latest-msg"> 
                                        <span> You: </span>
                                        Why are you not replying?
                                    </div>
                                </div>
    
                                <div class="unread-indicator"> 11 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="chat-window d-flex flex-column gap-24">
            <div class="chat-window-heading d-flex flex-column gap-8">
                <div class="heading-cont d-flex justify-content-between align-items-center gap-24">
                    <div class="d-flex gap-8 align-items-center">
                        <router-link :to="`/user/id`" class="user-avatar-wrapper d-flex gap-8 align-items-center">
                            <div class="user-avatar-cont pos-relative">
                                <div class="online-indicator"></div>
                                <div class="avatar-overlay"></div>

                                <!-- <img :src="getAssetUrl(`img/userAvatars/${item.avatarPath}`)" class="user-avatar" alt="User avatar" v-if="item && item.avatarPath"> -->
                                <div class="default-avatar-cont"> <!-- v-else -->
                                    <Icon icon="akar-icons:person" class="default-avatar-icon" />
                                </div>
                            </div>
                        </router-link>

                        <h1 class="username gradient-text">
                            Cappy
                        </h1>
                    </div>

                    <div class="d-flex gap-8 align-items-center online-cont">
                        Offline
                        <div class="online-indicator"></div>
                    </div>
                </div>

                <div class="line-divider"></div>
            </div>

            <div class="chat-window-content flex-1 d-flex flex-column">
                <div class="chat-messages flex-1 pos-relative d-flex flex-column align-items-start gap-8">

                    <div class="chat-bubble-msg">
                        <div class="time-track"> 10:27 </div>
                        Hey there man!
                    </div>

                    <div class="chat-bubble-msg self">
                        <div class="time-track"> 10:33 </div>
                        Wassup
                    </div>

                    <div class="no-messages d-flex flex-column align-items-center">
                        Seems like there are no messages yet!   
                        <span> Be the first one to say hi :) </span>
                        <Icon icon="game-icons:capybara" class="no-messages-icon" />
                    </div>
                </div>

                <div class="chat-input-wrapper d-flex justify-content-between gap-24">
                    <div class="chat-input-cont flex-1">
                        <input type="text">
                        
                        <div class="line-divider"></div>
                    </div>

                    <div class="send-icon-cont">
                        <Icon icon="mingcute:send-fill" class="send-icon" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Icon } from '@iconify/vue';

import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'ChatNormal',

    inject: ['emitter'],
    emits: [],

    props: {

    },

    components: {
        Icon
    },

    data() {
        return {
            patternImgSrc: this.getAssetUrl("img/noise_texture.png"),
        }
    },

    methods: {
        ...mapActions(
            {

            }
        ),
    },
    
    computed: {
        ...mapGetters(
            {

            }
        ),

        patternBgStyle() {
            return `
                background: url(${this.patternImgSrc}) 0% 0% / 165% 150% repeat`;
        }
    },

    created() {

    },

    mounted() {

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
}

.chat-nav .search-bar {
    border-radius: 8px;
    background-color: var(--white-5a);
    padding: 8px;
    font-size: 15px;
}

.chat-nav .search-bar input {
    background-color: transparent;
    border: none;
    padding: 0;
    outline: none;
}

.chat-nav .search-bar .search-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 4px;
    font-size: 20px;
    opacity: 0.5;
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
}

.chat-item .user-name {
    font-weight: bold;
}

.chat-item .latest-msg {
    font-size: 14px;
}

.chat-item .latest-msg span {

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
    background-color: var(--green);
    border-radius: 50%;
    position: absolute; 
    top: -2px;
    left: -2px;
}
.chat-item.active {
    background-color: var(--white-7a);
    border: 2px solid var(--white-5a);
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
</style>