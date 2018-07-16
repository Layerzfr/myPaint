'use strict';
var canvas =  document.getElementById('canvas');
canvas.setAttribute('width', "680px");
canvas.setAttribute('height', "600px");
canvas.setAttribute('z-index', "0");
document.getElementById('canvasSym').setAttribute('width', "680px");
document.getElementById('canvasSym').setAttribute('height', "600px");
$('#canvasSym').hide();
var ctx = canvas.getContext('2d');
ctx.rect(0, 0, 680, 600);
ctx.fillStyle = "white";
ctx.fill();
var x1;
var x2;
var y1;
var y2;
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var clickSize = new Array();
var paint;
var mouseX;
var mouseY;
var checkLigne = 1;
var checkRectangle = 1;
var checkCercle = 1;
var colorWhite = "#ffffff";
var curTool = "crayon";
var curColor = $('#couleur').val();
var curColorFill = $('#couleur').val();
var clickColor = new Array();
var fill = 0;
var size = 1;
var input = document.getElementById('inputImg');
var sym = 1;
var canvasSym;
var ctxSym;
var numbCalc = 1;

$('#more').hide();
$('.containCouleurFill').hide();

$('#addCalque').click(function(){
    numbCalc++;
    var valueCalc = "calque"+numbCalc;
    $('#calque').append('<div class="inputCalque"><input type="checkbox" class="inputCalque" checked value="'+valueCalc+'"><p>'+valueCalc+'</p></div>');
    $('#main').append('<canvas class="canvas" id="canvas" value="'+valueCalc+'"></canvas>')
})

input.addEventListener('change', loadImage);
canvas.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});

$('#couleur').change(function(){
    curColor = $('#couleur').val();
})

canvas.addEventListener('drop', function(e) {
    e.stopPropagation();
    e.preventDefault();
    var files = e.dataTransfer.files;
    for(var i=0;i<files.length;i++){
        var img=new Image;
        img.onload=function(){
            ctx.drawImage(this,this.x,0,this.width,this.height);
            if(sym === 2){
                ctxSym.drawImage(this,this.x,0,this.width,this.height);
            }
        }
        img.src=URL.createObjectURL(files[i]);
    }
    
});

function loadImage(e) {
    
    var files=e.target.files;
    if(sym === 2){
        for(var i=0;i<files.length;i++){
            var img=new Image;
            img.onload=function(){
                ctxSym.drawImage(this,this.x,0,this.width,this.height);
            }
            img.src=URL.createObjectURL(files[i]);
        }
    }
    for(var i=0;i<files.length;i++){
        var img=new Image;
        img.onload=function(){
            ctx.drawImage(this,this.x,0,this.width,this.height);
        }
        img.src=URL.createObjectURL(files[i]);
    }
}

$('.taille').change(function(){
    size = $(this).val();
    $('#actual').val(size);
});
$('.taille').mousemove(function(){
    size = $(this).val();
    $('#actual').val(size);
});
$("#actual").keyup(function() {
    size = $(this).val();
    $('.taille').val(size);
});
$('#actual').change(function(){
    size = $(this).val();
    $('.taille').val(size);
})

$('#clear').click(function(){
    if(sym === 2){
        ctxSym.clearRect(0,0,canvas.width,canvas.height);
    }
    ctx.clearRect(0,0,canvas.width,canvas.height);
    clickX.length= 0;
    clickY.length = 0;
    clickDrag.length = 0;
    clickColor.length = 0;
    clickSize.length = 0;
    curColor = $('#couleur').val();
})

$(".tool").click(function(){
    var target = $( event.target ).val();
    tool(target);
})
$(".couleur").click(function(){
    if(curTool === "crayon" || curTool === "rectangle" || curTool === "ligne" || curTool === "cercle"){
        var target = $( event.target ).val();
        curColor = target;
    }
})
$('#dlButton').click(function(){
    var link = document.createElement('a');
    link.download = "mon_incroyable_dessin.png";
    link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");;
    link.click();
})

$('#symetrie').click(function(){
    if(sym === 1){
        var sourceImageData = canvas.toDataURL("image/png");
        $('#canvasSym').show();
        canvasSym = document.getElementById('canvasSym');
        canvasSym.setAttribute('width', "680px");
        canvasSym.setAttribute('height', "600px");
        ctxSym = canvasSym.getContext('2d');
        var destinationImage = new Image;
        destinationImage.onload = function(){
            ctxSym.drawImage(destinationImage,0,0);
        };
        destinationImage.src = sourceImageData;
        sym = 2;
    }else{
        $('#canvasSym').hide();
        sym = 1;
    }
})


function more(){
    $(".more").click(function(){
        if($( event.target ).val() === "fill"){
            fill = 1;
            $('.containCouleurFill').show();
            $('.couleurfill').change(function(){
                curColorFill = $('.couleurfill').val();
            })
        }else if ($( event.target ).val() === "nonfill"){
            fill = 0;
            $('.containCouleurFill').hide();
        }
    })
}

function tool(target){
    if(target === "crayon"){
        curTool = target;
        $('#more').hide();
    }else if (target === "gomme"){
        curColor = colorWhite;
        curTool = target;
        $('#more').hide();
    }else if (target ==="ligne"){
        curTool = target;
        $('#more').hide();
    }else if (target ==="rectangle"){
        curTool = target;
        $('#more').show();
        more();
    }else if (target ==="cercle"){
        curTool = target;
        $('#more').show();
        more();
    }
}

