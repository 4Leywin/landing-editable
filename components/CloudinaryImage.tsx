// components/CloudinaryImage.tsx
import Image from "next/image";

interface CloudinaryImageProps {
    src: string; // URL completa de Cloudinary (https://res.cloudinary.com/...)
    alt: string;
    width?: number;
    height?: number;
    quality?: number; // Si quieres forzar calidad (opcional)
    sizes?: string; // Para responsive (opcional)
    className?: string;
    priority?: boolean; // Si quieres que se cargue antes (ej. imagen principal)
}

/**
 * CloudinaryImage optimiza automáticamente tus imágenes usando:
 * - f_auto → el mejor formato (WebP, AVIF, JPG, etc.)
 * - q_auto → calidad automática según red y pantalla
 * - Lazy loading y cache del navegador
 */
export default function CloudinaryImage({
    src,
    alt,
    width = 800,
    height = 600,
    quality,
    sizes = "(max-width: 768px) 100vw, 50vw",
    className,
    priority = false,
}: CloudinaryImageProps) {
    // Inserta f_auto y q_auto automáticamente si no están en la URL
    const optimizedSrc = src.includes("/upload/")
        ? src.replace("/upload/", "/upload/f_auto,q_auto/")
        : src;

    return (
        <Image
            src={optimizedSrc}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            quality={quality}
            className={className}
            loading={priority ? "eager" : "lazy"}
            priority={priority}
        />
    );
}
