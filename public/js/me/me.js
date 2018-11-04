
const DIALOG_FLAG_NONE = 0;
const DIALOG_FLAG_CLEAR_LIKE = 2;
const DIALOG_FLAG_CLEAR_DOWNLOAD = 3;
const DIALOG_FLAG_PAGE_ITEM_COUNT = 4;
const DIALOG_FLAG_NAME = 5;

let dialogFlag = DIALOG_FLAG_NONE;

const checkboxLike = document.getElementById('checkboxLike');

const dialogTitle = document.getElementById('dialogTitle');
const dialogContentSimpleText = document.getElementById('dialogContentText');
const dialogContentEditText = document.getElementById('dialogContentEditText');
const dialogContentPageItemCount = document.getElementById('dialogContentPageItemCount');
const dialogActionDiv = document.getElementById('dialogActionDiv');
const sectionViewPageItemCountOption = document.getElementById('dialogPageItemCountButton');
const nicknameSpan = document.getElementById('meNickName');
const nicknameOption = document.getElementById('meNicknameOption');

function showDialog(isShow) {
    if (isShow){
        document.getElementById('dialogRootDiv').style.display = 'flex';
    }else{
        document.getElementById('dialogRootDiv').style.display = 'none';
    }
}

function initDialog() {
    switch (dialogFlag) {
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
            dialogContentSimpleText.style.display = 'none';
            dialogTitle.innerText = '设置昵称';
            dialogContentEditText.value = getNameCookie();
            break;
    }
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
    onDialogClose(false);
    showDialog(false);
    dialogFlag = DIALOG_FLAG_NONE;
}

function onDialogConfirmClick() {
    onDialogClose(true);
    showDialog(false);
    dialogFlag = DIALOG_FLAG_NONE;
}

function onDialogItemClick(itemCounts) {
    setPageItemCountCookie(itemCounts);
    sectionViewPageItemCountOption.innerText = getPageItemCountCookie();
    showDialog(false)
}

function onCheckboxLikeClick() {
    checkboxLike.checked = !checkboxLike.checked;
    setLikeEnableCookie(checkboxLike.checked)
}


function onDialogClose(isPositive) {
    if (isPositive){
        switch (dialogFlag) {
            case DIALOG_FLAG_CLEAR_LIKE:
                clearLikesCookie();
                break;
            case DIALOG_FLAG_CLEAR_DOWNLOAD:
                clearDownloadCookie();
                break;
            case DIALOG_FLAG_NAME:
                setNameCookie(dialogContentEditText.value);
                refreshNickname();
                break;
        }
    }
}



function refreshNickname() {
    const tmpNickname = getNameCookie();
    if (tmpNickname !== ''){
        nicknameSpan.innerText = ',' + tmpNickname;
        nicknameOption.innerText = tmpNickname;
    }else{
        nicknameSpan.innerText = '';
        nicknameOption.innerText = '尚未设置';
    }
}


function initSelection() {
    checkboxLike.checked = isLikeEnabledCookie();
    sectionViewPageItemCountOption.innerText = getPageItemCountCookie();

    refreshNickname();

}

initSelection();

