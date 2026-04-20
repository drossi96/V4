


// BEGIN top pop up message close

const topCloseBtn = document.querySelector(".TOPmessagePopUpCLOSE");
const topPopup = document.querySelector(".TOPmessagePopUp");
const nav = document.querySelector(".mainNav");

if (topCloseBtn && topPopup) {
    topCloseBtn.addEventListener("click", () => {
        topPopup.style.display = "none";

        if (nav) {
            nav.classList.remove("withPopUp");
        }
    });
}

// END top pop up message close



// BEGIN full page popup

const fullPagePopUp = document.querySelector(".fullPagePopUp");
const fullPagePopUpClose = document.querySelector(".fullPagePopUpClose");
const storeLinks = document.querySelectorAll(".storeLink");

// show popup when clicking future store links
if (fullPagePopUp && storeLinks.length > 0) {
    storeLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            fullPagePopUp.classList.add("show");
        });
    });
}

// close popup when clicking red X
if (fullPagePopUp && fullPagePopUpClose) {
    fullPagePopUpClose.addEventListener("click", () => {
        fullPagePopUp.classList.remove("show");
    });
}

// END full page popup








































// shared layout rules for rainbow record image, center circle, radial links, and scrolled nav item





const NAV_LAYOUT_RULES = [ //array for breakpoints... logoY moves the center logo by vh on default load.... scrolledY scrols 
  { min: 1920, logoY: '6vh', scrolledY: '-3.5vh', scrolledScale: 0.60 },
  { min: 1400, logoY: '13vh', scrolledY: '-6.5vh', scrolledScale: 0.50 },
  { min: 1200, logoY: '12vh', scrolledY: '-6.75vh', scrolledScale: 0.55 },
  { min: 992, logoY: '9vh', scrolledY: '-6vh', scrolledScale: 0.65 },
  { min: 768, logoY: '6vh', scrolledY: '-3vh', scrolledScale: 0.65 },
  { min: 0, logoY: null, scrolledY: '-5.25vh', scrolledScale: 0.45 }
];

function getNavLayoutRule() { //c reusable function> returns the correct breakpoint rule for the current screen width.
  const width = window.innerWidth; //store  current  viewport width in  variable  'width'.

  for (const rule of NAV_LAYOUT_RULES) { //loops through each object inside the NAV_LAYOUT_RULES array (seen above) from top to bottom.
    if (width >= rule.min) return rule; //checks if CURRENT width is greater than OR EQUAL to each rule's min width, starting w/ largest breakpoint
    //when it finds the first rule where width is greater than or equal to rule.min, it returns the entire individual rule object 
  } //ends loop.

  return NAV_LAYOUT_RULES[NAV_LAYOUT_RULES.length - 1]; //if nothing matched (meaning width is between two width rules in array) 
  //  it will return BACK (-1) to the last accepted rule in array as fallback ******
}

//because rules are ordered from largest to smallest widths, it basically returns the rule for the largest breakpoint that does NOT exceed current width

//IE... if screen width is 1050px, use the layout found in the nav_layout_rules array above, it will return to the 992 rule.  
// bc 1050 is greater than 992 but less than 1200, it will return the rule for the biggest width breakpoint that does NOT exceed current width.... 
// 1050 is greater than OR equal to 992 but NOT greater tahn or equal to 1200, it will return the rule for the biggest breakpoint that does NOT exceed current width

//***If the screen width is 1050px, it is greater than or equal to 992px but not greater than or equal to 1200px...
//... so the function returns the rule for the largest breakpoint that does not exceed the current width, which is the 'min: 992...' rule.








