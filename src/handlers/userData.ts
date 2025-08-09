import { UserData } from '../types/UserData';

const userDataMap = new Map<number, UserData>();

export const getUserData = (chatId: number): UserData => {
    if (!userDataMap.has(chatId)) {
        userDataMap.set(chatId, {});
    }
    return userDataMap.get(chatId)!;
};

export const setUserData = (chatId: number, data: Partial<UserData>) => {
    const userData = getUserData(chatId);
    userDataMap.set(chatId, { ...userData, ...data });
};

export const resetUserData = (chatId: number) => {
    userDataMap.delete(chatId);
};