var Pacman13571357 = new StartForm(function(x, y, width, height) {
    var lines = [
        '     XXXX     ',
        '   XX    XX   ',
        '  X        X  ',
        ' X          X ',
        ' X     XX   X ',
        'X      XX    X',
        'X            X',
        'X            X',
        'X       XXXXXX',
        ' X       X    ',
        ' X        X   ',
        '  X        X  ',
        '   XX    XX   ',
        '     XXXX     '
    ];
    var offsetX = Math.floor(width/2) - Math.floor(lines[0].length / 2);
    var offsetY = Math.floor(height/2) - Math.floor(lines.length / 2);

    return typeof lines[y - offsetY] != 'undefined' && typeof lines[y - offsetY][x - offsetX] != 'undefined' && lines[y - offsetY][x - offsetX] == 'X';
});