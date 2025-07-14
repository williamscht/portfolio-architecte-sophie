const Modal = {
    currentModal: null,

    open() {
        this.currentModal = this.create();
        this.setupEvents(this.currentModal);
        this.currentModal.classList.add('modal-visible');
    },

    close() {
        if (this.currentModal) {
            this.currentModal.classList.remove('modal-visible');
            this.currentModal = null;
        }
    },

    create() {
        const modal = document.getElementById('modal-template');

        // Nettoyer la galerie avant d'afficher
        const gallery = modal.querySelector('.modal-gallery');
        gallery.innerHTML = '';

        // S'assurer qu'on est sur la vue galerie
        const galleryView = document.getElementById('gallery-view');
        const addView = document.getElementById('add-view');
        galleryView.classList.add('active');
        addView.classList.remove('active');

        // Reset du titre
        const modalTitle = document.getElementById('modal-title');
        modalTitle.textContent = 'Galerie photo';

        // Charger les données
        this.loadWorks(modal);
        this.setupNavigation(modal);

        return modal;
    },


    setupEvents(modal) {
        modal.querySelector('.modal-close').addEventListener('click', () => this.close());

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });
    },

    async loadWorks(modal) {
        try {
            const works = await API.getWorks();
            const gallery = modal.querySelector('.modal-gallery');
            gallery.innerHTML = '';

            works.forEach(work => {
                this.createWorkItem(work, gallery);
            });
        } catch (error) {
            console.error('Erreur chargement travaux modale:', error);
            Utils.showErrorMessage('Erreur lors du chargement des projets');
        }
    },

    createWorkItem(work, gallery) {
        const workItem = document.createElement('div');
        workItem.className = 'modal-work-item';
        workItem.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <i class="fa-solid fa-trash-can delete-icon" data-id="${work.id}"></i>
        `;

        const deleteIcon = workItem.querySelector('.delete-icon');
        deleteIcon.addEventListener('click', () => {
            this.handleDelete(work.id, workItem);
        });

        gallery.appendChild(workItem);
    },

    async handleDelete(workId, workElement) {
        Utils.showConfirmModal(
            'Êtes-vous sûr de vouloir supprimer ce projet ?',
            async () => {
                workElement.classList.add('element-fading');

                try {
                    await API.deleteWork(workId);
                    workElement.remove();
                    UI.updateMainGallery();
                    Utils.showSuccessMessage('Projet supprimé avec succès !');
                } catch (error) {
                    console.error('Erreur deleteWork:', error);
                    workElement.classList.remove('element-fading');
                    Utils.showErrorMessage('Erreur lors de la suppression');
                }
            },
            () => {
                console.log('Suppression annulée');
            }
        );
    },

    setupNavigation(modal) {
        const galleryView = document.getElementById('gallery-view');
        const addView = document.getElementById('add-view');
        const modalTitle = document.getElementById('modal-title');
        const navBack = modal.querySelector('.nav-back');
        const btnAddPhoto = modal.querySelector('.btn-add-photo');

        btnAddPhoto.addEventListener('click', () => {
            galleryView.classList.remove('active');
            addView.classList.add('active');
            modalTitle.textContent = 'Ajout photo';

            this.loadCategories(modal);
            this.setupFileUpload(modal);
            this.setupFormSubmission(modal);
        });

        navBack.addEventListener('click', () => {
    
            if (addView.classList.contains('active')) {
              
                addView.classList.remove('active');
                galleryView.classList.add('active');
                modalTitle.textContent = 'Galerie photo';
                this.resetForm(modal);
            } else {
                
                this.close();
            }
        });
    },

    async loadCategories(modal) {
        try {
            const categories = await API.getCategories();
            const categorySelect = document.getElementById('category-select');
            categorySelect.innerHTML = '<option value=""></option>';

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erreur chargement catégories:', error);
            Utils.showErrorMessage('Erreur lors du chargement des catégories');
        }
    },

    setupFileUpload(modal) {
        const btnUpload = modal.querySelector('.btn-upload');
        const fileInput = document.getElementById('image-input');
        const previewImage = document.getElementById('preview-image');
        const uploadPlaceholder = modal.querySelector('.upload-placeholder');

        fileInput.replaceWith(fileInput.cloneNode(true));
        const newFileInput = document.getElementById('image-input');


        btnUpload.addEventListener('click', () => {
            newFileInput.click();
        });

        newFileInput.addEventListener('change', () => {
            const file = newFileInput.files[0];
            if (file) {
                if (!this.validateFile(file)) return;

                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImage.src = e.target.result;
                    previewImage.classList.add('preview-visible');
                    uploadPlaceholder.classList.add('upload-hidden');
                    this.checkFormValidity(modal);
                };
                reader.readAsDataURL(file);
            }
        });

        const titleInput = modal.querySelector('#title-input');
        const categorySelect = modal.querySelector('#category-select');

        titleInput.addEventListener('input', () => this.checkFormValidity(modal));
        categorySelect.addEventListener('change', () => this.checkFormValidity(modal));
    },

    validateFile(file) {
        const maxSize = CONFIG.UPLOAD_MAX_SIZE;
        const allowedTypes = ['image/jpeg', 'image/png'];

        if (file.size > maxSize) {
            Utils.showErrorMessage('Le fichier est trop volumineux (max 4MB)');
            return false;
        }

        if (!allowedTypes.includes(file.type)) {
            Utils.showErrorMessage('Format de fichier non autorisé (JPG, PNG uniquement)');
            return false;
        }

        return true;
    },

    checkFormValidity(modal) {
        const fileInput = document.getElementById('image-input');
        const titleInput = document.getElementById('title-input');
        const categorySelect = document.getElementById('category-select');
        const validateBtn = modal.querySelector('.btn-validate');

        const isValid = fileInput.files[0] &&
            titleInput.value.trim() &&
            categorySelect.value;

        validateBtn.disabled = !isValid;
    },

    setupFormSubmission(modal) {
        const form = document.getElementById('add-work-form');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData();
            const fileInput = document.getElementById('image-input');
            const titleInput = document.getElementById('title-input');
            const categorySelect = document.getElementById('category-select');

            formData.append('image', fileInput.files[0]);
            formData.append('title', titleInput.value.trim());
            formData.append('category', categorySelect.value);

            try {
                await API.addWork(formData);
                this.returnToGalleryView(modal);
                await this.loadWorks(modal);
                await UI.updateMainGallery();
                Utils.showSuccessMessage('Projet ajouté avec succès !');
            } catch (error) {
                Utils.showErrorMessage('Erreur lors de l\'ajout du projet');
            }
        });
    },

    returnToGalleryView(modal) {
        const galleryView = document.getElementById('gallery-view');
        const addView = document.getElementById('add-view');
        const modalTitle = document.getElementById('modal-title');
        const navBack = modal.querySelector('.nav-back');

        addView.classList.remove('active');
        galleryView.classList.add('active');
        modalTitle.textContent = 'Galerie photo';

        this.resetForm(modal);
    },

    resetForm(modal) {
        const form = document.getElementById('add-work-form');
        form.reset();

        const previewImage = document.getElementById('preview-image');
        const uploadPlaceholder = modal.querySelector('.upload-placeholder');
        previewImage.classList.remove('preview-visible');
        previewImage.src = '';
        uploadPlaceholder.classList.remove('upload-hidden');

        const validateBtn = modal.querySelector('.btn-validate');
        validateBtn.disabled = true;
    }
};

window.Modal = Modal;