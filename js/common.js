Array.prototype.pushAll = function (arrs) {
    if (!arrs || typeof arrs != "object" || !arrs.length || arrs.length <= 0) {
        return;
    }
    for (var i = 0; i < arrs.length; i++) {
        this.push(arrs[i]);
    }
};

function loadData(data){
    var scripts = document.getElementsByTagName("script");
    var cb = null;
    for(var i=0;i<scripts.length;i++){
        if(scripts[i].src.indexOf(window.jsonp_article_id) != -1){
            cb = scripts[i].src;
            break;
        }
    }
    if(cb){
        var sc = cb;
        cb = null;
        sc = sc.substring(1);
        var ps = sc.split("&");
        for(var i=0;i<ps.length;i++){
            var kv = ps[i].split("=");
            if(kv[0] == "cb"){
                cb = kv[1];
            }
        }
    }
    if(cb){
        window[cb](data);
    }
}