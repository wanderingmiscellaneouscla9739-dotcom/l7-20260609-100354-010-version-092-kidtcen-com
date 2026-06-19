(function () {
  function attachStream(box) {
    var video = box.querySelector('video');
    var overlay = box.querySelector('.play-layer');
    var src = box.getAttribute('data-stream');

    if (!video || !src) {
      return;
    }

    if (!video.getAttribute('src')) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          maxBufferLength: 45,
          backBufferLength: 30
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        video.hlsPlayer = hls;
      } else {
        video.src = src;
      }
    }

    if (overlay) {
      overlay.classList.add('is-hidden');
    }

    video.controls = true;

    var playRequest = video.play();

    if (playRequest && typeof playRequest.catch === 'function') {
      playRequest.catch(function () {
        if (overlay) {
          overlay.classList.remove('is-hidden');
        }
      });
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('.player-box')).forEach(function (box) {
    var overlay = box.querySelector('.play-layer');
    var video = box.querySelector('video');

    if (overlay) {
      overlay.addEventListener('click', function (event) {
        event.preventDefault();
        attachStream(box);
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          attachStream(box);
        }
      });
    }
  });
})();
