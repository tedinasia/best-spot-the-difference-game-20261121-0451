// Level 1 scene: Sunny Harbor. A small fishing harbour drawn with canvas primitives:
// sky, sun, clouds, hills, sea, a striped lighthouse, two boats, a wooden pier and a
// fisherman. The draw function takes the set of difference ids to apply to this copy:
// the left panel is drawn with an empty set, the right panel with every id, so the two
// pictures differ exactly where the level's differences say they should.
export const harborScene = {
  id: 'harbor',
  name: 'Sunny Harbor',
  width: 560,
  height: 420,
  differences: [
    { id: 'gull', x: 430, y: 58, r: 24, hint: 'Look at the sky on the right' },
    { id: 'beam', x: 178, y: 148, r: 30, hint: 'The lighthouse lamp is doing something' },
    { id: 'sail', x: 316, y: 282, r: 28, hint: 'Check the sailboat' },
    { id: 'buoy', x: 200, y: 362, r: 22, hint: 'Something floats in the water' },
    { id: 'hat', x: 150, y: 268, r: 20, hint: 'Look at the fisherman' },
    { id: 'window', x: 76, y: 198, r: 18, hint: 'A lighthouse window' },
  ],

  draw(ctx, active) {
    drawHarborSky(ctx, active);
    drawHarborSea(ctx);
    drawHarborHills(ctx);
    drawHarborLighthouse(ctx, active);
    drawHarborBoats(ctx, active);
    drawHarborPier(ctx, active);
    drawHarborFisherman(ctx, active);
    if (active.has('buoy')) {
      // No buoy on this copy: the water stays empty where it would float.
    } else {
      drawHarborBuoy(ctx);
    }
    drawHarborGulls(ctx, active);
  },
};

