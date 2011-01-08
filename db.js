/*
	数据存储js
	用IndexDB
	
	调用方法：
	
	notes.init();
	notes.setNote(20081031, Canvas对象, cFun);  返回值是插入的 date
	notes.getNote(20081031, cFun);  返回值是canvas对象
	
	如果出错，一律返回false
*/

Function.prototype.bind = function(target){
	var fun = this;
	return function(){
		fun.apply(target, arguments);
	};
}


window.notes = {};
(function(){
	var db = null; //这里保存db对象的引用
	var tName = 'notes';  //数据库里的数据表
	var _cFun = null;  //每次的回调函数
	
	notes.init = function(){
		

		var dbSize = 5 * 1024 * 1024; // 5MB
		db = openDatabase('Daily', '1.0', 'HTML5 Daily Book', dbSize);
		db.transaction(function(tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS ' + 
						  tName +'(date INTEGER PRIMARY KEY ASC, content TEXT, added_on DATETIME)', []);
		});
	};

	notes.getNote = function(date, cFun){  //按照指定日期取得日记内容 返回格式 js对象
		_cFun = cFun;
		if(!cFun){
			alert('参数不对，没有cFun');
			return;
		}
		
		db.transaction(function(tx) {
			var sql = 'SELECT * FROM '+ tName +' WHERE date='+ date;
			//console.log(sql);
			tx.executeSql(sql, [], _t.onFind.bind(_t), _t.onError.bind(_t));
		});
		
	};
	notes.setNote = function(date, content, cFun){  //按照日期存储日记  接受参数格式 js对象  返回成功状态
		_cFun = cFun;
		if(!cFun){
			alert('参数不对，没有cFun');
			return;
		}
		//function _onError(tx, e){
		//	update(date, content);
		//}
		content = content.toDataURL("image/png", "");
		db.transaction(function(tx){
			tx.executeSql('INSERT INTO '+ tName +'(date, content) VALUES (?,?)', 
							[date, content],
						_t.onSet.bind(_t),
						_t.onError.bind(_t));
						//_onError);
		});

		return;
	};
	function update(date, content){
		db.transaction(function(tx){
			console.log('这是个update操作');
			//tx.executeSql('UPDATE '+ tName +' SET content='+ content +' WHERE date='+ date, 
			var sql = 'UPDATE '+ tName +'(content) VALUES(?) WHERE date='+ date;
			console.log(sql);
			tx.executeSql(sql, 
						[content],
						_t.onSet.bind(_t),
						_t.onError.bind(_t)
					);
		});
	}
	
	
	var _t = {};
	_t.onError = function(tx, e) {
	  console.log('Something unexpected happened: ' + e.message );
	  _cFun(false);
	};
	_t.onFind = function(tx, r){
		console.log(r);
		window.R = r;
		if(!r.rows.length){
			_cFun(false);
			return;
		}
		var o = r.rows.item(0);
		var canvas = new Image();
		canvas.src = o.content;
		_cFun(canvas);  //todo 还原成Canvas对象
	};
	_t.onSet = function(tx, r){
		console.log(r);
		_cFun(r.insertId);
	};
})();