// importación de módulos
import fs from 'fs/promises';

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
  async loadProducts() {
    try {
      const data = await fs.readFile(this.#path, 'utf-8');
      this.#products = JSON.parse(data);
    } catch (error) {
      console.error(`Error de carga desde ${this.#path}: ${error}`);
    }
  }

  // grabar datos
  async saveProducts() {
    try {
      const data = JSON.stringify(this.#products, null, '\t');
      await fs.writeFile(this.#path, data);
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
  addProduct = ({ title, description, price, thumbnail, code, stock }) => {
    if (this.#isCodeRepeated(code)) {
      console.error('Error: código inexistente');
      return;
    }

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error('Error: faltan campos obligatorios');
      return;
    }

    const id = this.#generateID();
    const product = {
      id,
      ...this.#products,
    };
    this.#products.push(product);

    this.saveProducts();
    return product;
  };

  getProducts() {
    return [...this.#products];
  }

  // búsqueda de producto por ID
  getProductById(id) {
    return this.#products.find((item) => item.id === id);
  }

  // actualización de datos
  async updateProduct(id, data) {
    const index = this.#products.findIndex((item) => item.id === id);
    if (index !== -1) {
      const product = { ...this.#products[index], ...data, id };
      this.#products.splice(index, 1, product);
      await this.saveProducts();
      return product;
    }
    return null;
  }

  // eliminar producto
  async deleteProduct(id) {
    const index = this.#products.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.#products.splice(index, 1);
      await this.saveProducts();
      return true;
    }
    return false;
  }
}

// PROCESO DE TESTING
const manager = new ProductManager('../products.json');

//buscar producto por ID
manager.getProductById(2);

// agregar producto
// manager.addProduct({
//   title: "Nuevo producto de prueba agregado",
//   description: "Este es un nuevo producto de prueba",
//   price: "200",
//   thumbnail: "sin imagen",
//   code: "d123",
//   stock: 25
// });

// modificar dato en producto por ID
// manager.updateProduct(3, { title: "Nombre de producto modificado" });
// manager.updateProduct(6, { stock: 30 });
// manager.updateProduct(9, { price: "400" });

// borrar producto por ID
// manager.deleteProduct(1);

// listar productos
// console.log(manager.getProducts());

export default ProductManager;
