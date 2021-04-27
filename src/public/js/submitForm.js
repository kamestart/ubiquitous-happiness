const script = document.createElement("script");
script.type = "text/javascript";
script.src = "/js/loadRecaptchaToRecaptchaDiv.js";

document.head.appendChild(script);

/* document.getElementById('registerForm').addEventListener('submit', e => {
    e.preventDefault();

    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const captcha = document.querySelector('#g-recaptcha-response').value;

    fetch('/userSystems/register', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ username, password, captcha })
    })
}) */ 