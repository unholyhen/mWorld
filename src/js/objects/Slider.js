Slider.prototype = Object.create(Phaser.Group.prototype);
Slider.prototype.constructor = Slider;

/**
 * A slider (that is an interactive handle on a line).
 * @param {Object} A list of options:
 *		x: the x position (default 0).
 *		y: the y position (default 0).
 *      width: the width (of the line) (default 300).
 *      height: the height (of the handle) (default 50).
 *      onChange: function to run when handle changes (default null).
 *      initial: initial value of the slider (default 0).
 * @return {Object} Itself.
 */
function Slider (x, y, width, height, onChange, initial) {
	Phaser.Group.call(this, game, null); // Parent constructor.
	this.x = x || 0;
	this.y = y || 0;
	this.onChange = onChange;

	height = height	|| 50;
	width = width || 300;
	initial = initial || 0;

	/* Add the line. */
	// TODO: This should perhaps not be 'wood'...
	var line = this.create(0, 0, 'wood');
	line.anchor.set(0, 0.5);
	line.height = height/10;
	line.width = width;

	/* Add the handle. */
	this.handle = this.create(0, 0, 'wood');
	this.handle.anchor.set(0.5);
	this.handle.width = height;
	this.handle.height = height;
	this.handle.max = line.width - this.handle.width;
	this.handle.x = this.handle.max * initial;

	/* Move objects so that handle is easy to use */
	this.x += this.handle.width/2;
	line.x -= this.handle.width/2;

	/* Use a large input area, that can be pushed anywhere on the slider */
	var trigger = this.create(line.x, line.y,
		game.add.bitmapData(line.width, this.handle.height));
	trigger.anchor.set(0, 0.5);
	trigger.inputEnabled = true;

	trigger.events.onInputDown.add(function () {
		var _this = this; // _this is the whole slider
		this.handle.frame++;
		this.handle.update = function () {
			// this will be the handle in this scope.

			this.x = game.input.activePointer.x - _this.x;
			if (this.x < 0) {
				this.x = 0;
			} else if (this.x > this.max) {
				this.x = this.max;
			}

			_this.onChange(this.x / this.max);
		};
	}, this);

	trigger.events.onInputUp.add(function () {
		this.handle.update = function () {};
		this.handle.frame--;
	}, this);
}

/**
 * @property {number} value - The value of the slider.
 */
Object.defineProperty(Slider.prototype, 'value', {
	get: function() {
		return this.handle.x / this.handle.max;
	},
	set: function(value) {
		this.handle.x = this.handle.max * value;
		this.onChange(value);
	}
});
