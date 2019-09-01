try {
    var rply = {
        default: 'on',
        type: 'text',
        text: '',
        save: ''
    };
    const records = require('../modules/records.js');
    records.get('trpgCommand', (msgs) => {
        rply.trpgCommandfunction = msgs
    })

    gameName = function () {
        return '(公測中)儲存擲骰指令功能 .cmd (add del show 自定關鍵字)'
    }
    gameType = function () {
        return 'trpgCommand:hktrpg'
    }
    prefixs = function () {
        return [/(^[.]cmd$)/ig, ]
    }
    getHelpMessage = function () {
        return "【儲存擲骰指令功能】" + "\
        \n 這是根據關鍵字來再現擲骰指令,\
        \n 例如輸入 .cmd add  pc1鬥毆 cc 80 鬥毆 \
        \n 再輸入.cmd pc1鬥毆  就會執行後方的指令\
        \n add 後面第一個是關鍵字, 可以是符號或任何字\
        \n P.S.如果沒立即生效 用.cmd show 刷新一下\
    \n 輸入.cmd add (關鍵字) (指令)即可增加關鍵字\
    \n 輸入.cmd show 顯示所有關鍵字\
    \n 輸入.cmd del(編號)或all 即可刪除\
    \n 輸入.cmd  (關鍵字) 即可執行 \
    \n "
    }
    initialize = function () {
        return rply;
    }

    rollDiceCommand = function (inputStr, mainMsg, groupid, userid, userrole) {
        records.get('trpgCommand', (msgs) => {
            rply.trpgCommandfunction = msgs
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