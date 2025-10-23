import { account } from "../client";

export const signUp = async (email: string, password: string, name: string) => {
    return await account.create("unique()", email, password, name);
};
export const signIn = async (email: string, password: string) => {
    return await account.createEmailPasswordSession(email, password);
};
export const signOut = async () => {
    await account.deleteSession("current");
};
