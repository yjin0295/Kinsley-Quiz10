var song;
var fft;
var particles = [];
var img;
var amp;
var spectralCentroid; // Variable to store spectral centroid
var previousSpectrum; // Array to store the previous spectrum frame

function preload() {
  // Preload audio and image
  alert("Click on the screen to play or pause")
  song = loadSound("asset/sample-visualisation.mp3")
  img = loadImage("asset/photo-1482686115713-0fbcaced6e28.avif")
}

function setup() {
  // Setup the canvas and initial settings
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  imageMode(CENTER);
  colorMode(HSB);
  rectMode(CENTER);

  // Create the FFT (Fast Fourier Transform) object
  fft = new p5.FFT(0.9, 512);
  img.filter(BLUR, 3);
  noLoop();

  // Initialize the previous spectrum with zeros
  previousSpectrum = new Array(512).fill(0);
}

function draw() {
  // Clear the background
  background(0);
  var spectrum = fft.analyze();
  translate(width / 2, height / 2);

  // Get the audio amplitude in a specific frequency range
  amp = fft.getEnergy(20, 200);

  // Calculate the spectral centroid
  spectralCentroid = fft.getCentroid();

  // Rotate the image if the amplitude is high
  push();
  if (amp > 230) {
    rotate(random(-1, 1));
  }
  image(img, 0, 0, width + 100, height + 100);
  pop();

  // Draw a background shape
  colorMode(RGB);
  fill(33);
  noStroke();
  rect(0, 0, width, height);
  colorMode(HSB);

  strokeWeight(3);
  noFill();

  // Calculate Spectral Flux
  var spectralFlux = 0;
  for (var i = 0; i < spectrum.length; i++) {
    var flux = spectrum[i] - previousSpectrum[i];
    spectralFlux += flux > 0 ? flux : 0;
  }
  previousSpectrum = spectrum.slice(); // Update the previous spectrum

  // Draw spectral lines
  for (var i = 0; i < spectrum.length; i += 6) {
    var angle = map(i, 1, spectrum.length, 0, 360) - 90;
    var amp2 = spectrum[i];
    var r = map(amp2, 0, 256, 80, 250);
    var x = r * sin(angle);
    var y = r * cos(angle);

    line(0, 0, x, y);
    line(x * 1.05, y * 1.05, x * 1.06, y * 1.06);
    stroke(i / 1.4, 200, 200);
  }
  noStroke();
  colorMode(RGB);
  fill(33);
  circle(0, 0, 155);

  // Display the spectral centroid and spectral flux values
  fill(255);
  textSize(18);
  text('Spectral Centroid: ' + round(spectralCentroid) + ' Hz', 150, 20);
  text('Spectral Flux: ' + round(spectralFlux), 150, 40);
}

function mouseClicked() {
  // Handle mouse click to play or pause the song
  if (song.isPlaying()) {
    song.pause();
    noLoop();
  } else {
    song.play();
    loop();
  }
}
