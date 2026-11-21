// Level 3 scene: Lantern Night Market. A night market drawn with canvas primitives:
// a starry sky and moon, strings of festival lights, three stalls with striped awnings,
// a vendor, paper lanterns, a bunch of balloons, a cat on a crate and a hanging sign.
// Same contract as the other scenes: draw(ctx, active) renders the base picture, then
// applies every difference id in `active` to this copy.
export const marketScene = {
  id: 'market',
  name: 'Lantern Night Market',
  width: 560,
  height: 420,
  differences: [
    { id: 'moon', x: 482, y: 58, r: 30, hint: 'Look at the moon' },
    { id: 'bulb', x: 282, y: 46, r: 18, hint: 'One festival light is out' },
    { id: 'lantern', x: 196, y: 132, r: 22, hint: 'A paper lantern hangs by the stalls' },
    { id: 'awning', x: 280, y: 112, r: 24, hint: 'Count the awning stripes' },
    { id: 'banner', x: 280, y: 186, r: 24, hint: 'Read the hanging sign' },
    { id: 'apron', x: 280, y: 232, r: 22, hint: 'The vendor changed clothes' },
    { id: 'balloons', x: 520, y: 118, r: 26, hint: 'How many balloons?' },
    { id: 'cat', x: 90, y: 366, r: 22, hint: 'A cat sits by the fruit stall' },
  ],

  draw(ctx, active) {
    drawMarketSky(ctx, active);
    drawMarketStringLights(ctx, active);
    drawMarketStalls(ctx, active);
    drawMarketVendor(ctx, active);
    drawMarketBalloons(ctx, active);
    drawMarketGround(ctx, active);
  },
};

