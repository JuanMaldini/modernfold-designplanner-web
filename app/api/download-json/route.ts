import { NextRequest, NextResponse } from 'next/server';
import { getJson } from '@/emails/lib/json-storage';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');
        const fileName = searchParams.get('name') || 'data.json';

        if (!id) {
            return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
        }

        const jsonData = getJson(id);

        if (!jsonData) {
            return NextResponse.json({ error: 'JSON no encontrado o expirado' }, { status: 404 });
        }

        const jsonString = JSON.stringify(jsonData, null, 2);

        return new NextResponse(jsonString, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="${fileName}"`,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: 'Error al descargar JSON' }, { status: 500 });
    }
}
