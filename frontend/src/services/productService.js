import DefaultService from './defaultService';

class ProductService extends DefaultService {
    constructor(isDev, apiRoute) {
        super(isDev, apiRoute);
    }

    /* PRODUCT ROUTES */
    async getAllProducts() {
        return await this.apiClient.get('/getAllProducts');
    }
    async getProduct(productId) {
        return await this.apiClient.get(`/${productId}`);
    }
    async getUserProducts(userId) {
        return await this.apiClient.get(`/userProducts/${userId}`);
    }
    async addProduct(productData) {
        return await this.apiClient.post("/add", productData);
    }
    async updateProduct(productId, productData) {
        return await this.apiClient.patch(`/update/${productId}`, productData);
    }
    async deleteProduct(productId) {
        return await this.apiClient.delete(`/delete/${productId}`);
    }

    /* CATEGORY ROUTES */
    async getAllCategories() {
        return await this.apiClient.get('/categories/getAllCategories');
    }
    async getMainCategories() {
        return await this.apiClient.get('/categories/getMain');
    }
    async getSubCategories() {
        return await this.apiClient.get('/categories/getSub');
    }
    async getCategory(categoryId) {
        return await this.apiClient.get(`/categories/${categoryId}`);
    }

    /* SALE ROUTES */
    async getAllSales() {
        return await this.apiClient.get('/sales/getAllSales');
    }
    async getProductSales(productId) {
        return await this.apiClient.get(`/${productId}/sales`);
    }
    async getSale(saleId) {
        return await this.apiClient.get(`/sales/${saleId}`);
    }
    async addSale(productId, saleData) {
        return await this.apiClient.post(`/${productId}/sales/add`, saleData);
    }
    async confirmSale(productId, saleId) {
        return await this.apiClient.post(`/${productId}/sales/${saleId}/confirm`);
    }
    async deleteSale(saleId) {
        return await this.apiClient.delete(`/sales/delete/${saleId}`);
    }
}

export default ProductService;