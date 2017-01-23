var ctx = document.getElementById("bracketField").getContext("2d");
//document.write("ctx.canvas.width = " + ctx.canvas.width + '<br>');
//document.write("ctx.canvas.height = " + ctx.canvas.height + '<br>');
//document.write("window.innerWidth = " + window.innerWidth + '<br>');
//document.write("window.innerHeight = " + window.innerHeight + '<br>');


function MatchUp(p0,p1,prev1,prev2) {
	this.player0 = p0;
	this.player1 = p1;
	this.previousMatchUp1 = prev1;
	this.previousMatchUp2 = prev2;
	this.winner = undefined;
	this.outX = undefined;
	this.outY = undefined;
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
	this.getOutX = function () {
		return this.outX;
	}
	this.getOutY = function () {
		return this.outY;
	}
	this.draw = function(ctx,x,y,w,h,direction,sx,sy,ex,ey) {
		if ((undefined === sx || undefined === sy) && undefined != this.previousMatchUp1) {
			sx = this.previousMatchUp1.getOutX();
			sy = this.previousMatchUp1.getOutY();
		}
		if ((undefined === ex || undefined === ey) && undefined != this.previousMatchUp2) {
			ex = this.previousMatchUp2.getOutX();
			ey = this.previousMatchUp2.getOutY();
		}
		console.log("MatchUp.draw(): sx=" + sx + ",sy=" + sy + ",ex=" + ex + ",ey=" + ey);
		this.outY = Math.round(sy+((ey-sy)/2));
		if ("left" == direction) {
			this.outX = sx+w;
			ctx.fillText(p0,sx+5,sy-5,w);
			ctx.moveTo(sx,sy);
			ctx.lineTo(this.outX,sy);
			ctx.stroke();
			ctx.fillText(p1,sx+5,ey-5,w);
			ctx.moveTo(this.outX,ey);
			ctx.lineTo(sx,ey);
			ctx.stroke();
			ctx.moveTo(this.outX,sy);
//			ctx.lineTo(this.outX,sy+h);
			ctx.lineTo(this.outX,ey);
			ctx.stroke();
		} else {
			this.outX = sx-w;
			ctx.fillText(p0,this.outX+5,sy-5,w);
			ctx.moveTo(this.outX,sy);
			ctx.lineTo(sx,sy);
			ctx.stroke();
			ctx.fillText(p1,this.outX+5,ey-5,w);
			ctx.moveTo(this.outX,ey);
			ctx.lineTo(sx,ey);
			ctx.stroke();
			ctx.moveTo(this.outX,sy);
			ctx.lineTo(this.outX,ey);
			ctx.stroke();
		}
	}
	this.dump = function() {
		document.write('[' + this.player0 + ',' + this.player1 + ']:' + this.winner);
	}
}

function Round(prev) {
	this.matchups = [];
	this.previousRound = prev;
	this.append = function(m) {
		this.matchups.push(m);
	}
	this.previous = function () {
		return this.previousRound;
	}
	this.getMatchUps = function () {
		return this.matchups;
	}
	this.getNumberOfMatchUps = function () {
		return this.matchups.length;
	}
	this.randomWinners = function () {
		for (x=0;x<this.matchups.length;x++) {
			this.matchups[x];
			y = this.matchups[x].getPlayers().indexOf(undefined);
			if (-1 === y) {
				y = Math.round(Math.random());
			} else {
				y = 0;
			}
			this.matchups[x].setWinner(y);
		}
	}
	this.draw = function(ctx,x,y,w,h,number,numberOfRounds,direction) {
		// direction: {"left","right"}
		gap = 20;
		xSlice = w * (1/(2 * numberOfRounds));
		for (a=0;a<this.matchups.length;a++) {
			m = this.matchups[a];
			ySlice = (h-(2*gap)) / ((number+1) * this.matchups.length);
			if (undefined === this.previousRound) {
				if ("left" === direction) {
					sx = ex = number*xSlice;
				} else {
					sx = ex = ctx.canvas.width - number*xSlice;
				}
				sy = a*ySlice+gap;
				ey = (a+1)*ySlice;
			} else {
				sx = undefined;
				sy = undefined;
				ex = undefined;
				ey = undefined;
			}
			console.log("Round.draw(): sx=" + sx + ",sy=" + sy + ",ex=" + ex + ",ey=" + ey);
			m.draw(ctx,x,y,xSlice,ySlice-gap,direction,sx,sy,ex,ey);
		}
	}
	this.dump = function () {
		document.write('[');
		for (x=0;x<this.matchups.length;x++) {
			this.matchups[x].dump();
			document.write(',');
		}
		document.write(']:' + this.matchups.length);
		document.write(',previous=' + this.previousRound);
	}
}

function Bracket() {
	this.round = [];
	this.height = 0;
	//this.height = 5;
	this.append = function(r) {
		this.round.push(r);
		this.height = Math.ceil(Math.log2(this.round[0].getNumberOfMatchUps()));
	}
	this.getNumberOfRounds = function() {
		return this.round.length;
	}
	this.iterate = function () {
		matchups = this.round[this.round.length-1];
		if (matchups instanceof Array) {
			this.randomWinners(matchups);
			winners = this.getWinners(matchups);
//			document.write("Bracket.iterate(): winners = [" + winners + ']<br>');
			if (1 === winners.length) {
				this.round.push(winners[0]);
			} else {
				nextMatchups = []
				nextNumberOfMatchups = winners.length/2;
//				document.write("Bracket.iterate(): nextNumberOfMatchups = " + nextNumberOfMatchups + '<br>');
				if (1 <= nextNumberOfMatchups) {
					for (x=0;x<nextNumberOfMatchups;x++) {
						p0 = winners[x];
						p1 = winners[x+nextNumberOfMatchups];
						nextMatchups.push(new MatchUp(p0,p1));
					}
					this.round.push(nextMatchups);
				}
			}
		}
	}
	this.draw = function(ctx,x,y,direction) {
		// direction: {"left","right"}
		gap = 20;
		for (r=0;r<this.round.length;r++) {
			console.log("=== Round " + (r+1) + " ===");
			this.round[r].draw(ctx,x,y,ctx.canvas.width/2,ctx.canvas.height,r,this.height,direction);
		}
	}
	this.dump = function () {
		document.write("Bracket.dump(): this.height = " + this.height + '<br>');
		document.write("Bracket.dump(): this.round = [");
		for (r=0;r<this.round.length;r++) {
			this.round[r].dump();
			document.write(",");
		}
		document.write(']<br>');
	}
}


range = function(n) {
	retval = [];
	for(x=0;x<n;x++) {
		retval.push(x);
	}
	return retval;
}
