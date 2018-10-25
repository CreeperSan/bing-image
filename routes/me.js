const router = require('koa-router')();

router.prefix('/me');

/**
 * 其他函数
 */

router.get('/', async (ctx, next) => {
    await ctx.render('me')
});


module.exports = router;
