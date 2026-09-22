"use strict";

const arcanos = [
  "El Loco",
  "El Mago",
  "La Sacerdotisa",
  "La Emperatriz",
  "El Emperador",
  "El Hierofante",
  "Los Enamorados",
  "El Carro",
  "La Justicia",
  "El Ermitaño",
  "La Rueda de la Fortuna",
  "La Fuerza",
  "El Colgado",
  "La Muerte",
  "La Templanza",
  "El Diablo",
  "La Torre",
  "La Estrella",
  "La Luna",
  "El Sol",
  "El Juicio",
  "El Mundo"
];

const colors = [
  "#6A0DAD",
  "#A855F7",
  "#6A0DAD",
  "#A855F7",
  "#6A0DAD",
  "#A855F7",
  "#6A0DAD",
  "#A855F7",
  "#6A0DAD",
  "#A855F7",
  "#6A0DAD",
  "#A855F7",
  "#6A0DAD",
  "#A855F7",
  "#6A0DAD",
  "#A855F7",
  "#6A0DAD",
  "#A855F7",
  "#6A0DAD",
  "#A855F7",
  "#6A0DAD",
  "#A855F7"
];

const lightColor = "#D8B4FE";
const darkColor = "#1E1E24";
const textColor = "#FAF7FF";

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const spinButton = document.getElementById("spinButton");
const status = document.getElementById("status");
const resultCard = document.getElementById("resultCard");
const resultName = document.getElementById("resultName");
const resultNumber = document.getElementById("resultNumber");
const pdfButton = document.getElementById("pdfButton");
const resetButton = document.getElementById("resetButton"); 

const total = arcanos.length;
const slice = (Math.PI * 2) / total;

let rotation = 0;
let spinning = false;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const size = Math.max(1, Math.round(rect.width));
  const dpr = window.devicePixelRatio || 1;

  canvas.width = size * dpr;
  canvas.height = size * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawWheel();
}

function drawWheel() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const size = Math.min(width, height);

  if (!size) {
    return;
  }

  const cx = width / 2;
  const cy = height / 2;
  const radius = size * 0.46;

  ctx.clearRect(0, 0, width, height);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);

for (let i = 0; i < total; i++) {
    const start = -Math.PI / 2 + i * slice;
    const end = start + slice;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, start, end);
    ctx.closePath();

    ctx.fillStyle = colors[i];
    ctx.fill();

    ctx.strokeStyle = "#D8B4FE88";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const mid = start + slice / 2;
    // Ajustamos el textRadius para que empiece más cerca del centro o del borde según prefieras
    const textRadius = radius * 0.50; 

    ctx.save();
    ctx.translate(
      Math.cos(mid) * textRadius,
      Math.sin(mid) * textRadius
    );
    
    // CAMBIO CLAVE: Quitamos el Math.PI / 2 para que el texto apunte hacia afuera del círculo (vertical)
    ctx.rotate(mid); 

    const name = arcanos[i];
    
    // Al estar vertical, ahora tienes más espacio hacia el borde del círculo.
    // 'maxHeight' (o la longitud máxima de la línea) ahora puede ser hasta el borde del radio.
    const maxHeightText = radius * 0.45; 

    let fontSize = Math.max(11, Math.min(17, size * 0.025));
    ctx.font = "700 " + fontSize + "px Georgia, serif";

    // El control de tamaño sigue midiendo el ancho del texto, 
    // pero ahora se limita contra el espacio vertical disponible (maxHeightText)
    while (
      ctx.measureText(name).width > maxHeightText &&
      fontSize > 9
    ) {
      fontSize -= 1;
      ctx.font = "700 " + fontSize + "px Georgia, serif";
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = i % 2 === 0 ? textColor : "#FFFFFF";

    ctx.shadowColor = "#1E1E24CC";
    ctx.shadowBlur = 4;

    // Si tu función drawWrappedText escribe líneas hacia abajo, 
    // ahora esas "líneas" se extenderán hacia el borde exterior de la rueda.
    drawWrappedText(name, 0, 0, maxHeightText, fontSize * 1.05);

    ctx.restore();
}


  ctx.restore();

  // Borde exterior
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = lightColor;
  ctx.lineWidth = Math.max(3, size * 0.008);
  ctx.shadowColor = "#A855F7AA";
  ctx.shadowBlur = 14;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Centro
  const centerRadius = radius * 0.18;

  ctx.beginPath();
  ctx.arc(cx, cy, centerRadius, 0, Math.PI * 2);
  ctx.fillStyle = darkColor;
  ctx.fill();

  ctx.strokeStyle = lightColor;
  ctx.lineWidth = Math.max(2, size * 0.006);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, centerRadius * 0.72, 0, Math.PI * 2);
  ctx.strokeStyle = "#A855F7";
  ctx.lineWidth = Math.max(2, size * 0.004);
  ctx.shadowColor = "#A855F7CC";
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Símbolo central
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = lightColor;
  ctx.strokeStyle = lightColor;
  ctx.lineWidth = Math.max(2, size * 0.004);
  ctx.font = Math.max(22, size * 0.055) + "px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "#A855F7CC";
  ctx.shadowBlur = 10;
  ctx.fillText("✦", 0, 1);
  ctx.restore();
}

