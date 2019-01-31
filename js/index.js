var app = new Vue({
    el: "#app",
    data: {
        contents: []
    },
    methods: {
        load: function () {
            this.$http.get("https://raw.githubusercontent.com/qq443672581/qq443672581.github.io/master/data/article/welcome.md").then(function (res) {
                this.contents.push(parseMd(res.bodyText));
            })
        }
    },
    created: function () {
        this.load();
    }
});

window["on" + "load"] = function () {
    var ele = document.getElementById("main_wrap");
    ele["on" + "scroll"] = function () {
        if ((ele.scrollHeight - ele.scrollTop) == (window.innerHeight - 50)) {
            app.load();
        }
    }
};
