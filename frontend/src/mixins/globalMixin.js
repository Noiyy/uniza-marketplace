export const globalMixin = {
    methods: {
        getAssetUrl(path) {
            const fullPath = `../assets/${path}`;
            return new URL(fullPath, import.meta.url).href;
        }
    }
};