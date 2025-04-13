import DefaultService from './defaultService';

class UserService extends DefaultService {
    constructor(isDev, apiRoute) {
        super(isDev, apiRoute);
    }

    /* USER ROUTES */
    async getAllUsers() {
        return await this.apiClient.get('/user/getAllUsers');
    }
    async getUserById(userId) {
        return await this.apiClient.get(`/user/${userId}`);
    }
    async getLoggedUser() {
        return await this.apiClient.get(`/user/getLoggedUser`, { withCredentials: true });
    }
    async updateUser(userId, userData) {
        return await this.apiClient.put(`/user/update/${userId}`, userData, { withCredentials: true });
    }
    async updateUserSettings(userId, settingsData) {
        return await this.apiClient.put(`/user/updateSettings/${userId}`, settingsData, { withCredentials: true });
    }
    async deleteUser(userId) {
        return await this.apiClient.delete(`/user/delete/${userId}`, { withCredentials: true });
    }
    async uploadAvatar(formData) {
        return await this.apiClient.post('/user/uploadAvatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });
    }

    /* AUTH ROUTES */
    async registerUser(userData) {
        return await this.apiClient.post('/auth/register', userData);
    }
    async loginUser(userData) {
        return await this.apiClient.post('/auth/login', userData, { withCredentials: true });
    }
    async logoutUser() {
        return await this.apiClient.post('/auth/logout', {}, { withCredentials: true });
    }
}

export default UserService;