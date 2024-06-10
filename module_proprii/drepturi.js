/**
 * @typedef {Object} Drepturi
 * @property {Symbol} vizualizareUtilizatori Dreptul de a intra pe pagina cu tabelul de utilizatori.
 * @property {Symbol} stergereUtilizatori Dreptul de a șterge un utilizator.
 * @property {Symbol} cumparareProduse Dreptul de a cumpăra produse.
 * @property {Symbol} vizualizareGrafice Dreptul de a vizualiza graficele de vânzări.
 * @property {Symbol} adaugareProduse Dreptul de a adăuga produse.
 * @property {Symbol} modificareProduse Dreptul de a modifica produse.
 * @property {Symbol} stergereProduse Dreptul de a șterge produse.
 */

/**
 * @name Drepturi
 * @type {Drepturi}
 * @description Obiect care definește drepturile posibile ale utilizatorilor. Numele proprietăților sunt identificatori pentru drepturi, iar valorile lor sunt obiecte de tip Symbol.
 */
const Drepturi = {
    vizualizareUtilizatori: Symbol("vizualizareUtilizatori"),
    stergereUtilizatori: Symbol("stergereUtilizatori"),
    cumparareProduse: Symbol("cumparareProduse"),
    vizualizareGrafice: Symbol("vizualizareGrafice"),
    adaugareProduse: Symbol("adaugareProduse"),
    modificareProduse: Symbol("modificareProduse"),
    stergereProduse: Symbol("stergereProduse")
};

module.exports = Drepturi;
