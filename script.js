function generateFakeGmail() {
  const names = ["user", "alpha", "beta", "delta", "gamma", "xpro", "anon"];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomNumber = Math.floor(Math.random() * 10000);
  const fakeEmail = `${randomName}${randomNumber}@gmail.com`;
  document.getElementById("output").innerText = fakeEmail;
}
