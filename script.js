// 1. Notification
function showNotification() {
    const toast = document.getElementById("notification-toast");
    if (!toast) {
        alert("Welcome to my Portfolio!");
        return;
    }

    toast.textContent = "Welcome...muahahah!!!!";
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 1800);
}

// 2. Conditional Greeting
function checkTime() {
    let hour = new Date().getHours();
    let message = "";

    if (hour < 12) {
        message = "Good morning!";
    } else if (hour < 18) {
        message = "Good afternoon!";
    } else {
        message = "Good evening!";
    }

    const greeting = document.getElementById("greeting");
    if (greeting) {
        greeting.textContent = message;
    }
}

// 3. Colour Theme Switcher
function setTheme(themeName) {
    document.body.className = themeName;
}

function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00";
    }

    const totalSeconds = Math.floor(seconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
}

function updateProgressButton(audio, progressBtn) {
    if (!audio || !progressBtn) {
        return;
    }

    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const currentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;

    if (!duration || duration <= 0) {
        progressBtn.textContent = "Progress: 0% (0:00 / 0:00)";
        return;
    }

    const percent = Math.min(100, Math.round((currentTime / duration) * 100));
    progressBtn.textContent = `Progress: ${percent}% (${formatTime(currentTime)} / ${formatTime(duration)})`;
}

function createAudioButtons(audio) {
    const controlsWrap = document.createElement("div");
    controlsWrap.className = "audio-enhanced-controls";

    const status = document.createElement("p");
    status.className = "audio-status";
    status.textContent = "Trying autoplay...";

    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.className = "audio-control-btn";
    playBtn.textContent = "Play Background Audio";
    playBtn.hidden = true;

    const unmuteBtn = document.createElement("button");
    unmuteBtn.type = "button";
    unmuteBtn.className = "audio-control-btn";
    unmuteBtn.textContent = "Unmute Audio";
    unmuteBtn.hidden = true;

    const progressBtn = document.createElement("button");
    progressBtn.type = "button";
    progressBtn.className = "audio-control-btn";
    progressBtn.textContent = "Progress: 0% (0:00 / 0:00)";

    controlsWrap.append(status, playBtn, unmuteBtn, progressBtn);
    audio.insertAdjacentElement("afterend", controlsWrap);

    progressBtn.addEventListener("click", () => {
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
            return;
        }

        const jumpAmount = audio.duration * 0.1;
        audio.currentTime = Math.min(audio.duration, audio.currentTime + jumpAmount);
        updateProgressButton(audio, progressBtn);
    });

    audio.addEventListener("timeupdate", () => updateProgressButton(audio, progressBtn));
    audio.addEventListener("loadedmetadata", () => updateProgressButton(audio, progressBtn));

    return { status, playBtn, unmuteBtn, progressBtn };
}

async function initializeBackgroundAudio() {
    const audio = document.getElementById("bg-music");
    if (!audio || typeof audio.play !== "function") {
        return;
    }

    if (!audio.canPlayType || !audio.canPlayType("audio/mpeg")) {
        return;
    }

    const { status, playBtn, unmuteBtn, progressBtn } = createAudioButtons(audio);
    let interactionAttached = false;

    const showBlockedState = () => {
        status.textContent = "Autoplay is blocked. Use the button to start audio.";
        playBtn.hidden = false;
    };

    const hideBlockedState = () => {
        playBtn.hidden = true;
    };

    const updateMuteUi = () => {
        unmuteBtn.hidden = !audio.muted;
    };

    const tryPlay = async () => {
        try {
            await audio.play();
            status.textContent = audio.muted
                ? "Audio playing (muted). Click Unmute Audio to hear it."
                : "Audio is playing.";
            hideBlockedState();
            updateMuteUi();
            updateProgressButton(audio, progressBtn);
        } catch {
            showBlockedState();
            updateMuteUi();
        }
    };

    const onUserInteraction = async () => {
        await tryPlay();

        if (!interactionAttached) {
            return;
        }

        document.removeEventListener("click", onUserInteraction, true);
        document.removeEventListener("keydown", onUserInteraction, true);
        document.removeEventListener("touchstart", onUserInteraction, true);
        interactionAttached = false;
    };

    playBtn.addEventListener("click", async () => {
        audio.muted = false;
        await tryPlay();
    });

    unmuteBtn.addEventListener("click", async () => {
        audio.muted = false;
        updateMuteUi();
        await tryPlay();
    });

    audio.addEventListener("volumechange", updateMuteUi);

    audio.muted = true;
    await tryPlay();

    if (playBtn.hidden === false) {
        document.addEventListener("click", onUserInteraction, true);
        document.addEventListener("keydown", onUserInteraction, true);
        document.addEventListener("touchstart", onUserInteraction, true);
        interactionAttached = true;
    }
}

// 5. Case-insensitive alias for old call site
window.checktime = checkTime;

// 6. Auto-greeting and media handling (run on load)
document.addEventListener("DOMContentLoaded", () => {
    checkTime();
    initializeBackgroundAudio();
});

// 4. Event Handler (Portfolio Page)
const nameInput = document.getElementById("nameInput");
if (nameInput) {
    nameInput.addEventListener("input", function () {
        const response = document.getElementById("responseText");
        if (response) {
            response.textContent = "Hello " + this.value + "! Welcome to my site.";
        }
    });
}
const backToTopBtn = document.getElementById("backToTopBtn");

function updateBackToTopVisibility() {
        if (!backToTopBtn) {
                return;
        }

        const shouldShow = document.body.scrollTop > 20 || document.documentElement.scrollTop > 20;
        backToTopBtn.style.display = shouldShow ? "block" : "none";
}

function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
}

if (backToTopBtn) {
        backToTopBtn.style.display = "none";
        window.addEventListener("scroll", updateBackToTopVisibility);
        window.scrollToTop = scrollToTop;
}
