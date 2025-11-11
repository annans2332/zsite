let currentUser = null;
let currentFriend = null;
let users = JSON.parse(localStorage.getItem('users')) || {};

function login(){
  const name = document.getElementById('username').value.trim();
  if(!name) return alert('Enter a name');
  currentUser = name;
  if(!users[currentUser]) users[currentUser] = { friends: [], messages: {} };
  localStorage.setItem('users', JSON.stringify(users));
  document.getElementById('login').style.display='none';
  document.getElementById('app').style.display='block';
  document.getElementById('userDisplay').innerText = currentUser;
  refreshFriends();
}

function addFriend(){
  const friend = document.getElementById('friendName').value.trim();
  if(!friend) return;
  if(!users[friend]) users[friend] = { friends: [], messages: {} };
  if(!users[currentUser].friends.includes(friend)) users[currentUser].friends.push(friend);
  if(!users[friend].friends.includes(currentUser)) users[friend].friends.push(currentUser);
  localStorage.setItem('users', JSON.stringify(users));
  refreshFriends();
}

function refreshFriends(){
  const select = document.getElementById('friendsList');
  select.innerHTML = '<option value="">Select Friend</option>';
  users[currentUser].friends.forEach(f=>{
    const opt = document.createElement('option');
    opt.value=f; opt.text=f;
    select.appendChild(opt);
  });
}

function selectFriend(){
  currentFriend = document.getElementById('friendsList').value;
  displayMessages();
}

function sendMessage(){
  const msg = document.getElementById('msgInput').value.trim();
  if(!msg || !currentFriend) return;
  if(!users[currentUser].messages[currentFriend]) users[currentUser].messages[currentFriend] = [];
  if(!users[currentFriend].messages[currentUser]) users[currentFriend].messages[currentUser] = [];

  users[currentUser].messages[currentFriend].push({from:'me', msg});
  users[currentFriend].messages[currentUser].push({from:'friend', msg});
  localStorage.setItem('users', JSON.stringify(users));
  document.getElementById('msgInput').value='';
  displayMessages();
}

function displayMessages(){
  const box = document.getElementById('chatBox');
  box.innerHTML='';
  if(!currentFriend) return;
  const msgs = users[currentUser].messages[currentFriend] || [];
  msgs.forEach(m=>{
    const div = document.createElement('div');
    div.className = 'chat-message ' + m.from;
    div.innerText = m.msg;
    box.appendChild(div);
  });
  box.scrollTop = box.scrollHeight;
}
