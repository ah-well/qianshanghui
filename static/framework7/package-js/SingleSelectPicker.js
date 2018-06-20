var SingleSelectPicker=function(appObj,params){
	if(!params.selector || !params.values){
		return;
	}
	
	var title = params.title||'';
	
	var needSetData = false;
	var colObj = [{textAlign : 'center',values:params.values,displayValues:params.values}];
	if(params.displayValues){
		colObj = [{textAlign : 'center',values:params.values,displayValues:params.displayValues}];
	}
	var picker = appObj.picker({
	   input: params.selector,
	   toolbarCloseText:"确定",
	   rotateEffect:true,
	   momentumRatio:20,
	   toolbarTemplate:'<div class="toolbar"><div class="toolbar-inner"><div class="left"><a href="#" class="link close-picker">取消</a></div><div class="picker-title">'+title+'</div><div class="right"><a href="#" class="link picker-sure">{{closeText}}</a></div></div></div>',
	   formatValue: function (p, values, displayValues) {
	        return Dom7(params.selector).val();
	   },
	   onOpen:function(p){
		   Dom7(".picker-sure").on("click",function(){
			   needSetData = true;
			   picker.close();
		   });
	   },
	   onClose:function(p){
		   if(needSetData){
			   var value = p.cols[0].value;
			   var displayValue = p.cols[0].displayValue;
			   Dom7(params.selector).attr("data-picker-values",value);
			   Dom7(params.selector).val(displayValue);
			   if(params.callback){
				   params.callback(p,value,displayValue);
			   }
		   }
		   needSetData = false;
		   if(params.destroy==true){
			   p.destroy();
		   }
	   },
	   cols: colObj
	});
	this.open=function(val){
		if(val && params.values.indexOf(val)==-1){
			val = params.values[0];
		}
		picker.open();
		if(val){
			picker.setValue([val]);
		}
	};
};