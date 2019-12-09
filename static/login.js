const login = () => {
  const username = document.getElementById('username')
  const password = document.getElementById('password')

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
