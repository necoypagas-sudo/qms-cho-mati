export function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-PH";
  u.rate = 0.88;
  u.pitch = 1.05;
  u.volume = 1;
  window.speechSynthesis.speak(u);
}
