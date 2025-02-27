export const globalMixin = {
    methods: {
        getAssetUrl(path) {
            const fullPath = `../assets/${path}`;
            return new URL(fullPath, import.meta.url).href;
        },

        transformCategories(categories, selectedSearchCategory) {
            let mainCategories = [{
                name: "allProducts",
                id: "all",
                active: selectedSearchCategory ? false : true,
                subCategories: []
            }];
            mainCategories.push(...categories.filter(category => !category.parentName));

            // For each main category, find subcategories
            return mainCategories.map(mainCategory => {
                if (mainCategory.name == "allProducts") return mainCategory;

                const subCategories = categories.filter(category => category.parentName === mainCategory.name);
                subCategories.forEach(sCtg => sCtg.active = selectedSearchCategory && sCtg.name == selectedSearchCategory.name ? true : false);

                return { 
                    ...mainCategory, 
                    subCategories,
                    showSub: (selectedSearchCategory && mainCategory.name == selectedSearchCategory.name) || subCategories.find(sCtg => sCtg.active) ? true : false,
                    active: (selectedSearchCategory && mainCategory.name == selectedSearchCategory.name) ? true : false
                };
            });
        },
    }
};