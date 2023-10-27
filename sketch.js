// Declare variables for audio and FFT analysis
let sound;  // Audio file
let fft;    // Fast Fourier Transform analysis
let band = 1024;  // Number of frequency bands
let rot = [];     // Array to store rotation values for each band

function preload() {
  // Load the audio file before setup
  sound = loadSound('asset/sample-visualisation.mp3');
}

function setup() {
  // Set up the canvas and initial parameters
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 256, 256, 256);  // Color mode
  fft = new p5.FFT(0.0, band);       // FFT analysis object
  fft.setInput(sound);               // Analyze the loaded sound

  // Initialize rotation values for each band
  for (let i = 0; i < band; i++) {
    rot[i] = random(360);
  }
  background(0);  // Set the initial background color to black
}

function draw() {
  // Clear a portion of the canvas and set blend mode for drawing
  blendMode(BLEND);
  background(0, 0, 0, 10);  // Slight background fade effect
  blendMode(ADD);  // Additive blending for visual effect
  noStroke();  // No outlines for shapes
  let spectrum = fft.analyze();  // Analyze audio spectrum
  translate(width/2, height/2);  // Center drawing on canvas

  // Loop through each frequency band
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(log(i), 0, log(spectrum.length), 0, height);
    let h = map(log(i), 0, log(spectrum.length), 0, 255);
    let diameter = map(pow(spectrum[i], 2), 0, pow(255, 2), 1, 40);
    let r = map(spectrum[i], 0, 255, 0.01, 1.0);

    rot[i] += r;  // Update rotation value
    push();
    rotate(radians(rot[i]));  // Apply rotation
    fill(h, 190, 127);  // Set circle color
    circle(x, 0, diameter);  // Draw the circle
    pop();  // Restore previous transformation state
  }
}

function mouseClicked() {
  if (sound.isPlaying() == false) {
    sound.loop();  // Start playing the audio in a loop
  } else {
    sound.stop();  // Stop playing the audio
  }
}

