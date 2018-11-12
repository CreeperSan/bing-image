/**
 *
 * 使用 , 隔开各项item
 *
 */

/* 基础cookie操作方法 */

function setCookie(cname,cvalue,exdays=365*100) {
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname, defaultValue='') {
    var name = cname + "=";
    let cookieStr = document.cookie.toString();
    cookieStr = cookieStr.replace(' ', '');
    var ca = cookieStr.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name)===0){
            let tmpValue = c.substring(name.length,c.length);
            if (tmpValue === undefined && defaultValue !== undefined){
                return defaultValue
            }
            return tmpValue
        }
    }
    return defaultValue;
}

/* 其他跟cookie操作函数 */

const _COOKIE_OPERATION_SPLIT = ',';            // 列表的分隔符

const _COOKIE_KEY_LIKE = 'like';   // 喜欢
const _COOKIE_KEY_LIKE_HIDDEN = 'like_hidden';   // 喜欢用于记录喜欢过的，防止重复喜欢的时候重复发送喜欢的请求
const _COOKIE_KEY_IS_ENABLE_LIKE = 'is_like_enable';   // 喜欢

const _COOKIE_KEY_DOWNLOAD = 'downloads';       // 下载

const _COOKIE_KEY_PAGE_ITEM_COUNT = 'page_item_count';  // 每页的加载数量
const _COOKIE_KEY_NAME = 'name';                        // 名称（其实没什么卵用)）


/***********************
 *  下载部分
 */

function getDownloadListCookie() {
    return getCookie(_COOKIE_KEY_DOWNLOAD, '').split(_COOKIE_OPERATION_SPLIT)
}

function setDownloadCookies(itemDates) {
    let tmpResultStr = '';
    if (itemDates.length > 0){
        itemDates.forEach((value, index, array) => {
            tmpResultStr = tmpResultStr+value+','
        });
    }
    setCookie(_COOKIE_KEY_DOWNLOAD, tmpResultStr.substring(0, tmpResultStr.length - 1));
}

function addDownloadCookies(itemDate) {
    setDownloadCookies(getCollectionCookie().push(itemDate));
}

function clearDownloadCookie() {
    setCookie(_COOKIE_KEY_DOWNLOAD, '');
}





/***********************
 *  喜欢部分
 */


function setLikeEnableCookie(isEnable) {
    setCookie(_COOKIE_KEY_IS_ENABLE_LIKE, isEnable)
}

function isLikeEnabledCookie() {
    return getCookie(_COOKIE_KEY_IS_ENABLE_LIKE, true).toString() === 'true'
}

function getLikesCookie() {
    let tmpResult = [];
    getCookie(_COOKIE_KEY_LIKE, '').split(_COOKIE_OPERATION_SPLIT).forEach(((value) => {
        if (value.toString().length===8 && !isNaN(value) && value>20000000 && value<30000000){
            tmpResult.push(value);
        }
    }));
    return tmpResult;
}

function setLikesListCookie(itemDates) {
    let tmpResultStr = '';
    if (itemDates.length > 0){
        itemDates.forEach((value, index, array) => {
            tmpResultStr = tmpResultStr+value+','
        });
    }
    tmpResultStr = tmpResultStr.substring(0, tmpResultStr.length - 1);
    setCookie(_COOKIE_KEY_LIKE, tmpResultStr);
}

function addLikesCookie(itemDate) {
    let a = getLikesCookie();
    for (let i=0;i<a.length;i++){
        let tmpItemData = a[i];
        if (tmpItemData == itemDate){
            return;
        }
    }
    a.push(itemDate);
    setLikesListCookie(a);
    // 顺手也给隐藏的也添加了
    addHiddenLikesCookie(itemDate);
}

function removeLikesCookie(itemData) {
    let a = getLikesCookie();
    a.forEach((value, index, array) => {
       if (value == itemData){
           delete array[index];
       }
    });
    let b = [];
    a.forEach(((value, index, array) => {
        if (value.toString().length===8 && !isNaN(value) && value>20000000 && value<30000000){
            b.push(value);
        }
    }));
    setLikesListCookie(b);
    // 这里就不remove隐藏的了
}

function clearLikesCookie() {
    setCookie(_COOKIE_KEY_LIKE, '');
}





/***********************
 *  隐藏的喜欢部分，用于区分是否需要发送喜欢+1到服务器
 */

function _getHiddenLikesCookie() {
    let tmpResult = [];
    getCookie(_COOKIE_KEY_LIKE_HIDDEN, '').split(_COOKIE_OPERATION_SPLIT).forEach(((value) => {
        if (value.toString().length===8 && !isNaN(value) && value>20000000 && value<30000000){
            tmpResult.push(value);
        }
    }));
    return tmpResult;
}

function _setHiddenLikesListCookie(itemDates) {
    let tmpResultStr = '';
    if (itemDates.length > 0){
        itemDates.forEach((value, index, array) => {
            tmpResultStr = tmpResultStr+value+','
        });
    }
    tmpResultStr = tmpResultStr.substring(0, tmpResultStr.length - 1);
    setCookie(_COOKIE_KEY_LIKE_HIDDEN, tmpResultStr);
}

function addHiddenLikesCookie(itemDate) {
    let a = _getHiddenLikesCookie();
    for (let i=0;i<a.length;i++){
        let tmpItemData = a[i];
        if (tmpItemData == itemDate){
            return;
        }
    }
    a.push(itemDate);
    _setHiddenLikesListCookie(a);
}

function removeHiddenLikesCookie(itemData) {
    let a = _getHiddenLikesCookie();
    a.forEach((value, index, array) => {
       if (value == itemData){
           delete array[index];
       }
    });
    let b = [];
    a.forEach(((value, index, array) => {
        if (value.toString().length===8 && !isNaN(value) && value>20000000 && value<30000000){
            b.push(value);
        }
    }));
    _setHiddenLikesListCookie(b);
}

function clearLikesCookie() {
    setCookie(_COOKIE_KEY_LIKE_HIDDEN, '');
}

function isNeedSendLikeRequestToServerCookie(itemData) {
    if (value.toString().length!==8 || isNaN(value) || value<20000000 || value>30000000){
        return false;
    }
    let tmpHiddenLikeList = _getHiddenLikesCookie();
    for(let i=0;i<tmpHiddenLikeList.length;i++){
        let tmpItem = tmpHiddenLikeList[i];
        if (tmpItem == itemData){
            return false
        }
    }
    return true;
}




/***********************
 *  每页数量部分
 */


function setPageItemCountCookie(pageItemCount) {
    setCookie(_COOKIE_KEY_PAGE_ITEM_COUNT, pageItemCount);
}

function getPageItemCountCookie() {
    return getCookie(_COOKIE_KEY_PAGE_ITEM_COUNT, 12);
}


/***********************
 *  名称部分
 */


function setNameCookie(name) {
    setCookie(_COOKIE_KEY_NAME, name)
}

function getNameCookie() {
    return getCookie(_COOKIE_KEY_NAME, '')
}

