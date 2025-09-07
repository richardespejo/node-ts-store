import { envs } from "../../config";
import { CategoryModel } from "../mongo/models/categoty.model";
import { ProductModel } from "../mongo/models/product.mode";
import { UserModel } from "../mongo/models/user.model";
import { MongoDatabase } from "../mongo/mongo-database";
import { seedData } from "./data";


(async() => {
    MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL
    })

    await main();

    await MongoDatabase.disconnect();

})();

const random0toX = ( x:number ) => {
    return Math.floor( Math.random() * x );
}

async function main(){

    //Borrar todo primero
    await Promise.all([
        UserModel.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany()
    ]);

    //Crear Usuarios
    const users = await UserModel.insertMany( seedData.users);
    
    //Crear Categorias
    const categories = await CategoryModel.insertMany(
        seedData.categories.map( category => {
            return {
                ...category,
                user: users[0]._id
            }
        })
    );

    //Crear Productos
    const products = await ProductModel.insertMany(
        seedData.products.map( product => {
            return {
                ...product,
                user: users[ random0toX( seedData.users.length - 1 ) ]._id,
                category: categories[ random0toX( seedData.categories.length - 1 ) ]._id
            }
        })
    )


    console.log(`SEEDED`);

}