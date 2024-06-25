import bcrypt from 'bcrypt';
import { PassportStatic } from 'passport';
import {
  IStrategyOptionsWithRequest,
  Strategy as LocalStrategy,
  VerifyFunctionWithRequest,
} from 'passport-local';
import PostgresUserRepository from '../repository/postgresUserRepository';
import { UserEntity } from '../../domain/User';

const initPassport = async (
  passport: PassportStatic,
  userRepository: PostgresUserRepository
) => {
  const authenticateUser: VerifyFunctionWithRequest = async (
    req: Express.Request,
    email: string,
    password: string,
    done
  ) => {
    try {
      const user = await userRepository.getUserByEmail(email);

      if (!user) {
        return done(null, false, { message: 'No user with that email' });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return done(null, false, { message: 'Wrong password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err as Error);
    }
  };

  const options: IStrategyOptionsWithRequest = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  };

  const localStrategy = new LocalStrategy(options, authenticateUser);

  passport.use(localStrategy);

  passport.serializeUser(function (user: Express.User, done) {
    const uid = (user as UserEntity).uid;
    done(null, uid);
  });
  passport.deserializeUser((id: string, done) =>
    done(null, userRepository.getUserById(id))
  );
};

export default initPassport;
