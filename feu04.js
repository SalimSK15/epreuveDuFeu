const chalk = require('chalk');
const log = console.log;
const clrCasetrouver = [chalk.blue.bold,chalk.red.bold,chalk.green.bold.italic,chalk.gray];

var fs = require('fs');
const args = process.argv;
var monPlateau = args[2];
var plateau = []
let tabIndexTaileCarre = [];

//*********************************** gestion d'erreurs
function gestionErrOk(){
    if(args.length < 3){
        console.log("peut d'arguments !");
        return false;    
    }else{
        if(args.length > 3){
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
//*********************************** lire le fichier fich & le mettre en matrice dans fichAmodifier
function plateauToMatrice(fich,fichAmodifier){
    let F1 = [];

    for (let i = 5; i < fich.length; i++){        
        if(fich[i] == "\n"){            
            fichAmodifier.push(F1);
            F1 = [];
        }else{
            if(fich[i] != " ")         
                F1.push(fich[i]);
        }
    }    
    fichAmodifier.push(F1);
}
function transformeCharInt(){
    let tabObstacle = [];

    for(let i = 0; i < plateau.length; i++){
        for(let j = 0; j < plateau[i].length; j++){
            if(plateau[i][j] == "x"){
                tabObstacle[j] = "x";
            }else{
                if(tabObstacle[j] != "x")
                    tabObstacle[j] = ".";
            }
        }
        let compteur = 0;

        for(let k = 0; k < tabObstacle.length; k++){
            if(tabObstacle[k] == "x"){
                compteur++;
            }
            plateau[i][k] = compteur;
        }
    }
}
function tailleCarreMax(x,y,tailleCarreDebut){
    let d = [x,y,tailleCarreDebut];
    let nbObstacle;
    do {
        if(x == 0 && y == 0){
            nbObstacle = plateau[d[2]][d[2]];
            if(nbObstacle == 0){
                d[2]++;
                tabIndexTaileCarre.push([x,y,d[2]]);
            }else{
                return d;
            }
        }else{
            if(x == 0 && y > 0){
                nbObstacle = plateau[d[2]][d[2]+y]-plateau[d[2]][y-1];
                if(nbObstacle == 0){
                    d[2]++;
                    tabIndexTaileCarre.push([x,y,d[2]]);
                }else{
                    return d;
                }
            }else{
                if(x > 0 && y == 0){
                    nbObstacle = plateau[d[2]+x][d[2]]-plateau[x-1][d[2]];
                    if(nbObstacle == 0){
                        d[2]++;
                        tabIndexTaileCarre.push([x,y,d[2]]);
                    }else{
                        return d;
                    } 
                }else{
                    nbObstacle = plateau[(d[2]+x)][(d[2]+y)]-plateau[d[2]+x][y-1]-plateau[x-1][d[2]+y]+plateau[x-1][y-1];
                    if(nbObstacle == 0){
                        d[2]++;
                        tabIndexTaileCarre.push([x,y,d[2]]);
                    }else{
                        return d;
                    }
                }
            }
        }
    } while (d[2] < plateau.length);
    return d;
}
function grandCarre(){
    let tailleCarre = [0,0,0];
    
    for(let i = 0; i < plateau.length-tailleCarre[2]-1; i++){
        for(let j = 0; j < ((plateau[i].length)-tailleCarre[2]); j++){
            tailleCarre = tailleCarreMax(i,j,tailleCarre[2]);
        }
    }
}
function afficheGrandCarre(carte,active){
    if(active){
        for(let i = 0; i < carte.length; i++){
            let ligne = "";
            for(let j = 0; j < carte[i].length; j++){        
                ligne += " "+carte[i][j]; 
            }
            console.log(ligne+"\n");
        }
    }else{

        let res = tabIndexTaileCarre.pop();         
        for(let i = res[0]; i < res[0]+res[2]; i++){
            for(let j = res[1]; j < res[1]+res[2]; j++){
                carte[i][j] = clrCasetrouver[0]("o");
            }
        }

        for(let i = 0; i < carte.length; i++){
            let ligne = "";
            for(let j = 0; j < carte[i].length; j++){        
                ligne += " "+carte[i][j]; 
            }
            console.log(ligne+"\n");
        }
    }
    
}
//********************************** resolution
if(gestionErrOk()){
    let plateau02 = [];
    plateauToMatrice(lireFichier(monPlateau),plateau02);
 //   afficheGrandCarre(plateau02,true);
    plateauToMatrice(lireFichier(monPlateau),plateau);
    transformeCharInt();
    grandCarre();
    afficheGrandCarre(plateau02,false);
}