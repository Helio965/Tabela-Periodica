import { useEffect, useState } from 'react';
import { subscribeAnnouncements } from '../lib/announce';

/** Mostra mensagens rápidas e as repassa a leitores de tela. */
export function Announcer() {
  const [message, setMessage] = useState<{ text: string; id: number } | null>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const off = subscribeAnnouncements((text) => {
      setMessage({ text, id: Date.now() });
      clearTimeout(timer);
      timer = setTimeout(() => setMessage(null), 2600);
    });
    return () => {
      off();
      clearTimeout(timer);
    };
  }, []);
  return (
    <>
      <div className="sr-only" aria-live="polite" role="status">
        {message?.text ?? ''}
      </div>
      {message ? (
        <div className="toast" key={message.id} aria-hidden="true">
          {message.text}
        </div>
      ) : null}
    </>
  );
}
