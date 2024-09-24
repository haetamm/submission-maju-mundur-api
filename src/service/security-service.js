import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ResponseError } from '../entities/response-error.js';

const { hash, compare } = bcrypt;
const { sign, verify } = jwt;

class SecurityService {

    async passwordHash(password) {
        return hash(password, 10);
    }

    async passwordCompare (text, encript) {
        return compare(text, encript);
    }
    
    async generateToken({ userId, role }) {
        try {
            const secretKey = process.env.JWT_SECRET_KEY;
            const expiresIn = parseInt(process.env.JWT_EXPIRES_IN); 
            const issuedAt = Math.floor(Date.now() / 1000);
            const expirationTime = issuedAt + expiresIn;
            
            const tokenPayload = {
                iss: "maju-mundur",
                expiresIn: expirationTime,
                iat: issuedAt,
                userId,
                role,
                services: null
            };
    
            const token = sign(tokenPayload, secretKey);
            return token;
        } catch (err) {
            console.log("Generated Token failed: ", err);
            throw new ResponseError(500, "Internal Server Error");
        }
    }

    async decodeToken(token) {
        const secretKey = process.env.JWT_SECRET_KEY;
        try {
            const credential = verify(token, secretKey);
            return credential;
        } catch (err) {
            console.error("Token verification failed:", err);
            throw new ResponseError(401, "Unauthorized - Invalid token");
        }
    }
}

export const securityService = new SecurityService();