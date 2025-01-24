import DefaultService from './defaultService';

class UserService extends DefaultService {
    constructor(isDev, apiRoute) {
        super(isDev, apiRoute);
    }

    /* USER ROUTES */
    async getAllUsers() {
        return await this.apiClient.get('/user/getAll');
    }
    async getUserById(userId) {
        return await this.apiClient.get(`/user/${userId}`);
    }
    async updateUser(userId, userData) {
        return await this.apiClient.put(`/user/update/${userId}`, userData);
    }
    async deleteUser(userId) {
        return await this.apiClient.delete(`/user/delete/${userId}`);
    }

    /* AUTH ROUTES */
    async registerUser(userData) {
        return await this.apiClient.post('/auth/register', userData);
    }
    async loginUser(userData) {
        return await this.apiClient.post('/auth/login', userData);
    }
}

export default UserService;