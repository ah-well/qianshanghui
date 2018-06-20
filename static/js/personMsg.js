var myApp = new Framework7({
   animateNavBackIcon: true,
   modalTitle:"商会",
   modalButtonOk:"确定",
   modalButtonCancel:"取消"
});
var $$ = Dom7;
$$(".ent").on('click',function(){
	var obj = $$(this).find(".item-after");
	var filed = $$(this).attr("data-filed");
	myApp.prompt('请输入您的'+$$(this).find(".item-title").text(), '信息修改', function (value) {
		updateData(obj,filed,value);
    });
	setTimeout(function(){
		$$(".modal-in").find(".modal-text-input").val($$(obj).text());
	},100);
});

var headImg = $$(".head-img").attr("src");
if(headImg!="" && headImg.trim()!="" && headImg!="null"){
    $("#licenseSpan").find("i").html("&nbsp;");
}

$$("#licenseFile").change(function(){
    var jsObj = $$("#licenseFile")[0];
    if (jsObj.files.length){
        var file = jsObj.files[0];
        if(!/image\/\w+/.test(file.type)){  
        	myApp.alert("请选择图片！","提示");  
            return false;  
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload=function(e){
            $$("#licenseSpan").css("background-image", "url(" + this.result + ")");
            $$("#licenseSpan").find("i").html("&nbsp;");
        };
        var formData = new FormData();
        formData.append("openId",$$("#openId").val());
        formData.append("imgFile",file);
    };
});

$$("#phoneNum").on("click",function(){
	var obj = $$(this).find(".item-after");
	var filed = $$(this).attr("data-filed");
	var modal = myApp.modal({
	    title: '信息修改',
	    text: '请输入您的新手机号码',
	    afterText:  '<div style="white-space: nowrap;">手机号：<input type="tel" id="phoneNo" class="modal-text-input" style="width:80%;display: inline-block;"></div>'
	    		   +'<div style="white-space: nowrap;">验证码：<input type="tel" id="codeNo" class="modal-text-input b-bottom" style="width:60%;display: inline-block;">'
	    		   +'<a id="sendCode" style="display:inline-block;height: 28px;padding:10px;">获取</a></div>',
	    buttons: [
	      {
	        text: '取消'
	      },
	      {
	        text: '确定',
	        close:false,
	        onClick: function () {
	        	var checkOK = false;
	        	var phoneNo = $$("#phoneNo").val().trim();
	        	var codeNo = $$("#codeNo").val().trim();
	        	var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
				if (!myreg.test(phoneNo)) {
					alert("请输入合法的手机号码!");
					return;
				}
				if(codeNo==""){
	                alert("请输入获取到的验证码!");
	                return;
	            }
				$$.ajax({
	                async:false,
	                method:"POST",
	                url:__ctxPath+'/captcha/checkCaptcha.do',
	                data:{
	                    'code':codeNo
	                },
	                success:function(data,status,xhr){
	                    var jsonData = JSON.parse(data);
	                    if(!jsonData.success){
	                    	alert(jsonData.msg);
	                    }else{
	                    	checkOK = true;
	                    }
	                }
	             });
				if(checkOK){
	            	if(phoneNo != $$("#phoneNo").attr("setPhoneNo").trim()){
	                    alert("请输入接收到验证码的手机号!","错误");
	                    return;
	                }
	            	myApp.closeModal(modal);
	            	updateData(obj,filed,phoneNo);
	        	}
	        }
	      },
	    ]
	});
});

var isSendding = true;
$$(document).on('click', '#sendCode', function(e){
    if ($$(this).attr("class").indexOf("senddingCode") >= 0) {
        return;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test($$("#phoneNo").val())) {
        alert("请输入合法的手机号码!","重要");
        return;
    }
    var time = 60;
    if (isSendding) {
        isSendding = false;
        $$(this).addClass("senddingCode");
        $$("#sendCode").text(time + '秒');
        var t = setInterval(function() {
            time--;
            $$("#sendCode").text(time + '秒');
            if (time == 0) {
                clearInterval(t);
                $$("#sendCode").text('重发');
                isSendding = true;
                $$("#sendCode").removeClass("senddingCode");
            }
        }, 1000);
        
        $$("#phoneNo").attr("setPhoneNo",$$("#phoneNo").val());
        
    }
});

function updateData(selector,filed,value){
	if(filed=="NICK_NAME"){
		$$("#showNickname").text(value);
	}
	$$(selector).text(value);
}
var rolePicker = new SingleSelectPicker(myApp,{
	selector:"#role",
	values:['校友', '校亲', '友好人士'],
	callback:function(p,value,displayValue){
		updateData("#role",$$("#roleLi").attr("data-filed"),value);
	}
});

var sexPicker = new SingleSelectPicker(myApp,{
	selector:"#sex",
	values:["男","女"],
	callback:function(p,value,displayValue){
		updateData("#sex",$$("#sexLi").attr("data-filed"),value);
	}
});
var birthDatePicker = new DatePicker(myApp,{
	selector:"#picker-date",
	callback:function(p,value,displayValue){
		updateData("#birthDate",$$("#birthDateLi").attr("data-filed"),value);
	}
});

var inSchoolYearPicker = new SingleSelectPicker(myApp,{
	selector:"#inSchoolYear",
	title:"入学年份",
	values:(function () {
        var arr = [];
        var date = new Date();
        for (var i = 1950; i <= date.getFullYear(); i++) { 
            arr.push(i);
        }
        return arr;
	})(),
	callback:function (picker, value, displayValue){
		updateData("#inSchoolYear",$$("#inSchoolYearLi").attr("data-filed"),value);
	}
});
var graduationYearPicker = new SingleSelectPicker(myApp,{
	selector:"#graduationYear",
	title:"毕业年份",
	values:(function () {
        var arr = [];
        var date = new Date();
        for (var i = 1950; i <= date.getFullYear(); i++) { 
            arr.push(i);
        }
        return arr;
	})(),
	callback:function (picker, value, displayValue){
		updateData("#graduationYear",$$("#graduationYearLi").attr("data-filed"),value);
	}
});
//此处使用jQuery的原因是由于目前Dom7不支持阻止事件冒泡，导致滚轮选择框弹出来后又关闭了
$(function(){
	$("#roleLi").click(function(e){
		//rolePicker.open();
		myApp.alert("角色不允许修改！","提示");
		return false;
	});
	
	$("#sexLi").click(function(e){
		sexPicker.open();
		return false;
	});
	$("#birthDateLi").click(function(e){
		birthDatePicker.open();
		return false;
	});
	$("#workPlaceLi").click(function(e){
		workPlacePicker.open();
		return false;
	});
	$("#industryLi").click(function(e){
		industryPicker.open();
		return false;
	});
	$("#inSchoolYearLi").click(function(e){
		inSchoolYearPicker.open();
		return false;
	});
	$("#graduationYearLi").click(function(e){
		graduationYearPicker.open();
		return false;
	});
});
