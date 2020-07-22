var FileSelector = /** @class */ (function () {
    function FileSelector(el) {
        var _this = this;
        this.callback = function () { };
        this.selector = el;
        this.selector.addEventListener("change", function (e) {
            _this.changeEvent();
        });
    }
    FileSelector.prototype.change = function (cb) {
        this.callback = cb;
    };
    FileSelector.prototype.changeEvent = function () {
        if (!this.selector.files)
            return false;
        var file = this.selector.files[0];
        this.image = window.URL.createObjectURL(file);
        this.callback(this.image);
    };
    return FileSelector;
}());
