const router = require('koa-router')()
const request = require('request')

router.prefix('/api/v1')

const CODE_SUCCESS = 200
const CODE_SERVER_ERROR = 500

const URL_BING_IMAGE = 'http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1';
const URL_BING_PREFIX = 'http://cn.bing.com'

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
      if(err) reject(err)
      resolve(body)
    })
  })
}

/**
 * 下面才是路由处理
 */

router.get('/url-current', async (ctx, next) => {
    try{
        let getStr = await httpGet(URL_BING_IMAGE)
        let getJson = JSON.parse(getStr).images[0]
        ctx.body = createResponse(CODE_SUCCESS, {
        url : URL_BING_PREFIX+getJson.url,
        copyright : getJson.copyright,
        copyright_link : getJson.copyrightlink,
        start_date : getJson.startdate,
        end_date : getJson.enddate
        })
    }catch(e){
        ctx.body = createResponse(CODE_SERVER_ERROR)
    }
})

router.get('/img-current', async (ctx, next) => {
    const tmpImgUrl = URL_BING_PREFIX + JSON.parse(await httpGet(URL_BING_IMAGE)).images[0].url
    ctx.body = request(tmpImgUrl)
})

module.exports = router
