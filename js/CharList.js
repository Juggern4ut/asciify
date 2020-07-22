var CharList = /** @class */ (function () {
    function CharList(id) {
        var _this = this;
        this.characterArray = ["#", "@", "=", "+", "*", "-", ":", ".", " "];
        this.render = function () {
            _this.element.innerHTML = "";
            _this.characterArray.forEach(function (char, index) {
                _this.addChar(char, index);
            });
            _this.addForm();
            _this.refreshDropzonesAndTags();
            _this.dragStart();
            _this.dragEnd();
            _this.dragOver();
            _this.dragDrop();
        };
        this.addChar = function (char, index) {
            var tag = document.createElement("div");
            var span = document.createElement("label");
            var remove = document.createElement("span");
            var dragIndicator = document.createElement("div");
            dragIndicator.classList.add("dragIndicator");
            span.innerHTML = char;
            remove.innerHTML = "X";
            tag.append(span);
            tag.append(remove);
            tag.draggable = true;
            tag.classList.add("charTag");
            remove.onclick = function () { return _this.removeCharLogic(index); };
            _this.element.append(tag);
            _this.element.append(dragIndicator);
        };
        this.addForm = function () {
            var tag = document.createElement("div");
            var input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;
            tag.id = "addCharForm";
            var submit = document.createElement("input");
            submit.type = "submit";
            submit.value = "Add Character";
            submit.onclick = function () { return _this.addCharLogic(input.value); };
            tag.append(input);
            tag.append(submit);
            _this.element.append(tag);
        };
        this.addCharLogic = function (char) {
            _this.characterArray.push(char);
            _this.render();
        };
        this.removeCharLogic = function (index) {
            _this.characterArray.splice(index, 1);
            _this.render();
        };
        this.refreshDropzonesAndTags = function () {
            _this.dropzones = document.querySelectorAll(".dragIndicator");
            _this.tags = document.querySelectorAll(".charTag");
        };
        this.dragStart = function () {
            _this.tags.forEach(function (tag, index) {
                tag.addEventListener("dragstart", function () {
                    _this.dragIndex = index;
                    for (var i = 0; i < _this.dropzones.length; i++) {
                        _this.dropzones[i].classList.add("active");
                    }
                });
            });
        };
        this.dragEnd = function () {
            _this.tags.forEach(function (tag) {
                tag.addEventListener("dragend", function () {
                    _this.dragIndex = undefined;
                    for (var i = 0; i < _this.dropzones.length; i++) {
                        _this.dropzones[i].classList.remove("active");
                        _this.dropzones[i].classList.remove("over");
                    }
                });
            });
        };
        this.dragOver = function () {
            var _loop_1 = function (i) {
                _this.dropzones[i].addEventListener("dragenter", function () {
                    _this.dropzones[i].classList.add("over");
                });
                _this.dropzones[i].addEventListener("dragleave", function () {
                    _this.dropzones[i].classList.remove("over");
                });
                _this.dropzones[i].addEventListener("dragover", function (e) {
                    e.preventDefault();
                });
            };
            for (var i = 0; i < _this.dropzones.length; i++) {
                _loop_1(i);
            }
        };
        this.dragDrop = function () {
            _this.tags.forEach(function (tag, index) {
                var _loop_2 = function (i) {
                    _this.dropzones[i].addEventListener("drop", function (e) {
                        e.preventDefault();
                        if (index === _this.dragIndex) {
                            _this.dropzones[i].before(tag);
                            tag.before(_this.dropzones[index]);
                            _this.updateCharacterArray();
                            _this.render();
                            console.log(_this.characterArray);
                        }
                    });
                };
                for (var i = 0; i < _this.dropzones.length; i++) {
                    _loop_2(i);
                }
            });
        };
        this.updateCharacterArray = function () {
            var tmpArray = [];
            var tmp = document.querySelectorAll(".charTag");
            tmp.forEach(function (tag) {
                var char = tag.querySelector("label").innerHTML;
                tmpArray.push(char);
            });
            _this.characterArray = tmpArray;
        };
        var el = document.getElementById(id);
        this.element = el;
        this.render();
    }
    return CharList;
}());
