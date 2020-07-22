class FileSelector {
  selector: HTMLInputElement;
  callback: Function = () => {};
  image: String;
  constructor(el: HTMLInputElement) {
    this.selector = el;
    this.selector.addEventListener("change", (e) => {
      this.changeEvent();
    });
  }

  change(cb: Function) {
    this.callback = cb;
  }

  changeEvent() {
    if (!this.selector.files) return false;
    let file = this.selector.files[0];
    this.image = window.URL.createObjectURL(file);
    this.callback(this.image);
  }
}
