import fs from 'fs';
import path from 'path';
import { Request, Response } from "express";

export class ImagesController {


    constructor(
    ){}


    public getImage = async( req: Request , res: Response) => {

        const { type= '' , img= ''} = req.params;

        const imagePath = path.resolve( __dirname , `../../../uploads/${type}/${img}` )
        console.log(`imagePath`,imagePath);

        if( !fs.existsSync( imagePath ) ){
            return res.status(404).send('Image not found');
        }

        res.sendFile( imagePath ); 

    }

}