// Firebase App + Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Vansh's Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBHLqtAlx9khE_UPcXbvhFM3tWZPmb_d4c",
  authDomain: "vanshcreation-poems.firebaseapp.com",
  projectId: "vanshcreation-poems",
  storageBucket: "vanshcreation-poems.firebasestorage.app",
  messagingSenderId: "618701369489",
  appId: "1:618701369489:web:3b14e1ade5cf2a23c38f30",
  measurementId: "G-0G5GM8WHMB"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elements
const poemForm = document.getElementById("poemForm");
const poemsList = document.getElementById("poemsList");

// Submit Poem
poemForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const poem = document.getElementById("poem").value.trim();

  if (name && poem) {
    try {
      await addDoc(collection(db, "poems"), {
        name,
        poem,
        createdAt: serverTimestamp()
      });
      poemForm.reset();
      loadPoems();
    } catch (err) {
      console.error("Error adding poem: ", err);
    }
  }
});

// Load Poems
async function loadPoems() {
  poemsList.innerHTML = "";
  const q = query(collection(db, "poems"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    const data = doc.data();
    const poemDiv = document.createElement("div");
    poemDiv.classList.add("poem");
    poemDiv.innerHTML = `
      <p>${data.poem}</p>
      <p class="author">— ${data.name}</p>
    `;
    poemsList.appendChild(poemDiv);
  });
}

loadPoems();
