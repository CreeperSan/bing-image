function isIE() {
    if(!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;
}

if (isIE()){
    window.location.href = "/error/browser-not-support"
}