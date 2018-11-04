const STATE_LIKE = 0;
const STATE_DISLIKE = 1;
const STATE_DISABLE = -1;
const STATE_LOADING = 2;

function setLikeState(state){
    const likeButton = document.getElementById('randomLikeButton');
    const likeDiv = document.getElementById('randomLikeDiv');
    switch (state) {
        case STATE_LIKE:
            likeDiv.style.display = 'flex';
            likeButton.style.opacity = 1;
            likeButton.src = '/icon/ic_like_red.png';
            break;
        case STATE_DISLIKE:
            likeDiv.style.display = 'flex';
            likeButton.style.opacity = 1;
            likeButton.src = '/icon/ic_like_white.png';
            break;
        case STATE_DISABLE:
            likeDiv.style.display = 'none';
            break;
        case STATE_LOADING:
            likeDiv.style.display = 'flex';
            likeButton.style.opacity = 0.3;
            likeButton.src = '/icon/ic_like_white.png';
            break;
    }
    if (state){
    } else {
    }
}

let randomApp = new Vue({
    el: '#randomApp',
    data() {
        return {
            // 常量
            SIZE_1920X1200  :0  ,
            SIZE_1920x1080  :1  ,
            SIZE_1366x726   :2  ,
            SIZE_1280x720   :3  ,
            SIZE_1024x768   :4  ,
            SIZE_800x600    :6  ,
            SIZE_800x480    :7  ,
            SIZE_640x480    :8  ,
            SIZE_400x240    :9  ,
            SIZE_320x240    :10 ,
            SIZE_1080x1920  :11 ,
            SIZE_768x1366   :12 ,
            SIZE_768x1280   :13 ,
            SIZE_720x1280   :14 ,
            SIZE_480x800    :15 ,
            SIZE_480x640    :16 ,
            SIZE_240x400    :17 ,
            SIZE_240x320    :18 ,

            imgTitle: '',
            imgLocation: '',
            imgExtra: '',
            imgUrl: '#66ccff',
            imgID : '',

            isDataLoadFinish : false
        }
    },
    methods: {
        getAndLoadRandomImage: function () {
            const self = this;
            self.isDataLoadFinish = false;
            setLikeState(STATE_LOADING);
            axios.get('/api/v1/random?id='+self.imgID).then((response) => {
                if (response.status === 200) {
                    const tmpRandomData = response.data.data[0];
                    if (tmpRandomData) {
                        self.imgTitle = tmpRandomData.title;
                        self.imgLocation = tmpRandomData.location;
                        self.imgExtra = tmpRandomData.author;
                        self.imgID = tmpRandomData.date;
                        self.imgUrl = tmpRandomData.img_url;

                        document.getElementById('randomImageView').style.background = 'url('+self.getImageDownloadLink(self.imgID)+') center center';
                        document.getElementById('randomImageView').style.backgroundSize = 'cover';

                        self.isDataLoadFinish = true;
                        self.refreshLikeState();
                    }
                } else {
                    alert('获取失败，请刷新页面')
                }
            }).catch((err) => {
                alert('获取失败，请刷新页面')
            })
        },
        getImageDownloadLink(screenResolution){
            try {
                screenResolution = parseInt(screenResolution);
                if (screenResolution >=0 && screenResolution <= 18) {
                    return '/api/v1/download/'+this.imgID+'.jpg?size='+screenResolution;
                }
            }catch (e) {}
            return '/api/v1/download/'+this.imgID+'.jpg';
        },
        likeImage(){
            const self = this;
            if (self.isDataLoadFinish){
                // 先判断是否可以喜欢
                if (isLikeEnabledCookie()) {
                    const tmpLikeArray = getLikesCookie();
                    for (let i=0; i<tmpLikeArray.length; i++){
                        const currentItem = tmpLikeArray[i];
                        if (currentItem == self.imgID){ // 如果已经喜欢了这张图片
                            delete tmpLikeArray[i];
                            let tmpLikeArraySave = [];
                            for (let j=0; j<tmpLikeArray.length; j++){
                                if (tmpLikeArray[j] != undefined) {
                                    tmpLikeArraySave.push(tmpLikeArray[j]);
                                }
                            }
                            setLikesListCookie(tmpLikeArraySave);
                            self.refreshLikeState();
                            return;
                        }
                    }
                    // 如果还没有喜欢这张图片
                    addLikesCookie(self.imgID.toString());
                    self.refreshLikeState();
                }else{
                    alert('喜欢功能已关闭');
                }
            } else {
                alert('数据尚未加载完毕，请等候');
            }
        },
        refreshLikeState(){
            const self = this;
            if (isLikeEnabledCookie()){
                if (self.isDataLoadFinish){
                    const tmpLikeArray = getLikesCookie();
                    for (let i=0; i<tmpLikeArray.length; i++){
                        if (tmpLikeArray[i] == self.imgID){
                            setLikeState(STATE_LIKE);
                            return;
                        }
                    }
                    setLikeState(STATE_DISLIKE);
                } else {
                    setLikeState(STATE_LOADING);
                }
            } else{
                setLikeState(STATE_DISABLE);
            }
        }
    },
    mounted: function () {
        const self = this;
        self.refreshLikeState();
        self.getAndLoadRandomImage();
    }
});
