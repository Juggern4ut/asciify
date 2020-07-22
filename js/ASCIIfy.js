var Asciify = /** @class */ (function () {
    function Asciify() {
        var _this = this;
        this.cellSize = 5;
        this.lightnessArray = [];
        this.asciiText = "";
        /**
         * Will show or hide the loader based on the given parameter
         * @param show Defines if the loader should be enabled or disabled
         */
        this.loader = function (show) {
            var loader = document.getElementById("loader");
            if (show) {
                loader.classList.add("open");
            }
            else {
                loader.classList.remove("open");
            }
        };
        /**
         * Will update the width and height of the given
         * image and set the size of the canvas accordingly
         * @param image The image of which the dimensions should be calculated
         */
        this.updateDimensions = function (image) {
            _this.width = image.width;
            _this.height = image.height;
            _this.canvas.setAttribute("width", "" + _this.width);
            _this.canvas.setAttribute("height", "" + _this.height);
        };
        /**
         * Update the height of the textarea based on it's content
         */
        this.setTextareaHeight = function () {
            _this.asciiOutput.style.height = "5px";
            _this.asciiOutput.style.height = 14 + _this.asciiOutput.scrollHeight + "px";
        };
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.asciiOutput = document.getElementById("asciiOutput");
        this.charList = new CharList("charlist");
        this.render(null);
        document.getElementById("render").onclick = function () {
            _this.render(_this.fileSelect.image);
        };
        var file = document.getElementById("file");
        this.fileSelect = new FileSelector(file);
    }
    /**
     * Will render a given image to the canvas and convert
     * it to ascii art which will be put into the textarea
     * @param res The image to asciify
     */
    Asciify.prototype.render = function (res) {
        var _this = this;
        this.loader(true);
        this.preloadImage(function () {
            _this.fillLightnessArray();
            _this.generateAsciiText();
            _this.loader(false);
        }, res);
    };
    /**
     * Will load a given image and draw it onto the canvas
     * If no image is provided, the default image will be used
     * @param cb The callback executed when the image is loaded
     * @param imageSrc The source of the image to load
     */
    Asciify.prototype.preloadImage = function (cb, imageSrc) {
        var _this = this;
        var image = new Image();
        if (imageSrc) {
            image.src = imageSrc;
        }
        else {
            image.src = "/res/img.png";
        }
        image.onload = function () {
            _this.updateDimensions(image);
            _this.ctx.drawImage(image, 0, 0);
            cb();
        };
    };
    Asciify.prototype.fillLightnessArray = function () {
        this.lightnessArray = [];
        var rows = Math.ceil(this.width / this.cellSize);
        var cols = Math.ceil(this.height / this.cellSize);
        for (var y = 0; y < cols; y++) {
            for (var x = 0; x < rows; x++) {
                var lightness = 0;
                var xEndCoord = x * this.cellSize + this.cellSize;
                var yEndCoord = y * this.cellSize + this.cellSize;
                var cellSizeX = xEndCoord <= this.width ? this.cellSize : xEndCoord - this.width;
                var cellSizeY = yEndCoord <= this.height ? this.cellSize : yEndCoord - this.height;
                var imageData = this.ctx.getImageData(x * this.cellSize, y * this.cellSize, cellSizeX, cellSizeY).data;
                var tmp = imageData.reduce(function (tot, val, i) {
                    if ((i + 1) % 4 === 0)
                        return tot + 0;
                    return tot + val;
                }, 0);
                lightness = tmp / 3 / (this.cellSize * this.cellSize) / 255;
                this.lightnessArray.push(lightness);
            }
        }
    };
    Asciify.prototype.generateAsciiText = function () {
        var _this = this;
        this.asciiText = "";
        this.lightnessArray.forEach(function (lightness, index) {
            var charIndex;
            if (lightness === 0) {
                charIndex = _this.charList.characterArray.length - 1;
            }
            else {
                charIndex =
                    Math.ceil((lightness * 100) / (100 / _this.charList.characterArray.length)) - 1;
            }
            var char = _this.charList.characterArray[charIndex];
            if (index % Math.ceil(_this.width / _this.cellSize) === 0 && index !== 0) {
                _this.asciiText += "\n";
            }
            _this.asciiText += char;
        });
        this.asciiOutput.value = this.asciiText;
        this.setTextareaHeight();
    };
    return Asciify;
}());
