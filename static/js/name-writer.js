document.addEventListener("DOMContentLoaded", () => {
  const element = document.getElementById("name");

  const correct = "Jack Drabenstadt";
  const typos = [
    "Jack Drabensdt", // missing "a"
    "Jak Drabenstadt", // missing "c"
    "Jack Drabenstat", // missing "d"
  ];

  // Pick one typo or go straight to correct
  let current =
    Math.random() < 0.5
      ? typos[Math.floor(Math.random() * typos.length)]
      : correct;

  let j = 0;
  let deleting = false;
  let fixing = false;

  function typeEffect() {
    if (!deleting && !fixing) {
      // Typing forward
      element.textContent = current.substring(0, j + 1);
      j++;

      if (j === current.length) {
        if (current === correct) {
          // Done typing correctly → stop
          return;
        } else {
          // Pause, then delete wrong part
          setTimeout(() => {
            deleting = true;
            typeEffect();
          }, 1000);
          return;
        }
      }
    } else if (deleting) {
      // Delete wrong characters until overlap
      const overlap = commonPrefixLength(correct, current);
      if (j > overlap) {
        element.textContent = current.substring(0, j - 1);
        j--;
      } else {
        deleting = false;
        fixing = true;
      }
    } else if (fixing) {
      // Retype correctly
      element.textContent = correct.substring(0, j + 1);
      j++;
      if (j === correct.length) {
        // Finished retyping → stop
        return;
      }
    }

    const speed = deleting ? 50 : 100;
    setTimeout(typeEffect, speed);
  }

  function commonPrefixLength(a, b) {
    let n = 0;
    while (n < a.length && n < b.length && a[n] === b[n]) n++;
    return n;
  }

  typeEffect();
});
