/**
 * Ein Ruleset stellt Regeln für die Welt dar, welche festlegen, wann lebende Zellen sterben und wann tote Zellen
 * wiederbelebt werden müssen.
 *
 * Ein neues Ruleset muss mit einem String instanziiert werden. Dieser String muss folgendem Aufbau folgen:
 * 13579/13579
 *   ^  ^  ^
 *   |  |  |
 *   |  |  Hat eine tote Zelle eine im rechten Block angegebene Anzahl an lebenden Nachbarn, so wird sie wiederbelebt
 *   |  Slash als Trennung der beiden Blöcke
 *   Hat eine lebende Zeille eine im linken Block angegebene Anzahl an lebenden Nachbarn, so bleibt sie am leben
 *
 * Beispiel für klassische Regeln:
 *      23/3     - Conways Original-Game of Life
 *     236/3     - explodierend, teilweise mit den Strukturen aus 23/3
 *   12345/3     - eine Welt, in der ein sich ausbreitendes, labyrinthartiges Muster entsteht
 *    1357/1357  - ein Kopiersystem, wobei sich aus einfachen kleinen Strukturen komplexe Muster entwickeln können
 *    0123/01234 - eine blinkende Fleckenwelt
 *
 * @param ruleString
 * @constructor
 */
var Ruleset = function(ruleString) {
    /**
     * Enthält die Anzahlen, bei wie vielen lebenden Nachbarn eine lebende Zelle überlebt
     * @type {Array}
     */
    var surviveArray = [];

    /**
     * Enthält die Anzahlen, bei wie vielen lebenden Nachbarn eine tote Zelle wiederbelebt wird
     * @type {Array}
     */
    var resurrectArray = [];

    /**
     * Zieht aus einem String die einzelnen Ziffern heraus und wandelt sie in ein Array um.
     * Es findet eine Prüfung statt, dass auch nur gültige Ziffern (zwischen 0 und 8) reinkommen.
     *
     * @param {string} string Zu extrahierender String
     * @returns {Array} Die im String enthaltenen Ziffern
     * @throws Exception, falls der Übergebene String nicht aus Ziffern zwischen 0 und 8 besteht
     */
    var stringToRulesArray = function(string) {
        var array = [];

        for (var i = 0; i < string.length; i++) {
            var digit = parseInt(string[i], 10);

            if (digit != string[i]) throw 'Ruleset: not a valid string';
            if (array.indexOf(digit) !== -1) throw 'Ruleset: not a valid string';
            if (digit < 0 || digit > 8) throw 'Ruleset: not a valid string';

            array.push(digit);
        }

        return array;
    }

    /**
     * Initialisiert das Ruleset und parsed den String. Sollte der String ungültig sein, wird eine Exception geworfen.
     *
     * @param ruleString Rulestring in der Form 012345678/012345678. Siehe Klassenbeschreibung zum genauen Aufbau
     */
    var init = function(ruleString) {
        if (typeof ruleString != 'string') throw 'Ruleset: not a valid string';

        var parts = ruleString.split('/', 2);
        if (parts.length != 2) throw 'Ruleset: not a valid string';

        surviveArray = stringToRulesArray(parts[0]);
        resurrectArray = stringToRulesArray(parts[1]);
    }
    init(ruleString);

    /**
     * Prüft, ob eine lebendige Zelle mit der übergebenen Anzahl an lebenden Nachbarn sterben muss
     *
     * @param {int} livingSurroundings Anzahl an lebenden Nachbarn
     * @returns {boolean} True, wenn die Zelle sterben muss
     */
    this.willDie = function(livingSurroundings) {
        return surviveArray.indexOf(livingSurroundings) === -1;
    }

    /**
     * Prüft, ob eine tote Zelle mit der übergebenen Anzahl an lebenden Nachbarn wiederbelebt werden muss
     * @param {int} livingSurroundings Anzahl an lebenden Nachbarn
     * @returns {boolean} True, wenn die Zelle wiederbelebt werden muss
     */
    this.willResurrect = function(livingSurroundings) {
        return resurrectArray.indexOf(livingSurroundings) !== -1;
    }
}