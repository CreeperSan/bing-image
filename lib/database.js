const mysql = require('mysql');
const process = require('process');

const TABLE_BING_IMAGE = "BingImage";
const KEY_BING_IMAGE_ID = "_id";
const KEY_BING_IMAGE_YEAR = "year";
const KEY_BING_IMAGE_MONTH = "month";
const KEY_BING_IMAGE_DAY = "day";
const KEY_BING_IMAGE_COPYRIGHT = "copyright";
const KEY_BING_IMAGE_PATH = "path";
const KEY_BING_IMAGE_TITLE = 'title';
const KEY_BING_IMAGE_LOCATION = 'location';
const KEY_BING_IMAGE_JSON = 'json';

const SQL_BING_CREATE_TABLE = 'create table if not exists '+TABLE_BING_IMAGE+'(' +
    KEY_BING_IMAGE_ID + ' int not null primary key ,' +
    KEY_BING_IMAGE_YEAR + ' int not null ,' +
    KEY_BING_IMAGE_MONTH + ' int not null ,' +
    KEY_BING_IMAGE_DAY + ' int not null ,' +
    KEY_BING_IMAGE_COPYRIGHT + ' varchar(1024) not null ,' +
    KEY_BING_IMAGE_PATH + ' varchar(1024) not null,' +
    KEY_BING_IMAGE_TITLE + ' varchar(1024) not null,' +
    KEY_BING_IMAGE_LOCATION + ' varchar(1024) not null,' +
    KEY_BING_IMAGE_JSON + ' text not null' +
    ')';

const SQL_BING_INSERT = 'replace into '+TABLE_BING_IMAGE+'(' +
    KEY_BING_IMAGE_ID+','+KEY_BING_IMAGE_YEAR+','+KEY_BING_IMAGE_MONTH+','+KEY_BING_IMAGE_DAY+','+KEY_BING_IMAGE_COPYRIGHT+','+KEY_BING_IMAGE_PATH+','+KEY_BING_IMAGE_TITLE+','+KEY_BING_IMAGE_LOCATION+','+KEY_BING_IMAGE_JSON+
    ') values(?,?,?,?,?,?,?,?,?)';

const SQL_BING_QUERY = 'select * from '+TABLE_BING_IMAGE+' where '+KEY_BING_IMAGE_ID+' <= ? order by '+KEY_BING_IMAGE_ID+' desc limit ?'

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
        host : 'localhost',
        user : 'creepersan',
        password : '12345678',
        database : 'BingImage'
    });
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
function insertBing(id,year, month, day, copyright, path, title, location, json) {
    return new Promise((resolve, reject) => {
        if (db){
            db.query(SQL_BING_INSERT, [id, year, month, day, copyright, path, title, location, json], (err, result) => {
                if (err){
                    console.log(SQL_BING_INSERT);
                    console.log('【必应壁纸】插入数据失败');
                    console.log(err);
                } else{
                    console.log('【必应壁纸】插入数据成功！');
                }
                resolve({err: err, result: result});
            })
        } else{
            console.log('【必应壁纸】数据库已断开连接，无法更新数据')
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
        // let a = await insertBing(2018,10,6,'copyright','/path','This is title');
        // console.log('1111111111111');
        this.isInit = true;
    },
    // 添加/更新结果
    addResult: async function (id ,year, month, day, copyright, path='-', title='-', location='-', json) {
        await insertBing(id, year, month, day, copyright, path, title, location, json)
    },
    // 获取制定的信息
    getBingInfo : async function(id, count){
        const tmpQueryResult = await query(SQL_BING_QUERY,[id, count]);
        if (tmpQueryResult.success){
            tmpQueryResult.result.forEach((value, index, array) => {
                // 处理id
                const tmpDate = value._id
                delete value._id
                value.id = tmpDate
                console.log('处理了')
                // 处理path
                const tmpPath = value.path
                delete value.path
                value.bing_url = tmpPath
                // 处理大图和小图
                value.thumbnailImge = '/bing-image/'+numFormat(value.year)+'/'+numFormat(value.month)+'/'+numFormat(value.day)+'/640x480.jpg'
            })
            return tmpQueryResult.result
        } else{
            return null
        }
    }

};


module.exports = database;