function getImageTransform(rotationValue = 0, scaleValue = 1) { //*****START HERER MARCH 12th */ function that builds full css translform string for rainbow record image...accepting rotationValue (default val 0) and scaleValue (default val 1)
  const rule = getNavLayoutRule(); //gets current active layout based on screen width from navlayoutrule array ^^^ FOUND above
  if (rule.logoY === null) return ''; //if this breakpoint says logo should NOT be positoned (=== means STRICT equality) , return empty transform string
  return `translateY(${rule.logoY}) rotate(${rotationValue}deg) scale(${scaleValue})`; //builds one css transform string that 1)moves image vertically, 2) rotates, 3 )  scales
}

function getCircleTransform() { //center circle vertical transform
  const rule = getNavLayoutRule();// gets current breakpoint rule from array above ^^^^^
  if (rule.logoY === null) return '';// If there is no logo offset for this screen size, return an empty transform.(NO TRANSFORM)
  return `translateY(${rule.logoY})`; //return css transform that ONLY moves center circle vertically
}

function getRadialTransform(rotationValue = 0) { // builds transform string for radial links container (behidn rainbow record 'vinyl,vibes,etc...')
  const rule = getNavLayoutRule(); // gets current matching breakpoint of layout rule. found in array above ^^^
  if (rule.logoY === null) return '';// If there is no logo offset for this screen size, return an empty transform. (NO transform)
  return `translate(-50%, calc(-50% + ${rule.logoY})) rotate(${rotationValue}deg)`; //3 part transform string that centers radial container in middle of circle (-50% X , -50% Y..), THEN adds vertical offset to Y positoin, THEN rotates whole radial container
}

function getScrolledNavItemTransform() { // for transform applied to .navHomeCenterItem AFTER page is scrolled
  const rule = getNavLayoutRule(); // gets current ACTIVE breakpoint rule from NAV_LAYOUT_RULES array 
  return `translate(0, ${rule.scrolledY}) scale(${rule.scrolledScale})`; //builds&returns css transform string for scrolled parent Item from array
}











