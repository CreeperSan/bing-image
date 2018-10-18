const router = require('koa-router')();

router.prefix('/rank');

/**
 * 其他函数
 */

router.get('/', async (ctx, next) => {
    await ctx.render('rank')
});


module.exports = router;
