<template>
    <template v-if="localItemToEditData">
        <div class="input-cont d-flex flex-column gap-8">
            <div class="input-tag"> {{ $t('RatingTitle') }} </div>
            <input v-model="localItemToEditData.title" type="text" class="styled" :placeholder="$t('Title')">
        </div>
    
        <div class="input-row objs-row d-flex gap-24 align-items-center justify-content-between">
            <div class="input-cont d-flex flex-column gap-8 flex-1" v-if="isEdit">
                <div class="input-tag"> {{ $t('RatedBy') }} </div>
                <Multiselect
                    disabled
                    v-model="localItemToEditData.ratedByUser"
                    :options="allUsers"
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

            <div class="input-cont rating-cont d-flex flex-column gap-8 flex-1" v-else>
                <div class="input-cont d-flex flex-column gap-8">
                    <div class="input-tag"> {{ $t('SelectRating') }} </div>

                    <div class="d-flex align-items-end gap-8">
                        <Vue3StarRatings
                            v-model="localItemToEditData.ratingStars"
                        ></Vue3StarRatings>
                        <span> {{ localItemToEditData.ratingStars }} </span>
                    </div>
                </div>
            </div>
    
            <div class="input-cont d-flex flex-column gap-8 flex-1">
                <div class="input-tag"> {{ $t('RatedUser') }} </div>

                <!-- v-if="localItemToEditData.ratedByUser" -->
                <Multiselect
                    :disabled="isEdit ? false : true"
                    v-model="localItemToEditData.ratedUser"
                    :options="localItemToEditData.ratedByUser ? allUsers.filter(usr => usr._id != localItemToEditData.ratedByUser._id) : allUsers"
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
        </div>
    
        <div class="input-row d-flex gap-24 align-items-center justify-content-between">
            <div class="input-cont d-flex flex-column gap-8 flex-1" v-if="!IS_MOBILE"></div>
    
            <div class="input-cont d-flex flex-column gap-8 flex-1">
                <div class="input-tag"> {{ $t('RatedProduct') }} </div>
                <Multiselect
                    v-model="localItemToEditData.ratedProduct"
                    :options="localItemToEditData.ratedUser ? allProducts.filter(prd => prd.sellerId == localItemToEditData.ratedUser._id) : []"
                    :track-by="'_id'"
                    :allow-empty="true"
                    :label="'title'"
                    :multiple="false"
                    :show-labels="false"
                ></Multiselect>
            </div>
        </div>
    
        <div class="input-cont description-cont d-flex flex-column gap-8">
            <div class="input-tag"> {{ $t('Description') }} </div>
            <textarea v-model="localItemToEditData.description" type="text" class="styled" :placeholder="$t('Description')"></textarea>
        </div>
    </template>
</template>

<script>
import Vue3StarRatings from "vue3-star-ratings";
import Multiselect from 'vue-multiselect';
import "vue-multiselect/dist/vue-multiselect.min.css";

import { Icon } from '@iconify/vue';
import { mapGetters } from "vuex/dist/vuex.cjs.js";

export default {
    name: 'RatingModalContent',

    inject: ['emitter'],
    emits: ["update:item-to-edit-data"],

    props: {
        itemToEditData: {
            type: Object,
            default: null
        },

        allUsers: {
            type: Array,
            default: []
        },

        allProducts: {
            type: Array,
            default: []
        },

        isEdit: {
            type: Boolean,
            default: false
        }
    },

    components: {
        Vue3StarRatings,
        Multiselect,
        Icon,
    },

    data() {
        return {
            localItemToEditData: null
        }
    },

    methods: {
        onUserSearchChange() {

        }
    },
    
    computed: {
        ...mapGetters({
            IS_MOBILE: 'misc/getIsMobile',
        })
    },

    created() {

    },

    mounted() {
        this.localItemToEditData = this.itemToEditData;
        console.log("hmmm", this.localItemToEditData);
    },

    watch: {
        localItemToEditData: {
            handler(newValue, oldValue) {
                this.localItemToEditData.ratingStars = Math.round(this.localItemToEditData.ratingStars * 2) / 2;
                this.$emit("update:item-to-edit-data", this.localItemToEditData);
            },
            deep: true
        }
    }
}
</script>

<style scoped>
.user-avatar-cont, .default-avatar-cont {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    max-width: 24px;
    max-height: 24px;
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
    font-size: 16px;
    background: var(--white-5a);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.rating-cont .input-tag {
    left: 0;
    padding: 4px 0; 
}

/* SMALL - Mobile */
@media(max-width: 640px) { 
    textarea {
        min-height: 15vh;
        max-height: 17vh;
    }

    .objs-row {
        flex-direction: column;
        align-items: flex-start !important;
    }

    .objs-row > div {
        width: 100%;
    }
}

/* MEDIUM - Tablet */
@media(min-width: 641px) and (max-width: 992px) { 

}
</style>

<style>
.rating-cont .vue3-star-ratings {
    margin-top: 8px;
}
</style>