<template>
    <div class="objs-info">
        <div class="images d-flex align-items-center">
            <router-link :to="`/user/${fromObj._id}`" class="fromObj avatar-cont pos-relative">
                <img v-if="fromObj.avatarPath" :src="getAssetUrl(`img/userAvatars/${fromObj.avatarPath}`)" class="user-avatar" alt="User avatar" >
                <div class="default-avatar-cont" v-else>
                    <Icon icon="akar-icons:person" class="default-avatar-icon" />
                </div>
            </router-link>
    
            <div class="arrow-icon-cont">
                <Icon icon="typcn:arrow-right-outline" class="arrow-icon" />
            </div>

            <!-- to user -->
            <router-link :to="`/user/${toObj._id}`" class="toObj avatar-cont pos-relative" v-if="toObjType == 'user'">
                <img v-if="toObj.avatarPath" :src="getAssetUrl(`img/userAvatars/${toObj.avatarPath}`)" class="user-avatar" alt="User avatar" >
                <div class="default-avatar-cont" v-else>
                    <Icon icon="akar-icons:person" class="default-avatar-icon" />
                </div>
            </router-link>
            <!-- to product -->
            <router-link :to="`/product/${toObj._id}`" class="toObj avatar-cont product pos-relative" v-else-if="toObjType == 'product'">
                <div class="thumbnail user-avatar d-flex justify-content-center align-items-center">
                    <img v-if="toObj.images && toObj.images.length" :src="getAssetUrl(`img/products/${toObj.images[0]}`)" :alt="`${toObj.title} thumbnail`" class="img-fluid">
                    <img v-else :src="getAssetUrl('img/logo-sm_dark.svg')" aria-hidden="true" class="no-img img-fluid">
                </div>
            </router-link>
        </div>

        <div class="date-created-at d-flex justify-content-center align-items-center gap-8" v-if="createdAt">
            <Icon icon="lets-icons:date-fill" class="date-icon" />
            {{ createdAt ? isoToDateString(createdAt) : "hm" }}
        </div>
    </div>
</template>

<script>
import { Icon } from '@iconify/vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'FromToObjectInfos',

    inject: ['axios', 'emitter'],
    emits: [],

    props: {
        fromObj: {
            type: Object,
            default: null
        },
        toObj: {
            type: Object,
            default: null
        },
        toObjType: {
            type: String,
            default: "user"
        },
        createdAt: {
            type: String,
            default: null
        },
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

    }
}
</script>

<style scoped>
.images {
    gap: 2px;
}

.avatar-cont:hover {
    color: var(--white);
}

.avatar-cont::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.2s ease-in;
}
.avatar-cont:hover::before {
    opacity: 1;
}

.avatar-cont.product::before {
    border-radius: 8px;
}

.avatar-cont, .default-avatar-cont {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    max-width: 48px;
    max-height: 48px;
    border-radius: 50%;
}
.user-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    aspect-ratio: 1 / 1;
}

.default-avatar-cont {
    font-size: 24px;
    background: var(--white-5a);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.arrow-icon {
    font-size: 24px;
    color: var(--secondary);
}

.date-created-at {
    opacity: 0.5;
    margin-top: 4px;
    font-weight: 200;
}

.date-created-at .date-icon {
    opacity: 0.66;
}

.thumbnail {
    background-color: var(--white-5a);
    border-radius: 8px;
    overflow: hidden;
}

.thumbnail img {
    object-fit: cover;
    height: 100%;
    width: 100%;
}

.thumbnail .no-img {
    object-fit: initial;
    height: 75%;
    opacity: 0.2;
}

/* SMALL - Mobile */
@media(max-width: 640px) { 
    .images {
        flex-direction: column;
    }

    .arrow-icon-cont {
        transform: rotate(90deg);
    }

    .date-icon {
        display: none;
    }

    .date-created-at {
        font-size: 12px;
    }

    .avatar-cont, .default-avatar-cont {
        width: 36px;
        height: 36px;
        max-width: 36px;
        max-height: 36px;
    }

    .default-avatar-cont {
        font-size: 20px;
    }
}

/* MEDIUM - Tablet */
@media(min-width: 641px) and (max-width: 992px) { 

}
</style>