import { prismaClient } from "../application/database.js";

class UserRepository {

    async countByUsername(username) {
        return prismaClient.user.count({
            where: { username }
        });
    }

    async createUser(userData, prismaTransaction) {
        return prismaTransaction.user.create({
            data: userData,
            select: {
                id: true,
                username: true,
            },
        });
    }
    
    async findUserById(id) {
        return prismaClient.user.findFirst({
            where: { id, deletedAt: null },
            include: {
                roleUser: {
                    include: {
                        role: true
                    }
                },
                customers: true,
            }
        });
    }

    async findUserByUsername(username) {
        return prismaClient.user.findFirst({
            where: { username, deletedAt: null },
            include: {
                roleUser: {
                    include: {
                        role: true
                    }
                }
            }
        });
    }

    async findUserLogin(id, token) {
        return prismaClient.user.findFirst({
            where: {
                id,
                token,
                deletedAt: null
            },
            include: {
                roleUser: {
                    include: {
                        role: true
                    }
                }
            }
        });
    }

    async updateUserToken(username, token) {
        return prismaClient.user.update({
            where: { username },
            data: { token },
            select: {
                token: true
            }
        });
    }
    

    async deleteTokenUserById(id) {
        return prismaClient.user.update({
            where: { id },
            data: { token: null },
            select: {
                username: true,
            }
        })
    }
    
}

export const userRepository = new UserRepository();
