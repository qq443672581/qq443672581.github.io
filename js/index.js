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
    basePath : "https://raw.githubusercontent.com/qq443672581/qq443672581.github.io",
    maxMenu : 2
};

var app = new Vue({
    el: "#app",
    data: {
        loading: true,
        page:{
            menu_index:config.maxMenu,
            next_bag:[],
            next_all:[],

            article_index:1,
            page_size:5,
            isEnd: false // 没有数据了
        },
        contents: [],
        detail: null
    },
    methods: {
        // 加载一个菜单进来
        loadMenu: function (main) {
            // 检查上一次加载的数据是不是还够用
            main.page.next_bag.pushAll(main.page.next_all.splice(0,main.page.page_size - main.page.next_bag.length));
            if(main.page.next_bag.length == main.page.page_size){
                // 够,加载数据
                console.log("准备加载数据")
                main.loadData(main);
                return ;
            }
            // 没有办法继续加载数据了
            if(main.page.menu_index <= 0){
                // 没有数据了
                console.log("没数据了")
                main.page.isEnd = true;
                main.loadData(main);
                return ;
            }
            // 继续加载数据
            main.$http.get(config.basePath + "/master/data/menus/" + main.page.menu_index + ".json").then(function (res) {
                main.page.menu_index--;
                main.page.next_all.pushAll(res.body);
                main.loadMenu(main);
            })
        },
        loadData: function(main){
            var obj = main.page.next_bag.shift();
            if(!obj){
                main.loading = false;
                return ;
            }

            var url = config.basePath + "/master/data/article/@year/@month/@name"
                .replace("@year",obj.year)
                .replace("@month",obj.month)
                .replace("@name",obj.name);

            main.$http.get(url).then(function (res) {
                var article = parseMd(res.bodyText);
                article.index = main.page.article_index++;
                main.contents.push(article);
                main.loadData(main);
            })
        },
        load: function () {
            // load
            if(this.page.isEnd){
                return ;
            }

            this.loading = true;
            this.loadMenu(this);
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

