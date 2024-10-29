import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { log } from 'console';
import JwksRsa from 'jwks-rsa';

// Load the public key from a file or an environment variable
// const publicKey = fs.readFileSync(
//     path.join(__dirname, '../../certs/public.pem'),
//     'utf8',
// );

const client = JwksRsa({
    jwksUri: 'http://localhost:7000/.well-known/jwks.json', // Your JWKS URL
});

// Function to  get the signing key
const getKey = (
    header: jwt.JwtHeader,
    callback: (err: Error, key?: string | Buffer) => void,
) => {
    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            return callback(err);
        }
        if (key) {
            const signingKey = key.getPublicKey();
            callback(err!, signingKey);
        } else {
            callback(new Error('Signing key not found'));
        }
    });
};
export function authenticate(req: Request, res: Response, next: NextFunction) {
    // Extract token from Authorization header or cookies
    const token = extractToken(req);
    log('token==>>>', token);
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized Access!' });
    }
    // Verify the token using the public key
    // log(publicKey);
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req as Record<string, any>).auth = decoded as JwtPayload; // Attach user info to request
        next();
    });
}

// Function to extract token from Authorization header or cookies
function extractToken(req: Request): string | undefined {
    // const authHeader = req.headers.authorization;
    // if (!authHeader) {
    //     return undefined;
    // }
    // if (authHeader?.startsWith('Bearer ')) {
    //     return authHeader.split(' ')[1];
    // }
    const tokenFromCookie = (req.cookies as Record<string, string>).accessToken;
    if (tokenFromCookie) {
        return tokenFromCookie;
    }
    return undefined;
}
