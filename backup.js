const database = require('./lib/database.js')
const fs = require('fs')
const process = require('process')
const path = require('path')
const zipper = require("zip-local")

const data_time = new Date()

const backup_directory_path = './bing-image-backup_'+int_to_string(data_time.getFullYear())+
                                +int_to_string(data_time.getMonth())+int_to_string(data_time.getDay())+'_'
                                +int_to_string(data_time.getHours())+int_to_string(data_time.getMinutes())
                                +int_to_string(data_time.getSeconds())
const backup_file_path = backup_directory_path + '.bing_bak'

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

function int_to_string(value){
    if (value >= 10){
        return value.toString()
    }else{
        return '0' + value.toString()
    }
}

/* 主逻辑 */

async function main() {
    let tmp_page = 0
    const tmp_count = 2
    let tmp_data_list = []

    // 检查文件夹路径是否存在
    if(fs.existsSync(backup_directory_path)){
        throw 'Error! Backup directory path already exist!   path=' + backup_directory_path
    } else {
        // 不存在则创建文件夹
        fs.mkdirSync(backup_directory_path)
        if(!fs.existsSync(backup_directory_path)){
            // 创建失败则抛出异常
            throw 'Error! Create temp directory fail!   path=' + backup_directory_path
        }
    }

    // 循环读取数据
    database.init()
    do {
        tmp_page += 1
        tmp_data_list = await database.getBingInfoRaw(tmp_page, tmp_count)
        if(tmp_data_list===null || tmp_data_list===undefined){
            throw "Error! Can not read data form database"
        }
        // 生成文件夹并复制备份图片
        for (let index=0; index<tmp_data_list.length; index++){
            let item = tmp_data_list[index]
            console.log('Processing '+item._id)
            let item_directory_path = backup_directory_path+'/'+item._id.toString()
            let item_image_directory_path = './public/bing-image/'+int_to_string(item.year)+'/'+int_to_string(item.month)+'/'+int_to_string(item.day)
            // 写入数据
            mkdirsSync(item_directory_path)
            fs.writeFileSync(item_directory_path +'/data.json', JSON.stringify(item))
            // 遍历复制图片
            let image_file_name_array = fs.readdirSync(item_image_directory_path)
            for(let j=0; j<image_file_name_array.length; j++){
                let image_file_name = image_file_name_array[j]
                let image_item_path = item_image_directory_path+'/'+ image_file_name
                mkdirsSync(image_item_path)
                fs.copyFileSync(image_item_path, item_directory_path+'/'+image_file_name)
            }
        }
    } while (tmp_data_list.length > 0)

    // 压缩文件
    console.log('Packaging backup datas...')
    zipper.sync.zip(backup_directory_path).compress().save(backup_file_path)

    console.log("Success! backup file was export to path " + backup_file_path)

    // 删除过程中产生的临时文件
    console.log('removing cache files...')
    delete_folder(backup_directory_path)

    console.log(backup_directory_path)

    console.log('All Done.')

    process.exit(0)
}


try{
    main()
}catch (e) {
    console.log('Error Happened!')
    console.log(e)
}
