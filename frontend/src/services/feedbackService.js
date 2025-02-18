import DefaultService from './defaultService';

class FeedbackService extends DefaultService {
    constructor(isDev, apiRoute) {
        super(isDev, apiRoute);
    }

    /* REPORT ROUTES */
    async getAllReports() {
        return await this.apiClient.get('/reports/getAllReports');
    }
    async getReport(reportId) {
        return await this.apiClient.get(`/reports/${reportId}`);
    }
    async addReport(reportData) {
        return await this.apiClient.post('/reports/add', reportData);
    }
    async deleteReport(reportId) {
        return await this.apiClient.delete(`/reports/delete/${reportId}`);
    }

    /* RATING ROUTES */
    async getAllRatings() {
        return await this.apiClient.get('/ratings/getAllRatings');
    }
    async getRating(ratingId) {
        return await this.apiClient.get(`/ratings/${ratingId}`);
    }
    async addRating(ratingData) {
        return await this.apiClient.post('/ratings/add', ratingData);
    }
    async updateRating(ratingId, ratingData) {
        return await this.apiClient.patch(`/ratings/update/${ratingId}`, ratingData);
    }
    async deleteRating(ratingId) {
        return await this.apiClient.delete(`/ratings/delete/${ratingId}`);
    }
}

export default FeedbackService;