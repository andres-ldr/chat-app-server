import bcrypt from 'bcrypt';
import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import PostgresUserRepository from '../repository/postgresUserRepository';

const initPassport = async (
  passport: PassportStatic,
  userRepository: PostgresUserRepository
) => {
  const authenticateUser = async (
    email: string,
    password: string,
    done: (
      error: Error | null,
      user?:
        | {
            uid: string;
            email: string;
            name: string;
            lastName: string;
            password: string;
            profileImage: string | null;
            creationDate: Date;
          }
        | boolean,
      options?: unknown
    ) => void
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
      return done(err as Error);
    }
  };

  const localStrategy = new LocalStrategy(
    { usernameField: 'email' },
    authenticateUser
  );
  passport.use(localStrategy);

  passport.serializeUser((user: unknown, done) => done(null, user.uid));
  passport.deserializeUser((id: string, done) =>
    done(null, userRepository.getUserById(id))
  );
};

export default initPassport;
