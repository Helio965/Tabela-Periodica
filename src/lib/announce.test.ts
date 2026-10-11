import { describe, expect, it, vi } from 'vitest';
import { announce, subscribeAnnouncements } from './announce';

describe('announce', () => {
  it('entrega a mensagem a todos os ouvintes inscritos', () => {
    const a = vi.fn();
    const b = vi.fn();
    const offA = subscribeAnnouncements(a);
    const offB = subscribeAnnouncements(b);
    announce('Link copiado');
    expect(a).toHaveBeenCalledWith('Link copiado');
    expect(b).toHaveBeenCalledWith('Link copiado');
    offA();
    offB();
  });

  it('cancelar a inscrição interrompe as mensagens', () => {
    const listener = vi.fn();
    const off = subscribeAnnouncements(listener);
    off();
    announce('Gálio descoberto em 1875');
    expect(listener).not.toHaveBeenCalled();
  });
});
