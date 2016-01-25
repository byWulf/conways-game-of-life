/**
 * Eine Zelle stellt ein Element in der Welt dar. Es hat eine Position sowie einen Zustand, ob es lebt oder nicht.
 * Außerdem kann eine Zelle noch einen Zwischenzustand bei der Entwicklung der nächsten Generation haben, nämlich ob
 * sie stirbt oder wiederbelebt wird.
 *
 * Diese Klasse stellt Methoden zur Verfügung, um die Zelle auf der Webseite darzustellen und ihren Zustand zu
 * aktualisieren.
 *
 * @param {int}     xPosition    X-Position der Zelle im Koordinatensystem
 * @param {int}     yPosition    Y-Position der Zelle im Koordinatensystem
 * @param {int}     elementSize  Breite und Höhe in Pixel der Zelle
 * @param {boolean} isAlive      Ist der Ursprungszustand der Zelle lebendig (true) oder tot (false)
 * @constructor
 */
var Cell = function(xPosition, yPosition, elementSize, isAlive) {
    var x = xPosition;
    var y = yPosition;
    var size = elementSize;
    var alive = isAlive;
    var resurrecting = false;
    var dying = false;

    /**
     * Gibt den HTML-Code der Zelle zum Einfügen in die Webseite zurück. Damit wird das Element bereits an die richtige
     * Position gesetzt und der Lebend-Zustand abgebildet. Das Element hat einige nützliche Attribute, mit denen das
     * spätere Interaktieren vereinfacht wird.
     *
     * @returns {string} HTML-Code der Zelle
     */
    this.getHtml = function() {
        return '<div class="cell ' + (alive ? 'alive' : '') + '" id="e' + x + '_' + y + '" data-x="' + x + '" data-y="' + y + '" style="left: ' + (x * size) + 'px; top: ' + (y * size) + 'px; width: ' + size + 'px; height: ' + size + 'px;"></div>';
    }

    /**
     * Gibt zurück, ob die Zelle gerade lebt.
     *
     * @returns {boolean} True, wenn die Zelle lebt
     */
    this.isAlive = function() {
        return alive;
    }

    /**
     * Setzt den Lebend-Zustand der Zelle. Dies wird direkt im HTML-Element abgebildet.
     *
     * @param {bool} newAlive True, wenn die Zelle leben soll. False, wenn die Zelle tot sein soll.
     */
    this.setAlive = function(newAlive) {
        alive = newAlive;
        dying = false;
        resurrecting = false;
        $('#e' + x + '_' + y).toggleClass('alive', alive);
    }

    /**
     * Hiermit wird eine tote Zelle zum Leben erweckt und eine lebende Zelle umgebracht.
     */
    this.toggleAlive = function() {
        this.setAlive(!alive);
    }

    /**
     * Merkt die Zelle zum Sterben vor.
     */
    this.kill = function() {
        dying = true;
    }

    /**
     * Gibt zurück, ob die Zelle in der nächsten Generation tot sein wird
     *
     * @returns {boolean} True, wenn die Zelle gerade am Sterben ist
     */
    this.isDying = function() {
        return dying;
    }

    /**
     * Merkt die Zelle zum Wiederbeleben vor.
     */
    this.resurrect = function() {
        resurrecting = true;
    }

    /**
     * Gibt zurück, ob die Zelle in der nächsten Generation wieder leben wird
     *
     * @returns {boolean} True, wenn die Zelle gerade am Wiederbeleben ist
     */
    this.isResurrecting = function() {
        return resurrecting;
    }

    /**
     * Gibt die X-Position dieser Zelle in der Welt zurück.
     *
     * @returns {int}
     */
    this.getX = function() {
        return x;
    }

    /**
     * Gibt die Y-Position dieser Zelle in der Welt zurück.
     *
     * @returns {int}
     */
    this.getY = function() {
        return y;
    }
}