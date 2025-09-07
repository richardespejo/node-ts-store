import { ProductModel } from '../../data';
import { CustomErrors, PaginationDto, CreateProductDto } from '../../domain';


export class ProductService {


    constructor() {}

    createProduct = async( createProductDto: CreateProductDto) => {
        const productExists = await ProductModel.findOne({ name: createProductDto.name });
        if( productExists ) return CustomErrors.badRequest('Product already exist');

        try {
            const product = new ProductModel( createProductDto );

            await product.save();

            return product;

        } catch (error) {
            throw CustomErrors.internalServer(`${error}`);
        }
    }

    getProducts = async( paginationDto: PaginationDto) => {

        const { page , limit } = paginationDto;

        try {

            const [total,products] = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find()
                    .skip( (page - 1) * limit )
                    .limit( limit )
                    .populate('user')
                    .populate('category')
                    
            ]);
            

            return {
                page: page,
                limit: limit,
                total: total,
                next: `/api/products?page=${ page+1 }&limit=${ limit }`,
                prev: ( page - 1 > 0 ) ? `/api/products?page=${ page-1 }&limit=${ limit }` : null,
                products: products
            }
            
        } catch (error) {
            throw CustomErrors.internalServer('Internal Server Error')
        }

    }
}