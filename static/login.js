const login = async () => {
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value

  const result = await postData(
    'login',
    {
      username,
      password,
    }
  )

  if (result.error) {
    document.getElementById('error').innerText = result.error
  } else {
    window.location.href = "/add.html"
  }
}

document.getElementById('login-btn').addEventListener('click', login)
