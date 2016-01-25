/**
 * Das Spiel des Lebens (engl. Conway's Game of Life) ist ein vom Mathematiker John Horton Conway 1970 entworfenes
 * System, basierend auf einem zweidimensionalen zellulären Automaten. Es ist eine einfache und bis heute populäre
 * Umsetzung der Automaten-Theorie von Stanisław Marcin Ulam.
 *
 * Diese App ist eine Simulation dieses Systems, in der die Regelwelt sowie eine Startsituation eingestellt und
 * anschließend die Entwicklung der Welt angestoßen werden kann.
 *
 * Dieses Projekt wurde für die Code Competition auf it-talents.de entwickelt.
 *
 * @author Michael "byWulf" Wolf (wulf1337@gmail.com)
 * @see https://de.wikipedia.org/wiki/Conways_Spiel_des_Lebens
 * @see https://www.it-talents.de/cms/aktionen/code-competition/aktuelle-code-competition
 *
 * @constructor
 */
var App = function() {
    var inst = this;

    var world = new World($('#container'));

    var running = false;
    var speed = 50;

    /**
     * Automatisches Entwickeln der nächsten Generation.
     * Bricht automatisch ab, wenn die Ausführung unterbrochen wird.
     */
    var doTick = function() {
        if (!running) return;

        world.generate();

        setTimeout(function() {
            doTick();
        }, speed);
    }

    /**
     * Startet die automatische Entwicklung
     */
    this.start = function() {
        if (running) return;

        running = true;
        doTick();
    }

    /**
     * Stoppt die automatische Entwicklung
     */
    this.stop = function() {
        running = false;
    }

    /**
     * Manuell eine Stufe entwickeln
     */
    this.nextGeneration = function() {
        world.generate();
    }

    /**
     * Legt die Geschwindigkeit für die automatische Entwicklung fest.
     *
     * @param {int} newSpeed   Pause in ms zwischen den Generationen
     */
    this.setSpeed = function(newSpeed) {
        speed = newSpeed;
    }

    /**
     * Gibt das World-Objekt zurück.
     *
     * @returns {World}
     */
    this.getWorld = function() {
        return world;
    }

    /**
     * Initialisiert alle Eventlistener, um die App bedienbar zu machen.
     */
    var initEventListener = function() {
        //Tooltips initialisieren
        $('[data-toggle="popover"]').popover({
            placement: 'left',
            trigger: 'manual',
            html: true,
            container: $('#settings')
        }).find('input, select').on('focus', function() {
            $(this).closest('[data-toggle="popover"]').popover('show');
        }).on('blur', function() {
            $(this).closest('[data-toggle="popover"]').popover('hide');
        });

        //Wenn die Welt noch nicht gestartet wurde, kann man selbst Formen durch Klicken auf die Zellen festlegen
        $('#container').on('click', '.cell', function() {
            if (running) return;

            world.getCell(parseInt($(this).attr('data-x'), 10), parseInt($(this).attr('data-y'),10)).toggleAlive();

            var startFormElement = $('#startForm');
            if (startFormElement.find('option[value=""]').length == 0) {
                console.log("Eigene hinzufügen");
                $('<option value="">Eigene Startform</option>')
                    .appendTo(startFormElement.find('optgroup[label="Standard"]'));
                startFormElement.val('');
            }
        });

        //Startform der Welt festlegen
        $('#startForm').on('change', function() {
            if ($(this).val() == '') return; //Eigene Welt muss nichts laden
            if (typeof window[$(this).val()] == 'undefined') return; //Ungültige Startform wurde gewählt

            //Startform auf die Welt anwenden
            world.setStartForm(window[$(this).val()]);

            //Falls es "Eigene Startform" gab, muss diese Option nun wieder weg
            $(this).find('option[value=""]').remove();

            //Falls eine Startform aus einer bestimmten Regelwelt ausgewählt wurde, diese Regeln laden
            var rulesString = $(this).find('option:selected').closest('optgroup').attr('data-rules');
            if (rulesString) $('#rules').val(rulesString).change();
        });

        //Regeln der Welt festlegen
        $('#rules').on('keyup change paste clipboard', function() {
            //Versuchen, den eingegebenen Regel-String zu interpretieren und ggf. einen Fehler ausgeben
            try {
                world.setRuleset(new Ruleset($(this).val()));
                $(this).closest('.form-group').removeClass('has-error');
                $('#submitSettingsButton').removeClass('disabled');
            } catch (e) {
                $(this).closest('.form-group').addClass('has-error');
                $('#submitSettingsButton').addClass('disabled');
            }
        });

        //Wenn man die Settings fertig eingestellt hat, die Controls zum Starten der Generationsentwicklung anzeigen
        $('#submitSettingsButton').on('click', function() {
            if ($(this).hasClass('disabled')) return false;

            $('#settings').hide();
            $('#controls').show();
            $('#speed').slider('relayout');

            return false;
        });

        //Geschwindigkeitsslider initialisieren
        $('#speed').slider({
            scale: 'logarithmic',
            reversed: true,
            formatter: function(speed) {
                return (Math.round((1000/speed)*10)/10) + ' Zyklen/s'
            }
        }).on('change', function() {
            inst.setSpeed($(this).val());
        });

        //Eine Generation weiter
        $('#stepButton').on('click', function() {
            inst.nextGeneration();

            return false;
        });
        //Automatisches Entwickeln starten
        $('#playButton').on('click', function() {
            if ($(this).hasClass('disabled')) return false;

            $('#playButton, #stepButton').attr('disabled', 'disabled').addClass('disabled');
            $('#pauseButton').removeAttr('disabled').removeClass('disabled');

            inst.start();

            return false;
        });
        //Automatisches Entwickeln pausieren
        $('#pauseButton').on('click', function() {
            if ($(this).hasClass('disabled')) return false;

            $('#pauseButton').attr('disabled', 'disabled').addClass('disabled');
            $('#playButton, #stepButton').removeAttr('disabled').removeClass('disabled');

            inst.stop();

            return false;
        });

        //Automatisches Entwickeln abbrechen und Settings wieder anzeigen
        $('#stopButton').on('click', function() {
            $('#pauseButton').click();

            $('#settings').show();
            $('#controls').hide();

            var startForm = $('#startForm');
            if (startForm.val() == '') startForm.val('Blank');
            startForm.change();

            return false;
        });

        //Generationsnummer anzeigen
        $('#container').on('generationUpdated', function(e, generation) {
            $('#generationCounter').text(generation);
        });
    }

    initEventListener();
};