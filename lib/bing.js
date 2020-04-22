const fs = require('fs');
const request = require('request');
const LOCATION = require(process.cwd()+'/const/location')

const database = require(process.cwd()+'/lib/database');
const network = require(process.cwd()+'/lib/network');

function refreshBingBackgroundImages(days=1) {
    // 读取配置文件
    const configFilePath = process.cwd()+'/config/config.json'
    if(!fs.existsSync(configFilePath)){
        throw 'Config file not exist, please run "npm run init" to initialize config file.'
    }
    let configJson = {}
    try{
        let configJsonString = fs.readFileSync(configFilePath)
        configJson = JSON.parse(configJsonString)
    }catch(e){
        console.log('Load config file error, please run "npm run init" to initialize config file.')
        throw e
    }

    // 网络请求
    network.refreshBingImg(days,async (imgJson) => {
        let tmpDateStr = imgJson.enddate;
        if (!tmpDateStr) {
            tmpDateStr = '19700101'
        }
        const tmpYear = tmpDateStr.substr(0,4).toString();
        const tmpMonth = tmpDateStr.substr(4,2).toString();
        const tmpDay = tmpDateStr.substr(6,2).toString();
        const tmpCopyright = imgJson.copyright.toString();
        const tmpPath = 'https://cn.bing.com'+imgJson.url.toString();
        const tmpJson = JSON.stringify(imgJson);

        /********** 不同地区需要判断，毕竟他们用的符号不一样 **********/

        let tmpAuthor = '';
        let tmpTitle = '';
        let tmpLocation = '';

        // 解析数据
        const tmpCopyrightString = imgJson.copyright.toString();

        switch (parseInt(configJson.server_location)) {
            case LOCATION.CHINA_MAINLAND : { ////////////////////////// 中国大陆地区
                if (tmpCopyright.indexOf('，') >= 0) { // 如果包含地理位置
                    tmpTitle = tmpCopyright.substr(0, tmpCopyright.indexOf('，'));
                    tmpLocation = tmpCopyright.substr( tmpCopyright.indexOf('，')+1, tmpCopyright.lastIndexOf('(')-tmpCopyright.indexOf('，')-1 ).replace(' ','')
                }else{  //如果不包含地理位置
                    tmpTitle = tmpCopyright.substr(0, tmpCopyright.indexOf('(')).replace(' ', '')
                }
                tmpAuthor = tmpCopyrightString.substring(tmpCopyrightString.indexOf('(')+1, tmpCopyrightString.indexOf(')'));
                break;
            }
            case LOCATION.ENGLAND : { ////////////////////////// 英国地区
                if (tmpCopyright.indexOf(',') >= 0) { // 如果包含地理位置
                    tmpTitle = tmpCopyright.substr(0, tmpCopyright.indexOf(','));
                    tmpLocation = tmpCopyright.substr( tmpCopyright.indexOf(',')+1, tmpCopyright.lastIndexOf('(')-tmpCopyright.indexOf(',')-1 ).replace(' ','')
                }else{  //如果不包含地理位置
                    tmpTitle = tmpCopyright.substr(0, tmpCopyright.indexOf('(')).replace(' ', '')
                }
                tmpAuthor = tmpCopyrightString.substring(tmpCopyrightString.indexOf('(')+1, tmpCopyrightString.indexOf(')'));
                break;
            }
            case LOCATION.JAPAN : { ////////////////////////////////// 日本地区
                tmpTitle = tmpCopyrightString.substring(tmpCopyrightString.indexOf('｢')+1, tmpCopyrightString.indexOf('｣'));
                tmpLocation = tmpCopyrightString.substring(tmpCopyrightString.indexOf('｣')+1, tmpCopyrightString.indexOf('('));
                tmpAuthor = tmpCopyrightString.substring(tmpCopyrightString.indexOf('(')+1, tmpCopyrightString.indexOf(')'));
                break;
            }
            default : { ///////////////////////////////////////////////////// 默认为空
                tmpAuthor = '-';
                tmpTitle = '-';
                tmpLocation = '-';
                break;
            }
        }

        // 写入数据库
        await database.addResult(tmpDateStr, tmpYear, tmpMonth, tmpDay, tmpCopyright, tmpAuthor, tmpPath, tmpTitle, tmpLocation, tmpJson)
    })
}

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
        // 下载图片并更新数据库(7天的)
        refreshBingBackgroundImages(7);
    },

    refreshTodayBingImage : function () {
        refreshBingBackgroundImages(3)
    }

};

module.exports = bingAction;