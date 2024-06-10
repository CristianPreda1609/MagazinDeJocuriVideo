const AccesBD = require('./accesbd.js');
const parole = require('./parole.js');
const { RolFactory } = require('./roluri.js');
const crypto = require("crypto");
const nodemailer = require("nodemailer");

/**
 * Clasa pentru utilizator.
 */
class Utilizator {
    static tipConexiune = "local";
    static tabel = "utilizatori";
    static parolaCriptare = "tehniciweb";
    static emailServer = "tehnici.web.cristi.264@gmail.com";
    static lungimeCod = 64;
    static numeDomeniu = "localhost:8080";
    #eroare;

    /**
     * Constructor pentru clasa Utilizator.
     * @param {Object} param0 Obiect cu proprietățile utilizatorului.
     * @param {number} param0.id ID-ul utilizatorului.
     * @param {string} param0.username Username-ul utilizatorului.
     * @param {string} param0.nume Numele utilizatorului.
     * @param {string} param0.prenume Prenumele utilizatorului.
     * @param {string} param0.email Email-ul utilizatorului.
     * @param {string} param0.parola Parola utilizatorului.
     * @param {string} param0.rol Rolul utilizatorului.
     * @param {string} [param0.culoare_chat="black"] Culoarea chat-ului utilizatorului.
     * @param {string} param0.poza Poza utilizatorului.
     */
    constructor({ id, username, nume, prenume, email, parola, rol, culoare_chat = "black", poza } = {}) {
        this.id = id;

        try {
            if (this.checkUsername(username))
                this.username = username;
        } catch (e) {
            this.#eroare = e.message;
        }

        for (let prop in arguments[0]) {
            this[prop] = arguments[0][prop];
        }
        if (this.rol)
            this.rol = this.rol.cod ? RolFactory.creeazaRol(this.rol.cod) : RolFactory.creeazaRol(this.rol);
        this.#eroare = "";
    }

    /**
     * Verifică dacă numele este valid.
     * @param {string} nume Numele de verificat.
     * @returns {boolean} True dacă numele este valid, altfel false.
     */
    checkName(nume) {
        return nume != "" && nume.match(new RegExp("^[A-Z][a-z]+$"));
    }

    /**
     * Setter pentru nume.
     * @param {string} nume Numele de setat.
     * @throws {Error} Aruncă eroare dacă numele este invalid.
     */
    set setareNume(nume) {
        if (this.checkName(nume)) this.nume = nume;
        else {
            throw new Error("Nume gresit");
        }
    }

    /**
     * Setter pentru username.
     * @param {string} username Username-ul de setat.
     * @throws {Error} Aruncă eroare dacă username-ul este invalid.
     */
    set setareUsername(username) {
        if (this.checkUsername(username)) this.username = username;
        else {
            throw new Error("Username gresit");
        }
    }

    /**
     * Verifică dacă username-ul este valid.
     * @param {string} username Username-ul de verificat.
     * @returns {boolean} True dacă username-ul este valid, altfel false.
     */
    checkUsername(username) {
        return username != "" && username.match(new RegExp("^[A-Za-z0-9#_./]+$"));
    }

    /**
     * Criptează parola.
     * @param {string} parola Parola de criptat.
     * @returns {string} Parola criptată.
     */
    static criptareParola(parola) {
        return crypto.scryptSync(parola, Utilizator.parolaCriptare, Utilizator.lungimeCod).toString("hex");
    }

    /**
     * Salvează utilizatorul în baza de date.
     */
    salvareUtilizator() {
        let parolaCriptata = Utilizator.criptareParola(this.parola);
        let utiliz = this;
        let token = parole.genereazaToken(100);
        AccesBD.getInstanta(Utilizator.tipConexiune).insert({
            tabel: Utilizator.tabel,
            campuri: {
                username: this.username,
                nume: this.nume,
                prenume: this.prenume,
                parola: parolaCriptata,
                email: this.email,
                culoare_chat: this.culoare_chat,
                cod: token,
                poza: this.poza
            }
        }, function (err, rez) {
            if (err)
                console.log(err);
            else
                utiliz.trimiteMail("Te-ai inregistrat cu succes", "Username-ul tau este " + utiliz.username,
                    `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${utiliz.username}.</p> <p><a href='http://${Utilizator.numeDomeniu}/cod/${utiliz.username}/${token}'>Click aici pentru confirmare</a></p>`,
                );
        });
    }

