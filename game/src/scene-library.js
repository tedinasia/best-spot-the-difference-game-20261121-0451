// Level 2 scene: The Old Library. A cosy reading room drawn with canvas primitives:
// a tall bookshelf, a night window, an armchair with a sleeping cat, a floor lamp, a
// wall clock, a side table with a teapot, a potted plant and a framed picture. Same
// contract as the other scenes: draw(ctx, active) renders the base picture, then applies
// every difference id in `active` to this copy.
export const libraryScene = {
  id: 'library',
  name: 'The Old Library',
  width: 560,
  height: 420,
  differences: [
    { id: 'catTail', x: 382, y: 332, r: 22, hint: 'The cat on the chair' },
    { id: 'clock', x: 432, y: 252, r: 26, hint: 'What time is it?' },
    { id: 'book', x: 126, y: 170, r: 20, hint: 'One book on the middle shelf' },
    { id: 'teacup', x: 140, y: 312, r: 20, hint: 'Something to drink on the table' },
    { id: 'leaves', x: 230, y: 338, r: 20, hint: 'Count the plant leaves' },
    { id: 'lamp', x: 300, y: 232, r: 26, hint: 'The floor lamp' },
    { id: 'picture', x: 396, y: 156, r: 24, hint: 'The picture on the wall' },
  ],

  draw(ctx, active) {
    drawLibraryRoom(ctx);
    drawLibraryWindow(ctx);
    drawLibraryBookshelf(ctx, active);
    drawLibraryPicture(ctx, active);
    drawLibraryClock(ctx, active);
    drawLibraryLamp(ctx, active);
    drawLibraryTable(ctx, active);
    drawLibraryPlant(ctx, active);
    drawLibraryArmchair(ctx, active);
    drawLibraryRug(ctx);
  },
};

function drawLibraryRoom(ctx) {
  ctx.fillStyle = '#f3e2c7';
  ctx.fillRect(0, 0, 560, 420);
  // Wainscot along the bottom of the wall.
  ctx.fillStyle = '#e0c69a';
  ctx.fillRect(0, 330, 560, 90);
  ctx.fillStyle = '#c9ab7d';
  ctx.fillRect(0, 330, 560, 6);
  // Wooden floor.
  ctx.fillStyle = '#a9805a';
  ctx.fillRect(0, 380, 560, 40);
  ctx.strokeStyle = 'rgba(90, 60, 30, 0.5)';
  ctx.lineWidth = 1;
  for (let y = 392; y < 420; y += 12) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(560, y);
    ctx.stroke();
  }
}

