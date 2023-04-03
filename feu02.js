var fs = require('fs');
const args = process.argv;
var nomFichier1 = args[2];
var nomFichier2 = args[3];
let fichierBoard = [];
let fichierToFind = [];

//*********************************** gestion d'erreurs
function gestionErrOk(){
    if(args.length < 4){
        console.log("peut d'arguments !");
        return false;    
    }else{
        if(args.length > 4){
            console.log("trop d'arguments !");
            return false;
        }
        return true;
        }
}
// ********************************** lire un fichier
function lireFichier(nomFichier){
    let contenu = fs.readFileSync(nomFichier);
            return (contenu.toString("utf-8"));
}
//*********************************** recuperer le contenu des fichier */
function transformFichierMatrice(fich,fichAmodifier){
    
    let F1 = [];
    for (let i = 0; i < fich.length+1; i++){
        if(fich[i] == "\n"){
            fichAmodifier.push(F1);
            F1 = [];
        }else{
            F1.push(fich[i]);
        }
    }
    F1.pop();
    fichAmodifier.push(F1);
}
// ************************************ fonction de test 
function trouverForme(matrix, submatrix){

    const numRows = matrix.length;
    const numCols = matrix[0].length;
    const subRows = submatrix.length;
    const subCols = submatrix[0].length;
  
    for (let i = 0; i <= numRows-subRows; i++){
      for (let j = 0; j <= numCols-subCols; j++) {
        if (matrix[i][j] === submatrix[0][0]){
          let found = true;
          for (let k = 0; k < subRows; k++) {
            for (let l = 0; l < subCols; l++) {
                if (matrix[i + k][j + l] !== submatrix[k][l] && submatrix[k][l] !== " ") {
                    found = false;
                    break;
                }
            }
            if(!found){
                break;
            }
          }
          if (found) {
            return [i, j];
          }
        }
      }
    }
    return null;
  }
// ************************************ affichage de la matrice
function afficheSubMatrice(tabIndic){
    let mat = "";

    for(i = 0; i < fichierBoard.length;i++){
        for(j = 0; j < fichierBoard[i].length;j++){
            if(i >= tabIndic[0] && j >= tabIndic[1]){
                if(i-tabIndic[0] < fichierToFind.length && j-tabIndic[1] < fichierToFind[0].length){
                    if(fichierToFind[i-tabIndic[0]][j-tabIndic[1]] != " ")
                        mat += fichierToFind[i-tabIndic[0]][j-tabIndic[1]];
                    else 
                        mat += "-";
                }else{
                    mat += "-"
                }
            }else{
                mat += "-";
            }
        }
        console.log(mat);
        mat = "";
    }    
}
//************************************* resolution
if(gestionErrOk()){

    transformFichierMatrice(lireFichier(nomFichier1),fichierBoard);
    transformFichierMatrice(lireFichier(nomFichier2),fichierToFind);
    let resRechercheForme = trouverForme(fichierBoard,fichierToFind); 
    if( resRechercheForme !== null){
        console.log("Trouve !");
        console.log("Coordonnees -> "+resRechercheForme[1]+","+resRechercheForme[0]);
        afficheSubMatrice(resRechercheForme);
    }else{
        console.log("Introuvable");
    }
}
