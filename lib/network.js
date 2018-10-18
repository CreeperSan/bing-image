
const fs = require('fs');
const path = require('path');
const request = require('request');


const URL_BING = (days=1) => { return 'http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n='+days; }
const URL_IMAGE = 'http://cn.bing.com';

const IMAGE_SIZE = [
    '1920x1200','1920x1080','1366x768','1280x768','1280x720','1024x768','1280x720','800x600','800x480','640x480','400x240','320x240',
    '1080x1920','768x1366','768x1280','720x1280','480x800','480x640','240x400','240x320',
];

/**
 * 发送Http Get请求
 * @param {*} url 要请求的地址
 */
async function httpGet(url){
    return new Promise((resolve, reject) => {
        request.get(url, function(err, res, body){
            if(err) reject(err);
            resolve(body);
        })
    })
}

/**
 * 同步递归创建目录
 * @param dirname 路径
 * @returns {boolean} 成功与否
 */
function mkdirSync(dirname){
    if (fs.existsSync(dirname)){
        return true;
    }else{
        if (mkdirSync(path.dirname(dirname))){
            fs.mkdirSync(dirname)
            return true
        }
    }
    return false
}

/**
 * 获取Bing图片并保存
 * @param url
 * @returns {Promise<any>}
 */
async function httpGetImage(url, name, imgjson) {
    return new Promise((resolve, reject) => {
        let tmpDateStr = imgjson.enddate;
        if (!tmpDateStr) {
            imgjson = '19700101'
        }
        const tmpYear = tmpDateStr.substr(0,4);
        const tmpMonth = tmpDateStr.substr(4,2);
        const tmpDay = tmpDateStr.substr(6,2);
        const tmpPath = './public/bing-image/'+tmpYear+'/'+tmpMonth+'/'+tmpDay+'/'+name+'.jpg';
        mkdirSync(path.dirname(tmpPath));
        request(url).pipe(fs.createWriteStream(tmpPath));
    })
}



const network = {
    refreshBingImg: async (days=1, downloadCompleteCallback) => {
        const result = JSON.parse(await httpGet(URL_BING(days)));
        result.images.forEach(( async (imgValue, key, parent) => {
            IMAGE_SIZE.forEach((async (value, index, array) => {
                let tmpUrl = URL_IMAGE + imgValue.urlbase+'_'+value+'.jpg';
                await httpGetImage(tmpUrl, value, imgValue)
            }));
            downloadCompleteCallback(imgValue)
        }))
        console.log('Download complete!')
    }
};

module.exports = network;