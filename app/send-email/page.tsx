'use client';
import { useState } from 'react';

export default function SendEmailForm() {
    const [email, setEmail] = useState('unreal@vanishingpoint3d.com');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [jsonData, setJsonData] = useState<Record<string, any> | null>(null);
    const [jsonFileName, setJsonFileName] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: email,
                    userName: name,
                    userEmail: email,
                    jsonData: jsonData
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Email sent successfully');
                setEmail('');
                setName('');
                setJsonData(null);
                setJsonFileName('');
            } else {
                setMessage('Error: ' + data.error);
            }
        } catch (error) {
            setMessage('Error sending email');
        } finally {
            setLoading(false);
        }
    };

    const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                setJsonData(json);
                setJsonFileName(file.name);
            } catch (error) {
                setMessage('Error parsing JSON file');
                setJsonData(null);
                setJsonFileName('');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nombre</label>
                        <input
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ display: 'none' }}>
                        <label>Email Destinatario</label>
                        <input
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <input
                        type="file"
                        id="json-file-input"
                        accept=".json"
                        onChange={handleJsonUpload}
                        required
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Email'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
