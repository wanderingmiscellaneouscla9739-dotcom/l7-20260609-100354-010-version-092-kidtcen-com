(function () {
  const menuButton = document.querySelector(".menu-toggle");
  const mobilePanel = document.querySelector(".mobile-panel");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      mobilePanel.classList.toggle("open");
    });
  }

  const hero = document.querySelector("[data-hero]");
  if (hero) {
    const slides = Array.from(hero.querySelectorAll(".hero-slide"));
    const dots = Array.from(hero.querySelectorAll(".hero-dot"));
    const thumbs = Array.from(hero.querySelectorAll(".hero-thumb"));
    let current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === current);
      });
      thumbs.forEach(function (thumb, i) {
        thumb.classList.toggle("active", i === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show(current + 1);
      }, 5600);
    }
  }

  const filterInput = document.querySelector(".page-filter");
  const searchableList = document.querySelector(".searchable-list");

  if (filterInput && searchableList) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    const items = Array.from(searchableList.querySelectorAll(".movie-card, .rank-row"));

    function applyFilter() {
      const keyword = filterInput.value.trim().toLowerCase();
      items.forEach(function (item) {
        const text = (item.getAttribute("data-text") || item.textContent || "").toLowerCase();
        item.classList.toggle("hidden-by-filter", keyword && !text.includes(keyword));
      });
    }

    if (query) {
      filterInput.value = query;
    }

    filterInput.addEventListener("input", applyFilter);
    applyFilter();
  }

  const players = Array.from(document.querySelectorAll("[data-player]"));

  players.forEach(function (player) {
    const video = player.querySelector("video");
    const button = player.querySelector(".play-overlay");
    const stream = player.getAttribute("data-stream");
    let attached = false;
    let hls = null;

    function attachStream() {
      if (attached || !stream || !video) {
        return Promise.resolve();
      }

      attached = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
        return Promise.resolve();
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(stream);
        hls.attachMedia(video);
        return new Promise(function (resolve) {
          hls.on(window.Hls.Events.MANIFEST_PARSED, resolve);
          window.setTimeout(resolve, 1200);
        });
      }

      video.src = stream;
      return Promise.resolve();
    }

    function startPlay() {
      attachStream().then(function () {
        player.classList.add("is-playing");
        const result = video.play();
        if (result && typeof result.catch === "function") {
          result.catch(function () {});
        }
      });
    }

    if (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        startPlay();
      });
    }

    if (video) {
      video.addEventListener("click", function () {
        if (!attached) {
          startPlay();
        }
      });
      video.addEventListener("play", function () {
        player.classList.add("is-playing");
      });
      video.addEventListener("ended", function () {
        player.classList.remove("is-playing");
      });
    }
  });
})();
