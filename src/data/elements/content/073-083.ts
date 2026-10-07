import type { ElementContent } from '../../types';

/** Conteúdo educativo — elementos 73 a 83. */
export const CONTENT_073_083: ElementContent[] = [
  {
    z: 73,
    discoveryStory: [
      'Em 1802, o químico sueco Anders Gustaf Ekeberg, em Uppsala, analisava minerais de Ytterby e de Kimito (Finlândia). Encontrou um óxido novo que não se dissolvia em nenhum ácido, mesmo em excesso.',
      'Essa "incapacidade de absorver ácido" lembrou-lhe o mito de Tântalo, condenado a ficar na água sem conseguir beber. Daí o nome tântalo.',
      'Em 1809, Wollaston declarou que o tântalo e o colúmbio (nióbio) eram o mesmo elemento. A confusão só terminou em 1866, quando Jean Charles de Marignac provou que eram distintos. Tântalo relativamente puro foi produzido em 1903, por Werner von Bolton.',
    ],
    nameOrigin: 'De Tântalo, personagem da mitologia grega condenado a ficar em um lago com água até o queixo, sem conseguir bebê-la — alusão à resistência do óxido aos ácidos.',
    symbolOrigin: 'Ta são as duas primeiras letras de tantalum.',
    nature: {
      text: 'Ocorre principalmente na tantalita e na columbita-tantalita ("coltan"), muitas vezes junto com o nióbio. Grandes produtores incluem a República Democrática do Congo, Ruanda, Brasil e Austrália.',
      minerals: ['Tantalita', 'Columbita-tantalita (coltan)', 'Microlita'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'eletronica', text: 'Capacitores de tântalo, pequenos e confiáveis, em celulares, computadores e eletrônicos automotivos — o principal uso.' },
      { area: 'medicina', text: 'Implantes, clipes cirúrgicos e próteses, pois não reage com fluidos do corpo.' },
      { area: 'industria', text: 'Equipamentos resistentes à corrosão na indústria química e ferramentas de corte (carbeto de tântalo).' },
      { area: 'aeroespacial', text: 'Superligas para turbinas de avião.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'O tântalo é praticamente inerte e de baixa toxicidade. A mineração de coltan em zonas de conflito é uma questão social e ambiental importante.',
    },
    curiosities: [
      'O tântalo-180m é o único isômero nuclear observacionalmente estável: nunca foi visto decair.',
      'É um dos metais mais resistentes à corrosão — só é atacado pelo ácido fluorídrico e por poucas outras substâncias.',
    ],
  },
  {
    z: 74,
    discoveryStory: [
      'Mineiros alemães chamavam de "wolfram" um mineral que atrapalhava a fundição do estanho: diziam que ele "devorava o estanho como um lobo devora ovelhas".',
      'Em 1781, Carl Wilhelm Scheele estudou um mineral pesado chamado "tungsten" (pedra pesada, em sueco) — hoje scheelita — e obteve dele um ácido novo, o ácido túngstico. Concluiu que continha um elemento desconhecido, mas não conseguiu isolá-lo.',
      'Em 1783, os irmãos espanhóis Juan José e Fausto Elhuyar, em Bergara (País Basco), mostraram que o ácido do mineral wolframita era o mesmo de Scheele e, aquecendo-o com carvão, isolaram pela primeira vez o metal.',
    ],
    nameOrigin: 'Do sueco tung sten, "pedra pesada", nome da scheelita. Em alemão e em espanhol também é chamado de volfrâmio.',
    symbolOrigin: 'W vem de wolfram, nome alemão do mineral wolframita e do elemento.',
    nature: {
      text: 'Os principais minérios são a wolframita e a scheelita. A China produz mais de 80% do tungstênio mundial; Vietnã, Rússia e Brasil também têm jazidas.',
      minerals: ['Wolframita', 'Scheelita'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'industria', text: 'Carbeto de tungstênio, quase tão duro quanto o diamante, em brocas, ferramentas de corte e mineração — o principal uso.' },
      { area: 'iluminacao', text: 'Filamentos das antigas lâmpadas incandescentes e eletrodos de solda TIG.' },
      { area: 'eletronica', text: 'Contatos elétricos e interconexões em chips.' },
      { area: 'medicina', text: 'Blindagem contra radiação e alvos de tubos de raios X.' },
      { area: 'defesa', text: 'Contrapesos e projéteis de alta densidade.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'O tungstênio metálico tem baixa toxicidade. A poeira de carbeto de tungstênio com cobalto, gerada na fabricação de ferramentas, pode causar doença pulmonar.',
    },
    curiosities: [
      'Tem o ponto de fusão mais alto de todos os metais (3.422 °C) e a menor dilatação térmica entre eles.',
      'É quase tão denso quanto o ouro: barras de ouro falsificadas já foram feitas com núcleo de tungstênio.',
    ],
  },
  {
    z: 75,
    discoveryStory: [
      'Mendeleev previu dois elementos abaixo do manganês, os números 43 e 75. Em 1925, os químicos alemães Walter Noddack, Ida Tacke e Otto Berg, em Berlim, procuraram esses elementos em minérios de platina e no mineral columbita.',
      'Eles concentraram as amostras e as analisaram por espectroscopia de raios X — a técnica que identifica os elementos pelo número atômico. Encontraram as linhas do elemento 75 e o chamaram de rênio. (Anunciaram também o elemento 43, "masúrio", que não foi confirmado.)',
      'Em 1928, conseguiram extrair 1 grama de rênio de 660 kg de molibdenita, confirmando a descoberta.',
    ],
    nameOrigin: 'Do latim Rhenus, o rio Reno, na Alemanha — terra natal de Ida Tacke.',
    symbolOrigin: 'Re são as duas primeiras letras de rhenium.',
    nature: {
      text: 'É um dos elementos mais raros da crosta (cerca de 1 parte por bilhão) e não forma minerais próprios comuns. É obtido como subproduto do processamento da molibdenita associada a minérios de cobre, principalmente no Chile. Um raro mineral de rênio (renita) foi encontrado em um vulcão nas Ilhas Curilas.',
      minerals: ['Molibdenita (impureza)', 'Renita'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'aeroespacial', text: 'Superligas de níquel com rênio nas pás de turbinas de motores a jato — cerca de 70% do uso.' },
      { area: 'industria', text: 'Catalisadores de platina-rênio para produzir gasolina de alta octanagem.' },
      { area: 'tecnologia', text: 'Termopares de tungstênio-rênio para medir temperaturas muito altas; filamentos de espectrômetros.' },
      { area: 'medicina', text: 'Isótopos como o rênio-186 e o rênio-188 são usados em terapias contra a dor óssea e o câncer.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'Tem baixa toxicidade conhecida, mas há poucos estudos; deve ser manuseado com cuidado.',
    },
    curiosities: [
      'Tem o terceiro maior ponto de fusão entre os elementos, depois do carbono e do tungstênio.',
      'Foi o último elemento com isótopo estável a ser descoberto.',
    ],
  },
  {
    z: 76,
    discoveryStory: [
      'Ao dissolver platina bruta em água-régia, sempre sobrava um pó negro insolúvel, que muitos químicos achavam ser grafite.',
      'Em 1803, o inglês Smithson Tennant tratou esse resíduo alternadamente com álcalis e ácidos e conseguiu separar dois metais novos. Um deles formava um óxido volátil de cheiro forte e penetrante.',
      'Tennant chamou esse metal de ósmio, por causa do cheiro, e o outro de irídio. Anunciou os dois em 1804 à Royal Society.',
    ],
    nameOrigin: 'Do grego osme, "cheiro", por causa do odor forte do tetróxido de ósmio.',
    symbolOrigin: 'Os são as duas primeiras letras de osmium.',
    nature: {
      text: 'É um dos elementos mais raros da crosta. Ocorre como liga natural com o irídio (osmirídio) em areias platiníferas e é recuperado do refino de minérios de níquel e platina.',
      minerals: ['Osmirídio', 'Iridosmina'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'industria', text: 'Ligas muito duras para pontas de canetas-tinteiro, eixos de instrumentos e contatos elétricos.' },
      { area: 'ciencia', text: 'Tetróxido de ósmio para tingir tecidos em microscopia eletrônica e para revelar impressões digitais.' },
      { area: 'medicina', text: 'Já foi usado em implantes como marca-passos e válvulas cardíacas (ligas com platina).' },
    ],
    hazards: {
      level: 'alto',
      flags: ['toxico'],
      text: 'O metal maciço é inofensivo, mas o pó de ósmio libera lentamente tetróxido de ósmio (OsO₄), extremamente tóxico, que pode danificar olhos, pele e pulmões mesmo em concentrações baixíssimas.',
    },
    curiosities: [
      'Disputa com o irídio o título de elemento mais denso; medições precisas indicam que o ósmio é ligeiramente mais denso.',
      'Um cubo de ósmio de 10 cm de lado pesaria mais de 22 kg.',
    ],
  },
  {
    z: 77,
    discoveryStory: [
      'O mesmo resíduo negro da platina que revelou o ósmio também continha o irídio. Em 1803, Smithson Tennant o separou e notou que seus sais assumiam muitas cores diferentes.',
      'Na França, Hippolyte-Victor Collet-Descotils, Antoine Fourcroy e Louis-Nicolas Vauquelin também estudavam o resíduo e chegaram a observar o novo metal, mas não o caracterizaram tão bem.',
      'Tennant recebeu o crédito por identificar claramente os dois metais — irídio e ósmio — e por batizá-los.',
    ],
    nameOrigin: 'De Íris, a deusa grega do arco-íris, por causa das cores variadas de seus sais.',
    symbolOrigin: 'Ir são as duas primeiras letras de iridium.',
    nature: {
      text: 'É extremamente raro na crosta, mas mais comum em meteoritos. Ocorre com a platina e o ósmio em depósitos aluviais e é obtido do refino de níquel e platina, sobretudo na África do Sul.',
      minerals: ['Osmirídio', 'Minérios de platina'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'industria', text: 'Ligas de platina-irídio em velas de ignição de alto desempenho, cadinhos e eletrodos.' },
      { area: 'medicina', text: 'O irídio-192 é usado em braquiterapia (radioterapia interna) contra vários tipos de câncer.' },
      { area: 'industria', text: 'O irídio-192 também serve para radiografar soldas e peças industriais.' },
      { area: 'energia', text: 'Catalisadores para produzir hidrogênio por eletrólise da água.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'O metal é muito inerte e pouco tóxico. O irídio-192 radioativo exige blindagem e controle rigoroso.',
    },
    curiosities: [
      'O protótipo internacional do quilograma (usado de 1889 a 2019) é um cilindro de platina com 10% de irídio.',
      'Em 1980, Luis e Walter Alvarez encontraram excesso de irídio em rochas de 66 milhões de anos e propuseram que um asteroide extinguiu os dinossauros.',
      'É o metal mais resistente à corrosão conhecido.',
    ],
  },
  {
    z: 78,
    discoveryStory: [
      'Povos pré-colombianos da região de Esmeraldas (Equador) e da Colômbia já trabalhavam a platina, misturando-a com ouro. Os conquistadores espanhóis a chamaram de "platina" ("pequena prata") e a viam como uma impureza que atrapalhava a mineração de ouro.',
      'Em 1735, o cientista e oficial naval espanhol Antonio de Ulloa, em uma expedição à América do Sul, observou o metal em Nova Granada e o descreveu em seu relato publicado em 1748. Em 1741, Charles Wood levou amostras da Jamaica para a Inglaterra.',
      'Na década de 1750, William Watson, William Brownrigg e o sueco Henrik Scheffer estudaram o metal e o reconheceram como um elemento novo. Scheffer o chamou de "ouro branco".',
    ],
    nameOrigin: 'Do espanhol platina, diminutivo de plata ("prata"): "pequena prata".',
    symbolOrigin: 'Pt são a primeira e a quarta letras de platinum (P já era o fósforo).',
    nature: {
      text: 'Ocorre nativa (às vezes em pepitas), em areias aluviais dos Urais e da Colômbia, e em minérios de níquel e cobre. A África do Sul (Complexo de Bushveld) produz cerca de 70% da platina mundial.',
      minerals: ['Platina nativa', 'Sperrylita', 'Cooperita'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'transporte', text: 'Conversores catalíticos de veículos a diesel e gasolina.' },
      { area: 'joias', text: 'Joias e alianças, por ser durável e não escurecer.' },
      { area: 'medicina', text: 'Medicamentos contra o câncer como a cisplatina; eletrodos de marca-passos.' },
      { area: 'energia', text: 'Catalisador de células a combustível de hidrogênio.' },
      { area: 'industria', text: 'Catalisadores no refino de petróleo e na produção de ácido nítrico; termômetros de resistência.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'A platina metálica é inerte e não tóxica. Alguns sais de platina podem causar alergias respiratórias e de pele em trabalhadores expostos.',
    },
    curiosities: [
      'Todo o metal de platina já extraído na história caberia em uma sala de estar comum.',
      'A cisplatina, descoberta por acaso em 1965, tornou-se um dos quimioterápicos mais importantes.',
    ],
  },
  {
    z: 79,
    discoveryStory: [
      'O ouro é conhecido há mais de 6 mil anos. Como aparece puro na natureza, em pepitas e em areias de rios, foi um dos primeiros metais a chamar a atenção humana. As joias de ouro mais antigas conhecidas, da necrópole de Varna (Bulgária), têm cerca de 6.500 anos.',
      'Egípcios, mesopotâmios e povos das Américas dominaram técnicas de trabalhar o ouro. As primeiras moedas de ouro surgiram na Lídia (atual Turquia), por volta de 600 a.C.',
      'Durante séculos, os alquimistas tentaram transformar outros metais em ouro. Só no século XX a física nuclear mostrou que isso é possível — mas apenas em quantidades minúsculas e a um custo muito maior que o próprio ouro.',
    ],
    nameOrigin: 'Do latim aurum, ligado a aurora ("brilho do amanhecer"). O português "ouro" vem diretamente do latim.',
    symbolOrigin: 'Au vem do latim aurum.',
    nature: {
      text: 'Ocorre nativo em veios de quartzo e em depósitos aluviais, muitas vezes ligado à prata. Também aparece em teluretos. China, Austrália e Rússia são grandes produtores; o Brasil tem uma longa história de mineração de ouro. Há cerca de 1 mg de ouro dissolvido em cada tonelada de água do mar.',
      minerals: ['Ouro nativo', 'Electrum', 'Calaverita', 'Silvanita'],
      where: ['crosta', 'oceanos', 'minerais'],
    },
    uses: [
      { area: 'joias', text: 'Joias e reservas financeiras de bancos centrais.' },
      { area: 'eletronica', text: 'Contatos e conectores que não oxidam, em celulares, computadores e satélites.' },
      { area: 'aeroespacial', text: 'Películas de ouro refletem calor e radiação em satélites, capacetes de astronautas e no telescópio James Webb.' },
      { area: 'medicina', text: 'Odontologia; nanopartículas de ouro em testes rápidos de diagnóstico.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['ambiental'],
      text: 'O ouro metálico é inerte e não tóxico. A mineração de ouro, porém, pode causar graves danos ambientais — especialmente o garimpo ilegal que usa mercúrio e contamina rios e populações, como na Amazônia.',
    },
    curiosities: [
      'É o metal mais maleável: 1 grama pode ser batido em uma folha de cerca de 1 m².',
      'Grande parte do ouro do Universo pode ter se formado em colisões de estrelas de nêutrons.',
    ],
  },
  {
    z: 80,
    discoveryStory: [
      'O mercúrio é conhecido desde a Antiguidade: foi encontrado em túmulos egípcios de cerca de 1500 a.C. Chineses e hindus também o conheciam. Ele é obtido simplesmente aquecendo o mineral vermelho cinábrio (sulfeto de mercúrio), que libera o metal como vapor.',
      'Os alquimistas o consideravam essencial: acreditavam que todos os metais eram formados de mercúrio e enxofre. O mercúrio dissolve ouro e prata, formando amálgamas, o que alimentava a ideia de transmutação.',
      'O primeiro imperador da China, Qin Shi Huang, teria morrido por ingerir pílulas de mercúrio que acreditava trazer a imortalidade.',
    ],
    nameOrigin: 'Do deus romano Mercúrio, o mensageiro veloz, por causa da mobilidade do metal líquido — e também do planeta, associado ao metal pelos alquimistas.',
    symbolOrigin: 'Hg vem do latim hydrargyrum, do grego hydrargyros, "prata líquida".',
    nature: {
      text: 'O principal minério é o cinábrio. Ocorre raramente em gotas nativas. Historicamente, as maiores minas foram as de Almadén (Espanha) e Idrija (Eslovênia). É liberado no ambiente por vulcões, pela queima de carvão e pelo garimpo de ouro.',
      minerals: ['Cinábrio', 'Mercúrio nativo'],
      where: ['crosta', 'minerais', 'oceanos'],
    },
    uses: [
      { area: 'iluminacao', text: 'Lâmpadas fluorescentes e de vapor de mercúrio (em substituição por LEDs).' },
      { area: 'ciencia', text: 'Termômetros, barômetros e manômetros históricos — hoje proibidos em muitos países.' },
      { area: 'industria', text: 'Uso histórico na produção de cloro e soda cáustica e em amálgamas dentárias, em redução global.' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['toxico', 'ambiental'],
      text: 'O vapor de mercúrio e o metilmercúrio são muito tóxicos e atacam o sistema nervoso. O metilmercúrio se acumula em peixes ao longo da cadeia alimentar. A Convenção de Minamata (2013) busca eliminar usos do mercúrio. Um termômetro quebrado deve ser limpo sem aspirador e com ventilação.',
    },
    curiosities: [
      'É o único metal líquido à temperatura ambiente; solidifica a −38,8 °C.',
      'A expressão "louco como um chapeleiro" vem do envenenamento por mercúrio de fabricantes de chapéus de feltro no século XIX.',
      'A doença de Minamata, no Japão (anos 1950), foi causada por metilmercúrio despejado no mar por uma fábrica.',
    ],
  },
  {
    z: 81,
    discoveryStory: [
      'Em 1861, o químico inglês William Crookes recebeu resíduos de uma fábrica de ácido sulfúrico. Depois de remover o selênio, procurava telúrio examinando a amostra no espectroscópio recém-inventado por Bunsen e Kirchhoff.',
      'Em vez das linhas do telúrio, viu uma linha verde brilhante que ninguém tinha visto antes. Concluiu que se tratava de um elemento novo e o chamou de tálio, pela cor da linha.',
      'Em 1862, o francês Claude-Auguste Lamy, trabalhando independentemente, isolou uma quantidade maior do metal e estudou suas propriedades. Seguiu-se uma disputa de prioridade, mas Crookes manteve o crédito pela descoberta.',
    ],
    nameOrigin: 'Do grego thallos, "broto verde" ou "ramo novo", pela linha verde do espectro.',
    symbolOrigin: 'Tl são a primeira e a terceira letras de thallium (T não é usado sozinho como símbolo).',
    nature: {
      text: 'É raro e disperso. Ocorre em minerais raros como crookesita, lorandita e hutchinsonita e em traços em sulfetos (pirita, galena, esfalerita). É obtido como subproduto da ustulação desses minérios.',
      minerals: ['Lorandita', 'Crookesita', 'Hutchinsonita', 'Pirita (traços)'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'medicina', text: 'O tálio-201 é usado em cintilografias para avaliar o fluxo de sangue no coração.' },
      { area: 'eletronica', text: 'Componentes eletrônicos, detectores de infravermelho e vidros de baixo ponto de fusão.' },
      { area: 'ciencia', text: 'Cristais de iodeto de sódio dopado com tálio detectam radiação gama.' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['toxico'],
      text: 'O tálio e seus compostos são extremamente tóxicos, mesmo em pequenas doses; podem ser absorvidos pela pele. O sulfato de tálio, sem cheiro nem sabor, foi usado como veneno de rato e em envenenamentos criminosos, e hoje é proibido em muitos países.',
    },
    curiosities: [
      'O envenenamento por tálio causa queda de cabelo característica.',
      'Agatha Christie descreveu os sintomas da intoxicação por tálio no romance "O Cavalo Amarelo" (1961), com tanta precisão que ajudou a salvar uma pessoa na vida real.',
    ],
  },
  {
    z: 82,
    discoveryStory: [
      'O chumbo é um dos metais mais antigos usados pelos humanos: contas de chumbo de mais de 8 mil anos foram encontradas na Anatólia. Ele é fácil de extrair aquecendo a galena (sulfeto de chumbo) em uma fogueira.',
      'Os romanos usaram chumbo em larga escala — produziam dezenas de milhares de toneladas por ano — em canos de água, recipientes, moedas e até para adoçar o vinho (acetato de chumbo, o "açúcar de chumbo").',
      'O chumbo também era subproduto da extração da prata, e os alquimistas o associavam ao planeta Saturno. Não há um descobridor conhecido.',
    ],
    nameOrigin: 'Do latim plumbum. O português "chumbo" vem dessa mesma palavra latina.',
    symbolOrigin: 'Pb vem do latim plumbum.',
    nature: {
      text: 'O principal minério é a galena (sulfeto de chumbo), frequentemente associada à prata e ao zinco. Outros minerais são a cerussita e a anglesita. É o produto final estável de três cadeias naturais de decaimento radioativo (do urânio-238, do urânio-235 e do tório-232).',
      minerals: ['Galena', 'Cerussita', 'Anglesita'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'energia', text: 'Baterias de chumbo-ácido de carros e no-breaks — o principal uso, com altíssima taxa de reciclagem.' },
      { area: 'medicina', text: 'Blindagem contra raios X e radiação gama (aventais, paredes de salas de radiologia).' },
      { area: 'industria', text: 'Lastros, pesos, cabos submarinos e soldas (estas, hoje, em grande parte substituídas).' },
      { area: 'ciencia', text: 'Datação de rochas pelos métodos urânio-chumbo.' },
    ],
    hazards: {
      level: 'alto',
      flags: ['toxico', 'ambiental'],
      text: 'O chumbo é um veneno cumulativo: afeta o sistema nervoso, especialmente o desenvolvimento cerebral de crianças, além dos rins e do sangue. Não existe nível seguro de exposição conhecido. Foi banido da gasolina e das tintas domésticas em muitos países.',
    },
    curiosities: [
      'A retirada do chumbo da gasolina, completada no mundo em 2021, é considerada uma das maiores vitórias de saúde pública.',
      'O chumbo-208 é o núcleo estável mais pesado conhecido.',
    ],
  },
  {
    z: 83,
    discoveryStory: [
      'O bismuto era conhecido desde o século XV: mineiros alemães o encontravam junto a minérios de prata e o usavam em ligas e na impressão de tipos. Porém, era confundido com o chumbo e com o estanho.',
      'Em 1546, Georgius Agricola o descreveu como um metal distinto, mas a ideia não se firmou.',
      'Em 1753, o químico francês Claude François Geoffroy, o Jovem, estudou sistematicamente o metal e demonstrou que era um elemento diferente do chumbo e do estanho.',
    ],
    nameOrigin: 'Provavelmente do alemão antigo wismuth ou weisse Masse ("massa branca"), possivelmente ligado ao lugar onde era minerado.',
    symbolOrigin: 'Bi são as duas primeiras letras de bismuthum.',
    nature: {
      text: 'Ocorre às vezes nativo e nos minerais bismutinita e bismita. A maior parte é obtida como subproduto do refino de chumbo, cobre e estanho; a China é o maior produtor.',
      minerals: ['Bismutinita', 'Bismita', 'Bismuto nativo'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'medicina', text: 'Subsalicilato de bismuto em remédios contra azia e diarreia; compostos de bismuto contra a bactéria H. pylori.' },
      { area: 'industria', text: 'Ligas de baixo ponto de fusão em sprinklers de incêndio, fusíveis e soldas sem chumbo.' },
      { area: 'industria', text: 'Pigmentos e cosméticos (oxicloreto de bismuto, de brilho perolado).' },
      { area: 'eletronica', text: 'Telureto de bismuto em dispositivos termoelétricos.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'É um dos metais pesados menos tóxicos, por isso substitui o chumbo em muitas aplicações. Sua radioatividade é tão fraca que não representa risco prático.',
    },
    curiosities: [
      'Cristais de bismuto formam belas estruturas em "escada" com cores iridescentes, causadas por uma fina camada de óxido.',
      'Em 2003, mediu-se que seu único isótopo natural, o bismuto-209, é radioativo — com meia-vida mais de um bilhão de vezes maior que a idade do Universo.',
    ],
  },
];
