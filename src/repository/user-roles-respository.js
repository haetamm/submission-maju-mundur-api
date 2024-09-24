class UserRolesRepository {
    async addUserRole(userId, roleId, prismaTransaction) {
        return prismaTransaction.roleUser.create({
            data: {
                userId: userId,
                roleId: roleId,
            },
        });
    }
}

export const userRolesRepository = new UserRolesRepository();