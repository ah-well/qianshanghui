function execAjaxScript(ajaxLoadedData){
	var regDetectJs = /<script(.|\n)*?>(.|\n|\r\n)*?<\/script>/ig;
	var jsContained = ajaxLoadedData.match(regDetectJs);
	if(jsContained) {
		var regGetJS = /<script(.|\n)*?>((.|\n|\r\n)*)?<\/script>/im;
	    var jsNums = jsContained.length;
	    for (var i=0; i<jsNums; i++) {
	    	var jsSection = jsContained[i].match(regGetJS);
	    	if(jsSection[2]) {
	    		if(window.execScript) {
	    			window.execScript(jsSection[2]);
	    		} else {
	    			window.eval(jsSection[2]);
	    		}
	    	}
	    }
	}
}