import { DataSource } from 'typeorm';

export default async (connection: DataSource) => {
    const entitites = connection.entityMetadatas;

    for (const entity of entitites) {
        const repository = connection.getRepository(entity.name);
        await repository.clear();
    }
};

export const isJwt = (token: string): boolean => {
    if (!token) return false;
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    try {
        parts.forEach((part) => {
            Buffer.from(part, 'base64').toString('utf8');
        });
        return true;
    } catch (error) {
        return false;
    }
};
