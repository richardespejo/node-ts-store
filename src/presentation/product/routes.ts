import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middlewares';
import { ProductService } from '../services/product.service';
import { ProductController } from './controller';


export class ProductRoutes {


  static get routes(): Router {

    const router = Router();
    const productService = new ProductService;
    const controller = new ProductController(productService);
    
    // Definir las rutas
    router.get('/', controller.getProducts );
    router.post('/', [ AuthMiddleware.validateJwt ] ,controller.createProduct );



    return router;
  }


}

