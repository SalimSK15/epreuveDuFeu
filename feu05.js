const chalk = require('chalk');
const log = console.log;
const clrCasetrouver = [chalk.blue.bold,chalk.bgRed.bold,chalk.green.bold.italic,chalk.gray];

var fs = require('fs');
const args = process.argv;
var fichierLaby = args[2];
var labyrintheMat = [];

// ********************************** lire un fichier
function lireFichier(nomFichier){
    let contenu = fs.readFileSync(nomFichier);
        return (contenu.toString("utf-8"));
}


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
        if(args[2] !== "labyrinthe"){
            console.log('Erreur nom de Fichier! -> \"'+clrCasetrouver[1](args[2])+'\"');
            return false;
        }
        return true;
    }
}

//*********************************** lire le fichier fich & le mettre en matrice dans fichAmodifier
function labyrintheToMatrice(fich,fichAmodifier){
    let F1 = [];

    for (let i = 0; i < fich.length; i++){        
        if(fich[i] == "\n"){            
            fichAmodifier.push(F1);
            F1 = [];
        }else{
            F1.push(fich[i]);
        }
    }    
    fichAmodifier.push(F1);
}
//*********************************** recherche l'entree est la sortie de labyrinthe
function recupESLaby(){
    let tabES = [];
    let E = false;
    let S = false;

    for(let i = 0; i < labyrintheMat.length; i++){
        for(let j = 0; j < labyrintheMat[i].length; j++){
            if(labyrintheMat[i][j] == '1'){
                tabES.push([i,j]);
                E = true;
            }
            if(labyrintheMat[i][j] == '2'){
                tabES.push([i,j]);
                S = true;
            }
        }
    }
    if(E && S ){
        return tabES;
     }

}
//*********************************** retourne le coup total le plus faible  d4un noeud
function coutFaibleNoeud(list){
    let min = list[0][1];
    let noeudFaible = [list[0],0];
    
    for(let i = 0; i < list.length; i++){
        if(list[i][1] < min){
            min = list[i][1];
            noeudFaible = ([list[i],i]);
        }
    }

    return noeudFaible;
}
function voisinsNoeud(noeud){
    let obstacle = '*';
    let tabVoisins = [];

    //voisin haut
    if(noeud[0]-1 >= 0 && labyrintheMat[noeud[0]-1][noeud[1]] != obstacle){
        tabVoisins.push([noeud[0]-1,noeud[1]]);
    }
    //voisin bas
    if(noeud[0]+1 < labyrintheMat.length && labyrintheMat[noeud[0]+1][noeud[1]] != obstacle){
        tabVoisins.push([noeud[0]+1,noeud[1]]);
    }
    //voisin gauche
    if(noeud[1]-1 >= 0 && labyrintheMat[noeud[0]][noeud[1]-1] != obstacle){
        tabVoisins.push([noeud[0],noeud[1]-1]);
    }
    //voisin droite
    if(noeud[1]+1 < labyrintheMat[0].length && labyrintheMat[noeud[0]][noeud[1]+1] != obstacle){
        tabVoisins.push([noeud[0],noeud[1]+1]);
    }
    return tabVoisins;
}
//************************************ fonctione qui permet de rechrcher un point deja visiter
function cherchePoinsListe(list,p){
    for(let i = 0; i < list.length; i++){
        if(p[0] === list[i][0] && p[1] === list[i][1])
            return true;
    }
    return false;
}
function heuristiqueManhattan(p,sortie){
    return Math.abs(p[0]-sortie[0])+Math.abs(p[1]-sortie[1]);
}
//*********************************** algo de Depth First Search DFS
function progAStar(depart,arrivee,arrivee02){
    let frontiere = [[depart,0]];
    
    let visite  = [];
    let parents = new Map();
    let couts    = new Map();

    parents.set(depart,null);
    couts.set(depart,0);
    
    while (frontiere.length > 0) {
        let nCurrent = coutFaibleNoeud(frontiere);
        frontiere.splice(nCurrent[1],1);
        let current = nCurrent[0][0];

        if(current[0] === arrivee[0] && current[1] === arrivee[1]){
            let path = [current];            
        
            while (current !== depart) {
                current = parents.get(current);
                path.unshift(current);
            }
            return path;
        }
        visite.push(current);

        //recuperer les voisins du noeud courent
        let voisinsCurrent = voisinsNoeud(current);      
        
        //evaluer les voisins de chaque noeud courent
        for(let i = 0; i < voisinsCurrent.length; i++){
            if(cherchePoinsListe(visite,voisinsCurrent[i])){
                continue;
            }
            let newCout = couts.get(current)+1;
            if(!cherchePoinsListe(frontiere,voisinsCurrent[i]) || newCout < couts.get(voisinsCurrent[i])){
                couts.set(voisinsCurrent[i],newCout);
                let priority = newCout + heuristiqueManhattan(voisinsCurrent[i],arrivee);
                frontiere.push([voisinsCurrent[i],priority]);
                parents.set(voisinsCurrent[i],current);
            }
        }
    }
    return null;
}
//********************************** affichage du chemin le plus court
function affichChemin(chemin){
    let ligne = "";
    chemin.pop();
    chemin.shift();
    
    for(let i = 0; i < chemin.length; i++){
        labyrintheMat[chemin[i][0]][chemin[i][1]] = clrCasetrouver[0]('o');
    }

    console.log("############### Solution ###############");
    
    for(let i = 0; i < labyrintheMat.length; i++){
        for(let j = 0; j < labyrintheMat[0].length; j++){
            ligne += " "+labyrintheMat[i][j]+" ";    
        }
        console.log(ligne);
        ligne = "";        
    } 
    console.log("SORTIE ATTEINTE EN "+clrCasetrouver[0](chemin.length)+ " COUPS !");
}
//********************************** resolution
let indexDebutFin = [];
if(gestionErrOk()){
    labyrintheToMatrice(lireFichier(fichierLaby),labyrintheMat);
    indexDebutFin = recupESLaby();
    let resltaAStar01 = progAStar(indexDebutFin[0],indexDebutFin[2]);
    let resltaAStar02 = progAStar(indexDebutFin[0],indexDebutFin[1]);
    
    if(resltaAStar01 == null && resltaAStar02 == null){
        log(clrCasetrouver[1].italic("Labyrinthe ne possede pas de solution !"));
    }else{
        if(resltaAStar02 == null){
            affichChemin(resltaAStar01);
        }else
            if(resltaAStar01 == null){
                affichChemin(resltaAStar02);
            }else
                if(resltaAStar01.length < resltaAStar02.length){
                    affichChemin(resltaAStar01);
                }else
                    affichChemin(resltaAStar02);
    }
}