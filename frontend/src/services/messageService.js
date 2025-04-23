import DefaultService from './defaultService';

class MessageService extends DefaultService {
    constructor(isDev, apiRoute) {
        super(isDev, apiRoute);
    }

    async getMessagesBetweenUsers(senderId, recipientId) {
        return await this.apiClient.get(`/get/${senderId}/${recipientId}`, { withCredentials: true });
    }
}

export default MessageService;