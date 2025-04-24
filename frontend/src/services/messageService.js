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

    async getUserUnreadMsgsCount(userId) {
        return await this.apiClient.get(`/getUnreadCount/${userId}`, { withCredentials: true });
    }
    
    async getOnlineUsers() {
        return await this.apiClient.get("/getOnlineUsers", { withCredentials: true });
    }

    async getMsgsFromNewRecipients(recipientId) {
        return await this.apiClient.get(`/getFromNewRec/${recipientId}`, { withCredentials: true });
    }
    
    async getLatestMsgFromUser(senderId, recipientId) {
        return await this.apiClient.post(`/get/${senderId}/${recipientId}`, { isLatest: true }, { withCredentials: true });
    }

    async markMsgsAsSeen(messages, recipientId) {
        return await this.apiClient.post("/markAsSeen", { messages, recipientId }, { withCredentials: true });
    }
}

export default MessageService;