import { bcryptAdapter, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomErrors, RegisterUserDto, LoginUserDto } from "../../domain";
import { UserEntity } from "../../domain/entities/user.entity";


export class AuthService{


    constructor(){}

    public async registerUser( registerUserDto: RegisterUserDto ){

        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if(existUser) throw CustomErrors.badRequest('Email already exist');

        try {
            const user = new UserModel(registerUserDto);
            //ENcriptacion del password
            user.password = bcryptAdapter.hash( registerUserDto.password );
            //Guardo los datos
            await user.save();
            //const userEntity = UserEntity.fromObject(user);
            const {password , ...userEntity } = UserEntity.fromObject(user); //excluyo el password de la entidad


            return {
                user: userEntity,
                token: '12341235rwefkgjnsdkfg'
            };
            
        } catch (error) {
            throw CustomErrors.internalServer(`${error}`)
        }


    }

    public async loginUser( loginUserDto: LoginUserDto) {

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
}