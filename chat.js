// --- Firebase setup ---
const firebaseConfig = {
  apiKey: "AIzaSyBz_vN26iOSyYSGpz1BVaz9d85n59zyQVI",
  authDomain: "echat-9080d.firebaseapp.com",
  projectId: "echat-9080d",
  storageBucket: "echat-9080d.firebasestorage.app",
  messagingSenderId: "284036536215",
  appId: "1:284036536215:web:e1ed69dc03ed470b81d6d2",
  measurementId: "G-K3C6F3T89E"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const authDiv = document.getElementById("auth");
const appDiv = document.getElementById("app");
const userDisplay = document.getElementById("userDisplay");
const msgInput = document.getElementById("msgInput");
const chatBox = document.getElementById("chatBox");

let currentUser = null;

// --- Auth ---
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert("Account created!"))
    .catch(err => alert(err.message));
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password)
    .catch(err => alert(err.message));
}

auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    userDisplay.textContent = user.email;
    authDiv.style.display = "none";
    appDiv.style.display = "block";
    listenMessages();
  } else {
    currentUser = null;
    authDiv.style.display = "block";
    appDiv.style.display = "none";
  }
});

// --- Messaging ---
function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;
  db.collection("messages").add({
    text,
    user: currentUser.email,
    time: firebase.firestore.FieldValue.serverTimestamp()
  });
  msgInput.value = "";
}

function listenMessages() {
  db.collection("messages").orderBy("time")
    .onSnapshot(snapshot => {
      chatBox.innerHTML = "";
      snapshot.forEach(doc => {
        const msg = doc.data();
        const div = document.createElement("div");
        div.className = "chat-message " + (msg.user === currentUser.email ? "me" : "friend");
        div.textContent = `${msg.user.split("@")[0]}: ${msg.text}`;
        chatBox.appendChild(div);
      });
      chatBox.scrollTop = chatBox.scrollHeight;
    });
}
