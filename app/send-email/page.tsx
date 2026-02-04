'use client';
import { useState } from 'react';

export default function SendEmailForm() {
    const [email, setEmail] = useState('unreal@vanishingpoint3d.com');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [jsonData, setJsonData] = useState<any>(null);
    const [jsonFileName, setJsonFileName] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!jsonData) {
            setMessage('Error: Por favor selecciona un archivo JSON primero.');
            return;
        }

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
                setMessage('Email enviado con éxito');
                setEmail('unreal@vanishingpoint3d.com');
                setName('');
                setJsonData(null);
                setJsonFileName('');
                const fileInput = document.getElementById('json-file-input') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            } else {
                setMessage('Error: ' + data.error);
            }
        } catch (error) {
            setMessage('Error al enviar el correo');
        } finally {
            setLoading(false);
        }
    };

    const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setJsonData(null);
            setJsonFileName('');
            return;
        }


        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setJsonFileName(file.name);
            try {
                // Intentamos guardar como objeto si es válido, sino como texto plano
                setJsonData(JSON.parse(content));
            } catch (e) {
                setJsonData(content);
            }
            setMessage(`Archivo "${file.name}" cargado.`);
        };
        reader.readAsText(file);
    };

    return (
<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

  {/* Card */}
  <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">

    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Nombre */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Nombre
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="
            px-3 py-2 border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />
      </div>

      {/* Email oculto */}
      <div className="hidden">
        <label className="text-sm font-medium text-gray-700">
          Email Destinatario
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Archivo JSON */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Archivo JSON
        </label>

        <input
          type="file"
          id="json-file-input"
          accept=".json"
          onChange={handleJsonUpload}
          className="
            text-sm text-gray-600
            file:mr-3 file:px-4 file:py-2
            file:rounded-md file:border-0
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
          "
        />
      </div>

      {/* Archivo cargado */}
      {jsonFileName && (
        <p className="text-green-600 text-xs">
          ✓ Archivo listo: {jsonFileName}
        </p>
      )}

      {/* Botón */}
      <div className="flex justify-center pt-2">
        <button
          type="submit"
          disabled={loading}
          className="
            px-6 py-2 rounded-md font-medium text-white
            bg-blue-600 hover:bg-blue-700
            disabled:opacity-50 disabled:cursor-not-allowed
            transition
          "
        >
          {loading ? 'Sending...' : 'Send Email'}
        </button>
      </div>

    </form>

  </div>

</div>

    );
}
