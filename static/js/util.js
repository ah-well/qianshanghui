function setBodyHeight(jqObj){
	var contentHeight = $(jqObj).height()+$(".bottomNavi").height()+2;
	$("body").css("height",contentHeight);
	alert("sss");
}
function loadData(jqObj,dataUrl,reload,resetHeight){
	if(dataUrl.indexOf("?")==-1){
		dataUrl = dataUrl+"?snuid="+new Date().getTime();
	}else{
		dataUrl = dataUrl+"&snuid="+new Date().getTime();
	}
	if(reload){
		$(jqObj).load(dataUrl,function(){
			if(resetHeight){
				setBodyHeight($(jqObj));
			}
		});
	}else if($(jqObj).html()==null || $(jqObj).html().trim()==""){
		$(jqObj).load(dataUrl,function(){
			if(resetHeight){
				setBodyHeight($(jqObj));
			}
		});
	}else{
		if(resetHeight){
			setBodyHeight($(jqObj));
		}
	}
}
function bindTouchmoveEvent(objId,distTop,distRight,distBottom,distLeft,opacity,timeout,clickFun){
	var obj = document.getElementById(objId);
	var isMoving = false;
	var isClick = false;
	if(distTop=="" || distTop==undefined){
		distTop = 0;
	}
	if(distRight=="" || distRight==undefined){
		distRight = 0;
	}
	if(distBottom=="" || distBottom==undefined){
		distBottom = 0;
	}
	if(distLeft=="" || distLeft==undefined){
		distLeft = 0;
	}
	if(opacity=="" || opacity==undefined){
		opacity = 0.3;
	}
	if(timeout=="" || timeout==undefined){
		timeout = 3000;
	}
	obj.addEventListener('touchstart',function(event){
		if (event.targetTouches.length == 1) {
		   event.preventDefault();
		   isClick = true;
		   obj.style.filter='alpha(opacity:1)';
		   obj.style.opacity=1;
		   var parentObj = $("#"+objId).parent();
		   var touch = event.targetTouches[0];
		   var absX = touch.pageX - $(parentObj).offset().left;
		   var absY = touch.pageY - $(parentObj).offset().top;
		   obj.addEventListener('touchmove', function(event){
			   isMoving = true;
			   var windowWidth = $(window).width();
			   var windowHeight = $(window).height();
			   var parentWidth = parentObj.width();
			   var parentHeight = parentObj.height();
			   var moveTouch = event.targetTouches[0];
			   var left = moveTouch.pageX - absX;
			   var top = moveTouch.pageY - absY;
			   isClick = false;
			   if(left<distLeft){
				   left = distLeft;
			   }else if(windowWidth - (left + parentWidth) < distRight){
				   left = windowWidth - parentWidth - distRight;
			   }
			   if(top<distTop){
				   top = distTop;
			   }else if(windowHeight - (top + parentHeight) < distBottom){
				   top = windowHeight - parentHeight - distBottom;
			   }
			   parentObj.css({'left':left, 'top':top});
		   },false);
		   obj.addEventListener('touchend', function(event){
			   isMoving = false;
			   if(isClick){
				   if(clickFun!="" && clickFun!=undefined){
					   clickFun();
				   }
				   isClick = false;
			   }
			   var timeOut = setTimeout(function(){
				   if(!isMoving || !isClick){
					   obj.style.filter='alpha(opacity:'+opacity+')';
					   obj.style.opacity=opacity;
				   }
				   clearTimeout(timeOut);
	 		   },timeout);
		   },false);
		}
	}, false);
}
function intervalChangeSelectColor(jsObj,defaultColor,selectColor){
	setInterval(function(){
		$($(jsObj).find("select")).each(function(obj){
			if($(this).val()==""){
				$(this).css("color",defaultColor);
			}else{
				$(this).css("color",selectColor);
			}
		});
	},100);
}
function setCookie(cookieName,value,expiredays){
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=cookieName+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}
function getCookie(cookieName){
	if (document.cookie.length>0){
		var cStart=document.cookie.indexOf(cookieName + "=");
		if (cStart!=-1){
			cStart=cStart + cookieName.length+1;
			var cEnd=document.cookie.indexOf(";",cStart);
			if (cEnd==-1){
				cEnd=document.cookie.length;
			}
			return unescape(document.cookie.substring(cStart,cEnd));
		}
  }
	return ""
}