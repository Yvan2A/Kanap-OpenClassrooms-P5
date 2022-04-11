// Fonction main pour récupérer et afficher le numéro de commande
function main(){
  const idNode = document.getElementById("orderId");
  idNode.innerText = localStorage.getItem("orderId");
  console.log(localStorage.getItem("orderId"))
  
  // On vide le localstorage pour réinitialiser le processus d'achat
  localStorage.clear();
}

main();