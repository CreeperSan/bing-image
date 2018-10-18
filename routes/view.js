const router = require('koa-router')();
const database = require(process.cwd()+'/lib/database');

router.prefix('/view');

/**
 * 其他函数
 */

router.get('/:id', async (ctx, next) => {
    let id = ctx.params.id;
    // id仅接受数字
    try{
        id = parseInt(id).toString()
    } catch (e) {
        await ctx.render('view-404');
        return;
    }

    // id仅接受8位数字
    if (id.toString().length !== 8){
        await ctx.render('view-404');
        return;
    }

    const queryResult = await database.getBingImageByID(id);

    if (queryResult.success && queryResult.result.length === 1){
        const item = queryResult.result[0];
        console.log(item);

        await ctx.render('view', {
            title : item.title
        });
    }else{
        await ctx.render('view-404');
    }
});


module.exports = router;
