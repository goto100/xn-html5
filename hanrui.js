
// Input 10
goog.require('goog.dom');
goog.require('goog.dom.DomHelper');
goog.require('goog.dom.NodeType');

var mypaint = {};

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;
const COLORS = ['red', 'blue', 'green', 'lime', 'orchid', 'purple', 'pink',
                'silver', 'yellow', 'burlywood', 'chocolate', 'black'];
const LINE_WIDTHS = [1, 2, 5, 10, 20];
const IMAGE_NAMES = ['ass', 'bee', 'bird', 'boydog', 'girldog', 'boypig',
                     'girlpig', 'cat', 'sleepcat', 'cutepenguin',
                     'linuxpenguin', 'rabbit', 'grayrabbit', 'winnie'];

function initCanvas() {
  // Resizes the window first.
  window.resizeTo(1350, 800);
  
  // Inits Canvas.
  mypaint.canvas = goog.dom.$('paint_canvas');
  mypaint.canvas.setAttribute('width', CANVAS_WIDTH);
  mypaint.canvas.setAttribute('height', CANVAS_HEIGHT);

  mypaint.context = mypaint.canvas.getContext('2d');
  mypaint.context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  mypaint.context.lineWidth = 1;
  mypaint.context.lineCap = 'round';

  // Resets all variables.
  mypaint.isMouseDown = false;
  

  //Canvas2Image.saveAsPNG(goog.dom.$('paint_canvas'));
  initForDrawingLine();
  
  initForDraggingImage();
}

window.addEventListener('load', initCanvas);

initForDraggingImage = function() {
  mypaint.canvas.addEventListener('drop', function(evnt) {
    var arr = goog.dom.$$('img', 'image_icon');
    for (var i = 0; i < arr.length; i++) {
      arr[i].style.backgroundColor = 'transparent';
    }
    var iX = evnt.clientX - mypaint.canvas.offsetLeft + (window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft);
    var iY = evnt.clientY - mypaint.canvas.offsetTop + (window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop);
    mypaint.context.drawImage(mypaint.draggedImage, iX - 40, iY - 40);
    mypaint.draggedImage = null;
  });
  
  mypaint.canvas.addEventListener('dragover', function(evnt) {
    evnt.preventDefault();
  });
}

/*
function draw() {
  var img = new Image();
  img.src = 'images/icons/bee80.png';
  mypaint.context.beginPath();  
  mypaint.context.moveTo(30, 96);  
  mypaint.context.lineTo(70, 66);  
  mypaint.context.lineTo(103, 76);  
  mypaint.context.lineTo(170, 15);  
  mypaint.context.stroke();
  mypaint.context.drawImage(img, 100, 100);  
}
*/

initForDrawingLine = function() {
  mypaint.canvas.addEventListener('mousedown', function(e) {
    mypaint.isMouseDown = true;
    mypaint.iLastX = e.clientX - mypaint.canvas.offsetLeft + (window.pageXOffset||document.body.scrollLeft||document.documentElement.scrollLeft);
    mypaint.iLastY = e.clientY - mypaint.canvas.offsetTop + (window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop);
  });
  
  mypaint.canvas.addEventListener('mouseup', function() {
    mypaint.isMouseDown = false;
    mypaint.iLastX = -1;
    mypaint.iLastY = -1;
  });

  mypaint.canvas.addEventListener('mousemove', function(evnt) {
    if (mypaint.isMouseDown) {
      var iX = evnt.clientX - mypaint.canvas.offsetLeft + (window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft);
      var iY = evnt.clientY - mypaint.canvas.offsetTop + (window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop);
      mypaint.context.beginPath();
      mypaint.context.moveTo(mypaint.iLastX, mypaint.iLastY);
      mypaint.context.lineTo(iX, iY);
      mypaint.context.stroke();
      mypaint.iLastX = iX;
      mypaint.iLastY = iY;
    }
  });
}

function generateLineWidthSelect() {
  var strArray = [];
  var len = LINE_WIDTHS.length;
  for (var i = 0; i < len; i++) {
    width = LINE_WIDTHS[i];
    strArray.push('<div class="linewidth_select_item" onclick="changeLineWidth(this, ',
                  width, ');"><div class="select_item" style="background-color: black; width: 50px; height:',
                  width, 'px;"></div><div class="select_item"  style="width: 50px; text-align: right;">',
                  width, 'px</div></div>');
  }
  document.write(strArray.join(''));
}

function changeLineWidth(thisElem, value) {
  mypaint.context.lineWidth = value;

  var arr = goog.dom.$$('div', 'linewidth_select_item');
  for (var i = 0; i < arr.length; i++) {
    arr[i].style.borderColor = 'transparent';
  }
  thisElem.style.borderColor = 'lightgray';
}

function changeSize(thisElem, value) {
  if (thisElem.selected) return;
  thisElem.style.width = value + 'px';
  thisElem.style.height = value + 'px';
}

function generateLineColorSelect() {
  var strArray = [];
  var len = COLORS.length;
  for (var i = 0; i < len; i++) {
    strArray.push('<div class="color_select_item" onclick="changeLineColor(this, \'',
                  COLORS[i], '\');"><div class="inner_color_cell" style="background-color: ',
                  COLORS[i], ';" onmouseover="changeSize(this, 28);" onmouseout="changeSize(this, 18);"></div></div>');
  }
  document.write(strArray.join(''));
}

function changeLineColor(thisElem, value) {
  mypaint.context.strokeStyle = value;
  var arr = goog.dom.$$('div', 'inner_color_cell');
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== thisElem.firstChild) {
      arr[i].selected = false;
      arr[i].style.borderColor = 'transparent';
      changeSize(arr[i], 18);
    }
  }
  thisElem.firstChild.selected = true;
  thisElem.firstChild.style.borderColor = 'gray';
}

function dragImageIcon(thisElem) {
  thisElem.style.backgroundColor = 'lightGray';
  mypaint.draggedImage = thisElem;
}

function generateImageIcons() {
  var strArray = [];
  var len = IMAGE_NAMES.length;
  for (var i = 0; i< len; i++) {
    strArray.push('<img class="image_icon" draggable="true" src="images/icons/',
                  IMAGE_NAMES[i], '80.png" ondrag="dragImageIcon(this);" />');
  }
  document.write(strArray.join(''));
}

function exportPicture(fileType) {
  fileType = fileType.toLowerCase();
  if (fileType != 'jpeg' && fileType != 'png') return;
  var canvasData = mypaint.canvas.toDataURL('image/' + fileType);
  //alert(canvasData);
  
  var newWindow = window.open();
  var img = newWindow.document.createElement('img');
  img.src = canvasData;
  newWindow.document.body.insertBefore(img, newWindow.document.body.firstChild);
//  window.open(canvasData, '_blank');
}

function changeBackgroundFrame(index) {
  goog.dom.$('drawing_panel').style.backgroundImage = 'url(images/background/bk' + index +'.jpg)';
}

function generateFrameSelect() {
  var strArray = [];
  for (var i = 0; i < 6; i++) {
    strArray.push('<img src="images/background/bkframe', i, '.png" style="border-radius: 5px; margin: 6px 10px; " onclick="changeBackgroundFrame(', i, ');"/>');
  }
  document.write(strArray.join(''));
}

