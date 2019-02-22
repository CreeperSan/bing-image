const mysql = require('mysql');
const process = require('process');
const config = require(process.cwd()+'/config');

const TABLE_BING_IMAGE = "BingImage";
const KEY_BING_IMAGE_ID = "_id";
const KEY_BING_IMAGE_YEAR = "year";
const KEY_BING_IMAGE_MONTH = "month";
const KEY_BING_IMAGE_DAY = "day";
const KEY_BING_IMAGE_COPYRIGHT = "copyright";
const KEY_BING_IMAGE_PATH = "path";
const KEY_BING_IMAGE_TITLE = 'title';
const KEY_BING_IMAGE_LOCATION = 'location';
const KEY_BING_IMAGE_SOURCE = 'author';
const KEY_BING_IMAGE_JSON = 'json';

const SQL_BING_CREATE_TABLE = 'create table if not exists '+TABLE_BING_IMAGE+'(' +
    KEY_BING_IMAGE_ID + ' int not null primary key ,' +
    KEY_BING_IMAGE_YEAR + ' int not null ,' +
    KEY_BING_IMAGE_MONTH + ' int not null ,' +
    KEY_BING_IMAGE_DAY + ' int not null ,' +
    KEY_BING_IMAGE_COPYRIGHT + ' varchar(1024) character set utf8 not null ,' +
    KEY_BING_IMAGE_SOURCE + ' varchar(1024) character set utf8 not null ,' +
    KEY_BING_IMAGE_PATH + ' varchar(1024) character set utf8 not null,' +
    KEY_BING_IMAGE_TITLE + ' varchar(1024) character set utf8 not null,' +
    KEY_BING_IMAGE_LOCATION + ' varchar(1024) character set utf8 not null,' +
    KEY_BING_IMAGE_JSON + ' text character set utf8 not null' +
    ')';

const SQL_BING_INSERT = 'replace into '+TABLE_BING_IMAGE+'(' +
    KEY_BING_IMAGE_ID+','+KEY_BING_IMAGE_YEAR+','+KEY_BING_IMAGE_MONTH+','+KEY_BING_IMAGE_DAY+','+KEY_BING_IMAGE_COPYRIGHT+','+KEY_BING_IMAGE_SOURCE+','+KEY_BING_IMAGE_PATH+','+KEY_BING_IMAGE_TITLE+','+KEY_BING_IMAGE_LOCATION+','+KEY_BING_IMAGE_JSON+
    ') values(?,?,?,?,?,?,?,?,?,?)';

const SQL_BING_QUERY = 'select * from '+TABLE_BING_IMAGE+' order by '+KEY_BING_IMAGE_ID+' desc limit ? offset ?';

const SQL_BING_QUERY_RANDOM = 'select * from '+TABLE_BING_IMAGE+' where '+KEY_BING_IMAGE_ID+'!= ? order by rand() limit ?';

const SQL_BING_QUERY_LINE_COUNT = 'select count('+KEY_BING_IMAGE_ID+') from '+TABLE_BING_IMAGE;

const SQL_BING_QUERY_ONE_BY_ID = 'select * from '+TABLE_BING_IMAGE+' where '+KEY_BING_IMAGE_ID+' = ? order by '+KEY_BING_IMAGE_ID+' limit 1';

const ERROR_CODE_NOT_INIT = 0;
const ERROR_CODE_SQL_ERROR = 1;
const ERROR_CODE_SUCCESS = 100;


let db = null;

/**
 *  初始化数据库表
 */

function checkDatabaseTable() {
    if (db){
        db.query(SQL_BING_CREATE_TABLE, [], (err, result) => {
            if (err){
                console.log(SQL_BING_CREATE_TABLE);
                console.log('【必应壁纸】数据库建立表失败！');
                console.log(err);
                process.exit();
            }
        })
    } else{
        console.log('【必应壁纸】数据库建立连接失败！');
        process.exit();
    }
}


/**
 *  建立数据库连接
 */
function openConnection() {
    if (db) {
        db.end((err) => {
            if (err){
                console.log('【必应壁纸】 关闭数据库连接失败！');
                process.exit();
            } else{
                console.log('【必应壁纸】 已关闭数据库连接')
            }
        })
    }
    db = mysql.createConnection({
        host : config.database_host,
        user : config.database_user,
        password : config.database_password,
        database : config.database_name
    });
    db.on('error', (err) => {
        db = null;
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            openConnection();
        }else{
            throw err;
        }}
    )

}

/**
 * 插入必应壁纸到数据库
 * @param id
 * @param year
 * @param month
 * @param day
 * @param copyright
 * @param path
 * @param title
 * @param location
 * @returns {Promise<any>}
 */
