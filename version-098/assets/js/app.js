(function () {
    var toggle = document.querySelector('.nav-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            var isOpen = mobileNav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var activeIndex = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        activeIndex = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === activeIndex);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === activeIndex);
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            showSlide(Number(dot.getAttribute('data-slide')) || 0);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(activeIndex + 1);
        }, 5600);
    }

    var toolPanels = Array.prototype.slice.call(document.querySelectorAll('.catalog-tools'));

    toolPanels.forEach(function (panel) {
        var scope = panel.parentElement || document;
        var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
        var input = panel.querySelector('.catalog-search');
        var filters = Array.prototype.slice.call(panel.querySelectorAll('.catalog-filter'));

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function applyFilters() {
            var query = normalize(input ? input.value : '');
            var values = {};

            filters.forEach(function (filter) {
                values[filter.getAttribute('data-filter')] = normalize(filter.value);
            });

            cards.forEach(function (card) {
                var text = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-category'),
                    card.getAttribute('data-tags')
                ].join(' '));

                var matched = true;

                if (query && text.indexOf(query) === -1) {
                    matched = false;
                }

                Object.keys(values).forEach(function (key) {
                    var expected = values[key];
                    var actual = normalize(card.getAttribute('data-' + key));

                    if (expected && actual !== expected) {
                        matched = false;
                    }
                });

                card.classList.toggle('is-filter-hidden', !matched);
            });
        }

        if (input) {
            input.addEventListener('input', applyFilters);
        }

        filters.forEach(function (filter) {
            filter.addEventListener('change', applyFilters);
        });
    });
})();
