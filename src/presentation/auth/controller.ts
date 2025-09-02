import { LoginUserDto } from './../../domain/dtos/auth/login-user.dto';
import { Request, Response } from "express";
import { CustomErrors, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.services";

export class AuthController {


    constructor(
        public readonly authService : AuthService,
    ){}

    private handleError = (error: unknown , res: Response ) => {
        if(error instanceof CustomErrors){
            return res.status(error.statusCode).json({error: error.message });
        }

        console.log('----- handleError: ', error);
        return res.json(500).json({ error: 'Internal server error'})
    }

    registerUser = ( req: Request , res: Response) =>{

        const [error , registerDto] = RegisterUserDto.create(req.body);
        if(error) return res.status(400).json({error})

        this.authService.registerUser(registerDto!)
                .then( (user) => res.json(user))
                .catch( (error) => this.handleError(error,res));
    }

    loginUser = ( req: Request , res: Response) =>{
        const [error , loginUserDto] = LoginUserDto.create(req.body);
        if(error) return res.status(400).json({error})

        this.authService.loginUser(loginUserDto!)
                .then( (user) => res.json(user))
                .catch( (error) => this.handleError(error,res));
    }
    
    validateEmail = ( req: Request , res: Response) =>{

        res.json('validate email');
    }

}