const fs = require('fs');
const request = require('request');

const database = require('./database');
const network = require('./network');

const bingAction = {
    version : '0.1.0',
    versionCode : 1,

    isInit : function () {

    },
    init : function () {
        // 初始化数据库连接以及数据库表
        if (!database.isInit){
            console.log('【必应壁纸】正在初始化数据库...');
            database.init()
        }
        // network
        network.refreshBingImg(async (imgJson) => {
            console.log(JSON.stringify(imgJson))
            let tmpDateStr = imgJson.enddate
            if (!tmpDateStr) {
                tmpDateStr = '19700101'
            }
            const tmpYear = tmpDateStr.substr(0,4).toString()
            const tmpMonth = tmpDateStr.substr(4,2).toString()
            const tmpDay = tmpDateStr.substr(6,2).toString()
            const tmpCopyright = imgJson.copyright.toString()
            const tmpPath = 'https://cn.bing.com'+imgJson.url.toString()
            let tmpTitle = '-'
            let tmpLocation = '-'
            if (tmpCopyright.indexOf('，') >= 0) { // 如果包含地理位置
                tmpTitle = tmpCopyright.substr(0, tmpCopyright.indexOf('，'))
                tmpLocation = tmpCopyright.substr( tmpCopyright.indexOf('，')+1, tmpCopyright.lastIndexOf('(')-tmpCopyright.indexOf('，')-1 ).replace(' ','')
            }else{  //如果不包含地理位置
                tmpTitle = tmpCopyright.substr(0, tmpCopyright.indexOf('(')).replace(' ', '')
            }
            const tmpJson = JSON.stringify(imgJson)

            console.log(tmpJson)

            database.addResult(tmpYear, tmpMonth, tmpDay, tmpCopyright, tmpPath, tmpTitle, tmpLocation, tmpJson)
        })
    },

    getBingImage : function () {

    }

};

module.exports = bingAction;