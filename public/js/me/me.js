
const DIALOG_FLAG_NONE = 0;
const DIALOG_FLAG_CLEAR_COLLECTION = 1;
const DIALOG_FLAG_CLEAR_LIKE = 2;
const DIALOG_FLAG_CLEAR_DOWNLOAD = 3;
const DIALOG_FLAG_PAGE_ITEM_COUNT = 4;
const DIALOG_FLAG_NAME = 5;

let dialogFlag = DIALOG_FLAG_NONE;

const checkboxCollection = document.getElementById('checkboxCollection');
const checkboxLike = document.getElementById('checkboxLike');

const dialogTitle = document.getElementById('dialogTitle');
const dialogContentSimpleText = document.getElementById('dialogContentText');
const dialogContentEditText = document.getElementById('dialogContentEditText');
const dialogContentPageItemCount = document.getElementById('dialogContentPageItemCount');
const dialogActionDiv = document.getElementById('dialogActionDiv');

function showDialog(isShow) {
    if (isShow){
        document.getElementById('dialogRootDiv').style.display = 'flex';
    }else{
        document.getElementById('dialogRootDiv').style.display = 'none';
    }
}

function initDialog() {
    switch (dialogFlag) {
        case DIALOG_FLAG_CLEAR_COLLECTION:
            dialogContentEditText.style.display = 'none';
            dialogContentPageItemCount.style.display = 'none';
            dialogActionDiv.style.display = 'flex';
            dialogContentSimpleText.style.display = 'flex';
            dialogTitle.innerText = '重置收藏记录';
            dialogContentSimpleText.innerText = '您确定要删除所有的收藏记录吗？此操作不可逆';
            break;
        case DIALOG_FLAG_CLEAR_LIKE:
            dialogContentEditText.style.display = 'none';
            dialogContentPageItemCount.style.display = 'none';
            dialogActionDiv.style.display = 'flex';
            dialogContentSimpleText.style.display = 'flex';
            dialogTitle.innerText = '重置喜欢记录';
            dialogContentSimpleText.innerText = '您确定要删除所有的喜欢记录吗？此操作不可逆';
            break;
        case DIALOG_FLAG_CLEAR_DOWNLOAD:
            dialogContentEditText.style.display = 'none';
            dialogContentPageItemCount.style.display = 'none';
            dialogActionDiv.style.display = 'flex';
            dialogContentSimpleText.style.display = 'flex';
            dialogTitle.innerText = '重置下载记录';
            dialogContentSimpleText.innerText = '您确定要删除所有的下载记录吗？此操作不可逆';
            break;
        case DIALOG_FLAG_PAGE_ITEM_COUNT:
            dialogContentEditText.style.display = 'none';
            dialogContentPageItemCount.style.display = 'flex';
            dialogActionDiv.style.display = 'none';
            dialogContentSimpleText.style.display = 'flex';
            dialogTitle.innerText = '设置每页显示壁纸数量';
            break;
        case DIALOG_FLAG_NAME :
            dialogContentEditText.style.display = 'flex';
            dialogContentPageItemCount.style.display = 'none';
            dialogActionDiv.style.display = 'flex';
            dialogContentSimpleText.style.display = 'flex';
            dialogTitle.innerText = '设置昵称';
            break;
    }
}

function onClearCollectionClick() {
    dialogFlag = DIALOG_FLAG_CLEAR_COLLECTION;
    initDialog();
    showDialog(true);
}

function onClearLikeClick() {
    dialogFlag = DIALOG_FLAG_CLEAR_LIKE;
    initDialog();
    showDialog(true);
}

function onClearDownloadClick() {
    dialogFlag = DIALOG_FLAG_CLEAR_DOWNLOAD;
    initDialog();
    showDialog(true);
}

function onPageItemCountClick(){
    dialogFlag = DIALOG_FLAG_PAGE_ITEM_COUNT;
    initDialog();
    showDialog(true);
}

function onNameClick() {
    dialogFlag = DIALOG_FLAG_NAME;
    initDialog();
    showDialog(true);
}

function onDialogCancelClick() {
    showDialog(false);
    dialogFlag = DIALOG_FLAG_NONE;
    initDialog();
}

function onDialogConfirmClick() {
    showDialog(false);
    dialogFlag = DIALOG_FLAG_NONE;
    initDialog();
}







function onCheckboxCollectionClick() {
    checkboxCollection.checked = !checkboxCollection.checked;
    setCollectionEnableCookie(checkboxCollection.checked);
}

function onCheckboxLikeClick() {
    checkboxLike.checked = !checkboxLike.checked;
    setLikeEnableCookie(checkboxLike.checked)
}







function initSelection() {
    checkboxCollection.checked = isCollectionEnableCookie();
    checkboxLike.checked = isLikeEnabledCookie();

}

initSelection();
