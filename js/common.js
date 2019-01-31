Array.prototype.pushAll = function (arrs) {
    if (!arrs || typeof arrs != "object" || !arrs.length || arrs.length <= 0) {
        return;
    }
    for (var i = 0; i < arrs.length; i++) {
        this.push(arrs[i]);
    }
};

/**
 * 解析 md 文件
 * @param bodyText
 */
function parseMd(bodyText) {
    var arr = bodyText.split("\n");
    var i = 0;
    var propsStr = [], props = {};
    for (; i < arr.length; i++) {
        if (arr[i].trim() == "") {
            break;
        }
        propsStr.push(arr[i]);
    }
    //
    var reg = new RegExp(/\[(.*)\:(.*)\]\:\s(.*)/);
    for (var j = 0; j < propsStr.length; j++) {
        var groups = reg.exec(propsStr[j]);
        props[groups[2]] = groups[3];
    }
    //
    if (props.tags) {
        props.tags = props.tags.split(",");
    }
    if (!props.memo) {
        var ms = [];
        if (i + 1 < arr.length) {
            ms.push(arr[i + 1]);
        }
        if (i + 2 < arr.length) {
            ms.push(arr[i + 2]);
        }
        if (i + 3 < arr.length) {
            ms.push(arr[i + 3]);
        }
        props.memo = Mdjs.md2html(ms.join("\n"));
    }
    var body = arr.slice(i + 1, arr.length).join("\n");
    props.content = Mdjs.md2html(body);
    return props;
}