import { isEmpty } from 'lodash';
import { IProduct } from './model';

async function getProduct(productId: string) {
  return {};
}

async function getProductList() {
  return [{ productId: 'adad13-31-321sda', name: 'Luis Henrique', age: 25 }];
}

async function createProduct(product: IProduct) {
  return {};
}

async function updateProduct(product: IProduct) {
  return {};
}

async function deleteProduct(productId: string) {
  return true;
}

export { getProduct, getProductList, createProduct, updateProduct, deleteProduct };
