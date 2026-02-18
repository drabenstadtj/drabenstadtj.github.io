let current_dir;
let current_pos;
let goal_pos;
let speed = 3;
let mouse_timer = null;
let mouse_cooldown = 750;
let near_goal = false;
let goal_radius = 50;
let trail = [];
let max_age = 100;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.id("bg-sketch");
  strokeCap(SQUARE);
  colorMode(HSB, 360, 100, 100, 100);
  cnv.style("position", "fixed");
  cnv.style("top", "0");
  cnv.style("left", "0");
  cnv.style("z-index", "-1");
  cnv.style("pointer-events", "none");
  current_pos = createVector(0, 0);
  goal_pos = createVector(width / 2, height / 2);
  current_dir = 2;

  document.addEventListener("mousemove", function (e) {
    clearTimeout(mouse_timer);
    mouse_timer = setTimeout(() => {
      goal_pos = createVector(e.clientX, e.clientY + window.scrollY);
    }, mouse_cooldown);
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  clear();

  // Age trail and remove old segments
  for (let i = trail.length - 1; i >= 0; i--) {
    trail[i].age++;
  }
  while (trail.length > 0 && trail[0].age > max_age) {
    trail.shift();
  }

  // Draw trail with fading opacity
  noStroke();
  for (let i = 0; i < trail.length; i++) {
    let a = map(trail[i].age, 0, max_age, 40, 0);
    fill(trail[i].hue, 60, 40, a);
    circle(trail[i].x, trail[i].y, 10);
  }

  near_goal =
    dist(current_pos.x, current_pos.y, goal_pos.x, goal_pos.y) < goal_radius;

  if (!near_goal) {
    move_circle();
  }

  if (!near_goal && random() < 0.08) {
    if (current_dir == 1 || current_dir == 3) {
      current_dir = random() < 0.5 ? 2 : 4;
    } else {
      current_dir = random() < 0.5 ? 1 : 3;
    }
  }

  let max_wrong_dist = 150;

  if (!near_goal) {
    if (current_dir == 2 && current_pos.x > goal_pos.x + max_wrong_dist)
      current_dir = 4;
    if (current_dir == 4 && current_pos.x < goal_pos.x - max_wrong_dist)
      current_dir = 2;
    if (current_dir == 1 && current_pos.y > goal_pos.y + max_wrong_dist)
      current_dir = 3;
    if (current_dir == 3 && current_pos.y < goal_pos.y - max_wrong_dist)
      current_dir = 1;
  }

  if (current_dir == 2 || current_dir == 4) {
    if (abs(current_pos.x - goal_pos.x) < speed) {
      current_pos.x = goal_pos.x;
      if (current_pos.y > goal_pos.y) {
        current_dir = 3;
      } else {
        current_dir = 1;
      }
    }
  } else if (current_dir == 1 || current_dir == 3) {
    if (abs(current_pos.y - goal_pos.y) < speed) {
      current_pos.y = goal_pos.y;
      if (current_pos.x > goal_pos.x) {
        current_dir = 4;
      } else {
        current_dir = 2;
      }
    }
  }
}

function move_circle() {
  switch (current_dir) {
    case 1:
      current_pos.y += speed;
      break;
    case 2:
      current_pos.x += speed;
      break;
    case 3:
      current_pos.y -= speed;
      break;
    case 4:
      current_pos.x -= speed;
      break;
  }
  let h = (frameCount * 0.5) % 360;
  trail.push({
    x: current_pos.x,
    y: current_pos.y,
    age: 0,
    hue: h,
  });
  noStroke();
  fill(h, 60, 40, 40);
  circle(current_pos.x, current_pos.y, 10);
}
