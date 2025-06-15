function isLoggedIn() {
    return localStorage.getItem('authToken') !== null;
}

function logout() {
    localStorage.removeItem('authToken');
    window.location.reload();
}

function updateNavigation() {
    const loginLink = document.querySelector('nav a[href*="login"]');
    
    if (isLoggedIn()) {
        if (loginLink) {
            loginLink.textContent = 'logout';
            loginLink.href = '#';
            loginLink.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
        
        addEditModeBar();
        addModifyButton();
        hideFiltersForAdmin()
    }
}

function addEditModeBar() {
    if (document.querySelector('.edit-mode-bar')) return;
    
    const editBar = document.createElement('div');
    editBar.className = 'edit-mode-bar';
    editBar.innerHTML = '<i class="fa-solid fa-pen-to-square";"></i> Mode édition';
    document.body.classList.add('edit-mode');
    document.body.insertBefore(editBar, document.body.firstChild);
}

function addModifyButton() {
    const portfolioTitle = document.querySelector('#portfolio h2');
    if (portfolioTitle && !document.querySelector('.modify-btn')) {
        const modifyBtn = document.createElement('button');
        modifyBtn.className = 'modify-btn';
        modifyBtn.innerHTML = '<i class="fa-solid fa-pen-to-square";"></i> modifier';
        modifyBtn.addEventListener('click', openModal);
        portfolioTitle.insertAdjacentElement('afterend', modifyBtn);
        
        const titleContainer = document.createElement('div');
        titleContainer.className = 'portfolio-title-container';
        
        portfolioTitle.parentNode.insertBefore(titleContainer, portfolioTitle);
        titleContainer.appendChild(portfolioTitle);
        titleContainer.appendChild(modifyBtn);
    }
}

function hideFiltersForAdmin() {
    const filtersContainer = document.querySelector('.filters');
    if (filtersContainer) {
        filtersContainer.style.display = 'none';
    }
}


function createModal() {
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modal-title">Galerie photo</h3>
                <span class="modal-close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="modal-gallery"></div>
                <hr class="modal-separator">
                <button class="btn-add-photo">Ajouter une photo</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    loadWorksInModal(modal);
    return modal;
}

async function loadWorksInModal(modal) {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
        
        const gallery = modal.querySelector('.modal-gallery');
        gallery.innerHTML = '';
        
        works.forEach(work => {
            const workItem = document.createElement('div');
            workItem.className = 'modal-work-item';
            workItem.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}">
                <i class="fa-solid fa-trash-can delete-icon" data-id="${work.id}"></i>
            `;
            gallery.appendChild(workItem);
        });
        
    } catch (error) {
        console.error('Erreur lors du chargement des travaux:', error);
    }
}

function openModal() {
    const modal = createModal();
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) modal.remove();
}


document.addEventListener('DOMContentLoaded', updateNavigation);