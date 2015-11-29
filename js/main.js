var game;
var started = false;
function startGame(){
  if(!started){
    document.getElementById('menu').remove();
   game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });
   started = true;
  }
}




function Player (key, x, y) {

    this.player = game.add.sprite(x, y, key);

    game.physics.arcade.enable(this.player);

    this.player.body.bounce.y = 0;
    this.player.body.gravity.y = 0;
    this.player.body.collideWorldBounds = true;

    this.player.animations.add('left', [8, 9, 10, 11], 10, true);
    this.player.animations.add('right', [0, 1, 2, 3], 10, true);
		this.player.animations.add('stay', [4, 5, 6, 7], 10, true);
    this.player._obj = this;

}

Player.prototype.move = function(cursors) {
    var player = this.player;

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    var playerSpeed = 150;

     if (cursors.left.isDown || cursors.right.isDown ||cursors.up.isDown ||cursors.down.isDown){
        if (cursors.left.isDown) {
            player.body.velocity.x = -playerSpeed;
            player.animations.play('left');
        } if (cursors.right.isDown) {
            player.body.velocity.x = playerSpeed;
            player.animations.play('right');
        } if (cursors.up.isDown) {
            player.body.velocity.y = -playerSpeed;
        } if (cursors.down.isDown) {
            player.body.velocity.y = playerSpeed;
        }
    } else {
        player.animations.play('stay');

      //  player.frame = 4;
    }
};

Player.prototype.collideWith = function(platforms) {
    game.physics.arcade.collide(this.player, platforms);
};

Player.prototype.collideWithOpponent = function(player, opponent) {
		opponent._obj.dying();
    player._obj.decreaseScore();
};



Player.prototype.collectStar  = function(player, star) {

    // Removes the star from the screen
    star.kill();
    try{
      player._obj.increaseScore();
    } catch (Won){
      var name = player._obj.name()
      document.getElementById('end').innerHTML  = '<img src="assets/'+name+'wins.jpg"> </img>';
      document.getElementById('game').remove();
    }  
    createStar(stars);

}

Player.prototype.increaseScore = function() {
    this.score.increase();
};

Player.prototype.decreaseScore = function() {
    this.score.decrease();
};

Player.prototype.setScore = function(score) {
    this.score = score;
};
Player.prototype.name = function() {
    return this.score.name;
};

Player.prototype.overlap2  = function(opponents) {
    game.physics.arcade.overlap(this.player, opponents, this.collideWithOpponent, null, null);
}


Player.prototype.overlap  = function(stars) {
    game.physics.arcade.overlap(this.player, stars, this.collectStar, null, null);
}

function Opponent () {
    var x = Math.floor((Math.random() * 495) + 1);
		var y = Math.floor((Math.random() * 495) + 1);
    this.value = game.add.sprite( game.world.width - x, game.world.height - y, 'enemy1');

    var value = this.value;

    game.physics.arcade.enable(value);
    value.body.collideWorldBounds = true;

    value.animations.add('left', [0, 1, 2, 3], 10, true);
		//var muerte=value.animations.add('die', [4, 5, 6, 7], 10, false);
		//muerte.killOnComplete = true;
		value.animations.add('right', [0, 1, 2, 3], 10, true);
    this.x = "x";
    this.y = "y";
    this.axis = this.y;

    this.value.body.velocity.x = Math.random()*400;
    this.value.body.velocity.y = Math.random()*400;

    this.value.body.bounce.y = 0.95;
    this.value.body.bounce.x = 0.95;

    this.value._obj = this;

}

Opponent.prototype.move = function() {
    /*
    this.value.body.position.x += this.value.body.velocity.x/4;
    this.value.body.position.y += this.value.body.velocity.y/4;
    */
    this.value.animations.play('left');
};

Opponent.prototype.dying = function() {
    this.value.animations.play("die");
};

Opponent.prototype.switch_direction = function (self) {
    "use strict";
    if (self._obj.axis ===  self._obj.x && self.body.velocity.x > 0) {
        self.body.velocity.y = -150;
        self.body.velocity.x = 1530;
        self._obj.axis = self._obj.y;
    } else if (self._obj.axis ===  self._obj.x && self.body.velocity.x <= 0) {
        self.body.velocity.y = 150;
        self.body.velocity.x = 1530;
        self._obj.axis = self._obj.y;
    } else if (self._obj.axis ===  self._obj.y && self.body.velocity.y <= 0) {
        self.body.velocity.y = 0;
        self.body.velocity.x = 1530;
        self._obj.axis = self._obj.x;
    } else {
        self.body.velocity.y = 0;
        self.body.velocity.x = -1530;
        self._obj.axis = self._obj.x;
    }
};

Opponent.prototype.overlap  = function(obstacles) {
    game.physics.arcade.overlap(this.value, obstacles, this.switch_direction, null, this);
}

Opponent.prototype.collideWith = function(platforms) {
    game.physics.arcade.collide(this.value, platforms, this.switch_direction, null, null);
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

var player;
var player1;
var opponent1;
var platforms;
var cursors;
var blueplayer;
var redplayer;
var opponents;
var stars;
var scores;
var music;
var chachacha;

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
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


    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    //var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    //ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    //ground.body.immovable = true;

    //  Now let's create two ledges
    // var ledge = platforms.create(400, 400, 'ground');
    // ledge.body.immovable = true;

    // ledge = platforms.create(-150, 250, 'ground');
    // ledge.body.immovable = true;

    // The player and its settings
    scores={player1: new Score(16,16, 'red'), player2: new Score(550,16, 'blue')};

    player = new Player('redplayer', 32, game.world.height - 150);
    player.setScore(scores.player1);
		player1 = new Player('blueplayer', 32, 150);
    player1.setScore(scores.player2);

    opponent1 = new Opponent();
		opponent2 = new Opponent();
		opponent3 = new Opponent();
		opponent4 = new Opponent();
		opponent5 = new Opponent();
		opponent6 = new Opponent();
		opponent7 = new Opponent();
    //  Finally some stars to collect
    stars = game.add.group();

		opponents= game.add.group();
		opponents.enableBody = true;
		opponents.add(opponent1.value);
		opponents.add(opponent2.value);
		opponents.add(opponent3.value);
		opponents.add(opponent4.value);
		opponents.add(opponent5.value);
		opponents.add(opponent6.value);
		opponents.add(opponent7.value);

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 30; i++) {
        createStar(stars);
    }

    cursors = createControls();


}

function createStar(stars){
  //  Create a star inside of the 'stars' group
        var star = stars.create(Math.random()*game.width, Math.random()*game.height, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 0;

        //  This just gives each star a slightly random bounce value
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
    player.move(cursors.arrows);
    player1.move(cursors.wasd);
    opponent1.move();

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
    //  Collide the player and the stars with the platforms
    player.collideWith(platforms);
		player1.collideWith(platforms);

    opponent1.collideWith(platforms);
		game.physics.arcade.collide(opponents, platforms);
    game.physics.arcade.collide(stars, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    player.overlap(stars);
    //opponent1.overlap(platforms);
		player.overlap2(opponents);
		player1.overlap(stars);
		//opponent1.overlap(platforms);
		player1.overlap2(opponents);
}