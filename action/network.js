const request = require('request');

const URL_BING = 'http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1';
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
 * 获取Bing图片并保存
 * @param url
 * @returns {Promise<any>}
 */
async function httpGetImage(url) {
    return new Promise((resolve, reject) => {

    })
}



const network = {
    refreshBingImg: async () => {
        console.log('================================================');
        const result = JSON.parse(await httpGet(URL_BING));
        IMAGE_SIZE.forEach(((value, index, array) => {
            let tmpUrl = URL_IMAGE + result.images[0].urlbase+'_'+value+'.jpg';

            console.log(tmpUrl)
        }));
    }
};

module.exports = network;