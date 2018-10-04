const router = require('koa-router')()

router.prefix('/about')

router.get('/', async (ctx, next) => {
    await ctx.render('about',{
        
    })
})

module.exports = router
