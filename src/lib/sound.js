let unlocked = false;
let audio;

export function unlockAudio() {
  if (unlocked) return;

  audio = new Audio("/sounds/notification.mp3");
  audio.volume = 0;

  audio
    .play()
    .then(() => {
      audio.pause();
      audio.currentTime = 0;
      unlocked = true;
    })
    .catch(() => {});
}

export function playNewOrderSound() {
  if (!unlocked || !audio) return;

  audio.currentTime = 0;
  audio.volume = 0.8;
  audio.play().catch(() => {});
}
