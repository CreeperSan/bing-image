const router = require('koa-router')();

router.prefix('/random');

router.get('/', async (ctx, next) => {
    await ctx.render('random',{
        
    })
});

module.exports = router;
