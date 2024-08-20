const http = require('http')
const fs = require('fs')
const { globSync } = require('glob')

const port = process.env.PORT
const logsPath = process.env.LOGS_LOCAL_PATH

const server = http.createServer((req, res) => {
  try {
    const dates = globSync(`${logsPath}/**/*.log`)
      .sort()
      .reduce((acc, path) => {
        const [channel, date] = path
          .replace('.log', '')
          .replace(`${logsPath}/`, '')
          .split('/')

        if (!acc[channel])
          acc[channel] = [date]
        else
          acc[channel].push(date)

        return acc
      }, {})

    const { searchParams } = new URL(req.url, 'x://x')
    const channel = searchParams.get('channel')

    if (!channel || !dates[channel]) {
      res.writeHead(404)
      res.end('404 Not found')
      return
    }

    const html = fs.readFileSync(__dirname + '/src/index.html').toString()
      .replace('#DATA#', JSON.stringify(dates[channel]))
      .replace('#LOGS_EXTERNAL_PATH#', `${process.env.LOGS_EXTERNAL_PATH}/${channel}`)

    res.writeHead(200, { 'Content-type': 'text/html' })
    res.end(html)
  } catch (e) {
    console.error(e)

    res.writeHead(500)
    res.end('500 Internal Server Error')
  }
})

server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})