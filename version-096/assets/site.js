(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
      return;
    }
    document.addEventListener('DOMContentLoaded', callback);
  }

  function setupNavigation() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var panel = document.querySelector('[data-mobile-nav]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      var open = panel.classList.toggle('is-open');
      document.body.classList.toggle('is-nav-open', open);
      toggle.textContent = open ? '×' : '☰';
    });
  }

  function setupHeroSlider() {
    var slider = document.querySelector('[data-hero-slider]');
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    if (slides.length < 2) {
      return;
    }
    var current = 0;
    var timer = null;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }
    function start() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(current + 1);
      }, 6200);
    }
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        start();
      });
    });
    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }
    start();
  }

  function filterCards(scope) {
    var input = scope.querySelector('.js-search-input');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
    var empty = scope.querySelector('.empty-state');
    var activeFilter = 'all';
    var params = new URLSearchParams(window.location.search);
    var queryFromUrl = params.get('q') || '';
    if (input && queryFromUrl) {
      input.value = queryFromUrl;
    }
    function apply() {
      var query = input ? input.value.trim().toLowerCase() : '';
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = (card.getAttribute('data-search') || '').toLowerCase();
        var category = card.getAttribute('data-category') || '';
        var matchText = !query || haystack.indexOf(query) !== -1;
        var matchFilter = activeFilter === 'all' || category === activeFilter;
        var show = matchText && matchFilter;
        card.hidden = !show;
        if (show) {
          visible += 1;
        }
      });
      if (empty) {
        empty.hidden = visible !== 0;
      }
    }
    if (input) {
      input.addEventListener('input', apply);
    }
    scope.querySelectorAll('[data-clear-search]').forEach(function (button) {
      button.addEventListener('click', function () {
        if (input) {
          input.value = '';
          input.focus();
        }
        apply();
      });
    });
    scope.querySelectorAll('[data-filter-value]').forEach(function (button) {
      button.addEventListener('click', function () {
        activeFilter = button.getAttribute('data-filter-value') || 'all';
        scope.querySelectorAll('[data-filter-value]').forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });
        apply();
      });
    });
    apply();
  }

  function setupSearch() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-search-scope]'));
    scopes.forEach(filterCards);
  }

  function setupPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
    players.forEach(function (player) {
      var video = player.querySelector('video');
      var button = player.querySelector('.player-button');
      var source = player.getAttribute('data-video-src');
      if (!video || !source) {
        return;
      }
      function attachSource() {
        if (video.dataset.ready === 'true') {
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: false,
            backBufferLength: 90
          });
          hls.loadSource(source);
          hls.attachMedia(video);
          player.hlsInstance = hls;
        } else {
          video.src = source;
        }
        video.dataset.ready = 'true';
      }
      function play() {
        attachSource();
        player.classList.add('is-playing');
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {
            video.controls = true;
          });
        }
      }
      if (button) {
        button.addEventListener('click', play);
      }
      video.addEventListener('click', function () {
        if (video.dataset.ready !== 'true') {
          play();
        }
      });
      video.addEventListener('play', function () {
        player.classList.add('is-playing');
      });
    });
  }

  ready(function () {
    setupNavigation();
    setupHeroSlider();
    setupSearch();
    setupPlayers();
  });
}());
