const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dnbxp946z";
const UPLOAD_PRESET = "luxury_unsigned"; // Preset por defecto de Cloudinary
const BASE_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

export async function uploadImageFile(
    file: File,
    folder: string
): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", folder);
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            body: formData,
        });
        if (!response.ok) {
            throw new Error(`Error uploading image: ${response.statusText}`);
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}
