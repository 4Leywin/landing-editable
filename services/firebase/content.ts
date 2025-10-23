import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";
import { db } from "./client";

// 📦 Obtener todos los documentos de una colección
export async function getAll<T>(collectionName: string): Promise<T[]> {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
}

// 📄 Obtener un documento por ID
export async function getById<T>(
    collectionName: string,
    id: string
): Promise<T | null> {
    const ref = doc(db, collectionName, id);
    const snapshot = await getDoc(ref);
    return snapshot.exists() ? ({ id, ...snapshot.data() } as T) : null;
}

// 🆕 Crear un nuevo documento con ID automático
export async function createItem<T extends Record<string, any>>(
    collectionName: string,
    data: T
): Promise<string> {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
}

// ✏️ Crear o reemplazar un documento con ID específico
export async function setItem<T extends Record<string, any>>(
    collectionName: string,
    id: string,
    data: T
): Promise<void> {
    await setDoc(doc(db, collectionName, id), data);
}

// 🔄 Actualizar parcialmente un documento existente
export async function updateItem<T extends Record<string, any>>(
    collectionName: string,
    id: string,
    data: Partial<T>
): Promise<void> {
    await updateDoc(doc(db, collectionName, id), data);
}

// 🗑️ Eliminar un documento
export async function deleteItem(
    collectionName: string,
    id: string
): Promise<void> {
    await deleteDoc(doc(db, collectionName, id));
}
