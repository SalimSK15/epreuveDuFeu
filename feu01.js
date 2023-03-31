const chalk = require('chalk');
const log = console.log;
const args = process.argv;
var expressionSaisi = [];

//***************************************************** fonctions utilisees
function siNumerique(argument){
    return /^-?\d+$/.test(argument)
}
//***************************************************** verification des arguments
function gestionErrOk(args){
    
    if(args.length == 3){
       return true;
    }
    else {
        if( args.length > 3){
            log(chalk.bgWhite.red.bold.italic("Trop d'argument !"));
            return false;
        }
        else {
            log(chalk.bgWhite.red.bold.italic("Peut d'argument !"));
            return false;
        }
    }
}
//***************************************************** recuperation des argument
function recuperationExpression(){
    let j = 0;
    val = args[2];
    
    for(let i = 0; i < val.length; i++){
        if(siNumerique(args[2][i])){
            let j = i;
            let nb = "";
            while(siNumerique(args[2][j])){
                nb += args[2][j];
                j++;
            }
            i = j;
            expressionSaisi.push(nb);
            if(args[2][i] != " "){
                expressionSaisi.push(args[2][i]);
            }        
        }else{
            if(args[2][i] != " "){
                expressionSaisi.push(args[2][i]);
            }
        }
    }
}
function prioriteOperation(op){
    if(op == "+" ||  op == "-"){
        return 1;
    }else {
        return 2;
    }
}
function calculer(val1,val2,operateur){
    
    switch (operateur) {
        case "+":
            return val1+val2;
        case "-":
            return val2-val1;
        case "*":
            return val2*val1;
        case "/":
            return val2/val1;
        case "%":
            return val2%val1;
    }
}
//********************************************** fonction qui permet de sauvegarder les parentheses ouvrantes et fermantes 
function indiceParenthese (formule){
    let tabIndParethese = [];
    let parO;
    for(let i = 0; i < formule.length; i++){
        if(formule[i] == "("){
             parO = i;
        }
        if(formule[i] == ")"){
            tabIndParethese.push(parO,i);
            return tabIndParethese;
        }
    }
    return -1
}
function SousExpressionGD(D1,F1,D2,F2,calcule,expression){
    let tabExpression = [];

    for(let i = D1; i < F1; i++){
        tabExpression.push(expression[i]);
    }
    tabExpression.push(calcule);
    for(let i = D2; i < F2; i++){
        tabExpression.push(expression[i]);
    }
    return tabExpression;
}
//********************************************** fonction qui permet de saufgarder les parentheses fermantes 
function evaluationParenthese(){
    
    let indiceParO = indiceParenthese(expressionSaisi)[0];
    let indiceParF = indiceParenthese(expressionSaisi)[1];;
    let val1,val2;

    if(indiceParF > 0){    
        let op = expressionSaisi[indiceParO+2];
        let Res = "";
        if((indiceParF-1)-(indiceParO+1) == 2){
            Res = calculer(parseInt(expressionSaisi[indiceParF-1]),parseInt(expressionSaisi[indiceParO+1]),op);
            expressionSaisi = SousExpressionGD(0,indiceParO,indiceParF+1,expressionSaisi.length,Res,expressionSaisi);
            if(expressionSaisi.length == 1){
                let op = expressionSaisi[1];
                expressionSaisi = calculer(parseInt(expressionSaisi[2]),parseInt(expressionSaisi[0]),op);
                return expressionSaisi;
            } 
            if(expressionSaisi.length == 3){
                let op = expressionSaisi[1];
                expressionSaisi = calculer(parseInt(expressionSaisi[2]),parseInt(expressionSaisi[0]),op);
                return expressionSaisi;
            }
            if(expressionSaisi.length == 5){
                let op = expressionSaisi[2];
                expressionSaisi = calculer(parseInt(expressionSaisi[3]),parseInt(expressionSaisi[1]),op);
                return expressionSaisi;
            }
        }else{
            if((indiceParF-1)-(indiceParO+1) == 0){
                Res = parseInt(expressionSaisi[indiceParO+1]);
                expressionSaisi = SousExpressionGD(0,indiceParO,indiceParF+1,expressionSaisi.length,Res,expressionSaisi);
            }else{
                if(expressionSaisi.length > 5){
                    let op1 = expressionSaisi[indiceParO+2];
                    let prioOp1 = prioriteOperation(op1);
                    let op2 = expressionSaisi[indiceParO+4];
                    let prioOp2 = prioriteOperation(op2);
                    
                    if(prioOp2 > prioOp1){
                        val1 = expressionSaisi[indiceParO+3];
                        val2 = expressionSaisi[indiceParO+5];
                        Res = calculer(parseInt(val2),parseInt(val1),op2);
                        expressionSaisi = SousExpressionGD(0,indiceParO+3,indiceParO+6,expressionSaisi.length,Res,expressionSaisi);
                    }else{
                        if(prioOp2 <= prioOp1){
                            val1 = expressionSaisi[indiceParO+1];
                            val2 = expressionSaisi[indiceParO+3];
                            Res = calculer(parseInt(val2),parseInt(val1),op1);
                            expressionSaisi = SousExpressionGD(0,indiceParO+1,indiceParO+4,expressionSaisi.length,Res,expressionSaisi);
                        }
                    }
                }else{
                    let op = expressionSaisi[2];
                    expressionSaisi = calculer(parseInt(expressionSaisi[3]),parseInt(expressionSaisi[1]),op);
                }  
            }
        }        
        return expressionSaisi;
    }else{
        if(expressionSaisi.length > 4){
            let op1 = expressionSaisi[1];
            let prioOp1 = prioriteOperation(op1);
            let op2 = expressionSaisi[3];
            let prioOp2 = prioriteOperation(op2);
            
            if(prioOp2 > prioOp1){
                val1 = expressionSaisi[2];
                val2 = expressionSaisi[4];
                Res = calculer(parseInt(val2),parseInt(val1),op2);
                expressionSaisi = SousExpressionGD(0,2,5,expressionSaisi.length,Res,expressionSaisi);
            }else{
                if(prioOp2 <= prioOp1){
                    val1 = expressionSaisi[0];
                    val2 = expressionSaisi[2];
                    Res = calculer(parseInt(val2),parseInt(val1),op1);
                    expressionSaisi = SousExpressionGD(0,0,3,expressionSaisi.length,Res,expressionSaisi);
                }
            } 
        }else{
            if(expressionSaisi.length == 4){
                let op = expressionSaisi[1];
                expressionSaisi = calculer(parseInt(expressionSaisi[2]),parseInt(expressionSaisi[0]),op);
            }
        }
        return expressionSaisi;
    }
}
//*************************************resolution + affichage 
if(gestionErrOk(args)){
    recuperationExpression();

    do {
        expressionSaisi = evaluationParenthese(expressionSaisi);
    } while (expressionSaisi.length > 3);
    console.log(expressionSaisi);

    
}