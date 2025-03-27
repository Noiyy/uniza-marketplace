<template>
    <div class="modal-el" :id="modalId" :class="isShown ? 'shown' : ''">
        <div class="modal-el-content d-flex flex-column">
            <div class="modal-el-header d-flex align-items-center justify-content-between" :class="headerClass">
                <slot name="header">
                    <h2> {{ headerText }} </h2>
                    <Icon icon="mdi:close" class="close-icon" @click="closeModal" />
                </slot>
            </div>
            <div class="modal-el-body" :class="bodyClass">
                <slot name="body"></slot>
            </div>
            <div class="modal-el-footer" :class="footerClass" v-if="$slots['footer']">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script>
import { Icon } from '@iconify/vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'Modal',

    inject: ['emitter'],
    emits: ['close', 'update:isShown'],

    props: {
        isShown: {
            type: Boolean,
            default: false
        },
        headerText: {
            type: String,
            default: "Heading"
        },
        modalId: {
            type: String,
            default: "modalEl"
        },
        headerClass: {
            type: String,
            default: ""
        },
        bodyClass: {
            type: String,
            default: ""
        },
        footerClass: {
            type: String,
            default: ""
        }
    },

    components: {
        Icon
    },

    data() {
        return {

        }
    },

    methods: {
        ...mapActions(
            {

            }
        ),

        closeModal() {
            this.$emit("update:isShown", false);
            this.$emit("close");
        }
    },
    
    computed: {
        ...mapGetters(
            {

            }
        ),
    },

    created() {

    },

    mounted() {
        window.onclick = (event) => {
            const modalEl = document.getElementById(this.modalId);
            if (event.target == modalEl) {
                this.closeModal();
            }
        }
    }
}
</script>

<style scoped>
.modal-el {
    display: none;
    position: fixed;
    z-index: 50;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    /* padding-top: 100px; */
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.55);

    justify-content: center;
    align-items: center;
}
.modal-el.shown {
    display: flex;
}

.modal-el-content {
    position: relative;
    background-color: var(--black);
    width: 80%;
    /* margin: auto; */
    box-shadow: 0 4px 8px 0 rgba(255, 255, 255, 0.2), 0 6px 20px 0 rgba(255, 255, 255, 0.2);
    -webkit-animation-name: animatetop;
    -webkit-animation-duration: 0.6s;
    animation-name: animatetop;
    animation-duration: 0.6s;
    z-index: 1;
}

.modal-el-header {
    padding: 16px;
    background-color: var(--white-5a);
}

.modal-el-header .close-icon {
    font-size: 32px;
    transition: transform 0.2s ease-in;
    cursor: pointer;
}
.modal-el-header .close-icon:hover {
    transform: rotate(90deg);
}

.modal-el-header h2 {
    font-weight: bold;
}

.modal-el-body {
    padding: 24px;
}

.modal-el-footer {
    padding: 24px;
}

@-webkit-keyframes animatetop {
  from {top:-300px; opacity:0} 
  to {top:0; opacity:1}
}

@keyframes animatetop {
  from {top:-300px; opacity:0}
  to {top:0; opacity:1}
}
</style>