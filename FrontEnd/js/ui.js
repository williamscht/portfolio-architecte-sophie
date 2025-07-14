const UI = {
    updateNavigation() {
        const loginLink = document.querySelector('nav a[href*="login"]');
        
        if (Auth.isLoggedIn()) {
            if (loginLink) {
                loginLink.textContent = 'logout';
                loginLink.href = '#';
                
                const newLoginLink = loginLink.cloneNode(true);
                loginLink.parentNode.replaceChild(newLoginLink, loginLink);
                
                newLoginLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    Auth.logout();
                });
            }
            
            this.addEditModeBar();
            this.addModifyButton();
            this.hideFiltersForAdmin();
        }
    },

    addEditModeBar() {
        if (document.querySelector('.edit-mode-bar')) return;
        
        const editBar = document.createElement('div');
        editBar.className = 'edit-mode-bar';
        editBar.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Mode édition';
        
        document.body.classList.add('edit-mode');
        document.body.insertBefore(editBar, document.body.firstChild);
    },

    addModifyButton() {
        const portfolioTitle = document.querySelector('#portfolio h2');
        if (portfolioTitle && !document.querySelector('.modify-btn')) {
            const modifyBtn = document.createElement('button');
            modifyBtn.className = 'modify-btn';
            modifyBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> modifier';
            modifyBtn.addEventListener('click', () => Modal.open());
            portfolioTitle.insertAdjacentElement('afterend', modifyBtn);
        }
    },

    hideFiltersForAdmin() {
        const filtersContainer = document.querySelector('.filters');
        if (filtersContainer) {
            filtersContainer.classList.add('filters-hidden');
        }
    },

    async updateMainGallery() {
        try {
            const works = await API.getWorks();
            if (typeof generateGallery === 'function') {
                generateGallery(works);
            }
        } catch (error) {
            console.error('Erreur mise à jour galerie:', error);
            Utils.showErrorMessage('Erreur lors de la mise à jour de la galerie');
        }
    },

    showFiltersForVisitors() {
        const filtersContainer = document.querySelector('.filters');
        if (filtersContainer) {
            filtersContainer.classList.remove('filters-hidden');
        }
    },

    resetToVisitorMode() {
        const editBar = document.querySelector('.edit-mode-bar');
        if (editBar) editBar.remove();
        
        const modifyBtn = document.querySelector('.modify-btn');
        if (modifyBtn) modifyBtn.remove();
        
        this.showFiltersForVisitors();
        document.body.classList.remove('edit-mode');
    }
};

window.UI = UI;