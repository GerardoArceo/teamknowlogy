const express = require('express');
const bodyParser = require('body-parser');
const port = 3011;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('./routes/index'));

app.get('/', (req, res) => {
    res.json({
        app: 'Prueba para Teamknowlogy',
        author: 'Gerardo Arceo',
        message: 'Sé feliz :)'
    });
});

app.listen(port, console.log(`SERVER LISTENING PORT: ${ port }`));