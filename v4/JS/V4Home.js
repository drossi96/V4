// ===========================
// Rainbow Record Home Link Hover / Focus Rotate Scripts
// ===========================

// Select all nav items with class 'navHomeCenterItem'
document.querySelectorAll('.navHomeCenterItem').forEach(item => {

  // Select the rotating image inside this nav item
  const img = item.querySelector('.navHomeImage');

  // Select the static center circle element
  const circle = item.querySelector('.navHomeCircleCenter');

  // ID for requestAnimationFrame to control animation loop
  let animationFrameId;

  // Current rotation of the image in degrees
  let rotation = 0;

  // Rotation speed per frame
  let rotationSpeed = 1;

  // Tracks if item is hovered/focused
  let isActive = false;

  // Current scale for smooth scale animation
  let currentScale = 1;

  // Speed of scale animation interpolation
  const scaleIncrement = 0.05;

  // ---------------------------
  // Function: Get Y translation of image based on screen width
  // ---------------------------
  function getTranslateY() {
    const width = window.innerWidth;  // Get current viewport width

    if (width <= 767) return null; // Hide transforms on small screens

    // Return different Y translation values depending on width breakpoints
    if (width >= 1920) return '6vh';
    if (width >= 1875) return '16vh';
    if (width >= 1740) return '15vh';
    if (width >= 1680) return '14vh';
    if (width >= 1580) return '15vh';
    if (width >= 1470) return '14vh';
    if (width >= 1400) return '13vh';
    if (width >= 1270) return '12.5vh';
    if (width >= 1200) return '12vh';
    if (width >= 1175) return '10vh';
    if (width >= 992) return '9vh';
    if (width >= 820) return '8vh';
    if (width >= 768) return '6vh';

    return '11vh'; // Default translation
  }

  // ---------------------------
  // Function: Update transform of image and circle
  // ---------------------------
  function updateTransform() {
    const translateY = getTranslateY(); // Get Y translation

    if (translateY === null) {
      // If small screen, remove transforms
      img.style.transform = '';
      if (circle) circle.style.transform = '';
      return;
    }

    // Target scale: larger when hovered
    const targetScale = isActive ? 1.07 : 1;

    // Smoothly interpolate current scale towards target
    currentScale += (targetScale - currentScale) * scaleIncrement;

    // Apply translation, rotation, and scaling to image
    img.style.transform = `translateY(${translateY}) rotate(${rotation}deg) scale(${currentScale})`;

    // Keep circle aligned vertically
    if (circle) {
      circle.style.transform = `translateY(${translateY})`;
    }
  }

  // ---------------------------
  // Function: Animate rotation
  // ---------------------------
  function animate() {
    rotation = (rotation + rotationSpeed) % 360; // Increment rotation

    updateTransform(); // Apply transforms

    if (!isActive) {
      rotationSpeed *= 0.95; // Slow down rotation gradually if not active
      if (rotationSpeed < 0.01) rotationSpeed = 0; // Stop if very slow
    } else {
      rotationSpeed = 1; // Reset speed if hovered/focused
    }

    // Continue animation loop
    animationFrameId = requestAnimationFrame(animate);
  }

  // ---------------------------
  // Event handlers: activate/deactivate on hover/focus
  // ---------------------------
  const activate = () => {
    isActive = true; // Set active state
    if (!animationFrameId) animate(); // Start animation if not running
  };

  const deactivate = () => {
    isActive = false; // Stop active state
    // Scaling back handled smoothly in updateTransform
  };

  // Mouse hover events
  item.addEventListener('mouseenter', activate);
  item.addEventListener('mouseleave', deactivate);

  // Keyboard focus events
  item.addEventListener('focus', activate);
  item.addEventListener('blur', deactivate);
  item.addEventListener('focusin', activate);  // focus-within support
  item.addEventListener('focusout', deactivate);

  // Update transforms on window resize
  window.addEventListener('resize', () => {
    if (!animationFrameId) updateTransform(); // Update if not animating
  });

  // Initialize transforms on page load
  updateTransform();
});

// ===========================
// Font Cycling inside Circle
// ===========================

