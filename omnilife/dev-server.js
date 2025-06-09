const next = require('next')
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000

// 确保工作目录正确
process.chdir(__dirname)

console.log('Working directory:', process.cwd())
console.log('App directory exists:', require('fs').existsSync('./app'))
console.log('App directory contents:', require('fs').readdirSync('./app'))

const app = next({ 
  dev, 
  hostname, 
  port,
  dir: process.cwd()
})

const handle = app.getRequestHandler()

app.prepare().then(() => {
  const { createServer } = require('http')
  
  const server = createServer(async (req, res) => {
    try {
      await handle(req, res)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
}).catch((ex) => {
  console.error('Error starting Next.js:', ex)
  process.exit(1)
})
