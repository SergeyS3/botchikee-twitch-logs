const http = require('http')
const fs = require('fs')

const { PORT, LOGS_LOCAL_PATH, LOGS_EXTERNAL_PATH } = process.env
const htmlTemplate = fs.readFileSync(__dirname + '/src/index.html').toString()

const server = http.createServer((req, res) => {
  const writeResponse = (status, text, headers) => res.writeHead(status, headers).end(text)

  try {
    const { searchParams } = new URL(req.url, 'x://x')
    const channel = searchParams.get('channel')
    const folder = `${LOGS_LOCAL_PATH}/${channel}`

    if (!channel || !/^[a-zA-Z0-9_]+$/.test(channel) || !fs.existsSync(folder))
      return writeResponse(404, '404 Not found')

    const dates = fs.readdirSync(folder).map(f => f.slice(0, -4))
    const html = htmlTemplate
      .replace('#DATA#', JSON.stringify(dates))
      .replace('#LOGS_EXTERNAL_PATH#', `${LOGS_EXTERNAL_PATH}/${channel}`)

    writeResponse(200, html, { 'Content-type': 'text/html' })
  } catch (e) {
    console.error(e)

    writeResponse(500, '500 Internal Server Error')
  }
})

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
