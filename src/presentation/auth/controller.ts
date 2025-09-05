import { LoginUserDto } from './../../domain/dtos/auth/login-user.dto';
import { Request, Response } from "express";
import { CustomErrors, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";

export class AuthController {


    constructor(
        public readonly authService : AuthService,
    ){}
    //Manejo de error generico
    private handleError = (error: unknown , res: Response ) => {
        if(error instanceof CustomErrors){
            return res.status(error.statusCode).json({error: error.message });
        }

        console.log('----- handleError: ', error);
        return res.json(500).json({ error: 'Internal server error'})
    }
    //Registrar usuario
    registerUser = ( req: Request , res: Response) =>{
        const [error , registerDto] = RegisterUserDto.create(req.body);
        if(error) return res.status(400).json({error})

        this.authService.registerUser(registerDto!)
                .then( (user) => res.json(user))
                .catch( (error) => this.handleError(error,res));
    }
    //Login de usuario
    loginUser = ( req: Request , res: Response) =>{
        const [error , loginUserDto] = LoginUserDto.create(req.body);
        if(error) return res.status(400).json({error})

        this.authService.loginUser(loginUserDto!)
                .then( (user) => res.json(user))
                .catch( (error) => this.handleError(error,res));
    }
    //Validar email una vez registrado
    validateEmail = ( req: Request , res: Response) =>{
        const {token} = req.params;
+
        this.authService.validateEmail( token )
                .then( () => res.json('Email was validated correctly'))
                .catch( error => this.handleError(error,res) );

    }

}