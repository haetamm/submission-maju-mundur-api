class RoleRepository {
    async findByRoleName(role, prismaTransaction) {
        return prismaTransaction.role.findUnique({
            where: { role },
        });
    }
}

export const roleRepository = new RoleRepository();
