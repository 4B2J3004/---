const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    primaryNav.classList.toggle("is-open", !isOpen);
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      primaryNav.classList.remove("is-open");
    });
  });
}

document.querySelectorAll("video[data-frame-poster]").forEach((video) => {
  video.addEventListener("loadedmetadata", () => {
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    const requestedTime = Number(video.dataset.posterTime || 1);
    const frameTime = Math.min(requestedTime, video.duration - 0.05);
    if (!Number.isFinite(frameTime) || frameTime <= 0) return;

    const captureFrame = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        if (!context) return;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        video.poster = canvas.toDataURL("image/jpeg", 0.82);
      } catch (error) {
        console.error("無法擷取影片封面畫面：", error);
      }

      video.currentTime = 0;
    };

    video.addEventListener("seeked", captureFrame, { once: true });
    video.currentTime = frameTime;
  }, { once: true });
});
