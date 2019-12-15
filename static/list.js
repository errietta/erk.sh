const list = async () => {
  const result = await getData(
    'list',
  )

  if (result.error) {
    document.getElementById('error').innerText = result.error
    document.getElementById('success').innerText = ''
  } else {
    document.getElementById('error').innerText = ''
    const items = result.items
    let html = "<ul>"

    items.forEach((item) => {
      html += `
      <li>
        <a href="${item.url}">url=${item.url}</a> slug=${result.slug} <a href="https://erk.im/${result.slug}">https://erk.im/${result.slug}</a>
      </li>`
    })
    html += "</ul>"

    document.getElementById('success').innerHTML = html
  }
}

window.addEventListener('load', list)
