class Asciify {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  cellSize: number = 5;
  lightnessArray: number[] = [];
  charList: CharList;
  asciiText: string = "";
  asciiOutput: HTMLTextAreaElement;
  fileSelect: FileSelector;

  /**
   * Will setup all the needed elements and variabled
   */
  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d");

    this.asciiOutput = document.getElementById(
      "asciiOutput"
    ) as HTMLTextAreaElement;

    this.charList = new CharList("charlist");

    this.render(null);

    document.getElementById("render").onclick = () => {
      this.render(this.fileSelect.image);
    };

    let file = document.getElementById("file") as HTMLInputElement;
    this.fileSelect = new FileSelector(file);
  }

  /**
   * Will render a given image to the canvas and convert
   * it to ascii art which will be put into the textarea
   * @param res The image to asciify
   */
  render(res) {
    this.loader(true);
    this.preloadImage(() => {
      this.fillLightnessArray();
      this.generateAsciiText();
      this.loader(false);
    }, res);
  }

  /**
   * Will show or hide the loader based on the given parameter
   * @param show Defines if the loader should be enabled or disabled
   */
  loader = (show: boolean) => {
    const loader = document.getElementById("loader");
    if (show) {
      loader.classList.add("open");
    } else {
      loader.classList.remove("open");
    }
  };

  /**
   * Will load a given image and draw it onto the canvas
   * If no image is provided, the default image will be used
   * @param cb The callback executed when the image is loaded
   * @param imageSrc The source of the image to load
   */
  preloadImage(cb: Function, imageSrc?: string) {
    const image = new Image();
    if (imageSrc) {
      image.src = imageSrc;
    } else {
      image.src = "/res/img.png";
    }
    image.onload = () => {
      this.updateDimensions(image);
      this.ctx.drawImage(image, 0, 0);
      cb();
    };
  }

  /**
   * Will update the width and height of the given
   * image and set the size of the canvas accordingly
   * @param image The image of which the dimensions should be calculated
   */
  updateDimensions = (image) => {
    this.width = image.width;
    this.height = image.height;
    this.canvas.setAttribute("width", "" + this.width);
    this.canvas.setAttribute("height", "" + this.height);
  };

  /**
   * Update the height of the textarea based on it's content
   */
  setTextareaHeight = () => {
    this.asciiOutput.style.height = "5px";
    this.asciiOutput.style.height = 14 + this.asciiOutput.scrollHeight + "px";
  };

  /**
   * Loop through chunks of the image, calculate the lightness
   * and put it into the lightnessArray
   */
  fillLightnessArray() {
    this.lightnessArray = [];
    const rows = Math.ceil(this.width / this.cellSize);
    const cols = Math.ceil(this.height / this.cellSize);

    for (let y = 0; y < cols; y++) {
      for (let x = 0; x < rows; x++) {
        let lightness = 0;

        let xEndCoord = x * this.cellSize + this.cellSize;
        let yEndCoord = y * this.cellSize + this.cellSize;

        const cellSizeX =
          xEndCoord <= this.width ? this.cellSize : xEndCoord - this.width;
        const cellSizeY =
          yEndCoord <= this.height ? this.cellSize : yEndCoord - this.height;

        let imageData = this.ctx.getImageData(
          x * this.cellSize,
          y * this.cellSize,
          cellSizeX,
          cellSizeY
        ).data;

        let tmp = imageData.reduce((tot, val, i) => {
          if ((i + 1) % 4 === 0) return tot + 0;
          return tot + val;
        }, 0);

        lightness = tmp / 3 / (this.cellSize * this.cellSize) / 255;

        this.lightnessArray.push(lightness);
      }
    }
  }

  /**
   * Will generate the ASCII-art based on the values
   * from the lightnessArray
   */
  generateAsciiText() {
    this.asciiText = "";
    this.lightnessArray.forEach((lightness, index) => {
      let charIndex;

      if (lightness === 0) {
        charIndex = this.charList.characterArray.length - 1;
      } else {
        charIndex =
          Math.ceil(
            (lightness * 100) / (100 / this.charList.characterArray.length)
          ) - 1;
      }
      let char = this.charList.characterArray[charIndex];

      if (index % Math.ceil(this.width / this.cellSize) === 0 && index !== 0) {
        this.asciiText += "\n";
      }

      this.asciiText += char;
    });

    this.asciiOutput.value = this.asciiText;
    this.setTextareaHeight();
  }
}
