import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import PostgresRepository from './repository/postgresRepository';
import bcrypt from 'bcrypt';

const initPassport = async (
  passport: PassportStatic,
  userRepository: PostgresRepository
) => {
  const authenticateUser = async (
    email: string,
    password: string,
    done: Function
  ) => {
    try {
      const user = await userRepository.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return done(null, false, { message: 'No user with that email' });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return done(null, false, { message: 'Wrong password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.serializeUser((user: any, done) => done(null, user.uid));
  passport.deserializeUser((id: string, done) =>
    done(null, userRepository.getUserById(id))
  );
};

export default initPassport;
