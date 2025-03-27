<template>
    <div class="user-item-wrapper list-item-cont d-flex gap-16 justify-content-between align-items-center pos-relative">
        <div class="list-item-controls d-flex flex-column gap-8">
            <button class="btn btn-icon" @click="showDeleteUser()">
                <Icon icon="mdi:trash" class="control-icon" />
            </button>

            <button class="btn btn-icon" @click="editUser()">
                <Icon icon="mdi:pencil" class="control-icon" />
            </button>
        </div>

        <router-link :to="`/user/${userData._id}`" class="user-item list-item d-flex flex-1">
            <div class="user-main d-flex gap-8">

                <div class="user-avatar-wrapper">
                    <div class="user-avatar-cont pos-relative">
                        <img :src="getAssetUrl(`img/userAvatars/${userData.avatarPath}`)" class="user-avatar" alt="User avatar" v-if="userData.avatarPath">
                        <div class="default-avatar-cont" v-else>
                            <Icon icon="akar-icons:person" class="default-avatar-icon" />
                        </div>
                    </div>
                    <div class="user-name text-center">
                        {{ userData.username }}
                    </div>
                </div>
                <div class="user-ratings d-flex flex-column justify-content-center gap-8">
                    <div class="rating-values d-flex align-items-center gap-8">
                        <Icon icon="material-symbols:star" class="star-icon" v-if="ratingAvg >= 1" />
                        <Icon icon="material-symbols:star-half" class="star-icon" v-else-if="ratingAvg > 0" />
                        <Icon icon="material-symbols:star-outline" class="star-icon" v-else />
                        <span class="rating-avg"> {{ ratingAvg }} </span>

                        <span> (<span class="count">{{ userData.ownRatings.length }}</span> ratings) </span>
                    </div>
                    
                    <span class="rated-others">
                        Rated <span class="count"> {{ userData.ratedOthersCount }} </span> others
                    </span>
                </div>
            </div>
            <div class="user-info flex-1 d-flex justify-content-between gap-16">
                <div class="products-cont info-cont d-flex gap-8">
                    <div class="info-heading montserrat d-flex gap-8">
                        <Icon icon="ix:product" class="info-heading-icon" />
                        Products
                    </div>
                    <div class="divider"></div>
                    <div class="info-content d-flex flex-column">
                        <div> <span class="gradient-text"> 172 </span> on sale </div>
                        <div> <span class="gradient-text"> 172 </span> sold </div>
                        <div> <span class="gradient-text"> 172 </span> bought </div>
                    </div>
                </div>

                <div class="reports-cont info-cont d-flex gap-8">
                    <div class="info-heading montserrat d-flex gap-8">
                        <Icon icon="mdi:alert" class="info-heading-icon" />
                        Reports
                    </div>
                    <div class="divider"></div>
                    <div class="info-content d-flex flex-column">
                        <div> <span class="gradient-text"> 2 </span> own </div>
                        <div> <span class="gradient-text"> 7 </span> others </div>
                    </div>
                </div>

                <div class="created-at-cont info-cont d-flex gap-8">
                    <div class="info-heading montserrat d-flex gap-8">
                        <Icon icon="lets-icons:date-fill" class="info-heading-icon" />
                        Created at
                    </div>
                    <div class="divider"></div>
                    <div class="info-content d-flex flex-column">
                        <div> <span class="gradient-text"> {{ isoToDateString(userData.createdAt) }} </span> </div>
                    </div>
                </div>
            </div>
        </router-link>

        <div class="user-ban-cont">
            <button class="btn secondary" @click="banUser()"> ban </button>
        </div>

        <div class="item-id-info">
            {{ userData._id }}
        </div>
    </div>
</template>

<script>
import { Icon } from '@iconify/vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'UserItem',

    inject: ['emitter'],
    emits: [],

    props: {
        userData: {
            type: Object,
            default: null
        }
    },

    components: {
        Icon
    },

    data() {
        return {
            ratingAvg: 0
        }
    },

    methods: {
        ...mapActions(
            {

            }
        ),

        banUser() {

        },

        showDeleteUser() {
            this.emitter.emit("show-delete-modal", {
                type: "user",
                data: this.userData
            });
        },

        editUser() {

        }
    },
    
    computed: {
        ...mapGetters(
            {

            }
        ),
    },

    created() {
        this.ratingAvg = this.getUserRatingAvg(this.userData.ownRatings);
    },

    mounted() {

    }
}
</script>

<style scoped>
.user-item {
    max-height: 124px;
    gap: 20px;
    align-self: stretch;
    cursor: pointer;
}
.user-item:hover {
    color: var(--white);
    -webkit-box-shadow: 0px 0px 8px 0px rgba(255 ,255, 255, 0.66);
    -moz-box-shadow: 0px 0px 8px 0px rgba(255 ,255, 255, 0.66);
    box-shadow: 0px 0px 8px 0px rgba(255 ,255, 255, 0.66);
}

.user-main {
    background-color: var(--white-5a);
    border-radius: 16px;
    padding: 8px;
}

.user-info {
    padding: 8px;
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

.user-name {
    margin-top: 4px;
    font-weight: bold;
    line-height: 100%;
}

.user-ratings span {
    font-size: 14px;
    font-weight: 200;
}
.user-ratings span.count {
    font-weight: 500;
}

.user-ratings .rating-avg {
    font-size: 16px;
    font-weight: 900;
}

.user-ban-cont .btn {
    background-color: #25201D;
    color: var(--primary);
    padding: 2px 24px;
}

.user-info .info-cont {
    font-size: 14px;
}

.user-info .info-cont .info-heading {
    font-weight: bold;
}

.user-info .info-cont .info-heading .info-heading-icon {
    font-size: 16px;
}

.user-info .info-cont .divider {
    width: 1px;
    min-height: 32px;
    background-color: var(--white-15a);
}

.user-info .info-cont .info-content {
    gap: 10px;
    font-weight: 300;
}

.user-info .info-cont .info-content span {
    font-weight: 500;
}
</style>