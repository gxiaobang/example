/**
 * 贪吃蛇
 * author: bang
 * date: 2014-8-27
 */

;(function(global) {
	"use strict";
	// 游戏对象
var game,
	// 清理当前帧
	clearFrame,
	// 更新帧
	updateFrame,
	// 获取随机数
	rand,
	// 定时器ID
	timeID,
	FPS = 60;

clearFrame = function(canvas, context) {
	context.clearRect(0, 0, canvas.width, canvas.height);
};
updateFrame = function(canvas, context, callback) {
	clearFrame(canvas, context);
	timeID = setTimeout(function() {
		updateFrame(canvas, context, callback);
	}, 1000 / FPS);
	callback();
};
rand = function(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
};

game = {
	// 配置
	config: function(opt) {
		// canvas标签
		this.canvas = opt.canvas;
		// 绘图环境
		this.context = this.canvas.getContext('2d');
		// 开始按钮
		this.btns = opt.btns;
		// 分数面板
		this.score = opt.score;
		// 游戏速度，初始化为200ms
		this.speed = opt.speed || 200;
		this.init();
	},
	init: function() {
		this.initMap();
		this.initEvent();
	},
	// 初始化事件
	initEvent: function() {
		var _game = this;
		this.btns.start.onclick = function() {
			_game.start();
		};
		this.btns.pause.onclick = function() {
			_game.pause();
		};
		// 键盘事件
		document.onkeydown = function(event) {
			event = event || window.event;
			switch (event.keyCode) {
				// 左
				case 37:
					_game.dir = 'left';
					break;
				// 上
				case 38:
					_game.dir = 'up';
					break;
				// 右
				case 39:
					_game.dir = 'right';
					break;
				// 下
				case 40:
					_game.dir = 'bottom';
					break;
			}
		};
	},
	initMap: function() {
		// C: 横向单元格 R: 纵向单元格
		this.C = Math.ceil(this.canvas.width / 20);
		this.R = Math.ceil(this.canvas.height / 20);
	},
	// 创建角色
	create: function() {
		this.createSnake();
		this.createFood();
	},
	// 创建蛇
	createSnake: function() {
		// 分成一个个小方块, 初始化5节, 头到尾
		this.snake = [];
		this.dir = 'right';
		this.snake.push({ c: Math.ceil(this.C / 2), r: Math.ceil(this.R / 2) });
		for (var i = 1; i <= 5; i++) {
			this.snake[i] = { c: this.snake[i - 1].c - 1, r: this.snake[0].r };
		}
	},
	// 创建食物
	createFood: function() {
		// 初始化为一个
		this.foods = [];
		var num = 2, 
			i, r, c;
		
		while (num-- > 0) {
			loop: 
			while(true) {
				c = rand(0, this.C);
				r = rand(0, this.R);
				for (i = 0; i < this.foods.length; i++) {
					if (c === this.foods[i].c && r === this.foods[i].r) {
						continue loop;
					}
				}
				for (i = 0; i < this.snake.length; i++) {
					if (c === this.snake[i].c && r === this.snake[i].r) {
						continue loop;
					}
				}
				this.foods.push({ c: c, r: r });
				break loop;
			}
		}
	},
	// 游戏开始
	start: function() {
		var _game = this;
		console.log('游戏开始');
		this.running = true;
		this.create();
		updateFrame(this.canvas, this.context, function() {
			if (_game.running) {
				_game.drawFrame();
			}
		});
	},
	// 暂停
	pause: function() {
		this.btns.pause.innerHTML = this.running ? '继续' : '暂停';
		this.running = !this.running;
	},
	// 绘画帧
	drawFrame: function() {
		// 先画蛇
		this.drawSnake();
		// 接着画食物
		this.drawFood();
	},
	// 方块
	drawRect: function(c, r) {
		this.context.beginPath();
		this.context.rect(c * 20, r * 20, 20, 20);
		this.context.fill();
	},
	// 画蛇
	drawSnake: function() {
		this.stepSnake();
		var i;
		this.context.save();
		// 定义画图样式
		this.context.fillStyle = '#d44027';
		for (i = 0; i < this.snake.length; i++) {
			this.drawRect(this.snake[i].c, this.snake[i].r);
		}
		this.context.restore();
	},
	// 前进
	stepSnake: function() {
		this.elaspsedTime = +new Date - this.beginTime;
		// 没超过时间不用处理
		if (this.elaspsedTime < this.speed) {
			// this.time = +new Date;
			return;
		}

		this.beginTime = +new Date;
		this.follow();
		switch (this.dir) {
			case 'left':
				this.snake[0].c--;
				break;
			case 'up':
				this.snake[0].r--;
				break;
			case 'right':
				this.snake[0].c++;
				break;
			case 'bottom':
				this.snake[0].r++;
				break;
		}
		this.surround();
		this.collision();
	},
	// 跟随
	follow: function() {
		for (var i = this.snake.length - 1; i > 0; i--) {
			this.snake[i].c = this.snake[i - 1].c;
			this.snake[i].r = this.snake[i - 1].r;
		}
	},
	// 环绕
	surround: function() {
		if (this.snake[0].c < 0) {
			this.snake[0].c = this.C;
		}
		else if (this.snake[0].c >= this.C) {
			this.snake[0].c = 0;
		}
		else if (this.snake[0].r < 0) {
			this.snake[0].r = this.R;
		}
		else if (this.snake[0].r >= this.R) {
			this.snake[0].r = 0;
		}
	},
	// 碰撞
	collision: function() {
		// if (this.hitTest())
		var i;
		// 吃到食物
		for (i = 0; i < this.foods.length; i++) {
			if (this.snake[0].c === this.foods[i].c && this.snake[0].r === this.foods[i].r) {
				this.foods.splice(i, 1);
				this.eatFood();
				return 'eat food';
			}
		}
		// 吃到自己
		for (i = 1; i < this.snake.length; i++) {
			if (this.snake[0].c === this.snake[i].c && this.snake[0].r === this.snake[i].r) {
				this.over();
				return 'eat self';
			}
		}
		// return 'null';
	},
	// 画食物
	drawFood: function() {
		var i;
		this.context.save();
		// 定义画图样式
		this.context.fillStyle = '#4183c4';
		for (i = 0; i < this.foods.length; i++) {
			this.drawRect(this.foods[i].c, this.foods[i].r);
		}
		this.context.restore();
	},
	// 吃到食物
	eatFood: function() {
		if (this.foods.length === 0) {
			this.createFood();
		}
		this.score.innerHTML = parseInt(this.score.innerHTML) + 100;
	},
	// 游戏线束
	over: function() {
		console.log('游戏结束');
		new Dialog({ log: '游戏结束' });
		clearTimeout(timeID);
	}
};

global.game = game;
})(this);
