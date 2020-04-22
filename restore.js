const database = require('./lib/database.js')
const fs = require('fs')
const process = require('process')
const path = require('path')
const zipper = require("zip-local")

/* 一些方法定义 */

function mkdirsSync(dirname){
    // console.log(dirname)
    if(fs.existsSync(dirname)){
        return true
    }else{
        if(mkdirsSync(path.dirname(dirname))){
            fs.mkdirSync(dirname)
            return true
        }
    }
}

function int_to_string(value){
    if (value >= 10){
        return value.toString()
    }else{
        return '0' + value.toString()
    }
}

function delete_folder(path) {
    let files = []
    if(fs.existsSync(path)) {
        files = fs.readdirSync(path)
        files.forEach(function(file, index) {
            var curPath = path + "/" + file
            if(fs.statSync(curPath).isDirectory()) { // recurse
                delete_folder(curPath)
            } else { // delete file
                fs.unlinkSync(curPath)
            }
        });
        fs.rmdirSync(path)
    }
}

async function delay(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}

/* 逻辑本体 */
const datetime = new Date()
const restore_directory_path = './restore_'+datetime.getTime().toString()   // 解压出来的数据的总文件夹

async function main(){
    let argument = process.argv
    if (argument.length < 3){
        console.log('please specify backup file path. For example "npm run restore ./bing-image-backup_2020303_221042.bak"')
        process.exit(0)
    }

    let restore_file_path = argument[2]

    console.log('Restoring backup file '+restore_file_path+' ...')

    // 先解压
    console.log('Unzipping backup file ...')
    mkdirsSync(restore_directory_path)
    zipper.sync.unzip(restore_file_path).save(restore_directory_path)

    // 初始化数据库连接
    database.init()

    // 等待数据库连接成功
    // TODO 延时处理不太好，应该根据毁掉判断的，这里后面再优化
    await delay(5000)

    // 遍历里面的每一个文件夹
    let item_directory_name_list = fs.readdirSync(restore_directory_path)
    for (let i=0; i<item_directory_name_list.length; i++){
        let item_directory_name = item_directory_name_list[i]

        let item_image_directory_path = restore_directory_path+'/'+item_directory_name
        // 解压并写入数据到数据库
        let item_database_json = item_image_directory_path+'/data.json'
        let item_json = JSON.parse(fs.readFileSync(item_database_json).toString())
        database.addResult(
             item_json._id,
             item_json.year,
             item_json.month,
             item_json.day,
             item_json.copyright,
             item_json.author,
             item_json.path,
             item_json.title,
             item_json.location,
             item_json.json,
        )

        // 复制图片到资源文件夹
        console.log('Moving image file '+item_json._id)
        let item_image_directory_name_list = fs.readdirSync(item_image_directory_path)
        let dst_image_directory_path = './public/bing-image/'+int_to_string(item_json.year)+'/'+int_to_string(item_json.month)
                                            +'/'+int_to_string(item_json.day)       // 要复制过去的文件夹的路径
        mkdirsSync(dst_image_directory_path)                                        // 先创建要复制过去的文件夹

        for (let j=0; j<item_image_directory_name_list.length; j++){
            let image_file_name = item_image_directory_name_list[j]
            // 如果不是jpg图片，则不管这个文件
            if (!image_file_name.endsWith('.jpg')){
                continue
            }

            // 复制图片过去
            let src_image_file_path = item_image_directory_path + '/' + image_file_name
            let dst_image_file_path = dst_image_directory_path+'/'+image_file_name
            fs.copyFileSync(src_image_file_path, dst_image_file_path)

        }
    }

    console.log('restore finished.')

    console.log('Clearing cache ...')
    delete_folder(restore_directory_path)
    console.log('Done.')

}

try {
    main()
}catch (e) {
    console.log('Error Happened')
    console.log(e)
}
