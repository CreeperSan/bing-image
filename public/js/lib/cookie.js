/**
 *
 * 使用 , 隔开各项item
 *
 */

/* 基础cookie操作方法 */

function setCookie(cname,cvalue,exdays=365*100)
{
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname, defaultValue=undefined)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++)
    {
        var c = ca[i].trim();
        if (c.indexOf(name)===0){
            let tmpValue = c.substring(name.length,c.length);
            if (tmpValue === undefined && defaultValue !== undefined){
                return defaultValue
            }
            return tmpValue === 'true'
        }
    }
    return defaultValue;
}

/* 其他跟cookie操作函数 */

const _COOKIE_OPERATION_SPLIT = ',';            // 列表的分隔符

const _COOKIE_KEY_COLLECTION = 'collections';   // 收藏
const _COOKIE_KEY_IS_ENABLE_LIKE = 'is_likes_enable';   // 收藏

const _COOKIE_KEY_LIKE = 'likes';   // 喜欢
const _COOKIE_KEY_IS_ENABLE_COLLECTION = 'is_collections_enable';   // 喜欢

const _COOKIE_KEY_DOWNLOAD = 'downloads';       // 下载

const _COOKIE_KEY_PAGE_ITEM_COUNT = 'page_item_count';  // 每页的加载数量
const _COOKIE_KEY_NAME = 'name';                        // 名称（其实没什么卵用)）




function setCollectionEnableCookie(isEnable) {
    setCookie(_COOKIE_KEY_IS_ENABLE_COLLECTION, isEnable)
}

function isCollectionEnableCookie() {
    return getCookie(_COOKIE_KEY_IS_ENABLE_COLLECTION, true)
}

function getCollectionCookie() {
    return getCookie(_COOKIE_KEY_COLLECTION).split(_COOKIE_OPERATION_SPLIT)
}

function setCollectionListCookie(itemDates) {
    let tmpResultStr = '';
    if (itemDates.length > 0){
        itemDates.forEach((value, index, array) => {
            tmpResultStr = tmpResultStr+value+','
        });
    }
    setCookie(_COOKIE_KEY_COLLECTION, tmpResultStr.substring(0, tmpResultStr.length - 1));
}

function addCollectionCookie(itemDate) {
    setCollectionListCookie(getCollectionCookie().push(itemDate));
}

function clearCollectionCookie() {
    setCookie(_COOKIE_KEY_COLLECTION, '');
}





function getDownloadListCookie() {
    return getCookie(_COOKIE_KEY_DOWNLOAD).split(_COOKIE_OPERATION_SPLIT)
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
    return getCookie(_COOKIE_KEY_IS_ENABLE_LIKE, true)
}

function getLikesCookie() {
    return getCookie(_COOKIE_KEY_LIKE).split(_COOKIE_OPERATION_SPLIT)
}

function setLikesListCookie(itemDates) {
    let tmpResultStr = '';
    if (itemDates.length > 0){
        itemDates.forEach((value, index, array) => {
            tmpResultStr = tmpResultStr+value+','
        });
    }
    setCookie(_COOKIE_KEY_LIKE, tmpResultStr.substring(0, tmpResultStr.length - 1));
}

function addLikesCookie(itemDate) {
    setLikesListCookie(getCollectionCookie().push(itemDate))
}

function clearLikesCookie() {
    setCookie(_COOKIE_KEY_LIKE, '');
}






function setPageItemCountCookie(pageItemCount) {
    setCookie(_COOKIE_KEY_PAGE_ITEM_COUNT, isEnable)
}

function getPageItemCountCookie() {
    getCookie(_COOKIE_KEY_PAGE_ITEM_COUNT)
}




function setNameCookie(name) {
    setCookie(_COOKIE_KEY_NAME, isEnable)
}

function getNameCookie() {
    getCookie(_COOKIE_KEY_NAME)
}

