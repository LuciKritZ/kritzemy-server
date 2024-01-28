import { Request, Response, NextFunction } from 'express';
import { UserModel } from '@/models';
import { CatchAsyncErrors } from '@/middlewares';
import { ErrorHandler, sendEmail, verifyActivationToken } from '@/utils';
import { createActivationToken } from '@/utils';
import { render as renderEmail } from 'ejs';
import { join as joinPath } from 'path';
import {
  IActivationRequest,
  IRegistrationBody,
  IVerifiedAccountType,
} from '@/dto';
import { USER_CONTROLLER_ERRORS } from '@/constants';

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

        res.status(201).json({
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

      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
