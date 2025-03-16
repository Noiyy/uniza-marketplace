<template>
    <div class="share-options flex-wrap" :class="classes">
        <SEmail :share-options="emailShareOptions">
            <Icon icon="ic:outline-email" class="share-icon email" />
        </SEmail>
        <SGmail :share-options="gmailShareOptions">
            <Icon icon="mdi:gmail" class="share-icon gmail" />
        </SGmail>
        <SFacebook :share-options="fbShareOptions">
            <Icon icon="ic:baseline-facebook" class="share-icon fb" />
        </SFacebook>
        <STelegram :share-options="telegramShareOptions">
            <Icon icon="ic:baseline-telegram" class="share-icon telegram" />
        </STelegram>
        <STwitter :share-options="twitterShareOptions">
            <Icon icon="prime:twitter" class="share-icon twitter" />
        </STwitter>
        <SViber :share-options="viberShareOptions">
            <Icon icon="basil:viber-outline" class="share-icon viber" />
        </SViber>
    </div>
</template>

<script>
import { Icon } from '@iconify/vue';
import { SEmail, SFacebook, SGmail, STelegram, STwitter, SViber } from 'vue-socials';

export default {
    name: 'ShareButtons',

    inject: ['emitter'],
    emits: [],

    props: {
        classes: {
            type: String,
            default: ""
        },

        productData: {
            type: Object,
            default: null
        }
    },

    components: {
        Icon,
        SEmail, SFacebook, SGmail, STelegram, STwitter, SViber
    },

    data() {
        return {
            emailShareOptions: {
                mail: "",
                subject: "UNIZA Marketplace product",
                cc: "",
                body: "Look at this amazing product I found! https://unizamarketplace.noiyy.eu/product/67c0eb52ace7292bf8dfdec1"
            },
            gmailShareOptions: {
                to: "",
                su: "UNIZA Marketplace product",
                cc: "",
                body: "Look at this amazing product I found! https://unizamarketplace.noiyy.eu/product/67c0eb52ace7292bf8dfdec1"
            },
            fbShareOptions: {
                url: "https://unizamarketplace.noiyy.eu/product/67c0eb52ace7292bf8dfdec1",
                quote: "UNIZA Marketplace",
                hashtag: "#UNIZAMarketplace"
            },
            telegramShareOptions: {
                url: "https://unizamarketplace.noiyy.eu/product/67c0eb52ace7292bf8dfdec1",
                text: "UNIZA Marketplace"
            },
            twitterShareOptions: {
                url: "https://unizamarketplace.noiyy.eu/product/67c0eb52ace7292bf8dfdec1",
                text: "UNIZA Marketplace",
                hashtags: ['UNIZA', 'UNIZAMarketplace'],
                via: "twitterdev"
            },
            viberShareOptions: {
                url: "https://unizamarketplace.noiyy.eu/product/67c0eb52ace7292bf8dfdec1",
                text: "UNIZA Marketplace"
            }
        }
    },

    methods: {

    },
    
    computed: {
       
    },

    created() {
        document.addEventListener("click", (e) => {
            this.emitter.emit("check-share-click", e);
        });
    },

    mounted() {
        this.emitter.on("check-share-click", (e) => {
            const shareOptions = document.querySelector('.share-options');
            const shareBtn = document.querySelector(".share-btn");

            if ((shareOptions && !shareOptions.contains(e.target)) && (shareBtn && !shareBtn.contains(e.target))) {
                if (shareOptions.classList.contains("open")) shareOptions.classList.remove("open");
            }
        })
    },

    unmounted() {
        this.emitter.off("check-share-click");
    }
}
</script>

<style scoped>
.share-options {
    display: none;
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    padding: 8px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.66);
    column-gap: 8px;
    row-gap: 4px;
    min-width: 150px;
    cursor: initial;
}
.share-options.open {
    display: flex;
}

.share-icon {
    font-size: 28px;
    transition: filter 0.15s ease-in;
}
.share-icon.email { color: var(--secondary); }
.share-icon.gmail { color: var(--primary); }
.share-icon.fb { color: #1877F2; }
.share-icon.telegram { color: #24A1DE; }
.share-icon.twitter { color: var(--white); }
.share-icon.viber { color: #7360f2; }

.share-icon:hover {
    filter: brightness(0.66);
}
</style>