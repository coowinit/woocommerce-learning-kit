
document.addEventListener('DOMContentLoaded', function () {
  const search = document.querySelector('[data-product-search]');
  const cards = document.querySelectorAll('[data-card]');

  if (search && cards.length) {
    search.addEventListener('input', function () {
      const keyword = search.value.trim().toLowerCase();

      cards.forEach(function (card) {
        const target = (card.dataset.name + ' ' + card.dataset.category).toLowerCase();
        card.style.display = target.includes(keyword) ? '' : 'none';
      });
    });
  }

  document.querySelectorAll('[data-options]').forEach(function (group) {
    group.querySelectorAll('button').forEach(function (button) {
      button.addEventListener('click', function () {
        group.querySelectorAll('button').forEach(function (item) {
          item.classList.remove('active');
        });
        button.classList.add('active');
      });
    });
  });

  const tabs = document.querySelectorAll('[data-tab]');
  const panels = document.querySelectorAll('[data-panel]');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (item) {
        item.classList.remove('active');
      });

      tab.classList.add('active');

      panels.forEach(function (panel) {
        panel.hidden = panel.dataset.panel !== tab.dataset.tab;
      });
    });
  });

  /* Swiper product gallery */
  if (typeof Swiper !== 'undefined' && document.querySelector('.product-main-swiper')) {
    const thumbsSwiper = new Swiper('.product-thumbs-swiper', {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
      breakpoints: {
        0: {
          slidesPerView: 3.5,
          spaceBetween: 8
        },
        640: {
          slidesPerView: 4,
          spaceBetween: 10
        },
        960: {
          slidesPerView: 5,
          spaceBetween: 12
        }
      }
    });

    new Swiper('.product-main-swiper', {
      spaceBetween: 10,
      loop: true,
      speed: 520,
      grabCursor: true,
      keyboard: {
        enabled: true
      },
      thumbs: {
        swiper: thumbsSwiper
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });
  }

  /* Variation image switch */
  const variationImage = document.querySelector('[data-variation-image]');
  const variationButtons = document.querySelectorAll('[data-variation-option]');
  const variationThumbs = document.querySelectorAll('[data-variation-thumb]');

  function setTextAll(selector, value) {
    document.querySelectorAll(selector).forEach(function (node) {
      node.textContent = value || '';
    });
  }

  function updateVariation(source) {
    if (!variationImage || !source) return;

    const image = source.dataset.image;
    const name = source.dataset.name;
    const price = source.dataset.price;
    const sku = source.dataset.sku;
    const description = source.dataset.description;

    variationImage.classList.add('is-changing');

    window.setTimeout(function () {
      if (image) variationImage.src = image;
      if (name) variationImage.alt = name;

      setTextAll('[data-variation-name]', name);
      setTextAll('[data-variation-title]', name);
      setTextAll('[data-variation-price]', price);
      setTextAll('[data-variation-sku]', sku);
      setTextAll('[data-variation-description]', description);

      variationImage.classList.remove('is-changing');
    }, 160);
  }

  function syncActiveByName(name) {
    variationButtons.forEach(function (button) {
      button.classList.toggle('active', button.dataset.name === name);
    });

    variationThumbs.forEach(function (thumb) {
      thumb.classList.toggle('active', thumb.dataset.name === name);
    });
  }

  if (variationImage && variationButtons.length) {
    variationButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        syncActiveByName(button.dataset.name);
        updateVariation(button);
      });
    });
  }

  if (variationImage && variationThumbs.length) {
    variationThumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        syncActiveByName(thumb.dataset.name);
        updateVariation(thumb);
      });
    });
  }
});