// Below selects all items ONLY with the class 'navHomeCenterItem'
document.querySelectorAll('.navHomeCenterItem').forEach(item => {

  //  declares selects only the rotating image inside this nav item
  const img = item.querySelector('.navHomeImage');

  // declares / Selects only the static center circle gradient element
  const circle = item.querySelector('.navHomeCircleCenter');

  if (!img) return;

  // name animation to control whole animation loop
  let animationFrameId;

  let rotation = 0;

  // Rotation sped per frame
  let rotationSpeed = 1;

  //  if item is hovered/focused on by mouse/tab ////
  let isActive = false;

  // Current scale for smooth scale animation
  let currentScale = 1;

  // Speed of scale animation interpolation
  const scaleIncrement = 0.05;

  //end naming tags and inside navHomeCenterItem


  // BEGIN Function: Update transform of image and circle... rotating and slightl increase size.

  function updateTransform() { // function  'updateTransform' used below in other functions.///  updates rainbow record image and center circle while hovering/ rotating
    const rule = getNavLayoutRule(); //gets // gets current matching breakpoint of layout rule. found in array above ^^^

    // If small screen size -- less than 768px, remove transforms
    if (rule.logoY === null) { // If there is no logo offset for this screen size, return an empty transform. (NO transform)
      img.style.transform = ''; //clears the image's transform
      if (circle) circle.style.transform = ''; //if the center circle exists, clear its transform aswell. 
      return; //exits function as early as possible bc there is nothing else to do. 
    } /// end of null-check block

    // scale rainbow record image slighly larger when hovered
    const targetScale = isActive ? 1.06 : 1; //if item (rainbow record image only) is active, such as hovered/focused, makes it a slightly larger size

    currentScale += (targetScale - currentScale) * scaleIncrement; //smoothly eases the scale value towards target scale (1.06) instead of instantly jumping
    // currentscale AND scaleIncrement are BOTH created at top of page


    img.style.transform = getImageTransform(rotation, currentScale); // Apply generated transform string to rainbow record image

    if (circle) { //if center circle exists (not on small screens) , then apply its matching vertical transform.
      circle.style.transform = getCircleTransform(); //getCircleTransform is function defined above ^^ use ctrl+f
    }
  } /// END of 'updateTRANSFORM


  // END Function: Update transform of image and circle...  rotating and slightl increase size.


  // BEGIN rotation animation Function when hovering

  function animate() {  //declares function name as 'animate'//
    rotation = (rotation + rotationSpeed) % 360; // incremental full 360 circular rotation //

    updateTransform(); // Apply 'updatetransform' function from above.

    if (!isActive) { //if update transform function written above is CURRENTLY NOT ACTIVE (!active), then will slow down
      rotationSpeed *= 0.95; // Slow down rainbow record logo rotation speed exponentially gradually decline (*=) if not active.. doesnt stp immediately
      if (rotationSpeed < 0.01) rotationSpeed = 0; // Stop completely if very slow
    } else {
      rotationSpeed = 1; // Reset speed back to 1.0 if hovered/focused by mouse /tab.
    }

    // Continue animation loop
    animationFrameId = requestAnimationFrame(animate); //declares 'animationframeID' as frame id of the 'animate' function.
  }

  const activate = () => {
    isActive = true; // declares  activate as active state
    if (!animationFrameId) animate(); // Start animation loop if not currently running//
  };

  const deactivate = () => { //declares deactive state
    isActive = false;
    // when deactive runs, informs that youre not interacting anymore.
  };

  // Mouse hover events
  item.addEventListener('mouseenter', activate); //mouse enters the navItem
  item.addEventListener('mouseleave', deactivate); //mouse LEAVES

  // Keyboard focus events
  item.addEventListener('focus', activate);
  item.addEventListener('blur', deactivate);
  item.addEventListener('focusin', activate);
  item.addEventListener('focusout', deactivate);

  // Update transforms on window resize.... so if the window resizes and the animation is idle, updates transform so that (cont)
  //  (cont ^) translateY is recalculated, scale is recalculate, and there is no janky jumps or misalignment.
  window.addEventListener('resize', () => {
    if (!animationFrameId) updateTransform(); // Update if not animating
  });

  updateTransform();  // Initialize transforms on page load

}); //END ALL ROTATING RAINBOW RECORD IMAGE... DOES NOT INCLUDE HIDDEN CIRCULAR TEXT BEHIND. found below//




// begin HIDDEN CIRCULAR TEXT BEHIND. 'vogue vibes, etc.' // start here.

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

// declares the span text 'v4' inside the navHomeCircleCenter div'
const textElement = document.querySelector('.navHomeCircleCenter span');

//
function cycleFonts() {
  if (!textElement) return;

  const cycleList = []; //array for cycle sequence
  for (let fontcyclecount = 0; fontcyclecount < 10; fontcyclecount++) { //3 part purple 'for loop seperated by semicolon repeats the below blocks. starts 'fontcyclecount' at 0, will loop as long as i is less than 10, and each time the block runs, increase i by 1. hence
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)]; // fonts array (starting at 0 and ending at 13. 14 total values) and each element is a string. 'fonts.length' is number of available fonts... 'math.random()' specifically returns number between 0 and 13.99. will never return 14.0 randomly picked...but we need integers(whole numbers) then (* fonts.legnth) stretches to the array size. and "Math.floor(Math.random() * fonts.length" gives a random number from 0 to 13, which are the array values of the total amount of fonts. math.floor rounds down to the nearest whole number.... Takes a random fractional position in the fonts array and snap it down to the nearest whole slot number.
    cycleList.push(randomFont); // adds the result of the constant 'randomfont' declared to the cycle list.
  }

  let index = 0; //starts on first font in array.
  const interval = setInterval(() => { //
    textElement.style.fontFamily = cycleList[index]; //start here again.  Change the span html tag named above as 'textElemt" . changes specifically the font familiy of the tag. and applies to the font at position of the index in 'cycleList'
    index++; //increases to the next font in the interval tick.
    if (index >= cycleList.length) { //if index has increases / reached value that is higher than / at the end of the list, it stops
      clearInterval(interval); // Stop interval from looping

      const finalRandomFont = fonts[Math.floor(Math.random() * fonts.length)]; //picks final font from result.
      textElement.style.fontFamily = finalRandomFont; // Set final font

      setTimeout(cycleFonts, 1500); // Restart cycle after 1.5s
    }
  }, 50); // Speed of cycling anmation in ms
}

