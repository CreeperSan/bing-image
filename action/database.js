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
    KEY_BING_IMAGE_ID + ' int not null primary key auto_increment ,' +
    KEY_BING_IMAGE_YEAR + ' int not null ,' +
    KEY_BING_IMAGE_MONTH + ' int not null ,' +
    KEY_BING_IMAGE_DAY + ' int not null ,' +
    KEY_BING_IMAGE_COPYRIGHT + ' varchar(1024) not null ,' +
    KEY_BING_IMAGE_PATH + ' varchar(1024) not null,' +
    KEY_BING_IMAGE_TITLE + ' varchar(1024) not null,' +
    KEY_BING_IMAGE_LOCATION + ' varchar(1024) not null,' +
    KEY_BING_IMAGE_JSON + ' text not null' +
    ')';

const SQL_BING_INSERT = 'insert into '+TABLE_BING_IMAGE+'(' +
    KEY_BING_IMAGE_YEAR+','+KEY_BING_IMAGE_MONTH+','+KEY_BING_IMAGE_DAY+','+KEY_BING_IMAGE_COPYRIGHT+','+KEY_BING_IMAGE_PATH+','+KEY_BING_IMAGE_TITLE+','+KEY_BING_IMAGE_LOCATION+','+KEY_BING_IMAGE_JSON+
    ') values(?,?,?,?,?,?,?,?)';


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
 * @param year
 * @param month
 * @param day
 * @param copyright
 * @param path
 * @param title
 * @param location
 * @returns {Promise<any>}
 */
function insertBing(year, month, day, copyright, path, title, location, json) {
    return new Promise((resolve, reject) => {
        if (db){
            db.query(SQL_BING_INSERT, [year, month, day, copyright, path, title, location, json], (err, result) => {
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


const database = {
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
    addResult: async function (year, month, day, copyright, path='-', title='-', location='-', json) {
        await insertBing(year, month, day, copyright, path, title, location, json)
    }

};


module.exports = database;

