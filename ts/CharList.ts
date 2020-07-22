class CharList {
  element: HTMLElement;
  dropzones: NodeListOf<Element>;
  tags: NodeListOf<Element>;
  dragIndex: number;
  characterArray: string[] = ["#", "@", "=", "+", "*", "-", ":", ".", " "];

  constructor(id: string) {
    const el = document.getElementById(id) as HTMLElement;
    this.element = el;
    this.render();
  }

  render = () => {
    this.element.innerHTML = "";
    this.characterArray.forEach((char, index) => {
      this.addChar(char, index);
    });
    this.addForm();

    this.refreshDropzonesAndTags();
    this.dragStart();
    this.dragEnd();
    this.dragOver();
    this.dragDrop();
  };

  addChar = (char: string, index: number) => {
    const tag = document.createElement("div");
    const span = document.createElement("label");
    const remove = document.createElement("span");

    const dragIndicator = document.createElement("div");
    dragIndicator.classList.add("dragIndicator");

    span.innerHTML = char;
    remove.innerHTML = "X";

    tag.append(span);
    tag.append(remove);
    tag.draggable = true;
    tag.classList.add("charTag");

    remove.onclick = () => this.removeCharLogic(index);

    this.element.append(tag);
    this.element.append(dragIndicator);
  };

  addForm = () => {
    const tag = document.createElement("div");
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 1;
    tag.id = "addCharForm";

    const submit = document.createElement("input");
    submit.type = "submit";
    submit.value = "Add Character";
    submit.onclick = () => this.addCharLogic(input.value);

    tag.append(input);
    tag.append(submit);

    this.element.append(tag);
  };

  addCharLogic = (char) => {
    this.characterArray.push(char);
    this.render();
  };

  removeCharLogic = (index) => {
    this.characterArray.splice(index, 1);
    this.render();
  };

  refreshDropzonesAndTags = () => {
    this.dropzones = document.querySelectorAll(".dragIndicator");
    this.tags = document.querySelectorAll(".charTag");
  };

  dragStart = () => {
    this.tags.forEach((tag, index) => {
      tag.addEventListener("dragstart", () => {
        this.dragIndex = index;
        for (let i = 0; i < this.dropzones.length; i++) {
          this.dropzones[i].classList.add("active");
        }
      });
    });
  };

  dragEnd = () => {
    this.tags.forEach((tag) => {
      tag.addEventListener("dragend", () => {
        this.dragIndex = undefined;
        for (let i = 0; i < this.dropzones.length; i++) {
          this.dropzones[i].classList.remove("active");
          this.dropzones[i].classList.remove("over");
        }
      });
    });
  };

  dragOver = () => {
    for (let i = 0; i < this.dropzones.length; i++) {
      this.dropzones[i].addEventListener("dragenter", () => {
        this.dropzones[i].classList.add("over");
      });

      this.dropzones[i].addEventListener("dragleave", () => {
        this.dropzones[i].classList.remove("over");
      });

      this.dropzones[i].addEventListener("dragover", (e) => {
        e.preventDefault();
      });
    }
  };

  dragDrop = () => {
    this.tags.forEach((tag, index) => {
      for (let i = 0; i < this.dropzones.length; i++) {
        this.dropzones[i].addEventListener("drop", (e) => {
          e.preventDefault();

          if (index === this.dragIndex) {
            this.dropzones[i].before(tag);
            tag.before(this.dropzones[index]);
            this.updateCharacterArray();
            this.render();
            console.log(this.characterArray);
          }
        });
      }
    });
  };

  updateCharacterArray = () => {
    const tmpArray = [];
    const tmp = document.querySelectorAll(".charTag");
    tmp.forEach((tag) => {
      const char = tag.querySelector("label").innerHTML;
      tmpArray.push(char);
    });
    this.characterArray = tmpArray;
  };
}
