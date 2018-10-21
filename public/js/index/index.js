const STATE_LOADABLE = 0;
const STATE_LOADING = 1;
const STATE_FINISH = 2;
const STATE_FAIL = 3;

function setState(state){
    document.getElementById('actionJump').style.display = 'none';
    document.getElementById('actionLoading').style.display = 'none';
    document.getElementById('actionFinish').style.display = 'none';
    document.getElementById('actionImageList').style.display = 'none';
    switch (state) {
        case STATE_LOADABLE:{
            document.getElementById('actionJump').style.display = 'flex';
            document.getElementById('actionImageList').style.display = 'flex';
            break;
        }
        case STATE_LOADING:{
            document.getElementById('actionJump').style.display = 'flex';
            document.getElementById('actionLoading').style.display = 'flex';
            break;
        }
        case STATE_FAIL:{
            document.getElementById('actionJump').style.display = 'flex';
            document.getElementById('actionLoading').style.display = 'flex';
            break;
        }
        case STATE_FINISH:{
            document.getElementById('actionFinish').style.display = 'flex';
            break;
        }
    }
}

function showPrevButton(isShow){
    if (isShow){
        document.getElementById('indexJumpPrev').style.display = 'flex'
    } else {
        document.getElementById('indexJumpPrev').style.display = 'none'
    }
}

function showNextButton(isShow){
    if (isShow){
        document.getElementById('indexJumpNext').style.display = 'flex'
    } else {
        document.getElementById('indexJumpNext').style.display = 'none'
    }
}

const imgApp = new Vue({
    el : '#app',
    data : {
        bigImageID : '',
        imageList : [],
        page : 1,
        pageCount : 12,
        pageTotal : 1,
        isLoading : false
    },
    mounted : function(){
        this.getAndRefreshData();
        this.onRefreshPageButton();
    },
    methods : {
        getTimeFromImage(image){
            return image.year+'/'+image.month+'/'+image.day;
        },
        onImageItemDivClick(image){
            this.bigImageID = image.id;
            window.open('/view/'+image.id);
        },
        async getAndRefreshData(){
            const self = this;
            self.isLoading = true;
            setState(STATE_LOADING);
            axios.get('/api/v1/url?page='+this.page+'&count='+this.pageCount).then((response) => {
                if (response.data.flag == 200){
                    const tmpData = response.data.data;
                    self.imageList = tmpData.imgList;
                    self.pageTotal = Math.ceil(tmpData.itemCount / self.pageCount);
                    setState(STATE_LOADABLE);
                } else {
                    setState(STATE_FAIL);
                }
                self.isLoading = false;
                self.onRefreshPageButton();
            }).catch((err) => {
                setState(STATE_FAIL);
                self.isLoading = false;
                self.onRefreshPageButton();
            })
        },
        onNextPageClick(){
            if (this.page < this.pageTotal && this.page > 0){
                this.page += 1;
                this.onRefreshPageButton();
                this.getAndRefreshData();
            }
        },
        onPrevPageClick(){
            if (this.page <= this.pageTotal && this.page > 1){
                this.page -= 1;
                this.onRefreshPageButton();
                this.getAndRefreshData();
            }
        },
        onRefreshPageButton(){
            showPrevButton(this.page > 1);
            showNextButton(this.page < this.pageTotal);
            if (this.page < 1){
                this.page = 1;
            }
            if (this.page > this.pageTotal) {
                this.page = this.pageTotal;
            }
        },
        onPageClick(){
            let pageNum = document.getElementById('indexPageInput').value;
            if (!pageNum) { pageNum = 1; }
            parseInt(pageNum);
            this.page = pageNum;
            this.getAndRefreshData();
        },
        getLocalImage(image){
            let tmpMonth = image.month;
            let tmpDay = image.day;

            if (tmpMonth < 10){ tmpMonth='0'+tmpMonth.toString() }
            if (tmpDay < 10){ tmpDay='0'+tmpDay.toString() }

            return '/bing-image/'+image.year+'/'+tmpMonth+'/'+tmpDay+'/1920x1080.jpg'
        }
    }
});

function setupViewContent(imgUrl, title, loaction, extra) {
    document.getElementById('viewRootDiv').style.background = 'url('+imgUrl+') center';
    document.getElementById('viewTitle').innerText = title;
    document.getElementById('viewLocation').innerText = loaction;
    document.getElementById('viewExtra').innerText = extra;
}

function downloadBigImage() {
    let tmpSize = document.getElementById('imageSizeSelect').value
    try {
        tmpSize = parseInt(tmpSize)
        if (tmpSize >= 0 && tmpSize <18){ location.href = '/api/v1/download/'+imgApp.bigImageID+'.jpg?size='+tmpSize }
        return
    }catch (e) {}
    location.href = '/api/v1/download/'+imgApp.bigImageID+'.jpg?size='+tmpSize
}

function showView(state) {
    if (state){
        document.getElementById('viewRootDiv').style.display = 'block'
    } else{
        document.getElementById('viewRootDiv').style.display = 'none'
    }
}

function onViewCloseClick() {
    showView(false)
}