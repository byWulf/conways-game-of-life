/**
 * Dies stellt die "Laufzeitumgebung" der Zellen dar. Sobald die Welt initialisiert wird, werden automatisch so viele
 * Zellen erstellt, wie im aktuellen Fenster Platz haben. Außerdem kann man einer Welt eine StartForm übergeben. Diese
 * benutzt die Welt dann zum initialen Setzen der lebenden Zellen. Zu guter Letzt kann man einer Welt noch ein RuleSet
 * vorgeben. Dieses legt fest, wann eine Zelle nach einem Generationswechsel sterben muss bzw. wiederbelebt wird.
 *
 * Die Welt stellt eine Methode "generate()" zur Verfügung, mit welcher die nächste Generation berechnet und dargestellt
 * werden kann. Die Ermittlung, welche Zellen sterben müssen und welche wiederbelebt werden, übernimmt hierbei die Welt
 * und nicht die einzelnen Zellen. Die Zellen dienen lediglich der Zustandshaltung und Ausgabeveränderung am Bildschirm.
 *
 * @param {jQuery} elem Containerelement, in dem die Welt dargestellt werden soll
 * @constructor
 */
var World = function(elem) {
    var inst = this;

    var cellSize = 12;
    var containerElement = elem;
    var width = 0;
    var height = 0;
    var cells = {};
    var ruleset = new Ruleset('23/3');
    var startForm = Blank;

    var generation = 0;

    /**
     * Legt das Regelset für die Welt fest, welche das Sterben und Wiederbeleben der Zellen vorgibt.
     * @param {Ruleset} newRuleset
     */
    this.setRuleset = function(newRuleset) {
        if (typeof newRuleset != 'object') throw 'Ruleset: Not a valid ruleset';

        ruleset = newRuleset;
    }

    /**
     * Legt die Startform zum Initialisieren der Welt fest.
     * Sorgt auch automatisch dafür, dass die Welt neu gebaut wird.
     *
     * @param {StartForm} newStartForm
     */
    this.setStartForm = function(newStartForm) {
        if (typeof newStartForm != 'object' || typeof newStartForm.isAlive != 'function') throw 'StartForm: Not a valid startForm';

        startForm = newStartForm;
        createCells();
    }

    /**
     * Erzeugt alle Zellen dieser Welt (neu) und initialisiert deren Lebendzustand anhand der festgelegten Startform.
     */
    var createCells = function() {
        //Entsprechend der Auflösung des Fensters die Breite und Höhe der Welt festlegen
        var newWidth = Math.floor($(window).width()/cellSize);
        var newHeight = Math.floor($(window).height()/cellSize);
        var html = '';

        //Alle Zellen neu erzeugen
        cells = {};
        width = newWidth;
        height = newHeight;
        for (var y = 0; y < height; y++) {
            cells[y] = {};
            for (var x = 0; x < width; x++) {
                cells[y][x] = new Cell(x, y, cellSize, startForm.isAlive(x,y, width, height));
                html += cells[y][x].getHtml();
            }
        }

        //Mit dem gesammelten HTML der erstellen Zellen den Container füllen und die Zellen so auf der Seite anzeigen
        containerElement.html(html);

        //Generation zurücksetzen
        generation = 0;
        containerElement.trigger('generationUpdated', [generation]);
    }
    createCells();

    /**
     * Gibt die Zelle an den gegebenen Koordinaten zurück. Sollten die Koordinaten dabei die Welt verlassen, so wird
     * automatisch auf die Zelle am anderen Ende der Welt umgerechnet und diese Zelle zurückgegeben.
     *
     * @param {int} x X-Position der zurückzugebenden Zelle
     * @param {int} y Y-Position der zurückzugebenden Zelle
     * @returns {Cell}
     */
    this.getCell = function(x, y) {
        return cells[(y + height) % height][(x + width) % width];
    }

    /**
     * Gibt zurück, wie viele lebende Nachbarzellen eine Zelle an gegebener Position hat.
     *
     * @param x
     * @param y
     * @returns {number}
     */
    var getLivingSurroundings = function(x, y) {
        var count = 0;

        //Alle angrenzenden Zellen, aber nicht die gleiche durchgehen (x +/- 1, y +/- 1)
        for (var offsetY = -1; offsetY <= 1; offsetY++) {
            for (var offsetX = -1; offsetX <= 1; offsetX++) {
                if (offsetY == 0 && offsetX == 0) continue;

                if (inst.getCell(x + offsetX, y + offsetY).isAlive()) count++;
            }
        }

        return count;
    }

    /**
     * Erzeugt die nächste Generation der Welt und stellt diese dar.
     *
     * Zunächst wird ermitteln, welche Zellen sterben bzw. wiederbelebt werden müssen, und anschließend werden diese
     * Stati angewendet.
     */
    this.generate = function() {
        //1. Schritt: Ermitteln, welche lebenden Zellen in der nächsten Generation sterben und welche toten Zellen
        //            wiederbelebt werden
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var cell = this.getCell(x, y);
                var livingSurroundings = getLivingSurroundings(x, y);
                if (cell.isAlive()) {
                    if (ruleset.willDie(livingSurroundings)) cell.kill();
                } else {
                    if (ruleset.willResurrect(livingSurroundings)) cell.resurrect();
                }
            }
        }

        //2. Schritt: Neue Stati (lebend/tot) auf die Zellen anwenden und darstellen
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var cell = this.getCell(x, y);
                if (cell.isDying()) cell.setAlive(false);
                if (cell.isResurrecting()) cell.setAlive(true);
            }
        }

        generation++;
        containerElement.trigger('generationUpdated', [generation]);
    }
}