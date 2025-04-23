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
                                    <h1> Chat </h1>
                                </div>
    
                                <div class="edit-options d-flex gap-32 align-items-center">
                                    <div class="nav-btns-wrapper d-flex">
                                        <button class="btn nav-btn pos-relative" 
                                            @click="showSystemChat()"
                                            :class="shownComponent === 'ChatSystem' ? 'active' : ''"
                                        > 
                                            System
                                            <!-- <div class="new-indicator"></div> -->
                                        </button>
                                        <button class="btn nav-btn pos-relative" 
                                            @click="showChat()"
                                            :class="shownComponent === 'ChatNormal' ? 'active' : ''"
                                        > 
                                            Messages
                                            <div class="new-indicator"></div>
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
                                        v-if="shownComponent === 'ChatSystem'"
                                    ></component>
                                </KeepAlive>
                            </Transition>
    
                            <Transition name="fade" mode="out-in" @after-leave="changedComponent">
                                <KeepAlive>
                                    <component :is="shownComponent"
                                        v-if="shownComponent === 'ChatNormal'"
                                     
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

// import io from 'socket.io-client';
import { state as socketState, socket } from "../../socket";

export default {
    name: 'ChatContent',

    inject: ['emitter', 'messageApi'],
    emits: [],

    props: {

    },

    components: {
        Header,
        Footer,
        ChatNormal,
        ChatSystem
    },

    data() {
        return {
            shownComponent: "ChatNormal",
            messages: []
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

        sendMessage(targetUserId, messageText) {
            console.log("hmmm");

            socket.emit('direct-message', {
                senderId: this.getLoggedUser._id,
                recipientId: targetUserId,
                content: messageText
            });
        },

        async getMsgsBetweenUsers(senderId, recipientId) {
            const resp = await this.messageApi.getMsgsBetweenUsers(senderId, recipientId);
            console.log("spravy?", resp);
        }

    },
    
    computed: {
        ...mapGetters(
            {
                getLoggedUser: "user/getUser"
            }
        ),

        socketIsConnected() { return socketState.connected; }
    },

    created() {

    },

    mounted() {
        socket.on('direct-message', (message) => {
            console.log("aha", message);
            this.messages.push(message);
        });

        this.getMsgsBetweenUsers(this.getLoggedUser._id, "68021f67f3b8990982552a0a");
        // setTimeout(() => {
        //     this.sendMessage("68021f67f3b8990982552a0a", "ahoj vikiiiii");
        // }, 1000);
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
</style>

<style>

</style>