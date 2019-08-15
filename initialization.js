
const fs = require('fs')
const readlineSync = require('readline-sync')

const PATH_CONFIG_FOLDER = './config/'
const PATH_CONFIG_FILE = 'config.json'

let isValid = false

console.log('╔══════════════════════════════════════════════════╗')
console.log('║     Welcome to bing-image initialized wizard     ║')
console.log('║                                                  ║')
console.log('║   This is just a simple config file generate for ║')
console.log('║ bing-image. Before you start initialized, you    ║')
console.log('║ should make sure the envionment has been setup   ║')
console.log('║ correctly.                                       ║')
console.log('╚══════════════════════════════════════════════════╝')
console.log(' \n    1 - China Mainland\n    2 - Japan\n    3 - England\n')
let location = '3'
while(!isValid){
    location = readlineSync.question('1. Please choose your server\'s location code : ')
    location.trim()
    if(location == '1' || location == '2' || location == '3'){
        isValid = true
    }else{
        console.log('【Error】Location code invalid')
    }
}
let databaseAddress = readlineSync.question('2. Please enter your database host address (Default is localhost) : ')
let databaseTableName = readlineSync.question('3. Please enter your database table name : ')
let databaseUsername = readlineSync.question('4. Please enter your database username : ')
let databasePassword = readlineSync.question('5. Please enter your database password : ' , { hideEchoBack: true })
console.log('')
console.log('Generating config file...')

if(!fs.existsSync(PATH_CONFIG_FILE)){
    if(!fs.existsSync(PATH_CONFIG_FOLDER)){
        fs.mkdirSync(PATH_CONFIG_FOLDER)
    }
}
fs.writeFileSync(PATH_CONFIG_FOLDER+PATH_CONFIG_FILE, JSON.stringify({
    server_location     : location,
    database_address    : databaseAddress,
    database_username   : databaseUsername,
    database_password   : databasePassword,
    database_table_name : databaseTableName,
}))

console.log('Done.')
