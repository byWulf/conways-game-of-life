/**
 * Stellt eine Startform für die Welt dar. Immer, wenn eine Welt neu erstellt wird, wird für jede Zelle eine übergebene
 * Prüfung ausgeführt, ob die Zelle lebend oder tot sein soll.
 *
 * Als Paramter kann dabei entweder eine Callback-Function (bekommt als Parameter x, y, width, height übergeben und muss
 * true/false zurückgeben) oder ein Pattern-String (Jedes Zeichen ist eine Zelle und muss ' ' (tot) oder 'X' (lebend)
 * sein.)
 *
 * Beispiel für Callback-Function:
 *      function(x,y) {
 *          return x == y;
 *      }
 *
 * Beispiel für Pattern-String:
 *      "                     \n" +
 *      "                     \n" +
 *      "         XX          \n" +
 *      "        XXXX         \n" +
 *      "         XX          "
 *
 * @param {function|string|null} callback Entweder eine Callback-Function, oder ein Pattern-String
 * @constructor
 */
var StartForm = function(callback) {
    /**
     * Enthält die Callback-Function, falls eine Funktion übergeben wurde
     * @type {function|null}
     */
    this.isAliveCallback = typeof callback == 'function' ? callback : null;

    /**
     * Enthält den Pattern-String, falls ein String übergeben wurde
     * @type {string|null}
     */
    this.patternLines = typeof callback == 'string' ? callback.split('\n') : null;

    /**
     * Gibt zurück, ob für die gegebenen x/y-Koordinaten die Zelle lebend oder tot sein soll.
     *
     * @param {int} x
     * @param {int} y
     * @param {int}width
     * @param {int} height
     * @returns {boolean}
     */
    this.isAlive = function(x,y, width, height) {
        if (this.isAliveCallback !== null) return this.isAliveCallback(x,y, width, height);

        if (this.patternLines !== null) {
            if (typeof this.patternLines[y] == 'undefined') return false;
            if (typeof this.patternLines[y][x] == 'undefined') return false;

            return this.patternLines[y][x] == 'X';
        }

        return false;
    }
}