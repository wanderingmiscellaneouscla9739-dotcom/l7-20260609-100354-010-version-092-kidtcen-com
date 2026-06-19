(function () {
    var navToggle = document.querySelector('[data-nav-toggle]');
    var mainNav = document.querySelector('[data-main-nav]');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function () {
            mainNav.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
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

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    });

    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
        var input = scope.querySelector('[data-search-input]');
        var yearSelect = scope.querySelector('[data-year-filter]');
        var typeSelect = scope.querySelector('[data-type-filter]');
        var items = Array.prototype.slice.call(scope.querySelectorAll('[data-title]'));
        var empty = scope.querySelector('[data-empty]');

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function applyFilter() {
            var keyword = normalize(input ? input.value : '');
            var year = yearSelect ? yearSelect.value : '';
            var type = typeSelect ? typeSelect.value : '';
            var visible = 0;

            items.forEach(function (item) {
                var text = normalize([
                    item.getAttribute('data-title'),
                    item.getAttribute('data-region'),
                    item.getAttribute('data-genre')
                ].join(' '));
                var itemYear = item.getAttribute('data-year') || '';
                var genre = item.getAttribute('data-genre') || '';
                var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
                var matchYear = !year || itemYear === year;
                var matchType = !type || genre.indexOf(type) !== -1;
                var shouldShow = matchKeyword && matchYear && matchType;

                item.style.display = shouldShow ? '' : 'none';
                if (shouldShow) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        [input, yearSelect, typeSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });
    });
})();
