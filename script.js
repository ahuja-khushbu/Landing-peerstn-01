// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Locomotive Scroll
const locoScroll = new LocomotiveScroll({
  el: document.querySelector(".smooth-scroll"),
  smooth: true,
  // Optional: adjust multiplier and class if needed
  // multiplier: 1,
  // class: "is-reveal",
});

// Update ScrollTrigger on Locomotive Scroll
locoScroll.on("scroll", ScrollTrigger.update);

// ScrollTrigger proxy setup for Locomotive Scroll
ScrollTrigger.scrollerProxy(".smooth-scroll", {
  scrollTop(value) {
    return arguments.length
      ? locoScroll.scrollTo(value, 0, 0)
      : locoScroll.scroll.instance.scroll.y;
  },
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
  pinType: document.querySelector(".smooth-scroll").style.transform
    ? "transform"
    : "fixed",
});

// Add markers for debugging
// Note: Remove or comment out in production
// ScrollTrigger.defaults({ markers: true });

// Refresh ScrollTrigger and LocomotiveScroll after setup
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
ScrollTrigger.refresh();

// Canvas Setup
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

setCanvasSize();

window.addEventListener("resize", function () {
  setCanvasSize();
  render();
});

// Generate image URLs
function files(index) {
  const baseUrl = "https://zelt.app/assets/img/home/hero/sequence/mobile/";
  return `${baseUrl}${index + 1}.webp`;
}

const frameCount = 118; // Set to 10 for initial testing
const images = [];
const imageSeq = { frame: 0 };

// Preload images and verify loading
let loadedImages = 0;
for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = files(i);
  img.onload = () => {
    loadedImages++;
    console.log(`Image ${i + 1} loaded (${loadedImages}/${frameCount})`);
    if (loadedImages === frameCount) {
      console.log("All images loaded.");
      render(); // Initial render after all images are loaded
    }
  };
  img.onerror = () => {
    console.error(`Image failed to load: ${files(i)}`);
  };
  images.push(img);
}

// Animate frames based on scroll position
gsap.to(imageSeq, {
  frame: frameCount - 1,
  snap: "frame",
  ease: `none`,
  scrollTrigger: {
    scrub: 0.15,
    trigger: ".page1",
    start: `top top`,
    end: `200% top`, // Adjust based on scrollable content
    scroller: `.smooth-scroll`,
    markers: false,
    onUpdate: () => {
      console.log(`Current frame: ${Math.round(imageSeq.frame)}`);
      render();
    },
  },
});

// Render function
function render() {
  const img = images[Math.round(imageSeq.frame)];
  if (img) {
    // Draw the image on the canvas
    scaleImage(img, context);
  } else {
    console.warn(`No image found for frame: ${Math.round(imageSeq.frame)}`);
  }
}

// Function to scale and center the image on the canvas
function scaleImage(img, ctx) {
  const canvas = ctx.canvas;
  const hRatio = canvas.width / img.width;
  const vRatio = canvas.height / img.height;
  const ratio = Math.max(hRatio, vRatio);
  const centerShift_x = (canvas.width - img.width * ratio) / 2;
  const centerShift_y = (canvas.height - img.height * ratio) / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    centerShift_x,
    centerShift_y,
    img.width * ratio,
    img.height * ratio
  );
}

// ScrollTrigger to pin the canvas element
ScrollTrigger.create({
  trigger: ".page1",
  pin: true,
  scroller: `.smooth-scroll`,
  start: `top top`,
  end: `200% top`, // Adjust based on scrollable content
  markers: false,
});
