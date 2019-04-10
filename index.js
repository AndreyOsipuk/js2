const fs = require('fs');

fs.readFile('./db/products.json', 'utf-8', (err, data) => {
  if(err) {
    console.log(err);
    return;
  }

  const products = JSON.parse(data);

  products.push({ id: 4, name: 'Зарядное устройство', price: 1500 });

  fs.writeFile('./db/products.json', JSON.stringify(products), (err) => {
    if(err) {
      console.log(err);
    }
  });
});