// Start cycling immediately when page loads
document.addEventListener('DOMContentLoaded', () => {
  cycleFonts();
});

//END V4 LOGO TEXT FONT CYCLING //


//BEGIN logo scaling and transforming when scrolling.
document.addEventListener('DOMContentLoaded', () => {
  const SCROLLTRIGGERAMT = 25; // px scrolled to trigger transform after 25px



  const centerItems = document.querySelectorAll('.navHomeCenterItem'); //declares all elements in .navhomecenteritem as 'centeritems'

  // Store original transform and add smooth transition
  centerItems.forEach(item => {  // goes   through each element in center items and assigns each element to the variable item one at a time.
    const cs = window.getComputedStyle(item); //reads final css styles of element (css,inline,mediaqueries,etc.) - js must know the current transform styles before changing it
    item.dataset.originalTransform = cs.transform === 'none' ? '' : cs.transform; //checks if element has a transform, if it has none, save as an empty string.. otherwise save as an empty string. SO that default css styles can be restored when you scroll back up.
    item.style.transition = 'transform 0.5s'; // smooth movement with a length of half a sec.
  });

  // move logo into nav space when scroll
  function applyScrollTransforms() { //moves and scales .navhomecenteritem when page scrolls (SCROLLTRIGGERAMT----defined above px scroll amt to move rainbow record nav item)
    const scrollY = window.scrollY; //reads howmany px down page is scrolled

    centerItems.forEach(item => { //loops through each item in .navHomeCenterItem. 
      if (scrollY >= SCROLLTRIGGERAMT) { //check that page has scrolled past at the very least, the trigger amuont constant of SCROLLTRIGGERAMT (25px)
        item.style.transform = getScrolledNavItemTransform(); // if YES, it HAS indeed scrolled past trigger amt, apply function of 'scrollTransformForm'
      } else { //otherwise....
        item.style.transform = item.dataset.originalTransform; //...applies originalTransform--(restore OG transform form)*works scrolling up too 
      }
    }); //ends looping through each item in navHomeCenterItem
  } // stop function 'applyScrollTransform'

  // Event listeners ************** structure below for eventlistener parenthesis...(event,function,options) 
  window.addEventListener('scroll', applyScrollTransforms, { passive: true }); //when page/window scrolls, runs function 'applyscrolltransform' ...passive true ensures that this specific eventlistener wil NEVER block scrolling (by waiting anc checking  AFTER user scrolls to check if scripts will stop scrolling...) uses on like a mobile user swipes on a carousel carousel content- you dont want slight vertical movements to interfere with the goal of sliding carousel leftAndRight)... allows for smoother user experirnce, lower latency, fewer dropped frames. also passive listners help browser move scrolling to compositer thread, meaning scrolling can happen even if main JS thread is busy....so if there is heavy js work on page, scrolling still happens smoothly.
  window.addEventListener('resize', applyScrollTransforms); //tells browser when page/window size changes, run function 'applyScrollTransforms()'
  applyScrollTransforms(); // run applyscrolltransforrms once on load BY DEFAULT  
});




//begin radial links on logo rotation.



