// Point d'entrée principal et gestion de la galerie
async function fetchWorks() {
    try {
        return await API.getWorks();
    } catch (error) {
        console.error('Erreur lors du chargement des travaux:', error);
        Utils.showErrorMessage('Impossible de charger les projets');
        return [];
    }
}

function createFigure(data) {
    const figureCard = document.createElement("figure");
    figureCard.innerHTML = `<img src="${data.imageUrl}" alt="${data.title}"><figcaption>${data.title}</figcaption>`;
    document.querySelector(".gallery").appendChild(figureCard);
}

function generateGallery(works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    works.forEach(work => {
        createFigure(work);
    });
}

async function fetchCategories() {
    return await API.getCategories();
}

function setActiveButton(activeButton) {
    document.querySelectorAll('.filters button').forEach(btn => {
        btn.classList.remove('active');
    });
    activeButton.classList.add('active');
}

function generateFilterButtons(categories, works) {
    const filterContainer = document.querySelector(".filters");
    if (!filterContainer) return;
    
    filterContainer.innerHTML = "";

    const allButton = document.createElement("button");
    allButton.innerText = "Tous";
    allButton.classList.add("active");
    allButton.addEventListener("click", () => {
        generateGallery(works);
        setActiveButton(allButton);
    });
    filterContainer.appendChild(allButton);

    categories.forEach(category => {
        const button = document.createElement("button");
        button.innerText = category.name;

        button.addEventListener("click", () => {
            const filteredWorks = works.filter(work => work.categoryId === category.id);
            generateGallery(filteredWorks);
            setActiveButton(button);
        });

        filterContainer.appendChild(button);
    });
}

async function init() {
    try {
        const hasInternet = await Utils.checkInternetConnection();
        if (!hasInternet) {
            Utils.showErrorMessage('Pas de connexion internet. Vérifiez votre réseau.');
            return;
        }

        const isConnected = await API.checkConnection();
        if (!isConnected) {
            Utils.showErrorMessage('Impossible de se connecter au serveur. Vérifiez que le backend est activé. Contactez l\'assistance technique.');
            return;
        }

        const works = await fetchWorks();
        const categories = await API.getCategories();
        
        generateGallery(works);
        generateFilterButtons(categories, works);
        
        UI.updateNavigation();
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        Utils.showErrorMessage('Erreur lors du chargement de la page');
    }
}

document.addEventListener('DOMContentLoaded', init);

window.generateGallery = generateGallery;