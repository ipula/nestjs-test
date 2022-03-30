import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Jwtpayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {

    }

    async singUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.createUser(authCredentialsDto);
    }

    async singIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const { username, password } = authCredentialsDto;
        const user = await this.userRepository.findOne({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: Jwtpayload = { username };
            const accessToken = await this.jwtService.sign(payload);
            return { accessToken };
        } else {
            throw new HttpException({status:HttpStatus.UNAUTHORIZED,error:'Please check your login credentials'},HttpStatus.UNAUTHORIZED,);
        }
    }
}
