import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as crypto from 'crypto';
const uuid = require('uuid');

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

    @Get('/url')
    sigma(): any {
        // :nonce - Any random string you like but cannot be repeated within the hour.
        let searchParams = `?:nonce=${uuid.v4()}`;

        // :allow_export - true to allow export/download on visualizations
        searchParams += '&:allow_export=true';

        // :session_length - The number of seconds the user should be allowed to view the embed
        searchParams += '&:session_length=3600';

        // :time - Current Time as UNIX Timestamp
        searchParams += `&:time=${Math.floor(new Date().getTime() / 1000)}`;

        // :external_user_id - a unique JSON string identifying the viewer
        searchParams += `&:external_user_id=1`;

        // `Control Id` is the Control Id from your dashboard and `controlValue` is the value you wish to pass
        // searchParams += `&${encodeURIComponent('Control Id')}=${encodeURIComponent(controlValue)}`;

        // EMBED_PATH - Generated on your dashboard
        const URL_WITH_SEARCH_PARAMS = 'https://app.sigmacomputing.com/embed/1-19Xept24ZuPZhDC5DjW8mn' + searchParams;

        // EMBED_SECRET - Sigma Embed Secret generated in your admin portal
        const SIGNATURE = crypto
            .createHmac('sha256', Buffer.from('6KZSDH3F5RZXkKGmMsAC1P', 'utf8'))
            .update(Buffer.from(URL_WITH_SEARCH_PARAMS, 'utf8'))
            .digest('hex');

        const URL_TO_SEND = `${URL_WITH_SEARCH_PARAMS}&:signature=${SIGNATURE}`;
        return {url:URL_TO_SEND};
    }


}
