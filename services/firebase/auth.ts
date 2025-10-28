import app from "./client";

interface IFirebaseService {
    registerUser: (email: string, password: string) => Promise<any>;
    getUsers: () => Promise<any[]>;
    loginUser: (email: string, password: string) => Promise<any>;
}

class FirebaseService implements IFirebaseService {
    async registerUser(email: string, password: string): Promise<any> {
        try {
            const { getAuth, createUserWithEmailAndPassword } = await import(
                "firebase/auth"
            );
            const auth = getAuth(app as any);
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
            const { getAuth, signInWithEmailAndPassword } = await import(
                "firebase/auth"
            );
            const auth = getAuth(app as any);
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
