(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        function startTimer() {
            clearInterval(timer);
            timer = setInterval(function () {
                showSlide(index + 1);
            }, 5600);
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                showSlide(dotIndex);
                startTimer();
            });
        });

        showSlide(0);
        startTimer();
    }

    var player = document.querySelector('[data-player]');

    if (player) {
        var video = player.querySelector('video');
        var button = player.querySelector('[data-play-button]');
        var status = player.querySelector('[data-player-status]');
        var stream = player.getAttribute('data-stream');
        var hlsInstance = null;
        var started = false;

        function setStatus(text) {
            if (status) {
                status.textContent = text;
            }
        }

        function playVideo() {
            if (!video || !stream) {
                setStatus('播放暂时不可用');
                return;
            }

            if (started) {
                video.play().catch(function () {
                    setStatus('点击视频继续播放');
                });
                return;
            }

            started = true;
            player.classList.add('is-playing');
            setStatus('播放准备中');

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });

                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);

                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {
                        player.classList.remove('is-playing');
                        setStatus('点击继续播放');
                    });
                });

                hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        player.classList.remove('is-playing');
                        setStatus('播放暂时不可用');
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
                video.addEventListener('loadedmetadata', function () {
                    video.play().catch(function () {
                        player.classList.remove('is-playing');
                        setStatus('点击继续播放');
                    });
                }, { once: true });
                video.load();
            } else {
                video.src = stream;
                video.play().catch(function () {
                    player.classList.remove('is-playing');
                    setStatus('播放暂时不可用');
                });
            }
        }

        if (button) {
            button.addEventListener('click', playVideo);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                playVideo();
            } else {
                video.pause();
            }
        });
    }

    var searchRoot = document.querySelector('[data-search-root]');

    if (searchRoot && window.MOVIE_SEARCH_INDEX) {
        var form = searchRoot.querySelector('[data-search-form]');
        var input = searchRoot.querySelector('[data-search-input]');
        var results = searchRoot.querySelector('[data-search-results]');
        var meta = searchRoot.querySelector('[data-search-meta]');
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q') || '';

        function escapeHtml(value) {
            return String(value)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        function cardTemplate(movie) {
            var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
                return '<span>' + escapeHtml(tag) + '</span>';
            }).join('');

            return '<article class="movie-card">'
                + '<a class="poster-link" href="' + escapeHtml(movie.link) + '">'
                + '<span class="poster-wrap">'
                + '<img src="' + escapeHtml(movie.image) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" onerror="this.style.display=\'none\'">'
                + '<span class="poster-shade"></span><span class="play-badge">▶</span></span>'
                + '<span class="card-body"><strong>' + escapeHtml(movie.title) + '</strong>'
                + '<span class="card-meta">' + escapeHtml(movie.year) + ' · ' + escapeHtml(movie.type) + '</span>'
                + '<p class="card-desc">' + escapeHtml(movie.oneLine || '') + '</p>'
                + '<span class="tag-row">' + tags + '</span></span></a></article>';
        }

        function search(query) {
            var normalized = query.trim().toLowerCase();
            var pool = window.MOVIE_SEARCH_INDEX;

            if (normalized) {
                pool = pool.filter(function (movie) {
                    var text = [
                        movie.title,
                        movie.region,
                        movie.type,
                        movie.year,
                        movie.genre,
                        (movie.tags || []).join(' '),
                        movie.oneLine
                    ].join(' ').toLowerCase();

                    return text.indexOf(normalized) !== -1;
                });
            }

            var sliced = pool.slice(0, 120);
            results.innerHTML = sliced.map(cardTemplate).join('');

            if (meta) {
                meta.textContent = normalized ? '搜索：' + query : '输入关键词开始搜索';
            }
        }

        if (input) {
            input.value = initialQuery;
        }

        if (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                search(input.value || '');
                var newUrl = input.value ? './search.html?q=' + encodeURIComponent(input.value) : './search.html';
                history.replaceState(null, '', newUrl);
            });
        }

        search(initialQuery);
    }
})();
