// Récupération de l'id à partir de l'URL avec search.params
var queryString = window.location.href;
var url = new URL(queryString);
var idProduct = url.searchParams.get('id');
console.log(idProduct);
let article = '';

// Création des constantes couleurs et quantité dans le DOM
const colorPicked = document.querySelector('#colors');
const quantityPicked = document.querySelector('#quantity');

// Fonction permettant d'appeller un article à l'aide de son 'id'
getArticle();

// Récupération des articles de l'API en fonction de leur 'id' avec la méthode FETCH
function getArticle() {
  fetch('http://localhost:3000/api/products/' + idProduct)
    .then((res) => {
      return res.json();
    })

    // Répartition des données de l'API dans un tableau + création fonction getPost
    .then(async function (resultatAPI) {
      article = await resultatAPI;
      console.table(article);
      if (article) {
        getPost(article);
      }
    })
    // message d'erreur
    .catch((error) => {
      let container = document.querySelector('.container');
      container.innerHTML =
        "Nos produits ne s'affichent pas. Etes vous bien sur le serveur local (port 3000) ? <br> En cas de problème, merci de nous contacter";
      container.style.textAlign = 'center';
      container.style.padding = '45vh, 0';
    });
}
// Répartition des données de l'API dans le DOM avec la fonction getPost()
function getPost(article) {

  // Insertion de l'image
  let productImg = document.createElement('img');
  document.querySelector('.item__img').appendChild(productImg);
  productImg.src = article.imageUrl;
  productImg.alt = article.altTxt;

  // Modification du titre "h1"
  let productName = document.getElementById('title');
  productName.innerHTML = article.name;

  // Modification du prix
  let productPrice = document.getElementById('price');
  productPrice.innerHTML = article.price;

  // Modification de la description
  let productDescription = document.getElementById('description');
  productDescription.innerHTML = article.description;

  // Insertion des options de couleurs
  for (let colors of article.colors) {
    console.table(colors);
    let productColors = document.createElement('option');
    document.querySelector('#colors').appendChild(productColors);
    productColors.value = colors;
    productColors.innerHTML = colors;
  }
  addToCart(article);
}

// --------------- Création du panier ---------------------//

//Création de la fonction addToCart, permettant d'ajouter un article au panier avec ses données et ses options
function addToCart(article) {
  const btn_envoyerPanier = document.querySelector('#addToCart');

  //Ecouter le panier avec 2 conditions couleur non nulle et quantité entre 1 et 100
  btn_envoyerPanier.addEventListener('click', (event) => {

    if (colorPicked.value == "" || quantityPicked.value <= 0 || quantityPicked.value > 100) {
      alert(
        "Veuillez choisir une couleur et une quantité comprise entre 1 et 100"
      );
    } else {
      //Recupération du choix de la couleur
      let choixCouleur = colorPicked.value;

      //Recupération du choix de la quantité
      let choixQuantite = quantityPicked.value;

      //Récupération des données de l'article à ajouter au panier
      let optionsProduit = {
        idProduit: idProduct,
        couleurProduit: choixCouleur,
        quantiteProduit: Number(choixQuantite),
        nomProduit: article.name,
        prixProduit: article.price,
        descriptionProduit: article.description,
        imgProduit: article.imageUrl,
        altImgProduit: article.altTxt,
      };
      
      // --------------  Gestion du LocalStorage ---------------- //

      //Initialisation du local storage avec JSON.parse
      let produitLocalStorage = JSON.parse(localStorage.getItem('produit'));/*Récupération des données avec méthode GetItem*/

      //fenêtre pop-up de confirmation de commande 
      const popupConfirmation = () => {
        if (
          window.confirm(`Votre commande de ${choixQuantite} ${article.name} ${choixCouleur} est ajoutée au panier
          Pour consulter votre panier, cliquez sur OK`)
        ) {
          window.location.href = 'cart.html';
        }
      };

      //Importation dans le local storage
    
      //Recherche si le panier comporte déjà au moins 1 article avec find
      if (produitLocalStorage) {
        const resultFind = produitLocalStorage.find(
          (element) =>
            element.idProduit === idProduct && element.couleurProduit === choixCouleur
        );
        //Si le produit commandé est déjà dans le panier (ParseInt + setItem => stringify + table)
        if (resultFind) {
          let newQuantite =
            parseInt(optionsProduit.quantiteProduit) +
            parseInt(resultFind.quantiteProduit);
          resultFind.quantiteProduit = newQuantite;
          localStorage.setItem('produit', JSON.stringify(produitLocalStorage));
          console.table(produitLocalStorage);
          popupConfirmation();

          
          //Si le produit commandé n'est pas dans le panier (push + setItem => stringify + table)
        } else {
          produitLocalStorage.push(optionsProduit);
          localStorage.setItem('produit', JSON.stringify(produitLocalStorage));
          console.table(produitLocalStorage);
          popupConfirmation();
        }
        //Si le panier est vide (on récupère l'array)
      } else {
        produitLocalStorage = [];
        produitLocalStorage.push(optionsProduit);
        localStorage.setItem('produit', JSON.stringify(produitLocalStorage));
        console.table(produitLocalStorage);
        popupConfirmation();
      }
      if (colorPicked.value == null || choixCouleur === "" || choixQuantite == null || quantityPicked.value == 0) {
        alert("Please select a color and quantity")
    }
  }});
}
