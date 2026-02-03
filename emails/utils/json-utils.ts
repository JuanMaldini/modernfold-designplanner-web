export function jsonToBase64DataUri(jsonData: Record<string, any>): string {
    const jsonString = JSON.stringify(jsonData, null, 2);
    const base64 = Buffer.from(jsonString).toString('base64');
    return `data:application/json;charset=utf-8;base64,${base64}`;
}

export function generateFileName(prefix: string = 'data'): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${prefix}-${timestamp}.json`;
}
