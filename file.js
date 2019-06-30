const electron = require('electron');
let fs = require("fs");


function readFileList(path, filesList) {
    //获取所有目录
    var files = fs.readdirSync(path);
    files.forEach((item, index) => {
        var stat = fs.statSync(path + "/" + item);
        if (stat.isDirectory()) {
            //递归读取文件
            readFileList(path + "/" + item, filesList);
        } else {
            var obj = {};
            obj.path = path;
            obj.filename = item;
            filesList.push(obj);
        }
    });
}
var getFiles = {
    //获取文件夹下所有文件
    getFileList: function (path) {
        var filesList = [];
        readFileList(path, filesList);
        return filesList;
        // readFileList();
    },
    //获取文件夹下所有图片
    getImageFiles: function (path) {
        var imageList = [];
        this.getFileList(path).forEach((item) => {
            imageList.push(item.path + "/" + item.filename);
            // var ms=image(fs.readFileSync(item.path+"/"+item.filename))
            // ms.mimeType && (imageList.push(item.filename))
        });
        return imageList;
    }
}
//拷贝文件
function copy(sourse, target) {
    fs.createReadStream(sourse).pipe(fs.createWriteStream(target));
}

//获取图片
function piclist(source, target) {
    var srclist = getFiles.getImageFiles(source);
    var srcNewList = [];
    srclist.forEach((item, index) => {
        if (item.split(".")[1] == 'jpg' || item.split(".")[1] == 'png' || item.split(".")[1] == 'bmp') {
            srcNewList.push({
                'imsrc': item
            });
            copy(item, target + index + '.jpg');
        }
    });
}



function start(source, target) {
    if (!target) {
        target = source;
    }
    piclist(source, target);
}
var execute_btn = document.getElementById('execute_btn');
execute_btn.addEventListener('click', () => {
    var path = document.getElementById('path').value;
    start(path);
});