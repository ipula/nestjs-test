import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as crypto from 'crypto';
import { GetUser } from './get-user.decorator';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) {

    }

    @Post('/signup')
    signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.singUp(authCredentialsDto);
    }

    @Post('/signin')
    @ApiResponse({ status: 200, description: 'The record has been successfully created.'})
    signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.authService.singIn(authCredentialsDto);
    }


}
