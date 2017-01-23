//console.log("JHJr: Hello world.");
//document.write("JHJr: Hello world.");

//var ctx = document.getElementById("bracketField").getContext("2d");

function MatchUp(p0,p1) {
	this.player0 = p0;
	this.player1 = p1;
	this.winner = undefined;
	this.getWinner = function() {
		return this.winner;
	}
	this.setWinner = function(a) {
		if (0 == a) {
			this.winner = this.player0;
		} else
		if (1 == a) {
			this.winner = this.player1;
		} else {
			this.winner = undefined;
		}
	}
	this.getPlayers = function () {
		return [this.player0,this.player1];
	}
	this.addPlayer = function(p) {
		if (undefined == this.player0) {
			this.player0 = p;
		} else
		if (undefined == this.player1) {
			this.player1 = p;
		}
	}
	this.draw = function(ctx,scale) {
		w = ctx.canvas.width;
		h = ctx.canvas.height;
		ctx.fillText(p0,10,10);
		ctx.moveTo(10,15);
		ctx.lineTo(120,15);
		ctx.stroke();
		ctx.fillText(p1,10,110);
		ctx.moveTo(10,115);
		ctx.lineTo(120,115);
		ctx.stroke();
		ctx.moveTo(120,15);
		ctx.lineTo(120,115);
		ctx.stroke();
	}
	this.dump = function() {
		document.write('[' + this.player0 + ',' + this.player1 + ']');
	}
}

