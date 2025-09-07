import { Request,Response, NextFunction } from "express";

export class TypeMiddleware {


    static validTypes( validTypes: string[] ){

        return  (req , res: Response , next: NextFunction) => {

            const type = req.url.split('/').at(2) ?? '';
            if( !validTypes.includes(type) ){
                return res.json(400)
                    .json({ error: `Invalid type: ${type}, valid once ${validTypes}`})
            }

            next();

        }
    }
}