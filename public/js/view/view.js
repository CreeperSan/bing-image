
function onImageDownloadButtonClick() {
    const downloadSizeValue = document.getElementById('downloadSelect').value;
    location.href = '/api/v1/download/'+imageDate+'.jpg?size='+downloadSizeValue;
}

function onBackClick() {
    window.close();
}