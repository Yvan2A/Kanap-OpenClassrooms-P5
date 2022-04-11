// Fonction exécutée au chargement de la page
main();

// Récupération des articles de l'API avec la fonction getArticles et la méthode FETCH
async function getArticles() {
  var res = await fetch('http://localhost:3000/api/products');
  return await res.json();
}

// Création de la fonction principale main()
async function main() {
  var result = await getArticles()

    // Création d'un tableau de données
    .then(function (resultatAPI) {
      const articles = resultatAPI;
      console.table(articles);
      
    // Répartition des données de l'API dans le DOM  
      for (let article in articles) {

        // Insertion de l'élément "a" + Ajout du href pour les ajouter les données et leur id
        let productLink = document.createElement('a');
        document.querySelector('.items').appendChild(productLink);
        productLink.href = `product.html?id=${resultatAPI[article]._id}`;

        // Insertion de l'élément "article" + lien à la balise <a>
        let productArticle = document.createElement('article');
        productLink.appendChild(productArticle);

        // Insertion de l'image + lien à la balise <article> + ajout 2 attributs (src + alt)
        let productImg = document.createElement('img');
        productArticle.appendChild(productImg);
        productImg.src = resultatAPI[article].imageUrl;
        productImg.alt = resultatAPI[article].altTxt;

        // Insertion du titre "h3" + lien à la balise <article> + ajout class html et récupérations des données
        let productName = document.createElement('h3');
        productArticle.appendChild(productName);
        productName.classList.add('productName');
        productName.innerHTML = resultatAPI[article].name;

        // Insertion de la description "p" + lien à la balise <article> + ajout class html et récupération des données
        let productDescription = document.createElement('p');
        productArticle.appendChild(productDescription);
        productDescription.classList.add('productDescription');
        productDescription.innerHTML = resultatAPI[article].description;
      }
    })

    // Création dans la <div> items d'un message d'erreur si les données ne s'affichent pas
    .catch((e) => {
      let productsContainer = document.querySelector('.items');
      productsContainer.innerHTML =
        "Nous n'avons pas réussi à afficher nos produits. Avez vous bien lancé le serveur local (Port 3000) ? <br>Si le problème persiste, contactez-nous.";
      productsContainer.style.textAlign = 'center';
      productsContainer.style.padding = '30vh 0';
    });
}
