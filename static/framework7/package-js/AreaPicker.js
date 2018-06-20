var AreaPicker=function(appObj,params){
	var hierarchy = 1;
	if(params.hierarchy){
		hierarchy = params.hierarchy;
	}
	
	var title = params.title||'';
	
	var widthValue = document.body.offsetWidth/hierarchy;
	widthValue = widthValue.toFixed(0)+"px";
	var provChange = false;
	var cityChange = false;
	
	var pickerJsonData;
	var areaPickerDataStr;
	if(window.sessionStorage){
		areaPickerDataStr = sessionStorage.getItem("areaPickerData");
	}
	if(areaPickerDataStr==undefined || areaPickerDataStr==null){
		Dom7.ajax({
         	async:false,
         	method:"POST",
         	url:__ctxPath+'/t00/area/areaAllData.do',
         	data:{},
         	success:function(data,status,xhr){
         		var jsonData = JSON.parse(data);
         		if(jsonData.success && jsonData.data){
         			if(window.sessionStorage){
         				sessionStorage.setItem("areaPickerData",JSON.stringify(jsonData.data));
         			}
         			pickerJsonData = jsonData.data;
         		}
         	}
         });
	}else{
		pickerJsonData = JSON.parse(areaPickerDataStr);
	}
	
	if(pickerJsonData==undefined){
		appObj.alert("获取不到后台省市区数据！", "异常");
		return;
	}
	
	var cols = [];
	var provCol = {
       	 textAlign: 'left',
         width:widthValue,
         values: pickerJsonData.provinceIdArray,
         displayValues:pickerJsonData.provinceNameArray,
         onChange:function(p,value,displayValue){
        	 //妹的！在这里取出来的p.cols[1]对象竟然是一个没有方法的对象,因而不能在此处更新p.cols[1]的列表！坑！！
        	 provChange = true;
         }
     };
	var cityCol = {
       	 textAlign: 'left',
         width:widthValue,
         values : pickerJsonData.subChildIdMap[pickerJsonData.provinceIdArray[0]],
         displayValues : pickerJsonData.subChildNameMap[pickerJsonData.provinceIdArray[0]],
         onChange:function(p,value,displayValue){
        	 //理由同上，坑货！ 
        	 cityChange = true;
         }
     };
	var areaCol = {
       	 textAlign: 'left',
         width:widthValue,
    	 values : pickerJsonData.subChildIdMap[pickerJsonData.subChildIdMap[pickerJsonData.provinceIdArray[0]][0]],
         displayValues : pickerJsonData.subChildNameMap[pickerJsonData.subChildIdMap[pickerJsonData.provinceIdArray[0]][0]]
     };
	
	if(hierarchy==1){
		cols.push(provCol);
	}else if(hierarchy==2){
		cols.push(provCol);
		cols.push(cityCol);
	}else if(hierarchy==3){
		cols.push(provCol);
		cols.push(cityCol);
		cols.push(areaCol);
	}
	
	var needSetData = false;
	var picker = appObj.picker({
        input: params.selector,
        toolbarCloseText:"确定",
        rotateEffect:true,
        momentumRatio:20,
        toolbarTemplate:'<div class="toolbar"><div class="toolbar-inner"><div class="left"><a href="#" class="link close-picker">取消</a></div><div class="picker-title">'+title+'</div><div class="right"><a href="#" class="link picker-sure">{{closeText}}</a></div></div></div>',
        onOpen:function(p){
        	var values = Dom7(params.selector).attr("data-picker-temp-values");
        	if(values){
        		p.setValue(values.split(" "),0);
        	}
        	Dom7(".picker-sure").on("click",function(){
 			   needSetData = true;
 			   picker.close();
 		    });
        },
        onClose:function(p){
			var values=[];
			var displayValues = [];
			if(hierarchy==1){
				values.push(p.cols[0].value);
				displayValues.push(p.cols[0].displayValue);
			}else if(hierarchy==2){
				values.push(p.cols[0].value);
				displayValues.push(p.cols[0].displayValue);
				values.push(p.cols[1].value);
				displayValues.push(p.cols[1].displayValue);
			}else if(hierarchy==3){
				values.push(p.cols[0].value);
				displayValues.push(p.cols[0].displayValue);
				values.push(p.cols[1].value);
				displayValues.push(p.cols[1].displayValue);
				values.push(p.cols[2].value);
				displayValues.push(p.cols[2].displayValue);
			}
			Dom7(params.selector).attr("data-picker-temp-values",values.join(" "));
			
    		if(needSetData){
    			Dom7(params.selector).attr("data-picker-values",values.join(" "));
        		Dom7(params.selector).val(displayValues.join(" "));
        		if(params.callback){
 				    params.callback(p,values,displayValues);
 			   }
        	}
        	needSetData = false;
        	if(params.destroy==true){
        		p.destroy();
        	}
        },
        formatValue: function (p, values, displayValues) {
            return Dom7(params.selector).val();
        },
        onChange: function (picker, values, displayValues) {
        	//由于cols的坑，因而只能在这里处理
     	    if(provChange && hierarchy>1){
     	    	provChange = false;
     	    	setTimeout(function(){
 	    			picker.cols[1].replaceValues(pickerJsonData.subChildIdMap[values[0]], pickerJsonData.subChildNameMap[values[0]]);
 	    		},1);
     	    	if(hierarchy==3){
     	    		setTimeout(function(){
     	    			picker.cols[2].replaceValues(pickerJsonData.subChildIdMap[pickerJsonData.subChildIdMap[values[0]][0]], pickerJsonData.subChildNameMap[pickerJsonData.subChildIdMap[values[0]][0]]);
     	    		},1);
     	    	}
     	    }else if(cityChange && hierarchy==3){
     	    	cityChange = false;
     	    	picker.cols[2].replaceValues(pickerJsonData.subChildIdMap[values[1]], pickerJsonData.subChildNameMap[values[1]]);
     	    }
        },
        cols: cols
    });
	return picker;
};