// Array of font-family options
const fonts = [
  '"Limelight", sans-serif',
  '"Fascinate", system-ui',
  '"Monoton", sans-serif',
  '"Kavoon", serif',
  '"Rubik Wet Paint", system-ui',
  '"Lobster", sans-serif',
  '"Pacifico", cursive',
  '"Cherry Bomb One", system-ui',
  '"Diplomata SC", serif',
  '"Bungee Hairline", sans-serif',
  '"Condiment", cursive',
  '"Meddon", cursive',
  '"Rubik Glitch", system-ui',
  '"Rubik Puddles", system-ui'
];

// Target text element in circle
const textElement = document.querySelector('.navHomeCircleCenter span');

// Function: Cycle fonts randomly
function cycleFonts() {
  const cycleList = [];
  for (let i = 0; i < 10; i++) {
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)]; // Pick random font
    cycleList.push(randomFont); // Add to cycle list
  }

  let index = 0;
  const interval = setInterval(() => {
    textElement.style.fontFamily = cycleList[index]; // Change font
    index++;
    if (index >= cycleList.length) {
      clearInterval(interval); // Stop interval

      const finalFont = fonts[Math.floor(Math.random() * fonts.length)];
      textElement.style.fontFamily = finalFont; // Set final font

      setTimeout(cycleFonts, 2000); // Restart cycle after 2s
    }
  }, 50); // Speed of cycling
}

// Start cycling when page loads
document.addEventListener('DOMContentLoaded', () => {
  cycleFonts();
});

// ===========================
// Scroll-based Transform for Center Items
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  const TRIGGER = 25; // px scrolled to trigger transform

  // Rules for different screen widths
  const RULES = [
    { min: 1920, translateY: '-3.5vh', scale: 0.60 },
    { min: 1875, translateY: '-6vh', scale: 0.35 },
    { min: 1740, translateY: '-6vh', scale: 0.40 },
    { min: 1680, translateY: '-5.5vh', scale: 0.40 },
    { min: 1580, translateY: '-6vh', scale: 0.40 },
    { min: 1470, translateY: '-6.5vh', scale: 0.45 },
    { min: 1400, translateY: '-6.5vh', scale: 0.50 },
    { min: 1270, translateY: '-7vh', scale: 0.55 },
    { min: 1200, translateY: '-6.75vh', scale: 0.55 },
    { min: 1175, translateY: '-6.25vh', scale: 0.60 },
    { min: 992, translateY: '-6vh', scale: 0.65 },
    { min: 820, translateY: '-5vh', scale: 0.70 },
    { min: 768, translateY: '-3vh', scale: 0.65 },
    { min: 0, translateY: '-5.25vh', scale: 0.45 } // default
  ];

  // Get the first rule matching current width
  function getRuleForWidth(width) {
    for (let r of RULES) {
      if (width >= r.min) return r;
    }
    return RULES[RULES.length - 1]; // fallback
  }

  const centerItems = document.querySelectorAll('.navHomeCenterItem');

  // Store original transform and add smooth transition
  centerItems.forEach(item => {
    const cs = window.getComputedStyle(item);
    item.dataset.originalTransform = cs.transform === 'none' ? '' : cs.transform;
    item.style.transition = 'transform 0.5s'; // smooth movement
  });

  // Apply transform based on scroll
  function applyScrollTransforms() {
    const scrollY = window.scrollY;
    const width = window.innerWidth;
    const rule = getRuleForWidth(width);

    centerItems.forEach(item => {
      if (scrollY >= TRIGGER) {
        item.style.transform = `translate(0, ${rule.translateY}) scale(${rule.scale})`;
      } else {
        item.style.transform = item.dataset.originalTransform; // reset
      }
    });
  }

  // Event listeners
  window.addEventListener('scroll', applyScrollTransforms, { passive: true });
  window.addEventListener('resize', applyScrollTransforms);
  applyScrollTransforms(); // run once on load
});

// ===========================
// Radial Links Letter Rotation
// ===========================

