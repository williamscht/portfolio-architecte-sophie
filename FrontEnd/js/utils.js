const Utils = {
    showConfirmModal(message, onConfirm, onCancel) {
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
            if (onConfirm) onConfirm();
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
    },

    showSuccessMessage(message) {
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
    },

    showErrorMessage(message) {
        const errorModal = document.createElement('div');
        errorModal.className = 'error-modal-centered';
        errorModal.innerHTML = `
            <div class="error-content-centered">
                <i class="fa-solid fa-exclamation-triangle"></i>
                <p>${message}</p>
                <button class="btn-error-ok">Ok</button>
            </div>
        `;

        errorModal.querySelector('.btn-error-ok').addEventListener('click', () => {
            errorModal.remove();
        });

        errorModal.addEventListener('click', (e) => {
            if (e.target === errorModal) {
                errorModal.remove();
            }
        });

        document.body.appendChild(errorModal);
    },

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },


    async checkInternetConnection() {
        try {
            await fetch('https://www.google.com/favicon.ico', {
                method: 'HEAD',
                mode: 'no-cors'
            });
            return true;
        } catch {
            return false;
        }
    }
};

window.Utils = Utils;