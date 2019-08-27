try {
    var rply = {
        default: 'on',
        type: 'text',
        text: '',
        save: ''
    };
    const records = require('../modules/records.js');
    records.get('trpgDarkRolling', (msgs) => {
        rply.trpgDarkRollingfunction = msgs
    })

    gameName = function () {
        return '(公測中)暗骰GM功能 .drgm (add del show 自定關鍵字)'
    }
    gameType = function () {
        return 'trpgDarkRolling:hktrpg'
    }
    prefixs = function () {
        return [/(^[.]drgm$)/ig, ]
    }
    getHelpMessage = function () {
        return "【暗骰GM功能】.drgm .dr .ddr .dddr" + "\
        \n 這是讓你可以私骰GM的功能,\
        \n 例如輸入 .ddr cc 80 鬥毆 \
        \n 就會把結果私訊GM及自己\
        \n 例如輸入 .dddr cc 80 鬥毆 \
        \n 就會把結果只私訊GM\
        \n P.S.如果沒立即生效 用.drgm show 刷新一下\
    \n 輸入.drgm addgm 即可成為GM\
    \n 輸入.drgm show 顯示所有GM\
    \n 輸入.drgm del(編號)或all 即可刪除\
    \n 輸入.dr  (指令) 私訊自己 \
    \n 輸入.ddr(指令) 私訊GM及自己\
    \n 輸入.dddr(指令) 私訊GM\
    \n "
    }
    initialize = function () {
        return rply;
    }

    rollDiceDarkRolling = function (inputStr, mainMsg, groupid, userid, userrole) {
        records.get('trpgDarkRolling', (msgs) => {
            rply.trpgDarkRollingfunction = msgs
        })
        rply.text = '';
        switch (true) {
            case /^help$/i.test(mainMsg[1]):
                rply.text = this.getHelpMessage();
                return rply;
                // .drgm(0) ADD(1) TOPIC(2) CONTACT(3)
            case /(^[.]drgm$)/i.test(mainMsg[0]) && /^add$/i.test(mainMsg[1]) && /^(?!(add|del|show)$)/ig.test(mainMsg[2]):
                //console.log('mainMsg: ', mainMsg)
                //增加資料庫
                //檢查有沒有重覆
                let checkifsamename = 0
                if (groupid && userrole >= 1 && mainMsg[3] && mainMsg[3].toLowerCase() != ".drgm") {
                    if (rply.trpgDarkRollingfunction)
                        for (var i = 0; i < rply.trpgDarkRollingfunction.length; i++) {
                            if (rply.trpgDarkRollingfunction[i].groupid == groupid) {
                                // console.log('checked1')
                                if (rply.trpgDarkRollingfunction[0] && rply.trpgDarkRollingfunction[0].trpgDarkRollingfunction[0])
                                    for (var a = 0; a < rply.trpgDarkRollingfunction[i].trpgDarkRollingfunction.length; a++) {
                                        if (rply.trpgDarkRollingfunction[i].trpgDarkRollingfunction[a].topic == mainMsg[2]) {
                                            //   console.log('checked')
                                            checkifsamename = 1
                                        }
                                    }
                            }
                        }
                    let temp = {
                        groupid: groupid,
                        trpgDarkRollingfunction: [{
                            topic: mainMsg[2],
                            contact: inputStr.replace(/\.drgm\s+add\s+/i, '').replace(mainMsg[2], '').replace(/^\s+/, '')
                        }]
                    }
                    if (checkifsamename == 0) {
                        records.pushtrpgDarkRollingfunction('trpgDarkRolling', temp, () => {
                            records.get('trpgDarkRolling', (msgs) => {
                                rply.trpgDarkRollingfunction = msgs
                                // console.log(rply);
                            })

                        })
                        rply.text = '新增成功: ' + mainMsg[2] + '\n' + inputStr.replace(/\.drgm\s+add\s+/i, '').replace(mainMsg[2], '').replace(/^\s+/, '')
                    } else rply.text = '新增失敗. 重複標題'
                } else {
                    rply.text = '新增失敗.'
                    if (!mainMsg[2])
                        rply.text += ' 沒有標題.'
                    if (!mainMsg[3])
                        rply.text += ' 沒有擲骰指令'
                    if (mainMsg[3].toLowerCase() == ".drgm")
                        rply.text += '指令不可以儲存.drgm啊'
                    if (!groupid)
                        rply.text += ' 不在群組.'
                    if (groupid && userrole < 1)
                        rply.text += ' 只有GM以上才可新增.'
                }
                return rply;

            case /(^[.]drgm$)/i.test(mainMsg[0]) && /^del$/i.test(mainMsg[1]) && /^all$/i.test(mainMsg[2]):
                //刪除資料庫
                if (groupid && mainMsg[2] && rply.trpgDarkRollingfunction && userrole >= 1) {
                    for (var i = 0; i < rply.trpgDarkRollingfunction.length; i++) {
                        if (rply.trpgDarkRollingfunction[i].groupid == groupid) {
                            let temp = rply.trpgDarkRollingfunction[i]
                            temp.trpgDarkRollingfunction = []
                            records.settrpgDarkRollingfunction('trpgDarkRolling', temp, () => {
                                records.get('trpgDarkRolling', (msgs) => {
                                    rply.trpgDarkRollingfunction = msgs
                                })
                            })
                            rply.text = '刪除所有關鍵字'
                        }
                    }
                } else {
                    rply.text = '刪除失敗.'
                    if (!groupid)
                        rply.text += '不在群組. '
                    if (groupid && userrole < 1)
                        rply.text += '只有GM以上才可刪除. '
                }

                return rply;
            case /(^[.]drgm$)/i.test(mainMsg[0]) && /^del$/i.test(mainMsg[1]) && /^\d+$/i.test(mainMsg[2]):
                //刪除資料庫
                if (groupid && mainMsg[2] && rply.trpgDarkRollingfunction && userrole >= 1) {
                    for (var i = 0; i < rply.trpgDarkRollingfunction.length; i++) {
                        if (rply.trpgDarkRollingfunction[i].groupid == groupid && mainMsg[2] < rply.trpgDarkRollingfunction[i].trpgDarkRollingfunction.length && mainMsg[2] >= 0) {
                            let temp = rply.trpgDarkRollingfunction[i]
                            temp.trpgDarkRollingfunction.splice(mainMsg[2], 1)
                            //console.log('rply.trpgDarkRollingfunction: ', temp)
                            records.settrpgDarkRollingfunction('trpgDarkRolling', temp, () => {
                                records.get('trpgDarkRolling', (msgs) => {
                                    rply.trpgDarkRollingfunction = msgs
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
                    if (groupid && userrole < 1)
                        rply.text += '只有GM以上才可刪除. '
                }
                return rply;

            case /(^[.]drgm$)/i.test(mainMsg[0]) && /^show$/i.test(mainMsg[1]):
                //顯示
                records.get('trpgDarkRolling', (msgs) => {
                    rply.trpgDarkRollingfunction = msgs
                })
                //console.log(rply.trpgDarkRollingfunction)
                if (groupid) {
                    let temp = 0;
                    if (rply.trpgDarkRollingfunction)
                        for (var i = 0; i < rply.trpgDarkRollingfunction.length; i++) {
                            if (rply.trpgDarkRollingfunction[i].groupid == groupid) {
                                rply.text += '資料庫列表:'
                                for (var a = 0; a < rply.trpgDarkRollingfunction[i].trpgDarkRollingfunction.length; a++) {
                                    temp = 1
                                    rply.text += ("\n") + a + '. ' + rply.trpgDarkRollingfunction[i].trpgDarkRollingfunction[a].topic + '\n' + rply.trpgDarkRollingfunction[i].trpgDarkRollingfunction[a].contact + '\n'
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
            case /(^[.]drgm$)/i.test(mainMsg[0]) && /\S/i.test(mainMsg[1]) && /^(?!(add|del|show)$)/ig.test(mainMsg[1]):
                //顯示關鍵字
                //let times = /^[.]drgm/.exec(mainMsg[0])[1] || 1
                //if (times > 30) times = 30;
                //if (times < 1) times = 1
                //console.log(times)
                if (groupid) {
                    //    console.log(mainMsg[1])
                    let temp = 0;
                    if (rply.trpgDarkRollingfunction)
                        for (var i = 0; i < rply.trpgDarkRollingfunction.length; i++) {
                            if (rply.trpgDarkRollingfunction[i].groupid == groupid) {
                                // console.log(rply.trpgDarkRollingfunction[i])
                                //rply.text += '資料庫列表:'
                                for (var a = 0; a < rply.trpgDarkRollingfunction[i].trpgDarkRollingfunction.length; a++) {
                                    if (rply.trpgDarkRollingfunction[i].trpgDarkRollingfunction[a].topic.toLowerCase() == mainMsg[1].toLowerCase()) {
                                        temp = 1
                                        rply.text = rply.trpgDarkRollingfunction[i].trpgDarkRollingfunction[a].topic + '\n' + rply.trpgDarkRollingfunction[i].trpgDarkRollingfunction[a].contact;

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
        rollDiceDarkRolling: rollDiceDarkRolling,
        initialize: initialize,
        getHelpMessage: getHelpMessage,
        prefixs: prefixs,
        gameType: gameType,
        gameName: gameName
    };
} catch (e) {
    console.log(e)
}