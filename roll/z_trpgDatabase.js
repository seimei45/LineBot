try {
    var rply = {
        default: 'on',
        type: 'text',
        text: ''
    };
    const records = require('../modules/records.js');
    records.get('trpgDatabase', (msgs) => {
        rply.trpgDatabasefunction = msgs
    })
    records.get('trpgDatabaseAllgroup', (msgs) => {
        rply.trpgDatabaseAllgroup = msgs
    })
    gameName = function () {
        return '(公測中)資料庫功能 .db(p) (add del show 自定關鍵字)'
    }
    gameType = function () {
        return 'trpgDatabase:hktrpg'
    }
    prefixs = function () {
        return [/(^[.]db(p|)$)/ig,]
    }
    getHelpMessage = function () {
        return "【資料庫功能】" + "\
        \n 這是根據關鍵字來顯示數據的,\
        \n 例如輸入 .db add 九大陣營 守序善良 (...太長省略) 中立邪惡 混亂邪惡 \
        \n 再輸入.db 九大陣營  守序善良 (...太長省略) 中立邪惡 混亂邪惡\
        \n add 後面第一個是關鍵字, 可以是漢字,數字,英文及emoji\
        \n P.S.如果沒立即生效 用.db show 刷新一下\
    \n 輸入.db add (關鍵字) (內容)即可增加關鍵字\
    \n 輸入.db show 顯示所有關鍵字\
    \n 輸入.db del(編號)或all 即可刪除\
    \n 輸入.db  (關鍵字) 即可顯示 \
    \n 如使用輸入.dbp 會變成全服版,全服可看, 可用add show功能 \
    \n "
    }
    initialize = function () {
        return rply;
    }

    rollDiceCommand = function (inputStr, mainMsg, groupid, userid, userrole) {
        records.get('trpgDatabase', (msgs) => {
            rply.trpgDatabasefunction = msgs
        })
        rply.text = '';
        switch (true) {
            default:
                rply.text = '因服務供應商出現問題，因此資料庫相關功能暫時停止服務.詳情請參考 https://status.mlab.com '
                return rply;
        }
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