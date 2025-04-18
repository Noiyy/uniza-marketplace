import DefaultService from './defaultService';

class ProductService extends DefaultService {
    constructor(isDev, apiRoute) {
        super(isDev, apiRoute);
    }

    /* PRODUCT ROUTES */
    async getAllProducts() {
        return await this.apiClient.get('/getAllProducts');
    }
    async getLatestProducts() {
        return await this.apiClient.get("/getLatestProducts");
    }
    async getProduct(productId) {
        return await this.apiClient.get(`/${productId}`);
    }
    async getUserProducts(userId) {
        return await this.apiClient.get(`/userProducts/${userId}`);
    }
    async getProductHistory(productId) {
        return await this.apiClient.get(`/${productId}/history`);
    }
    async addProduct(productData) {
        return await this.apiClient.post("/add", productData, { withCredentials: true });
    }
    async updateProduct(productId, productData) {
        return await this.apiClient.patch(`/update/${productId}`, productData, { withCredentials: true });
    }
    async uploadProductImages(formData) {
        return await this.apiClient.post(`/uploadProductImages`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });
    } 

    async deleteProduct(productId) {
        return await this.apiClient.delete(`/delete/${productId}`, { withCredentials: true });
    }

    /* CATEGORY ROUTES */
    async getAllCategories() {
        return await this.apiClient.get('/categories/getAllCategories');
    }
    async getMainCategories() {
        return await this.apiClient.get('/categories/getMainCategories');
    }
    async getSubCategories() {
        return await this.apiClient.get('/categories/getSubCategories');
    }
    async getCategory(categoryId) {
        return await this.apiClient.get(`/categories/${categoryId}`);
    }

    /* SALE ROUTES */
    async getAllSales() {
        return await this.apiClient.get('/sales/getAllSales');
    }
    async getSalesInLast96Hours() {
        return await this.apiClient.get('/sales/getInLast96Hours');
    }
    async getProductSales(productId) {
        return await this.apiClient.get(`/${productId}/sales`);
    }
    async getSale(saleId) {
        return await this.apiClient.get(`/sales/${saleId}`);
    }
    async addSale(productId, saleData) {
        return await this.apiClient.post(`/${productId}/sales/add`, saleData, { withCredentials: true });
    }
    async confirmSale(productId, saleId) {
        return await this.apiClient.post(`/${productId}/sales/${saleId}/confirm`);
    }
    async deleteSale(saleId) {
        return await this.apiClient.delete(`/sales/delete/${saleId}`, { withCredentials: true });
    }
}

export default ProductService;