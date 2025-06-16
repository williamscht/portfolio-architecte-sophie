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
                <button class="nav-back" style="display: none;">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <h3 id="modal-title">Galerie photo</h3>
                <span class="modal-close">&times;</span>
            </div>
            <div class="modal-body">
                <!-- Vue 1 : Galerie -->
                <div id="gallery-view" class="modal-view active">
                    <div class="modal-gallery"></div>
                    <hr class="modal-separator">
                    <button class="btn-add-photo">Ajouter une photo</button>
                </div>
                
                <!-- Vue 2 : Formulaire d'ajout -->
                <div id="add-view" class="modal-view">
                    <form id="add-work-form">
                        <div class="upload-zone">
                            <div class="upload-placeholder">
                                <i class="fa-regular fa-image"></i>
                                <button type="button" class="btn-upload">+ Ajouter photo</button>
                                <p class="upload-info">jpg, png : 4mo max</p>
                            </div>
                            <input type="file" id="image-input" accept="image/jpeg,image/png" style="display: none;">
                            <img id="preview-image" style="display: none;">
                        </div>
                        
                        <div class="form-group">
                            <label for="title-input">Titre</label>
                            <input type="text" id="title-input" name="title">
                        </div>
                        
                        <div class="form-group">
                            <label for="category-select">Catégorie</label>
                            <select id="category-select" name="category">
                                <option value=""></option>
                            </select>
                        </div>
                        
                        <hr class="modal-separator">
                        <button type="submit" class="btn-validate" disabled>Valider</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    loadWorksInModal(modal);
    setupModalNavigation(modal);
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
            
          
            const deleteIcon = workItem.querySelector('.delete-icon');
            deleteIcon.addEventListener('click', function() {
                handleDelete(work.id, workItem);
            });
            
            gallery.appendChild(workItem);
        });
        
    } catch (error) {
        console.error('Erreur lors du chargement des travaux:', error);
    }
}

function openModal() {
    const modal = createModal();
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) modal.remove();
}


async function deleteWork(workId) {
    try {
     
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            alert('Vous devez être connecté pour supprimer un projet');
            return false;
        }

       
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            console.log(`Projet ${workId} supprimé avec succès`);
            return true;
        } else {
            console.error('Erreur lors de la suppression:', response.status);
            alert('Erreur lors de la suppression du projet');
            return false;
        }

    } catch (error) {
        console.error('Erreur réseau:', error);
        alert('Erreur de connexion lors de la suppression');
        return false;
    }
}

async function handleDelete(workId, workElement) {
    showConfirmModal(
        'Êtes-vous sûr de vouloir supprimer ce projet ?',
        async () => {
            workElement.style.opacity = '0.5';
            
            const success = await deleteWork(workId);
            
            if (success) {
                workElement.remove();
                updateMainGallery();
                showSuccessMessage('Projet supprimé avec succès !');
            } else {
                workElement.style.opacity = '1';
            }
        },
        () => {
            console.log('Suppression annulée');
        }
    );
}

async function updateMainGallery() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
        generateGallery(works);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la galerie:', error);
    }
}



function showConfirmModal(message, onConfirm, onCancel) {
    const confirmModal = document.createElement('div');
    confirmModal.className = 'confirm-modal';
    confirmModal.innerHTML = `
        <div class="confirm-content">
            <p>${message}</p>
            <div class="confirm-buttons">
                <button class="btn-cancel">Annuler</button>
                <button class="btn-confirm">Confirmer</button>
            </div>
        </div>
    `;

    confirmModal.querySelector('.btn-confirm').addEventListener('click', () => {
        confirmModal.remove();
        onConfirm();
    });

    confirmModal.querySelector('.btn-cancel').addEventListener('click', () => {
        confirmModal.remove();
        if (onCancel) onCancel();
    });

    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            confirmModal.remove();
            if (onCancel) onCancel();
        }
    });

    document.body.appendChild(confirmModal);
}

function showSuccessMessage(message) {
   
    const successModal = document.createElement('div');
    successModal.className = 'success-modal-centered';
    successModal.innerHTML = `
        <div class="success-content-centered">
            <i class="fa-solid fa-check-circle"></i>
            <p>${message}</p>
            <button class="btn-success-ok">Ok</button>
        </div>
    `;

 
    successModal.querySelector('.btn-success-ok').addEventListener('click', () => {
        successModal.remove();
    });

   
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.remove();
        }
    });

    document.body.appendChild(successModal);
}



