// Load `*.js` under roll directory as properties
//  i.e., `User.js` will become `exports['User']` or `exports.User`
require('fs').readdirSync('./roll/').forEach(function (file) {
	if (file.match(/\.js$/) !== null && file !== 'index.js' && file !== 'demo.js') {
		var name = file.replace('.js', '');
		exports[name] = require('../roll/' + file);
	}
});
try {
	let result = [];

	//用來呼叫骰組,新增骰組的話,要寫條件式到下面呼叫 
	//格式是 exports.骰組檔案名字.function名
	module.exports.parseInput = async function parseInput(inputStr, groupid, userid, userrole) {
		//console.log('InputStr: ' + inputStr);
		_isNaN = function (obj) {
			return isNaN(parseInt(obj));
		}
		result = [];


		let stopmark = 0;
		let msgSplitor = (/\S+/ig);
		let mainMsg = inputStr.match(msgSplitor); //定義輸入字串
		let trigger = mainMsg[0].toString().toLowerCase(); //指定啟動詞在第一個詞&把大階強制轉成細階
		//對比mongoose資料
		//console.log('stop')
		//Object.keys(exports).forEach(v => {
		if (exports.z_stop.initialize().save && exports.z_stop.initialize().save[0].blockfunction && exports.z_stop.initialize().save[0].blockfunction.length > 0) {
			for (var i = 0; i < exports.z_stop.initialize().save.length; i++) {
				if ((new RegExp(exports.z_stop.initialize().save[i].blockfunction.join("|"), "i")).test(mainMsg[0]) && exports.z_stop.initialize().save[i].groupid == groupid && exports.z_stop.initialize().save[i].blockfunction.length > 0) {
					console.log('Match AND STOP')
					stopmark = 1

				}
			}
		}
		//})

		if (stopmark == 0) {
			result[0] = await roll(inputStr, groupid, userid, userrole, mainMsg, trigger)
			console.log('aaaa', await roll(inputStr, groupid, userid, userrole, mainMsg, trigger))
		}
		result[1] = await level(inputStr, groupid, userid, userrole, mainMsg, trigger)

		if (result && ((result[0] && result[0].text) || (result[1] && result[1].text))) {
			console.log('inputStr: ', inputStr)
			return await result;

		} else
			return;


	}

	function level(inputStr, groupid, userid, userrole, mainMsg, trigger) {
		return exports.z_stop.initialize();
	}

	async function roll(inputStr, groupid, userid, userrole, mainMsg, trigger) {
		//在下面位置開始分析trigger
		var breakFlag = false;
		Object.keys(exports).map(async v => {
			if (breakFlag === true) {
				return false;
			}
			//0 = 不存在
			//1 = 符合
			//2 = 不符合
			//以下是分析每組rolling prefixs的資料
			//以每次同步檢查第一第二個 
			//例如第一組是 cc  第二組是 80 
			//那條件式就是 /^cc$/i 和/^\d+$/
			if (!mainMsg[1]) mainMsg[1] = '';
			let checkmainMsg0 = 0;
			let checkmainMsg1 = 0;
			let findprefixs = 0;
			if (exports[v].prefixs()[0] && exports[v].prefixs()[0]) {
				for (var i = 0; i <= exports[v].prefixs().length - 1; i = i + 2) {
					checkmainMsg0 = 0;
					checkmainMsg1 = 0;
					if (exports[v].prefixs()[i] && exports[v].prefixs()[i]) {
						checkmainMsg0 = 2;
						if (exports[v].prefixs()[i + 1] && exports[v].prefixs()[i + 1]) {
							checkmainMsg1 = 2;
						}
						if (exports[v].prefixs()[i] && exports[v].prefixs()[i].test(mainMsg[0])) {
							checkmainMsg0 = 1;
						}
						if (exports[v].prefixs()[i + 1] && exports[v].prefixs()[i + 1].test(mainMsg[1])) {
							checkmainMsg1 = 1;
						}
						if (checkmainMsg0 <= 1 && checkmainMsg1 <= 1 && checkmainMsg0 + checkmainMsg1 >= 1) {
							findprefixs = 1;
							i = exports[v].prefixs().length + 1;
							breakFlag = true
						}
					}
				}
			}

			if (findprefixs == 1) {
				console.log('trigger: ', trigger, ' v: ', v)
				let tempsave = await exports[v].rollDiceCommand(inputStr, mainMsg, groupid, userid, userrole)
				console.log(await exports[v].rollDiceCommand(inputStr, mainMsg, groupid, userid, userrole))
				if (tempsave) {
					Object.keys(tempsave).map(async v => {
						result[v] = await tempsave[v]
						return await result
					})

				}
				/*		Object.keys(tempsave).forEach(v => {
						result[v] = tempsave[v]
									})*/
			}
		})

		//return result

	}


} catch (e) {
	console.log('error: ' + e)
}