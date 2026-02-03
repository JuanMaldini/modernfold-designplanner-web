'use client';
import { useState } from 'react';

export default function Home() {
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
      const response = await fetch('/api/send-email', {
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
        setMessage(`Loading Json: ${file.name}`);
      } catch (error) {
        setMessage('Error parsing JSON file');
        setJsonData(null);
        setJsonFileName('');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-96'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>Nombre</label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full px-3 py-2 border rounded-md'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-2'>Email Destinatario</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-3 py-2 border rounded-md'
              required
            />
          </div>

          <input
            type="file"
            id="json-file-input"
            accept=".json"
            onChange={handleJsonUpload}
            className="hidden"
            required
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Sending...' : 'Send Email'}
            </button>
          </div>

          {jsonFileName && (
            <div className="text-sm text-green-600 text-center">
              Archivo adjunto: {jsonFileName}
            </div>
          )}
        </form>
        {message && <p className='mt-4 text-center'>{message}</p>}
      </div>
    </div>
  );
}
