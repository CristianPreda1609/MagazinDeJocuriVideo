const Drepturi = require('./drepturi.js');

/**
 * Clasa de bază pentru roluri.
 * @class
 */
class Rol {
    /**
     * Tipul rolului.
     * @type {string}
     * @readonly
     * @static
     */
    static get tip() {
        return "generic";
    }

    /**
     * Lista drepturilor asociate rolului.
     * @type {Symbol[]}
     * @readonly
     * @static
     */
    static get drepturi() {
        return [];
    }

    /**
     * Creează un rol.
     * @constructor
     */
    constructor() {
        this.cod = this.constructor.tip;
    }

    /**
     * Verifică dacă rolul are un anumit drept.
     * @param {Symbol} drept Dreptul de verificat.
     * @returns {boolean} True dacă rolul are dreptul, altfel false.
     */
    areDreptul(drept) {
        console.log("in metoda rol!!!!");
        return this.constructor.drepturi.includes(drept);
    }
}

/**
 * Clasa pentru rolul de administrator.
 * @class
 * @extends Rol
 */
class RolAdmin extends Rol {

    /**
     * Tipul rolului.
     * @type {string}
     * @readonly
     * @static
     */
    static get tip() {
        return "admin";
    }

    /**
     * Creează un rol de administrator.
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Verifică dacă rolul are un anumit drept.
     * @returns {boolean} întotdeauna true pentru rolul de administrator.
     */
    areDreptul() {
        return true;
    }
}

/**
 * Clasa pentru rolul de moderator.
 * @class
 * @extends Rol
 */
class RolModerator extends Rol {

    /**
     * Tipul rolului.
     * @type {string}
     * @readonly
     * @static
     */
    static get tip() {
        return "moderator";
    }

    /**
     * Lista drepturilor asociate rolului.
     * @type {Symbol[]}
     * @readonly
     * @static
     */
    static get drepturi() {
        return [
            Drepturi.vizualizareUtilizatori,
            Drepturi.stergereUtilizatori
        ];
    }

    /**
     * Creează un rol de moderator.
     * @constructor
     */
    constructor() {
        super();
    }
}

/**
 * Clasa pentru rolul de client.
 * @class
 * @extends Rol
 */
class RolClient extends Rol {
    /**
     * Tipul rolului.
     * @type {string}
     * @readonly
     * @static
     */
    static get tip() {
        return "comun";
    }

    /**
     * Lista drepturilor asociate rolului.
     * @type {Symbol[]}
     * @readonly
     * @static
     */
    static get drepturi() {
        return [
            Drepturi.cumparareProduse
        ];
    }

    /**
     * Creează un rol de client.
     * @constructor
     */
    constructor() {
        super();
    }
}

/**
 * Fabrica pentru crearea rolurilor.
 * @class
 */
class RolFactory {
    /**
     * Creează un rol pe baza tipului.
     * @param {string} tip Tipul rolului.
     * @returns {Rol} Instanță a rolului corespunzător.
     */
    static creeazaRol(tip) {
        switch (tip) {
            case RolAdmin.tip:
                return new RolAdmin();
            case RolModerator.tip:
                return new RolModerator();
            case RolClient.tip:
                return new RolClient();
            default:
                throw new Error(`Tipul de rol ${tip} nu este recunoscut.`);
        }
    }
}

module.exports = {
    RolFactory: RolFactory,
    RolAdmin: RolAdmin
};
