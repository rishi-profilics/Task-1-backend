const app = require('./src/app')
const db = require('./src/config/db')

db()

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log("Running on port 3000")
})