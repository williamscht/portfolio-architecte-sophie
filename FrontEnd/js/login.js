document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            window.location.href = 'index.html';
        } else {
            alert('Erreur dans l\'identifiant ou le mot de passe');
        }
    });
});