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

		this.canvas.addEventListener('mousemove', function(event) {
			if (paint.isMouseDown) {
				var iX = event.clientX - paint.canvas.offsetLeft + (window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft);
				var iY = event.clientY - paint.canvas.offsetTop + (window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop);
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

		this.canvas.addEventListener('drop', function(event) {
			var image = paint.draggingImage;
			var offset = [image.width / 2, image.height / 2];
			console.log(event)
			console.dir(image)
			var x = event.offsetX - offset[0];
			var y = event.offsetY - offset[1];
			paint.context.drawImage(image, x, y);
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

	// 支持输入文字
	supportText();

	var paint = new Paint(document.getElementById('noteContent'));
	paint.initCanvas();

	var colors = document.querySelectorAll('.colors li');
	var cOut = document.getElementById('colorOutput');
	for (var i = 0; i < colors.length; i++) {
		colors[i].addEventListener('click', function() {
			paint.changeDrawColor(this.style.color);
			cOut.innerHTML = cOut.style.color = this.innerHTML;
		}, false);
	}

	var penWidth = document.getElementById('penWidth');
	var penWidthOutput = document.getElementById('penWidthOutput');
	penWidth.addEventListener('change', function() {
		penWidthOutput.innerHTML = this.value;
		paint.changeDrawWidth(this.value);
	}, false);
	
	var fontSize = document.getElementById('fontSize');
	var fontSizeOutput = document.getElementById('fontSizeOutput');
	fontSize.addEventListener('change',function(){
		fontSizeOutput.innerHTML = this.value;
	});

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



















var textFillStyle = "#ff0000";
var textFontSize = "15"
var textFontFamily = "sans-serif";

function supportText() {
    var show_offset = 10;

    var cv = document.getElementById("noteContent");
    var tw = document.getElementById("textarea_wapper");
    var btn_pt = document.getElementById("print_text");
    var btn_ct = document.getElementById("cancel_text");
    var text_area = document.getElementById("text_area");
    cv.addEventListener('dblclick', begin_input_textarea , false);
    btn_ct.addEventListener('click', cancel_text_to_canvas, false);
    btn_pt.addEventListener('click', print_text_to_canvas, false);

    function get_position_canvas() {
      var iX = window.event.clientX - cv.offsetLeft + (window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft);
      var iY = window.event.clientY - cv.offsetTop + (window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop);
      return {x: iX, y: iY};
    }    

    function get_position() {
      var ev = window.event;

      if(ev.pageX || ev.pageY){
        return {x:ev.pageX, y:ev.pageY};
      }

      return { x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y:ev.clientY + document.body.scrollTop - document.body.clientTop };
    }

    var print_text_position; 

    function begin_input_textarea(ev) {
      // get pointY
      var t = get_position_canvas();
      var w = get_position();
      console.log(t.x);
      console.log(t.y);
      console.log(w.x);
      console.log(w.y);
      // show textarea

      print_text_position = t;

      tw.style.display = "block"
      tw.style.top = (w.y + show_offset)+ "px";
      tw.style.left = (w.x + show_offset) + "px";

      text_area.focus();
      
    }

    function print_text_to_canvas() {
      console.log(text_area.value);
      var content = text_area.value.split('\n');
      console.log(content.length);

      var i = 0;
      var ctx = cv.getContext("2d");
      ctx.fillStyle = textFillStyle;
      ctx.font = textFontSize + "px " + textFontFamily;

      for (i = 0; i < content.length; i++) {
        ctx.fillText(content[i], print_text_position.x, print_text_position.y + (i * 15));
      }

      cancel_text_to_canvas();
    }

    function cancel_text_to_canvas() {
      tw.style.display = "none";
      text_area.value = "";
    }

}

