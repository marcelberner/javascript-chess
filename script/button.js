class Button {
  constructor(button, restartButton) {
    this.restartButton = restartButton;
    this.button = button;

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

export const button = new Button(
  document.querySelector(".button"),
  document.querySelector(".button-restart")
);
