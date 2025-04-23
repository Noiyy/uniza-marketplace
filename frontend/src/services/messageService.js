import DefaultService from './defaultService';

class MessageService extends DefaultService {
    constructor(isDev, apiRoute) {
        super(isDev, apiRoute);
    }

    async getMsgsBetweenUsers(senderId, recipientId) {
        return await this.apiClient.get(`/get/${senderId}/${recipientId}`, { withCredentials: true });
    }

    async getUnreadMsgsFromUser(senderId, recipientId) {
        return await this.apiClient.get(`/getUnread/${senderId}/${recipientId}`, { withCredentials: true });
    }

    async getLatestMsgFromUser(senderId, recipientId) {
        return await this.apiClient.post(`/get/${senderId}/${recipientId}`, { isLatest: true }, { withCredentials: true });
    }

    async getOnlineUsers() {
        return await this.apiClient.get("/getOnlineUsers", { withCredentials: true });
    }
}

export default MessageService;