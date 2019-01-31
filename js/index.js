var app = new Vue({
    el: "#app",
    data: {
        contents: []
    },
    methods: {
        load: function () {
            this.$http.get("https://raw.githubusercontent.com/qq443672581/qq443672581.github.io/master/data/article/welcome.md").then(function(res){
                var text = res.bodyText;
                var d = $("<div>");
                console.log($.parseHTML("<div>"+res.bodyText+"</div>",true)[0])
            })

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
