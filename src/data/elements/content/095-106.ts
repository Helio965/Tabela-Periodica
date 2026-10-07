import type { ElementContent } from '../../types';

/** Conteúdo educativo — elementos 95 a 106. */
export const CONTENT_095_106: ElementContent[] = [
  {
    z: 95,
    discoveryStory: [
      'Durante a Segunda Guerra Mundial, a equipe de Glenn Seaborg no Laboratório Metalúrgico da Universidade de Chicago tentava produzir os elementos 95 e 96. As primeiras tentativas falharam porque se esperava que eles se comportassem quimicamente como o plutônio.',
      'Seaborg propôs então que os elementos a partir do actínio formavam uma nova série, os actinídeos, parecida com a dos lantanídeos. Com essa ideia, os elementos 95 e 96 deveriam se parecer com as terras-raras.',
      'No fim de 1944, Seaborg, Ralph James, Leon Morgan e Albert Ghiorso irradiaram plutônio-239 com nêutrons em um reator. O plutônio capturou nêutrons em sequência até virar plutônio-241, que decaiu em amerício-241. Com a nova hipótese, conseguiram separá-lo quimicamente.',
    ],
    nameOrigin: 'Das Américas, por analogia com o európio, seu "parente" lantanídeo logo acima na tabela, batizado em homenagem à Europa.',
    symbolOrigin: 'Am são as duas primeiras letras de americium.',
    nature: {
      text: 'Não existe na natureza em quantidades detectáveis. É produzido em reatores nucleares, onde se forma no combustível a partir do plutônio. Pode ser obtido em quilogramas.',
      where: ['apenas-laboratorio'],
    },
    uses: [
      { area: 'tecnologia', text: 'Detectores de fumaça iônicos: uma pequena quantidade de amerício-241 ioniza o ar, e a fumaça interrompe a corrente elétrica.' },
      { area: 'industria', text: 'Medidores de espessura e de densidade; fontes de nêutrons (com berílio) para prospecção de petróleo.' },
      { area: 'aeroespacial', text: 'O amerício-241 é estudado como fonte de energia para sondas espaciais europeias.' },
    ],
    hazards: {
      level: 'alto',
      flags: ['radioativo'],
      text: 'É radioativo e perigoso se inalado ou ingerido, pois se acumula nos ossos e no fígado. A quantidade em um detector de fumaça é minúscula e fica selada, sem risco no uso normal; o aparelho não deve ser desmontado e deve ser descartado corretamente.',
    },
    curiosities: [
      'Sua existência foi revelada ao público em um programa de rádio infantil, em 1945, antes do anúncio oficial.',
      'Um detector de fumaça típico contém menos de um milionésimo de grama de amerício.',
    ],
    extraSources: ['seaborg-actinides'],
  },
  {
    z: 96,
    discoveryStory: [
      'O cúrio foi, na verdade, o terceiro elemento transurânico descoberto, antes do amerício. Em julho de 1944, a equipe de Seaborg bombardeou plutônio-239 com partículas alfa (núcleos de hélio) no cíclotron de 60 polegadas de Berkeley.',
      'O material foi levado ao Laboratório Metalúrgico de Chicago, onde Seaborg, Ralph James e Albert Ghiorso identificaram um novo emissor alfa: o cúrio-242, com meia-vida de cerca de 160 dias.',
      'A separação só foi possível graças à hipótese dos actinídeos, que previa que o elemento 96 se comportaria como o gadolínio. Em 1947, foi obtida a primeira quantidade visível de um composto de cúrio.',
    ],
    nameOrigin: 'Em homenagem a Marie e Pierre Curie, pioneiros da radioatividade — por analogia com o gadolínio, que homenageia Johan Gadolin.',
    symbolOrigin: 'Cm são as duas primeiras consoantes de curium (Cu já era o cobre).',
    nature: {
      text: 'Não existe naturalmente na Terra em quantidades detectáveis. É produzido em reatores nucleares, em pequenas quantidades, a partir de plutônio e amerício.',
      where: ['apenas-laboratorio'],
    },
    uses: [
      { area: 'aeroespacial', text: 'O cúrio-244 é a fonte de partículas alfa dos espectrômetros de raios X (APXS) dos jipes-robôs de Marte, que analisam a composição das rochas.' },
      { area: 'ciencia', text: 'Alvo para produzir elementos mais pesados, como o livermório.' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['radioativo'],
      text: 'É intensamente radioativo e se acumula nos ossos, no fígado e nos pulmões. Só é manuseado em instalações especializadas.',
    },
    curiosities: [
      'Brilha com uma luz roxa no escuro.',
      'Marie Curie é uma das duas mulheres homenageadas no nome de um elemento; a outra é Lise Meitner (meitnério).',
    ],
    extraSources: ['seaborg-actinides'],
  },
  {
    z: 97,
    discoveryStory: [
      'Em dezembro de 1949, em Berkeley, Stanley Thompson, Albert Ghiorso e Glenn Seaborg bombardearam alguns miligramas de amerício-241 com partículas alfa aceleradas no cíclotron de 60 polegadas.',
      'Após dissolver o alvo, usaram uma coluna de troca iônica para separar os elementos. Uma nova atividade radioativa apareceu exatamente onde a teoria dos actinídeos previa que o elemento 97 sairia — logo antes do cúrio.',
      'Era o berkélio-243. A primeira quantidade visível de um composto de berkélio (cloreto) só foi obtida em 1962 e pesava cerca de três bilionésimos de grama.',
    ],
    nameOrigin: 'De Berkeley, cidade da Califórnia onde foi descoberto — por analogia com o térbio, seu "parente" lantanídeo, batizado em homenagem à vila de Ytterby.',
    symbolOrigin: 'Bk são a primeira e a quarta letras de berkelium (B e Be já estavam em uso).',
    nature: {
      text: 'É exclusivamente sintético. É produzido em quantidades de miligramas em reatores de altíssimo fluxo de nêutrons, como o HFIR, em Oak Ridge (EUA).',
      where: ['apenas-laboratorio'],
    },
    uses: [
      { area: 'ciencia', text: 'Alvo para a síntese de elementos superpesados: um alvo de berkélio-249 permitiu criar o tenesso (117).' },
      { area: 'ciencia', text: 'Pesquisa sobre a química dos actinídeos.' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['radioativo'],
      text: 'É radioativo e só existe em quantidades mínimas em laboratórios autorizados. Se absorvido, acumula-se nos ossos.',
    },
    curiosities: [
      'Para produzir o tenesso, 22 miligramas de berkélio foram fabricados nos EUA e enviados de avião à Rússia — e o alvo tinha de ser usado rapidamente, pois o berkélio-249 tem meia-vida de 330 dias.',
      'Assim como seu "parente" lantanídeo, o térbio, tem o nome ligado a um lugar.',
    ],
    extraSources: ['seaborg-actinides'],
  },
  {
    z: 98,
    discoveryStory: [
      'Em fevereiro de 1950, em Berkeley, Stanley Thompson, Kenneth Street Jr., Albert Ghiorso e Glenn Seaborg bombardearam alguns microgramas de cúrio-242 com partículas alfa no cíclotron.',
      'Eles produziram apenas cerca de 5 mil átomos do novo elemento, o califórnio-245, com meia-vida de 44 minutos. Mesmo assim, conseguiram identificá-lo pela posição em que saía na coluna de troca iônica, como previa a analogia com o disprósio.',
      'O califórnio foi o sexto elemento transurânico descoberto.',
    ],
    nameOrigin: 'Do estado e da Universidade da Califórnia, onde foi descoberto.',
    symbolOrigin: 'Cf são a primeira e a quinta letras de californium (Ca já era o cálcio).',
    nature: {
      text: 'É sintético. É produzido em reatores de alto fluxo de nêutrons, em quantidades de miligramas por ano.',
      where: ['apenas-laboratorio'],
    },
    uses: [
      { area: 'energia', text: 'O califórnio-252 é uma fonte portátil e intensa de nêutrons: dá a partida em reatores nucleares.' },
      { area: 'industria', text: 'Prospecção de petróleo e de minérios (ouro e prata) e inspeção de soldas e peças por radiografia com nêutrons.' },
      { area: 'medicina', text: 'Braquiterapia com nêutrons contra certos tumores.' },
      { area: 'ciencia', text: 'Alvo para a síntese do oganessônio (118).' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['radioativo'],
      text: 'É intensamente radioativo; o califórnio-252 emite muitos nêutrons e exige blindagem espessa. Se absorvido, acumula-se nos ossos.',
    },
    curiosities: [
      'Um único micrograma de califórnio-252 emite mais de 2 milhões de nêutrons por segundo.',
      'É um dos elementos mais caros do mundo, com preço estimado em dezenas de milhões de dólares por grama.',
    ],
    extraSources: ['seaborg-actinides'],
  },
  {
    z: 99,
    discoveryStory: [
      'Em 1º de novembro de 1952, os EUA detonaram "Ivy Mike", a primeira bomba de hidrogênio, no atol de Enewetak, no Pacífico. Aviões não tripulados atravessaram a nuvem e coletaram poeira em filtros.',
      'Albert Ghiorso e colegas de Berkeley, Argonne e Los Alamos analisaram esses filtros e o coral do atol. Encontraram isótopos que só poderiam ter se formado se núcleos de urânio-238 tivessem capturado até 15 nêutrons em uma fração de segundo, seguidos de vários decaimentos beta.',
      'Entre os produtos estava o elemento 99, identificado como einstênio-253. A descoberta foi mantida em segredo militar até 1955.',
    ],
    nameOrigin: 'Em homenagem a Albert Einstein, que morreu em 1955, pouco antes da divulgação do nome.',
    symbolOrigin: 'Es são as duas primeiras letras de einsteinium. No início, chegou a ser usado apenas "E".',
    nature: {
      text: 'É sintético. Hoje é produzido em reatores de alto fluxo por uma longa cadeia de capturas de nêutrons, em quantidades de microgramas a miligramas.',
      where: ['apenas-laboratorio'],
    },
    uses: [
      { area: 'ciencia', text: 'Usado apenas em pesquisa básica; o einstênio-253 serviu de alvo para produzir o mendelévio.' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['radioativo'],
      text: 'É intensamente radioativo. Só existe em quantidades mínimas em laboratórios especializados.',
    },
    curiosities: [
      'Em 2021, pesquisadores conseguiram estudar a química do einstênio com uma amostra de pouco mais de 200 nanogramas.',
      'Amostras de einstênio se danificam rapidamente pela própria radiação.',
    ],
  },
  {
    z: 100,
    discoveryStory: [
      'O férmio foi encontrado nos mesmos detritos da explosão termonuclear "Ivy Mike", de 1952, que revelaram o einstênio.',
      'A equipe de Albert Ghiorso identificou o isótopo férmio-255, formado quando núcleos de urânio-238 capturaram 17 nêutrons e depois sofreram oito decaimentos beta. A intensidade de nêutrons da explosão foi tão grande que permitiu essas capturas em sequência.',
      'Como no caso do einstênio, a descoberta foi mantida em segredo até 1955. Paralelamente, equipes na Suécia produziram o elemento 100 com íons de oxigênio, sem saber do trabalho americano.',
    ],
    nameOrigin: 'Em homenagem ao físico italiano Enrico Fermi, pioneiro dos reatores nucleares.',
    symbolOrigin: 'Fm são a primeira e a quarta letras de fermium (F e Fe já existiam).',
    nature: {
      text: 'É sintético. Pode ser produzido em reatores por captura de nêutrons, mas só em quantidades de picogramas a nanogramas.',
      where: ['apenas-laboratorio'],
    },
    uses: [
      { area: 'ciencia', text: 'Apenas pesquisa básica.' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['radioativo'],
      text: 'É intensamente radioativo e só existe em quantidades ínfimas.',
    },
    curiosities: [
      'É o elemento mais pesado que pode ser produzido em reatores pela captura de nêutrons; os seguintes exigem aceleradores de partículas.',
      'Nenhuma amostra de férmio puro visível a olho nu jamais foi preparada.',
    ],
  },
  {
    z: 101,
    discoveryStory: [
      'Em 1955, a equipe de Berkeley — Albert Ghiorso, Bernard Harvey, Gregory Choppin, Stanley Thompson e Glenn Seaborg — tinha uma quantidade minúscula de einstênio-253: cerca de um bilhão de átomos.',
      'Eles bombardearam esse alvo com partículas alfa no cíclotron de 60 polegadas. Estimaram que, a cada experimento, produziriam no máximo um átomo do elemento 101. Para detectá-lo, usaram uma técnica de recuo e uma separação química muito rápida.',
      'Ao longo de vários experimentos, identificaram 17 átomos do mendelévio-256. Foi a primeira vez que um elemento foi descoberto e identificado "átomo por átomo".',
    ],
    nameOrigin: 'Em homenagem a Dmitri Mendeleev, criador da tabela periódica. O nome foi escolhido em plena Guerra Fria, homenageando um cientista russo.',
    symbolOrigin: 'Md são a primeira e a terceira letras de mendelevium. O primeiro símbolo proposto foi Mv.',
    nature: {
      text: 'É sintético e só pode ser produzido em aceleradores de partículas, poucos átomos por vez.',
      where: ['apenas-laboratorio'],
    },
    uses: [
      { area: 'ciencia', text: 'Apenas pesquisa básica sobre propriedades nucleares e químicas.' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['radioativo'],
      text: 'É radioativo e existe só em quantidades de poucos átomos.',
    },
    curiosities: [
      'O primeiro átomo foi detectado à noite, e a equipe tocou um alarme de incêndio modificado a cada decaimento — até os bombeiros pedirem para parar.',
      'Em plena Guerra Fria, Seaborg precisou da aprovação do governo dos EUA para homenagear um cientista russo.',
    ],
    extraSources: ['iupac-twg-1993', 'iupac-names-1997'],
  },
  {
    z: 102,
    discoveryStory: [
      'Em 1957, uma equipe internacional no Instituto Nobel de Física, em Estocolmo, anunciou o elemento 102, produzido bombardeando cúrio com íons de carbono-13, e propôs o nome nobélio. Mas ninguém conseguiu reproduzir o resultado.',
      'Em 1958, Albert Ghiorso e colegas, em Berkeley, relataram um isótopo do elemento 102 usando uma técnica de "duplo recuo", mas a identificação do isótopo também se mostrou incorreta.',
      'Entre 1963 e 1966, a equipe de Georgy Flerov no Instituto Unificado de Pesquisas Nucleares (JINR), em Dubna, produziu e identificou corretamente vários isótopos do elemento 102. Em 1992–1993, a IUPAC reconheceu Dubna como descobridora, mas manteve o nome nobélio, já consagrado.',
    ],
    nameOrigin: 'Em homenagem a Alfred Nobel, inventor da dinamite e criador do Prêmio Nobel.',
    symbolOrigin: 'No são as duas primeiras letras de nobelium. Não confundir com "NO", o monóxido de nitrogênio.',
    nature: {
      text: 'É sintético e só pode ser produzido em aceleradores, poucos átomos por vez.',
      where: ['apenas-laboratorio'],
    },
    uses: [
      { area: 'ciencia', text: 'Apenas pesquisa básica.' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['radioativo'],
      text: 'É radioativo e existe apenas em quantidades de poucos átomos.',
    },
    curiosities: [
      'Ao contrário da maioria dos actinídeos, seu estado de oxidação mais estável em solução é +2.',
      'Teve três anúncios de descoberta por três países diferentes antes da decisão final.',
    ],
    extraSources: ['iupac-twg-1993', 'iupac-names-1997'],
  },
  {
    z: 103,
    discoveryStory: [
      'Em março de 1961, em Berkeley, Albert Ghiorso, Torbjørn Sikkeland, Almon Larsh e Robert Latimer bombardearam um alvo de cerca de 3 microgramas de califórnio com íons de boro-10 e boro-11 em um acelerador linear de íons pesados.',
      'Os núcleos produzidos foram arrastados por gás hélio até uma fita de cobre, que os levava diante de detectores. Observaram um emissor alfa com meia-vida de cerca de 8 segundos e o atribuíram ao elemento 103.',
      'A equipe de Flerov, em Dubna, contestou parte das atribuições e realizou seus próprios experimentos em 1965–1967. A IUPAC decidiu, em 1993, que o crédito deveria ser compartilhado entre os dois laboratórios.',
    ],
    nameOrigin: 'Em homenagem a Ernest O. Lawrence, inventor do cíclotron e fundador do laboratório de Berkeley.',
    symbolOrigin: 'Lr são a primeira e a terceira letras de lawrencium. O símbolo original, "Lw", foi trocado pela IUPAC em 1963.',
    nature: {
      text: 'É sintético e só pode ser produzido em aceleradores, poucos átomos por vez.',
      where: ['apenas-laboratorio'],
    },
    uses: [
      { area: 'ciencia', text: 'Apenas pesquisa básica — inclusive para discutir em que lugar da tabela ele deve ficar (grupo 3 ou série f).' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['radioativo'],
      text: 'É radioativo e existe apenas em quantidades de poucos átomos.',
    },
    curiosities: [
      'Em 2015, sua energia de ionização foi medida usando apenas alguns átomos, ajudando a discussão sobre a posição dele na tabela.',
      'É o último elemento da série dos actinídeos.',
    ],
    extraSources: ['iupac-twg-1993', 'iupac-names-1997'],
  },
  {
    z: 104,
    discoveryStory: [
      'Em 1964, a equipe de Georgy Flerov, em Dubna (então URSS), bombardeou plutônio-242 com íons de neônio-22 e detectou, por traços deixados em vidro especial, um isótopo que se partia por fissão espontânea. Atribuíram-no ao elemento 104 e propuseram o nome "kurchatóvio".',
      'Em 1969, a equipe de Albert Ghiorso, em Berkeley, não conseguiu reproduzir o resultado soviético, mas produziu outros isótopos do elemento 104 bombardeando califórnio com carbono e propôs o nome "rutherfórdio".',
      'A disputa, parte das chamadas "guerras dos transférmios", durou décadas. Em 1993, a IUPAC concluiu que os dois grupos mereciam crédito e, em 1997, oficializou o nome rutherfórdio.',
    ],
    nameOrigin: 'Em homenagem a Ernest Rutherford, que descobriu o núcleo atômico.',
    symbolOrigin: 'Rf são a primeira e a quinta letras de rutherfordium. Por anos foram usados símbolos rivais, como Ku (kurchatóvio).',
    nature: {
      text: 'É sintético e só pode ser produzido em aceleradores, poucos átomos por vez.',
      where: ['apenas-laboratorio'],
    },
    uses: [
      { area: 'ciencia', text: 'Pesquisa básica, inclusive experimentos de química com átomos isolados, que confirmaram seu parentesco com o háfnio.' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['radioativo'],
      text: 'É radioativo e existe apenas em quantidades de poucos átomos.',
    },
    curiosities: [
      'É o primeiro elemento transactinídeo, abrindo o bloco d do sétimo período.',
      'Antes de 1997, era chamado pelo nome sistemático "unnilquádio" (Unq).',
    ],
    extraSources: ['iupac-twg-1993', 'iupac-names-1997'],
  },
  {
    z: 105,
    discoveryStory: [
      'Em 1968, a equipe de Flerov, em Dubna, bombardeou amerício-243 com íons de neônio-22 e relatou indícios do elemento 105 por meio de partículas alfa.',
      'Em 1970, a equipe de Albert Ghiorso, em Berkeley, bombardeou califórnio-249 com nitrogênio-15 e identificou o dúbnio-260, com meia-vida de 1,6 segundo. Dubna também apresentou resultados aprimorados em 1970.',
      'A disputa sobre o nome — "nielsbóhrio" (Dubna) ou "hâhnio" (Berkeley) — só foi resolvida em 1997, quando a IUPAC escolheu "dúbnio", reconhecendo o papel do laboratório de Dubna.',
    ],
    nameOrigin: 'De Dubna, cidade russa sede do Instituto Unificado de Pesquisas Nucleares (JINR).',
    symbolOrigin: 'Db são a primeira e a terceira letras de dubnium.',
    nature: {
      text: 'É sintético e só pode ser produzido em aceleradores. O dúbnio-268, de meia-vida de cerca de um dia, aparece como produto de decaimento de elementos mais pesados.',
      where: ['apenas-laboratorio'],
    },
    uses: [
      { area: 'ciencia', text: 'Pesquisa básica, incluindo estudos químicos com átomos isolados.' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['radioativo'],
      text: 'É radioativo e existe apenas em quantidades de poucos átomos.',
    },
    curiosities: [
      'Já teve quatro nomes propostos: nielsbóhrio, hâhnio, joliótio e, finalmente, dúbnio.',
      'Seu isótopo mais estável vive cerca de um dia — muito para um elemento tão pesado.',
    ],
    extraSources: ['iupac-twg-1993', 'iupac-names-1997'],
  },
  {
    z: 106,
    discoveryStory: [
      'Em junho de 1974, a equipe de Yuri Oganessian, em Dubna, anunciou o elemento 106, obtido bombardeando chumbo com crômio-54, mas os dados eram ambíguos.',
      'Em setembro de 1974, uma equipe de Berkeley e Livermore liderada por Albert Ghiorso e Kenneth Hulet bombardeou califórnio-249 com oxigênio-18 no Super-HILAC e identificou o seaborgio-263, com meia-vida de cerca de 0,9 segundo, seguindo sua cadeia de decaimentos alfa até elementos conhecidos.',
      'O resultado americano foi confirmado em 1993, e a IUPAC atribuiu a descoberta a Berkeley e Livermore. O nome seabórgio foi oficializado em 1997.',
    ],
    nameOrigin: 'Em homenagem a Glenn T. Seaborg, codescobridor de dez elementos e criador do conceito dos actinídeos.',
    symbolOrigin: 'Sg são a primeira e a quinta letras de seaborgium.',
    nature: {
      text: 'É sintético e só pode ser produzido em aceleradores, poucos átomos por vez.',
      where: ['apenas-laboratorio'],
    },
    uses: [
      { area: 'ciencia', text: 'Pesquisa básica; experimentos com átomos isolados mostraram que ele se comporta como o tungstênio.' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['radioativo'],
      text: 'É radioativo e existe apenas em quantidades de poucos átomos.',
    },
    curiosities: [
      'Seaborg disse que ter um elemento com seu nome foi a maior honra de sua vida — e podia receber cartas endereçadas ao "seabórgio".',
      'Foi o primeiro elemento batizado em homenagem a uma pessoa viva.',
    ],
    extraSources: ['iupac-twg-1993', 'iupac-names-1997'],
  },
];
