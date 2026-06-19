var MoviePlayer = (function () {
  function init(source) {
    var video = document.getElementById('movie-video');
    var start = document.getElementById('player-start');
    var hls = null;
    var attached = false;

    function attach() {
      if (!video || attached) {
        return;
      }
      attached = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function play() {
      attach();
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    if (!video || !start) {
      return;
    }

    start.addEventListener('click', play);
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
    video.addEventListener('play', function () {
      start.classList.add('is-hidden');
    });
    video.addEventListener('pause', function () {
      if (!video.ended) {
        start.classList.remove('is-hidden');
      }
    });
    video.addEventListener('ended', function () {
      start.classList.remove('is-hidden');
    });
    window.addEventListener('pagehide', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  }

  return {
    init: init
  };
})();
