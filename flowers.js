(() => {
  const motif = document.querySelector('.footer-daisy');
  if (!motif) return;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const heights = [18, 43, 68];
  let timer;
  let activeFlower;
  let startsOnLeft = true;

  function bloom(index = 0) {
    if (motion.matches || document.hidden) return;

    const onLeft = index % 2 === 0 ? startsOnLeft : !startsOnLeft;
    const flower = document.createElement('span');
    flower.className = 'ambient-flower';
    flower.dataset.side = onLeft ? 'start' : 'end';
    flower.setAttribute('aria-hidden', 'true');
    flower.style.setProperty('--flower-height', `${heights[index] + Math.round(Math.random() * 6)}%`);

    const drawing = motif.cloneNode(true);
    drawing.removeAttribute('class');
    flower.append(drawing);
    flower.addEventListener('animationend', () => {
      if (activeFlower !== flower) return;
      flower.remove();
      activeFlower = null;
      if (index < heights.length - 1) {
        bloom(index + 1);
        return;
      }

      startsOnLeft = !startsOnLeft;
      timer = window.setTimeout(bloom, 4500 + Math.random() * 2000);
    }, { once: true });
    activeFlower = flower;
    document.body.append(flower);
  }

  function restart() {
    window.clearTimeout(timer);
    activeFlower?.remove();
    activeFlower = null;
    if (motion.matches || document.hidden) return;

    timer = window.setTimeout(bloom, 3000);
  }

  motion.addEventListener('change', restart);
  document.addEventListener('visibilitychange', restart);
  restart();
})();
