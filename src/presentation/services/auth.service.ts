import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomErrors, RegisterUserDto, LoginUserDto } from "../../domain";
import { UserEntity } from "../../domain/entities/user.entity";
import { EmailService } from "./email.service";


export class AuthService{

    constructor(
        private readonly emailService: EmailService,
    ){}

    public registerUser = async( registerUserDto: RegisterUserDto ) => {

        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if(existUser) throw CustomErrors.badRequest('Email already exist');

        try {
            const user = new UserModel(registerUserDto);
            //Encriptacion del password
            user.password = bcryptAdapter.hash( registerUserDto.password );
            //Guardo los datos
            await user.save();
            //Email de confirmación
            await this.sendEmailValidationLink(user.email);
            //const userEntity = UserEntity.fromObject(user);
            const {password , ...userEntity } = UserEntity.fromObject(user); //excluyo el password de la entidad

            const token = await JwtAdapter.generateToken({ id: user.id , email: user.email });
            if(!token) throw CustomErrors.internalServer('Error while creating JWT');


            return {
                user: userEntity,
                token: token
            };
            
        } catch (error) {
            throw CustomErrors.internalServer(`${error}`)
        }

    }

    public loginUser = async( loginUserDto: LoginUserDto) => {

        const user = await UserModel.findOne({email: loginUserDto.email});
        if(!user) throw CustomErrors.badRequest('User and password is wrong');

        const isMatching = bcryptAdapter.compare( loginUserDto.password , user.password );
        if(!isMatching) throw CustomErrors.badRequest('User and password is wrong');

        const { password , ...userEntity } = UserEntity.fromObject( user );

        const token = await JwtAdapter.generateToken({ id: user.id , email: user.email });
        if(!token) throw CustomErrors.internalServer('Error while creating JWT');

        return {
            user: userEntity,
            token : token
        }

    }

    private sendEmailValidationLink = async( email:string) => {

        const token = await JwtAdapter.generateToken({email});
        if( !token ) throw CustomErrors.internalServer('Error getting token');

        const link = `${ envs.WEBSERVICE_URL }/auth/validate-email/${token}`;
        const html = `
            <h1>Validate your email</h1>
            <p>Click on the fallowing link to validate your email</p>
            <a href="${link}">Click Here: "${email}"</a>
        `;

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html
        }

        const isSent = await this.emailService.sendEmail(options);
        if( !isSent ) throw CustomErrors.internalServer('Error sending email');

        return true;

    }

    public validateEmail = async( token : string) => {

        const payload = await JwtAdapter.validateToken(token);
        if( !payload ) throw CustomErrors.unauthorized('Invalid token');

        const { email } = payload as { email:string };
        if( !email ) throw CustomErrors.internalServer('Email not in token');

        const user = await UserModel.findOne({email});
        if( !user ) throw CustomErrors.internalServer('Email not exist');

        user.emailValidated = true;
        await user.save();

        return true;
    }
}