function insertBing(id,year, month, day, copyright, source, path, title, location, json) {
    return new Promise((resolve, reject) => {
        if (db){
            db.query(SQL_BING_INSERT, [id, year, month, day, copyright, source, path, title, location, json], (err, result) => {
                if (err){
                    console.log(SQL_BING_INSERT);
                    console.log('【必应壁纸】插入数据失败');
                    console.log(err);
                } else{
                    console.log('【必应壁纸】插入/更新了的 '+year+'年'+month+'月'+day+'日 的数据！');
                }
                resolve({err: err, result: result});
            })
        } else{
            console.log('【必应壁纸】数据库已断开连接，无法更新数据');
            reject()
        }
    });
}


function createPromiseResolve(isSuccess, code, result=null) {
    return {success:isSuccess, code:code, result:result}
}
function query(sql, value) {
    return new Promise(((resolve, reject) => {
        if (db){
            db.query(sql, value, (err, result) => {
                if (err){
                    resolve(createPromiseResolve(false, ERROR_CODE_NOT_INIT))
                } else{
                    resolve(createPromiseResolve(true, ERROR_CODE_SUCCESS, result))
                }
            })
        }else{
            resolve(createPromiseResolve(false, ERROR_CODE_NOT_INIT))
        }
    }))
}

function numFormat(num) {
    if (num < 10){
        return '0'+num.toString()
    }
    return num.toString()
}

function formatImageData(rawImage) {
    let tmpReturnData = {};
    tmpReturnData.date = rawImage._id;
    tmpReturnData.year = rawImage.year;
    tmpReturnData.month = rawImage.month;
    tmpReturnData.day = rawImage.day;
    tmpReturnData.title = rawImage.title;
    tmpReturnData.location = rawImage.location;
    tmpReturnData.author = rawImage.author;
    let tmpMonth = rawImage.month;
    if(tmpMonth < 10){
        tmpMonth = '0' + tmpMonth.toString();
    }
    let tmpDay = rawImage.day;
    if(tmpDay < 10){
        tmpDay = '0' + tmpDay.toString();
    }
    tmpReturnData.img_url = '/bing-image/'+rawImage.year+'/'+tmpMonth+'/'+tmpDay+'/1920x1080.jpg';
    tmpReturnData.img_url_thumbnail = '/bing-image/'+rawImage.year+'/'+tmpMonth+'/'+tmpDay+'/400x240.jpg';
    tmpReturnData.img_url_base = '/bing-image/'+rawImage.year+'/'+tmpMonth+'/'+tmpDay;
    return tmpReturnData
}

const database = {
    // 一些常量
    ERROR_CODE_NOT_INIT : ERROR_CODE_NOT_INIT,
    ERROR_CODE_SQL_ERROR : ERROR_CODE_SQL_ERROR,
    ERROR_CODE_SUCCESS : ERROR_CODE_SUCCESS,
    // 标志位
    isInit: false,
    // 初始化
    init: function () {
        openConnection();
        checkDatabaseTable();
        this.isInit = true;
    },
    // 添加/更新结果
    addResult: async function (id ,year, month, day, copyright, source, path='-', title='-', location='-', json) {
        await insertBing(id, year, month, day, copyright, source, path, title, location, json)
    },
    // 获取制定的信息
    getBingInfo : async function(page, count){
        page = parseInt(page);
        count = parseInt(count);
        //
        let tmpReturnData = [];
        // 整理参数
        if (page < 1){ page = 1; }
        // 逻辑
        const tmpQueryResult = await query(SQL_BING_QUERY,[count, (page-1)*count]);
        if (tmpQueryResult.success){
            tmpQueryResult.result.forEach((value, index, array) => {
                let tmpValue = formatImageData(value);
                tmpReturnData.push(tmpValue);
            });
            return tmpReturnData;
        } else{
            return null;
        }
    },
    // 获取随机的
    getRandomImage : async function(count, excludeID=0){
        let tmpData = await query(SQL_BING_QUERY_RANDOM, [excludeID, count]);
        let tmpReturnData = [];
        if (tmpData.success){
            tmpData.result.forEach((value, index, array) => {
                tmpReturnData.push(formatImageData(value))
            })
        }
        return tmpReturnData
    },
    // 获取所有图片总数
    getBingImageCount : async function(){
        return await query(SQL_BING_QUERY_LINE_COUNT, null)
    },
    getBingImageByID : async function(id){
        return await query(SQL_BING_QUERY_ONE_BY_ID, [id])
    }
};


module.exports = database;

