import { Request, Response, NextFunction } from 'express';
import { UserModel } from '@/models';
import { CatchAsyncErrors } from '@/middlewares';
import {
  ErrorHandler,
  decodeSecurityToken,
  getGeneratedTokenOptions,
  sendEmail,
  sendSecurityTokens,
  signSecurityToken,
  verifyActivationToken,
} from '@/utils';
import { createActivationToken } from '@/utils';
import { render as renderEmail } from 'ejs';
import { join as joinPath } from 'path';
import {
  IActivationRequest,
  ILoginRequest,
  IRegistrationBody,
  IVerifiedAccountType,
} from '@/dto';
import { AUTH_ERRORS, USER_CONTROLLER_ERRORS } from '@/constants';
import { redisClient } from '@/services';
import { getUserById } from '@/operations';

// Registering user
export const registerUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const doesEmailExist = await UserModel.findOne({ email });
      if (doesEmailExist) {
        return next(
          new ErrorHandler(USER_CONTROLLER_ERRORS.USER_ALREADY_EXISTS, 400)
        );
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      const { activationCode, token } =
        createActivationToken<IRegistrationBody>(user);
      const emailProps = {
        user: { name: user.name },
        activationCode,
        platform: 'Kritzemy',
        supportEmail: 'kritzemy@gmail.com',
      };
      const html = renderEmail(
        joinPath(__dirname, '../templates/activation-mail.template.ejs'),
        emailProps
      );

      try {
        await sendEmail({
          email,
          subject: 'Activate your account',
          templateName: 'activation-mail.template.ejs',
          data: emailProps,
        });

        return res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account.`,
          activation_token: token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Activate user
export const activateUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        activation_token: activationToken,
        activation_code: activationCode,
      } = req.body as IActivationRequest;

      const newUser: IVerifiedAccountType =
        verifyActivationToken<IVerifiedAccountType>(activationToken);

      if (newUser.activationCode !== activationCode) {
        return next(
          new ErrorHandler(USER_CONTROLLER_ERRORS.INVALID_ACTIVATION_CODE, 400)
        );
      }

      const { name, email, password } = newUser.user;

      const doesUserExist = await UserModel.findOne({ email });

      if (doesUserExist) {
        return next(
          new ErrorHandler(USER_CONTROLLER_ERRORS.USER_ALREADY_EXISTS, 400)
        );
      }

      const user = await UserModel.create({
        name,
        email,
        password,
      });

      return res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Login
export const loginUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(
          new ErrorHandler(USER_CONTROLLER_ERRORS.EMAIL_PASSWORD_MISSING, 400)
        );
      }

      const user = await UserModel.findOne({ email }).select('+password');

      if (!user) {
        return next(
          new ErrorHandler(USER_CONTROLLER_ERRORS.INVALID_EMAIL_PASSWORD, 400)
        );
      }

      const isPasswordCorrect = await user.comparePassword(password);

      if (!isPasswordCorrect) {
        return next(
          new ErrorHandler(USER_CONTROLLER_ERRORS.INVALID_EMAIL_PASSWORD, 400)
        );
      }

      sendSecurityTokens(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Logout
export const logoutUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie('access_token', '', { maxAge: 1 });
      res.cookie('refresh_token', '', { maxAge: 1 });
      const userId = req.user?._id || '';

      if (userId) redisClient.del(userId);

      return res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Updating access token
export const updateAccessToken = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const decoded = decodeSecurityToken(
        refresh_token,
        'REFRESH_TOKEN_SECRET_KEY'
      );

      const message = 'Unable to refresh token';

      const session = await redisClient.get(decoded.id as string);
      if (!session) {
        return next(new ErrorHandler(message, 400));
      }

      const user = JSON.parse(session);

      const accessToken = signSecurityToken({
        id: user._id,
        expiresIn: '5m',
        tokenType: 'ACCESS_TOKEN_SECRET_KEY',
      });

      const refreshToken = signSecurityToken({
        id: user._id,
        expiresIn: '3d',
        tokenType: 'REFRESH_TOKEN_SECRET_KEY',
      });

      const { accessTokenOptions, refreshTokenOptions } =
        getGeneratedTokenOptions();

      res.cookie('access_token', accessToken, accessTokenOptions);
      res.cookie('refresh_token', refreshToken, refreshTokenOptions);

      return res.status(200).json({
        success: true,
        accessToken,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get user info
export const getUserInfo = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;

      getUserById(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Social Authentication
// TODO: SECURE THIS
export const socialAuthentication = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body;

      const user = await UserModel.findOne({ email });

      if (!user) {
        const newUser = await UserModel.create({ email, name, avatar });

        sendSecurityTokens(newUser, 200, res);
      } else {
        sendSecurityTokens(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
