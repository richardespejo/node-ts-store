import { CategoryModel } from '../../data';
import { CustomErrors, PaginationDto, UserEntity } from '../../domain';
import { CreateCategoryDto } from './../../domain/dtos/category/create-category.dto';


export class CategoryService {


    constructor() {}

    createCategory = async( createCategoryDto: CreateCategoryDto , user: UserEntity) => {
        const categoryExists = await CategoryModel.findOne({ name: createCategoryDto.name });
        if( categoryExists ) return CustomErrors.badRequest('Category already exist');
        
        try {
            const category = new CategoryModel({
                ...createCategoryDto,
                user: user.id
            })

            await category.save();

            return {
                id: category.id,
                name: category.name,
                available: category.available
            }

        } catch (error) {
            throw CustomErrors.internalServer(`${error}`);
        }
    }

    getCatedories = async( paginationDto: PaginationDto) => {

        const { page , limit } = paginationDto;

        try {
            // const total = await CategoryModel.countDocuments();
            // const categories = await CategoryModel.find()
            //     .skip( (page - 1) * limit )
            //     .limit( limit )
            const [total,categories] = await Promise.all([
                CategoryModel.countDocuments(),
                CategoryModel.find()
                    .skip( (page - 1) * limit )
                    .limit( limit )
            ]);
            

            return {
                page: page,
                limit: limit,
                total: total,
                next: `/api/categories?page=${ page+1 }&limit=${ limit }`,
                prev: ( page - 1 > 0 ) ? `/api/categories?page=${ page-1 }&limit=${ limit }` : null,
                categories: categories.map( category => ({
                    id: category.id,
                    name: category.name,
                    available: category.available
                }))
            }
            
        } catch (error) {
            throw CustomErrors.internalServer('Internal Server Error')
        }

    }
}