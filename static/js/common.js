//生成随机串
function randomChar(length){
   if(length){
	   length = 32;
   }
   var x="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
   var tmp="";
   var timestamp = new Date().getTime();
   for(var i=0;i<length;i++){
	   tmp += x.charAt(Math.ceil(Math.random()*100000000)%x.length);
   }
   return tmp+timestamp;
}

//获取元素的样式值。
function getStyle(elem,name){
    if(elem.style[name]){
        return elem.style[name];
    }else if(elem.currentStyle){
        return elem.currentStyle[name];
    }else if(document.defaultView && document.defaultView.getComputedStyle){
        name=name.replace(/([A-Z])/g,"-$1");
        name=name.toLowerCase();
        var s=document.defaultView.getComputedStyle(elem,"");
        return s&&s.getPropertyValue(name);
    }else{
        return null
    }
}
//获取元素相对于这个页面的x和y坐标。    
function pageX(elem){
    return elem.offsetParent?(elem.offsetLeft+pageX(elem.offsetParent)):elem.offsetLeft;
}
function pageY(elem){
    return elem.offsetParent?(elem.offsetTop+pageY(elem.offsetParent)):elem.offsetTop;
}

//获取元素相对于父元素的x和y坐标。        
function parentX(elem){
    return elem.parentNode==elem.offsetParent?elem.offsetLeft:pageX(elem)-pageX(elem.parentNode);
}
function parentY(elem){
    return elem.parentNode==elem.offsetParent?elem.offsetTop:pageY(elem)-pageY(elem.parentNode);
}

//获取使用css定位的元素的x和y坐标。
function posX(elem){
    return parseInt(getStyle(elem,"left"));
}    
function posY(elem){
    return parseInt(getStyle(elem,"top"));
}

//设置元素位置。    
function setX(elem,pos){
    elem.style.left=pos+"px";
}    
function setY(elem,pos){
    elem.style.top=pos+"px";
}

//增加元素X和y坐标。    
function addX(elem,pos){
    set(elem,(posX(elem)+pos));
}
function addY(elem,pos){
    set(elem,(posY(elem)+pos));
}

//获取元素使用css控制大小的高度和宽度    
function getHeight(elem){
    return parseInt(getStyle(elem,"height"));
}
function getWidth(elem){
    return parseInt(getStyle(elem,"width"));
}

//获取元素可能，完整的高度和宽度
function getFullHeight(elem){
    if(getStyle(elem,"display")!="none"){
        return getHeight(elem)||elem.offsetHeight;
    }else{
        var old=resetCss(elem,{display:"block",visibility:"hidden",position:"absolute"});
        var h=elem.clientHeight||getHeight(elem);
        restoreCss(elem,old);
        return h;
    }
}
function getFullWidth(elem){
    if(getStyle(elem,"display")!="none"){
        return getWidth(elem)||elem.offsetWidth;
    }else{
        var old=resetCss(elem,{display:"block",visibility:"hidden",position:"absolute"});
        var w=elem.clientWidth||getWidth(elem);
        restoreCss(elem,old);
        return w;
    }
}

//设置css，并保存旧的css
function resetCss(elem,prop){
    var old={};
    for(var i in prop){
        old[i]=elem.style[i];
        elem.style[i]=prop[i];
    }
    return old;
}
function restoreCss(elem,prop){
    for(var i in prop){
        elem.style[i]=prop[i];
    }
}


//显示和隐藏
function show(elem){
    elem.style.display=elem.$oldDisplay||" ";
}
function hide(elem){
    var curDisplay=getStyle(elem,"display");
    if(curDisplay!="none"){
        elem.$oldDisplay=curDisplay;
        elem.style.display="none";
    }
}

//设置透明度    
function setOpacity(elem,num){
    if(elem.filters){
        elem.style.filter="alpha(opacity="+num+")";
    }else{
        elem.style.opacity=num/100;
    }
}

//滑动    
function slideDown(elem){
    var h=getFullHeight(elem);
    elem.style.height="0px";
    show(elem);
    for(var i=0;i<=100;i+=5){
        new function(){
        	var pos=i;
        	setTimeout(function(){elem.style.height=(pos/100*h)+"px";},(pos*10));
        }
    }
}

//渐变
function fadeIn(elem){    
	show(elem);
	setOpacity(elem,0);
    for(var i=0;i<=100;i+=5){
        new function(){
        	var pos=i;
        	setTimeout(function(){setOpacity(elem,pos);},(pos+1)*10);
        }
    }
}

//获取鼠标光标相对于整个页面的位置。    
function getX(e){
    e=e||window.event;
    return e.pageX||e.clientX+document.body.scrollLeft;
}
function getY(e){
    e=e||window.event;
    return e.pageY||e.clientY+document.body.scrollTop;
}

//获取鼠标光标相对于当前元素的位置。
function getElementX(e){
    return (e&&e.layerX)||window.event.offsetX;
}
function getElementY(e){
    return (e&&e.layerY)||window.event.offsetY;
}

//获取页面的高度和宽度
function getPageHeight(){
    var de=document.documentElement;
    return document.body.scrollHeight||(de&&de.scrollHeight);
}
function getPageWidth(){
    var de=document.documentElement;
    return document.body.scrollWidth||(de&&de.scrollWidth);
}

//获取滚动条的位置。
function scrollX(){
    var de=document.documentElement;
    return self.pageXOffset||(de&&de.scrollLeft)||document.body.scrollLeft;
}
function scrollY(){
    var de=document.documentElement;
    return self.pageYOffset||(de&&de.scrollTop)||document.body.scrollTop;
}
    
//获取视口的高度和宽度。    
function windowHeight() {
    var de = document.documentElement;
    return self.innerHeight||(de && de.offsetHeight)||document.body.offsetHeight;
}
function windowWidth() {
    var de = document.documentElement;
    return self.innerWidth||( de && de.offsetWidth )||document.body.offsetWidth;
}

//使用canvas对大图片进行压缩
function compress(img) {
	//用于压缩图片的canvas
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');
    //瓦片canvas
    var tCanvas = document.createElement("canvas");
    var tctx = tCanvas.getContext("2d");
    
    var initSize = img.src.length;
    var width = img.width;
    var height = img.height;
    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
    var ratio;
    if ((ratio = width * height / 4000000)>1) {
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
    }else {
        ratio = 1;
    }
    canvas.width = width;
    canvas.height = height;
    //铺底色
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //如果图片像素大于100万则使用瓦片绘制
    var count;
    if ((count = width * height / 1000000) > 1) {
        count = ~~(Math.sqrt(count)+1); //计算要分成多少块瓦片
        //计算每块瓦片的宽和高
        var nw = ~~(width / count);
        var nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (var i = 0; i < count; i++) {
            for (var j = 0; j < count; j++) {
                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
            }
        }
    } else {
        ctx.drawImage(img, 0, 0, width, height);
    }
    //进行最小压缩
    var ndata = canvas.toDataURL('image/jpeg', 0.1);
    console.log('压缩前：' + initSize);
    console.log('压缩后：' + ndata.length);
    console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
    return ndata;
}