function drawMarketSky(ctx, active) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#141d42');
  sky.addColorStop(1, '#2c3f6e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 560, 300);
  // Stars.
  ctx.fillStyle = '#ffffff';
  const stars = [
    [40, 40], [90, 84], [150, 34], [210, 66], [330, 36], [380, 74], [440, 30],
    [520, 84], [60, 130], [360, 120], [120, 150], [500, 150], [250, 26], [300, 96],
  ];
  for (const [x, y] of stars) {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  // The moon: full on the base copy, a crescent on the changed one.
  ctx.fillStyle = '#f5edd0';
  ctx.beginPath();
  ctx.arc(482, 58, 28, 0, Math.PI * 2);
  ctx.fill();
  if (active.has('moon')) {
    ctx.fillStyle = '#141d42';
    ctx.beginPath();
    ctx.arc(494, 52, 24, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(180, 170, 140, 0.5)';
  ctx.beginPath();
  ctx.arc(474, 50, 5, 0, Math.PI * 2);
  ctx.arc(490, 68, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawMarketStringLights(ctx, active) {
  // Two sagging strings of warm bulbs across the top of the scene.
  const strings = [
    { x0: 0, y0: 18, x1: 560, y1: 30, bulbs: 9 },
    { x0: 0, y0: 52, x1: 560, y1: 66, bulbs: 10 },
  ];
  ctx.strokeStyle = '#3a2f22';
  ctx.lineWidth = 2;
  for (const s of strings) {
    ctx.beginPath();
    ctx.moveTo(s.x0, s.y0);
    ctx.quadraticCurveTo(280, s.y0 + 26, s.x1, s.y1);
    ctx.stroke();
    for (let i = 0; i < s.bulbs; i++) {
      const t = (i + 0.5) / s.bulbs;
      const x = s.x0 + (s.x1 - s.x0) * t;
      const y = s.y0 + (s.y1 - s.y0) * t + 24 * Math.sin(Math.PI * t) * 0.9;
      // The fifth bulb of the upper string is dark on the changed copy.
      const dark = active.has('bulb') && s.y0 === 18 && i === 4;
      ctx.fillStyle = dark ? '#4a4d52' : '#ffd94d';
      ctx.beginPath();
      ctx.arc(x, y + 8, 6, 0, Math.PI * 2);
      ctx.fill();
      if (!dark) {
        ctx.save();
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = '#ffd94d';
        ctx.beginPath();
        ctx.arc(x, y + 8, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }
}

function drawMarketStalls(ctx, active) {
  drawFruitStall(ctx, active);
  drawLanternStall(ctx, active);
  drawSnackStall(ctx);
  drawMarketLantern(ctx, active);
}

function drawStripedAwning(ctx, x, y, w, h, stripes, c1, c2) {
  ctx.fillStyle = c1;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = c2;
  for (let i = 0; i < stripes; i += 2) {
    ctx.fillRect(x + (i * w) / stripes, y, w / stripes, h);
  }
  // Scalloped edge.
  ctx.fillStyle = c1;
  for (let i = 0; i < stripes; i++) {
    ctx.beginPath();
    ctx.arc(x + ((i + 0.5) * w) / stripes, y + h, w / stripes / 2, 0, Math.PI);
    ctx.fill();
  }
}

function drawFruitStall(ctx, active) {
  // Left stall: fruit, with a crate and a cat beside it.
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(24, 250, 150, 10);
  ctx.fillRect(34, 260, 10, 90);
  ctx.fillRect(154, 260, 10, 90);
  drawStripedAwning(ctx, 20, 196, 158, 34, 6, '#e4572e', '#f7f2e7');
  ctx.fillStyle = '#e4572e';
  ctx.beginPath();
  ctx.arc(52, 238, 9, 0, Math.PI * 2);
  ctx.arc(76, 238, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f2c94c';
  ctx.beginPath();
  ctx.arc(104, 238, 9, 0, Math.PI * 2);
  ctx.arc(128, 238, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#27ae60';
  ctx.beginPath();
  ctx.arc(64, 224, 8, 0, Math.PI * 2);
  ctx.arc(90, 224, 8, 0, Math.PI * 2);
  ctx.arc(116, 224, 8, 0, Math.PI * 2);
  ctx.fill();
  // Crate with the cat (the cat only sits there on the base copy).
  ctx.fillStyle = '#b08954';
  ctx.fillRect(58, 372, 64, 28);
  ctx.strokeStyle = '#8a6a3a';
  ctx.lineWidth = 2;
  ctx.strokeRect(58, 372, 64, 28);
  ctx.beginPath();
  ctx.moveTo(58, 386);
  ctx.lineTo(122, 386);
  ctx.stroke();
  if (!active.has('cat')) {
    ctx.fillStyle = '#3a3f4a';
    ctx.beginPath();
    ctx.ellipse(90, 366, 18, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(104, 354, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(98, 347);
    ctx.lineTo(99, 338);
    ctx.lineTo(104, 345);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(108, 346);
    ctx.lineTo(112, 338);
    ctx.lineTo(113, 347);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#3a3f4a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(74, 364);
    ctx.quadraticCurveTo(62, 358, 66, 348);
    ctx.stroke();
  }
}

function drawLanternStall(ctx, active) {
  // Middle stall: paper lanterns for sale, with the vendor behind it.
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(202, 250, 156, 10);
  ctx.fillRect(212, 260, 10, 90);
  ctx.fillRect(338, 260, 10, 90);
  // The awning: five stripes on the base copy, four on the changed one.
  drawStripedAwning(ctx, 198, 96, 164, 34, active.has('awning') ? 4 : 5, '#c0392b', '#f7f2e7');
  // Lanterns on the counter.
  const lanternColors = ['#e4572e', '#f2c94c', '#2a9d8f'];
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = lanternColors[i];
    ctx.beginPath();
    ctx.ellipse(232 + i * 48, 236, 14, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f2c94c';
    ctx.fillRect(228 + i * 48, 220, 8, 4);
  }
  // Hanging sign: OPEN on the base copy, OPNE on the changed one.
  ctx.fillStyle = '#3a2f22';
  ctx.fillRect(248, 168, 64, 34);
  ctx.fillStyle = '#f7f2e7';
  ctx.font = 'bold 20px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(active.has('banner') ? 'OPNE' : 'OPEN', 280, 186);
}

function drawSnackStall(ctx) {
  // Right stall: steaming snacks.
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(386, 250, 150, 10);
  ctx.fillRect(396, 260, 10, 90);
  ctx.fillRect(516, 260, 10, 90);
  drawStripedAwning(ctx, 382, 196, 158, 34, 6, '#2a9d8f', '#f7f2e7');
  ctx.fillStyle = '#d8cfc0';
  ctx.beginPath();
  ctx.ellipse(430, 240, 22, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(486, 240, 22, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  // Steam curls.
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 2;
  for (const x of [424, 436, 480, 492]) {
    ctx.beginPath();
    ctx.moveTo(x, 232);
    ctx.quadraticCurveTo(x + 5, 222, x, 212);
    ctx.stroke();
  }
  ctx.fillStyle = '#e8a13c';
  ctx.fillRect(452, 224, 18, 16);
}

function drawMarketLantern(ctx, active) {
  // A big paper lantern hanging between the stalls.
  ctx.strokeStyle = '#3a2f22';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(196, 96);
  ctx.lineTo(196, 112);
  ctx.stroke();
  ctx.fillStyle = active.has('lantern') ? '#8e44ad' : '#e4572e';
  ctx.beginPath();
  ctx.ellipse(196, 132, 18, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(196, 132, 18, 22, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(180, 122);
  ctx.lineTo(212, 122);
  ctx.moveTo(180, 142);
  ctx.lineTo(212, 142);
  ctx.stroke();
  ctx.fillStyle = '#f2c94c';
  ctx.fillRect(190, 108, 12, 5);
  ctx.fillRect(190, 152, 12, 5);
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(193, 157, 6, 12);
}

function drawMarketVendor(ctx, active) {
  // The vendor behind the middle stall, apron stripes in two colours.
  ctx.fillStyle = '#f2c9a0';
  ctx.beginPath();
  ctx.arc(280, 196, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3a2f22';
  ctx.beginPath();
  ctx.arc(280, 188, 13, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = active.has('apron') ? '#2a9d8f' : '#e4572e';
  ctx.fillRect(262, 210, 36, 42);
  ctx.fillStyle = '#f7f2e7';
  ctx.fillRect(262, 222, 36, 5);
  ctx.fillRect(262, 236, 36, 5);
  // Arms resting on the counter.
  ctx.fillStyle = '#f2c9a0';
  ctx.fillRect(256, 232, 8, 20);
  ctx.fillRect(296, 232, 8, 20);
}

function drawMarketBalloons(ctx, active) {
  // A bunch of balloons tied to the snack stall: three, or two on the changed copy.
  const colors = ['#e4572e', '#f2c94c', '#2a9d8f'];
  const count = active.has('balloons') ? 2 : 3;
  const spots = [[512, 106], [534, 96], [524, 128]];
  ctx.strokeStyle = '#f7f2e7';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < count; i++) {
    const [x, y] = spots[i];
    ctx.beginPath();
    ctx.moveTo(x, y + 14);
    ctx.lineTo(520, 168);
    ctx.stroke();
  }
  for (let i = 0; i < count; i++) {
    const [x, y] = spots[i];
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.ellipse(x, y, 11, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 13);
    ctx.lineTo(x + 4, y + 13);
    ctx.lineTo(x, y + 18);
    ctx.closePath();
    ctx.fill();
  }
}

function drawMarketGround(ctx, active) {
  // Cobblestones in front of the stalls.
  ctx.fillStyle = '#4a4d5a';
  ctx.fillRect(0, 372, 560, 48);
  ctx.fillStyle = '#5a5d6a';
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 10; col++) {
      const x = col * 56 + (row % 2) * 28;
      ctx.beginPath();
      ctx.ellipse(x + 28, 384 + row * 14, 24, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
