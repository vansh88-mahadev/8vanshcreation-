// Firebase Config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBHLqtAlx9khE_UPcXbvhFM3tWZPmb_d4c",
  authDomain: "vanshcreation-poems.firebaseapp.com",
  projectId: "vanshcreation-poems",
  storageBucket: "vanshcreation-poems.appspot.com",
  messagingSenderId: "618701369489",
  appId: "1:618701369489:web:3b14e1ade5cf2a23c38f30",
  measurementId: "G-0G5GM8WHMB"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elements
const form = document.getElementById("poemForm");
const poemsList = document.getElementById("poemsList");
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");
const moodBtn = document.getElementById("moodBtn");
const moodPopup = document.getElementById("moodPopup");
const moodList = document.getElementById("moodList");

// Add Poem/Thought/Quote
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const type = document.getElementById("type").value;
  const content = document.getElementById("content").value.trim();
  const author = document.getElementById("author").value.trim() || "Anonymous";

  if (!content) return alert("Please write something!");

  await addDoc(collection(db, "creations"), {
    type, content, author, timestamp: Date.now()
  });

  form.reset();
  alert("✨ Your submission has been added!");
});

// Realtime Load
const q = query(collection(db, "creations"), orderBy("timestamp", "desc"));
onSnapshot(q, (snapshot) => {
  poemsList.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (
      (filterType.value === "All" || data.type === filterType.value) &&
      (data.content.toLowerCase().includes(searchInput.value.toLowerCase()) ||
       data.author.toLowerCase().includes(searchInput.value.toLowerCase()))
    ) {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <div class="type">[${data.type}]</div>
        <div class="content">${data.content}</div>
        <div class="author">— ${data.author}</div>
      `;
      poemsList.appendChild(card);
    }
  });
});

// Search & Filter
searchInput.addEventListener("input", () => onSnapshot(q, () => {}));
filterType.addEventListener("change", () => onSnapshot(q, () => {}));

// Mood System
moodBtn.addEventListener("click", () => {
  moodPopup.classList.toggle("hidden");
});

document.querySelectorAll(".emoji-options span").forEach((emoji) => {
  emoji.addEventListener("click", async () => {
    await addDoc(collection(db, "moods"), {
      mood: emoji.textContent,
      timestamp: Date.now()
    });
    moodPopup.classList.add("hidden");
  });
});

// Load Moods
const moodQuery = query(collection(db, "moods"), orderBy("timestamp", "desc"));
onSnapshot(moodQuery, (snapshot) => {
  const counts = {};
  snapshot.forEach((doc) => {
    const { mood } = doc.data();
    counts[mood] = (counts[mood] || 0) + 1;
  });

  moodList.innerHTML = "";
  for (const mood in counts) {
    moodList.innerHTML += `<span>${mood} × ${counts[mood]}</span>`;
  }
});
