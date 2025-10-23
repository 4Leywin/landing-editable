import DEFAULT_CONTENT from "../lib/content";

export function getSeedContent() {
  // Retorna directamente el DEFAULT_CONTENT para que el usuario lo use.
  return { ...DEFAULT_CONTENT } as any;
}

/**
 * seed - prepara el contenido y lo pasa a saveFn si se proporciona.
 * saveFn puede ser cualquier función async que guarde en DB.
 * Si no se proporciona, por defecto se hace console.log del objeto (para inspección).
 */
export async function seed(options?: { saveFn?: (content: any) => Promise<void> | void }) {
  const content = getSeedContent();
  if (options?.saveFn) {
    await options.saveFn(content);
    return;
  }

  // Default: print a short summary and the content JSON to stdout
  console.log("Seeder: contenido preparado. Ejecuta seed({ saveFn }) para persistir.");
  console.log(JSON.stringify(content, null, 2));
}

export default getSeedContent;
