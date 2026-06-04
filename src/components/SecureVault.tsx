import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

export default function SecureVault() {
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleSave = async () => {
    try {
      if (typeof invoke === 'function') {
        const result = await invoke('guardar_evidencia', { data: text, password });
        setStatus(result as string);
      } else {
        setStatus('Nota protegida exitosamente (Simulado)');
      }
    } catch (e) {
      setStatus('Error: ' + e);
    }
  };

  return (
    <div className="vault-container">
      <input 
        className="vault-input"
        type="password" 
        placeholder="Clave maestra" 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <textarea 
        className="vault-textarea"
        placeholder="Escribe una nota secreta o guarda evidencias de forma segura..." 
        onChange={(e) => setText(e.target.value)} 
      />
      <button className="vault-btn" onClick={handleSave}>Proteger Nota</button>
      {status && <div className="vault-status">{status}</div>}
    </div>
  );
}