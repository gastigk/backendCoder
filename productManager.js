// importación de módulos
import fs from "fs";

// creación de clase
class ProductManager {
  #products;
  #lastId;
  #path;

  constructor(path) {
    this.#path = path;
    this.#products = [];
    this.#lastId = 9;
    this.loadProducts();
  }

  // carga de productos
  loadProducts() {
    try {
      const data = fs.readFileSync(this.#path, "utf-8");
      this.#products = JSON.parse(data);
    } catch (error) {
      console.error(`Error al buscar el archivo desde ${this.#path}: ${error}`);
    }
  }

  // grabar datos
  saveProducts() {
    try {
      const data = JSON.stringify(this.#products, null, "\t");
      fs.writeFileSync(this.#path, data);
    } catch (error) {
      console.error(`Error al guardar el producto en ${this.#path}: ${error}`);
    }
  }

  // generación de ID
  #generateID = () => {
    this.#lastId++;
    return this.#lastId;
  };

  // validación del dato "code"
  #isCodeRepeated = (code) => {
    return this.#products.some((product) => product.code === code);
  };

  // agregar productos
  addProduct = (title, description, price, thumbnail, code, stock) => {
    if (this.#isCodeRepeated(code)) {
      console.error("Error: code already exists");
      return;
    }

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("Error: missing required fields");
      return;
    }

    const id = this.#generateID();
    const newProduct = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    this.#products.push(newProduct);

    this.saveProducts();
    return newProduct;
  };

  getProducts() {
    return [...this.#products];
  }

  // búsqueda de producto por ID
  getProductById(id) {
    const indexId = this.#products.find((p) => p.id === id);
    indexId
      ? console.log(indexId)
      : console.log(`Error: product id: ${id} not found`);
  }

  // actualización de datos
  updateProduct(id, data) {
    const index = this.#products.findIndex((item) => item.id === id);
    if (index !== -1) {
      const product = { ...this.#products[index], ...data, id };
      this.#products.splice(index, 1, product);
      this.saveProducts();
      return product;
    }
    return null;
  }

  // eliminar producto
  deleteProduct(id) {
    const index = this.#products.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.#products.splice(index, 1);
      this.saveProducts();
      return true;
    }
    return false;
  }
}

// PROCESO DE TESTING
const manager = new ProductManager("products.json");

// buscar producto por ID
manager.getProductById(2);

// agregar producto
manager.addProduct(
  "Nuevo producto de prueba agregado",
  "Este es un nuevo producto de prueba",
  "200",
  "sin imagen",
  "d123",
  25
);

// modificar dato en producto por ID
manager.updateProduct(3, { title: "Nombre de producto modificado" });
manager.updateProduct(6, { stock: 30 });
manager.updateProduct(9, { price: "400" });

// borrar producto por ID
manager.deleteProduct(1);

// listar productos
console.log(manager.getProducts());
