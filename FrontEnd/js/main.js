async function api() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const works = await reponse.json();
    console.log(works);

    for (let i = 0; i < works.length; i++) {
        CreateFigure(works[i]);
    }
}


function CreateFigure(data) {
    const FigureCard = document.createElement("figure")
    FigureCard.innerHTML = `<img src=${data.imageUrl} alt=${data.title}><figcaption>${data.title}</figcaption>`;
    document.querySelector(".gallery").appendChild(FigureCard);

}

api()