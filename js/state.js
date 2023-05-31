var loader = document.querySelector('.loader-wrapper');
var event = new MouseEvent("click", {
  view: window,
  bubbles: true,
  cancelable: true,
});

function backendLink() {
  document.getElementById('backend-link').addEventListener('click', function(e) {
      document.getElementById('slider').style.zIndex = '-1';
      document.getElementById('image-form').style.display = 'block';
      document.getElementById('frontend-link').style.display = 'block';
      this.style.display = 'none';
  });
}

function frontendLink() {
  document.getElementById('frontend-link').addEventListener('click', function(e) {
    document.getElementById('image-form').style.display = 'none';
    document.getElementById('slider').style.zIndex = '1';
    document.getElementById('backend-link').style.display = 'block';
    this.style.display = 'none';
  });
}

function initializeSlider() {
  var progressCircle = document.querySelector(".autoplay-progress svg");
  var progressContent = document.querySelector(".autoplay-progress span");
  return new Swiper('.swiper', {
    spaceBetween: 30,
    centeredSlides: true,
    direction: 'vertical',
    observer: true,
    allowTouchMove: false,
    loop: true,
    speed: 1200,
    effect: 'slide',

    autoplay: {
      delay: 3000,
      disableOnInteraction: true,
      reverseDirection: true
    },

    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    on: {
      autoplayTimeLeft(s, time, progress) {
        progressCircle.style.setProperty('--progress', 1 - progress);
        progressContent.textContent = `${Math.ceil(time / 1000)}s`;
      }
    }
  });
}

function startLoader() {
  loader.style.display = 'block';
};

function stopLoader() {
  loader.style.display = 'none';
};

function goUp() {
  var btnPrev = document.querySelector('.swiper-button-prev');
  btnPrev.dispatchEvent(event);
}

function goDown() {
  var btnNext = document.querySelector('.swiper-button-next');
  btnNext.dispatchEvent(event);
}

export {backendLink, frontendLink, initializeSlider, goUp, goDown, startLoader, stopLoader};