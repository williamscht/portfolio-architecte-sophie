// Gestion du formulaire de connexion
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validation côté client
        if (!Utils.validateEmail(email)) {
            showErrorMessage('Veuillez saisir un email valide');
            return;
        }

        if (!password.trim()) {
            showErrorMessage('Veuillez saisir un mot de passe');
            return;
        }

        try {
            const result = await Auth.login(email, password);
            
            if (result.success) {
                window.location.href = 'index.html';
            } else {
                showErrorMessage(result.error || 'Erreur de connexion');
            }
        } catch (error) {
            showErrorMessage('Erreur de connexion au serveur');
        }
    });

    function showErrorMessage(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            errorMessage.className = 'error-message';
        } else {
            Utils.showErrorMessage(message);
        }
    }
});