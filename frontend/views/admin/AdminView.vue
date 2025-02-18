<template>
    <div class="admin">
        <AdminContent></AdminContent>
    </div>
</template>

<script>
import AdminContent from '../../src/components/admin/AdminContent.vue';

export default {
    head() {
        return {
            title: `Admin - UNIZA Marketplace`,
            meta: [
                { name: "robots", content: "noindex, nofollow" },
            ]
        }
    },

    name: "AdminView",

    components: {
        AdminContent
    },
}
</script>

<style scoped>


/* SMALL - Mobile */
@media(max-width: 640px) { 

}

/* MEDIUM - Tablet */
@media(min-width: 641px) and (max-width: 992px) { 

}
</style>