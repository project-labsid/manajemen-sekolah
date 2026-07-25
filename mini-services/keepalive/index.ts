import http from 'http'

const TARGET = 'http://localhost:3000'

// Ping the Next.js dev server every 8 seconds to prevent idle exit
setInterval(() => {
  http.get(`${TARGET}/`, (res) => {
    res.resume()
  }).on('error', () => {
    // ignore
  })
}, 8000)

console.log('Keepalive pinger started - pinging localhost:3000 every 8s')
