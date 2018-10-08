const tmpStr = '第26届叠人塔大赛的选手们， 西班牙塔拉戈纳 (© Xinhua/Pau Barrena/Getty Images)'



console.log(
    tmpStr.substr( tmpStr.indexOf('，')+1, tmpStr.lastIndexOf('(')-tmpStr.indexOf('，')-1 ).replace(' ','')
)