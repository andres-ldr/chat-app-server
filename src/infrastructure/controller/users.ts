import { NextFunction, Request, Response } from 'express';
import BaseError from '../../Utils/BaseError';
import { HttpStatusCode } from '../../Utils/httpCodes';
import UserUsesCases from '../../application/userUseCase';

export default class UserController {
  constructor(private userUseCase: UserUsesCases) {
    // this.name = 'andres';
    // this.postNewUser = this.postNewUser.bind(this);
  }

  postNewUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = req.body;
      newUser.profileImage = req.file?.path || 'uploads/images/default.jpg';

      const { name, lastName, email, profileImage } =
        await this.userUseCase.addNewUser(newUser);

      return res.status(201).json({ name, lastName, email, profileImage });
    } catch (err) {
      return next(err);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedUserData = req.body;
      const uid = req.session.passport!.user;
      updatedUserData.profileImage =
        req.file?.path === undefined ? null : req.file?.path;

      const updatedUser = await this.userUseCase.updateUser(
        uid,
        updatedUserData
      );
      return res.status(201).json(updatedUser);
    } catch (err) {
      return next(err);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const uid = req.body.uid;
    try {
      const deletedUser = await this.userUseCase.deleteUser(uid);
      return res.status(200).json(deletedUser);
    } catch (error) {
      next(error);
    }
  };

  getUsersByNameOrEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      const users = await this.userUseCase.getUserByEmail(email);
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.isAuthenticated()) {
        return next();
      }
    } catch (error) {
      throw new BaseError(
        'Authentication error',
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
    return res.status(400).json({ message: 'Authentication failed' });
  };
}
