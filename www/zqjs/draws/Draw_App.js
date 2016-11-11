function addClassName(className, newValue){
	// 仅限于 R G
	var rules = [
		['R','G'],
		['BUY','SELL','NEW']
	];
	var arr = className.split(' ');
	if(arr.indexOf(newValue) == -1){
		for(var i=0; i<rules.length; i++){
			if(rules[i].indexOf(newValue) > -1){
				for(var j=0; j<rules[i].length && rules[i][j] != newValue; j++){
					if(arr.indexOf(rules[i][j]) > -1){
						arr.splice(arr.indexOf(rules[i][j]), 1);
					}
				}
				arr.push(newValue);
				break;
			}
		}
	}
	return arr.join(' ');
}

function draw_app(){
	DM.run(draw_page_quote);
	DM.run(draw_page_position);
	DM.run(draw_page_posdetail);
}

//DM.init(draw_app);