function drawLibraryWindow(ctx) {
  // Night window with a moon, stars and curtains, on the right wall.
  ctx.fillStyle = '#7a5c36';
  ctx.fillRect(372, 28, 156, 176);
  ctx.fillStyle = '#101c3a';
  ctx.fillRect(382, 38, 136, 156);
  ctx.fillStyle = '#f2e8c9';
  ctx.beginPath();
  ctx.arc(478, 82, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  const stars = [[398, 60], [420, 92], [452, 52], [500, 110], [430, 140], [496, 150], [408, 168]];
  for (const [x, y] of stars) {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  // Rooftops in the distance.
  ctx.fillStyle = '#0a1226';
  ctx.beginPath();
  ctx.moveTo(382, 194);
  ctx.lineTo(420, 162);
  ctx.lineTo(458, 194);
  ctx.lineTo(486, 168);
  ctx.lineTo(518, 194);
  ctx.closePath();
  ctx.fill();
  // Curtains.
  ctx.fillStyle = '#8e3b46';
  ctx.beginPath();
  ctx.moveTo(372, 28);
  ctx.lineTo(402, 28);
  ctx.lineTo(394, 204);
  ctx.lineTo(372, 204);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(528, 28);
  ctx.lineTo(498, 28);
  ctx.lineTo(506, 204);
  ctx.lineTo(528, 204);
  ctx.closePath();
  ctx.fill();
}

function drawLibraryBookshelf(ctx, active) {
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(28, 28, 316, 306);
  const shelfYs = [28, 122, 216];
  const bookColors = ['#c0392b', '#2980b9', '#27ae60', '#e67e22', '#8e44ad', '#16a085', '#d4a017'];
  for (let s = 0; s < 3; s++) {
    const top = shelfYs[s];
    // Shelf board.
    ctx.fillStyle = '#54371f';
    ctx.fillRect(36, top + 82, 300, 8);
    // A row of books with varied heights and colours.
    let x = 40;
    let i = 0;
    while (x < 322) {
      const w = 16 + ((i * 7) % 10);
      const h = 52 + ((i * 13) % 24);
      let color = bookColors[(i + s * 3) % bookColors.length];
      // The middle shelf's fourth book changes colour between the pictures.
      if (s === 1 && i === 3) color = active.has('book') ? '#27ae60' : '#c0392b';
      ctx.fillStyle = color;
      ctx.fillRect(x, top + 82 - h, w, h);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillRect(x, top + 82 - h, w, 5);
      x += w + 3;
      i++;
    }
  }
  // A small globe on top of the shelf.
  ctx.fillStyle = '#2e6da4';
  ctx.beginPath();
  ctx.arc(60, 14, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#8a6a3a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(60, 14, 14, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();
}

function drawLibraryPicture(ctx, active) {
  ctx.fillStyle = '#5d3a17';
  ctx.fillRect(352, 118, 92, 76);
  ctx.fillStyle = '#dfe9f2';
  ctx.fillRect(358, 124, 80, 64);
  if (active.has('picture')) {
    // A little sailboat on the water instead of a mountain.
    ctx.fillStyle = '#3d8fc9';
    ctx.fillRect(358, 156, 80, 32);
    ctx.fillStyle = '#f7f2e7';
    ctx.beginPath();
    ctx.moveTo(392, 132);
    ctx.lineTo(392, 158);
    ctx.lineTo(376, 158);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#7a4a21';
    ctx.fillRect(384, 158, 18, 5);
  } else {
    // A mountain under a pale sky.
    ctx.fillStyle = '#7a9a5a';
    ctx.beginPath();
    ctx.moveTo(358, 188);
    ctx.lineTo(388, 138);
    ctx.lineTo(418, 188);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#5d8a5a';
    ctx.beginPath();
    ctx.moveTo(398, 188);
    ctx.lineTo(424, 150);
    ctx.lineTo(438, 188);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(388, 138);
    ctx.lineTo(381, 152);
    ctx.lineTo(395, 152);
    ctx.closePath();
    ctx.fill();
  }
}

function drawLibraryClock(ctx, active) {
  ctx.fillStyle = '#5d3a17';
  ctx.beginPath();
  ctx.arc(432, 252, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fdf6e3';
  ctx.beginPath();
  ctx.arc(432, 252, 25, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#20242e';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(432 + Math.cos(a) * 20, 252 + Math.sin(a) * 20, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = '#20242e';
  ctx.lineWidth = 2.5;
  // The hands: three o'clock on the base copy, half past four on the changed one.
  const hourAngle = active.has('clock') ? (4.5 / 12) * Math.PI * 2 - Math.PI / 2 : (3 / 12) * Math.PI * 2 - Math.PI / 2;
  const minuteAngle = active.has('clock') ? Math.PI / 2 : -Math.PI / 2;
  ctx.beginPath();
  ctx.moveTo(432, 252);
  ctx.lineTo(432 + Math.cos(hourAngle) * 13, 252 + Math.sin(hourAngle) * 13);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(432, 252);
  ctx.lineTo(432 + Math.cos(minuteAngle) * 19, 252 + Math.sin(minuteAngle) * 19);
  ctx.stroke();
  ctx.fillStyle = '#c0392b';
  ctx.beginPath();
  ctx.arc(432, 252, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawLibraryLamp(ctx, active) {
  const lit = !active.has('lamp');
  if (lit) {
    // Warm glow spilling onto the wall and floor.
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = '#ffd94d';
    ctx.beginPath();
    ctx.arc(300, 232, 62, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.strokeStyle = '#3a2f22';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(300, 380);
  ctx.lineTo(300, 214);
  ctx.stroke();
  ctx.fillStyle = '#3a2f22';
  ctx.beginPath();
  ctx.ellipse(300, 382, 18, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  // The shade: glowing amber when lit, dull sage when off.
  ctx.fillStyle = lit ? '#f2b705' : '#8a9a7a';
  ctx.beginPath();
  ctx.moveTo(278, 214);
  ctx.lineTo(322, 214);
  ctx.lineTo(330, 244);
  ctx.lineTo(270, 244);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = lit ? '#ffe08a' : '#a8b89a';
  ctx.beginPath();
  ctx.ellipse(300, 244, 30, 5, 0, 0, Math.PI);
  ctx.fill();
}

function drawLibraryTable(ctx, active) {
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(84, 322, 96, 10);
  ctx.fillRect(92, 332, 8, 48);
  ctx.fillRect(164, 332, 8, 48);
  // Teapot: round body, spout, handle and lid.
  ctx.fillStyle = '#7a9ab5';
  ctx.beginPath();
  ctx.ellipse(104, 308, 16, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(88, 304);
  ctx.lineTo(76, 296);
  ctx.lineTo(78, 306);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#5d7a92';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(120, 306, 8, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  ctx.fillStyle = '#5d7a92';
  ctx.beginPath();
  ctx.arc(104, 294, 6, 0, Math.PI * 2);
  ctx.fill();
  // The teacup only sits on the table in the base picture.
  if (!active.has('teacup')) {
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(132, 306, 16, 12);
    ctx.fillStyle = '#e8a13c';
    ctx.fillRect(132, 306, 16, 3);
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(150, 312, 5, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  }
  // A little stack of books under the table.
  ctx.fillStyle = '#8e44ad';
  ctx.fillRect(96, 352, 44, 8);
  ctx.fillStyle = '#16a085';
  ctx.fillRect(100, 344, 38, 8);
}

function drawLibraryPlant(ctx, active) {
  ctx.fillStyle = '#b5651d';
  ctx.beginPath();
  ctx.moveTo(192, 356);
  ctx.lineTo(224, 356);
  ctx.lineTo(218, 388);
  ctx.lineTo(198, 388);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#8a4a15';
  ctx.fillRect(190, 352, 36, 6);
  // Leaves: five on the base copy, four on the changed one.
  const leafAngles = [-1.1, -0.55, 0, 0.55, 1.1];
  const count = active.has('leaves') ? 4 : 5;
  ctx.fillStyle = '#2e7d32';
  for (let i = 0; i < count; i++) {
    const a = leafAngles[i] - Math.PI / 2;
    const tipX = 208 + Math.cos(a) * 34;
    const tipY = 352 + Math.sin(a) * 34;
    ctx.beginPath();
    ctx.moveTo(208, 352);
    ctx.quadraticCurveTo(208 + Math.cos(a - 0.3) * 20, 352 + Math.sin(a - 0.3) * 20, tipX, tipY);
    ctx.quadraticCurveTo(208 + Math.cos(a + 0.3) * 20, 352 + Math.sin(a + 0.3) * 20, 208, 352);
    ctx.fill();
  }
}

function drawLibraryArmchair(ctx, active) {
  // A deep armchair with a cushion, and a cat curled up asleep on it.
  ctx.fillStyle = '#7a4a21';
  ctx.beginPath();
  ctx.moveTo(348, 400);
  ctx.lineTo(348, 300);
  ctx.quadraticCurveTo(348, 268, 380, 268);
  ctx.lineTo(468, 268);
  ctx.quadraticCurveTo(500, 268, 500, 300);
  ctx.lineTo(500, 400);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#8e44ad';
  ctx.beginPath();
  ctx.roundRect(360, 282, 128, 62, 14);
  ctx.fill();
  ctx.fillStyle = '#9b59b6';
  ctx.beginPath();
  ctx.roundRect(362, 344, 124, 40, 12);
  ctx.fill();
  // The cat: a curled grey body, a head, ears, and a tail that points up or down.
  ctx.fillStyle = '#9aa0a6';
  ctx.beginPath();
  ctx.ellipse(424, 330, 34, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(452, 318, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(442, 308);
  ctx.lineTo(444, 296);
  ctx.lineTo(450, 306);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(456, 306);
  ctx.lineTo(462, 296);
  ctx.lineTo(464, 308);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#6e7378';
  ctx.lineWidth = 5;
  ctx.beginPath();
  if (active.has('catTail')) {
    ctx.moveTo(394, 332);
    ctx.quadraticCurveTo(378, 344, 384, 358);
  } else {
    ctx.moveTo(394, 330);
    ctx.quadraticCurveTo(376, 322, 380, 306);
  }
  ctx.stroke();
  // Closed eyes and a pink nose.
  ctx.strokeStyle = '#4a4d52';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(446, 318);
  ctx.lineTo(450, 318);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(458, 318);
  ctx.lineTo(462, 318);
  ctx.stroke();
  ctx.fillStyle = '#e88ca0';
  ctx.beginPath();
  ctx.arc(465, 322, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawLibraryRug(ctx) {
  ctx.fillStyle = '#8e3b46';
  ctx.beginPath();
  ctx.ellipse(280, 402, 150, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e8a13c';
  ctx.beginPath();
  ctx.ellipse(280, 402, 118, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8e3b46';
  ctx.beginPath();
  ctx.ellipse(280, 402, 84, 7, 0, 0, Math.PI * 2);
  ctx.fill();
}
