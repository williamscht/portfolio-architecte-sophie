async function fetchWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        const works = await response.json();
        console.log(works);

        for (let i = 0; i < works.length; i++) {
            createFigure(works[i]);
        }
        return works;
    }   catch (error) {
        console.error(error);
    }
}


function createFigure(data) {
    const figureCard = document.createElement("figure")
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
    try {
      const response = await fetch("http://localhost:5678/api/categories");
  
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
  
      const categories = await response.json(); 
      console.log(categories);
      return categories;
    } catch (error) {
      console.error(error);
    }
  }

  

function generateFilterButtons(categories, works) {
    const filterContainer = document.querySelector(".filters");
    filterContainer.innerHTML = "";
  
   
    const allButton = document.createElement("button");
    allButton.innerText = "Tous";
    allButton.addEventListener("click", () => {
        generateGallery(works);
    });
    filterContainer.appendChild(allButton);
  
    
    categories.forEach(category => {
      const button = document.createElement("button");
      button.innerText = category.name;
  
      button.addEventListener("click", () => {
        const filteredWorks = works.filter(work => work.categoryId === category.id);
        generateGallery(filteredWorks);
      });
  
      filterContainer.appendChild(button);
    });
  }
  












  async function init() {
    const works = await fetchWorks();
    const categories = await fetchCategories();
    generateGallery(works);
    generateFilterButtons(categories, works);
  }

  init ();