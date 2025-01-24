<template>
    <div class="navLang" @click="showOtherLangs" :class="forSidebar ? 'in-sidebar' : null">
        <div class="lang-item selected">
            {{ activeLangItem.locale.toUpperCase() }}
            <Icon icon="mdi:tick" v-if="openedOtherLangs" class="lang-tick" />
        </div>

        <div class="other-langs">
            <div class="lang-item" v-for="langItem in nonActiveLangItems" :key="langItem.locale"
                @click="changeLang(langItem.locale)">
                {{ langItem.locale.toUpperCase() }}
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Icon } from '@iconify/vue';

export default {
    name: 'LangSelector',

    inject: ['emitter'],
    emits: [],

    props: {
        forSidebar: {
            type: Boolean,
            default: false
        }
    },

    components: {
        Icon
    },

    data() {
        return {
            openedOtherLangs: false,

            langItems: [
                {
                    locale: "en",
                    active: true,
                },
                {
                    locale: "sk",
                },
            ],
        }
    },

    methods: {
        ...mapActions(
            {

            }
        ),

        showOtherLangs() {
            const cont = document.querySelector('.other-langs');
            cont.classList.toggle("opened");
            this.openedOtherLangs = !this.openedOtherLangs;
        },

        hideOtherLangs(event) {
            const cont = document.querySelector('.other-langs');
            const selector = document.querySelector('.navLang');

            if (cont && !cont.contains(event.target) && !selector.contains(event.target)) {
                cont.classList.remove('opened');
                this.openedOtherLangs = false;
            }
        },

        changeLang(locale) {
            this.langItems.forEach(item => {
                item.active = item.locale === locale
            })
            this.$i18n.locale = locale;
            document.documentElement.setAttribute("lang", locale);
            this.saveLocaleToStorage(locale);

            this.emitter.emit("update-projects");
        },

        saveLocaleToStorage(locale) { localStorage.setItem("locale", locale); },
        getLocaleFromStorage() {
            const locale = localStorage.getItem("locale");
            return locale
        },
    },
    
    computed: {
        ...mapGetters(
            {

            }
        ),

        activeLangItem() { return this.langItems.find(item => item.active) },
        nonActiveLangItems() { return this.langItems.filter(item => !item.active) },
    },

    created() {
        document.addEventListener("click", (event) => this.hideOtherLangs(event));

        const locale = this.getLocaleFromStorage();
        if (locale) this.changeLang(locale);
    },

    mounted() {

    }
}
</script>

<style scoped>
.navLang {
    color: rgba(255, 255, 255, 0.35);
    position: relative;
    font-weight: 600;
}
.navLang:hover {
    cursor: pointer;
}
.navLang.in-sidebar {
    font-weight: bold;
}

.navLang .other-langs {
    display: none;
    padding: 8px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background: var(--black);
    z-index: 5;
    bottom: -40px;
}
.navLang.in-sidebar .other-langs {
    padding: 0 8px;
}

.navLang .other-langs .lang-item:hover,
.navLang:has(.other-langs.opened) .lang-item.selected {
    color: rgba(255, 255, 255, 0.75);
}

.navLang .other-langs.opened {
    display: block;
}

.navLang .lang-tick {
    color: var(--green);
    position: absolute;
    left: -24px;
    top: 50%;
    transform: translateY(-50%);
}
.navLang.in-sidebar .lang-tick {
    right: initial;
    left: -24px;
}
</style>