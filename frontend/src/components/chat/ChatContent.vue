<template>
    <div class="chat-content content-wrapper">
        <Header></Header>

        <section id="chat">
            <div class="container">
                <div class="content">

                    <div class="chat-wrapper">
                        <div class="chat-info-heading-cont d-flex flex-column gap-8">
                            <div class="chat-info-heading d-flex justify-content-between gap-24 align-items-center">
                                <div class="chat-heading-cont d-flex">
                                    <h1> {{ shownComponent === 'ChatNormal' ? $t("Chat") : $t('Notifications') }} </h1>
                                </div>
    
                                <div class="edit-options d-flex gap-32 align-items-center">
                                    <div class="nav-btns-wrapper d-flex">
                                        <button class="btn nav-btn pos-relative" 
                                            @click="showSystemChat()"
                                            :class="shownComponent === 'ChatSystem' ? 'active' : ''"
                                        > 
                                            {{ $t('System') }}
                                            <div class="new-indicator" v-if="systemHasUnread"></div>
                                        </button>
                                        <button class="btn nav-btn pos-relative" 
                                            @click="showChat()"
                                            :class="shownComponent === 'ChatNormal' ? 'active' : ''"
                                        > 
                                            {{ $t('Messages') }}
                                            <div class="new-indicator" v-if="chatHasUnread"></div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="line-divider"></div>
                        </div>

                        <div class="chat-main">
                            <Transition name="fade" mode="out-in" @after-leave="changedComponent">
                                <KeepAlive>
                                    <component :is="shownComponent"
                                        @hasUnread="(flag) => shownComponent === 'ChatSystem' ?
                                            systemHasUnread = flag :
                                            chatHasUnread = flag"
                                    ></component>
                                </KeepAlive>
                            </Transition>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <Footer></Footer>
    </div>
</template>

<script>
import Header from '../Header.vue';
import Footer from '../Footer.vue';
import ChatNormal from './ChatNormal.vue';
import ChatSystem from './ChatSystem.vue';

import { mapGetters, mapActions } from 'vuex';

// import { state as socketState, socket } from "../../socket";

export default {
    name: 'ChatContent',

    inject: ['emitter', 'messageApi'],
    emits: [],

    props: {
        chatMode: {
            type: String,
            default: "chat"
        }
    },

    components: {
        Header,
        Footer,
        ChatNormal,
        ChatSystem
    },

    data() {
        return {
            shownComponent: this.chatMode == "chat" ? "ChatNormal" : "ChatSystem",
            chatHasUnread: false,
            systemHasUnread: false,
        }
    },

    methods: {
        ...mapActions(
            {

            }
        ),

        showSystemChat() {
            if (this.shownComponent === "ChatSystem") return;
            this.shownComponent = 'ChatSystem';
        },

        showChat() {
            if (this.shownComponent === "ChatNormal") return;
            this.shownComponent = 'ChatNormal';
        },

        changedComponent() {
            this.emitter.emit("loaded-chat-component", this.shownComponent);
        },
    },
    
    computed: {
        ...mapGetters(
            {
                getLoggedUser: "user/getUser",
                getUnreadMsgsCount: "user/getUnreadCount",
                getUnreadNotiCount: "user/getUnreadNotiCount"
            }
        ),
    },

    created() {

    },

    mounted() {
        this.chatHasUnread = this.getUnreadMsgsCount ? true : false;
        this.systemHasUnread = this.getUnreadNotiCount ? true : false;
    },
}
</script>

<style scoped>
.chat-wrapper {
    margin-top: 48px;
}


.chat-heading-cont h1 {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 32px;
}

.chat-main {
    margin-top: 24px;
}

.nav-btn .new-indicator {
    width: 8px;
    height: 8px;
    background-color: var(--red);
    border-radius: 50%;
    position: absolute;
    top: -4px;
    right: 0;
}

/* SMALL - Mobile */
@media(max-width: 640px) { 
    .chat-wrapper {
        margin-top: 32px;
        overflow-x: hidden;
    }

    .chat-heading-cont h1 {
        font-size: 18px;
    }

    .chat-main {
        margin-top: 12px;
    }
}

/* MEDIUM - Tablet */
@media(min-width: 641px) and (max-width: 992px) { 

}
</style>

<style>

</style>