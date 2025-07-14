const API = {

    async login(email, password) {
        const response = await fetch(CONFIG.getUrl('login'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
    
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Identifiants incorrects');
        }
    },

  
    async getWorks() {
        try {
            const response = await fetch(CONFIG.getUrl('works'));
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Erreur API getWorks:', error);
            return false
        }
    },

    
    async getCategories() {
        try {
            const response = await fetch(CONFIG.getUrl('categories'));
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Erreur API getCategories:', error);
            Utils.showErrorMessage('Impossible de charger les catégories');
            return ['Aucune catégorie trouvée'];
        }
    },

    
    async deleteWork(workId) {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Token d\'authentification manquant');


        const response = await fetch(CONFIG.getUrlWithId('works', workId), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            return true;
        } else {
            throw new Error(`Erreur suppression: ${response.status}`);
        }
    },

    async addWork(formData) {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token d\'authentification manquant');
        }
    
        const response = await fetch(CONFIG.getUrl('works'), {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
    
        if (response.ok) return await response.json();
        
        throw new Error(`Erreur ajout: ${response.status}`);
    },

   
    async checkConnection() {
        try {
            const response = await fetch(CONFIG.getUrl('works'), {
                method: 'HEAD'
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
};


window.API = API;