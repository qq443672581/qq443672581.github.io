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
    maxMenu : 1
};

var app = new Vue({
    el: "#app",
    data: {
        menus:[
            {title:"技术",code:"x"},
            {title:"生活",code:"y"},
            {title:"图像",code:"time"},
            {title:"音乐",code:"time"},
            {title:"关于我",type:"goto",code:"data/me.html"}
        ].reverse(),
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
        contents_bak: [],
        detail: null
    },
    methods: {
        menuGoTo:function(menu){
            if(!menu){
                return ;
            }
            if(menu.type === "goto"){
                location.href = menu.code;
            }else{

            }
        },
        // 加载一个菜单进来
        loadMenu: function (main) {
            // 检查上一次加载的数据是不是还够用
            main.page.next_bag.pushAll(main.page.next_all.splice(0,main.page.page_size - main.page.next_bag.length));

            // 数据够了 或者 没有数据了
            if(
                main.page.next_bag.length == main.page.page_size || main.page.menu_index <= 0
            ){
                main.loadData(main);
                if(main.page.menu_index <= 0 && main.page.next_all.length == 0){
                    // 没有数据了
                    main.page.isEnd = true;
                }
                return ;
            }
            // 继续加载数据
            main.$http.get(config.basePath + "/master/data/menus/" + main.page.menu_index + ".json?" + new Date().getTime()).then(function (res) {
                main.page.menu_index--;
                main.page.next_all.pushAll(res.body.reverse());
                main.loadMenu(main);
            })
        },
        // 加载置顶文章
        loadTopData: function () {
            var _this = this;
            this.$http.get(config.basePath + "/master/data/menus/top.json?" + urlRandom()).then(function (res) {
                _this.page.next_bag.pushAll(res.body.reverse());
                _this.loadData(_this, function () {
                    _this.loadMenu(_this);
                });
            })
        },
        // 加载文章
        loadData: function(main, callback){
            var obj = main.page.next_bag.shift();
            if(!obj){
                if(callback){
                    callback();
                }
                main.contents.pushAll(main.contents_bak);
                main.contents_bak = [];
                main.loading = false;
                return ;
            }

            var url = config.basePath + "/master/data/article/@year/@month/@name?"
                .replace("@year",obj.year)
                .replace("@month",obj.month)
                .replace("@name",obj.name)
            + urlRandom();

            main.$http.get(url).then(function (res) {
                var article = parseMd(res.bodyText);
                article.index = main.page.article_index++;
                main.contents_bak.push(article);
                main.loadData(main, callback);
            })
        },
        initLoad: function () {
            // load
            if(this.page.isEnd){
                return ;
            }

            this.loading = true;
            // 置空
            this.page.next_bag = [];
            this.loadTopData();
        },
        // 加载
        load: function () {
            // load
            if(this.page.isEnd){
                return ;
            }

            this.loading = true;
            // 置空
            this.page.next_bag = [];
            this.loadMenu(this);
        },
        // 查看详情
        look: function (index) {
            if(index < 1){
                return ;
            }
            config.scrollTop = scroll_ele.scrollTop;
            this.detail = this.contents[index - 1];
        },
        // 关闭详情
        callback: function () {
            this.detail = null;
            $( window ).scrollLeft( 500 )
            $("#main_wrap").scrollLeft(500);
        }
    },
    created: function () {
        this.initLoad();
    }
});
app.look(0);
app.menuGoTo();

