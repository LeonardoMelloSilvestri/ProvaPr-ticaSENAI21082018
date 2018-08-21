$(document).ready(function() {

	var canvas = $("#canvas");
	var ctx = canvas[0].getContext("2d");

	enemies = [];

	images = new LoadImages();
	intro = new Intro();
	player = new Player();
	enemy = new GlobalEnemies();
	gameOver = new GameOver();

	$(document).keydown(function(e) {
		switch(e.which) {
			case 13:
				intro.isOn = false;
				if(gameOver.isOn == true) {
					gameOver.resetGame();
					gameOver.isOn = false;
				}
				break;
			case 37:
				player.moveLeft = true;
				break;
			case 39:
				player.moveRight = true;
				break;
		}
	})

	$(document).keyup(function(e) {
		switch(e.which) {
			case 37:
				player.moveLeft = false;
				break;
			case 39:
				player.moveRight = false;
				break;
		}
	})

	function LoadImages() {
		this.imgPlayer = new Image();
		this.imgPlayer.src = "./img/player.png";
		this.imgEnemy = new Image();
		this.imgEnemy.src = "./img/enemy.png";
		this.imgBackgroundIntro = new Image();
		this.imgBackgroundIntro.src = "./img/introBackground.jpg";
	}

	function init() {
		loop();
	}

	function update() {
		if(intro.isOn == false && player.hp > 0) {
			player.move();
			player.colideEnemy();
			enemy.colideMargin();
			gameOver.resetGame();

		}
	}

	function draw() {
		ctx.clearRect(0, 0, canvas.width(), canvas.height());
		intro.draw();
		gameOver.draw();
		if(intro.isOn == false && player.hp > 0) {
			player.draw();
			enemy.drawEnemies();
			ctx.fillStyle = "White";
			ctx.font = "30px Cursive";
			ctx.textAlign = "left";
			ctx.fillText("Vida: " + player.hp, 30, 30);
			ctx.fillText("Pontos: " + player.score, 400, 30);
		}
		if(player.hp <= 0) {
			gameOver.isOn = true;
		}
	}

	function loop() {
		window.requestAnimationFrame(loop, canvas)
		update();
		draw();
	}

	function GameOver() {
		this.width = 500;
		this.height = 500;
		this.x = canvas.width() / 2 - this.width / 2;
		this.y = canvas.height() / 2 - this.height / 2;
		this.img = images.imgBackgroundIntro;
		this.isOn = false;
		this.img = images.imgBackgroundIntro;

		this.draw = function() {
			if(this.isOn == true) {
				ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
				ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
				ctx.fillStyle = "Black";
				ctx.shadowColor = "White";
				ctx.shadowBlur = 3;
				ctx.font = "50px Cursive";
				ctx.textAlign = "center";				
				ctx.fillText("Você perdeu!", canvas.width() / 2, 100);
				ctx.font = "40px Cursive";					
				ctx.fillText("Pontuação final: " + player.score, canvas.width() / 2, 180);
				ctx.fillText("Aperte ENTER para", canvas.width() / 2, 300);
				ctx.fillText("jogar novamente!", canvas.width() / 2, 350);
				ctx.shadowBlur = 0;					
			}
		}

		this.resetGame = function() {
			if(this.isOn == true) {
				player = new Player();
				enemies = [];
			}
		}
	}

	function Intro() {
		this.width = 500;
		this.height = 500;
		this.x = canvas.width() / 2 - this.width / 2;
		this.y = canvas.height() / 2 - this.height / 2;
		this.img = images.imgBackgroundIntro;
		this.isOn = true;

		this.draw = function() {
			if(this.isOn == true) {
				ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
				ctx.fillStyle = "Black";
				ctx.shadowColor = "White";
				ctx.shadowBlur = 3;
				ctx.font = "40px Cursive";
				ctx.textAlign = "center";				
				ctx.fillText("Objetivo", canvas.width() / 2, 100);
				ctx.font = "30px Cursive";					
				ctx.fillText("Esquive-se dos carros brancos", canvas.width() / 2, 150);
				ctx.font = "40px Cursive";
				ctx.fillText("Comandos", canvas.width() / 2, 230);
				ctx.font = "30px Cursive";
				ctx.fillText("Mover para a direita: →", canvas.width() / 2, 280);
				ctx.fillText("Mover para a esquerda: ←", canvas.width() / 2, 320);
				ctx.font = "40px Cursive";
				ctx.fillText("Boa sorte", canvas.width() / 2, 430);
				ctx.fillText("Aperte ENTER para iniciar", canvas.width() / 2, 480);
				ctx.shadowBlur = 0;						
			}
		}
	}

	function Player() {
		this.width = 70;
		this.height = 120;
		this.x = canvas.width() / 2 - this.width / 2;
		this.y = canvas.height() - this.height - 10;
		this.speed = 10;
		this.moveLeft = this.moveRight = false;	
		this.hp = 10;
		this.score = 0;
		this.img = images.imgPlayer;

		this.draw = function() {		
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		}

		this.move = function() {
			if(this.moveLeft == true && this.x >= 10) {
				this.x -= this.speed;
			} else if(this.moveRight == true && this.x + this.width <= canvas.width() - 10) {
				this.x += this.speed;
			}
		}

		this.colideEnemy = function() {
			for (var i = 0; i < enemies.length; i++) {
				var currentEnemy = enemies[i];

				if(currentEnemy.y + currentEnemy.height >= this.y &&
					currentEnemy.y <= this.y + this.height &&
					currentEnemy.x + currentEnemy.width >= this.x &&
					currentEnemy.x <= this.x + this.width) {
					this.hp--;
					enemies.splice(enemies.indexOf(currentEnemy), 1);
				}
			}
		}		
	}

	function Enemy() {
		this.width = 50;
		this.height = 100;
		this.x = Math.floor((Math.random() * 550));
		this.y = 0;		
		this.speed = 8;
		this.points = 10;
		this.img = images.imgEnemy;

		this.draw = function() {			
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		}

		this.move = function() {
			this.y += this.speed;
		}
	}

	function GlobalEnemies() {
		this.drawEnemies = function() {
			for (var i = 0; i < enemies.length; i++) {	
				var currentEnemy = enemies[i];
				currentEnemy.draw();
				currentEnemy.move();
			}
		}	
		
		this.spawnEnemies = function() {
			setInterval(function() {
				if(intro.isOn == false) {
					enemies.push(new Enemy());
				}
			}, 400)
		}

		this.colideMargin = function() {
			for(var i = 0; i < enemies.length; i++) {
				var currentEnemy = enemies[i];

				if(currentEnemy.y >= canvas.height()) {
					enemies.splice(enemies.indexOf(currentEnemy), 1);
					player.score += 10;
				}
			}
		}
	}
	
	enemy.spawnEnemies();
	init();
});