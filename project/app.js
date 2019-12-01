const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => res.sendFile(__dirname + "/public/templates/index.html"))
app.get('/map', (req, res) => res.sendFile(__dirname + "/public/templates/map.html"))
app.get('/graph', (req, res) => res.sendFile(__dirname + "/public/templates/graph.html"))

app.listen(port, () => console.log(`App listening on port ${port}!`))