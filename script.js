// ---------- Element references ----------
const envelope = document.getElementById("envelope");
const envelopeFlap = document.getElementById("envelopeFlap");
const letterPreview = document.getElementById("letterPreview");
const introScreen = document.getElementById("introScreen");
const letterScreen = document.getElementById("letterScreen");
const letterPaper = document.getElementById("letterPaper");
const questionCard = document.getElementById("questionCard");
const celebrationScreen = document.getElementById("celebrationScreen");
const closeLetter = document.getElementById("closeLetter");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const pleaText = document.getElementById("pleaText");
const restartBtn = document.getElementById("restartBtn");
const confettiContainer = document.getElementById("confettiContainer");
const floatingHearts = document.getElementById("floatingHearts");

// ---------- Floating background hearts ----------
const HEART_EMOJIS = ["💗", "💖", "💘", "💕", "💝", "❤️", "🌸"];

function spawnFloatingHeart() {
  const heart = document.createElement("span");
  heart.className = "float-heart";
  heart.textContent =
    HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${0.9 + Math.random() * 1.4}rem`;
  heart.style.animationDuration = `${5 + Math.random() * 6}s`;
  floatingHearts.appendChild(heart);
  
  heart.addEventListener("animationend", () => heart.remove());
}

setInterval(spawnFloatingHeart, 700);
for (let i = 0; i < 6; i++) {
  setTimeout(spawnFloatingHeart, i * 250);
}

// ---------- Envelope opening ----------
let letterOpened = false;

function openEnvelope() {
  if (letterOpened) return;
  letterOpened = true;
  
  envelope.classList.add("open");
  
  // After the flap animation, swap to the letter screen.
  setTimeout(() => {
    introScreen.classList.add("hidden");
    letterScreen.classList.remove("hidden");
    letterPaper.classList.remove("hidden");
    
    // Reveal the question after the letter has had a moment to be read.
    setTimeout(() => {
      questionCard.classList.remove("hidden");
    }, 2400);
  }, 700);
}

envelope.addEventListener("click", openEnvelope);
envelope.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openEnvelope();
  }
});

// ---------- Close letter (return to intro) ----------
function closeLetterAndReset() {
  letterOpened = false;
  questionCard.classList.add("hidden");
  letterScreen.classList.add("hidden");
  introScreen.classList.remove("hidden");
  envelope.classList.remove("open");
  resetNoButton();
  pleaText.textContent = "";
}

closeLetter.addEventListener("click", closeLetterAndReset);

// ---------- The "No" button that keeps running away ----------
const noMessages = [
  "Are you sure? 🥺",
  "Think again, please… 🥺",
  "Don't break my heart 💔",
  "Really really sure? 😢",
  "My heart can't take this 💔",
  "Give love a chance 🥺",
  "You're just being shy, right? 😉",
  "I'll cry a little… 💧",
  "Last chance, my love 💘",
  "Okay but the button moved for a reason 😌",
];

let noClicks = 0;
let yesScale = 1;

function resetNoButton() {
  noClicks = 0;
  yesScale = 1;
  yesBtn.style.transform = "";
  noBtn.style.transform = "";
  noBtn.textContent = "No 💔";
}

noBtn.addEventListener("click", () => {
  noClicks += 1;
  
  // Show a plea message.
  pleaText.textContent =
    noMessages[Math.min(noClicks - 1, noMessages.length - 1)];
  
  // Make the Yes button bigger with every refusal.
  yesScale += 0.25;
  yesBtn.style.transform = `scale(${yesScale})`;
  
  // Move the No button to a random position within the question card.
  const cardRect = questionCard.getBoundingClientRect();
  const maxX = Math.max(cardRect.width - noBtn.offsetWidth - 20, 20);
  const maxY = Math.max(cardRect.height - noBtn.offsetHeight - 20, 20);
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  
  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  
  // After a few attempts, start shrinking the No button.
  if (noClicks >= 3) {
    const scale = Math.max(1 - noClicks * 0.08, 0.45);
    noBtn.style.transform = `scale(${scale})`;
  }
  
  if (noClicks >= 8) {
    noBtn.textContent = "Just say Yes 😌";
  }
});

// Make sure the question card can contain the absolutely positioned button.
questionCard.style.position = "relative";

// ---------- Yes -> Celebration ----------
yesBtn.addEventListener("click", () => {
  letterScreen.classList.add("hidden");
  celebrationScreen.classList.remove("hidden");
  launchConfetti();
});

function launchConfetti() {
  const colors = [
    "#ff4d6d",
    "#ff8fa3",
    "#ffd166",
    "#e8b04b",
    "#ffb3c1",
    "#c9184a",
    "#ffccd5",
  ];
  
  for (let i = 0; i < 120; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${2.5 + Math.random() * 3}s`;
    piece.style.animationDelay = `${Math.random() * 1.5}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiContainer.appendChild(piece);
    
    piece.addEventListener("animationend", () => piece.remove());
  }
}

// ---------- Restart ----------
restartBtn.addEventListener("click", () => {
  confettiContainer.innerHTML = "";
  celebrationScreen.classList.add("hidden");
  introScreen.classList.remove("hidden");
  letterOpened = false;
  envelope.classList.remove("open");
  resetNoButton();
  pleaText.textContent = "";
});