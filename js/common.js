Array.prototype.pushAll = function (arrs) {
    if (!arrs || typeof arrs != "object" || !arrs.length || arrs.length <= 0) {
        return;
    }
    for (var i = 0; i < arrs.length; i++) {
        this.push(arrs[i]);
    }
};