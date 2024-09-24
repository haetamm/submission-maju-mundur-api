import { ResponseError } from "../entities/response-error.js";
import { userRepository } from "../repository/user-respository.js";
import UserResponse from "../entities/user/user-response.js";

class UserService {

    async getById ({ params }) {
        const user = await this.findUserById(params.userId)
        return UserResponse.convert(user)
    }

    async findUserByUsername(username) {
        const countUser = await userRepository.countByUsername(username);
        if (countUser > 0) {
            throw new ResponseError(400, `\"username\" already exists`);
        }
    }

    async findUserById(id) {
        const user = await userRepository.findUserById(id)
        if (!user) {
            throw new ResponseError(404, `\"user\" not found`);
        }
        return user
    }
    
}

export const userService = new UserService();