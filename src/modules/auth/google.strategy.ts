import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID:
        configService.get<string>('GOOGLE_CLIENT_ID') || 'PLACEHOLDER_ID',
      clientSecret:
        configService.get<string>('GOOGLE_CLIENT_SECRET') ||
        'PLACEHOLDER_SECRET',
      callbackURL:
        configService.get<string>('GOOGLE_CALLBACK_URL') ||
        'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos, id } = profile;

    // Safety checks to prevent 500 Internal Server Error when Google profile is partially empty
    const email = emails?.[0]?.value;
    const firstName = name?.givenName || 'Google';
    const lastName = name?.familyName || 'User';
    const picture = photos?.[0]?.value || '';

    if (!email) {
      // Return error to prevent server crash
      return done(new Error('No email found in Google profile'), false);
    }

    const user = await this.authService.validateGoogleUser({
      email,
      firstName,
      lastName,
      picture: picture,
      googleId: id,
    });
    done(null, user);
  }
}
