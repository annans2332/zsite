// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;
let currentFriend = null;

function signup(){
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.createUserWithEmailAndPassword(email,password)
    .then(res=>{
      currentUser = res.user;
      db.collection('users').doc(currentUser.uid).set({email, friends: []});
      showApp();
    })
    .catch(err=>alert(err.message));
}

function login(){
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.signInWithEmailAndPassword(email,password)
    .then(res=>{
      currentUser = res.user;
      showApp();
    })
    .catch(err=>alert(err.message));
}

function showApp(){
  document.getElementById('auth').style.display='none';
  document.getElementById('app').style.display='block';
  document.getElementById('userDisplay').innerText = currentUser.email;
  loadFriends();
}

function sendFriendRequest(){
  const friendEmail = document.getElementById('friendEmail').value;
  db.collection('users').where('email','==',friendEmail).get()
    .then(snapshot=>{
      snapshot.forEach(doc=>{
        const friendId = doc.id;
        // Add to current user's friends list directly for simplicity
        db.collection('users').doc(currentUser.uid).update({friends: firebase.firestore.FieldValue.arrayUnion(friendId)});
        db.collection('users').doc(friendId).update({friends: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)});
      });
    });
}

function loadFriends(){
  db.collection('users').doc(currentUser.uid)
    .onSnapshot(doc=>{
      const friends = doc.data().friends;
      const select = document.getElementById('friendsList');
      select.innerHTML='<option value="">Select Friend</option>';
      friends.forEach(f=>{
        db.collection('users').doc(f).get().then(friendDoc=>{
          const opt = document.createElement('option');
          opt.value = f;
          opt.text = friendDoc.data().email;
          select.appendChild(opt);
        });
      });
    });
}

function selectFriend(){
  currentFriend = document.getElementById('friendsList').value;
  loadMessages();
}

function sendMessage(){
  const msg = document.getElementById('msgInput').value.trim();
  if(!msg || !currentFriend) return;
  const chatId = [currentUser.uid,currentFriend].sort().join('_');
  db.collection('messages').doc(chatId).collection('chat').add({
    from: currentUser.uid,
    msg,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  document.getElementById('msgInput').value='';
}

function loadMessages(){
  const chatId = [currentUser.uid,currentFriend].sort().join('_');
  db.collection('messages').doc(chatId).collection('chat')
    .orderBy('timestamp')
    .onSnapshot(snapshot=>{
      const chatBox = document.getElementById('chatBox');
      chatBox.innerHTML='';
      snapshot.forEach(doc=>{
        const m = doc.data();
        const div = document.createElement('div');
        div.className = 'chat-message ' + (m.from===currentUser.uid?'me':'friend');
        div.innerText = m.msg;
        chatBox.appendChild(div);
      });
      chatBox.scrollTop = chatBox.scrollHeight;
    });
}
