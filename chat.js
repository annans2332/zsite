<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
  import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
  import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

  // --- Your Firebase Config ---
  const firebaseConfig = {
    apiKey: "AIzaSyBz_vN26iOSyYSGpz1BVaz9d85n59zyQVI",
    authDomain: "echat-9080d.firebaseapp.com",
    projectId: "echat-9080d",
    storageBucket: "echat-9080d.firebasestorage.app",
    messagingSenderId: "284036536215",
    appId: "1:284036536215:web:e1ed69dc03ed470b81d6d2",
    measurementId: "G-K3C6F3T89E"
  };

  // --- Initialize ---
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // --- DOM Elements ---
  const loginForm = document.getElementById("loginForm");
  const chatBox = document.getElementById("chatBox");
  const messageInput = document.getElementById("messageInput");
  const messagesDiv = document.getElementById("messages");

  // --- Auth ---
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      await createUserWithEmailAndPassword(auth, email, password);
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginForm.style.display = "none";
      chatBox.style.display = "block";
      loadMessages();
    } else {
      chatBox.style.display = "none";
      loginForm.style.display = "block";
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => signOut(auth));

  // --- Chat Logic ---
  document.getElementById("sendBtn").addEventListener("click", async () => {
    const text = messageInput.value.trim();
    if (!text) return;
    await addDoc(collection(db, "messages"), {
      text,
      user: auth.currentUser.email,
      timestamp: Date.now()
    });
    messageInput.value = "";
  });

  function loadMessages() {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    onSnapshot(q, (snapshot) => {
      messagesDiv.innerHTML = "";
      snapshot.forEach((doc) => {
        const msg = doc.data();
        const div = document.createElement("div");
        div.textContent = `${msg.user}: ${msg.text}`;
        messagesDiv.appendChild(div);
      });
    });
  }
</script>
