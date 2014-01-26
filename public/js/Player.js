/**************************************************
** GAME PLAYER CLASS
**************************************************/

var blockList = [[50, 400, 100, 100]];


var Player = function(startX, startY,colored) {
	var x = startX,
		y = startY,
		color= '#'+Math.floor(Math.random()*16777215).toString(16),
		boost = 10,
		id,
		moveAmount = 2;
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

		var update = function(keys) {
		var prevX = x,
    		prevY = y;
		// Up key takes priority over down

		var flag=false;
		/*
		if(keys.space)
		{
			if (boost>0)
			{
				flag=true;
				moveAmount = moveAmount + 4;
				boost--;
			}
		}*/

		if (keys.up) {
			y -= moveAmount;
		} else if (keys.down) {
			y += moveAmount;
		};

		if(y>=window.innerHeight-10 || y <10 )
			y=prevY;

		// Left key takes priority over right
		if (keys.left) {
			x -= moveAmount;
		} else if (keys.right) {
			x += moveAmount;
		};
		if(x>=window.innerWidth-10 || x <10 )
			x=prevX;

		/*if(flag==true&&moveAmount>=6)
			moveAmount=moveAmount-4;
		else
			moveAmount=2;*/

		return (prevX != x || prevY != y) ? true : false;
	};

	var draw = function(flag,ctx,x1,y1) {
		var temp =  ctx.strokeStyle ;
		//ctx.beginPath();
		//ctx.fillStyle= color;
		//console.log(color);
		//if(flag=="you")
		//ctx.fillRect(window.innerWidth/2-5, window.innerHeight/2-5, 10, 10);
		//else
		//ctx.fillRect(x-5, y-5, 10, 10);
		//ctx.lineWidth = 4;
		//ctx.strokeStyle = 'black';
      	//ctx.stroke();
		//ctx.fillRect(x-5, y-5, 10, 10);
		//ctx.strokeStyle = temp;
		ctx.beginPath();
      	ctx.rect(x-10, y-10, 10, 10);
      	ctx.fillStyle = color;
      	ctx.fill();
      	ctx.lineWidth = 5;
      	ctx.strokeStyle = 'black';
      	ctx.stroke();

	};
	

	return {
		getX: getX,
		getY: getY,
		getColor : getColor,
		setX: setX,
		setY: setY,
		setColor : setColor,
		update: update,
		draw: draw
	}
};