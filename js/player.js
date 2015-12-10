function Player (key, x, y, game) {

	this.game = game;
	this.player = this.game.add.sprite(x, y, key);
	this.game.physics.arcade.enable(this.player);

	this.player.body.bounce.y = 0;
	this.player.body.gravity.y = 0;
	this.player.body.collideWorldBounds = true;

	this.player.animations.add('left', [8, 9, 10, 11], 10, true);
	this.player.animations.add('right', [0, 1, 2, 3], 10, true);
	this.player.animations.add('stay', [4, 5, 6, 7], 10, true);
	this.player._obj = this;

}

Player.prototype.move = function() {
	var cursors = this.cursor;
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
	}
};

Player.prototype.collideWith = function(platforms) {
	this.game.physics.arcade.collide(this.player, platforms);
};

Player.prototype.collideWithOpponent = function(player, opponent) {
	player._obj.decreaseScore();
};

Player.prototype.collectStar  = function(player, star) {
	star.kill();
	try{
	  player._obj.increaseScore();
	} catch (Won){
	  var name = player._obj.name();
	  changePhaseTo('end', {name: name});
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
Player.prototype.setCursor = function(cursor) {
	this.cursor = cursor;
};
Player.prototype.name = function() {
	return this.score.name;
};

Player.prototype.canCollideWith  = function(opponents) {
	this.game.physics.arcade.overlap(this.player, opponents, this.collideWithOpponent, null, null);
}

Player.prototype.canCollect  = function(stars) {
	this.game.physics.arcade.overlap(this.player, stars, this.collectStar, null, null);
}