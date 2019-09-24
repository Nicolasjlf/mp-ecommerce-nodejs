var express = require('express');
var exphbs  = require('express-handlebars');
var mercadopago = require('mercadopago');
var keys = require('./keys');

// Agregamos credenciales
mercadopago.configure({
  access_token: keys.MP_ACCESS_TOKEN
});

var host = process.env.HOST || 'http://localhost:3000';

var app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
  if(req.query.title === undefined) {
    res.status(500);
    res.json({'error': 'Falta el título de la unidad a comprar' });
  }

  if(req.query.price === undefined) {
      res.status(500);
      res.json({'error': 'Falta el precio de la unidad a comprar' });
  }

  if(req.query.unit === undefined) {
      res.status(500);
      res.json({'error': 'Falta la cantidad de unidades a comprar' });
  }

  if(req.query.img === undefined) {
      res.status(500);
      res.json({'error': 'Falta la imagen de la unidad' });
  }
  console.log(req.query.img);
  console.log(host);
  // Crea un objeto de preferencia
  let preference = {
      items: [
      {
        id: "1234",
        title: String(req.query.title),
        description: "Dispositivo móvil de Tienda e-commerce",
        picture_url: `${host}${req.query.img}`,
        unit_price: Number(req.query.price),
        quantity: Number(req.query.unit),
      }
      ],
      payer: {
        name: "Lalo",
        surname: "Landa",
        email: "test_user_63274575@testuser.com",
        date_created: "2019-09-24T11:50:41.425-04:00",
        phone: {
          area_code: "011",
          number: 22223333
        },
        identification: {
          type: "DNI",
          number: "22333444"
        },
        address: {
          street_name: "Falsa",
          street_number: 123,
          zip_code: "1111"
        }
      },
      back_urls: {
        "success": `${host}/success`,
        "failure": `${host}/failure`,
        "pending": `${host}/pending`
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_methods: [
          {
              id: "amex"
          }
        ],
        excluded_payment_types: [
          {
              "id": "atm"
          }
        ],
        installments: 6,
      },
      notification_url: `${host}/ipn`,
      external_reference: 'ABCD1234'
  };

  mercadopago.preferences.create(preference)
  .then(function(response){
      // Este valor reemplazará el string "$$init_point$$" en tu HTML
      // global.init_point = response.body.init_point;
      console.log('Respuesta de MP');
      console.log(response);
      req.query.preference = response.body.id;
      // res.send(response.response.init_point);
      res.render('detail', req.query);
  }).catch(function(error){
      console.log('Error de MP');
      console.log(error);
      res.send(error);
  });
});

app.get('/ipn', function(req, res) {
  console.log(req);
  console.log(res);
  res.send('Received IPN');
});

app.get('/success', function(req, res) {
  console.log(req);
  res.render('success');
});

app.get('/pending', function(req, res) {
  res.render('pending');
});

app.get('/failure', function(req, res) {
  res.render('failure');
});

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));
 
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${ port }`);
});