export const listMixin = {
    methods: {
        filterByValue (array, value) {
            const regex = new RegExp(value.replace(/([!@#$%^&*()+=\[\]\\',./{}":<>?~_-])/g, "\\$1"));
            return array.filter(obj =>
                Object.values(obj).some(val =>
                    (typeof val === 'string' || typeof val === 'number') &&
                    (regex.test(val.toString().toLowerCase()))
                )
            );
        },

        sortProducts(filteredProducts, selectedSortFilter) {
            let sortedProducts = JSON.parse(JSON.stringify(filteredProducts));

            if (selectedSortFilter == "latest" || selectedSortFilter == "oldest") {
                sortedProducts.sort((a, b) => {
                    const aEpoch = new Date(a.createdAt).getTime();
                    const bEpoch = new Date(b.createdAt).getTime();

                    return selectedSortFilter == "latest" ? 
                        bEpoch - aEpoch : 
                        aEpoch - bEpoch;
                });

            } else if (selectedSortFilter == "minPrice" || selectedSortFilter == "maxPrice") {
                sortedProducts.sort((a, b) => {
                    const aPrice = a.price.specialValue ? a.price.specialValue : a.price.value.$numberDecimal;
                    const bPrice = b.price.specialValue ? b.price.specialValue : b.price.value.$numberDecimal;

                    if (isNaN(aPrice) && isNaN(bPrice)) {
                        return aPrice.toString().localeCompare(bPrice.toString());
                    } else if (isNaN(aPrice)) {
                        return 1;
                    } else if (isNaN(bPrice)) {
                        return -1;
                    } else {
                        return selectedSortFilter == "minPrice" ?
                            aPrice - bPrice :
                            bPrice - aPrice;
                    }
                });
            } else if (selectedSortFilter == "agreement") sortedProducts = sortedProducts.filter(prod => prod.price.specialValue == "agreement");
            else if (selectedSortFilter == "offer") sortedProducts = sortedProducts.filter(prod => prod.price.specialValue == "offer");
            else if (selectedSortFilter == "inText") sortedProducts = sortedProducts.filter(prod => prod.price.specialValue == "inText");
            else if (selectedSortFilter == "free") sortedProducts = sortedProducts.filter(prod => prod.price.specialValue == "free");

            return sortedProducts;
        },

        filterProducts(products, searchQuery, selectedSearchCategory, selectedPriceRange, selectedLocation, type) {
            let filteredProducts = JSON.parse(JSON.stringify(products));

            if (selectedSearchCategory) {
                if (!selectedSearchCategory._id) filteredProducts = JSON.parse(JSON.stringify(this.products));
                else {
                    filteredProducts = filteredProducts.filter(prod => {
                        return selectedSearchCategory._id == prod.category.mainCategory || selectedSearchCategory._id == prod.category.subCategory;
                    });
                }
            }
            if (selectedPriceRange && selectedPriceRange[0]) 
                filteredProducts = filteredProducts.filter(prod => prod.price.value && +prod.price.value.$numberDecimal && +prod.price.value.$numberDecimal >= selectedPriceRange[0]);
            if (selectedPriceRange && selectedPriceRange[1] && selectedPriceRange[1] != 9999)
                filteredProducts = filteredProducts.filter(prod => prod.price.value && +prod.price.value.$numberDecimal && +prod.price.value.$numberDecimal <= selectedPriceRange[1]);
            // if (this.selectedLocation) filteredProducts = filteredProducts.filter(prod => prod)
            if (searchQuery) 
                filteredProducts = this.filterByValue(filteredProducts, searchQuery.toLowerCase());

            return filteredProducts;
        },

        sortRatings(filteredRatings, selectedSortFilter) {
            let sortedRatings = JSON.parse(JSON.stringify(filteredRatings));

            if (selectedSortFilter == "latest" || selectedSortFilter == "oldest") {
                sortedRatings.sort((a, b) => {
                    const aEpoch = new Date(a.createdAt).getTime();
                    const bEpoch = new Date(b.createdAt).getTime();

                    return selectedSortFilter == "latest" ? 
                        bEpoch - aEpoch : 
                        aEpoch - bEpoch;
                });
            }

            return sortedRatings;
        },

        filterRatings(ratings, searchQuery, type) {
            let filteredRatings = JSON.parse(JSON.stringify(ratings));

            if (type)
                filteredRatings = filteredRatings = filteredRatings.filter(rt => rt.type__ == type);
            if (searchQuery) 
                filteredRatings = this.filterByValue(filteredRatings, searchQuery.toLowerCase());

            return filteredRatings;
        }
    }
};