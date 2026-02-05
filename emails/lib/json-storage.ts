import { promises as fs } from "fs";
import path from "path";

interface StoredJson {
    data: any;
    timestamp: number;
}

const STORE_DIR = path.join(process.cwd(), ".json-store");
// 0 desactiva la expiración (persistencia indefinida)
const EXPIRATION_TIME = 0;

export function generateJsonId(): string {
    return `json-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

async function ensureStoreDir() {
    await fs.mkdir(STORE_DIR, { recursive: true });
}

function getFilePath(id: string) {
    return path.join(STORE_DIR, `${id}.json`);
}

function isExpired(timestamp: number) {
    if (EXPIRATION_TIME <= 0) return false;
    return Date.now() - timestamp > EXPIRATION_TIME;
}

export async function storeJson(data: any): Promise<string> {
    const id = generateJsonId();
    await ensureStoreDir();

    const payload: StoredJson = {
        data,
        timestamp: Date.now(),
    };

    await fs.writeFile(getFilePath(id), JSON.stringify(payload), "utf-8");

    await cleanExpiredJsons();

    return id;
}

export async function getJson(id: string): Promise<any | null> {
    try {
        const raw = await fs.readFile(getFilePath(id), "utf-8");
        const stored = JSON.parse(raw) as StoredJson;

        if (isExpired(stored.timestamp)) {
            await fs.unlink(getFilePath(id));
            return null;
        }

        return stored.data;
    } catch (error: any) {
        if (error?.code === "ENOENT") {
            return null;
        }
        throw error;
    }
}

async function cleanExpiredJsons() {
    if (EXPIRATION_TIME <= 0) return;

    try {
        const files = await fs.readdir(STORE_DIR);
        await Promise.all(
            files
                .filter((file) => file.endsWith(".json"))
                .map(async (file) => {
                    const filePath = path.join(STORE_DIR, file);
                    try {
                        const raw = await fs.readFile(filePath, "utf-8");
                        const stored = JSON.parse(raw) as StoredJson;
                        if (isExpired(stored.timestamp)) {
                            await fs.unlink(filePath);
                        }
                    } catch {
                        // Ignorar archivos corruptos para no interrumpir el flujo
                    }
                }),
        );
    } catch {
        // Ignorar errores de limpieza
    }
}
