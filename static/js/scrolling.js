/** 
 * 使用方法: 
 * 开启:Scrolling.start();
 * 关闭:Scrolling.end();
 */  
var Scrolling = (function(){
	var isScrolling = false;
    function init(excuteFun){
    	$(window).scroll(function(){
			if(!isScrolling){
    			if($(document).scrollTop() >= $(document).height() - $(window).height()){
					isScrolling = true;
					$("body").append("<div id='loading' style='text-align:center;height:40px;line-height:40px;font-size:16px;'><div style='width:25px;height:25px;vertical-align:middle;display: inline-block;'><img style='width:100%;height:100%;' src='../../jsp/coc/static/images/loading.gif'></img></div>&nbsp;数据加载中。。。</div>");
				    $(window).scrollTop($(document).height());
				    if(excuteFun!=null && excuteFun!=undefined){
				    	excuteFun();
				    }
				}
			}
		});
    }
    return {  
        start:function(excuteFun){  
            init(excuteFun);
        },
        end:function(callBackFun){
            $("body #loading").remove();
            isScrolling = false;
            if(callBackFun!=null && callBackFun!=undefined){
            	callBackFun();
		    }
        },
        noMore:function(){
        	$("body #loading").remove();
        	$("body").append("<div id='noMore' style='text-align:center;height:40px;line-height:40px;font-size:16px;'>没有更多内容啦。。。</div>");
        	$(window).scrollTop($(document).height());
        	setTimeout(function(){
        		isScrolling = false;
        		$("body #noMore").remove();
        	},1000);
        }
    }  
}(jQuery)); 