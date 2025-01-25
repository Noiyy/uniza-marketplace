import DefaultService from './defaultService';

class MiscService extends DefaultService {
    constructor(isDev, apiRoute) {
        super(isDev, apiRoute);
    }

    async getAllPSC() {
        return await this.apiClient.get('/getAllPSC');
    }
}

export default MiscService;