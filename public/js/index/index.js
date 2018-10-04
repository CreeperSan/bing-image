// 数据储存的格式
/**
 * ImageItem : {
 *      bigImage : 大图地址
 *      thumbnailImage : 缩略图地址
 *      title : 标题名称
 *      location : 地址
 *      time : 时间
 * }
 * 
 */

let imgApp;




imgApp = new Vue({
    el : '#app',
    data : {
        STATE_IDLE : 0,
        STATE_LOADING : 1,
        STATE_FAIL : 2,
        STATE_FINSIH : 3,

        state : this.STATE_IDLE,
        imageList : []
    },
    mounted : function(){
        this.state = this.STATE_LOADING
        setTimeout(() => {
            for(let i=0;i<10;i++){
                this.imageList.push({
                    bigImage : 'https://cn.bing.com//az/hprichbg/rb/TheLongWalk_ZH-CN11094733779_320x240.jpg',
                    thumbnailImge : 'https://cn.bing.com//az/hprichbg/rb/TheLongWalk_ZH-CN11094733779_320x240.jpg',
                    title : '图片'+i,
                    location : '中国',
                    time : '2018-09-02'
                })
            }
            this.state = this.STATE_IDLE
        }, 1000);
    },
    methods : {

    }
})
