(function () {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var searchToggle = $('[data-search-toggle]');
  var searchPanel = $('[data-search-panel]');
  var searchInput = $('[data-site-search]');
  var searchResults = $('[data-search-results]');
  var menuToggle = $('[data-menu-toggle]');
  var mobileNav = $('[data-mobile-nav]');

  if (searchToggle && searchPanel) {
    searchToggle.addEventListener('click', function () {
      searchPanel.classList.toggle('is-open');
      if (searchPanel.classList.contains('is-open') && searchInput) {
        searchInput.focus();
      }
    });
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', function () {
      var query = searchInput.value.trim().toLowerCase();
      if (!query) {
        searchResults.innerHTML = '';
        return;
      }
      var data = window.SEARCH_INDEX || [];
      var matches = data.filter(function (item) {
        return [item.title, item.type, item.year, item.category, item.region, item.genre, item.line].join(' ').toLowerCase().indexOf(query) !== -1;
      }).slice(0, 18);
      if (!matches.length) {
        searchResults.innerHTML = '<div class="search-result"><strong>没有找到相关影片</strong><span>换一个关键词继续搜索</span></div>';
        return;
      }
      searchResults.innerHTML = matches.map(function (item) {
        return '<a class="search-result" href="' + item.url + '"><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.year + ' · ' + item.type + ' · ' + item.category) + '</span><em>' + escapeHtml(item.line) + '</em></a>';
      }).join('');
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (match) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[match];
    });
  }

  var hero = $('[data-hero]');
  if (hero) {
    var slides = $all('.hero-slide', hero);
    var dots = $all('[data-hero-dot]', hero);
    var current = 0;
    function showSlide(next) {
      if (!slides.length) {
        return;
      }
      current = (next + slides.length) % slides.length;
      slides.forEach(function (slide, index) {
        slide.classList.toggle('is-active', index === current);
      });
      dots.forEach(function (dot, index) {
        dot.classList.toggle('is-active', index === current);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  $all('[data-scroll-left]').forEach(function (button) {
    button.addEventListener('click', function () {
      var target = document.getElementById(button.getAttribute('data-scroll-left'));
      if (target) {
        target.scrollBy({ left: -420, behavior: 'smooth' });
      }
    });
  });

  $all('[data-scroll-right]').forEach(function (button) {
    button.addEventListener('click', function () {
      var target = document.getElementById(button.getAttribute('data-scroll-right'));
      if (target) {
        target.scrollBy({ left: 420, behavior: 'smooth' });
      }
    });
  });
})();
