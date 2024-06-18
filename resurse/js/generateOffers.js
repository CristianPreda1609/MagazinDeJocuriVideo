const fs = require('fs');
const path = require('path');

// Configurații
const INTERVAL_T = 2 * 60 * 1000; // 2 minute pentru generarea unei noi oferte
const INTERVAL_T2 = 10 * 60 * 1000; // 10 minute pentru ștergerea ofertelor vechi
const CATEGORII = ["strategie", "curse", "mmo"];
const REDUCERI = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
const OFERTE_FILE = path.join(__dirname, '..', 'json', 'oferte.json');

// Funcție pentru a genera o nouă ofertă
function genereazaOferta() {
  const dataIncepere = new Date();
  const dataFinalizare = new Date(dataIncepere.getTime() + INTERVAL_T);

  const categorie = alegeCategorie();
  const reducere = alegeReducere();

  return {
    categorie,
    "data-incepere": dataIncepere.toISOString(),
    "data-finalizare": dataFinalizare.toISOString(),
    reducere
  };
}

// Funcție pentru a alege o categorie aleatorie, diferită de ultima categorie
function alegeCategorie() {
  const data = citesteOferte();
  const ultimaCategorie = data.oferte.length > 0 ? data.oferte[0].categorie : null;

  let categorie;
  do {
    categorie = CATEGORII[Math.floor(Math.random() * CATEGORII.length)];
  } while (categorie === ultimaCategorie);

  return categorie;
}

// Funcție pentru a alege o reducere aleatorie
function alegeReducere() {
  return REDUCERI[Math.floor(Math.random() * REDUCERI.length)];
}

// Funcție pentru a citi ofertele din fișier
function citesteOferte() {
  if (!fs.existsSync(OFERTE_FILE)) {
    return { oferte: [] };
  }
  const data = fs.readFileSync(OFERTE_FILE, 'utf8');
  return JSON.parse(data);
}

// Funcție pentru a salva ofertele în fișier
function salveazaOferte(oferte) {
  fs.writeFileSync(OFERTE_FILE, JSON.stringify(oferte, null, 2), 'utf8');
}

// Funcție principală pentru a actualiza ofertele
function actualizeazaOferte() {
  const data = citesteOferte();
  const nouaOferta = genereazaOferta();

  // Adăugăm noua ofertă la începutul vectorului
  data.oferte.unshift(nouaOferta);

  // Filtrăm ofertele vechi
  const now = new Date();
  data.oferte = data.oferte.filter(oferta => new Date(oferta["data-finalizare"]).getTime() > now.getTime() - INTERVAL_T2);

  // Salvăm ofertele actualizate
  salveazaOferte(data);

  console.log('Ofertele au fost actualizate:', nouaOferta);
}

// Funcție pentru a genera oferte la intervale regulate
function startOfferGeneration() {
  actualizeazaOferte(); // Actualizează ofertele imediat când este apelată

  // Rulează actualizarea ofertelor la fiecare INTERVAL_T milisecunde
  setInterval(actualizeazaOferte, INTERVAL_T);
}

// Exportă funcția
module.exports = { startOfferGeneration };
