import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";

//Middleware que se ejectua antes de los controladores por eso no se llama CustomError
export class AuthMiddleware {

    static async validateJwt( req: Request , res: Response , next: NextFunction ){

        const authorization = req.header('Authorization');
        if( !authorization ) return res.status(401).json({error: 'No token provider'});
        if( !authorization.startsWith('Bearer ')) return res.status(401).json({error: 'Invalid Bearer token'});

        const token = authorization.split(' ').at(1) || '';

        try {
            //Valido que el token sea valido 
            const payload = await JwtAdapter.validateToken<{id: string}>(token);
            if( !payload ) return res.status(401).json({error: 'Invalid token' });
            //Valido que el usuario exista 
            const user = await UserModel.findById( payload.id );
            if( !user ) return res.status(401).json({error: 'Invalid token - user'})
            //Hago mapping con el entity de usuario
            req.body.user = UserEntity.fromObject(user);

            next();
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error'});
            
        }

    }

}