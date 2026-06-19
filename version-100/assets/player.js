import { H as Hls } from './hls-vendor.js';

function preparePlayer(card) {
    var video = card.querySelector('video');
    var layer = card.querySelector('[data-play-layer]');
    var source = card.getAttribute('data-source') || (video ? video.getAttribute('data-source') : '');
    var hlsInstance = null;
    var initialized = false;

    if (!video || !source) {
        return;
    }

    function loadSource() {
        if (initialized) {
            return;
        }
        initialized = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            return;
        }

        if (Hls && Hls.isSupported()) {
            hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
        } else {
            video.src = source;
        }
    }

    function playVideo() {
        loadSource();
        if (layer) {
            layer.classList.add('is-hidden');
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                video.setAttribute('controls', 'controls');
            });
        }
    }

    if (layer) {
        layer.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            playVideo();
        }
    });

    video.addEventListener('play', function () {
        if (layer) {
            layer.classList.add('is-hidden');
        }
    });

    window.addEventListener('pagehide', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
        }
    });
}

document.querySelectorAll('[data-player]').forEach(preparePlayer);