// Select all radial link slices
document.querySelectorAll('.radial-link').forEach(slice => {
  const text = slice.querySelector('span').textContent; // get original text
  slice.querySelector('span').textContent = ''; // clear text

  const letters = text.split(''); // split text into letters
  const span = slice.querySelector('span');

  const outerRadius = 155; // distance from center
  const sliceAngle = 90; // each quadrant
  let sliceOffset = 0;

  // Determine quadrant based on class
  if (slice.classList.contains('radial-link-1')) sliceOffset = 0;
  if (slice.classList.contains('radial-link-2')) sliceOffset = 90;
  if (slice.classList.contains('radial-link-3')) sliceOffset = 180;
  if (slice.classList.contains('radial-link-4')) sliceOffset = 270;

  const padding = 10; // padding from slice edges
  const startAngle = sliceOffset + padding;
  const endAngle = sliceOffset + sliceAngle - padding;

  letters.forEach((letter, i) => {
    const letterSpan = document.createElement('span'); // create span for each letter
    letterSpan.textContent = letter; // set letter

    // Calculate rotation angle for letter
    const angle = startAngle + (i / (letters.length - 1)) * (endAngle - startAngle);

    const verticalShift = 0; // vertical adjustment

    // Position each letter absolutely around circle
    letterSpan.style.position = 'absolute';
    letterSpan.style.left = '50%';
    letterSpan.style.top = '50%';
    letterSpan.style.transform = `
      rotate(${angle}deg)
      translate(${outerRadius}px, ${verticalShift}px)
      rotate(90deg)
    `;
    letterSpan.style.transformOrigin = '0 0';
    letterSpan.style.fontFamily = '';
    letterSpan.style.fontWeight = 'bold';
    letterSpan.style.fontSize = '3.25vh';
    letterSpan.style.color = 'white';
    letterSpan.style.textShadow = '1px 1px 1px black';

    span.appendChild(letterSpan); // add to DOM
  });
});

// ===========================
// Radial Links Rotation & Hover
// ===========================

const navHomeCircleItem = document.querySelector('.navHomeCenterItem'); // main circle
const radialLinks = document.querySelector('.radial-links'); // all radial links container

if (radialLinks) { // only if element exists
  let rotation = 0; // rotation value
  let speed = 0; // current rotation speed
  let targetSpeed = 0; // desired speed
  let hideTimeout; // for delayed hiding

  // Animation loop for rotating radial links
  function animate() {
    if (window.getComputedStyle(radialLinks).display !== 'none') { // only if visible
      rotation += speed; // increment rotation
      radialLinks.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`; // apply rotation
      speed += (targetSpeed - speed) * 0.02; // smooth acceleration/deceleration
    }
    requestAnimationFrame(animate); // loop
  }

  animate(); // start animation loop

  // Update hover state
  function updateHoverState() {
    if (window.getComputedStyle(radialLinks).display !== 'none') { // only if visible
      if (navHomeCircleItem.matches(':hover') || radialLinks.matches(':hover')) {
        radialLinks.style.opacity = 1; // show
        radialLinks.style.pointerEvents = 'auto'; // enable interaction
        targetSpeed = -0.5; // set rotation speed
        if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null; }
      } else {
        targetSpeed = 0; // stop rotation
        if (!hideTimeout) {
          hideTimeout = setTimeout(() => {
            radialLinks.style.opacity = 0; // hide
            radialLinks.style.pointerEvents = 'none'; // disable interaction
          }, 500); // delay hide
        }
      }
    }
  }

  // Attach hover events
  navHomeCircleItem.addEventListener('mouseenter', updateHoverState);
  navHomeCircleItem.addEventListener('mouseleave', updateHoverState);
  radialLinks.addEventListener('mouseenter', updateHoverState);
  radialLinks.addEventListener('mouseleave', updateHoverState);
}











  




const toggle = document.querySelector('.mobile-menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

// Toggle menu on click
toggle.addEventListener('click', () => {
  mobileNav.classList.toggle('active');
});

// Toggle menu on keyboard (Enter or Space)
toggle.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();           // prevent scrolling for Space
    mobileNav.classList.toggle('active');
  }
});

