var Player = function(startX, startY,colored) {
    var x = startX,
        y = startY,
        color,//=colored,//='#'+Math.floor(Math.random()*16777215).toString(16),
        id;
    
    var getX = function() {
        return x;
    };

    var getY = function() {
        return y;
    };

    var setX = function(newX) {
        x = newX;
    };

    var setY = function(newY) {
        y = newY;
    };

    var getColor = function()
    { return color;}

    var setColor = function(newColor)
    { color =newColor; }

    return {
        getX: getX,
        getY: getY,
        getColor : getColor,
        setX: setX,
        setY: setY,
        setColor : setColor,
        id: id
    }
};

exports.Player = Player;
