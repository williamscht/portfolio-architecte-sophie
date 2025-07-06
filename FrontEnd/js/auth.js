//export const isLoggedIn = () => localStorage.getItem('authToken') !== null;

const Auth = {
    
    // TODO
    isLoggedIn: () => localStorage.getItem('authToken') !== null,

   
    getToken() {
        return localStorage.getItem('authToken');
    },

    
    logout() {
        localStorage.removeItem('authToken');
        document.body.classList.remove('edit-mode');
        window.location.reload();
    },

    
    async login(email, password) {
        try {
            const data = await API.login(email, password);
            localStorage.setItem('authToken', data.token);
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

   
    async validateToken() {
        if (!this.isLoggedIn()) return false;
  
        const isRetrieve = await API.getWorks();
        if (!isRetrieve) {
            this.logout();
            return false;
        }

        return true;
    }
};

window.Auth = Auth;