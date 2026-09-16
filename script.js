const arcanos = [
  'El Loco', 'El Mago', 'La Sacerdotisa', 'La Emperatriz', 'El Emperador',
  'El Hierofante', 'Los Enamorados', 'El Carro', 'La Justicia', 'El Ermitaño',
  'La Rueda de la Fortuna', 'La Fuerza', 'El Colgado', 'La Muerte',
  'La Templanza', 'El Diablo', 'La Torre', 'La Estrella', 'La Luna',
  'El Sol', 'El Juicio', 'El Mundo'
];

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const status = document.getElementById('status');
const resultCard = document.getElementById('resultCard');
const resultName = document.getElementById('resultName');
const resultNumber = document.getElementById('resultNumber');
const pdfButton = document.getElementById('pdfButton');

const center = canvas.width / 2;
const radius = center - 18;
const segmentAngle = (Math.PI * 2) / arcanos.length;
let rotation = 0;
let spinning = false;

function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(rotation);

  for (let i = 0; i < arcanos.length; i += 1) {
    const start = -Math.PI / 2 + i * segmentAngle;
    const end = start + segmentAngle;
    const hue = 250 + (i % 6) * 9;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = `hsl(${hue}, 28%, ${i % 2 === 0 ? 25 : 31}%)`;
    ctx.fill();
    ctx.strokeStyle = '#d8b46a99';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.rotate(start + segmentAngle / 2);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff8e8';
    ctx.font = 'bold 17px Arial';
    ctx.fillText(String(i + 1).padStart(2, '0'), radius - 24, 0);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(0, 0, 65, 0, Math.PI * 2);
  ctx.fillStyle = '#17152b';
  ctx.fill();
  ctx.strokeStyle = '#d8b46a';
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.restore();
}

function chooseArcano() {
  return Math.floor(Math.random() * arcanos.length);
}

function showResult(index) {
  const fileName = `pdf/opcion-${String(index + 1).padStart(2, '0')}.pdf`;
  resultName.textContent = arcanos[index];
  resultNumber.textContent = `Arcano ${index + 1} de 22`;
  pdfButton.href = fileName;
  pdfButton.setAttribute('download', fileName.split('/').pop());
  resultCard.classList.remove('hidden');
  status.textContent = 'Tu camino ha sido revelado.';
}

function spin() {
  if (spinning) return;
  spinning = true;
  spinButton.disabled = true;
  resultCard.classList.add('hidden');
  status.textContent = 'La ruleta está girando...';

  const selectedIndex = chooseArcano();
  const targetCenter = -Math.PI / 2 + (selectedIndex + 0.5) * segmentAngle;
  const desiredRotation = -targetCenter - Math.PI / 2;
  const extraTurns = (5 + Math.floor(Math.random() * 3)) * Math.PI * 2;
  const startRotation = rotation;
  const endRotation = rotation + extraTurns + desiredRotation - rotation;
  const duration = 4200;
  const startTime = performance.now();

  function animate(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    rotation = startRotation + (endRotation - startRotation) * eased;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      rotation %= Math.PI * 2;
      spinning = false;
      spinButton.disabled = false;
      showResult(selectedIndex);
    }
  }

  requestAnimationFrame(animate);
}

spinButton.addEventListener('click', spin);
drawWheel();
