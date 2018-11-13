
const fs = require('fs');

fs.readFileSync(process.cwd());



module.exports = {
    hasConfig : function () {
        return fs.existsSync(process.cwd()+'/config.json')
    }
};
