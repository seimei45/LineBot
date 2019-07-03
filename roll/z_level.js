try {
    var rply = {
        default: 'on',
        type: 'text',
        text: ''
    };
    const records = require('../modules/records.js');
    records.get('trpgLevel', (msgs) => {
        rply.trpgLevelfunction = msgs
    })

    gameName = function () {
        return '(公測中)LV功能 .lv (off on mylv set 顯示內容 )'
    }
    gameType = function () {
        return 'trpglevel:hktrpg'
    }
    prefixs = function () {
        return [/(^[.]lv$)/ig, /\S/]
    }
    getHelpMessage = function () {
        return "【資料庫功能】" + "\
        \n 這是根據關鍵字來顯示數據的,\
        \n 例如輸入 .lv add 九大陣營 守序善良 (...太長省略) 中立邪惡 混亂邪惡 \
        \n 再輸入.lv 九大陣營  守序善良 (...太長省略) 中立邪惡 混亂邪惡\
        \n add 後面第一個是關鍵字, 可以是漢字,數字,英文及emoji\
        \n P.S.如果沒立即生效 用.lv show 刷新一下\
    \n 輸入.lv add (關鍵字) (內容)即可增加關鍵字\
    \n 輸入.lv show 顯示所有關鍵字\
    \n 輸入.lv del(編號)或all 即可刪除\
    \n 輸入.lv  (關鍵字) 即可顯示 \
    \n "
    }
    initialize = function (inputStr, groupid, userid, userrole, mainMsg, trigger) {
        //當有回覆,這裡增加XP, 如果XP到達升LV 程度, return 升LV資訊
        //5 * (lvl ^ 2) + 50 * lvl + 100
        return rply;
    }

    rollDiceCommand = function (inputStr, mainMsg, groupid, userid, userrole) {
        records.get('trpgLevel', (msgs) => {
            rply.trpgLevelfunction = msgs
        })
        rply.text = '';
        switch (true) {
            case /^help$/i.test(mainMsg[1]):
                rply.text = this.getHelpMessage();
                return rply;

            // .lv(0) ADD(1) TOPIC(2) CONTACT(3)
            case /(^[.]lv$)/i.test(mainMsg[0]) && /^add$/i.test(mainMsg[1]) && /^(?!(add|del|show)$)/ig.test(mainMsg[2]):
                //增加資料庫
                //檢查有沒有重覆
                let checkifsamename = 0
                if (groupid && userrole >= 2 && mainMsg[3]) {
                    if (rply.trpgLevelfunction)
                        for (var i = 0; i < rply.trpgLevelfunction.length; i++) {
                            if (rply.trpgLevelfunction[i].groupid == groupid) {
                                // console.log('checked1')
                                if (rply.trpgLevelfunction[0] && rply.trpgLevelfunction[0].trpgLevelfunction[0])
                                    for (var a = 0; a < rply.trpgLevelfunction[i].trpgLevelfunction.length; a++) {
                                        if (rply.trpgLevelfunction[i].trpgLevelfunction[a].topic == mainMsg[2]) {
                                            //   console.log('checked')
                                            checkifsamename = 1
                                        }
                                    }
                            }
                        }
                    let temp = {
                        groupid: groupid,
                        trpgLevelfunction: [{
                            topic: mainMsg[2],
                            contact: inputStr.replace(/\.lv add /i, '').replace(mainMsg[2], '').replace(/^\s+/, '')
                        }]
                    }
                    if (checkifsamename == 0) {
                        records.pushtrpgLevelfunction('trpgLevel', temp, () => {
                            records.get('trpgLevel', (msgs) => {
                                rply.trpgLevelfunction = msgs
                                // console.log(rply);
                            })

                        })
                        rply.text = '新增成功: ' + mainMsg[2]
                    } else rply.text = '新增失敗. 重複標題'
                } else {
                    rply.text = '新增失敗.'
                    if (!mainMsg[2])
                        rply.text += ' 沒有標題.'
                    if (!mainMsg[3])
                        rply.text += ' 沒有內容'
                    if (!groupid)
                        rply.text += ' 不在群組.'
                    if (groupid && userrole < 2)
                        rply.text += ' 只有GM以上才可新增.'
                }
                return rply;

            case /(^[.]lv$)/i.test(mainMsg[0]) && /^del$/i.test(mainMsg[1]) && /^all$/i.test(mainMsg[2]):
                //刪除資料庫
                if (groupid && mainMsg[2] && rply.trpgLevelfunction && userrole >= 2) {
                    for (var i = 0; i < rply.trpgLevelfunction.length; i++) {
                        if (rply.trpgLevelfunction[i].groupid == groupid) {
                            let temp = rply.trpgLevelfunction[i]
                            temp.trpgLevelfunction = []
                            records.settrpgLevelfunction('trpgLevel', temp, () => {
                                records.get('trpgLevel', (msgs) => {
                                    rply.trpgLevelfunction = msgs
                                })
                            })
                            rply.text = '刪除所有關鍵字'
                        }
                    }
                } else {
                    rply.text = '刪除失敗.'
                    if (!groupid)
                        rply.text += '不在群組. '
                    if (groupid && userrole < 2)
                        rply.text += '只有GM以上才可刪除. '
                }

                return rply;
            case /(^[.]lv$)/i.test(mainMsg[0]) && /^del$/i.test(mainMsg[1]) && /^\d+$/i.test(mainMsg[2]):
                //刪除資料庫
                if (groupid && mainMsg[2] && rply.trpgLevelfunction && userrole >= 2) {
                    for (var i = 0; i < rply.trpgLevelfunction.length; i++) {
                        if (rply.trpgLevelfunction[i].groupid == groupid && mainMsg[2] < rply.trpgLevelfunction[i].trpgLevelfunction.length && mainMsg[2] >= 0) {
                            let temp = rply.trpgLevelfunction[i]
                            temp.trpgLevelfunction.splice(mainMsg[2], 1)
                            //console.log('rply.trpgLevelfunction: ', temp)
                            records.settrpgLevelfunction('trpgLevel', temp, () => {
                                records.get('trpgLevel', (msgs) => {
                                    rply.trpgLevelfunction = msgs
                                })
                            })
                        }
                        rply.text = '刪除成功: ' + mainMsg[2]
                    }
                } else {
                    rply.text = '刪除失敗.'
                    if (!mainMsg[2])
                        rply.text += '沒有關鍵字. '
                    if (!groupid)
                        rply.text += '不在群組. '
                    if (groupid && userrole < 2)
                        rply.text += '只有GM以上才可刪除. '
                }
                return rply;

            case /(^[.]lv$)/i.test(mainMsg[0]) && /^show$/i.test(mainMsg[1]):
                //顯示
                records.get('trpgLevel', (msgs) => {
                    rply.trpgLevelfunction = msgs
                })
                //console.log(rply.trpgLevelfunction)
                if (groupid) {
                    let temp = 0;
                    if (rply.trpgLevelfunction)
                        for (var i = 0; i < rply.trpgLevelfunction.length; i++) {
                            if (rply.trpgLevelfunction[i].groupid == groupid) {
                                rply.text += '資料庫列表:'
                                for (var a = 0; a < rply.trpgLevelfunction[i].trpgLevelfunction.length; a++) {
                                    temp = 1
                                    rply.text += ("\n") + a + '. ' + rply.trpgLevelfunction[i].trpgLevelfunction[a].topic
                                }
                            }
                        }
                    if (temp == 0) rply.text = '沒有已設定的關鍵字. '
                } else {
                    rply.text = '不在群組. '
                }
                //顯示資料庫
                rply.text = rply.text.replace(/^([^(,)\1]*?)\s*(,)\s*/mg, '$1: ').replace(/\,/gm, ', ')
                return rply
            case /(^[.]lv$)/i.test(mainMsg[0]) && /\S/i.test(mainMsg[1]) && /^(?!(add|del|show)$)/ig.test(mainMsg[1]):
                //顯示關鍵字
                //let times = /^[.]lv/.exec(mainMsg[0])[1] || 1
                //if (times > 30) times = 30;
                //if (times < 1) times = 1
                //console.log(times)
                if (groupid) {
                    //    console.log(mainMsg[1])
                    let temp = 0;
                    if (rply.trpgLevelfunction)
                        for (var i = 0; i < rply.trpgLevelfunction.length; i++) {
                            if (rply.trpgLevelfunction[i].groupid == groupid) {
                                // console.log(rply.trpgLevelfunction[i])
                                //rply.text += '資料庫列表:'
                                for (var a = 0; a < rply.trpgLevelfunction[i].trpgLevelfunction.length; a++) {
                                    if (rply.trpgLevelfunction[i].trpgLevelfunction[a].topic.toLowerCase() == mainMsg[1].toLowerCase()) {
                                        temp = 1
                                        rply.text = rply.trpgLevelfunction[i].trpgLevelfunction[a].topic + '\n' + rply.trpgLevelfunction[i].trpgLevelfunction[a].contact;

                                    }

                                }
                            }
                        }
                    if (temp == 0) rply.text = '沒有相關關鍵字. '
                } else {
                    rply.text = '不在群組. '
                }
                rply.text = rply.text.replace(/\,/mg, ' ')
                return rply;
            default:
                break;

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