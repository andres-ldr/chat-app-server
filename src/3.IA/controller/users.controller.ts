import { Request, Response, NextFunction, query } from 'express';
import UserUsesCases from '../../2.ABR/userUseCase';

export default class UserController {
  constructor(private userUseCase: UserUsesCases) {}
  fetchUserById = async ({ params }: Request, res: Response) => {
    const { uid } = params;
    const user = await this.userUseCase.findUserById();
  };
  postNewUser = async (req: Request, res: Response) => {
    const newUser = await this.userUseCase.addNewUser(req.body);
    return res.status(201).json(newUser);
  };

  fetchAllUsers = async (req: Request, res: Response) => {
    const users = await this.userUseCase.getAllUsers();
    return res.status(200).json({ users });
  };
}
