const chalk = require('chalk');
const log = console.log;
const clrCasetrouver = [chalk.blue.bold,chalk.red.bold,chalk.green.bold.italic,chalk.gray];

var fs = require('fs');
const args = process.argv;
var nomFichier = args[2];
var sudoku = []
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
// ********************************* affichage du sudoku
function affichMatriceSudoku(sudoku){
    let cellule = "";
    log(chalk.grey.bold("___________________"));
    for(let i = 0; i < sudoku.length; i++){
        for (let j = 0; j < sudoku[i].length; j++){

            if(sudoku[i][j] == "."){
                if(j== 0 || j == 3 || j == 6){                    
                    cellule += chalk.grey.bold("|")+chalk.red.bold(sudoku[i][j]);
                }else
                    if(j == sudoku.length-1)
                        cellule += "|"+chalk.red.bold(sudoku[i][j])+chalk.grey.bold("|");
                    else
                        cellule += "|"+chalk.red.bold.bold(sudoku[i][j]); 
            }else
                if(j == 0 || j == 3 || j == 6){                    
                    cellule += chalk.grey.bold("|")+sudoku[i][j];
                }else
                    if(j == sudoku.length-1){
                        cellule += "|"+sudoku[i][j]+chalk.grey.bold("|");
                    }else{
                        cellule += "|"+sudoku[i][j];
                    }
        }
        if(i == 3 || i == 6){
            log(chalk.grey.bold("___________________"));
        }
        console.log(cellule);
        cellule = "";
    }
    log(chalk.grey.bold("___________________"));
}
function trouverCaseVide(sudoku){
    let tabIndex = [];
    for(let i = 0; i < sudoku.length; i++){
        for(let j = 0; j < sudoku[i].length; j++){
            if(sudoku[i][j] == (".")){
                tabIndex.push(i,j);
                return tabIndex;
            }
        }
    }
    return null;
}
function chiffrePossible(x,y,chiffre){
    //verifier si le chiffre existe deja dans la ligne    
    for(let i = 0; i < 9;i++){
        if(sudoku[x][i] == chiffre){
            return false;
        }
    }
    //verifier si le chiffre existe deja dans la colonne
    for(let i = 0; i < 9;i++){
        if(sudoku[i][y] == chiffre){
            return false;
        }   
    }
    //verifier si le chiffre existe deja dans le (bloc 3x3)
    let ligneX = Math.floor(x / 3) * 3;
    let colonneY = Math.floor(y / 3) * 3;

    for(let i = ligneX; i < ligneX+3 ;i++){
        for(let j = colonneY ; j < colonneY+3; j++){
            if(sudoku[i][j] == chiffre){
                return false;
            }
        }
    }
    return true;
}
function ResBacktracking(sudoku){
    let indexCaseVide = trouverCaseVide(sudoku);
    
    if(indexCaseVide == null){
        return true;
    }
            for(let i = 1; i < 10; i++){
                if( (chiffrePossible(indexCaseVide[0],indexCaseVide[1],i))){
                    sudoku[indexCaseVide[0]][indexCaseVide[1]] = i;                    
                    if(ResBacktracking(sudoku)){
                        return true;
                    } 
                    sudoku[indexCaseVide[0]][indexCaseVide[1]] = (".");
                }
            }
            return false;
        
};
function recuperPaireCaseVide(){
    var tab = [];
        
    for(let i = 0; i < sudoku.length; i++){
        for(let j = 0; j < sudoku[i].length; j++){
            if(sudoku[i][j] == (".")){
                tab.push([i,j]);
            }
        }
    }
    return tab;
}
function colorerCaseTrouver(paire){
    for(let i = 0; i < paire.length; i++){
        sudoku[paire[i][0]][paire[i][1]] = chalk.blue.bold(sudoku[paire[i][0]][paire[i][1]]);
    }
}
//********************************** resolution
if(gestionErrOk()){
    transformFichierMatrice(lireFichier(nomFichier),sudoku);
    let tabPaires = recuperPaireCaseVide();
    
    affichMatriceSudoku(sudoku);
    console.log(clrCasetrouver[2]('|--------------------------------------|'));

    if(ResBacktracking(sudoku)){
        console.log(clrCasetrouver[3]("************")+clrCasetrouver[2]("-SUDOKU Resolu -")+clrCasetrouver[3]("***********"));
        colorerCaseTrouver(tabPaires);
        affichMatriceSudoku(sudoku);
    }else{
        console.log(clrCasetrouver[3]("*****")+clrCasetrouver[1].bgWhite("-SUDOKU n'a pa de solution !-")+clrCasetrouver[3]("*****"));
    }
}