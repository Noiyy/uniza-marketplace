<template>
    <Modal
        v-model:is-shown="localIsShown"
        :header-text="modalHeading"
        :modal-id="'rating-modal'"
        @close="closeModal">
        <template #body>
            <div class="add-content d-flex flex-column gap-32">
                <RatingModalContent v-if="ratingData"
                    :all-users="allUsers"
                    :all-products="allProducts"
                    v-model:item-to-edit-data="ratingData"
                ></RatingModalContent>

                <div class="btns-wrapper d-flex gap-24 justify-content-end">
                    <button class="btn primary  " @click="rateUser()"> {{ $t("Rate") }} </button>
                    <button class="btn secondary" @click="closeModal()"> {{ $t("Cancel") }} </button>
                </div>
            </div>
        </template>
    </Modal>
</template>

<script>
import { mapGetters } from 'vuex/dist/vuex.cjs.js';
import Modal from '../Modal.vue';
import RatingModalContent from './RatingModalContent.vue';

export default {
    name: 'RatingModal',

    inject: ['emitter', 'feedbackApi', 'userApi', 'productApi'],
    emits: ['close', 'update:isShown'],

    props: {
        isShown: {
            type: Boolean,
            default: false
        },

        ratedUser: {
            type: Object,
            default: null
        },

        ratedProduct: {
            type: Object,
            default: null
        }
    },

    components: {
        Modal,
        RatingModalContent
    },

    data() {
        return {
            allProducts: [],
            allUsers: [],

            modalHeading: this.$t("RateUser"),
            localIsShown: false,
            ratingData: {
                title: "",
                description: "",
                ratedUser: this.ratedUser ? this.ratedUser : null,
                ratedByUser: this.getLoggedUser,
                ratedProduct: this.ratedProduct ? this.ratedProduct : null,
                ratingStars: null
            },
        }
    },

    methods: {
        onUserSearchChange(searchQuery) {
            // this.filteredUsers = this.filterByValue(this.availableUsers, searchQuery);
        },

        closeModal() {
            this.localIsShown = false;

            this.$emit("update:isShown", false);
            this.$emit("close");
        },

        async getAllProducts() {
            const resp = await this.productApi.getAllProducts();
            this.allProducts = resp.data;
            console.log("products", resp);
        },

        async getAllUsers() {
            const resp = await this.userApi.getAllUsers();
            this.allUsers = resp.data;
            console.log("users", resp);
        },

        async rateUser() {
            if (!this.ratingData.title) {
                this.$toast.error(this.$t("MissingRatingTitle"));
                return;
            }

            this.emitter.emit("show-loader");

            const post = {
                title: this.ratingData.title,
                description: this.ratingData.description,
                ratingValue: this.ratingData.ratingStars,
                productId: this.ratingData.ratedProduct ? this.ratingData.ratedProduct._id : null,
                fromUserId: this.getLoggedUser._id,
                toUserId: this.ratingData.ratedUser._id
            };

            const resp = await this.feedbackApi.addRating(post);
            console.log("more", resp);
            if (resp.data.success) {
                this.$toast.success(this.$t("RatedUserSuccess"));
                this.emitter.emit("added-rating");
                this.closeModal();
            } else {
                this.$toast.error(this.$t("RatedUserFailed"));
            }

            this.emitter.emit("hide-loader");
        }
    },
    
    computed: {
        ...mapGetters(
            {
                getLoggedUser: "user/getUser"
            }
        )
    },

    created() {
        this.getAllProducts();
        this.getAllUsers();
    },

    mounted() {
        this.localIsShown = this.isShown;
    },

    watch: {
        isShown(newValue) {
            this.localIsShown = newValue;
        }
    }
}
</script>

<style scoped>

</style>