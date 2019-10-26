const SMALL = 'data/4x4.json';
const MEDIUM = 'data/32x32.json';
const BIG = 'data/image.png';

const SIZE_DEFAULT = 32;
const SIZE_CANVAS = 512;

let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');

ctx.imageSmoothingEnable = false;

canvas.width = SIZE_CANVAS;
canvas.height = SIZE_CANVAS;

const sizeItems = document.querySelectorAll('.size-item');

sizeItems.forEach(el => {
  el.addEventListener('click', e => {
    if (el.classList.contains('active')) return;
    else {
      sizeItems.forEach(element => {
        if (element.classList.contains('active')) element.classList.remove('active');
      });
      el.classList.add('active');
    }
    changeElementSize(canvas, el);
  });
});

drawCanvas(canvas, BIG, SIZE_DEFAULT);

function changeElementSize(canvas, element) {
  const newSize = parseInt(element.dataset.size);

  switch (newSize) {
    case parseInt(document.querySelector('.small').dataset.size):
      drawCanvas(canvas, SMALL, newSize);
      break;
    case parseInt(document.querySelector('.medium').dataset.size):
      drawCanvas(canvas, MEDIUM, newSize);
      break;
    case parseInt(document.querySelector('.big').dataset.size):
      drawCanvas(canvas, BIG, newSize);
      break;
  }
}

function drawCanvas(canvas, path, size) {
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (path === BIG) {
    const image = new Image();
    image.src = path;
    image.onload = function() {
      ctx.drawImage(image, 0, 0, SIZE_CANVAS, SIZE_CANVAS);
    };
  } else {
    loadJSON(path, size, ctx);
  }
}

function loadJSON(path, size, ctx) {
  var xobj = new XMLHttpRequest();
  xobj.addEventListener('load', function() {
    const data = JSON.parse(this.response);
    data.forEach((elem, i) => {
      elem.forEach((color, j) => {
        if (path === SMALL) {
          ctx.fillStyle = `#${color}`;
        } else {
          let rgbColor = `rgba(`;
          color.forEach((rgb, index) => {
            if (index !== 3) rgbColor += `${rgb},`;
            else {
              rgbColor += `${rgb})`;
            }
          });
          ctx.fillStyle = rgbColor;
        }
        ctx.fillRect(i * (SIZE_CANVAS / size), j * (SIZE_CANVAS / size), SIZE_CANVAS / size, SIZE_CANVAS / size);
      });
    });
  });
  xobj.open('GET', path);
  xobj.send();
}
