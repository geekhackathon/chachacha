Splash = function () {};

Splash.prototype = {
  init: function () {
  },

  preload: function () {
  },

  addGameStates: function () {

    game.state.add("GameMenu",GameMenu);
    
    game.state.add("Game",Game);
    
  },

  create: function() {
    this.addGameStates();
    game.state.start("GameMenu");
  }
};

var GameMenu = function() {};


GameMenu.prototype = {

  menuConfig: {
    startY: 260,
    startX: 30
  },

  init: function () {
    this.titleText = game.make.text(game.world.centerX, 100, "Cha Cha Cha", {
      font: 'bold 60pt TheMinion',
      fill: '#FDFFB5',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;
  },

  create: function () {

    game.stage.disableVisibilityChange = true;
    game.add.sprite(0, 0, 'menu-bg');
    game.add.existing(this.titleText);

    this.addMenuOption('Start', function () {
      game.state.start("Game");
    });
    this.addMenuOption('Options', function () {
      game.state.start("Options");
    });
    this.addMenuOption('Credits', function () {
      game.state.start("Credits");
    });
  },

    addMenuOption: function(text, callback, className) {

    // use the className argument, or fallback to menuConfig, but
    // if menuConfig isn't set, just use "default"
    className || (className = this.menuConfig.className || 'default');

    // set the x coordinate to game.world.center if we use "center"
    // otherwise set it to menuConfig.startX
    var x = this.menuConfig.startX === "center" ?
      game.world.centerX :
      this.menuConfig.startX;

    // set Y coordinate based on menuconfig
    var y = this.menuConfig.startY;

      var style = {  font: 'bold 30pt TheMinion',
      fill: '#FDFFB5', wordWrap: true, wordWrapWidth: 600, align: "center" };
    // create
    var txt = game.add.text(
      x,
      (this.optionCount * 80) + y,
      text,
      style
    );

    // use the anchor method to center if startX set to center.
    txt.anchor.setTo(this.menuConfig.startX === "center" ? 0.5 : 0.0);

    txt.inputEnabled = true;

    txt.events.onInputUp.add(callback);
    txt.events.onInputOver.add(function (target) {
      target.setStyle(style.navitem.hover);
    });
    txt.events.onInputOut.add(function (target) {
      target.setStyle(style.navitem[className]);
    });

    this.optionCount ++;
  }
};

