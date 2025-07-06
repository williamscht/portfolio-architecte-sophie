const CONFIG = {
    API_BASE_URL: 'http://localhost:5678/api',
    ENDPOINTS: {
        login: '/users/login',
        works: '/works',
        categories: '/categories'
    },
    
    
    UPLOAD_MAX_SIZE: 4 * 1024 * 1024, // 4MB
    ALLOWED_EXTENSIONS: ['jpg', 'png'],
    
    
    getUrl(endpoint) {
        return this.API_BASE_URL + this.ENDPOINTS[endpoint];
    },
    
  
    getUrlWithId(endpoint, id) {
        return `${this.API_BASE_URL}${this.ENDPOINTS[endpoint]}/${id}`;
    }
}; 


window.CONFIG = CONFIG;



