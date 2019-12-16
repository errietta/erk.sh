const add = async () => {
  const url = document.getElementById('url').value
  const slug = document.getElementById('slug').value

  const result = await postData(
    'add',
    {
      url,
      slug,
    }
  )

  if (result.error) {
    document.getElementById('error').innerText = result.error
    document.getElementById('success').innerText = ''
  } else {
    document.getElementById('error').innerText = ''
    document.getElementById('success').innerHTML = `
    <div>
    success, slug=${result.slug} <a href="https://SITE_URL/${result.slug}">https://SITE_URL/${result.slug}</a>
    </div>`
  }
}

document.getElementById('add-btn').addEventListener('click', add)
