var DatePicker=function(appObj,params){
	if(!params.selector){
		return;
	}
	var selector = params.selector;
	var defaultDate = params.defaultDate;
	var startYear = params.startYear||1931;
	var endYear = params.endYear||new Date().getFullYear();
	var title = params.title||'';
	var selectType = params.selectType||'date';//分为date,time,dateTime三种,默认为date
	var showSecond = params.showSecond;//当selectType为time或dateTime有效
	if(showSecond==undefined || (showSecond+"").trim()==""){
		showSecond = true;
	}
	
	var yearWidthValue = 0;
	if(selectType=='dateTime'){
		yearWidthValue = (document.body.offsetWidth*1/5+10).toFixed(0);
	}
	var widthValue = selectType=='dateTime'?((document.body.offsetWidth-yearWidthValue)/5):(document.body.offsetWidth/3);
	widthValue = widthValue.toFixed(0)+"px";
	if(selectType=='dateTime'){
		yearWidthValue = yearWidthValue+"px";
	}else{
		yearWidthValue = widthValue;
	}
	var needSetData = false;
	var colsArray = [];
	if(selectType=="date" || selectType=="dateTime"){
		colsArray.push({//年
			values: (function () {
				var arr = [];
				for (var i = startYear; i <= endYear; i++) { 
					arr.push(i);
				}
				return arr;
			})(),
			width:yearWidthValue,
			textAlign: 'center'
		});
		colsArray.push({//月
			values: ['01','02','03','04','05','06','07','08','09','10','11','12'],
			width:widthValue,
			textAlign: 'center'
		});
		colsArray.push({//日
			values: ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
			width:widthValue,
			textAlign: 'center'
		});
	}
	if(selectType=="time" || selectType=="dateTime"){
		colsArray.push({//时
		    values: ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
		    width:widthValue,
		    textAlign: 'center'
	    });
		colsArray.push({//分
		    values: ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59'],
		    width:widthValue,
		    textAlign: 'center'
	    });
		if(showSecond){
			colsArray.push({//秒
				values: ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59'],
				width:widthValue,
				textAlign: 'center'
			});
		}
	}
	var picker = appObj.picker({
	   input: selector,
	   toolbarCloseText:"确定",
	   rotateEffect:true,
	   momentumRatio:20,
	   toolbarTemplate:'<div class="toolbar"><div class="toolbar-inner"><div class="left"><a href="#" class="link close-picker">取消</a></div><div class="picker-title">'+title+'</div><div class="right"><a href="#" class="link picker-sure">{{closeText}}</a></div></div></div>',
	   cols:colsArray,
	   formatValue: function (p, values, displayValues) {
	        return Dom7(selector).val();
	   },
	   onChange: function (picker, values, displayValues) {
	       var daysInMonth = new Date(picker.value[0], picker.value[1]*1, 0).getDate();
	       if(parseInt(values[2])> daysInMonth) {
	           picker.cols[2].setValue(daysInMonth,500);
	       }
	   },
	   onOpen:function(p){
		   Dom7(".picker-sure").on("click",function(){
			   needSetData = true;
			   picker.close();
		   });
		   var values = [];
		   var year = null;
		   var month = null;
		   var day = null;
		   var houre = null;
		   var minute = null;
		   var second = null;
		   var today = new Date();
		   if(!p.dateValue || p.dateValue==""){
			   if(defaultDate){
				   if(selectType=="time" && defaultDate.indexOf("-")<0 && defaultDate.indexOf("/")<0){
					   defaultDate = today.toLocaleDateString()+" "+defaultDate.trim();
				   }
				   today = new Date(defaultDate);
			   }
		   }else{
			   today = new Date(p.dateValue);
		   }
		   year = today.getFullYear();
		   month = (today.getMonth()+1) < 10 ? '0'+(today.getMonth()+1) : (today.getMonth()+1);
		   day = today.getDate() < 10 ? '0'+today.getDate() : today.getDate();
		   houre = today.getHours() < 10 ? '0'+today.getHours() : today.getHours();
		   minute = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
		   second = today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds();
		   
		   if(selectType=="date"){
			   values = [year,month,day];
		   }else if(selectType=="dateTime"){
			   values = [year,month,day,houre,minute,second];
		   }else if(selectType=="time"){
			   values = [houre,minute,second];
		   }
		   if(values.length>0){
			   p.setValue(values,200);
		   }
	   },
	   onClose:function(p){
		   if(needSetData){
			   var value = "";
			   if(selectType=="date"){
				   value = p.cols[0].value+"-"+p.cols[1].value+"-"+p.cols[2].value;
			   }else if(selectType=="dateTime"){
				   value = p.cols[0].value+"-"+p.cols[1].value+"-"+p.cols[2].value+" "+p.cols[3].value+":"+p.cols[4].value;
				   if(showSecond){
					   value= value+":"+p.cols[5].value;
				   }else{
					   value= value+":00";
				   }
			   }else if(selectType=="time"){
				   if(showSecond){
					   value = p.cols[0].value+":"+p.cols[1].value+":"+p.cols[2].value;
				   }else{
					   value = p.cols[0].value+":"+p.cols[1].value+":00";
				   }
			   }
			   Dom7(selector).attr("data-picker-values",value);
			   p.dateValue = value;
			   if(params.callback){
				   params.callback(p,value,value);
			   }
		   }
		   needSetData = false;
		   if(params.destroy==true){
			   p.destroy();
		   }
	   }
	});
	
	picker.dateValue = Dom7(selector).attr("dateValue");
	
	this.open=function(){
		picker.open();
	};
};