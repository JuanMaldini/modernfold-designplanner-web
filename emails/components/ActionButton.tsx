import { Button } from '@react-email/components';
import * as React from 'react';

interface ActionButtonProps {
    href: string;
    buttonText: string;
    style?: React.CSSProperties;
}

export default function ActionButton({
    href,
    buttonText,
    style
}: ActionButtonProps) {
    const defaultStyle: React.CSSProperties = {
        backgroundColor: '#5469d4',
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
        <Button style={style || defaultStyle} href={href}>
            {buttonText}
        </Button>
    );
}
