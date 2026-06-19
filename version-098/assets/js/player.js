function setupPlayer(sourceUrl) {
    var container = document.querySelector('[data-player]');

    if (!container) {
        return;
    }

    var video = container.querySelector('video');
    var layer = container.querySelector('.play-layer');
    var hlsInstance = null;
    var prepared = false;

    if (!video || !layer) {
        return;
    }

    function prepare() {
        if (prepared) {
            return;
        }

        prepared = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = sourceUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(sourceUrl);
            hlsInstance.attachMedia(video);
        } else {
            video.src = sourceUrl;
        }
    }

    function play() {
        prepare();
        layer.classList.add('is-hidden');
        video.setAttribute('controls', 'controls');
        var promise = video.play();

        if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {});
        }
    }

    layer.addEventListener('click', play);

    video.addEventListener('click', function () {
        if (video.paused) {
            play();
        }
    });

    window.addEventListener('pagehide', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
        }
    });
}
