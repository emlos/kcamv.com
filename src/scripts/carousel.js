let currentImage = 0;
const images = document.querySelectorAll('.carousel-img');
const progressBar = document.querySelector('.progress-bar');

function updateCarousel() {
  images.forEach((img, index) => {
    img.classList.remove('active');
    if (index === currentImage) {
      img.classList.add('active');
    }
  });
}

function updateProgressBar() {
  progressBar.innerHTML = '';
  images.forEach((_, index) => {
    const element = document.createElement('div');
    if (index === currentImage) {
      element.classList.add('triangle');
    } else {
      element.classList.add('dot');
    }
    progressBar.appendChild(element);
  });
}

document.getElementById('prevButton').addEventListener('click', () => {
  currentImage = (currentImage - 1 + images.length) % images.length;
  updateCarousel();
  updateProgressBar();
});

document.getElementById('nextButton').addEventListener('click', () => {
  currentImage = (currentImage + 1) % images.length;
  updateCarousel();
  updateProgressBar();
});

updateCarousel();
updateProgressBar();
