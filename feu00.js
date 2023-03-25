const chalk = require('chalk');
const log = console.log;

//***************************************************** fonctions utilisees
function siNumerique(argument){
    return /^-?\d+$/.test(argument)
}
function espaceEntreLigne(){
    let chaineEspace = "";

    for(let i = 0; i < valeurEntree01; i++){
        chaineEspace += " ";
    }

    return chaineEspace;
}
//***************************************************** resolution
function rectangle(valeurEntree01,valeurEntree02){
    let schema = "";

    for(let i = 0; i < valeurEntree02; i++){
        schema = "";
        for(let j = 0; j < valeurEntree01; j++){                        
            if((i == 0 && j == 0) 
            || (i == 0 && j == valeurEntree01-1) 
            || (i == valeurEntree02-1 && j ==0) 
            || (i == valeurEntree02-1 && j == valeurEntree01-1)){                
                schema += chalk.blue.bold("O");       
            }
            if((i == 0 && j > 0 && j < valeurEntree01-1) 
            || (i == valeurEntree02-1 && j > 0 && j < valeurEntree01-1)){
                schema+= chalk.magenta.bold("-");
            }
            if(i > 0 && i < valeurEntree02-1 && j > 0 && j < valeurEntree01-1){                
                if(j % 2 == 0){
                    schema += (" ");
                }else{
                    if(i % 2 == 0){
                        schema += chalk.bgWhite(" ");
                    }else
                        schema += chalk.bgBlue(" ");
                }
            }
            if((i > 0 && i < valeurEntree02-1  && j == 0) || (i > 0 && i < valeurEntree02-1  && j == valeurEntree01-1)){                
                schema += chalk.yellow("!");
            }
        }
        //console.log("");
        console.log(schema);
    }
}
//***************************************************** recuperation des argument + parsing
const args = process.argv;
let valeurEntree01;
let valeurEntree02;

function recuperationDonneeSaisiOk(){

    if(siNumerique(args[2])){
        valeurEntree01 = parseInt(args[2]);
        if(valeurEntree01 < 1){
            log(chalk.bgWhite.red.bold.italic("invalide ! : valeur "+valeurEntree01+" est inferieur a 1"));
            return false;    
        }
    }else{
        log(chalk.bgWhite.red.bold.italic("Erreur l'argument ("+args[2]+") invalide !"));
        return false;
    }
    if(siNumerique(args[3])){
        valeurEntree02 = parseInt(args[3]);
        if(valeurEntree02 < 1){
            log(chalk.bgWhite.red.bold.italic("invalide ! : valeur "+valeurEntree02+" est inferieur a 1"));
            return false;    
        }
    }else{
        log(chalk.bgWhite.red.bold.italic("Erreur l'argument ("+args[3]+") invalide !"));
        return false;
    }

    return true;
}


//***************************************************** verification des arguments
function gestionErrOk(args){
    
    if(args.length == 4){
       return true;
    }
    else {
        if( args.length > 4){
            log(chalk.bgWhite.red.bold.italic("Trop d'argument !"));
            return false;
        }
        else {
            log(chalk.bgWhite.red.bold.italic("Peut d'argument !"));
            return false;
        }
    }
}

//*************************************resolution + affichage 
if(gestionErrOk(args)){
    if(recuperationDonneeSaisiOk()){
        rectangle(valeurEntree01,valeurEntree02);
    }
}
