var app = new Vue({
    el: "#app",
    data: {
        contents: []
    },
    methods: {
        load: function () {
            this.$http.get("https://raw.githubusercontent.com/qq443672581/qq443672581.github.io/master/data/article/welcome.md").then(function (res) {
                var article = parseMd(res.bodyText);
                this.contents.push(article);
            })
        }
    },
    created: function () {
        this.load();
    }
});

window["on" + "load"] = function () {
    var tp = document.getElementById("top");
    window["on" + "scroll"] = function () {
        tp.style.top = window["scroll" + "Y"];
        if ((document.body.scrollHeight - document.body.scrollTop) == window.innerHeight) {
            app.load();
        }
    }
};
