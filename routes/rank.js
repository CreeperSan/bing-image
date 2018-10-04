const router = require('koa-router')()

router.prefix('/rank')

/**
 * 其他函数
 */

function createResponse(data={}){
    return JSON.stringify({
        flag : 200,
        data : data
    })
}

function getDownloadRank(){
    return {
        title : '下载排行榜',
        items : [
            { 
                name : '黑脉金斑蝶大迁徙，墨西哥米却肯州',
                link : '#'
            },{ 
                name : '黑脉金斑蝶大迁徙，墨西哥米却肯州',
                link : '#'
            },{ 
                name : '黑脉金斑蝶大迁徙，墨西哥米却肯州',
                link : '#'
            },{ 
                name : '黑脉金斑蝶大迁徙，墨西哥米却肯州',
                link : '#'
            },{ 
                name : '黑脉金斑蝶大迁徙，墨西哥米却肯州',
                link : '#'
            },{ 
                name : '黑脉金斑蝶大迁徙，墨西哥米却肯州',
                link : '#'
            },{ 
                name : '黑脉金斑蝶大迁徙，墨西哥米却肯州',
                link : '#'
            },{ 
                name : '黑脉金斑蝶大迁徙，墨西哥米却肯州',
                link : '#'
            },{ 
                name : '黑脉金斑蝶大迁徙，墨西哥米却肯州',
                link : '#'
            }
        ]
    }
}

function getRank(rankName){
    return getDownloadRank();
}

function getRankList(){
    return [ {
        name : 'download',
        title : '下载排行榜'
    },{
        name : 'like',
        title : '喜欢排行榜'
    },{
        name : 'click',
        title : '点击排行榜'
    }]
}




router.get('/', async (ctx, next) => {
    await ctx.render('rank')
})

router.post('/', async(ctx, next) => {
    let returnJson = []
    getRankList().forEach( (value, index, array) => {
        let tmpJson = {}
        tmpJson.name = value.name
        tmpJson.rank = getRank(value.name)
        returnJson.push(tmpJson)
    } )
    ctx.body = createResponse(returnJson)
})

router.post('/rank-list', async (ctx,next) => {
    ctx.body = createResponse(getRankList())
})

router.post('/rank-content', async(ctx, next) => {
    
})

router.post('/', async (ctx, next) => {

})

module.exports = router
