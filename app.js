var express = require('express');
var exphbs  = require('express-handlebars');
var mercadopago = require('mercadopago');
var keys = require('./keys');

// Agregamos credenciales
mercadopago.configure({
  access_token: keys.MP_ACCESS_TOKEN
});

var app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.post('/pagar', function (req, res) {
    // console.log(req.body);
    if(req.body.title === undefined) {
        res.status(500);
        res.json({'error': 'Falta el título de la unidad a comprar' });
    }

    if(req.body.price === undefined) {
        res.status(500);
        res.json({'error': 'Falta el precio de la unidad a comprar' });
    }

    if(req.body.unit === undefined) {
        res.status(500);
        res.json({'error': 'Falta la cantidad de unidades a comprar' });
    }
    // Crea un objeto de preferencia
    let preference = {
        items: [
        {
            title: String(req.body.title),
            unit_price: Number(req.body.price),
            quantity: Number(req.body.unit),
        }
        ]
    };
    
    mercadopago.preferences.create(preference)
    .then(function(response){
        // Este valor reemplazará el string "$$init_point$$" en tu HTML
        // global.init_point = response.body.init_point;
        console.log('Respuesta de MP');
        console.log(response);
        res.redirect(response.response.init_point);
    }).catch(function(error){
        console.log('Error de MP');
        console.log(error);
        res.send(error);
    });
});

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));
 
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${ port }`);
});