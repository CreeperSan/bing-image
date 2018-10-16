const router = require('koa-router')();
const request = require('request');
const fs = require('fs')

const database = require(process.cwd()+'/lib/database');
const ScreenResoluction = require(process.cwd()+'/lib/screen-resolution');

router.prefix('/api/v1');

const CODE_SUCCESS = 200;
const CODE_SERVER_ERROR = 500;

const URL_BING_IMAGE = 'http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1';
const URL_BING_PREFIX = 'http://cn.bing.com';

/**
 * 生成Restful Json回应
 * @param {*} respFlag 返回操作结果 
 * @param {*} data 返回操作数据
 */
function createResponse(respFlag, data={}){
  return JSON.stringify({
    flag : respFlag,
    data : data
  })
}

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
 * 下面才是路由处理
 */


/**
 * 请求地址:   /url-current
 * 链接功能:   即刻获取必应现在的背景图片信息（从Bing服务器转发）
 * 请求参数:   无
 */
router.get('/url-current', async (ctx, next) => {
    try{
        let getStr = await httpGet(URL_BING_IMAGE);
        let getJson = JSON.parse(getStr).images[0];
        ctx.body = createResponse(CODE_SUCCESS, {
            url : URL_BING_PREFIX+getJson.url,
            copyright : getJson.copyright,
            copyright_link : getJson.copyrightlink,
            start_date : getJson.startdate,
            end_date : getJson.enddate
        });
    }catch(e){
        ctx.body = createResponse(CODE_SERVER_ERROR);
    }
});

/**
 * 请求地址:   /img-current
 * 链接功能:   即刻获取必应现在的背景图片文件（从Bing服务器转发）， 可以直接用在img标签里面
 * 请求参数:   无
 */
router.get('/img-current', async (ctx, next) => {
    const tmpImgUrl = URL_BING_PREFIX + JSON.parse(await httpGet(URL_BING_IMAGE)).images[0].url;
    ctx.body = request(tmpImgUrl)
});


/**
 * 请求地址:   /img
 * 链接功能:   获取服务器中最新的必应背景图片文件， 可以直接用在img标签里面
 * 请求参数:   无
 */
router.get('/img',async (ctx, next) => {

})

/**
 * 请求地址:   /url
 * 链接功能:   获取服务器中必应背景图片URL（ 瀑布流 ）
 * 请求参数:   count 返回的图片数量     * 默认获取12条
 *            start 开始的日期        * 默认为服务器时间
 *            size  获取的图片尺寸     * 默认为 1920*1080 和 320*240
 */
function urlGetTodayID(){
    const tmpDate = new Date();
    let year = tmpDate.getFullYear();
    let month = tmpDate.getMonth()+1;
    let day = tmpDate.getDate();
    if (month < 10){ month = '0'+month.toString(); }
    if (day < 10){ day = '0'+day.toString(); }
    return year.toString()+month.toString()+day.toString();
}
router.get('/url', async (ctx, next) => {
    let returnObject = {}
    const requestParam = ctx.request.query;
    console.log(requestParam)
    if (!requestParam.count){ requestParam.count = 12 }
    if (!requestParam.page){ requestParam.page = 1; }
    if (!requestParam.size){ requestParam.size = ScreenResoluction.SIZE_1920x1080.toString()+','+ScreenResoluction.SIZE_320x240.toString(); }
    const queryData = await database.getBingInfo( requestParam.page, requestParam.count )
    let tmpLineCount = await database.getBingImageCount()
    if (tmpLineCount.success){
        tmpLineCount = tmpLineCount.result[0]['count(_id)']
        returnObject.itemCount = tmpLineCount
    }
    returnObject.imgList = queryData
    ctx.body = createResponse(CODE_SUCCESS, returnObject)

})

/**
 * 请求地址:   /rank_name
 * 链接功能:   获取服务器中排行榜名称列表
 * 请求参数:   无
 */
router.get('/rank_name', async (ctx, next) => {
    ctx.body = createResponse(CODE_SUCCESS, {
        rank_infos : [{
            key : 'download',
            name : '下载排行榜'
        },{
            key : 'editor',
            name : '编辑推荐排行榜'
        }]
    })
})

/**
 * 请求地址:   /rank
 * 链接功能:   获取服务器中排行榜
 * 请求参数:   无
 */
