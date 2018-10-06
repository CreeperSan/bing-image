const router = require('koa-router')();

router.prefix('/document');

router.get('/', async (ctx, next) => {
    await ctx.render('document',{
        
    })
});

module.exports = router;
