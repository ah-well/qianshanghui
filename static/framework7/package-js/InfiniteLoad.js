var InfiniteLoad=function(paramsObj){
	if(!paramsObj || !paramsObj.frameworkObj  || !paramsObj.selector || !paramsObj.templateId){
		return;
	}
	var selector = paramsObj.selector;
	var frameworkObj = paramsObj.frameworkObj;
	var isAutoQueryFirstPage = paramsObj.autoQueryFirstPage||false;
	var appendToSelector = paramsObj.appendToSelector;
	//该参数主要是因为Dom7如果模板是表格的tr的话，模板结果apeend到table中后，tr和td都会消失不见的问题，使用jQuery对象进行append则不会有此问题。
	var useJQObjAppendToSelector = paramsObj.useJQObjAppendToSelector||false;
	var templateId = paramsObj.templateId;
	var url = paramsObj.url;
	var paramData = paramsObj.data;
	var loadOverMsg = paramsObj.loadOverMsg;
	var pageNum = (paramsObj.startPage-1)||0;
	var pageCount = paramsObj.pageCount|pageNum+1;
	var callback = paramsObj.callback;
	
	var isReload = false;
	var loading = false;
	var loadOverMsg = "<div class='infinite-load-over infinite-scroll-preloader'><div class='preloader-msg'>"+(loadOverMsg?loadOverMsg:'')+"</div></div>";
	Dom7(selector).find(".infinite-loading").hide();
	Dom7(selector).on('infinite', function () {
		if(loading){
			return;
		}
		loading = true;
		pageNum = pageNum+1;
		if(pageNum>pageCount){
			frameworkObj.detachInfiniteScroll(Dom7(selector));
			Dom7(selector).find(".infinite-loading").hide();
			if(Dom7(selector).find(".infinite-load-over").length<=0){
				Dom7(selector).append(loadOverMsg);
			}
		    return;
	    }else{
	    	Dom7(selector).find(".infinite-loading").show();
	    	Dom7(selector).find(".infinite-load-over").remove();
	    	ajaxGetDate();
	    }
	});
	if(isAutoQueryFirstPage){
		pageNum = 1;
		ajaxGetDate(false);
	}
	function ajaxGetDate(isReplace){
		var ajaxParamData = {'pageNum':pageNum};
		if(paramData){
			ajaxParamData = paramData;
			ajaxParamData['pageNum']=pageNum;
		}
		Dom7.ajax({
           	async:true,
           	method:"POST",
           	url:url,
           	data:ajaxParamData,
           	success:function(data,status,xhr){
           		var jsonData = JSON.parse(data);
           		if(jsonData.success && jsonData.data){
           			pageCount = jsonData.data[0];
           		}
           		if(pageNum>pageCount){
           			Dom7(selector).find(".infinite-loading").hide();
           		}
           		var resultHTML = Template7.templates[templateId](jsonData.data[1]);
           		if(isReplace){
       				Dom7(selector).find(appendToSelector?appendToSelector:"ul").find("li").remove();
       				if(pageNum>=pageCount){
       					Dom7(selector).find(".infinite-loading").hide();
       					if(Dom7(selector).find(".infinite-load-over").length<=0){
       						Dom7(selector).append(loadOverMsg);
       					}
       				}else{
       					frameworkObj.attachInfiniteScroll(Dom7(selector));
       					Dom7(selector).find(".infinite-loading").show();
       				}
           		}
           		if(useJQObjAppendToSelector){
           			jQuery(selector).find(appendToSelector?appendToSelector:"ul").append(resultHTML);
           		}else{
           			Dom7(selector).find(appendToSelector?appendToSelector:"ul").append(resultHTML);
           		}
           		if(isAutoQueryFirstPage||isReplace){
           			Dom7(selector).scrollTop(1);
           			Dom7(selector).scrollTop(0);
           			//以下代码主要是为解决F7查询结果如果不满一页则无法触发图片延迟加载的问题
           			var dataSrc,imgSrc;
           			Dom7.each(Dom7(selector).find(appendToSelector?appendToSelector:"ul").find("img"),function(index,value){
           				dataSrc = Dom7(value).attr("data-src");
           				imgSrc = Dom7(value).attr("src");
           				if((imgSrc==undefined || imgSrc=="#" || imgSrc.trim()=="") && dataSrc && dataSrc!="#" && dataSrc.length>4){
           					Dom7(value).attr("src",dataSrc);
           				}
           			});
           			isAutoQueryFirstPage = false;
           		}
           		if(callback){
           			callback(resultHTML,pageNum,pageCount);
           		}
           		loading = false;
           	}
        });
	};
	this.reloadData=function(newParam){
		pageNum = 1;
		if(newParam){
			paramData = newParam;
		}
		Dom7(selector).find(".infinite-load-over").remove();
		ajaxGetDate(true);
	};
};