import { Button } from '@react-email/components';
import * as React from 'react';
import { jsonToBase64DataUri } from '../utils/json-utils';

interface DownloadButtonProps {
    jsonData: Record<string, any>;
    fileName?: string;
    buttonText?: string;
    style?: React.CSSProperties;
}

export default function DownloadButton({
    jsonData,
    fileName = 'data.json',
    buttonText = 'Descargar JSON',
    style
}: DownloadButtonProps) {
    const dataUri = jsonToBase64DataUri(jsonData);

    const defaultStyle: React.CSSProperties = {
        backgroundColor: '#10b981',
        borderRadius: '4px',
        color: '#fff',
        fontSize: '16px',
        fontWeight: 'bold',
        textDecoration: 'none',
        textAlign: 'center' as const,
        display: 'block',
        width: '100%',
        padding: '12px'
    };

    return (
        <Button
            style={style || defaultStyle}
            href={dataUri}
            // @ts-ignore - download attribute is valid but not in React Email types
            download={fileName}
        >
            {buttonText}
        </Button>
    );
}
