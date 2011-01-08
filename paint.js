function Paint(canvas) {
	this.canvas = canvas;
	this.context = null;
}

Paint.prototype = {

	initCanvas: function() {
		this.context = this.canvas.getContext('2d');
		// 清空context
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},

	initForDrawingLine: function() {

		var paint = this;

		this.context.lineWidth = 1;
		this.context.lineCap = 'round';

		this.canvas.addEventListener('mousedown', function(e) {
			paint.isMouseDown = true;
			paint.iLastX = e.clientX - paint.canvas.offsetLeft + (window.pageXOffset||document.body.scrollLeft||document.documentElement.scrollLeft);
			paint.iLastY = e.clientY - paint.canvas.offsetTop + (window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop);
  		});

		this.canvas.addEventListener('mouseup', function() {
			paint.isMouseDown = false;
			paint.iLastX = -1;
			paint.iLastY = -1;
		});

		this.canvas.addEventListener('mousemove', function(evnt) {
			if (paint.isMouseDown) {
				var iX = evnt.clientX - paint.canvas.offsetLeft + (window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft);
				var iY = evnt.clientY - paint.canvas.offsetTop + (window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop);
				paint.context.beginPath();
				paint.context.moveTo(paint.iLastX, paint.iLastY);
				paint.context.lineTo(iX, iY);
				paint.context.stroke();
				paint.iLastX = iX;
				paint.iLastY = iY;
			}
		});
	},

	changeDrawColor: function(color) {
		this.context.strokeStyle = color;
	},

	changeDrawWidth: function(width) {
		this.context.lineWidth = width;
	},

	initForDraggingImage: function() {

		var paint = this;

		this.canvas.addEventListener('drop', function(evnt) {
			var iX = evnt.clientX - paint.canvas.offsetLeft + (window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft);
			var iY = evnt.clientY - paint.canvas.offsetTop + (window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop);
			var image = paint.draggingImage;
			var offset = [image.width / 2, image.height / 2];
			paint.context.drawImage(image, iX - offset[0], iY - offset[1]);
			paint.draggingImage = null;
		});

		this.canvas.addEventListener('dragover', function(event) {
			event.preventDefault();
		});
	},

	setDraggingImage: function(image) {
		this.draggingImage = image;
	}

};

window.addEventListener('DOMContentLoaded', function() {

	var paint = new Paint(document.getElementById('noteContent'));
	paint.initCanvas();

	var colors = document.querySelectorAll('.colors li');
	for (var i = 0; i < colors.length; i++) {
		colors[i].addEventListener('click', function() {
			paint.changeDrawColor(this.style.color);
		}, false);
	}

	var penWidth = document.getElementById('penWidth');
	var penWidthOutput = document.getElementById('penWidthOutput');
	penWidth.addEventListener('change', function() {
		penWidthOutput.innerHTML = this.value;
		paint.changeDrawWidth(this.value);
	}, false);

	// 初始化画线
	paint.initForDrawingLine();

	var imgs = document.querySelectorAll('.pics img');
	for (var i  = 0; i < imgs.length; i++) {
		imgs[i].addEventListener('drag', function() {
			paint.setDraggingImage(this);
		}, false);
	}

	// 初始化放置图片
	paint.initForDraggingImage();

}, false);




















