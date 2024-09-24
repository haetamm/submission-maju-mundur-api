import { validate } from "../validation/validation.js";
import { loginUserValidation, registerCustomerValidation, registerMerchantValidation } from "../validation/user-validation.js";
import { ResponseError } from "../entities/response-error.js";
import { userRepository } from "../repository/user-respository.js";
import { securityService } from "./security-service.js";
import { userService } from "./user-service.js";
import { userRolesRepository } from "../repository/user-roles-respository.js";
import { customerRepository } from "../repository/customer-repository.js";
import { prismaClient } from "../application/database.js";
import { roleRepository } from '../repository/role-repository.js'
import { merchantRepository } from "../repository/merchant-repository.js";

class AuthService {

    async login({ body }) {
        const loginRequest = validate(loginUserValidation, body);
        const user = await userRepository.findUserByUsername(loginRequest.username);
        if (!user) {
            throw new ResponseError(400, `\"username\" or \"password\" wrong`);
        }
    
        const { id, username, password, roleUser } = user;
        const isPasswordValid = await securityService.passwordCompare(loginRequest.password, password);
        if (!isPasswordValid) {
            throw new ResponseError(400, `\"username\" or \"password\" wrong`);
        }
    
        const token = await securityService.generateToken({ userId: id, role: roleUser[0].role.role });
        await userRepository.updateUserToken(username, token);
        return {
            token,
            roleUser: roleUser.map(roleUser => roleUser.role.role),
        };
    }
    
    async createUser({ body, role, createEntity, validationSchema }) {
        const { username, password, ...entityData } = validate(validationSchema, body);
        try {
            const newUser = await prismaClient.$transaction(async (prismaTransaction) => {
                await userService.findUserByUsername(username);
                const hashPassword = await securityService.passwordHash(password);
    
                const dataUser = { username, password: hashPassword };
                const newUser = await userRepository.createUser(dataUser, prismaTransaction);
                const { id: roleId } = await roleRepository.findByRoleName(role, prismaTransaction);
                await userRolesRepository.addUserRole(newUser.id, roleId, prismaTransaction);
                await createEntity({ userId: newUser.id, ...entityData }, prismaTransaction);
    
                return newUser;
            });
    
            return newUser;
        } catch (error) {
            if (error instanceof ResponseError) {
                throw error;
            } else {
                console.log(`Registration failed: ${error.message}`);
                throw new ResponseError(500, "Internal Server Error");
            }
        }
    }
    
    async createCustomer({ body }) {
        return this.createUser({
            body,
            role: 'CUSTOMER',
            createEntity: (data, transaction) => customerRepository.createCustomer({ pointTransaction: 0, ...data }, transaction),
            validationSchema: registerCustomerValidation
        });
    }
    
    async createMerchant({ body }) {
        return this.createUser({
            body,
            role: 'MERCHANT',
            createEntity: (data, transaction) => merchantRepository.createMerchant(data, transaction),
            validationSchema: registerMerchantValidation
        });
    }
    

    async logout({ user }) {
        const { username } = await userRepository.deleteTokenUserById(user.id);
        return `Logout berhasil ${username}`
    }
    
}

export const authService = new AuthService();