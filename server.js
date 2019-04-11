const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('./public'));
app.use(bodyParser.json());

app.get('/products', (req, res) => {
  fs.readFile('./db/products.json', 'utf-8', (err, data) => {
    if (err) {
      return console.log(err);
    }

    res.send(data);
  });
});

app.get('/cart', (req, res) => {
  fs.readFile('./db/cart.json', 'utf-8', (err, data) => {
    if (err) {
      return console.log(err);
    }

    res.send(data);
  });
});

app.post('/cart', (req, res) => {
  fs.readFile('./db/cart.json', 'utf-8', (err, data) => {
    if (err) {
      return console.log(err);
    }

    const cart = JSON.parse(data);
    cart.push(req.body);

    fs.writeFile('./db/cart.json', JSON.stringify(cart), (err) => {
      if (err) {
        return console.log(err);
      }

      res.send(req.body);
    });
  });
  fs.readFile('./db/stats.json', 'utf-8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    const log = JSON.parse(data);
    let now = new Date();
    let newEvent = {
      "date": now,
      "action": 'Добавление товара в корзину ' + req.body.name,
    };

    log.push(newEvent);
    fs.writeFile('./db/stats.json', JSON.stringify(log), (err) => {
      if (err) {
        return console.log(err);
      }
      console.log("Асинхронная запись файла завершена.");
    });

  });
});

app.patch('/cart/:id', (req, res) => {

  fs.readFile('./db/cart.json', 'utf-8', (err, data) => {
    if (err) {
      return console.log(err);
    }

    let cart = JSON.parse(data);
    let content = '';
    cart = cart.map((item) => {
      if (item.id === +req.params.id) {
        content = item.name;
        return {
          ...item,
          ...req.body
        };
      }
      return item;
    });

    fs.writeFile('./db/cart.json', JSON.stringify(cart), (err) => {
      if (err) {
        return console.log(err);
      }

      res.send(cart.find((item) => item.id === +req.params.id));
    });

    fs.readFile('./db/stats.json', 'utf-8', (err, data) => {
      if (err) {
        return console.log(err);
      }
      const log = JSON.parse(data);
      let now = new Date();
      let newEvent = {
        "date": now,
        "action": 'Изменение количества ' + content,
      }

      log.push(newEvent);

      fs.writeFile('./db/stats.json', JSON.stringify(log), (err) => {
        if (err) {
          return console.log(err);
        }
        console.log("Асинхронная запись файла завершена.");
      });
    });
  });
});

app.delete('/cart/:id', (req, res) => {
  fs.readFile('./db/cart.json', 'utf-8', (err, data) => {
    if (err) {
      return console.log(err);
    }

    let cart = JSON.parse(data);

    let now = new Date();
    // let content = '';

    for (item of cart) {
      if (item.id === +req.params.id) {
        content = item.name;
        cart.splice(cart.indexOf(item), 1);
      }
    }

    fs.writeFile('./db/cart.json', JSON.stringify(cart), (err) => {
      if (err) {
        return console.log(err);
      }
      res.send(cart);
    });

    // fs.appendFile('./db/stats.json', `\n${content}`, (err) => {
    //   if (err) {
    //     return console.log(err);
    //   }
    //   console.log("Асинхронная запись файла завершена. Содержимое файла:");
    //   let data = fs.readFileSync('./db/stats.json', 'utf8');
    //   console.log(data);
    fs.readFile('./db/stats.json', 'utf-8', (err, data) => {
      if (err) {
        return console.log(err);
      }
      const log = JSON.parse(data);
      let now = new Date();
      let newEvent = {
        "date": now,
        "action": 'Удаление товара ' + content,
      }

      log.push(newEvent);

      fs.writeFile('./db/stats.json', JSON.stringify(log), (err) => {
        if (err) {
          return console.log(err);
        }
        console.log("Асинхронная запись файла завершена.");
      });
    });
  });
});



app.listen(3000, () => {
  console.log('Server has been started!');
});

// couchdb - server
// pouchdb - client

// rethinkdb - changefeeds