function drawWrappedText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  const lines = [];
  let current = "";

  words.forEach(function(word) {
    const test = current ? current + " " + word : word;

    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      if (current) {
        lines.push(current);
      }
      current = word;
    }
  });

  if (current) {
    lines.push(current);
  }

  const startY = y - ((lines.length - 1) * lineHeight) / 2;

  lines.forEach(function(line, index) {
    ctx.fillText(line, x, startY + index * lineHeight);
  });
}

function getSelectedIndex() {
  const normalized =
    ((-rotation % (Math.PI * 2)) + Math.PI * 2) %
    (Math.PI * 2);

  return Math.floor(normalized / slice) % total;
}

function spinWheel() {
    if (spinning) { return; }
    spinning = true;
    spinButton.disabled = true;
    
    // MODIFICADO: Ocultamos el contenedor de resultados y el botón de reinicio al empezar a girar
    resultCard.classList.add("hidden");
    if (resetButton) { resetButton.style.display = "none"; } 
    
    status.textContent = "La ruleta está girando...";
    
    const selectedIndex = Math.floor(Math.random() * total);
    const targetAngle = -selectedIndex * slice - slice / 2;
    const current = rotation % (Math.PI * 2);
    const normalizedCurrent = current < 0 ? current + Math.PI * 2 : current;
    
    let delta = targetAngle - normalizedCurrent;
    while (delta < 0) { delta += Math.PI * 2; }
    
    const extraTurns = 6 + Math.floor(Math.random() * 3);
    const finalRotation = rotation + delta + extraTurns * Math.PI * 2;
    const startRotation = rotation;
    const duration = 4800 + Math.random() * 700;
    const startTime = performance.now();
    
    function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const eased = 1 - Math.pow(1 - progress, 3);
        rotation = startRotation + (finalRotation - startRotation) * eased;
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            rotation = finalRotation;
            drawWheel();
            showResult(selectedIndex);
            spinning = false;
            spinButton.disabled = false;
        }
    }
    requestAnimationFrame(animate);
}

function showResult(index) {
    const number = index + 1;
    const pdfNumber = String(number).padStart(2, "0");
    
    resultName.textContent = arcanos[index];
    resultNumber.textContent = "Arcano " + number;
    pdfButton.href = "pdf/opcion-" + pdfNumber + ".pdf";
    pdfButton.setAttribute("download", "Arcano-" + pdfNumber + ".pdf");
    
    resultCard.classList.remove("hidden");
    
    // NUEVO: Hacemos visible el botón de reinicio en bloque debajo del PDF
    if (resetButton) { resetButton.style.display = "block"; } 
    
    status.textContent = "Tu Arcano ha sido elegido.";
}

// NUEVO: Escuchador para que el botón de reinicio vuelva a ejecutar el giro de la ruleta
if (resetButton) {
    resetButton.addEventListener("click", spinWheel);
}

spinButton.addEventListener("click", spinWheel);
window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", function() {
    resizeCanvas();
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
        themeColor.setAttribute("content", "#1E1E24");
    }
});
