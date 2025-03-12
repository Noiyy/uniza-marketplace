import axios from 'axios';

class DefaultService {
    constructor(isDev, apiRoute) {
        this.isDev = isDev;
        this.apiClient = axios.create({
            baseURL: isDev ? `http://localhost:4000/${apiRoute}` : `https://unizamarketplace.noiyy.eu/${apiRoute}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
export default DefaultService;