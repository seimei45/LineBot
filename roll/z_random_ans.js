try {
    var rply = {
        default: 'on',
        type: 'text',
        text: ''
    };
    const records = require('../modules/records.js');
    records.get('randomAns', (msgs) => {
        rply.randomAnsfunction = msgs
    })
    records.get('randomAnsAllgroup', (msgs) => {
        rply.randomAnsAllgroup = msgs
    })
    gameName = function () {
        return '(公測中)自定義回應功能 .ra(p)(次數) (add del show 自定關鍵字)'
    }
    gameType = function () {
        return 'randomAns:hktrpg'
    }
    prefixs = function () {
        return [/(^[.]ra(\d+|p|p\d+|)$)/ig, ]
    }
    getHelpMessage = function () {
        return "【自定義回應功能】" + "\
        \n 這是根據關鍵字來隨機抽選功能,只要符合內容,以後就會隨機抽選\
        \n 例如輸入 .ra add 九大陣營 守序善良 (...太長省略) 中立邪惡 混亂邪惡 \
        \n 再輸入.ra 九大陣營  就會輸出 九大陣營中其中一個\
        \n 如果輸入.ra3 九大陣營  就會輸出 3次九大陣營\
        \n 如果輸入.ra3 九大陣營 天干 地支 就會輸出 3次九大陣營 天干 地支\
        \n add 後面第一個是關鍵字, 可以是漢字,數字和英文或emoji\
        \n P.S.如果沒立即生效 用.ra show 刷新一下\
    \n 輸入.ra add (關鍵字) (選項1) (選項2) (選項3)即可增加關鍵字\
    \n 輸入.ra show 顯示所有關鍵字\
    \n 輸入.ra del(編號)或all 即可刪除\
    \n 輸入.ra(次數,最多30次) (關鍵字1)(關鍵字2)(關鍵字n) 即可隨機抽選 \
    \n 如使用輸入.rap 會變成全服版,全服可看, 可用add show功能 \
    \n 例如輸入 .rap10 聖晶石召喚 即可十連抽了 \
    \n "
    }
    initialize = function () {
        return rply;
    }

    rollDiceCommand = function (inputStr, mainMsg, groupid, userid, userrole) {
        records.get('randomAns', (msgs) => {
            rply.randomAnsfunction = msgs
        })
        rply.text = '';
        switch (true) {

            default:
                rply.text = '因服務供應商出現問題，因此資料庫相關功能暫時停止服務.詳情請參考 https://status.mlab.com '
                return rply;
        }
    }


    function shuffle(array) {
        let currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
    module.exports = {
        rollDiceCommand: rollDiceCommand,
        initialize: initialize,
        getHelpMessage: getHelpMessage,
        prefixs: prefixs,
        gameType: gameType,
        gameName: gameName
    };
} catch (e) {
    console.log(e)
}