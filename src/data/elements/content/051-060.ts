import type { ElementContent } from '../../types';

/** Conteúdo educativo — elementos 51 a 60. */
export const CONTENT_051_060: ElementContent[] = [
  {
    z: 51,
    discoveryStory: [
      'O sulfeto de antimônio (estibina), um mineral negro e brilhante, era usado no Egito antigo como pó para escurecer os olhos (kohl). Um vaso de antimônio quase puro de cerca de 3000 a.C. foi encontrado na Mesopotâmia.',
      'Na Idade Média, alquimistas obtinham o metal aquecendo a estibina com ferro. Em 1540, o italiano Vannoccio Biringuccio descreveu o processo em seu livro de metalurgia, De la pirotechnia.',
      'Em 1707, o químico francês Nicolas Lémery publicou um estudo científico detalhado sobre o antimônio e seus compostos. O elemento já estava, então, bem estabelecido.',
    ],
    nameOrigin: 'Origem incerta; uma explicação popular liga o nome ao grego anti + monos, "nunca sozinho", porque raramente ocorre puro. Também pode vir do árabe al-ithmid.',
    symbolOrigin: 'Sb vem do latim stibium, nome do mineral estibina, usado pelos antigos como cosmético.',
    nature: {
      text: 'Ocorre em mais de 100 minerais, principalmente na estibina (sulfeto de antimônio); às vezes aparece nativo. A China é, de longe, o maior produtor mundial.',
      minerals: ['Estibina (antimonita)', 'Valentinita', 'Antimônio nativo'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'industria', text: 'Trióxido de antimônio como retardante de chama em plásticos, tecidos e eletrônicos — o principal uso.' },
      { area: 'energia', text: 'Ligas de chumbo-antimônio em baterias de automóveis, mais duras e resistentes.' },
      { area: 'eletronica', text: 'Semicondutores e detectores de infravermelho (antimoneto de índio).' },
      { area: 'industria', text: 'Ligas de tipos de imprensa, munições e catalisador na produção do plástico PET.' },
    ],
    hazards: {
      level: 'moderado',
      flags: ['toxico'],
      text: 'O antimônio e muitos de seus compostos são tóxicos, com efeitos parecidos com os do arsênio, porém mais brandos. A estibina (SbH₃) é um gás muito venenoso.',
    },
    curiosities: [
      'Na Idade Média, "pílulas perpétuas" de antimônio eram engolidas como laxante, recuperadas e reutilizadas.',
      'Como a água, o antimônio se expande ao solidificar — uma propriedade útil nas antigas ligas de tipos de imprensa.',
    ],
  },
  {
    z: 52,
    discoveryStory: [
      'Em 1782, Franz-Joseph Müller von Reichenstein, inspetor-chefe de minas da Transilvânia (hoje Romênia), estudava um minério de ouro chamado "ouro branco" ou "ouro paradoxal". Achava que continha antimônio ou bismuto.',
      'Após três anos de testes, Müller concluiu que o minério continha um metal desconhecido, diferente do antimônio. Enviou amostras ao químico sueco Torbern Bergman, que não conseguiu confirmar por falta de material, e a descoberta ficou esquecida.',
      'Em 1789, o húngaro Pál Kitaibel chegou independentemente ao mesmo resultado. Em 1798, Martin Heinrich Klaproth, em Berlim, isolou o elemento, confirmou que era novo — dando crédito a Müller — e o batizou de telúrio.',
    ],
    nameOrigin: 'Do latim Tellus, a deusa romana da Terra.',
    symbolOrigin: 'Te são as duas primeiras letras de tellurium.',
    nature: {
      text: 'É um dos elementos estáveis mais raros da crosta terrestre. Ocorre às vezes nativo e em teluretos de ouro e prata, como a calaverita. Comercialmente é obtido da "lama anódica" do refino eletrolítico do cobre.',
      minerals: ['Calaverita', 'Silvanita', 'Telúrio nativo'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'energia', text: 'Painéis solares de filme fino de telureto de cádmio (CdTe).' },
      { area: 'eletronica', text: 'Dispositivos termoelétricos (telureto de bismuto) que convertem calor em eletricidade ou refrigeram; discos regraváveis.' },
      { area: 'industria', text: 'Adicionado ao aço e ao cobre para facilitar a usinagem; vulcanização da borracha.' },
    ],
    hazards: {
      level: 'moderado',
      flags: ['toxico'],
      text: 'O telúrio e seus compostos são considerados tóxicos. Mesmo exposições pequenas causam o característico "hálito de telúrio", com cheiro de alho, que pode durar semanas.',
    },
    curiosities: [
      'É um dos poucos elementos que formam compostos naturais com o ouro.',
      'Na Austrália, durante a corrida do ouro em Kalgoorlie, minério de calaverita foi usado por engano para pavimentar ruas — até que se percebeu que continha ouro.',
    ],
  },
  {
    z: 53,
    discoveryStory: [
      'No início do século XIX, a França estava em guerra e precisava de salitre (nitrato de potássio) para fabricar pólvora. Bernard Courtois, em Paris, obtinha compostos de sódio e potássio das cinzas de algas marinhas.',
      'Em 1811, ao limpar seus recipientes, Courtois adicionou ácido sulfúrico em excesso às águas-mães das cinzas. Surgiu uma nuvem de vapor violeta que, ao tocar superfícies frias, formou cristais escuros e brilhantes.',
      'Courtois entregou amostras a Charles Desormes, Nicolas Clément, Joseph Louis Gay-Lussac e Humphry Davy. Em 1813–1814, Gay-Lussac e Davy demonstraram que se tratava de um novo elemento, semelhante ao cloro, e Gay-Lussac propôs o nome iode.',
    ],
    nameOrigin: 'Do grego iodes, "violeta", pela cor do vapor.',
    symbolOrigin: 'I é a inicial de iodum/iodine. Antigamente usava-se também "J", do alemão Jod.',
    nature: {
      text: 'Ocorre como iodetos na água do mar e em algas, que o concentram, e como iodatos nos depósitos de salitre do deserto do Atacama, no Chile — a maior fonte mundial — e em salmouras no Japão. É essencial para os hormônios da tireoide.',
      minerals: ['Salitre do Chile (iodatos)', 'Salmouras', 'Algas marinhas'],
      where: ['oceanos', 'crosta', 'organismos'],
    },
    uses: [
      { area: 'alimentos', text: 'Sal iodado: a adição de iodo ao sal previne o bócio e problemas de desenvolvimento.' },
      { area: 'medicina', text: 'Antissépticos (tintura de iodo e povidona-iodo) e contrastes para raios X e tomografia.' },
      { area: 'medicina', text: 'O iodo-131 trata hipertireoidismo e câncer de tireoide; o iodo-123 é usado em exames.' },
      { area: 'industria', text: 'Catalisadores, corantes e telas de cristal líquido (filmes polarizadores).' },
    ],
    hazards: {
      level: 'moderado',
      flags: ['toxico', 'corrosivo'],
      text: 'O iodo sólido e seus vapores irritam a pele, os olhos e as vias respiratórias. Em acidentes nucleares, o iodo-131 radioativo é perigoso porque se concentra na tireoide; comprimidos de iodeto de potássio podem ser distribuídos para protegê-la.',
    },
    curiosities: [
      'O teste do iodo deixa o amido azul-escuro — é a "prova do iodo" das aulas de ciências.',
      'A deficiência de iodo é uma das principais causas evitáveis de deficiência intelectual no mundo.',
    ],
  },
  {
    z: 54,
    discoveryStory: [
      'Em 1898, William Ramsay e Morris Travers, em Londres, já haviam encontrado o kriptônio e o neônio na destilação do ar líquido. Em julho daquele ano, examinaram a fração mais pesada e menos volátil que sobrava depois de evaporar o kriptônio.',
      'Em 12 de julho de 1898, o espectro desse resíduo mostrou belas linhas azuis, diferentes das do kriptônio. Era um quinto gás nobre, muito escasso no ar.',
      'Ramsay o chamou de xenônio, "o estranho". Em 1962, Neil Bartlett, no Canadá, surpreendeu a química ao produzir um composto de xenônio, derrubando a ideia de que os gases nobres eram totalmente inertes.',
    ],
    nameOrigin: 'Do grego xenos, "estranho" ou "estrangeiro".',
    symbolOrigin: 'Xe são as duas primeiras letras de xenon.',
    nature: {
      text: 'É um dos gases mais raros da atmosfera: cerca de 0,087 parte por milhão. Também é liberado em pequenas quantidades por algumas fontes minerais. É obtido como subproduto da destilação fracionada do ar.',
      where: ['atmosfera'],
    },
    uses: [
      { area: 'iluminacao', text: 'Faróis automotivos de xenônio, flashes fotográficos, lâmpadas de projetores de cinema e estroboscópios.' },
      { area: 'aeroespacial', text: 'Propelente de motores iônicos de sondas e satélites, como a Deep Space 1 e a Dawn.' },
      { area: 'medicina', text: 'Anestésico geral (com poucos efeitos colaterais, mas caro) e gás para exames de imagem dos pulmões.' },
      { area: 'eletronica', text: 'Lasers e processos de fabricação de chips.' },
      { area: 'ciencia', text: 'Detectores gigantes de xenônio líquido procuram partículas de matéria escura.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['asfixiante'],
      text: 'Não é tóxico, mas tem efeito anestésico em altas concentrações e pode causar asfixia em ambientes fechados. Alguns compostos de xenônio são oxidantes fortes e explosivos.',
    },
    curiosities: [
      'Respirar xenônio deixa a voz mais grave — o contrário do hélio — porque o som se propaga mais devagar nesse gás denso.',
      'O primeiro composto de gás nobre, o hexafluoroplatinato de xenônio, foi preparado por Neil Bartlett em 1962.',
    ],
  },
  {
    z: 55,
    discoveryStory: [
      'Logo depois de inventarem o espectroscópio de chama, Robert Bunsen e Gustav Kirchhoff começaram a analisar todo tipo de material em busca de linhas desconhecidas.',
      'Em 1860, em Heidelberg, eles evaporaram cerca de 40 toneladas de água mineral de Dürkheim. No espectro do resíduo, viram duas linhas azul-celeste que nenhum elemento conhecido produzia. Foi o primeiro elemento descoberto com o espectroscópio.',
      'Eles conseguiram obter apenas alguns gramas de sais de césio. O metal só foi isolado em 1882 por Carl Setterberg, pela eletrólise de cianeto de césio fundido.',
    ],
    nameOrigin: 'Do latim caesius, "azul-celeste", a cor das linhas espectrais que revelaram o elemento.',
    symbolOrigin: 'Cs são a primeira e a terceira letras de caesium (forma recomendada pela IUPAC; "cesium" é a grafia americana).',
    nature: {
      text: 'É raro e não forma minérios próprios abundantes, exceto a polucita. Uma das maiores jazidas está no lago Bernic, em Manitoba (Canadá). O césio-137 radioativo é produzido na fissão nuclear e foi espalhado no ambiente por testes atômicos e acidentes como Chernobyl e Fukushima.',
      minerals: ['Polucita', 'Lepidolita'],
      where: ['crosta', 'minerais', 'oceanos'],
    },
    uses: [
      { area: 'tecnologia', text: 'Relógios atômicos de césio definem o segundo e sincronizam o GPS, a internet e as redes de telefonia.' },
      { area: 'industria', text: 'Fluidos de perfuração de formiato de césio, muito densos, em poços de petróleo e gás.' },
      { area: 'medicina', text: 'O césio-137 já foi usado em radioterapia e ainda é usado em irradiadores de sangue e na calibração de equipamentos.' },
      { area: 'tecnologia', text: 'Células fotoelétricas e sensores, por liberar elétrons facilmente com a luz.' },
    ],
    hazards: {
      level: 'alto',
      flags: ['reativo', 'inflamavel', 'radioativo'],
      text: 'O césio metálico reage explosivamente com a água e se inflama no ar. O césio estável tem baixa toxicidade, mas o césio-137 é altamente radioativo e perigoso: em 1987, em Goiânia, uma cápsula de radioterapia abandonada foi aberta e causou o maior acidente radiológico do Brasil, com mortes e centenas de pessoas contaminadas.',
    },
    curiosities: [
      'Derrete a 28,5 °C: pode virar líquido em um dia quente.',
      'É o elemento mais eletropositivo estável: perde seu elétron externo com extrema facilidade.',
      'Desde 1967, um segundo é definido como 9.192.631.770 oscilações de uma transição do átomo de césio-133.',
    ],
  },
  {
    z: 56,
    discoveryStory: [
      'No início do século XVII, um sapateiro e alquimista de Bolonha, Vincenzo Casciarolo, encontrou pedras que, depois de aquecidas, brilhavam no escuro. Eram de barita (sulfato de bário), e a "pedra de Bolonha" ficou famosa.',
      'Em 1774, Carl Wilhelm Scheele mostrou que a barita continha uma "terra" nova, diferente da cal (cálcio), e Johan Gottlieb Gahn a isolou no mesmo período. A nova terra foi chamada de barita, por seus compostos serem muito densos.',
      'O metal só foi isolado em 1808 por Humphry Davy, por eletrólise de uma mistura de barita úmida e óxido de mercúrio, no mesmo ano em que obteve o cálcio e o estrôncio.',
    ],
    nameOrigin: 'Do grego barys, "pesado", pela alta densidade da barita.',
    symbolOrigin: 'Ba são as duas primeiras letras de barium.',
    nature: {
      text: 'Nunca ocorre livre. Os principais minerais são a barita (sulfato de bário) e a witherita (carbonato). A barita é extraída em grande escala na China, na Índia e no Marrocos.',
      minerals: ['Barita', 'Witherita'],
      where: ['crosta', 'minerais', 'oceanos'],
    },
    uses: [
      { area: 'industria', text: 'Barita moída torna mais denso o fluido de perfuração de poços de petróleo — o maior uso.' },
      { area: 'medicina', text: 'Sulfato de bário, insolúvel, é usado como contraste em radiografias do esôfago, do estômago e do intestino.' },
      { area: 'tecnologia', text: 'Nitrato de bário dá a cor verde aos fogos de artifício.' },
      { area: 'industria', text: 'Pigmentos brancos, vidros especiais e ímãs de ferrita de bário.' },
    ],
    hazards: {
      level: 'moderado',
      flags: ['toxico', 'reativo'],
      text: 'Compostos solúveis de bário (como cloreto e carbonato) são tóxicos e afetam o coração e os músculos. O sulfato de bário dos exames é seguro justamente por ser insolúvel. O metal reage com a água.',
    },
    curiosities: [
      'O bário foi um dos produtos que Otto Hahn e Fritz Strassmann encontraram em 1938 ao bombardear urânio com nêutrons — a pista que revelou a fissão nuclear.',
      'O supercondutor de alta temperatura YBCO contém bário.',
    ],
  },
  {
    z: 57,
    discoveryStory: [
      'Em 1803 foi descoberto o cério, mas o óxido de cério (céria) parecia esconder outras substâncias. Carl Gustaf Mosander, ex-assistente de Berzelius em Estocolmo, suspeitou disso.',
      'Em 1839, Mosander aqueceu nitrato de cério e tratou o produto com ácido nítrico diluído. Parte do material se dissolveu e continha um óxido novo, que ele chamou de lantana — o elemento "escondido".',
      'Em 1841, Mosander percebeu que a lantana ainda continha outro componente, o "didímio", que mais tarde se revelou uma mistura de praseodímio e neodímio. O lantânio metálico relativamente puro só foi obtido em 1923.',
    ],
    nameOrigin: 'Do grego lanthanein, "estar escondido", porque estava oculto no minério de cério.',
    symbolOrigin: 'La são as duas primeiras letras de lanthanum.',
    nature: {
      text: 'Ocorre junto com os demais lantanídeos em minerais como monazita e bastnasita, que podem conter até 25% a 38% de lantânio. A China domina a produção mundial de terras-raras; o Brasil tem importantes reservas.',
      minerals: ['Monazita', 'Bastnasita', 'Cerita', 'Alanita'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'tecnologia', text: 'Vidros ópticos de alta qualidade para lentes de câmeras e telescópios.' },
      { area: 'energia', text: 'Baterias de níquel-hidreto metálico de carros híbridos contêm vários quilos de lantânio.' },
      { area: 'industria', text: 'Catalisadores no refino de petróleo (craqueamento) e ligas para pedras de isqueiro (mischmetal).' },
      { area: 'medicina', text: 'Carbonato de lantânio reduz o fósforo no sangue de pacientes renais.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'O lantânio e seus compostos têm toxicidade baixa a moderada. O metal se oxida no ar e o pó pode pegar fogo.',
    },
    curiosities: [
      'É o primeiro elemento da série dos lantanídeos e dá nome a ela.',
      'Um carro híbrido pode conter de 10 a 15 kg de lantânio nas baterias.',
    ],
  },
  {
    z: 58,
    discoveryStory: [
      'Em 1751, um mineral pesado foi encontrado em Bastnäs, na Suécia, mas ninguém conseguiu decifrar sua composição.',
      'Em 1803, Jöns Jacob Berzelius e Wilhelm Hisinger, na Suécia, e Martin Heinrich Klaproth, na Alemanha, analisaram independentemente esse mineral (a cerita) e encontraram uma "terra" nova. Berzelius e Hisinger a chamaram de céria, em homenagem ao asteroide Ceres, descoberto em 1801.',
      'Anos depois, Mosander mostrou que a céria também continha lantânio e didímio. O metal cério relativamente puro foi obtido em 1875 por William Hillebrand e Thomas Norton.',
    ],
    nameOrigin: 'Do asteroide (hoje planeta anão) Ceres, descoberto em 1801 e batizado em homenagem à deusa romana da agricultura.',
    symbolOrigin: 'Ce são as duas primeiras letras de cerium.',
    nature: {
      text: 'É a mais abundante das terras-raras, tão comum na crosta quanto o cobre. Ocorre em monazita, bastnasita, alanita e cerita; grandes depósitos de monazita estão em areias de praias da Índia e do Brasil.',
      minerals: ['Bastnasita', 'Monazita', 'Cerita', 'Alanita'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'industria', text: 'Óxido de cério é o principal pó para polir vidros, lentes e telas.' },
      { area: 'transporte', text: 'Conversores catalíticos de automóveis usam óxido de cério para armazenar oxigênio.' },
      { area: 'tecnologia', text: 'Ferrocério (mischmetal) produz faíscas em isqueiros e acendedores.' },
      { area: 'industria', text: 'Catalisadores no refino de petróleo e aditivos que impedem o vidro de escurecer com a radiação.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['inflamavel'],
      text: 'Tem toxicidade baixa. O metal puro pode pegar fogo se arranhado ou aquecido, e o pó é pirofórico.',
    },
    curiosities: [
      'Arranhar o cério metálico com uma faca produz faíscas.',
      'É o único lantanídeo que forma facilmente compostos estáveis no estado de oxidação +4 em solução aquosa.',
    ],
  },
  {
    z: 59,
    discoveryStory: [
      'Em 1841, Mosander separou da lantana um material que chamou de didímio ("gêmeo"), por acompanhar o lantânio tão de perto. Por mais de 40 anos o didímio foi considerado um elemento.',
      'Nas décadas seguintes, espectroscopistas notaram que o espectro do didímio variava conforme a amostra, sugerindo que fosse uma mistura.',
      'Em 1885, o químico austríaco Carl Auer von Welsbach, em Viena, separou o didímio por cristalizações fracionadas repetidas — mais de cem — em duas frações: uma de sais verdes, o praseodímio ("gêmeo verde"), e outra de sais rosados, o neodímio ("gêmeo novo").',
    ],
    nameOrigin: 'Do grego prasios ("verde-alho") + didymos ("gêmeo"): o "gêmeo verde", pela cor de seus sais.',
    symbolOrigin: 'Pr são as duas primeiras letras de praseodymium.',
    nature: {
      text: 'Ocorre com outras terras-raras na monazita e na bastnasita, das quais é separado por troca iônica ou extração por solventes.',
      minerals: ['Monazita', 'Bastnasita'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'tecnologia', text: 'Ímãs permanentes de alto desempenho, junto com o neodímio, em motores elétricos e turbinas eólicas.' },
      { area: 'aeroespacial', text: 'Ligas de magnésio de alta resistência para motores de avião.' },
      { area: 'industria', text: 'Vidros e esmaltes amarelo-esverdeados; óculos de proteção para soldadores e vidreiros (vidro de didímio).' },
      { area: 'iluminacao', text: 'Núcleo de eletrodos de lâmpadas de arco de carbono, usadas em projetores de cinema.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'Tem toxicidade baixa a moderada, como as demais terras-raras. O metal oxida no ar e o pó é inflamável.',
    },
    curiosities: [
      'Seus sais têm uma bela cor verde-clara.',
      'Pequenas quantidades de praseodímio dão a cor amarela de algumas cerâmicas e zircônias.',
    ],
  },
  {
    z: 60,
    discoveryStory: [
      'O neodímio nasceu da mesma separação que revelou o praseodímio. Em 1885, Carl Auer von Welsbach, em Viena, decompôs o "didímio" de Mosander por meio de centenas de cristalizações fracionadas de nitratos duplos de amônio.',
      'Uma das frações formava sais rosa-lilás e mostrava linhas espectrais próprias: Auer a chamou de neodidímio, o "novo gêmeo". O nome foi depois encurtado para neodímio.',
      'Muitos químicos duvidaram no início, mas a separação foi confirmada. O metal relativamente puro só foi obtido em 1925.',
    ],
    nameOrigin: 'Do grego neos ("novo") + didymos ("gêmeo"): o "novo gêmeo".',
    symbolOrigin: 'Nd são a primeira e a terceira letras de neodymium.',
    nature: {
      text: 'É uma das terras-raras mais comuns — mais abundante na crosta que o cobalto ou o chumbo. Ocorre na monazita e na bastnasita.',
      minerals: ['Monazita', 'Bastnasita'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'tecnologia', text: 'Ímãs de neodímio-ferro-boro, os mais fortes do mercado: alto-falantes, fones de ouvido, discos rígidos e motores.' },
      { area: 'energia', text: 'Motores de carros elétricos e geradores de turbinas eólicas.' },
      { area: 'medicina', text: 'Lasers Nd:YAG em cirurgias oftalmológicas, dermatologia e odontologia.' },
      { area: 'industria', text: 'Vidros violetas e filtros; óculos de proteção de soldadores.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'Tem toxicidade baixa a moderada. Ímãs de neodímio fortes podem prender os dedos com força perigosa e são muito perigosos se crianças engolirem mais de um.',
    },
    curiosities: [
      'Um ímã de neodímio pode levantar mais de mil vezes o próprio peso.',
      'O vidro com neodímio muda de cor conforme o tipo de luz que o ilumina.',
    ],
  },
];
