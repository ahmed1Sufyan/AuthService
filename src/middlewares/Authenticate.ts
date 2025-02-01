import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { log } from 'console';
import path from 'path';
import fs from 'fs';

// export default  expressjwt({
//     secret:  JwksClient.expressJwtSecret({
//         jwksUri: "http://localhost:5000/.well-known/jwks.json",
//         cache: true,
//         rateLimit: true,
//     }) as GetVerificationKey,
//     algorithms: ["RS256"],
//     getToken:( (req: Request) => {
//         console.log(req.cookies);
//         const accessToken = (req.cookies as AuthTokens).accessToken;
//         return accessToken // Return null if accessToken doesn't exist
//     }) as TokenGetter ,
// });
// Load the public key from a file or an environment variable
const publicKey = fs.readFileSync(
    path.join(__dirname, '../../certs/public.pem'),
    'utf8',
);

// const client = ()=>{
//   return  jwksRsa({
//         jwksUri: 'http://localhost:5000/.well-known/jwks.json', // Your JWKS URL
//     });
// }

// Function to  get the signing key
// console.log("client==>>",client.getSigningKey());

// const getKey = (
//     header: jwt.JwtHeader,
//     callback: (err: Error | null, key?: string | Buffer) => void,
// ) => {
//     client.getSigningKey(header.kid, (err, key) => {
//         if (err) {
//             return callback(err);
//         }
//         if (key) {
//             const signingKey = key.getPublicKey();
//             return callback(null, signingKey); // Pass null for err
//         } else {
//             return callback(new Error('Signing key not found'));
//         }
//     });
// };
// console.log("getkey==>>",()=>{
//     getKey()
// });

export default (req: Request, res: Response, next: NextFunction) => {
    // Extract token from Authorization header or cookies
    //  console.log( await client.getSigningKey());

    const token = extractToken(req);
    log('token==>>>', token);
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized Access!' });
    }
    // Verify the token using the public key
    // log(publicKey);
    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).json({ message: 'Invalid token' });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req as Record<string, any>).auth = decoded as JwtPayload; // Attach user info to request
        next();
    });
};

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
