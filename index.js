// Initialize Swiper
const swiper = new Swiper('.swiper', {
  direction: 'horizontal',
  loop: true,
  allowTouchMove: false,
  speed: 800,
  spaceBetween: 10,
  pagination: { el: '.swiper-pagination', clickable: true },
  navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
});

let activeText = null;

// Select a text overlay
function selectText(el) {
  document.querySelectorAll('.text-overlay').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  activeText = el;

  // Update controls
  document.getElementById('fontSelect').value = el.style.fontFamily || 'Arial';
  document.getElementById('fontSize').value = parseInt(el.style.fontSize) || 24;
  const rot = el.style.transform.match(/rotate\(([-\d.]+)deg\)/);
  document.getElementById('rotate').value = rot ? rot[1] : 0;
}

// Make a text element draggable
function makeDraggable(el) {
  el.addEventListener('mousedown', e => {
    selectText(el);
    const startX = e.clientX - el.offsetLeft;
    const startY = e.clientY - el.offsetTop;

    function onMouseMove(e) {
      el.style.left = (e.clientX - startX) + 'px';
      el.style.top = (e.clientY - startY) + 'px';
      el.style.transform = `rotate(${document.getElementById('rotate').value}deg)`;
      e.preventDefault();
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', onMouseMove);
    }, { once: true });
  });
}

//resize text
function makeResizable(textEl) {
  const handle = document.createElement('div');
  handle.className = 'resize-handle';
  textEl.appendChild(handle);

  handle.addEventListener('mousedown', e => {
    e.stopPropagation(); // prevent dragging text
    selectText(textEl);

    const startX = e.clientX;
    const startFontSize = parseInt(window.getComputedStyle(textEl).fontSize);

    function onMouseMove(e) {
      const dx = e.clientX - startX;
      const newSize = Math.max(10, startFontSize + dx); // adjust proportional size
      textEl.style.fontSize = newSize + 'px';
      fontSize.value = newSize;
      e.preventDefault();
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', onMouseMove);
    }, { once: true });
  });
}

// Get current active slide
function getCurrentSlide() {
  return document.querySelector('.swiper-slide-active');
}

// Add text
document.getElementById('addText').addEventListener('click', () => {
  const slide = getCurrentSlide();
  const div = document.createElement('div');
  div.className = 'text-overlay active';
  div.contentEditable = true;
  div.innerText = 'New Text';
  div.style.left = '50%';
  div.style.top = '50%';
  slide.appendChild(div);
  makeDraggable(div);
  makeResizable(div);
  selectText(div);
});

// Remove text
document.getElementById('removeText').addEventListener('click', () => {
  if (activeText) {
    activeText.remove();
    activeText = null;
  }
});

// Copy text
document.getElementById('copyText').addEventListener('click', () => {
  if (!activeText) return;
  const slide = getCurrentSlide();
  const copy = activeText.cloneNode(true);
  copy.style.left = (activeText.offsetLeft + 20) + 'px';
  copy.style.top = (activeText.offsetTop + 20) + 'px';
  slide.appendChild(copy);
  makeDraggable(copy);
  selectText(copy);
});

// Font, size, rotation controls
const fontSelect = document.getElementById('fontSelect');
const fontSize = document.getElementById('fontSize');
const rotate = document.getElementById('rotate');

function updateStyle() {
  if (!activeText) return;
  activeText.style.fontFamily = fontSelect.value;
  activeText.style.fontSize = fontSize.value + 'px';
  activeText.style.transform = `rotate(${rotate.value}deg)`;
}


fontSelect.addEventListener('change', updateStyle);
fontSize.addEventListener('input', updateStyle);
rotate.addEventListener('input', updateStyle);