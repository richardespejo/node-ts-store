import { Request, Response } from "express";
import { CreateCategoryDto, CustomErrors, PaginationDto } from "../../domain";
import { CategoryService } from "../services/category.service";

export class CategoryController {


    constructor(
        private readonly categoryService: CategoryService
    ){}
    //Manejo de error generico
    private handleError = (error: unknown , res: Response ) => {
        if(error instanceof CustomErrors){
            return res.status(error.statusCode).json({error: error.message });
        }

        console.log('----- handleError: ', error);
        return res.json(500).json({ error: 'Internal server error'})
    }

    //Crear categoria
    public createCategory = async(req: Request , res: Response) => {
        const [ error, createCategoryDto ] = CreateCategoryDto.create( req.body );
        if( error ) return res.status(400).json({error}); 

        this.categoryService.createCategory( createCategoryDto! , req.body.user )
            .then( category =>  res.status(201).json( category))
            .catch( error => this.handleError(error, res));

    }

    //obtener categoria
    public getCategories = async(req: Request , res: Response) => {

        const { page = 1 , limit = 10 } = req.query;
        const [ error, paginationDto ] = PaginationDto.create( +page , +limit);
        if(error) return res.status(400).json({error});

        this.categoryService.getCatedories( paginationDto!)
            .then( categories => res.json( categories ))
            .catch( error => this.handleError(error, res));
    }
   

}