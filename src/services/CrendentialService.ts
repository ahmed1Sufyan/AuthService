import bcrypt from 'bcrypt';
export class CredentialsService {
    // Implement methods for validating and retrieving user credentials
    isMatch(password: string, hashPassword: string) {
        return bcrypt.compareSync(password, hashPassword);
    }
}
