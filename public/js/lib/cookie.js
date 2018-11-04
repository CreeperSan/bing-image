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


    // let tmpSaveCookieObject = {};
    // let tmpRawCookie = document.cookie;
    // let tmpCookie = tmpRawCookie.split(';');
    // // 统计编辑cookie
    // for (let i=0; i<tmpCookie.length; i++){
    //     const tmpCookieItemStr = tmpCookie[i].replace(' ', '');
    //     const tmpCookieItemSplit = tmpCookieItemStr.split('=');
    //     if (tmpCookieItemSplit.length = 2){ // 如果键值对合法
    //         const tmpKey = tmpCookieItemSplit[0];
    //         const tmpValue = tmpCookieItemSplit[1];
    //         if (tmpKey == cname){ // 如果这个Key已经存在了
    //             tmpSaveCookieObject[tmpKey] = cvalue;
    //         } else { // 如果这个 Key 不存在
    //             tmpSaveCookieObject[tmpKey] = tmpValue;
    //         }
    //         console.log('key=> '+tmpKey+'        value=>'+tmpValue)
    //     }
    // }
    // // 输出格式化的cookie
    // let cookieStr = '';
    // console.log('格式化输出');
    // const resultKeys = Object.keys(tmpSaveCookieObject);
    // resultKeys.forEach(((value, index, array) => {
    //     cookieStr = cookieStr + value + '='+tmpSaveCookieObject[value]+';';
    //     console.log(value + ' : ' + tmpSaveCookieObject[value]);
    // }));
    // if (resultKeys.length > 0){
    //     cookieStr.substring(0, cookieStr.length - 1)
    // }
    // // 保存cookie
    // // console.log(cookieStr)
    // document.cookie = cookieStr;
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
const _COOKIE_KEY_IS_ENABLE_LIKE = 'is_like_enable';   // 喜欢

const _COOKIE_KEY_DOWNLOAD = 'downloads';       // 下载

const _COOKIE_KEY_PAGE_ITEM_COUNT = 'page_item_count';  // 每页的加载数量
const _COOKIE_KEY_NAME = 'name';                        // 名称（其实没什么卵用)）


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







function setLikeEnableCookie(isEnable) {
    setCookie(_COOKIE_KEY_IS_ENABLE_LIKE, isEnable)
}

function isLikeEnabledCookie() {
    return getCookie(_COOKIE_KEY_IS_ENABLE_LIKE, true).toString() === 'true'
}

function getLikesCookie() {
    return getCookie(_COOKIE_KEY_LIKE, '').split(_COOKIE_OPERATION_SPLIT)
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

function setLikesRawCookie(itemRawString) {
    setCookie(_COOKIE_KEY_LIKE, itemRawString);
}

function addLikesCookie(itemDate) {
    let a = getLikesCookie();
    a.push(itemDate);
    setLikesListCookie(a);
}

function clearLikesCookie() {
    setCookie(_COOKIE_KEY_LIKE, '');
}






function setPageItemCountCookie(pageItemCount) {
    setCookie(_COOKIE_KEY_PAGE_ITEM_COUNT, pageItemCount);
}

function getPageItemCountCookie() {
    return getCookie(_COOKIE_KEY_PAGE_ITEM_COUNT, 12);
}




function setNameCookie(name) {
    setCookie(_COOKIE_KEY_NAME, name)
}

function getNameCookie() {
    return getCookie(_COOKIE_KEY_NAME, '')
}

