class Button {
  restartButton: HTMLDivElement;
  button: HTMLDivElement;
  isStarted: boolean;

  constructor() {
    this.restartButton = document.querySelector(".button-restart")!;
    this.button = document.querySelector(".button")!;
    this.isStarted = false;
  }

  changeButtonState() {
    if (!this.isStarted) {
      this.button.classList.toggle("start");
      this.button.classList.toggle("concede");
      this.button.textContent = "PODDAJ PARTIĘ";
    }

    this.isStarted = true;
  }

  buttonDisableState() {
    this.button.classList.toggle("disabled");
    this.button.classList.toggle("concede");
  }
}

export const button = new Button();
