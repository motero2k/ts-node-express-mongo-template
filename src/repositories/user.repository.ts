import User, { IUser } from '../models/user.model.js';
import bcrypt from 'bcryptjs';

import { DuplicateKeyError } from '../utils/customErrors.js';

const BCRYPT_ROUNDS = 10;

type UserPersistenceShape = {
    _id: unknown;
    name: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
};

function toPublicUser(user: UserPersistenceShape | null) {
    if (!user) return null;
    return {
        id: String(user._id),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

export const createUser = async (data: Partial<IUser>) => {
    try {
        const hashedPassword = await bcrypt.hash(data.password as string, BCRYPT_ROUNDS);
        const user = new User({ ...data, password: hashedPassword });
        const savedUser = await user.save();
        return toPublicUser(savedUser.toObject() as UserPersistenceShape);
    } catch (err) {
        const e = err as {
            code?: number;
            keyPattern?: { email?: number };
            keyValue?: unknown;
            message?: string;
        };

        if (e.code === 11000 && e.keyPattern?.email) {
            throw new DuplicateKeyError(
                'A user with that email already exists',
                e.keyValue || e.message,
            );
        }
        throw err;
    }
};

export const getUsers = async () => {
    const users = await User.find()
        .select('name email createdAt updatedAt')
        .lean<UserPersistenceShape[]>();
    return users.map((user) => toPublicUser(user));
};

export const getUserById = async (id: string) => {
    const user = await User.findById(id)
        .select('name email createdAt updatedAt')
        .lean<UserPersistenceShape>();
    return toPublicUser(user);
};

export const updateUser = async (id: string, data: Partial<IUser>) => {
    try {
        const updateData = {
            ...data,
            ...(data.password ? { password: await bcrypt.hash(data.password, BCRYPT_ROUNDS) } : {}),
        };
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true })
            .select('name email createdAt updatedAt')
            .lean<UserPersistenceShape>();
        return toPublicUser(updatedUser);
    } catch (err) {
        const e = err as {
            code?: number;
            keyPattern?: { email?: number };
            keyValue?: unknown;
            message?: string;
        };
        if (e.code === 11000 && e.keyPattern && e.keyPattern.email) {
            throw new DuplicateKeyError(
                'A user with that email already exists',
                e.keyValue || e.message,
            );
        }
        throw err;
    }
};

export const deleteUser = async (id: string) => {
    const deletedUser = await User.findByIdAndDelete(id)
        .select('name email createdAt updatedAt')
        .lean<UserPersistenceShape>();
    return toPublicUser(deletedUser);
};
