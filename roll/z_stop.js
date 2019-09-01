if (process.env.mongoURL) {
    var rply = {
        default: 'on',
        type: 'text',
        text: ''
    };

    const records = require('../modules/records.js');
    records.get('block', (msgs) => {
        rply.save = msgs
    })
    gameName = function () {
        return '(公測中)擲骰開關功能 .bk (add del show)'
    }

    gameType = function () {
        return 'Block:hktrpg'
    }
    prefixs = function () {
        return [/^[.]bk$/ig, ]
    }
    getHelpMessage = function () {
        return "【擲骰開關功能】" + "\
        \n 這是根據關鍵字來開關功能,只要符合內容,\
        \n 例如運勢,那麼只要字句中包括,就不會讓Bot有反應\
        \n 所以注意如果用了D, 那麼1D100, .1WD 都會全部沒反應.\
        \n 另外不可擋b,k,bk, 只可以擋漢字,數字和英文\
        \n P.S.如果沒立即生效 用.bk show 刷新一下\
    \n 輸入.bk add xxxxx 即可增加關鍵字 每次一個\
    \n 輸入.bk show 顯示關鍵字\
    \n 輸入.bk del (編號)或all 即可刪除\
    \n "
    }
    initialize = function () {
        return rply;
    }

    rollDiceCommand = function (inputStr, mainMsg, groupid, userid, userrole) {
        records.get('block', (msgs) => {
            rply.save = msgs
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
}