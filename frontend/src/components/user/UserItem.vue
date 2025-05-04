<template>
    <div class="user-item-wrapper list-item-cont d-flex gap-16 justify-content-between align-items-center pos-relative">
        <div class="list-item-controls d-flex flex-column gap-8">
            <button class="btn btn-icon" @click="showDeleteUser()" :disabled="userData.isAdmin">
                <Icon icon="mdi:trash" class="control-icon" />
            </button>

            <button class="btn btn-icon" @click="editUser()">
                <Icon icon="mdi:pencil" class="control-icon" />
            </button>
        </div>

        <router-link :to="`/user/${userData._id}`" class="user-item list-item d-flex flex-1 pos-relative">
            <div class="ban-overlay d-flex flex-column justify-content-center align-items-center gap-8" v-if="userIsBanned">
                <div class="ban-title gradient-text"> 
                    BANNED 
                    <span> {{ isoToDateString(userData.ban.bannedAt) }} - {{ isoToDayTime(userData.ban.bannedAt) }} </span>
                 </div>
                <div class="ban-reason d-flex gap-8"> 
                    <Icon icon="material-symbols:info-outline" class="info-icon" /> 
                    <span> {{ userData.ban.reason }} </span>   
                </div>
            </div>

            <div class="user-main d-flex flex-column gap-8">
                <div class="d-flex gap-8">
                    <div class="user-avatar-wrapper pos-relative">
                        <div class="admin-badge-small" v-if="userData.isAdmin"> Admin </div>
    
                        <div class="user-avatar-cont pos-relative">
                            <img :src="getAssetUrl(`img/userAvatars/${userData.avatarPath}`)" class="user-avatar" alt="User avatar" v-if="userData.avatarPath">
                            <div class="default-avatar-cont" v-else>
                                <Icon icon="akar-icons:person" class="default-avatar-icon" />
                            </div>
                        </div>
                    </div>
                    <div class="user-ratings d-flex flex-column gap-8">
                        <div class="rating-values d-flex align-items-center gap-8">
                            <div class="rating-values-main d-flex align-items-center gap-8">
                                <Icon icon="material-symbols:star" class="star-icon" v-if="ratingAvg >= 1" />
                                <Icon icon="material-symbols:star-half" class="star-icon" v-else-if="ratingAvg > 0" />
                                <Icon icon="material-symbols:star-outline" class="star-icon" v-else />
                                <span class="rating-avg"> {{ ratingAvg ? ratingAvg : '0.0' }} </span>
                            </div>
    
                            <span> (<span class="count">{{ userData.ownRatings.length }}</span>{{ IS_MOBILE ? '' : $t("Ratings").toLowerCase() }}) </span>
                        </div>
                        
                        <span class="rated-others">
                            {{ $t('Rated') }} <span class="count"> {{ userData.ratedOthersCount }} </span> {{ $t('others') }}
                        </span>
                    </div>
                </div>

                <div class="user-name">
                    {{ userData.username }}
                </div>
            </div>
            <div class="user-info flex-1 d-flex justify-content-between gap-16">
                <div class="products-cont info-cont d-flex gap-8">
                    <div class="info-heading montserrat d-flex gap-8">
                        <Icon icon="ix:product" class="info-heading-icon" />
                        {{ $t("Products") }}
                    </div>
                    <div class="divider"></div>
                    <div class="info-content d-flex flex-column">
                        <div> <span class="gradient-text"> {{ userData.ownProducts.filter(prd => prd.status == "onSale").length }} </span> {{ $t("OnSale").toLowerCase() }} </div>
                        <div> <span class="gradient-text"> {{ userData.sales.reduce((acc, sale) => acc + sale.count, 0) }} </span> {{ $t("Sold").toLowerCase() }} </div>
                        <div> <span class="gradient-text"> {{ userData.boughtProducts }} </span> {{ $t("Bought").toLowerCase() }} </div>
                    </div>
                </div>

                <div class="reports-cont info-cont d-flex gap-8">
                    <div class="info-heading montserrat d-flex gap-8">
                        <Icon icon="mdi:alert" class="info-heading-icon" />
                        {{ $t("Reports") }}
                    </div>
                    <div class="divider"></div>
                    <div class="info-content d-flex flex-column">
                        <div> <span class="gradient-text"> {{ userData.ownReports.length }} </span> {{ $t("Own") }} </div>
                        <div> <span class="gradient-text"> {{ userData.othersReports.length }} </span> {{ $t("Others") }} </div>
                    </div>
                </div>

                <div class="created-at-cont info-cont d-flex gap-8">
                    <div class="info-heading montserrat d-flex gap-8">
                        <Icon icon="lets-icons:date-fill" class="info-heading-icon" />
                        {{ $t("CreatedAt") }}
                    </div>
                    <div class="divider"></div>
                    <div class="info-content d-flex flex-column">
                        <div> <span class="gradient-text"> {{ isoToDateString(userData.createdAt) }} </span> </div>
                    </div>
                </div>
            </div>
        </router-link>

        <div class="user-ban-cont">
            <button class="btn secondary" @click="showBanUser()" :disabled="userData.isAdmin || userIsBanned"> {{ $t("Ban") }} </button>
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
    emits: ["show-ban-modal"],

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

        showBanUser() {
            this.$emit("show-ban-modal", this.userData);
        },

        showDeleteUser() {
            this.emitter.emit("show-delete-modal", {
                type: "user",
                data: this.userData
            });
        },

        editUser() {
            this.emitter.emit("show-edit-modal", {
                type: "user",
                data: this.userData
            });
        }
    },
    
    computed: {
        ...mapGetters(
            {
                IS_MOBILE: 'misc/getIsMobile',
            }
        ),

        userIsBanned() {
            return this.userData.ban && this.userData.ban.isBanned;
        }
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
    font-weight: bold;
    line-height: 100%;
    margin-left: 4px;
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
.user-ban-cont .btn:disabled {
    color: rgba(255, 154, 158, 0.5);
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

.admin-badge-small {
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    font-size: 10px;
}

.ban-overlay {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.66);
    width: 100%;
    height: 100%;
    z-index: 2;
    border-radius: 16px;
    gap: 4px;
}

.ban-overlay .ban-title {
    font-weight: bold;
}

.ban-overlay .ban-title span {
    padding: 0 12px;
    background: var(--white-15a);
    border-radius: 8px;
    color: var(--white);
    background-clip: initial;
    -webkit-background-clip: initial;
    -webkit-text-fill-color: initial;
}

.ban-overlay .ban-reason {
    color: var(--secondary);
}

/* SMALL - Mobile */
@media(max-width: 640px) { 
    .list-item-controls {
        position: absolute;
        top: 4px;
        left: 4px;
        z-index: 2;
        opacity: 0.75;
    }

    .user-ban-cont {
        position: absolute;
        bottom: 8px;
        left: 8px;
        z-index: 2;
    }

    .user-item {
        max-height: initial;
        gap: 12px !important;
    }

    .user-info {
        flex-wrap: wrap;
    }

    .rating-values-main {
        gap: 4px !important;
    }

    .user-info .info-cont .info-heading {
        min-width: 91px;
        font-size: 12px;
        gap: 4px !important;
    }

    .star-icon {
        font-size: 16px;
    }

    .rating-avg {
        font-size: 14px;
    }

    .user-ratings span {
        font-size: 13px;
    }

    .user-name {
        font-size: 14px;
    }

    .user-info .info-cont .info-content {
        font-size: 12px;
        gap: 4px !important;
    }
}

/* MEDIUM - Tablet */
@media(min-width: 641px) and (max-width: 992px) { 

}
</style>