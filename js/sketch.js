var img;
var imgScale = 10;
var imgWidthScale, imgHeightScale;
var fixedAplha = 150;
var particles = [];
var numParticles = 500;

var nScale = 2000;
var nStrength = 60;
var imgPath = "";
var imgs = [];
var song = "";

var useList = true;
var title = document.querySelector(".title");
var emoji = "💗";

var mintime = 40;
var maxtime = 100;
var randomTime = ((Math.random() * maxtime) + mintime) * 1000;
var changeInterval = setInterval(changeImage, Math.floor(randomTime));

console.log("newest version");
console.log("changing interval");


function choose(list){
	return list[Math.floor(Math.random() * list.length)];
}


function changeImage(){
	img = choose(imgs);
}

function setImages() {
	imgs[0] = loadImage(encoded[0], imageLoaded, imageNotLoaded);
	imgs[1] = loadImage(encoded[1], imageLoaded, imageNotLoaded);
	imgs[2] = loadImage(encoded[2], imageLoaded, imageNotLoaded);
	imgs[3] = loadImage(encoded[3], imageLoaded, imageNotLoaded);
}


function preload() {
	setImages();
	if (useList) {
  		song = loadSound('./music/sound.mp3');
		img = choose(imgs);
	} else {
		img = loadImage('./img/sanjay.png', imageLoaded, imageNotLoaded);
	}
}


function mousePressed() {
	song.playMode('untilDone');
	song.setVolume(0.5);
	song.play();
}

function setup() {

	if (useList) {
		title.innerText = "SanJay";
		createCanvas(640, 480);
	}
	
	pixelDensity(1);

	// for now
	// resize to canvas width & height and shrink the image by the imgScale
	var imgWidth = width / imgScale;
	var imgHeight = height / imgScale;
	img.resize(imgWidth, imgHeight);
	
	// generate new particles  0 0
	for (var i = 0; i < numParticles; ++i) {
		var particle = new Particle(random(width), random(height));
		particles.push(particle);
	}

	background(255, 247, 247);
	frameRate(80);
}


function draw() {
	for (var i = 0; i < numParticles; ++i) {
		particles[i].update();
		particles[i].show();
	}
}


function Particle(x, y) {
	this.x = x;
	this.y = y;
	this.r = 3;
	this.newObject = -1;
	// color values
	this.prevColor = 0;
	this.currentColor = 0;
	// coordinates
	this.xPrev = x;
	this.yPrev = y;
	// for the sake of distortions
	// ============================
	this.z = random(0.02, 0.08);
	this.speed = random(5, 15);
	this.angle = 0;
	this.edgeValue = 20;


	this.update = function() {

		// store current x and y to previous
		if (this.newObject > 0) {
			this.xPrev = this.x;
			this.yPrev = this.y;
		}

		// using random distortion calculate new coordinates
		// ========================================================
		if (random() > .89) {
			this.x += random(-5, 5);
			this.y += random(-5, 5);
		} else {
		// or
		this.angle = noise(this.x/nScale, this.y/nScale, this.z) * nStrength;
		this.x += cos(this.angle) * this.speed;
		this.y += sin(this.angle) * this.speed;
		}
		this.bounds();
		this.z += 0.005;


		// increment new object indicator
		if (this.newObject < 1) {
			this.newObject += 1;
		}
	}

	this.bounds = function() {
		this.x = constrain(this.x, this.edgeValue, width-this.edgeValue);
		this.y = constrain(this.y, this.edgeValue, height-this.edgeValue);
	}

	this.show = function() {
		noStroke();
		var px = floor(this.x / imgScale);
		var py = floor(this.y / imgScale);
		var col = img.get(px, py);
		
		// analyze colors
		if (col[0] == 255 && col[1] == 255 && col[1] == 255) {
			col[0] = 255;
			col[1] = 247;
			col[2] = 247;
		}

		// methods of data visualization
		// =========================================	
		if (this.newObject > 0) {
			// draw line from prev x, y to current x, y
			stroke(col[0], col[1], col[2], 100);
			strokeWeight(this.r * this.angle / nStrength);
			line(this.xPrev, this.yPrev, this.x, this.y);
		} else {
			// draw ellipse
			fill(col[0], col[1], col[2], fixedAplha);
			ellipse(this.x, this.y, this.r, this.r);
		}


	}
}





// callbacks
function imageLoaded(){
	console.log("[+] Image loaded successfully.")
}
function imageNotLoaded(){
	console.log("[!] Image was not loaded correctly.")
}
