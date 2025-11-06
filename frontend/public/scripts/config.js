const API_CONFIG = {
    BASE_URL: 'http://localhost:3000/api',
    ENDPOINTS: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        GET_USER_NAME: '/auth/user-name',
        
        PROFILE: '/user/profile',
        BALANCE: '/user/balance',
        ACTIVITY: '/user/activity'
    }
};

function getApiUrl(endpoint) {
    return API_CONFIG.BASE_URL + endpoint;
}
