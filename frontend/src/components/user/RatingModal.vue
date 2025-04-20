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
                    <button class="btn primary  " @click="rateUser()"> Rate </button>
                    <button class="btn secondary" @click="closeModal()"> Cancel </button>
                </div>
            </div>
        </template>
    </Modal>
</template>

<script>
import Modal from '../Modal.vue';
import RatingModalContent from './RatingModalContent.vue';

export default {
    name: 'RatingModal',

    inject: ['emitter'],
    emits: ['close', 'update:isShown'],

    props: {
        isShown: {
            type: Boolean,
            default: false
        },

        ratedUser: {
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

            modalHeading: "Rate user",
            localIsShown: false,
            ratingData: {
                title: "",
                description: "",
                ratedUser: this.ratedUser,
                ratedProduct: null,
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

        }
    },
    
    computed: {

    },

    created() {

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