function setupModalNavigation(modal) {
    const galleryView = modal.querySelector('#gallery-view');
    const addView = modal.querySelector('#add-view');
    const modalTitle = modal.querySelector('#modal-title');
    const navBack = modal.querySelector('.nav-back');
    const btnAddPhoto = modal.querySelector('.btn-add-photo');

   
    btnAddPhoto.addEventListener('click', function() {
        galleryView.classList.remove('active');
        addView.classList.add('active');
        modalTitle.textContent = 'Ajout photo';
        navBack.style.display = 'block';
        
       
        loadCategories(modal);
        setupFileUpload(modal);
        setupFormSubmission(modal)
    });

  
    navBack.addEventListener('click', function() {
        addView.classList.remove('active');
        galleryView.classList.add('active');
        modalTitle.textContent = 'Galerie photo';
        navBack.style.display = 'none';
        
        
        resetForm(modal);
    });
}

async function loadCategories(modal) {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();
        
        const categorySelect = modal.querySelector('#category-select');
        categorySelect.innerHTML = '<option value=""></option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
        
    } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
    }
}

function resetForm(modal) {
    const form = modal.querySelector('#add-work-form');
    form.reset();
    

    const previewImage = modal.querySelector('#preview-image');
    const uploadPlaceholder = modal.querySelector('.upload-placeholder');
    previewImage.style.display = 'none';
    uploadPlaceholder.style.display = 'flex';
    
  
    const validateBtn = modal.querySelector('.btn-validate');
    validateBtn.disabled = true;
}


function setupFileUpload(modal) {
    const btnUpload = modal.querySelector('.btn-upload');
    const fileInput = modal.querySelector('#image-input');
    const previewImage = modal.querySelector('#preview-image');
    const uploadPlaceholder = modal.querySelector('.upload-placeholder');

    
    btnUpload.addEventListener('click', function() {
        fileInput.click();
    });

  
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                uploadPlaceholder.style.display = 'none';
                checkFormValidity(modal);
            };
            reader.readAsDataURL(file);
        }
    });

    
    const titleInput = modal.querySelector('#title-input');
    const categorySelect = modal.querySelector('#category-select');
    titleInput.addEventListener('input', () => checkFormValidity(modal));
    categorySelect.addEventListener('change', () => checkFormValidity(modal));
}

function checkFormValidity(modal) {
    const fileInput = modal.querySelector('#image-input');
    const titleInput = modal.querySelector('#title-input');
    const categorySelect = modal.querySelector('#category-select');
    const validateBtn = modal.querySelector('.btn-validate');

    if (fileInput.files[0] && titleInput.value.trim() && categorySelect.value) {
        validateBtn.disabled = false;
    } else {
        validateBtn.disabled = true;
    }
}


function setupFormSubmission(modal) {
    const form = modal.querySelector('#add-work-form');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault(); 
        
        const formData = new FormData();
        const fileInput = modal.querySelector('#image-input');
        const titleInput = modal.querySelector('#title-input');
        const categorySelect = modal.querySelector('#category-select');
        
      
        formData.append('image', fileInput.files[0]);
        formData.append('title', titleInput.value.trim());
        formData.append('category', categorySelect.value);
        
       
        const success = await submitWork(formData);
        
        if (success) {
          
            returnToGalleryView(modal);
        
            await loadWorksInModal(modal);
            await updateMainGallery();
            showSuccessMessage('Projet ajouté avec succès !');
        }
    });
}


async function submitWork(formData) {
    try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            alert('Vous devez être connecté pour ajouter un projet');
            return false;
        }

        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
               
            },
            body: formData
        });

        if (response.ok) {
            console.log('Projet ajouté avec succès');
            return true;
        } else {
            const errorData = await response.text();
            console.error('Erreur lors de l\'ajout:', response.status, errorData);
            alert('Erreur lors de l\'ajout du projet');
            return false;
        }

    } catch (error) {
        console.error('Erreur réseau:', error);
        alert('Erreur de connexion lors de l\'ajout');
        return false;
    }
}

function returnToGalleryView(modal) {
    const galleryView = modal.querySelector('#gallery-view');
    const addView = modal.querySelector('#add-view');
    const modalTitle = modal.querySelector('#modal-title');
    const navBack = modal.querySelector('.nav-back');

    addView.classList.remove('active');
    galleryView.classList.add('active');
    modalTitle.textContent = 'Galerie photo';
    navBack.style.display = 'none';
    
   
    resetForm(modal);
}








document.addEventListener('DOMContentLoaded', updateNavigation);