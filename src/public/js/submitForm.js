const script = document.createElement("script");
const currentHostName = window.location.host
const currentProtocol = location.protocol

script.type = "text/javascript";
script.src = "/js/loadRecaptchaToRecaptchaDiv.js";

document.head.appendChild(script);

document.getElementById('registerForm').addEventListener('submit', e => {
  e.preventDefault();

  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;
  const captcha = document.querySelector('#g-recaptcha-response').value;

  console.log(username)
  fetch('/userSystems/register', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ username, password, captcha })
  })  
  .then(response => response.json())
  .then(data => {
    console.log(data)
    alert(data.msg)
    console.log(currentProtocol + "//" + currentHostName  + data.RedirectUrl)
    window.location = currentProtocol + "//" + currentHostName + data.RedirectUrl
  });
}) 