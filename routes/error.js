const router = require('koa-router')();

router.prefix('/error');

router.get('/browser-not-support', async (ctx, next) => {
    await ctx.render('error/browser-not-support',{})
});


router.get('/404', async (ctx, next) => {
    await ctx.render('error/404',{})
});


router.get('/500', async (ctx, next) => {
    await ctx.render('error/500',{})
});

module.exports = router;
