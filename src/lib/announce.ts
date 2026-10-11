/**
 * Canal simples para mensagens curtas (toast visível + leitura por leitores
 * de tela via região aria-live). Ex.: anunciar elementos que surgem na
 * evolução histórica ou confirmar "link copiado".
 */
type Listener = (message: string) => void;
const listeners = new Set<Listener>();

export function announce(message: string) {
  for (const l of listeners) l(message);
}

export function subscribeAnnouncements(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
