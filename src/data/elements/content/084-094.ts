import type { ElementContent } from '../../types';

/** Conteúdo educativo — elementos 84 a 94. */
export const CONTENT_084_094: ElementContent[] = [
  {
    z: 84,
    discoveryStory: [
      'Em 1896, Henri Becquerel descobriu que sais de urânio emitiam "raios" invisíveis. Marie Curie decidiu estudar esse fenômeno em sua tese de doutorado em Paris e, com um eletrômetro inventado por Pierre Curie, mediu a intensidade da radiação de vários materiais.',
      'Ela notou algo estranho: a pechblenda (minério de urânio) era muito mais radioativa do que o urânio que continha. Concluiu que o minério devia ter outro elemento, ainda mais radioativo.',
      'Marie e Pierre Curie dissolveram toneladas de resíduos de pechblenda e separaram suas frações quimicamente, medindo a radioatividade de cada uma. Em julho de 1898, uma fração que acompanhava o bismuto mostrou-se centenas de vezes mais ativa que o urânio: era um novo elemento, que batizaram de polônio. Foi a primeira vez que um elemento foi descoberto pela sua radioatividade.',
    ],
    nameOrigin: 'Da Polônia, terra natal de Marie Curie (Maria Skłodowska), que na época não existia como Estado independente — o nome foi também um gesto político.',
    symbolOrigin: 'Po são as duas primeiras letras de polonium.',
    nature: {
      text: 'É extremamente raro: um minério de urânio contém cerca de 100 microgramas de polônio por tonelada. Existe naturalmente porque é produzido continuamente no decaimento do urânio e do rádio. Também está presente em traços na fumaça do tabaco. Para uso, é produzido em reatores, bombardeando bismuto com nêutrons.',
      minerals: ['Uraninita (pechblenda) — traços'],
      where: ['crosta', 'apenas-laboratorio'],
    },
    uses: [
      { area: 'industria', text: 'Dispositivos antiestáticos em fábricas de papel, filmes e tecidos (substituídos em grande parte por outras fontes).' },
      { area: 'aeroespacial', text: 'Fonte de calor em geradores de algumas sondas e veículos lunares soviéticos.' },
      { area: 'ciencia', text: 'Misturado ao berílio, formava fontes de nêutrons em pesquisas.' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['radioativo', 'toxico'],
      text: 'O polônio-210 é uma das substâncias mais perigosas conhecidas se for ingerido ou inalado, porque suas partículas alfa depositam toda a energia dentro dos tecidos. Fora do corpo, a radiação alfa é barrada até por uma folha de papel. Só é manuseado sob controle rigoroso.',
    },
    curiosities: [
      'Irène Joliot-Curie, filha de Marie, e seu marido Frédéric usaram polônio nos experimentos que levaram à descoberta da radioatividade artificial (Nobel de 1935).',
      'Em 2006, o ex-agente russo Alexander Litvinenko foi envenenado com polônio-210 em Londres.',
    ],
  },
  {
    z: 85,
    discoveryStory: [
      'A posição abaixo do iodo na tabela, o "eka-iodo", ficou vazia por décadas. Várias equipes anunciaram tê-lo encontrado na natureza ("alabâmio", "dacino", "helvécio"), sem confirmação.',
      'Em 1940, na Universidade da Califórnia, em Berkeley, Dale Corson, Kenneth MacKenzie e Emilio Segrè bombardearam bismuto-209 com partículas alfa aceleradas no cíclotron de 60 polegadas. Produziram o astato-211 (e nêutrons livres).',
      'Eles identificaram o novo elemento pela radioatividade e por testes químicos que mostraram um comportamento parecido, em parte, com o do iodo. Em 1943, Berta Karlik e Traude Bernert, na Áustria, mostraram que o astato também existe na natureza, em cadeias de decaimento.',
    ],
    nameOrigin: 'Do grego astatos, "instável", porque todos os seus isótopos são radioativos e de vida curta.',
    symbolOrigin: 'At são as duas primeiras letras de astatine.',
    nature: {
      text: 'É o elemento natural mais raro da crosta terrestre: estima-se que existam menos de 30 gramas de astato no planeta a cada instante, formados e destruídos continuamente nas cadeias de decaimento do urânio e do tório.',
      where: ['crosta', 'apenas-laboratorio'],
    },
    uses: [
      { area: 'medicina', text: 'O astato-211 é pesquisado em terapia alfa direcionada: ligado a moléculas que buscam células tumorais, destrói o câncer com pouco dano ao tecido vizinho.' },
      { area: 'ciencia', text: 'Pesquisa básica em química nuclear.' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['radioativo'],
      text: 'É intensamente radioativo. Como o iodo, tende a se acumular na tireoide. Só é produzido em quantidades mínimas, em laboratórios especializados.',
    },
    curiosities: [
      'Nunca se viu uma amostra visível de astato: ela seria vaporizada pelo próprio calor da radioatividade.',
      'Por ser tão escasso, várias de suas propriedades (como cor e estado físico) ainda são apenas previstas.',
    ],
  },
  {
    z: 86,
    discoveryStory: [
      'Em 1899, Ernest Rutherford e Robert Owens, no Canadá, notaram que o tório liberava uma "emanação" radioativa que se espalhava pelo ar. Marie e Pierre Curie observaram o mesmo com o rádio.',
      'Em 1900, o físico alemão Friedrich Ernst Dorn, em Halle, estudou a emanação do rádio e mostrou que era um gás radioativo. Em 1903, André-Louis Debierne observou a emanação do actínio. Mais tarde se descobriu que eram isótopos do mesmo elemento.',
      'Em 1908–1910, William Ramsay e Robert Whytlaw-Gray isolaram o gás, mediram sua densidade e mostraram que era o gás mais pesado conhecido e um gás nobre. O nome radônio foi adotado em 1923.',
    ],
    nameOrigin: 'Do rádio, de onde é emanado. Já foi chamado de "emanação do rádio" e de "nitônio" (do latim nitens, "brilhante").',
    symbolOrigin: 'Rn são a primeira e a terceira letras de radon (Ra já era o rádio).',
    nature: {
      text: 'Forma-se continuamente no solo e nas rochas pelo decaimento do rádio, que vem do urânio e do tório. Escapa para o ar e pode se acumular em porões, minas e casas mal ventiladas, sobretudo em regiões graníticas.',
      where: ['crosta', 'atmosfera'],
    },
    uses: [
      { area: 'ciencia', text: 'Monitoramento de radônio ajuda a estudar falhas geológicas, águas subterrâneas e a circulação atmosférica.' },
      { area: 'medicina', text: 'No passado, ampolas de radônio foram usadas em radioterapia; hoje esse uso foi abandonado.' },
    ],
    hazards: {
      level: 'alto',
      flags: ['radioativo'],
      text: 'É um gás radioativo sem cor, cheiro ou sabor. A exposição prolongada ao radônio em ambientes fechados é a segunda maior causa de câncer de pulmão, depois do cigarro. A prevenção é simples: boa ventilação e, em áreas de risco, medição nas residências.',
    },
    curiosities: [
      'É o gás natural mais denso conhecido — cerca de 7,5 vezes mais pesado que o ar.',
      'Quando resfriado até ficar sólido, brilha com uma luz amarela que se torna vermelho-alaranjada em temperaturas mais baixas.',
    ],
  },
  {
    z: 87,
    discoveryStory: [
      'O "eka-césio", abaixo do césio, foi procurado por décadas. Várias descobertas foram anunciadas ("virgínio", "moldávio", "rússio") e depois refutadas.',
      'Em 1939, Marguerite Perey, assistente no Instituto Curie em Paris (onde começara como técnica de Marie Curie), purificava amostras de actínio-227. Ela notou uma radiação beta de energia inesperada que não podia vir do actínio nem de seus produtos conhecidos.',
      'Perey mostrou que cerca de 1% do actínio-227 decai emitindo uma partícula alfa e se transforma em um elemento novo, o elemento 87, que se comportava como um metal alcalino. Ela o chamou de frâncio, em homenagem à França. Em 1962, tornou-se a primeira mulher eleita para a Academia de Ciências da França.',
    ],
    nameOrigin: 'Da França, país onde foi descoberto.',
    symbolOrigin: 'Fr são as duas primeiras letras de francium.',
    nature: {
      text: 'Existe naturalmente em quantidades ínfimas em minérios de urânio e tório, como produto da cadeia de decaimento do actínio. Estima-se que haja apenas cerca de 30 gramas de frâncio na crosta terrestre a cada momento.',
      where: ['crosta', 'apenas-laboratorio'],
    },
    uses: [
      { area: 'ciencia', text: 'Pesquisa em física atômica: átomos de frâncio aprisionados com lasers ajudam a testar teorias fundamentais.' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['radioativo'],
      text: 'É intensamente radioativo, com meia-vida máxima de apenas 22 minutos. Só existe em quantidades de alguns milhares de átomos em laboratório.',
    },
    curiosities: [
      'Foi o último elemento descoberto na natureza; todos os seguintes foram obtidos em laboratório.',
      'Nunca foi produzida uma quantidade de frâncio visível a olho nu.',
    ],
  },
  {
    z: 88,
    discoveryStory: [
      'Depois de descobrir o polônio, em julho de 1898, Marie e Pierre Curie perceberam que a fração da pechblenda que acompanhava o bário também era extremamente radioativa.',
      'Com Gustave Bémont, concentraram essa fração e, em dezembro de 1898, Eugène Demarçay identificou nela uma linha espectral nova. Era outro elemento, que chamaram de rádio pela intensa radiação.',
      'Para provar a descoberta, Marie Curie processou cerca de uma tonelada de resíduos de pechblenda de Joachimsthal (Boêmia) em um galpão precário. Em 1902 obteve 0,1 g de cloreto de rádio e mediu sua massa atômica. Em 1910, com André Debierne, isolou o rádio metálico. Marie Curie recebeu o Nobel de Química de 1911.',
    ],
    nameOrigin: 'Do latim radius, "raio", pela radiação intensa que emite.',
    symbolOrigin: 'Ra são as duas primeiras letras de radium.',
    nature: {
      text: 'Está presente em todos os minérios de urânio, como produto do decaimento do urânio-238 — cerca de 1 g de rádio para cada 7 toneladas de pechblenda. Também ocorre em traços no solo e em algumas águas minerais.',
      minerals: ['Uraninita (pechblenda)', 'Carnotita'],
      where: ['crosta', 'apenas-laboratorio'],
    },
    uses: [
      { area: 'medicina', text: 'O rádio-223 é usado hoje no tratamento de metástases ósseas do câncer de próstata.' },
      { area: 'medicina', text: 'Historicamente, agulhas de rádio-226 foram usadas em radioterapia (braquiterapia).' },
      { area: 'ciencia', text: 'A unidade "curie" de atividade radioativa foi definida a partir de 1 grama de rádio-226.' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['radioativo', 'toxico'],
      text: 'O rádio é intensamente radioativo e se acumula nos ossos, como o cálcio, podendo causar câncer. No início do século XX, operárias que pintavam mostradores de relógio com tinta de rádio (as "Radium Girls") sofreram graves danos à saúde, o que levou a normas de segurança no trabalho.',
    },
    curiosities: [
      'Os cadernos de laboratório de Marie Curie ainda são radioativos e ficam guardados em caixas de chumbo.',
      'Nos anos 1920, o rádio era vendido em cremes, águas e cosméticos como "revigorante" — uma moda perigosa.',
    ],
  },
  {
    z: 89,
    discoveryStory: [
      'Depois do polônio e do rádio, André-Louis Debierne, colaborador dos Curie em Paris, continuou analisando os resíduos da pechblenda.',
      'Em 1899, ele relatou uma substância radioativa que acompanhava os elementos de terras-raras e o tório, e a chamou de actínio. Em 1902, o alemão Friedrich Oskar Giesel isolou de forma independente uma substância semelhante, que chamou de "emânio".',
      'Mais tarde se confirmou que eram o mesmo elemento. Historiadores apontam que as primeiras amostras de Debierne podiam conter principalmente outros radionuclídeos, mas o crédito e o nome actínio permaneceram com ele.',
    ],
    nameOrigin: 'Do grego aktis (genitivo aktinos), "raio", pela radioatividade. Dá nome à série dos actinídeos.',
    symbolOrigin: 'Ac são as duas primeiras letras de actinium.',
    nature: {
      text: 'Ocorre em traços em minérios de urânio, como parte da cadeia de decaimento do urânio-235 (cerca de 0,2 mg por tonelada de minério). Na prática, é produzido em reatores bombardeando rádio com nêutrons.',
      where: ['crosta', 'apenas-laboratorio'],
    },
    uses: [
      { area: 'medicina', text: 'O actínio-225 é usado em terapias alfa direcionadas contra cânceres avançados, como o de próstata.' },
      { area: 'ciencia', text: 'Misturado ao berílio, forma fontes de nêutrons.' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['radioativo'],
      text: 'É intensamente radioativo (cerca de 150 vezes mais que o rádio, por massa) e perigoso se ingerido, pois se deposita nos ossos e no fígado.',
    },
    curiosities: [
      'Brilha no escuro com uma luz azul-pálida, causada pela ionização do ar ao seu redor.',
      'É o primeiro elemento da série dos actinídeos e dá nome a ela.',
    ],
  },
  {
    z: 90,
    discoveryStory: [
      'Em 1828, o clérigo e mineralogista norueguês Hans Morten Thrane Esmark encontrou um mineral negro na ilha de Løvøya e o enviou ao pai, o mineralogista Jens Esmark, que suspeitou de um elemento novo e o encaminhou a Jöns Jacob Berzelius, em Estocolmo.',
      'Berzelius analisou o mineral e encontrou o óxido de um elemento desconhecido. Batizou-o de tório, em homenagem a Thor, o deus nórdico do trovão, e o mineral de torita. Obteve o metal impuro aquecendo um fluoreto de tório com potássio.',
      'Em 1898, Gerhard Schmidt e, independentemente, Marie Curie descobriram que o tório é radioativo. O metal puro só foi obtido em 1914.',
    ],
    nameOrigin: 'De Thor, o deus nórdico do trovão.',
    symbolOrigin: 'Th são as duas primeiras letras de thorium.',
    nature: {
      text: 'É cerca de três vezes mais abundante que o urânio na crosta. Ocorre principalmente na monazita (areias monazíticas da Índia e do Brasil), na torita e na torianita. O tório-232, com meia-vida de cerca de 14 bilhões de anos, existe desde a formação da Terra e, junto com o urânio, aquece o interior do planeta.',
      minerals: ['Monazita', 'Torita', 'Torianita'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'energia', text: 'Combustível nuclear em estudo: o tório-232 pode ser convertido em urânio-233 físsil em reatores especiais.' },
      { area: 'industria', text: 'Eletrodos de tungstênio toriado para soldagem e ligas de magnésio resistentes ao calor.' },
      { area: 'tecnologia', text: 'Óxido de tório em lentes ópticas antigas e nas camisas de lampiões a gás (uso hoje reduzido).' },
    ],
    hazards: {
      level: 'moderado',
      flags: ['radioativo', 'toxico'],
      text: 'É fracamente radioativo, mas seus produtos de decaimento (incluindo o gás radônio-220) emitem radiação mais intensa. O principal risco é inalar ou ingerir poeira de compostos de tório.',
    },
    curiosities: [
      'Camisas de lampiões a gás eram feitas com óxido de tório, que emite luz branca brilhante quando aquecido.',
      'Seu calor radioativo, junto com o do urânio e do potássio, ajuda a manter o interior da Terra quente.',
    ],
  },
  {
    z: 91,
    discoveryStory: [
      'Mendeleev previu um elemento entre o tório e o urânio. Em 1913, Kasimir Fajans e Oswald Göhring, em Karlsruhe (Alemanha), estudando a cadeia de decaimento do urânio-238, identificaram um isótopo de vida muito curta do elemento 91 e o chamaram de "brévio" ("breve").',
      'Em 1917–1918, Otto Hahn e Lise Meitner, em Berlim, encontraram um isótopo de vida longa, o protactínio-231 (meia-vida de cerca de 32.700 anos). De forma independente, Frederick Soddy e John Cranston, no Reino Unido, chegaram ao mesmo resultado.',
      'Hahn e Meitner propuseram o nome "protoactínio", depois encurtado. Em 1934, Aristid von Grosse isolou pela primeira vez o metal.',
    ],
    nameOrigin: 'Do grego protos ("primeiro") + actínio: o elemento que vem "antes" do actínio na cadeia de decaimento, pois o protactínio-231 decai em actínio-227.',
    symbolOrigin: 'Pa são as duas primeiras letras de protactinium (P já era o fósforo).',
    nature: {
      text: 'É um dos elementos naturais mais raros e caros: aparece em minérios de urânio em concentrações de partes por milhão ou menos, produzido pelo decaimento do urânio-235.',
      where: ['crosta', 'apenas-laboratorio'],
    },
    uses: [
      { area: 'ciencia', text: 'Sem aplicações fora da pesquisa. A razão protactínio/tório é usada para datar sedimentos oceânicos.' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['radioativo', 'toxico'],
      text: 'É altamente radioativo e tóxico; exige instalações especiais de manuseio.',
    },
    curiosities: [
      'Em 1961, o Reino Unido purificou cerca de 125 g de protactínio a partir de 60 toneladas de resíduos de urânio — durante muito tempo, quase todo o protactínio do mundo.',
      'Lise Meitner, codescobridora do protactínio, ajudou depois a explicar a fissão nuclear.',
    ],
  },
  {
    z: 92,
    discoveryStory: [
      'A pechblenda, um minério negro e pesado das minas de prata de Joachimsthal (Boêmia), era considerada um minério de zinco ou ferro. Em 1789, Martin Heinrich Klaproth, em Berlim, dissolveu-a em ácido nítrico e neutralizou a solução, obtendo um precipitado amarelo.',
      'Aquecendo esse composto com carvão, obteve um pó negro com brilho metálico, que acreditou ser um metal novo. Batizou-o de urânio, em homenagem ao planeta Urano, descoberto oito anos antes. Na verdade, ele havia obtido um óxido de urânio.',
      'Em 1841, Eugène-Melchior Péligot, em Paris, reduziu o tetracloreto de urânio com potássio e obteve o urânio metálico. Em 1896, Henri Becquerel descobriu a radioatividade em sais de urânio, e em 1938 Otto Hahn e Fritz Strassmann descobriram que o urânio pode sofrer fissão.',
    ],
    nameOrigin: 'Do planeta Urano, descoberto por William Herschel em 1781 — que, por sua vez, homenageia Urano, deus grego do céu.',
    symbolOrigin: 'U é a inicial de uranium.',
    nature: {
      text: 'É o elemento mais pesado encontrado em grande quantidade na natureza, com alguns gramas por tonelada em rochas e solos — mais comum que a prata ou o mercúrio. Os principais minérios são a uraninita (pechblenda) e a carnotita. Cazaquistão, Canadá e Austrália são grandes produtores; o Brasil tem reservas importantes.',
      minerals: ['Uraninita (pechblenda)', 'Carnotita', 'Autunita', 'Coffinita'],
      where: ['crosta', 'oceanos', 'minerais'],
    },
    uses: [
      { area: 'energia', text: 'Combustível de usinas nucleares (urânio levemente enriquecido em urânio-235), que geram cerca de 9% da eletricidade mundial.' },
      { area: 'ciencia', text: 'Datação de rochas e da idade da Terra (métodos urânio-chumbo).' },
      { area: 'medicina', text: 'Reatores de pesquisa movidos a urânio produzem radioisótopos médicos, como o molibdênio-99.' },
      { area: 'industria', text: 'O urânio empobrecido, muito denso, é usado como blindagem contra radiação e contrapeso em aeronaves.' },
      { area: 'defesa', text: 'Propulsão de submarinos nucleares e, infelizmente, armas nucleares.' },
    ],
    hazards: {
      level: 'alto',
      flags: ['radioativo', 'toxico'],
      text: 'O urânio natural é fracamente radioativo; seu maior perigo, quando ingerido ou inalado, é a toxicidade química, que afeta os rins. Os produtos de decaimento (como rádio e radônio) e os resíduos de reatores são muito mais radioativos e exigem gestão rigorosa.',
    },
    curiosities: [
      'Há 1,7 bilhão de anos, em Oklo (Gabão), depósitos de urânio funcionaram como reatores nucleares naturais.',
      'Vidros e louças antigos coloridos com urânio brilham em verde sob luz ultravioleta.',
      'O decaimento do urânio e do tório é uma das fontes do calor interno da Terra.',
    ],
  },
  {
    z: 93,
    discoveryStory: [
      'Em 1934, Enrico Fermi bombardeou urânio com nêutrons e acreditou ter produzido os elementos 93 e 94. Na verdade, como se descobriu em 1938, ele tinha provocado a fissão do urânio.',
      'Em 1940, na Universidade da Califórnia, em Berkeley, Edwin McMillan estudava os fragmentos da fissão. Notou que uma atividade radioativa com meia-vida de 2,3 dias não se afastava da amostra de urânio como os fragmentos — ficava no lugar.',
      'Com Philip Abelson, mostrou quimicamente que essa atividade vinha de um elemento novo: o urânio-238 absorvia um nêutron, virava urânio-239 e, por decaimento beta, se transformava no elemento 93. Era o primeiro elemento além do urânio.',
    ],
    nameOrigin: 'Do planeta Netuno, o seguinte a Urano no Sistema Solar — assim como o elemento 93 vem logo depois do urânio.',
    symbolOrigin: 'Np são a primeira e a terceira letras de neptunium (N já era o nitrogênio).',
    nature: {
      text: 'Traços ínfimos de neptúnio existem em minérios de urânio, formados pela captura de nêutrons. Praticamente todo o neptúnio é produzido em reatores nucleares, como subproduto do combustível de urânio.',
      where: ['crosta', 'apenas-laboratorio'],
    },
    uses: [
      { area: 'ciencia', text: 'Detectores de nêutrons de alta energia.' },
      { area: 'aeroespacial', text: 'O neptúnio-237 é o material de partida para produzir plutônio-238, que alimenta sondas espaciais.' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['radioativo', 'toxico'],
      text: 'É radioativo e tende a se acumular nos ossos se absorvido. O neptúnio-237 é um dos resíduos de longa duração do combustível nuclear usado.',
    },
    curiosities: [
      'Foi o primeiro elemento transurânico produzido em laboratório.',
      'McMillan dividiu o Nobel de Química de 1951 com Glenn Seaborg pelas descobertas dos transurânicos.',
    ],
  },
  {
    z: 94,
    discoveryStory: [
      'Depois do neptúnio, os cientistas esperavam que o elemento 94 surgisse do seu decaimento. Em dezembro de 1940, Glenn Seaborg, Edwin McMillan, Joseph Kennedy e Arthur Wahl, em Berkeley, bombardearam urânio-238 com deutérios acelerados no cíclotron de 60 polegadas.',
      'Formou-se neptúnio-238, que decaiu em um novo elemento radioativo emissor de partículas alfa. Em fevereiro de 1941, Wahl conseguiu separá-lo quimicamente e provar que era o elemento 94.',
      'Logo se descobriu que o plutônio-239 sofre fissão com nêutrons lentos. Por causa da Segunda Guerra Mundial e do Projeto Manhattan, a descoberta foi mantida em segredo até 1946.',
    ],
    nameOrigin: 'De Plutão, que na época era considerado o planeta seguinte a Netuno — seguindo a sequência urânio, neptúnio, plutônio.',
    symbolOrigin: 'Pu foi escolhido por Seaborg em vez de "Pl", como uma brincadeira (em inglês, "pee-yoo" é uma interjeição para mau cheiro) — e foi aceito sem objeções.',
    nature: {
      text: 'Traços mínimos existem em minérios de urânio, formados por captura de nêutrons; há ainda indícios de plutônio-244 primordial. Quase todo o plutônio é produzido em reatores nucleares a partir do urânio-238.',
      where: ['crosta', 'apenas-laboratorio'],
    },
    uses: [
      { area: 'aeroespacial', text: 'O plutônio-238 alimenta geradores termoelétricos de sondas como Voyager, Cassini, New Horizons e os jipes-robôs Curiosity e Perseverance.' },
      { area: 'energia', text: 'O plutônio-239 pode ser usado como combustível em reatores (combustível MOX).' },
      { area: 'defesa', text: 'Material físsil de armas nucleares.' },
      { area: 'medicina', text: 'Marca-passos antigos usavam pequenas baterias de plutônio-238.' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['radioativo', 'toxico'],
      text: 'É altamente radioativo e tóxico, especialmente se inalado, pois se fixa nos pulmões, nos ossos e no fígado. Seu manuseio e armazenamento seguem controles internacionais rigorosos de segurança e não proliferação.',
    },
    curiosities: [
      'Uma esfera de plutônio fica morna ao toque por causa do calor do próprio decaimento radioativo.',
      'O metal tem seis formas cristalinas diferentes entre a temperatura ambiente e o ponto de fusão — um recorde entre os elementos.',
    ],
  },
];
