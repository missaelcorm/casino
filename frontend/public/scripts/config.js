const API_CONFIG = {
    BASE_URL: window.ENV?.API_BASE_URL || 'http://localhost:3000/api',
    ENDPOINTS: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        GET_USER_NAME: '/auth/user-name',
        
        PROFILE: '/user/profile',
        BALANCE: '/user/balance',
        ACTIVITY: '/user/activity',
        
        PROFILE_UPLOAD: '/profile/upload',
        PROFILE_DELETE: '/profile/delete',
        PROFILE_IMAGE: '/profile/image',
        
        PLAY_HILO: '/games/hi-lo',
        PLAY_ROULETTE: '/games/roulette',
        PLAY_MINES: '/games/mines',
        
        ASSETS_ALL: '/assets/all',
        ASSETS_IMAGES: '/assets/images',
        ASSETS_FONTS: '/assets/fonts',
        ASSETS_FILE: '/assets/file',
        ASSETS_LIST: '/assets/list'
    }
};

function getApiUrl(endpoint) {
    return API_CONFIG.BASE_URL + endpoint;
}