function addClick(x, y, dragging)
{
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    clickColor.push(curColor);
    clickSize.push(size)
}

function redraw(){
    if(sym === 2){
        ctxSym.lineJoin = "round";
        
        
        for(var i=0; i < clickX.length; i++) {
            ctxSym.lineWidth = clickSize[i];
            ctxSym.beginPath();
            
            if(clickDrag[i] && i){
                ctxSym.moveTo(clickX[i-1], clickY[i-1]);
            }else{
                ctxSym.moveTo(clickX[i]-1, clickY[i]);
            }
            
            ctxSym.lineTo(clickX[i], clickY[i]);
            ctxSym.closePath();
            ctxSym.strokeStyle = clickColor[i];
            ctxSym.stroke();
        }
    }
    ctx.lineJoin = "round";
    
    
    for(var i=0; i < clickX.length; i++) {
        ctx.lineWidth = clickSize[i];	
        ctx.beginPath();
        if(clickDrag[i] && i){
            ctx.moveTo(clickX[i-1], clickY[i-1]);
        }else{
            ctx.moveTo(clickX[i]-1, clickY[i]);
        }
        
        ctx.lineTo(clickX[i], clickY[i]);
        ctx.closePath();
        ctx.strokeStyle = clickColor[i];
        ctx.stroke();
    }
}

function ligne(){
    if(sym === 2){
        ctxSym.lineJoin = "round";
        ctxSym.lineWidth = 5;
        ctxSym.beginPath();
        ctxSym.moveTo(x1, y1);
        ctxSym.lineTo(x2, y2);
        ctxSym.closePath();
        ctxSym.lineWidth = size;
        ctxSym.strokeStyle = curColor;
        ctxSym.stroke();
    }
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.lineWidth = size;
    ctx.strokeStyle = curColor;
    ctx.stroke();
    checkLigne = 1;
}

function lineStart() {
    x1 = mouseX;
    y1 = mouseY;
    checkLigne = 2;
    paint = false;
}

function lineEnd() {
    x2 = mouseX;
    y2 = mouseY;
    ligne();
}
function cercle(){
    var a = x1 - x2;
    var b = y1 - y2;
    var c = Math.sqrt( a*a + b*b );
    if( sym === 2){
        ctxSym.beginPath();
        ctxSym.arc(x1, y1, c, 0, 2 * Math.PI);
        ctxSym.strokeStyle = curColor;
        if(fill === 1){
            ctxSym.fillStyle = curColorFill;
            ctxSym.fill();
        }
        ctxSym.lineWidth = size;
        ctxSym.stroke();
    }
    ctx.beginPath();
    ctx.arc(x1, y1, c, 0, 2 * Math.PI);
    ctx.strokeStyle = curColor;
    if(fill === 1){
        ctx.fillStyle = curColorFill;
        ctx.fill();
    }
    ctx.lineWidth = size;
    ctx.stroke();
    checkCercle = 1;
}
function cercleStart(){
    x1 = mouseX;
    y1 = mouseY;
    checkCercle = 2;
    paint = false;
}

function cercleEnd(){
    x2 = mouseX;
    y2 = mouseY;
    cercle();
}

function rectangle(){
    if(sym === 2){
        ctxSym.beginPath();
        ctxSym.rect(x1,y1,x2-x1,y2-y1);
        ctxSym.strokeStyle = curColor;
        if(fill === 1){
            ctxSym.fillStyle = curColorFill;
            ctxSym.fill();
        }
        ctxSym.lineWidth = size;
        ctxSym.stroke();
    }
    ctx.beginPath();
    ctx.rect(x1,y1,x2-x1,y2-y1);
    ctx.strokeStyle = curColor;
    if(fill === 1){
        ctx.fillStyle = curColorFill;
        ctx.fill();
    }
    ctx.lineWidth = size;
    ctx.stroke();
    checkRectangle = 1;
}

function rectStart(){
    x1 = mouseX;
    y1 = mouseY;
    checkRectangle = 2;
    paint = false;
}

function rectEnd(){
    x2 = mouseX;
    y2 = mouseY;
    rectangle();
}
$('#canvas').mousedown(function(e){
    mouseX = e.pageX - this.offsetLeft;
    mouseY = e.pageY - this.offsetTop;
    
    paint = true;
    
    if(curTool === "ligne"){
        if(checkLigne === 1){
            lineStart();
        }else if(checkLigne === 2){
            lineEnd();
        }
    }else if (curTool === "rectangle"){
        if(checkRectangle === 1){
            rectStart();
        }else if (checkRectangle === 2){
            rectEnd();
        }
    }else if (curTool === "cercle"){
        if(checkCercle === 1){
            cercleStart();
        }else if (checkCercle === 2){
            cercleEnd();
        }
    } else{
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        redraw();
    }
});

$('#canvas').mousemove(function(e){
    if(paint){
        if(curTool === "ligne"){
            ligne();
        }else if (curTool === "rectangle"){
            rectangle();
        } else if(curTool === "cercle"){
            cercle();
        } else{
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
            redraw();
        }
    }
});

$('#canvas').mouseup(function(e){
    paint = false;
});

$('#canvas').mouseleave(function(e){
    paint = false;
});