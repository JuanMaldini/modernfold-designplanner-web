interface StoredJson {
    data: Record<string, any>;
    timestamp: number;
}

const jsonStore = new Map<string, StoredJson>();

const EXPIRATION_TIME = 24 * 60 * 60 * 1000;

export function generateJsonId(): string {
    return `json-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

export function storeJson(data: Record<string, any>): string {
    const id = generateJsonId();
    jsonStore.set(id, {
        data,
        timestamp: Date.now()
    });

    cleanExpiredJsons();

    return id;
}

export function getJson(id: string): Record<string, any> | null {
    const stored = jsonStore.get(id);

    if (!stored) {
        return null;
    }

    if (Date.now() - stored.timestamp > EXPIRATION_TIME) {
        jsonStore.delete(id);
        return null;
    }

    return stored.data;
}

function cleanExpiredJsons() {
    const now = Date.now();
    for (const [id, stored] of jsonStore.entries()) {
        if (now - stored.timestamp > EXPIRATION_TIME) {
            jsonStore.delete(id);
        }
    }
}
