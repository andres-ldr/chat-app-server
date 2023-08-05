import { Request, Response, NextFunction } from 'express';
import UserUsesCases from '../../2.ABR/userUseCase';
import HttpError from '../../4.F&D/models/HttpErrors';

export default class UserController {
  constructor(private userUseCase: UserUsesCases) {}
  fetchUserById = async (
    { params }: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { uid } = params;
    let user;
    try {
      user = await this.userUseCase.findUserById(uid);
    } catch (err) {
      const error = new HttpError('Creating contact failed, try again', 500);
      return next(error);
    }
    return res.status(200).json(user);
  };

  postNewUser = async (req: Request, res: Response, next: NextFunction) => {
    let newUser;
    try {
      newUser = await this.userUseCase.addNewUser(req.body);
    } catch (err) {
      const error = new HttpError('Creating new user failed, try again', 500);
      return next(error);
    }
    return res.status(201).json(newUser);
  };

  fetchAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    let users;
    try {
      users = await this.userUseCase.getAllUsers();
    } catch (err) {
      const error = new HttpError('Error fetching all user', 500);
      return next(error);
    }
    return res.status(200).json({ users });
  };

  postNewContact = async (req: Request, res: Response, next: NextFunction) => {
    const { uid } = req.params;
    const { email } = req.body;
    let response;
    try {
      response = await this.userUseCase.addNewContact(uid, email);
    } catch (err) {
      const error = new HttpError('Creating contact failed, try again', 500);
      return next(error);
    }
    return res.status(201).json(response);
  };
}
