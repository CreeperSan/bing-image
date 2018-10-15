module.exports = {
    SIZE_1920X1200  : 0,
    SIZE_1920x1080  : 1,
    SIZE_1366x726   : 2,
    SIZE_1280x720   : 3,
    SIZE_1024x768   : 4,
    SIZE_800x600    : 6,
    SIZE_800x480    : 7,
    SIZE_640x480    : 8,
    SIZE_400x240    : 9,
    SIZE_320x240    : 10,
    SIZE_1080x1920  : 11,
    SIZE_768x1366   : 12,
    SIZE_768x1280   : 13,
    SIZE_720x1280   : 14,
    SIZE_480x800    : 15,
    SIZE_480x640    : 16,
    SIZE_240x400    : 17,
    SIZE_240x320    : 18,

    _SIZE_LIST      :   [
                            this.SIZE_1920X1200,
                            this.SIZE_1920x1080,
                            this.SIZE_1366x726,
                            this.SIZE_1280x720,
                            this.SIZE_1024x768,
                            this.SIZE_800x600,
                            this.SIZE_800x480,
                            this.SIZE_640x480,
                            this.SIZE_400x240,
                            this.SIZE_320x240,
                            this.SIZE_1080x1920,
                            this.SIZE_768x1366,
                            this.SIZE_768x1280,
                            this.SIZE_720x1280,
                            this.SIZE_480x800,
                            this.SIZE_480x640,
                            this.SIZE_240x400,
                            this.SIZE_240x320
                        ],

    isSizeLegal : function(sizeCode){
        return sizeCode in this._SIZE_LIST
    },

    getSizeName : function(sizeCode){
        switch (sizeCode) {
            case this.SIZE_1920X1200    : { return '1920x1200' }
            case this.SIZE_1920x1080    : { return '1920x1080' }
            case this.SIZE_1366x726     : { return '1366x768' }
            case this.SIZE_1280x720     : { return '1280x720' }
            case this.SIZE_1024x768     : { return '1024x768' }
            case this.SIZE_800x600      : { return '800x600' }
            case this.SIZE_800x480      : { return '800x480' }
            case this.SIZE_640x480      : { return '640x480' }
            case this.SIZE_400x240      : { return '400x240' }
            case this.SIZE_320x240      : { return '320x240' }
            case this.SIZE_1080x1920    : { return '1080x1920' }
            case this.SIZE_768x1366     : { return '768x1366' }
            case this.SIZE_768x1280     : { return '768x1280' }
            case this.SIZE_720x1280     : { return '720x1280' }
            case this.SIZE_480x800      : { return '480x800' }
            case this.SIZE_480x640      : { return '480x640' }
            case this.SIZE_240x400      : { return '240x400' }
            case this.SIZE_240x320      : { return '240x320' }
            default                     : { return 'Not Found' }
        }
    }
}