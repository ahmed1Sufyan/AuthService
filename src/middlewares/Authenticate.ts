import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { error, log } from 'console';

// Load the public key from a file or an environment variable
const publicKey = fs.readFileSync(
    path.join(__dirname, '../../certs/public.pem'),
    'utf8',
);

// Middleware to verify JWT
export function authenticate(req: Request, res: Response, next: NextFunction) {
    // Extract token from Authorization header or cookies
    const token = extractToken(req);
    log('token==>>>', token);
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized Access!' });
    }
    // Verify the token using the public key
    // log(publicKey);
    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            error(err.message);
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
