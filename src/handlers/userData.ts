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

// Очистка старых данных каждые 24 часа
setInterval(() => {
    const now = Date.now();
    for (const [chatId, data] of userDataMap.entries()) {
        if (now - (data.timestamp || 0) > 24 * 60 * 60 * 1000) {
            userDataMap.delete(chatId);
            console.log(`Очищены данные пользователя ${chatId}`);
        }
    }
}, 24 * 60 * 60 * 1000);