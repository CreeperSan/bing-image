const router = require('koa-router')();

router.prefix('/versions');

router.get('/', async (ctx, next) => {
    await ctx.render('versions',{
        
    })
});

module.exports = router;
