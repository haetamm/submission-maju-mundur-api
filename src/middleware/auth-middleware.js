import { userRepository } from "../repository/user-respository.js";
import { ResponseJson } from "../entities/response-json.js";
import { securityService } from '../service/security-service.js';

export const authMiddleware = async (req, res, next) => {
    const authHeader  = req.get('Authorization');
    if (!authHeader) {
        const response = new ResponseJson(401, "Unauthorized -  No token provided")
        res.status(401).json(response).end();
    } else {
        const token = authHeader.split(' ')[1];
        if (!token) {
            const response = new ResponseJson(401, "Unauthorized - Malformed token")
            res.status(401).json(response).end();
            return;
        }

        try {
            const decoded = await securityService.decodeToken(token, process.env.JWT_SECRET_KEY);
            const user = await userRepository.findUserLogin(decoded.userId, token);

            if (!user) {
                const response = new ResponseJson(401, "Unauthorized - Not authenticated")
                res.status(401).json(response).end();
            } else {
                req.user = user; 
                next();
            }
        } catch (err) {
            const response = new ResponseJson(401, "Unauthorized - Invalid token")
            res.status(401).json(response).end();
        }
    }
}