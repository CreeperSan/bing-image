let randomApp = new Vue({
    el: '#randomApp',
    mounted: function () {
        this.getAndLoadRandomImage();
    },
    data() {
        return {
            // 常量
            SIZE_1920X1200  :0  ,
            SIZE_1920x1080  :1  ,
            SIZE_1366x768   :2  ,
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
            imgID : ''
        }
    },
    methods: {
        getAndLoadRandomImage: function () {
            const self = this;
            axios.get('/api/v1/random?id='+self.imgID).then((response) => {
                if (response.status === 200) {
                    console.log(response.data);
                    const tmpRandomData = response.data.data[0];
                    if (tmpRandomData) {
                        self.imgTitle = tmpRandomData.title;
                        self.imgLocation = tmpRandomData.location;
                        self.imgExtra = tmpRandomData.author;
                        self.imgID = tmpRandomData.date;
                        self.imgUrl = tmpRandomData.img_url;

                        document.getElementById('randomImageView').style.background = 'url('+self.getImageDownloadLink(self.imgID)+') center center';
                        document.getElementById('randomImageView').style.backgroundSize = 'cover';
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
        }
    }
});