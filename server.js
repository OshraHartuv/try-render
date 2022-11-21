const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const toyService = require('./services/toy.service');

const app = express();

const port = process.env.PORT || 3000;;

app.use(cookieParser());
app.use(cors());
app.use(
  session({
    secret: 'puki-9480930307-pocd',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false},
  })
);

app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());

// Toy LIST
app.get('/api/toy', (req, res) => {
  console.log('Backend getting your Toys');
  const filterBy = {
    name: req.query.name || '',
    lable: req.query.lable || '',
    inStock: req.query.inStock || false,
    sortBy: req.query.sortBy || '',
    page: req.query.page || 0,
  };
  toyService.query(filterBy).then((toys) => {
    res.send(toys);
  });
});

// Toy READ
app.get('/api/toy/:toyId', (req, res) => {
  console.log('Backend getting your Toy:', req.params.toyId);
  toyService
    .getById(req.params.toyId)
    .then((toy) => {
      res.send(toy);
    })
    .catch((err) => {
      console.log('Backend had error: ', err);
      res.status(404).send('No such Toy');
    });
});

// Toy DELETE
app.delete('/api/toy/:toyId', (req, res) => {
  //   const {theUser} = req.session;
  //   if (!theUser) return res.status(401).send('Please login');
  console.log('Backend removing Toy:', req.params.toyId);
  toyService
    .remove(req.params.toyId)
    .then(() => {
      res.send({msg: 'Removed'});
    })
    .catch((err) => {
      console.log('Backend had error: ', err);
      res.status(401).send('Cannot remove Toy');
    });
});

// Toy CREATE
app.post('/api/toy', (req, res) => {
  //   const {theUser} = req.session;
  //   if (!theUser) return res.status(401).send('Please login');

  console.log('Backend Saving Toy:', req.query);
  const {name, price, labels, inStock, reviews} = req.body;
  const toy = {
    name,
    price,
    labels,
    inStock,
    reviews,
  };

  toyService
    .save(toy)
    .then((savedToy) => {
      res.status(201).send(savedToy);
    })
    .catch((err) => {
      console.log('Backend had error: ', err);
      res.status(401).send('Cannot create Toy');
    });
});

// Toy UPDATE
app.put('/api/toy/:toyId', (req, res) => {
  //   const {theUser} = req.session;
  //   if (!theUser) return res.status(401).send('Please login');

  console.log('Backend Saving Toy:', req.query);
  const {_id, name, price, labels, inStock, reviews} = req.body;
  const toy = {
    _id,
    name,
    price,
    labels,
    inStock,
    reviews,
  };

  toyService
    .save(toy)
    .then((savedToy) => {
      res.send(savedToy);
    })
    .catch((err) => {
      console.log('Backend had error: ', err);
      res.status(401).send('Cannot update Toy');
    });
});

app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`)
);
