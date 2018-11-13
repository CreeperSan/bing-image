const fs = require('fs');
const readline = require('readline');

function log(content) { console.log(content) }
function createReadLine() { return readline.createInterface({input : process.stdin, output: process.stdout}) }

function waitForUserInput(displayString, defaultValue='') {
    return new Promise((resolve, reject)=>{
        let terminal = createReadLine();
        terminal.question(displayString, function (userInput) {
            terminal.close();
            if (userInput === ''){
                userInput = defaultValue
            }
            resolve(userInput);
        })
    })
}

async function main(){
    log("");
    log("Please choose your operations");
    log("");
    log("1 - Setup database");
    log("0 - View current config");
    log("");
    log("Or press Enter to exit the setup ...");
    let operations = await waitForUserInput('Enter your operation : ');
    let _isCanContinue = true;
    log('');
    switch (operations) {
        case '1' : { ///////////////////////////////////////////////////////// 初始化数据库
            log('Please enter database hostname (localhost) :');
            const tmpHostname = await waitForUserInput('Database Hostname : ','localhost');
            log('Please enter database username (user) : ');
            const tmpUserName = await waitForUserInput('Database Username : ','user');
            log('Please enter database password (123456) :');
            const tmpPassword = await waitForUserInput('Database Password : ','123456');
            log('Please enter database name (BingImage) : ');
            const tmpDatabase = await waitForUserInput('Database Name : ','BindImage');

            console.log(tmpHostname+'\n'+tmpUserName+'\n'+tmpPassword+'\n'+tmpDatabase);
            break;
        }
        case '0' : { ///////////////////////////////////////////////////////// 显示配置
            break;
        }
        default : {
            _isCanContinue = false;
            break;
        }
    }
    if (_isCanContinue){
        await main();
    }
}

log("                                   ");
log("  +-----------------------------+  ");
log("  |                             |  ");
log("  | Welcome To Bing Image Setup |  ");
log("  |                             |  ");
log("  +-----------------------------+  ");
log("                                   ");
main();