function drawHarborSky(ctx, active) {
  const sky = ctx.createLinearGradient(0, 0, 0, 250);
  sky.addColorStop(0, '#a8d8f8');
  sky.addColorStop(1, '#e8f6ff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 560, 250);
  drawHarborSun(ctx);
  drawHarborCloud(ctx, 88, 58, 1);
  drawHarborCloud(ctx, 258, 38, 0.8);
  drawHarborCloud(ctx, 392, 88, 0.65);
  if (!active.has('beam')) {
    // The lamp beam: a soft wedge of light reaching out over the water.
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#fff3b0';
    ctx.beginPath();
    ctx.moveTo(76, 138);
    ctx.lineTo(262, 118);
    ctx.lineTo(262, 176);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function drawHarborSun(ctx) {
  ctx.save();
  ctx.fillStyle = '#ffd94d';
  ctx.beginPath();
  ctx.arc(474, 54, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f2b705';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(474 + Math.cos(a) * 40, 54 + Math.sin(a) * 40);
    ctx.lineTo(474 + Math.cos(a) * 52, 54 + Math.sin(a) * 52);
    ctx.stroke();
  }
  ctx.restore();
}

function drawHarborCloud(ctx, x, y, scale) {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.beginPath();
  ctx.ellipse(x, y, 42 * scale, 16 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 26 * scale, y + 6 * scale, 26 * scale, 12 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 28 * scale, y + 6 * scale, 28 * scale, 13 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHarborHills(ctx) {
  ctx.fillStyle = '#5d8a5a';
  ctx.beginPath();
  ctx.moveTo(0, 250);
  ctx.quadraticCurveTo(140, 196, 300, 244);
  ctx.quadraticCurveTo(430, 208, 560, 246);
  ctx.lineTo(560, 252);
  ctx.lineTo(0, 252);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#4a7a48';
  ctx.beginPath();
  ctx.moveTo(0, 250);
  ctx.quadraticCurveTo(200, 224, 360, 248);
  ctx.quadraticCurveTo(480, 232, 560, 250);
  ctx.lineTo(560, 252);
  ctx.lineTo(0, 252);
  ctx.closePath();
  ctx.fill();
}

function drawHarborSea(ctx) {
  const sea = ctx.createLinearGradient(0, 250, 0, 420);
  sea.addColorStop(0, '#3d8fc9');
  sea.addColorStop(1, '#1d5c96');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 250, 560, 170);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 2;
  const waves = [
    [60, 288, 46], [180, 306, 60], [330, 292, 52], [460, 312, 58],
    [110, 348, 54], [270, 366, 62], [420, 352, 50], [40, 396, 58], [320, 398, 66],
  ];
  for (const [x, y, w] of waves) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + w / 2, y - 7, x + w, y);
    ctx.stroke();
  }
}

function drawHarborLighthouse(ctx, active) {
  // Tower: a slightly tapered striped column on the rocks at the left.
  ctx.fillStyle = '#8a7a63';
  ctx.beginPath();
  ctx.moveTo(48, 330);
  ctx.lineTo(104, 330);
  ctx.lineTo(100, 306);
  ctx.lineTo(52, 306);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f4ede0';
  ctx.beginPath();
  ctx.moveTo(58, 306);
  ctx.lineTo(94, 306);
  ctx.lineTo(90, 150);
  ctx.lineTo(62, 150);
  ctx.closePath();
  ctx.fill();
  // Red stripes across the tower.
  ctx.fillStyle = '#d64541';
  for (const y of [176, 228, 280]) {
    ctx.beginPath();
    ctx.moveTo(60, y + 22);
    ctx.lineTo(92, y + 22);
    ctx.lineTo(91, y);
    ctx.lineTo(61, y);
    ctx.closePath();
    ctx.fill();
  }
  // Gallery, lamp room and roof.
  ctx.fillStyle = '#33302a';
  ctx.fillRect(56, 142, 40, 8);
  ctx.fillStyle = active.has('window') ? '#3a3f4a' : '#ffd94d';
  ctx.fillRect(64, 118, 24, 24);
  ctx.fillStyle = '#33302a';
  ctx.fillRect(62, 116, 28, 3);
  ctx.fillStyle = '#d64541';
  ctx.beginPath();
  ctx.moveTo(60, 116);
  ctx.lineTo(92, 116);
  ctx.lineTo(76, 98);
  ctx.closePath();
  ctx.fill();
  // The lit tower window: warm on the base copy, dark on the changed copy.
  ctx.fillStyle = active.has('window') ? '#3a3f4a' : '#ffe08a';
  ctx.fillRect(70, 192, 12, 16);
  ctx.fillStyle = active.has('window') ? '#3a3f4a' : '#ffe08a';
  ctx.fillRect(70, 248, 12, 16);
  // A small flag on the roof.
  ctx.strokeStyle = '#33302a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(76, 98);
  ctx.lineTo(76, 82);
  ctx.stroke();
  ctx.fillStyle = '#2fbf71';
  ctx.beginPath();
  ctx.moveTo(76, 82);
  ctx.lineTo(94, 87);
  ctx.lineTo(76, 92);
  ctx.closePath();
  ctx.fill();
}

function drawHarborBoats(ctx, active) {
  // Sailboat: hull, mast and a big triangular sail.
  ctx.fillStyle = '#7a4a21';
  ctx.beginPath();
  ctx.moveTo(288, 312);
  ctx.lineTo(344, 312);
  ctx.lineTo(332, 328);
  ctx.lineTo(298, 328);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#5d3a17';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(316, 312);
  ctx.lineTo(316, 246);
  ctx.stroke();
  ctx.fillStyle = active.has('sail') ? '#2a9d8f' : '#e4572e';
  ctx.beginPath();
  ctx.moveTo(316, 250);
  ctx.lineTo(316, 308);
  ctx.lineTo(284, 308);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = active.has('sail') ? '#21867a' : '#c7431f';
  ctx.beginPath();
  ctx.moveTo(320, 258);
  ctx.lineTo(320, 308);
  ctx.lineTo(344, 308);
  ctx.closePath();
  ctx.fill();
  // Little fishing boat with a striped canopy.
  ctx.fillStyle = '#4a6b8a';
  ctx.beginPath();
  ctx.moveTo(418, 336);
  ctx.lineTo(478, 336);
  ctx.lineTo(466, 352);
  ctx.lineTo(428, 352);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#33475c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(448, 336);
  ctx.lineTo(448, 300);
  ctx.stroke();
  ctx.fillStyle = '#f2c94c';
  ctx.beginPath();
  ctx.moveTo(428, 302);
  ctx.lineTo(468, 302);
  ctx.lineTo(462, 314);
  ctx.lineTo(434, 314);
  ctx.closePath();
  ctx.fill();
}

function drawHarborPier(ctx, active) {
  // Wooden pier planks running from the rocks into the water.
  ctx.fillStyle = '#9c7a4d';
  ctx.fillRect(28, 338, 190, 14);
  ctx.strokeStyle = '#7a5c36';
  ctx.lineWidth = 2;
  for (let x = 28; x < 218; x += 24) {
    ctx.beginPath();
    ctx.moveTo(x, 338);
    ctx.lineTo(x, 352);
    ctx.stroke();
  }
  ctx.fillStyle = '#7a5c36';
  ctx.fillRect(40, 352, 10, 26);
  ctx.fillRect(196, 352, 10, 26);
  // A coil of rope and a crate on the pier.
  ctx.strokeStyle = '#c9a86a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(196, 336, 9, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#b08954';
  ctx.fillRect(52, 320, 20, 18);
  ctx.strokeStyle = '#8a6a3a';
  ctx.lineWidth = 2;
  ctx.strokeRect(52, 320, 20, 18);
}

function drawHarborFisherman(ctx, active) {
  // A fisherman standing on the pier, rod bent over the water.
  ctx.strokeStyle = '#5d3a17';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(168, 292);
  ctx.quadraticCurveTo(196, 268, 224, 300);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(40, 40, 40, 0.7)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(224, 300);
  ctx.lineTo(224, 356);
  ctx.stroke();
  // A fish jumping where the line meets the water.
  ctx.fillStyle = '#c0c8d0';
  ctx.beginPath();
  ctx.ellipse(224, 352, 12, 5, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(212, 350);
  ctx.lineTo(204, 344);
  ctx.lineTo(204, 356);
  ctx.closePath();
  ctx.fill();
  // Body, head and the hat whose colour is one of the differences.
  ctx.fillStyle = '#3f6d8e';
  ctx.fillRect(140, 288, 20, 34);
  ctx.fillStyle = '#f2c9a0';
  ctx.beginPath();
  ctx.arc(150, 276, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = active.has('hat') ? '#3f6d8e' : '#f2c94c';
  ctx.beginPath();
  ctx.arc(150, 272, 11, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(138, 270, 24, 4);
  ctx.fillStyle = '#33302a';
  ctx.fillRect(142, 322, 7, 16);
  ctx.fillRect(152, 322, 7, 16);
}

function drawHarborBuoy(ctx) {
  ctx.fillStyle = '#e4572e';
  ctx.beginPath();
  ctx.arc(200, 362, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f7f2e7';
  ctx.fillRect(188, 358, 24, 7);
  ctx.strokeStyle = '#33302a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(200, 350);
  ctx.lineTo(200, 342);
  ctx.stroke();
}

function drawHarborGulls(ctx, active) {
  const gulls = [[150, 66], [214, 46], [330, 78]];
  if (active.has('gull')) gulls.push([430, 58]);
  ctx.strokeStyle = '#33475c';
  ctx.lineWidth = 2;
  for (const [x, y] of gulls) {
    ctx.beginPath();
    ctx.moveTo(x - 10, y);
    ctx.quadraticCurveTo(x - 4, y - 7, x, y);
    ctx.quadraticCurveTo(x + 4, y - 7, x + 10, y);
    ctx.stroke();
  }
}
