let dots = [];
let trail = [];
let max_age = 20;
let speed = 10;
let goal_radius = 50;
let max_wrong_dist = 150;
let num_dots = 20;
let hero;
let started = false;
let textZone = null;

function randomPerimeterPoint() {
  const depth = 0.28;
  let edge = floor(random(4));
  if (edge == 0) return { pos: createVector(random(width), 0),         goal: createVector(width / 2,          height * depth) };
  if (edge == 1) return { pos: createVector(width, random(height)),    goal: createVector(width * (1 - depth), height / 2) };
  if (edge == 2) return { pos: createVector(random(width), height),    goal: createVector(width / 2,          height * (1 - depth)) };
  return                 { pos: createVector(0, random(height)),        goal: createVector(width * depth,       height / 2) };
}

function initDots() {
  dots = [];
  for (let i = 0; i < num_dots; i++) {
    let { pos, goal } = randomPerimeterPoint();
    dots.push({
      pos: pos,
      goal: goal,
      dir: floor(random(1, 5)),
      hue_offset: random(360),
      done: false,
    });
  }
  started = true;
}

function computeTextZone() {
  let nameEl = document.querySelector("#hero-landing .hero-landing-name");
  if (!nameEl) return;
  let heroRect = hero.getBoundingClientRect();
  let nameRect = nameEl.getBoundingClientRect();
  let pad = 18;
  textZone = {
    x: nameRect.left - pad,
    y: nameRect.top - heroRect.top - pad,
    w: nameRect.width + pad * 2,
    h: nameRect.height + pad * 2,
  };
}

function positionCanvas() {
  let rect = hero.getBoundingClientRect();
  let top = rect.top + window.scrollY;
  document.getElementById("bg-sketch").style.top = top + "px";
}

function setup() {
  hero = document.getElementById("hero-landing");
  frameRate(60);
  pixelDensity(1);
  let cnv = createCanvas(1, 1);
  cnv.id("bg-sketch");
  // Place outside content-strip so it can be full viewport width
  document.body.insertBefore(cnv.elt, document.body.firstChild);

  strokeCap(SQUARE);
  colorMode(HSB, 360, 100, 100, 100);
  cnv.style("position", "absolute");
  cnv.style("top", "0");
  cnv.style("left", "0");
  cnv.style("z-index", "-1");
  cnv.style("pointer-events", "none");

  noLoop();

  requestAnimationFrame(function () {
    let w = window.innerWidth;
    let h = hero.offsetHeight;
    if (w > 0 && h > 0) {
      resizeCanvas(w, h);
      positionCanvas();
      computeTextZone();
      initDots();
      loop();
    }
  });
}

function windowResized() {
  resizeCanvas(window.innerWidth, hero.offsetHeight);
  positionCanvas();
  computeTextZone();
}

function draw() {
  clear();

  for (let i = trail.length - 1; i >= 0; i--) {
    trail[i].age++;
  }
  while (trail.length > 0 && trail[0].age > max_age) {
    trail.shift();
  }

  noStroke();
  for (let i = 0; i < trail.length; i++) {
    let t = trail[i].age / max_age;
    let a = 80 * (1 - t * t); // quadratic falloff — starts dark, drops fast
    fill(0, 0, 8, a);
    square(trail[i].x - 5, trail[i].y - 5, 10);
  }

  let all_done = true;
  for (let dot of dots) {
    if (!dot.done) {
      all_done = false;
      update_dot(dot);
    }
  }

  drawEdgeFade();

  if (started && all_done && trail.length === 0) {
    noLoop();
  }
}

function drawEdgeFade() {
  let ctx = drawingContext;
  ctx.save();
  let fade = Math.min(width, height) * 0.15;

  let gl = ctx.createLinearGradient(0, 0, fade, 0);
  gl.addColorStop(0, "rgba(217,201,100,1)");
  gl.addColorStop(1, "rgba(217,201,100,0)");
  ctx.fillStyle = gl;
  ctx.fillRect(0, 0, fade, height);

  let gr = ctx.createLinearGradient(width, 0, width - fade, 0);
  gr.addColorStop(0, "rgba(217,201,100,1)");
  gr.addColorStop(1, "rgba(217,201,100,0)");
  ctx.fillStyle = gr;
  ctx.fillRect(width - fade, 0, fade, height);

  let gt = ctx.createLinearGradient(0, 0, 0, fade);
  gt.addColorStop(0, "rgba(217,201,100,1)");
  gt.addColorStop(1, "rgba(217,201,100,0)");
  ctx.fillStyle = gt;
  ctx.fillRect(0, 0, width, fade);

  let gb = ctx.createLinearGradient(0, height, 0, height - fade);
  gb.addColorStop(0, "rgba(217,201,100,1)");
  gb.addColorStop(1, "rgba(217,201,100,0)");
  ctx.fillStyle = gb;
  ctx.fillRect(0, height - fade, width, fade);

  ctx.restore();
}

function update_dot(dot) {
  if (textZone &&
      dot.pos.x >= textZone.x && dot.pos.x <= textZone.x + textZone.w &&
      dot.pos.y >= textZone.y && dot.pos.y <= textZone.y + textZone.h) {
    dot.done = true;
    return;
  }

  let near_goal =
    dist(dot.pos.x, dot.pos.y, dot.goal.x, dot.goal.y) < goal_radius;

  if (near_goal) {
    dot.done = true;
    return;
  }

  move_dot(dot);

  if (random() < 0.08) {
    if (dot.dir == 1 || dot.dir == 3) {
      dot.dir = random() < 0.5 ? 2 : 4;
    } else {
      dot.dir = random() < 0.5 ? 1 : 3;
    }
  }

  if (dot.dir == 2 && dot.pos.x > dot.goal.x + max_wrong_dist) dot.dir = 4;
  if (dot.dir == 4 && dot.pos.x < dot.goal.x - max_wrong_dist) dot.dir = 2;
  if (dot.dir == 1 && dot.pos.y > dot.goal.y + max_wrong_dist) dot.dir = 3;
  if (dot.dir == 3 && dot.pos.y < dot.goal.y - max_wrong_dist) dot.dir = 1;

  if (dot.dir == 2 || dot.dir == 4) {
    if (abs(dot.pos.x - dot.goal.x) < speed) {
      dot.pos.x = dot.goal.x;
      dot.dir = dot.pos.y > dot.goal.y ? 3 : 1;
    }
  } else if (dot.dir == 1 || dot.dir == 3) {
    if (abs(dot.pos.y - dot.goal.y) < speed) {
      dot.pos.y = dot.goal.y;
      dot.dir = dot.pos.x > dot.goal.x ? 4 : 2;
    }
  }
}

function move_dot(dot) {
  switch (dot.dir) {
    case 1:
      dot.pos.y += speed;
      break;
    case 2:
      dot.pos.x += speed;
      break;
    case 3:
      dot.pos.y -= speed;
      break;
    case 4:
      dot.pos.x -= speed;
      break;
  }
  let h = (frameCount * 0.5 + dot.hue_offset) % 360;
  trail.push({ x: dot.pos.x, y: dot.pos.y, age: 0 });
  noStroke();
  fill(h, 80, 18, 85);
  square(dot.pos.x - 5, dot.pos.y - 5, 10);
}
