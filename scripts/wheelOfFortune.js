class WheelOfFortune {
  constructor() {
    this.spinCount = 0;
    this.maxSpins = 2;
    this.init();
  }

  init() {
    const form = document.getElementById("user-form");
    form.addEventListener("submit", this.handleSubmit.bind(this));

    this.wheelContainer = document.getElementById("wheel-container");
    this.wheel = document.getElementById("wheel");
    this.spinBtn = document.getElementById("spin-btn");
    this.resultMessage = document.getElementById("result-message");

    this.spinBtn.addEventListener("click", this.spinWheel.bind(this));
  }

  getRandomAngle() {
    return Math.floor(Math.random() * 360) + 720; // Ensures at least 2 full spins
  }

  handleSubmit(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const email = document.getElementById("email").value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name && surname && email && emailRegex.test(email)) {
      document.getElementById("form-container").style.display = "none";
      this.wheelContainer.style.display = "block";
      this.spinBtn.disabled = false;
    } else {
      alert("Please fill out all fields correctly.");
    }
  }

  async spinWheel() {
    if (this.spinCount >= this.maxSpins) return;

    this.spinCount++;
    this.spinBtn.disabled = true;

    // Start spin animation
    this.wheel.style.transition = "transform 4s ease-out";
    this.wheel.style.transform = `rotate(${this.getRandomAngle()}deg)`;

    // After 1 second, get a random number and calculate final angle
    setTimeout(async () => {
      const randomNumber = await this.fetchRandomNumber();
      const finalAngle = this.calculateFinalAngle(randomNumber);

      this.wheel.style.transition = "transform 4s ease-out";
      this.wheel.style.transform = `rotate(${finalAngle}deg)`;

      // Wait for the spin animation to finish
      setTimeout(async () => {
        const result = await this.getSpinResult(randomNumber);
        this.displayResult(result);

        if (this.spinCount < this.maxSpins) {
          this.spinBtn.disabled = false;
        } else {
          this.spinBtn.disabled = true;
        }
      }, 4000); // Duration of spin animation
    }, 1000); // Delay for random number generation
  }

  async fetchRandomNumber() {
    try {
      const response = await fetch("randomNumber.json"); // Replace with your URL
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      return data.randomNumber;
    } catch (error) {
      console.error("Error fetching random number:", error);
      return Math.floor(Math.random() * 12) + 1; // Fallback
    }
  }

  calculateFinalAngle(index) {
    const anglePerSegment = 360 / 12; // 12 segments
    const fullRotations = 720;
    const offset = Math.floor(Math.random() * anglePerSegment);
    return fullRotations + (index - 1) * anglePerSegment - offset;
  }

  async getSpinResult(index) {
    const segments = [
      "WIN",
      "Try Again",
      "Try Again",
      "WIN",
      "Try Again",
      "Try Again",
      "WIN",
      "Try Again",
      "Try Again",
      "WIN",
      "Try Again",
      "Try Again",
    ];
    const result = segments[index - 1];
    if (result === "WIN") {
      return await this.getPrize();
    } else {
      return "Try Again";
    }
  }

  async getPrize() {
    try {
      const response = await fetch("prize.json"); // Replace with your URL
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      return `Congratulations! You won a ${data.prize}`;
    } catch (error) {
      return "Error fetching prize. Please try again.";
    }
  }

  displayResult(result) {
    this.resultMessage.innerText = result;
  }
}

// Initialize the Wheel of Fortune widget
document.addEventListener("DOMContentLoaded", () => {
  new WheelOfFortune();
});
