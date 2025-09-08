// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// TODO: Apna config paste karo
const firebaseConfig = {
  apiKey: "YOUR-KEY",
  authDomain: "YOUR.firebaseapp.com",
  projectId: "YOUR-ID",
  storageBucket: "YOUR.appspot.com",
  messagingSenderId: "YOUR-SENDER",
  appId: "YOUR-APP-ID"
};

// Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// DOM elements
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");
const shareBtn = document.getElementById("shareBtn");
const contentType = document.getElementById("contentType");
const contentText = document.getElementById("contentText");
const creationsList = document.getElementById("creationsList");

let currentUser = null;

// Google Sign-in
loginBtn.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (e) {
    console.error("Login Error:", e);
  }
});

// Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

// Auth state change
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    userInfo.innerText = `Logged in as: ${user.displayName} (${user.email})`;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    currentUser = null;
    userInfo.innerText = "";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
});

// Add content
shareBtn.addEventListener("click", async () => {
  if (!currentUser) {
    alert("Please login first!");
    return;
  }
  if (contentText.value.trim() === "") {
    alert("Write something first!");
    return;
  }

  try {
    await addDoc(collection(db, "creations"), {
      type: contentType.value,
      text: contentText.value,
      author: currentUser.displayName,
      email: currentUser.email,
      timestamp: new Date()
    });

    contentText.value = "";
    loadCreations();
  } catch (e) {
    console.error("Error adding doc:", e);
  }
});

// Load all creations
async function loadCreations() {
  creationsList.innerHTML = "";
  const q = query(collection(db, "creations"), orderBy("timestamp", "desc"));
  const snap = await getDocs(q);
  snap.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${data.type} by ${data.author}</h3>
      <p>${data.text}</p>
      <small>${data.email}</small>
    `;
    creationsList.appendChild(div);
  });
}

loadCreations();
