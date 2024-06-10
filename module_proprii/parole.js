
sirAlphaNum="";
v_intervale=[[48,57],[65,90],[97,122]]
for(let interval of v_intervale){
    for(let i=interval[0]; i<=interval[1]; i++)
        sirAlphaNum+=String.fromCharCode(i)
}

console.log(sirAlphaNum);

function genereazaToken(n){
    let token=""
    for (let i=0;i<n; i++){
        token+=sirAlphaNum[Math.floor(Math.random()*sirAlphaNum.length)]
    }/**
 * @type {string}
 * @description Sirul de caractere alfanumerice utilizat pentru generarea token-urilor.
 */
let sirAlphaNum = "";

/**
 * @type {Array<Array<number>>}
 * @description Intervalele de coduri ASCII pentru cifre și litere.
 */
const v_intervale = [[48, 57], [65, 90], [97, 122]];

// Construiește sirul de caractere alfanumerice din intervalele specificate.
for (let interval of v_intervale) {
    for (let i = interval[0]; i <= interval[1]; i++) {
        sirAlphaNum += String.fromCharCode(i);
    }
}

console.log(sirAlphaNum);

/**
 * Generează un token alfanumeric de lungime specificată.
 * @param {number} n - Lungimea token-ului de generat.
 * @returns {string} Token-ul generat.
 * @example
 * const token = genereazaToken(10);
 * console.log(token); // Ex: "A1B2C3D4E5"
 */
function genereazaToken(n) {
    let token = "";
    for (let i = 0; i < n; i++) {
        token += sirAlphaNum[Math.floor(Math.random() * sirAlphaNum.length)];
    }
    return token;
}

module.exports.genereazaToken = genereazaToken;

    return token;
}

module.exports.genereazaToken=genereazaToken;