function buildRadialLettering() {
  // Select every radial slice
  document.querySelectorAll('.radial-link').forEach(slice => {
    const span = slice.querySelector('span');
    if (!span) return;

    // Preserve original text for rebuilds on resize
    const originalText = span.dataset.originalText || span.textContent;
    span.dataset.originalText = originalText;
    span.textContent = '';

    const letters = originalText.split('');

    // Measure actual rendered radial circle size in px
    const radialContainer = slice.closest('.radial-links');
    const radialSize = radialContainer && radialContainer.offsetWidth > 0
      ? radialContainer.offsetWidth
      : 300;

    // -----------------------------
    // MASTER RATIOS
    // -----------------------------
    // All of these are based on radialSize, which is in px.
    // This keeps the lettering tied to the real circle size,
    // instead of manually chasing viewport breakpoints.

    const dynamicFontSize = Math.max(18, radialSize * .1); // px
    const outerRadius = radialSize * 0.525; // px
    const padding = 12; // degrees
    const verticalShift = dynamicFontSize * -0.16; // px








    // Each quadrant is 90 degrees
    const sliceAngle = 90;
    let sliceOffset = 0;

    if (slice.classList.contains('radial-link-1')) sliceOffset = 0;
    if (slice.classList.contains('radial-link-2')) sliceOffset = 90;
    if (slice.classList.contains('radial-link-3')) sliceOffset = 180;
    if (slice.classList.contains('radial-link-4')) sliceOffset = 270;

    const startAngle = sliceOffset + padding;
    const endAngle = sliceOffset + sliceAngle - padding;

    letters.forEach((letter, i) => {
      const letterSpan = document.createElement('span');
      letterSpan.textContent = letter;

      const angle =
        startAngle +
        (i / Math.max(letters.length - 1, 1)) * (endAngle - startAngle);

      letterSpan.style.position = 'absolute';
      letterSpan.style.left = '50%';
      letterSpan.style.top = '50%';

      // Keep this transform order exactly like this
      letterSpan.style.transform = `
        rotate(${angle}deg)
        translate(${outerRadius}px, ${verticalShift}px)
        rotate(90deg)
      `;

      letterSpan.style.transformOrigin = '0 0';
      letterSpan.style.fontWeight = 'bold';
      letterSpan.style.fontSize = `${dynamicFontSize}px`;
      letterSpan.style.color = 'white';
      letterSpan.style.textShadow = '1px 1px 1px black';

      span.appendChild(letterSpan);


      
    });
  });
}

document.addEventListener('DOMContentLoaded', buildRadialLettering);
window.addEventListener('resize', buildRadialLettering);






// Radial Links Rotation & Hover


const navHomeCircleItem = document.querySelector('.navHomeCenterItem'); // main circle
const radialLinks = document.querySelector('.radial-links'); // all radial links container

