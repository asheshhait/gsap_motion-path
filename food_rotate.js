const nav = document.getElementById('right_nav');
const underline = document.querySelector('.underline');
const activeItem = document.querySelector('.nav-item.active');
const navItems = document.querySelectorAll('.nav-item');

function moveUnderlineTo(el) {
    const rect = el.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    underline.style.width = `${rect.width}px`;
    underline.style.left = `${rect.left - navRect.left}px`;
}

moveUnderlineTo(activeItem);

navItems.forEach(item => {
    item.addEventListener('mouseenter', () => moveUnderlineTo(item));
    item.addEventListener('mouseleave', () => moveUnderlineTo(activeItem));
});

gsap.registerPlugin(MotionPathPlugin);
MotionPathPlugin.convertToPath("#path");

const points = gsap.utils.toArray(".circle");
const imgs = document.querySelectorAll('.small_img');
const num = points.length;
const stepDuration = 3.2;
const shortPause = 1.5;
const longPause = 2;

let rotation = 0;
let timeline;

const colors = ['#d973a9', '#d3ccaf', '#83a7dc', '#ddc7b9'];
const color1 = ['#743156', '#4c3028', '#385e9f', '#9e614e'];

gsap.set("svg", { autoAlpha: 1 });

points.forEach((point, i) => {
  gsap.set(point, {
    motionPath: {
      path: "#path",
      align: "#path",
      alignOrigin: [0.5, 0.5],
      end: i / num
    }
  });
});

function rotateStep() {
  timeline = gsap.timeline({
    defaults: {
      duration: stepDuration,
      ease: "power2.inOut"
    },
    onComplete: () => {
      rotation += 360 / num;

      const currentIndex = (Math.round(rotation / (360 / num))) % num;

      gsap.to([imgs[currentIndex], "#page1", "#smallcircle"], {
        backgroundColor: colors[currentIndex % colors.length],
        duration: 1.2,
        ease: "power2.inOut",
        onStart: () => {
          imgs.forEach((img, i) => {
            if (i === currentIndex) {
              img.classList.add("active");
            } else {
              img.classList.remove("active");
            }
          });
        }
      });

      gsap.to([imgs[currentIndex], ".circle_0", "#hero", "#heading", "#logo", "#dup","#svg_path"], {
        backgroundColor: color1[currentIndex % color1.length],
        duration: 1.2,
        ease: "power2.inOut"
      });

      const isFront = rotation % 30 === 0;
      const delay = isFront ? longPause : shortPause;
      gsap.delayedCall(delay, rotateStep);
    }
  });

  timeline.to("#wrap", { rotation: `+=${360 / num}` });
  timeline.to(points, { rotation: `-=${360 / num}` }, 0);
}

rotateStep();

// Pause/resume on hover
const wrap = document.querySelector("#wrap");
wrap.addEventListener("mouseenter", () => gsap.globalTimeline.pause());
wrap.addEventListener("mouseleave", () => gsap.globalTimeline.resume());

// CSS for scaling
const style = document.createElement('style');
style.innerHTML = `
  .small_img {
    transition: transform 0.4s ease;
  }
  .small_img.active {
    transform: scale(1.4);
    z-index: 10;
  }
`;
document.head.appendChild(style);
