import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./client";

interface IFirebaseService {
    registerUser: (email: string, password: string) => Promise<any>;
    getUsers: () => Promise<any[]>;
    loginUser: (email: string, password: string) => Promise<any>;
}

class FirebaseService implements IFirebaseService {
    async registerUser(email: string, password: string): Promise<any> {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    }

    async getUsers(): Promise<any[]> {
        // Minimal placeholder; implement real logic when needed.
        return [];
    }

    async loginUser(email: string, password: string): Promise<any> {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    }
}

export const firebaseService = new FirebaseService();