function rankCreateRankObject(key, title, itemList){
    return {key: key, title: title, items: itemList }
}

router.get('/rank', async (ctx, next) => {
    let returnRanks = [];
    const requestParam = ctx.request.query;
    if (requestParam.rank == undefined || requestParam.rank==null || requestParam.rank=="") {
        requestParam.rank = 'download,editor'
    }
    if (requestParam.rank != null){
        const requestRankKeyList = requestParam.rank.toString().split(',');
        requestRankKeyList.forEach(((value, index, array) => {
            switch (value) {
                case 'download' : {
                    const tmpItemList = [];
                    let i=0;
                    for (i=0;i<10;i++){
                        tmpItemList.push({
                            id : '20181009',
                            copyright : '盐泉岛上的苹果树，加拿大不列颠哥伦比亚省 (© Radius Images/Offset)',
                            title : '第26届叠人塔大赛的选手们',
                            location : '美国缅因州',
                            img : 'https://cn.bing.com/az/hprichbg/rb/SaltApple_ZH-CN14543908140_1920x1080.jpg',
                            img_thumbnail : 'https://cn.bing.com/az/hprichbg/rb/SaltApple_ZH-CN14543908140_1920x1080.jpg',
                        })
                    }
                    returnRanks.push(rankCreateRankObject('download', '下载排行榜', tmpItemList));
                    break;
                }
                case 'editor' : {
                    const tmpItemList = [];
                    let i=0;
                    for (i=0;i<10;i++){
                        tmpItemList.push({
                            id : '20181008',
                            copyright : '冉冉升起的热气球，美国新墨西哥州 (© Blaine Harrington III/Alamy)',
                            title : '无法真正微笑的章鱼',
                            location : '墨西哥米却肯州',
                            img : 'https://cn.bing.com/az/hprichbg/rb/MonarchSky_ZH-CN12318525605_1920x1080.jpg',
                            img_thumbnail : 'https://cn.bing.com/az/hprichbg/rb/MonarchSky_ZH-CN12318525605_1920x1080.jpg',
                        })
                    }
                    returnRanks.push(rankCreateRankObject('editor', '编辑推荐排行榜', tmpItemList));
                    break;
                }
            }
        }))
    }
    ctx.body = createResponse(CODE_SUCCESS, {
        ranks : returnRanks
    });
})

/**
 * 请求地址:   /random
 * 链接功能:   获取服务器中随机一个图片信息
 * 请求参数:   无
 */
router.get('/random', async (ctx, next) => {
    let requestCount = parseInt(ctx.request.query.count)
    if (!requestCount) { requestCount = 1 }

    const databaseResult = await database.getRandomImage(requestCount)
    ctx.body = createResponse(CODE_SUCCESS, databaseResult.result)
})

/**
 * 请求地址:   /random
 * 链接功能:   获取服务器中随机一个图片信息
 * 请求参数:   date 图片日期 eg:20180403
 *            size 图片尺寸 eg:1  默认是1080p，具体表格参照ScreenResoltion常量定义
 */
router.get('/download/:imgID', async (ctx, next) => {
    let requestParam = ctx.request.query
    let tmpDate = ctx.params.imgID.toString()
    let tmpSize = requestParam.size

    if (tmpDate.endsWith('.jpg')){ tmpDate = tmpDate.substr(0, tmpDate.indexOf('.jpg')) }
    console.log(tmpDate+'  '+tmpDate.length+'   '+ScreenResoluction.isSizeLegal(tmpSize))

    if (!tmpSize) { tmpSize = ScreenResoluction.SIZE_1920x1080 }

    if (!tmpDate || tmpDate.length!=8 || !ScreenResoluction.isSizeLegal(tmpSize)){
        ctx.status = 400
    }else{
        const tmpYear = tmpDate.substr(0, 4);
        const tmpMonth = tmpDate.substr(4, 2);
        const tmpDay = tmpDate.substr(6, 2);
        const tmpPath = process.cwd()+'/public/bing-image/'+tmpYear+'/'+tmpMonth+'/'+tmpDay+'/'+ScreenResoluction.getSizeName(tmpSize)+'.jpg'
        console.log('下载图片 ： '+tmpPath)
        if (fs.existsSync(tmpPath).toString()){
            ctx.body = fs.createReadStream(tmpPath)
        } else{
            ctx.status = 404
        }
    }
})

module.exports = router;
