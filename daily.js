function DragImg() {
    
}

DragImg.prototype = {
    imgDefaultWidth: 180,
    imgDefaultHeight: 180, 
    
    init: function() {
        this.dailyWrap = document.getElementById('canvasBox');
        
        this._addEvent();
    },
    
    _addEvent: function() {
        var that = this;
        this.dailyWrap.addEventListener('dragenter', that._handleDragEnter, false);
        this.dailyWrap.addEventListener('dragleave', that._handleDragLeave, false);
        this.dailyWrap.addEventListener('dragover', that._handleDragOver, false);
        this.dailyWrap.addEventListener('drop', that._handleDrop, false);
    },
    
    _handleDrop: function(e) {
        
        e.stopPropagation();
        e.preventDefault();
 
        var fileList  = e.dataTransfer.files,
            oDailyWrap = document.getElementById('canvasBox'),
            oCanvas = document.getElementById('noteContent'),
            ctx = oCanvas.getContext('2d'),
            tmpImg = document.createElement('img'),
            pointerX = e.pageX,
            pointerY = e.pageY,
            wrapX = oDailyWrap.offsetLeft,
            wrapY = oDailyWrap.offsetTop,
            x = pointerX - wrapX,
            y = pointerY - wrapY;
        
        var reader = new FileReader();
        reader.onload = function(e){                     
            //根据效果图的高度自动调整编辑区的高度
            tmpImg.src = e.target.result;            
            tmpImg.onload = function(){
                tmpImg = DI._imgReSize(tmpImg);                                               
                //oDailyWrap.appendChild(tmpImg);
                tmpImg.style.position = 'absolute';
                //tmpImg.addEventListener()
                
                var imgX = x - tmpImg.width/2,
                    imgY = y - tmpImg.height + 15;
                
                //tmpImg.style.left = imgX + 'px';
                //tmpImg.style.top = imgY + 'px';
                
                ctx.drawImage(tmpImg, imgX, imgY, tmpImg.width, tmpImg.height);                
            };
        }
        reader.readAsDataURL(fileList[0]);
    },
    
    _handleDragEnter: function(e) {       
        e.preventDefault();        
        
        return false;
    },
    
    _handleDragLeave: function(e) {
        
    },
    
    _handleDragOver: function(e) {
        e.preventDefault();
        return false;
    },
    
    _imgReSize: function(img) {
        var percentage = 1,
            dWidth = this.imgDefaultWidth,
            dHeight = this.imgDefaultHeight;
            
        if (img.width <= dWidth && img.height <= dHeight) {
            return img;
        } else if (img.width >= img.height) {
            percentage = img.width/dWidth;
            
            img.width = dWidth;
            img.height = img.height/percentage;
            
            return img;
        } else if (img.width < img.height) {
            percentage = img.height/dHeight;
            
            img.height = dHeight;
            img.width = img.width/percentage;
            
            return img;
        }
    }
 }

var DI = new DragImg();

window.addEventListener('load',function(e){
    DI.init();
}, false);
