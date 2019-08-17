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

        let tmpYear;
        let tmpMonth;
        let tmpDay;
        try {
            tmpYear = item.year;
            tmpMonth = item.month;
            if (tmpMonth < 10){ tmpMonth = '0'+tmpMonth.toString() }
            tmpDay = item.day;
            if (tmpDay < 10){ tmpDay = '0'+tmpDay.toString() }
        }catch (e) {
            tmpYear = '2018';
            tmpMonth = '10';
            tmpDay = '20';
        }

        await ctx.render('view', {
            title : item.title,
            location : item.location,
            author : item.author,
            image_url : '/bing-image/'+tmpYear+'/'+tmpMonth+'/'+tmpDay+'/1920x1080.jpg',
            image_date : item._id
        });
    }else{
        await ctx.render('view-404');
    }
});


module.exports = router;
