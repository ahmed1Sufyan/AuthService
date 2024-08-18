import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

// Load the public key from a file or an environment variable
const publicKey = fs.readFileSync(
    path.join(__dirname, '../../certs/public.pem'),
    'utf8',
);

// Middleware to verify JWT
export function authenticate(req: Request, res: Response, next: NextFunction) {
    // Extract token from Authorization header or cookies
    const token = extractToken(req);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized Access!' });
    }
    // Verify the token using the public key
    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req as Record<string, any>).user = decoded; // Attach user info to request
        next();
    });
}

// Function to extract token from Authorization header or cookies
function extractToken(req: Request): string | undefined {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const tokenFromCookie = req.cookies?.accessToken;
    if (tokenFromCookie) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return tokenFromCookie;
    }
    return undefined;
}
