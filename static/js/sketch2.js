new p5(function (p) {
  const DOT_SIZE = 10;
  const MAX_AGE = 40;
  const NUM_LANES = 9;
  const DOTS_PER_LANE = 8;
  const OVERSHOOT = 15;

  let lanes = [];
  let trailDots = [];
  let hero;

  function makeLane(idx, stagger) {
    const laneSpacing = (p.height - DOT_SIZE) / (NUM_LANES - 1);
    return {
      y: DOT_SIZE / 2 + idx * laneSpacing,
      dots: Array.from({ length: DOTS_PER_LANE }, () => ({
        x: stagger
          ? Math.random() * p.width
          : p.width + DOT_SIZE + Math.random() * p.width,
        speed: 1.2 + Math.random() * 2.5,
      })),
    };
  }

  function positionCanvas() {
    let rect = hero.getBoundingClientRect();
    let elt = document.getElementById("bg-sketch2");
    elt.style.top = rect.top + window.scrollY - OVERSHOOT + "px";
  }

  p.setup = function () {
    hero = document.querySelector("#hero-content h1");
    p.frameRate(60);
    p.pixelDensity(1);

    let cnv = p.createCanvas(1, 1);
    cnv.id("bg-sketch2");
    document.body.insertBefore(cnv.elt, document.body.firstChild);

    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.noStroke();

    cnv.style("position", "absolute");
    cnv.style("top", "0");
    cnv.style("left", "0");
    cnv.style("z-index", "-1");
    cnv.style("pointer-events", "none");

    p.noLoop();

    requestAnimationFrame(function () {
      let w = window.innerWidth;
      let h = hero.offsetHeight;
      if (w > 0 && h > 0) {
        p.resizeCanvas(w, h + OVERSHOOT * 2);
        positionCanvas();
        for (let i = 0; i < NUM_LANES; i++) {
          lanes.push(makeLane(i, true));
        }
        p.loop();
      }
    });
  };

  p.windowResized = function () {
    p.resizeCanvas(window.innerWidth, hero.offsetHeight + OVERSHOOT * 2);
    positionCanvas();
  };

  p.draw = function () {
    p.clear();

    p.fill(0, 0, 0, 80);
    p.rect(0, 0, p.width, p.height);

    for (let i = trailDots.length - 1; i >= 0; i--) trailDots[i].age++;
    while (trailDots.length > 0 && trailDots[0].age > MAX_AGE)
      trailDots.shift();

    for (let t of trailDots) {
      let frac = t.age / MAX_AGE;
      let a = 32 * (1 - frac * frac);
      p.fill(0, 0, 0, a);
      p.square(t.x - DOT_SIZE / 2, t.y - DOT_SIZE / 2, DOT_SIZE);
    }

    for (let lane of lanes) {
      for (let dot of lane.dots) {
        dot.x -= dot.speed;
        trailDots.push({ x: dot.x, y: lane.y, age: 0 });
        p.fill(0, 0, 0, 60);
        p.square(dot.x - DOT_SIZE / 2, lane.y - DOT_SIZE / 2, DOT_SIZE);

        if (dot.x < -DOT_SIZE * 2) {
          dot.x = p.width + DOT_SIZE + Math.random() * 120;
          dot.speed = 1.2 + Math.random() * 2.5;
        }
      }
    }

    drawEdgeFade();
  };

  function drawEdgeFade() {
    let ctx = p.drawingContext;
    ctx.save();

    let gl = ctx.createLinearGradient(0, 0, p.width * 0.12, 0);
    gl.addColorStop(0, "rgba(217,201,100,1)");
    gl.addColorStop(1, "rgba(217,201,100,0)");
    ctx.fillStyle = gl;
    ctx.fillRect(0, 0, p.width, p.height);

    let gr = ctx.createLinearGradient(p.width, 0, p.width * 0.88, 0);
    gr.addColorStop(0, "rgba(217,201,100,1)");
    gr.addColorStop(1, "rgba(217,201,100,0)");
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, p.width, p.height);

    ctx.restore();
  }
});
