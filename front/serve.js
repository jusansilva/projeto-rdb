const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res, next) => {
    res.send("<h1>inicio</h1>");
})

app.get('/login', (req, res, next) => {
    res.sendFile('/login.html');
})


app.listen(8080, () => console.log("Servidor porta 8080 rodando"));

