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
        // if (!database.isInit){
        //     console.log('【必应壁纸】正在初始化数据库...');
        //     database.init()
        // }
        // network
        network.refreshBingImg()
    },

    getBingImage : function () {

    }

};

module.exports = bingAction;