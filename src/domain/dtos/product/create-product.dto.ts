import { Validators } from "../../../config";


export class CreateProductDto {
    
    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: string,
        public readonly description: string,
        public readonly user: string,
        public readonly category: string,
    ) {
        
    }

    static create( props: { [key:string]: any }): [string?, CreateProductDto?]{

        const { name , available = false , price = 0 , description, user , category } = props;

        if( !name ) return ['Missing name'];
        if( !description ) return ['Missing description'];
        if( !user ) return ['Missing user'];
        if( !Validators.isMongoId(user) ) return ['Invalid Mongo id User'];
        if( !category ) return ['Missing category'];
        if( !Validators.isMongoId(category) ) return ['Invalid Mongo id category'];


        return [undefined, new CreateProductDto(name, !!available , price , description , user , category )];

    }
}