    /**
     * Trimite un email utilizatorului.
     * @param {string} subiect Subiectul email-ului.
     * @param {string} mesajText Mesajul text.
     * @param {string} mesajHtml Mesajul HTML.
     * @param {Array} [atasamente=[]] Lista de atașamente.
     */
    async trimiteMail(subiect, mesajText, mesajHtml, atasamente = []) {
        var transp = nodemailer.createTransport({
            service: "gmail",
            secure: false,
            auth: {
                user: Utilizator.emailServer,
                pass: "qvykiroumrjfucbl"
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        await transp.sendMail({
            from: Utilizator.emailServer,
            to: this.email,
            subject: subiect,
            text: mesajText,
            html: mesajHtml,
            attachments: atasamente
        });
        console.log("trimis mail");
    }

    /**
     * Găsește un utilizator după username (asincron).
     * @param {string} username Username-ul utilizatorului.
     * @returns {Promise<Utilizator|null>} Utilizatorul găsit sau null.
     */
    static async getUtilizDupaUsernameAsync(username) {
        if (!username) return null;
        try {
            let rezSelect = await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync({
                tabel: "utilizatori",
                campuri: ['*'],
                conditiiAnd: [`username='${username}'`]
            });
            if (rezSelect.rowCount != 0) {
                return new Utilizator(rezSelect.rows[0]);
            } else {
                console.log("getUtilizDupaUsernameAsync: Nu am gasit utilizatorul");
                return null;
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    /**
     * Găsește un utilizator după username (sincron).
     * @param {string} username Username-ul utilizatorului.
     * @param {Object} obparam Obiect cu parametri.
     * @param {function} proceseazaUtiliz Funcția de procesare a utilizatorului găsit.
     */
    static getUtilizDupaUsername(username, obparam, proceseazaUtiliz) {
        if (!username) return null;
        let eroare = null;
        AccesBD.getInstanta(Utilizator.tipConexiune).select({ tabel: "utilizatori", campuri: ['*'], conditiiAnd: [`username='${username}'`] }, function (err, rezSelect) {
            if (err) {
                console.error("Utilizator:", err);
                eroare = -2;
            } else if (rezSelect.rowCount == 0) {
                eroare = -1;
            }
            let u = new Utilizator(rezSelect.rows[0]);
            proceseazaUtiliz(u, obparam, eroare);
        });
    }

    /**
     * Găsește utilizatori după parametrii dați (sincron).
     * @param {Object} obParam Obiect cu parametrii de căutare.
     * @param {function} callback Funcția de procesare a utilizatorilor găsiți.
     */
    static cauta(obParam, callback) {
        let conditii = [];
        for (let [cheie, valoare] of Object.entries(obParam)) {
            if (valoare !== undefined) {
                conditii.push(`${cheie}='${valoare}'`);
            }
        }
        AccesBD.getInstanta(Utilizator.tipConexiune).select({
            tabel: "utilizatori",
            campuri: ['*'],
            conditiiAnd: conditii
        }, function (err, rezSelect) {
            if (err) {
                callback(err, []);
            } else {
                let listaUtiliz = rezSelect.rows.map(row => new Utilizator(row));
                callback(null, listaUtiliz);
            }
        });
    }

    /**
     * Găsește utilizatori după parametrii dați (asincron).
     * @param {Object} obParam Obiect cu parametrii de căutare.
     * @returns {Promise<Array<Utilizator>>} Lista utilizatorilor găsiți.
     */
    static async cautaAsync(obParam) {
        let conditii = [];
        for (let [cheie, valoare] of Object.entries(obParam)) {
            if (valoare !== undefined) {
                conditii.push(`${cheie}='${valoare}'`);
            }
        }
        try {
            let rezSelect = await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync({
                tabel: "utilizatori",
                campuri: ['*'],
                conditiiAnd: conditii
            });
            return rezSelect.rows.map(row => new Utilizator(row));
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    /**
     * Modifică datele utilizatorului.
     * @param {Object} dateNoi Obiect cu noile date.
     * @throws {Error} Aruncă eroare dacă utilizatorul nu există.
     */
    modifica(dateNoi) {
        if (!this.id) {
            throw new Error("Utilizatorul nu există.");
        }
        let modificari = [];
        for (let [cheie, valoare] of Object.entries(dateNoi)) {
            modificari.push(`${cheie}='${valoare}'`);
        }
        AccesBD.getInstanta(Utilizator.tipConexiune).update({
            tabel: "utilizatori",
            campuri: modificari,
            conditiiAnd: [`id=${this.id}`]
        }, function (err, rez) {
            if (err) {
                console.log(err);
            }
        });
    }

    /**
     * Șterge utilizatorul din baza de date.
     * @throws {Error} Aruncă eroare dacă utilizatorul nu există.
     */
    sterge() {
        if (!this.id) {
            throw new Error("Utilizatorul nu există.");
        }
        AccesBD.getInstanta(Utilizator.tipConexiune).delete({
            tabel: "utilizatori",
            conditiiAnd: [`id=${this.id}`]
        }, function (err, rez) {
            if (err) {
                console.log(err);
            }
        });
    }

    /**
     * Verifică dacă utilizatorul are un anumit drept.
     * @param {Symbol} drept Dreptul de verificat.
     * @returns {boolean} True dacă utilizatorul are dreptul, altfel false.
     */
    areDreptul(drept) {
        return this.rol.areDreptul(drept);
    }
}

module.exports = { Utilizator: Utilizator };
