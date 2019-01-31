var app = new Vue({
    el: "#app",
    data: {
        contents: []
    },
    methods: {
        load: function () {
            var id = new Date().getTime();
            window.jsonp_article_id = id;
            this.$http.jsonp("data/test.js", {
                jsonp: 'cb', params: {
                    id: id
                }
            }).then(function (res) {
                // res.body[0].content = Mdjs.md2html(res.body[0].content);
                this.contents.pushAll(res.body);
            }, function (e) {
                console.log("err");
            });
        }
    },
    created: function () {
        this.load();
    }
});

window.onload = function () {
    var tp = document.getElementById("top");
    window.onscroll = function () {
        tp.style.top = window.scrollY;
        if ((document.body.scrollHeight - document.body.scrollTop) == window.innerHeight){
            app.load();
        }
    }
};
