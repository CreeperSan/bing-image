const router = require('koa-router')();

router.prefix('/me');

/**
 * 其他函数
 */

router.get('/', async (ctx, next) => {
    await ctx.render('me')
});

router.get('/collections', async (ctx, next) => {
    await ctx.render('collections')
});

router.get('/likes', async (ctx, next) => {
    await ctx.render('likes')
});

router.get('/downloads', async (ctx, next) => {
    await ctx.render('downloads')
});



module.exports = router;
