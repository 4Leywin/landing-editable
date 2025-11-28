const API_BASE_URL = "https://api.quierolapromocion.com";
const UPLOAD_URL = `${API_BASE_URL}/upload`;
const FILES_URL = `${API_BASE_URL}/files`;

export async function uploadImageFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    try {
        const response = await fetch(UPLOAD_URL, {
            method: "POST",
            body: formData,
        });
        if (!response.ok) {
            throw new Error(`Error uploading image: ${response.statusText}`);
        }
        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}

export async function uploadVideoFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    try {
        const response = await fetch(UPLOAD_URL, {
            method: "POST",
            body: formData,
        });
        if (!response.ok) {
            throw new Error(`Error uploading video: ${response.statusText}`);
        }
        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error("Error uploading video:", error);
        throw error;
    }
}

export async function deleteFile(filename: string): Promise<void> {
    try {
        const response = await fetch(
            `${FILES_URL}/${encodeURIComponent(filename)}`,
            {
                method: "DELETE",
            }
        );
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("File not found");
            }
            throw new Error(`Error deleting file: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error deleting file:", error);
        throw error;
    }
}
