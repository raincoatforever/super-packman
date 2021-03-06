/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	ctx,			// Canvas rendering context
	keys,			// Keyboard input
	localPlayer,
	remotePlayers,	// Local player
	socket,
	maze;


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Declare the canvas and rendering context
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");
	

	booster = 0;
	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	maze = [[10, 10, 7, canvas.height-20],[canvas.width - 10, 10, 7, canvas.height - 20], [10, 10, canvas.width - 20, 7], [10, canvas.height - 10 , canvas.width - 15, 7]];

	// Initialise keyboard controls
	keys = new Keys();

	// Calculate a random start position for the local player
	// The minus 5 (half a player size) stops the player being
	// placed right on the egde of the screen
	var startX = Math.round(Math.random()*(canvas.width-5)),
		startY = Math.round(Math.random()*(canvas.height-5));

	// Initialise the local player
	localPlayer = new Player(startX, startY,'#'+Math.floor(Math.random()*16777215).toString(16));
	socket = io.connect("http://54.201.137.106", {port: 8000, transports: ["websocket"]});

	remotePlayers = [];
	// Start listening for events
	setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	// Window resize
	window.addEventListener("resize", onResize, false);
	socket.on("connect", onSocketConnected);
	socket.on("disconnect", onSocketDisconnect);
	socket.on("new player", onNewPlayer);
	socket.on("move player", onMovePlayer);
	socket.on("remove player", onRemovePlayer);
};

// Keyboard key down
function onKeydown(e) {
	if (localPlayer) {
		keys.onKeyDown(e);
	};
};

// Keyboard key up
function onKeyup(e) {
	if (localPlayer) {
		keys.onKeyUp(e);
	};
};

// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

function onSocketConnected() {
    console.log("Connected to socket server");
    socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY()});

};

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};

function onNewPlayer(data) {
    console.log("New player connected: "+data.id)
    var newPlayer = new Player(data.x, data.y,data.color);//'#'+Math.floor(Math.random()*16777215).toString(16));
    console.log(newPlayer.getColor());
	newPlayer.id = data.id;
	remotePlayers.push(newPlayer);
};

function onMovePlayer(data) {
	var movePlayer = playerById(data.id);

	if (!movePlayer) {
	    console.log("Player not found: "+data.id);
	    return;
	};
	/*if(data.x <400 || data.y <400 )
		return;*/
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
};

function onRemovePlayer(data) {
	var removePlayer = playerById(data.id);

	if (!removePlayer) {
	    console.log("Player not found: "+data.id);
	    return;
	};

	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);

};

function playerById(id) {
    var i;
    for (i = 0; i < remotePlayers.length; i++) {
        if (remotePlayers[i].id == id)
            return remotePlayers[i];
    };

    return false;
};


/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
	update();
	draw();



	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
};


/**************************************************
** GAME UPDATE
**************************************************/
function update() {
	if (localPlayer.update(keys)) {
    socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
	};
};


/**************************************************
** GAME DRAW
**************************************************/
function draw() {
	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// draw rects

	for (var i=0;i<maze.length;i++)
	{
		ctx.beginPath();
		//ctx.rect(10, 10, 7, canvas.height-20);
		ctx.rect(maze[i][0],maze[i][1],maze[i][2],maze[i][3])
		ctx.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
		ctx.fill();
		ctx.lineWidth = 3;
		ctx.strokeStyle = 'black';
		ctx.stroke();	
	}
	

	/*if (booster%27==0) {
			if(localPlayer.boost < 10)
			localPlayer.boost++;
	}
	booster = (booster+1)%50;
	*/
	//ctx.lineWidth = 4;
	// Draw the local player
	localPlayer.draw("you",ctx,0,0);
	//ctx.lineWidth = 1;
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		var newx,newy;
		var tempx = remotePlayers[i].getX();
		var tempy = remotePlayers[i].getY();
		newx = remotePlayers[i].getX() - localPlayer.getX()-canvas.width/2;
		newy = remotePlayers[i].getY() - localPlayer.getY()-canvas.height/2;
		//if((newx >0 )&&(newy>0)&&(newx<canvas.width)&&(newy<canvas.height))
	    remotePlayers[i].draw("others",ctx,newx,newy);
};
};