import type { PanelProps } from '../components/SidePanel';
import { ExternalLink } from '../components/ExternalLink';
import { Icon } from '../components/Icon';
import { ELEMENTS } from '../data/elements';
import { BASE_ELEMENT_SOURCES, SOURCES, type Source, type SourceKind } from '../data/sources';
import { useStore } from '../state/store';
import './learn.css';

const KIND_LABELS: Record<SourceKind, { title: string; description: string }> = {
  dados: { title: 'Dados numéricos', description: 'Massas atômicas, isótopos, meias-vidas e propriedades físico-químicas.' },
  historia: { title: 'História e descobertas', description: 'Quem descobriu cada elemento, quando, como, e as disputas de atribuição.' },
  nomenclatura: { title: 'Nomes e símbolos', description: 'Nomes oficiais, regras da IUPAC e nomes em português.' },
  referencia: { title: 'Referências gerais', description: 'Obras de consulta sobre os elementos e a tabela periódica.' },
};
const KIND_ORDER: SourceKind[] = ['dados', 'historia', 'nomenclatura', 'referencia'];

/** Elementos cuja massa exibida é o número de massa do isótopo de vida mais longa. */
const MASS_NUMBER_COUNT = ELEMENTS.filter((el) => el.massIsMassNumber).length;
const PREDICTED_STATE_COUNT = ELEMENTS.filter((el) => el.state === 'unknown').length;
const DISPUTED_COUNT = ELEMENTS.filter((el) => el.discovery.disputed).length;

function SourceItem({ source: s }: { source: Source }) {
  return (
    <li className="src-item">
      <p className="src-title">
        <ExternalLink href={s.url}>{s.title}</ExternalLink>
      </p>
      <p className="small muted">{s.publisher}</p>
      {s.citation ? <p className="small mono src-citation">{s.citation}</p> : null}
      <p className="small src-used">{s.usedFor}</p>
    </li>
  );
}

export default function SourcesPanel(_props: PanelProps) {
  const { dispatch } = useStore();
  return (
    <div className="sources">
      <p className="panel-lead">
        Nenhum número desta tabela foi digitado à mão: os dados são gerados por scripts a partir de fontes científicas primárias, e cada
        ficha de elemento lista as suas fontes. Abaixo, como os dados foram obtidos e a lista completa de referências.
      </p>

      <section className="panel-section" aria-labelledby="src-method">
        <h3 className="section-title" id="src-method">
          Metodologia
        </h3>
        <ul className="src-method">
          <li>
            <strong>Massas atômicas:</strong> pesos atômicos padrão abreviados da IUPAC/CIAAW (2024). Quando o CIAAW publica um intervalo
            (elementos com composição isotópica variável, como hidrogênio e carbono), a ficha mostra também o intervalo.
          </li>
          <li>
            <strong>Elementos sem peso atômico padrão</strong> ({MASS_NUMBER_COUNT} elementos, todos radioativos e sem composição
            isotópica característica na natureza): em vez da massa atômica média, mostra-se entre colchetes o número de massa do isótopo de
            vida mais longa, escolhido entre os candidatos listados pelo CIAAW (compilação da NUBASE2020). Quando há outros candidatos
            próximos, eles são citados na ficha. Bismuto, tório, protactínio e urânio também não têm isótopos estáveis, mas têm peso atômico
            padrão.
          </li>
          <li>
            <strong>Isótopos, meias-vidas e decaimentos:</strong> avaliação NUBASE2020; <strong>abundâncias isotópicas:</strong> NIST.
          </li>
          <li>
            <strong>Propriedades físico-químicas</strong> (densidade, fusão, ebulição, eletronegatividade, raios, ionização, configuração
            eletrônica): PubChem (NIH), que reúne dados do NIST, do Los Alamos National Laboratory, do Jefferson Lab e da IUPAC. Valores
            ausentes aparecem como &quot;não disponível&quot; — nunca são estimados por este projeto.
          </li>
          <li>
            <strong>Elementos superpesados:</strong> para {PREDICTED_STATE_COUNT} elementos nunca obtidos em quantidade visível, o estado físico
            e várias propriedades são <em>previsões teóricas</em> e aparecem marcados como tal.
          </li>
          <li>
            <strong>Descobertas:</strong> textos escritos em português a partir do LANL, do Jefferson Lab (via PubChem), do CIAAW e dos
            relatórios IUPAC/IUPAP. Quando as fontes divergem sobre quem descobriu ou quando, a divergência é explicada na ficha (
            {DISPUTED_COUNT} elementos têm disputas registradas) em vez de ser escolhida em silêncio.
          </li>
          <li>
            <strong>Nomes em português:</strong> Sociedade Brasileira de Química (2022). Grafias alternativas comuns (como &quot;cromo&quot;,
            &quot;criptônio&quot; e &quot;netúnio&quot;) são aceitas na busca.
          </li>
          <li>
            O site <em>It&apos;s Elemental</em>, do Jefferson Lab, foi desativado; os seus textos são lidos nas páginas dos elementos no
            PubChem, que os preserva.
          </li>
          <li>
            <strong>Validação automática:</strong> testes conferem os 118 elementos (números atômicos, símbolos e posições únicos,
            configurações eletrônicas que somam Z elétrons, coerência entre radioatividade e isótopos, conteúdo completo) e um script verifica
            se todos os links respondem.
          </li>
          <li>Dados obtidos das fontes em outubro de 2026.</li>
        </ul>
        <div className="info-box src-each">
          <p>
            <strong>Em cada ficha:</strong> além das {BASE_ELEMENT_SOURCES.length} fontes gerais (CIAAW, NUBASE2020, NIST, PubChem, LANL,
            Jefferson Lab, IUPAC e SBQ), há links diretos para a página do elemento no CIAAW, no LANL, no NIST e no PubChem, e as fontes
            específicas da descoberta, quando existem.
          </p>
        </div>
      </section>

      {KIND_ORDER.map((kind) => {
        const list = SOURCES.filter((s) => s.kind === kind);
        if (list.length === 0) return null;
        const id = `src-kind-${kind}`;
        return (
          <section key={kind} className="panel-section" aria-labelledby={id}>
            <h3 className="section-title" id={id}>
              {KIND_LABELS[kind].title} <span className="src-count">({list.length})</span>
            </h3>
            <p className="small muted src-kind-desc">{KIND_LABELS[kind].description}</p>
            <ul className="src-list">
              {list.map((s) => (
                <SourceItem key={s.id} source={s} />
              ))}
            </ul>
          </section>
        );
      })}

      <section className="panel-section" aria-labelledby="src-history">
        <h3 className="section-title" id="src-history">
          História da Tabela Periódica
        </h3>
        <p className="small muted">As fontes da seção de história (Lavoisier, Mendeleev, Moseley, Seaborg…) estão listadas no fim dela.</p>
        <button type="button" className="btn btn-sm" onClick={() => dispatch({ type: 'setPanel', panel: 'history' })}>
          <Icon name="book" size={16} />
          Abrir a História da Tabela Periódica
        </button>
      </section>
    </div>
  );
}
