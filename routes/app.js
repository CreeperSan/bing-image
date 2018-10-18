const router = require('koa-router')();

router.prefix('/app');

router.get('/', async (ctx, next) => {
    await ctx.render('app',{
        
    })
});

module.exports = router;
