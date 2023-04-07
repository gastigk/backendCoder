import express from 'express';
import ProductManager from './ProductManager.js';

const manager = new ProductManager('../products.json');
const port = 8080;
const app = express();

app.get('/products', async (req, res) => {
  const limit = +req.query.limit;
  const products = manager.getProducts();
  if (isNaN(limit)) {
    res.status(200).send(products);
  } else {
    res.status(200).send(products.slice(0, limit));
  }
});

app.get('/products/:pid', async (req, res) => {
  const id = +req.params.pid;
  const product = manager.getProductById(id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ error: 'Error: producto no encontrado' });
  }
});

app.listen(port, () => {
  console.log(`SERVER UP: http://localhost:${port}`);
});
