/**
 * 下拉加载
 */
window["on" + "load"] = function () {
    window.scroll_ele = document.getElementById("main_wrap");
    scroll_ele["on" + "scroll"] = function () {
        if ((scroll_ele.scrollHeight - scroll_ele.scrollTop) == (window.innerHeight - 50)) {
            app.load();
        }
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

var config = {
    basePath : "https://raw.githubusercontent.com/qq443672581/qq443672581.github.io"
}
var app = new Vue({
    el: "#app",
    data: {
        loading: true,
        page:{
            page: 0,
            index: 0
        },
        contents: [],
        detail: null
    },
    methods: {
        load: function () {
            this.loading = true;
            this.$http.get(config.basePath + "/master/data/article/2019/02/我今年二十七八.md").then(function (res) {
                this.loading = false;
                var article = parseMd(res.bodyText);
                article.index = 0;
                this.contents.push(article);
                // for (var i = 1; i < 10; i++) {
                //     var newObj = JSON.parse(JSON.stringify(article));
                //     newObj.index = i;
                //     this.contents.push(newObj);
                // }
            })
        },
        look: function (index) {
            config.scrollTop = scroll_ele.scrollTop;
            this.detail = this.contents[index];
        },
        callback: function () {
            this.detail = null;
            $( window ).scrollLeft( 500 )
            $("#main_wrap").scrollLeft(500);
        }
    },
    created: function () {
        this.load();
    }
});

