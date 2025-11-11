import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBz_vN26iOSyYSGpz1BVaz9d85n59zyQVI",
  authDomain: "echat-9080d.firebaseapp.com",
  projectId: "echat-9080d",
  storageBucket: "echat-9080d.firebasestorage.app",
  messagingSenderId: "284036536215",
  appId: "1:284036536215:web:e1ed69dc03ed470b81d6d2"
};

// --- Init Firebase ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- DOM ---
const email = document.getElementById("email");
const password = document.getElementById("password");
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const chatApp = document.getElementById("chatApp");
const authDiv = document.getElementById("auth");
const userDisplay = document.getElementById("userDisplay");
const chatBox = document.getElementById("chatBox");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

// --- Auth Logic ---
signupBtn.onclick = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    alert("Account created. You can log in now.");
  } catch (err) {
    alert(err.message);
  }
};

loginBtn.onclick = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
  } catch (err) {
    alert(err.message);
  }
};

logoutBtn.onclick = async () => {
  await signOut(auth);
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    authDiv.style.display = "none";
    chatApp.style.display = "block";
    userDisplay.textContent = user.email;
    loadMessages();
  } else {
    chatApp.style.display = "none";
    authDiv.style.display = "block";
  }
});

// --- Chat Logic ---
sendBtn.onclick = async () => {
  const text = msgInput.value.trim();
  if (!text) return;
  await addDoc(collection(db, "messages"), {
    text,
    user: auth.currentUser.email,
    time: new Date()
  });
  msgInput.value = "";
};

function loadMessages() {
  const q = query(collection(db, "messages"), orderBy("time"));
  onSnapshot(q, (snapshot) => {
    chatBox.innerHTML = "";
    snapshot.forEach((doc) => {
      const msg = doc.data();
      const div = document.createElement("div");
      div.className = "message" + (msg.user === auth.currentUser.email ? " me" : "");
      div.textContent = `${msg.user}: ${msg.text}`;
      chatBox.appendChild(div);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}
