var game;
var started = false;
function startGame(){
	if(!started){
		changePhaseTo('gameplay');
		game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });
		started = true;
	}
}

function changePhaseTo(id, payload){

	if (id === 'end') {
		var name = payload.name;
		document.getElementById('end').innerHTML  = '<img src="assets/'+name+'wins.jpg"> </img>';
		document.getElementById('game').remove();
	} else if (id === 'gameplay'){
		document.getElementById('menu').remove();
	}

}


function Opponent () {

	var randomUpTo = function(higherBound){
		return Math.random() * higherBound;
	}

	var x = randomUpTo(game.world.width);
	var y = randomUpTo(game.world.height);
	this.value = game.add.sprite(x, y, 'enemy1');

	var value = this.value;

	game.physics.arcade.enable(value);
	value.body.collideWorldBounds = true;

	value.animations.add('left', [0, 1, 2, 3], 10, true);
	value.animations.add('right', [0, 1, 2, 3], 10, true);

	this.value.body.velocity.x = randomUpTo(400);
	this.value.body.velocity.y = randomUpTo(400);

	var bounceRate = 0.95;
	this.value.body.bounce.y = bounceRate;
	this.value.body.bounce.x = bounceRate;

	this.value._obj = this;
}

Opponent.prototype.move = function() {
	this.value.animations.play('left');
};

Opponent.prototype.dying = function() {
	this.value.animations.play("die");
};

function preload() {

	game.load.image('background1', 'assets/background_layout_stars_one.png');
	game.load.image('background2', 'assets/background_layout_stars_two.png');
	game.load.image('background3', 'assets/background_layout_stars_three.png');
	game.load.image('ground', 'assets/platform.png');
	game.load.image('ground2', 'assets/ground.png');
	game.load.image('star', 'assets/star.png');
	game.load.image('moon', 'assets/moon.png');
	game.load.spritesheet('blueplayer', 'assets/blueplayer_16.png', 64, 32);
	game.load.spritesheet('redplayer', 'assets/redplayer_16.png', 64, 32);
	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
	game.load.spritesheet('enemy1', 'assets/enemy3.png', 32, 32);
	game.load.audio('music', ['assets/music.mp3', 'assets/music.ogg']);
	game.load.audio('chachacha', ['assets/chachacha.mp3', 'assets/chachacha.ogg']);

}

function Score(x, y, name){
	this.value = 0;
	this.text = "";
	this.name = name;
	this.at(x,y);
}

function getQueryParams(qs) {
	qs = qs.split('+').join(' ');

	var params = {},
	tokens,
	re = /[?&]?([^=]+)=([^&]*)/g;

	while (tokens = re.exec(qs)) {
		params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	}

	return params;
}

var winningScore = getQueryParams(document.location.search)["score"] || 500;

Score.prototype.increase = function() {
	this.value += 10;
	this.scoreText.text = this.show(this.value);
	if(this.value >= winningScore){
		throw Won();
	}
};

Score.prototype.decrease = function() {
	this.value -= 3;
	this.scoreText.text = this.show(this.value);
};

Score.prototype.show = function(score) {
	return this.name + '\'s score: ' + score;
};

Score.prototype.at = function(x, y) {
	this.scoreText = game.add.text(x, y, this.show(0), { fontSize: '32px', fill: '#fff' });
};

var players;
var opponent1;
var cursors;
var blueplayer;
var redplayer;
var opponents;
var stars;
var scores;
var music;
var chachacha;

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	music = game.sound.play('music');
	background1 = game.add.sprite(0, 0, 'background1');
	background2 = game.add.sprite(0, 0, 'background2');
	background3 = game.add.sprite(0, 0, 'background3');
	background4 = game.add.sprite(game.width, 0, 'background1');
	background5 = game.add.sprite(game.width, 0, 'background2');
	background6 = game.add.sprite(game.width, 0, 'background3');
	moon = game.add.sprite(1000, 500, 'moon');
	ground2 = game.add.sprite(0,game.world.height-64, 'ground2');
	ground3 = game.add.sprite(1600,game.world.height-64, 'ground2');


	scores={player1: new Score(16,16, 'red'), player2: new Score(550,16, 'blue')};

	cursors = createControls();
	players = createPlayers(cursors, scores);
	opponents= createOpponents();
	stars = createStars();

}

function createPlayers(cursors, scores){
	var players = []; 

	{
		var player = new Player('redplayer', 32, game.height - 150, game);
		player.setCursor(cursors.arrows);
		player.setScore(scores.player1);
		players.push(player);
	}

	{
		var player = new Player('blueplayer', 32, 150, game);
		player.setCursor(cursors.wasd);
		player.setScore(scores.player2);
		players.push(player);
	}
	return players;
}

function createOpponents(){
	var opponents = game.add.group();
	var numberOfOpponents = 7;
	opponents.enableBody = true;
	for (var i = 0; i < numberOfOpponents; i++) {
		opponents.add(new Opponent().value);
	}
	return opponents;
}

function createStars(){
	var stars = game.add.group();
	var numberOfStars = 30;
	stars.enableBody = true;

	for (var i = 0; i < numberOfStars; i++) {
		createStar(stars);
	}

	return stars;
}

function createStar(stars){
	var star = stars.create(Math.random()*game.width, Math.random()*game.height, 'star');
	star.body.bounce.y = 0.7 + Math.random() * 0.2;
}

function createControls(){
	return {
		arrows: game.input.keyboard.createCursorKeys(),
		wasd: {
			up: game.input.keyboard.addKey(Phaser.Keyboard.W),
			down: game.input.keyboard.addKey(Phaser.Keyboard.S),
			left: game.input.keyboard.addKey(Phaser.Keyboard.A),
			right: game.input.keyboard.addKey(Phaser.Keyboard.D)
		}
	};
}

function update() {
	moveBackground(background1, 1);
	moveBackground(background2, 2);
	moveBackground(background3, 3);
	moveBackground(background6, 3);
	moveBackground(background4, 1);
	moveBackground(background5, 2);
	moveGround(ground2, 1);
	moveGround(ground3, 1);
	moonspawn(moon, 3)

	manage_collisions (game);
	players.forEach(function(player){
		player.move();
	});
}
var moonspawn = function(background, speed) {
	moveBackground(moon, speed);
	if(background.x < -300) {
		background.x = game.rnd.integerInRange(3000, 6000);
		background.y = game.rnd.integerInRange(-100, 500);
	}

}

var moveBackground = function(background, speed) {
	if (background.x < -game.width) {
		background.x = game.width;
	}
	background.x -= speed
}

var moveGround = function(ground, speed){
	var treshold = 2*game.width;
	if (ground.x < -treshold) {
		ground.x = treshold;
	}
	ground.x -= speed;
}


function manage_collisions (game) {
	players.forEach(function(player){
		player.canCollect(stars);
		player.canCollideWith(opponents);
	})
}