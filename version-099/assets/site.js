(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var activeIndex = 0;

  function setSlide(index) {
    if (!slides.length) {
      return;
    }

    activeIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeIndex);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener('click', function () {
      setSlide(dotIndex);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      setSlide(activeIndex + 1);
    }, 5200);
  }

  var filterForms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));

  filterForms.forEach(function (scope) {
    var keyword = scope.querySelector('[data-filter-keyword]');
    var year = scope.querySelector('[data-filter-year]');
    var type = scope.querySelector('[data-filter-type]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));
    var empty = document.querySelector('[data-empty-state]');

    function applyFilter() {
      var keywordValue = keyword ? keyword.value.trim().toLowerCase() : '';
      var yearValue = year ? year.value : '';
      var typeValue = type ? type.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = (card.getAttribute('data-title') + ' ' + card.getAttribute('data-region') + ' ' + card.getAttribute('data-genre') + ' ' + card.getAttribute('data-tags')).toLowerCase();
        var matchesKeyword = !keywordValue || text.indexOf(keywordValue) !== -1;
        var matchesYear = !yearValue || card.getAttribute('data-year') === yearValue;
        var matchesType = !typeValue || card.getAttribute('data-type') === typeValue;
        var show = matchesKeyword && matchesYear && matchesType;

        card.style.display = show ? '' : 'none';

        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    [keyword, year, type].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });
  });
})();