if (navHomeCircleItem && radialLinks) { // only if element exists, prevents JS errors if elemeent(s) are missing
  let rotation = 0; // the current rotation value of 360.
  let speed = 0; // thecurrent rotation speed/// measured in degrees rotated per frame.
  let targetSpeed = 2; // desired speed will reach // // set to 2 so that it will rotate one way fast, then the other slow. // *******
  let hideTimeout; // for delayed hiding when you take the cursor off the logo. // its ok that hideTimeout doesnt have a value declared bc it will later store the ID value returned by 'setTimeout' When first declared, it’s undefined, which lets your code check if (hideTimeout) to see whether a hide timer is already active. Once setTimeout(...) runs, it assigns its generated timer ID to hideTimeout, so you can cancel it later with clearTimeout(hideTimeout).

  // BEGIN MASTER Animation loop for rotating radial links around the rainbow recordImage....
  function animate() {
    if (window.getComputedStyle(radialLinks).display !== 'none') { // will only animate  if it IS ('!==' means not, therefore, will rotate if the display is not 'none', will rotate if the display is on ) indeed visible
      rotation += speed; // increment rotation as define above
      radialLinks.style.transform = getRadialTransform(rotation); // centers element on its anchor point. perfectly centered and apply rotation to the 'vinyl,vibes,vogue,video' radial links behind logo.
      speed += (targetSpeed - speed) * 0.02; // smooth acceleration/deceleration... difference= target speed (2) - speed (0)... thus the speed gradually 'chases' the target speed, easing into a value of 2 instead of jumping instantly.
    }
    requestAnimationFrame(animate); // makes 'animate' a loop. syncs with screen refresh rate , pauses when tab is hidden,
  }

  animate(); // start animation loop for the very first time.

  // Updating the  hover states
  function updateHoverState() {
    if (window.getComputedStyle(radialLinks).display !== 'none') { // only run if if radial link container is visible, '!==  '  means NOT, thus if the display is NOT styled as none, meaning indeed it is being displayed,,, avoids unnecessary style changes, avoids hover logic activating when menu is hidden by css.
      if (navHomeCircleItem.matches(':hover') || radialLinks.matches(':hover')) {  // <-- is the mouse currently over either or : maincircleCenter OR the outer radial links container
        radialLinks.style.opacity = 1; // show by bringing opacity from 0 to to 1. opacity set to 0 by default in css and has a "transition:opacity" styles in css as well.
        radialLinks.style.pointerEvents = 'auto'; // enable interaction. 'pointerevents' controls whether or not an element receives mouse events.
        targetSpeed = -0.5; // reverse REVERSE direction speed rotation
        if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null; } /// stops delayed hiding if mouse pointer goes back quickly
      } else { // e;se ... mouse is NOT over circle AND NOT over the radial links. begin hiding and stop rotations below
        targetSpeed = 0; // stop rotation
        if (!hideTimeout) { // if NOT hideTimeout, it will prevent multiple animation/hover ""sessions"" per se. which stops many timeouts from happening if mouse jitters a bit.
          hideTimeout = setTimeout(() => { // sets hidetimeout as the setTimeout amount value of 1.5 seconds as defined wayyy above with 1500 //
            radialLinks.style.opacity = 0; // hide by setting opacity to 0
            radialLinks.style.pointerEvents = 'none'; // disable interaction/pointer events
            hideTimeout = null;
          }, 500); // delay hide timer of half a second. allows pointer to go back within .5s
        }
      }
    }
  }

  // Attach hover events
  navHomeCircleItem.addEventListener('mouseenter', updateHoverState);
  navHomeCircleItem.addEventListener('mouseleave', updateHoverState);
  radialLinks.addEventListener('mouseenter', updateHoverState);
  radialLinks.addEventListener('mouseleave', updateHoverState);

  //same logic/functions will run when entering AND leaving BOTH radialLinks and navHomeCircleItem.
}















const toggle = document.querySelector('.mobile-menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (toggle && mobileNav) {
  // Toggle show mobile menu on click
  toggle.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
  });

  // Toggle mobile menu on keyboard  for accessibility (Enter or Space)
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();           // prevent scrolling for Space
      mobileNav.classList.toggle('active');
    }
  });
}



// Select the About Us link and dropdown
const mobileAboutUs = document.querySelector('.mobileAboutUs');
const mobileDropdown = document.querySelector('.mobile-custom-dropdown');

if (mobileAboutUs && mobileDropdown) {
  mobileAboutUs.addEventListener('click', function (e) {
    e.preventDefault(); // prevent default anchor behavior
    // Toggle display
    if (mobileDropdown.style.display === 'block') {
      mobileDropdown.style.display = 'none';
    } else {
      mobileDropdown.style.display = 'block';
    }
  });

  // Optional: close dropdown if clicking outside
  document.addEventListener('click', function (e) {
    if (!mobileAboutUs.contains(e.target) && !mobileDropdown.contains(e.target)) {
      mobileDropdown.style.display = 'none';
    }
  });
}







const buttons = document.querySelectorAll('.CTABUTTON');
const videos = document.querySelectorAll('.bg-video');

buttons.forEach((btn, index) => {

  btn.addEventListener('mouseenter', () => {
    videos.forEach(v => v.classList.remove('active'));
    videos[index].classList.add('active');
  });

});














