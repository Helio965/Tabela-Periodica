import type { ElementContent } from '../../types';

/** Conteúdo educativo — elementos 11 a 20. */
export const CONTENT_011_020: ElementContent[] = [
  {
    z: 11,
    discoveryStory: [
      'No início do século XIX, a "soda cáustica" (hidróxido de sódio) era considerada uma substância simples, pois nenhum método químico conseguia decompô-la. Alessandro Volta acabara de inventar a pilha elétrica (1800), e Humphry Davy, na Royal Institution de Londres, decidiu usar baterias cada vez mais potentes para "quebrar" substâncias resistentes.',
      'Em outubro de 1807, poucos dias depois de isolar o potássio, Davy fez passar uma forte corrente elétrica por soda cáustica levemente umedecida e fundida. No polo negativo surgiram pequenos glóbulos metálicos brilhantes, que flutuavam na água e reagiam com ela produzindo hidrogênio.',
      'Davy concluiu que a soda era um composto de oxigênio com um metal desconhecido, que chamou de sodium. A descoberta mostrou o poder da eletrólise como ferramenta para revelar novos elementos.',
    ],
    nameOrigin: 'De soda, nome do carbonato e do hidróxido de sódio, de onde o metal foi obtido. "Soda" vem do latim medieval sodanum, um remédio para dor de cabeça.',
    symbolOrigin: 'Na vem do latim natrium, derivado de natron (do egípcio antigo), nome de um sal de sódio usado pelos egípcios na mumificação.',
    nature: {
      text: 'É o sexto elemento mais abundante da crosta terrestre (cerca de 2,6%) e o metal alcalino mais comum. Nunca ocorre livre: aparece no sal-gema, em silicatos como os feldspatos e, sobretudo, dissolvido na água do mar como cloreto de sódio.',
      minerals: ['Halita (sal-gema, NaCl)', 'Feldspato (albita)', 'Trona', 'Salitre do Chile'],
      where: ['crosta', 'oceanos', 'organismos', 'estrelas'],
    },
    uses: [
      { area: 'alimentos', text: 'Cloreto de sódio (sal de cozinha) para temperar e conservar alimentos; bicarbonato de sódio como fermento.' },
      { area: 'iluminacao', text: 'Lâmpadas de vapor de sódio, com sua luz amarela característica, na iluminação pública.' },
      { area: 'energia', text: 'Sódio líquido como refrigerante em alguns reatores nucleares rápidos.' },
      { area: 'industria', text: 'Soda cáustica, barrilha (carbonato de sódio) para vidro, sabões e papel; produção de titânio.' },
      { area: 'medicina', text: 'Soro fisiológico (0,9% de NaCl); o sódio é essencial para os impulsos nervosos.' },
    ],
    hazards: {
      level: 'alto',
      flags: ['reativo', 'inflamavel', 'corrosivo'],
      text: 'O sódio metálico reage violentamente com a água, liberando hidrogênio que pode pegar fogo ou explodir, e formando soda cáustica corrosiva. Por isso é guardado sob óleo mineral. Na alimentação, o excesso de sódio está associado à hipertensão.',
    },
    curiosities: [
      'O metal é tão mole que pode ser cortado com uma faca.',
      'A luz amarela emitida pelo sódio (as "linhas D") é uma das mais marcantes no espectro do Sol.',
    ],
  },
  {
    z: 12,
    discoveryStory: [
      'Na região de Magnésia, na Grécia, eram conhecidos vários minerais brancos. No século XVIII, a "magnésia alba" (carbonato de magnésio) era vendida como remédio e muitos a confundiam com a cal (carbonato de cálcio).',
      'Em 1755, o escocês Joseph Black, em Edimburgo, fez experimentos cuidadosos medindo a massa das substâncias antes e depois de aquecê-las. Mostrou que a magnésia e a cal liberavam gás carbônico ("ar fixo") e formavam sais diferentes: eram "terras" distintas. Black reconheceu assim o magnésio como elemento.',
      'Em 1808, Humphry Davy obteve uma pequena quantidade do metal impuro por eletrólise de uma mistura de magnésia e óxido de mercúrio. O metal puro e em maior quantidade foi obtido por Antoine Bussy em 1831, aquecendo cloreto de magnésio com potássio.',
    ],
    nameOrigin: 'De Magnésia, distrito da Tessália, na Grécia, de onde vinham minerais com esse nome.',
    symbolOrigin: 'Mg são as duas primeiras letras de magnesium com a consoante seguinte, para não confundir com manganês (Mn).',
    nature: {
      text: 'É o oitavo elemento mais abundante da crosta e muito comum no manto terrestre. Ocorre em minerais como dolomita, magnesita e olivina, e está dissolvido em grande quantidade na água do mar: cada quilômetro cúbico de água do mar contém cerca de 1,3 bilhão de quilos de magnésio.',
      minerals: ['Dolomita', 'Magnesita', 'Carnalita', 'Olivina', 'Talco'],
      where: ['crosta', 'oceanos', 'organismos', 'minerais'],
    },
    uses: [
      { area: 'transporte', text: 'Ligas leves de magnésio e alumínio em carros, aviões, bicicletas e notebooks.' },
      { area: 'industria', text: 'Produção de titânio e urânio metálicos (processo Kroll) e dessulfuração do aço.' },
      { area: 'medicina', text: 'Hidróxido de magnésio ("leite de magnésia") como antiácido e laxante; sulfato de magnésio (sal de Epsom).' },
      { area: 'tecnologia', text: 'Sinalizadores e fogos de artifício que queimam com luz branca intensa.' },
    ],
    hazards: {
      level: 'moderado',
      flags: ['inflamavel', 'reativo'],
      text: 'Em pó ou em fitas finas, o magnésio pega fogo com facilidade e queima com chama muito quente e brilhante. Incêndios de magnésio não podem ser apagados com água, que piora a reação. Em peças maciças é relativamente seguro.',
    },
    curiosities: [
      'Fica no centro da molécula de clorofila: sem magnésio, as plantas não fazem fotossíntese.',
      'Os antigos "flashes" de fotografia usavam pó ou fio de magnésio queimando.',
    ],
  },
  {
    z: 13,
    discoveryStory: [
      'O alúmen (sulfato duplo de alumínio e potássio) é usado desde a Antiguidade para fixar corantes em tecidos. No século XVIII, químicos suspeitaram que a alumina (óxido de alumínio) continha um metal desconhecido; Humphry Davy chegou a dar-lhe nome em 1808, mas não conseguiu isolá-lo.',
      'Em 1825, o dinamarquês Hans Christian Ørsted — famoso por descobrir a relação entre eletricidade e magnetismo — aqueceu cloreto de alumínio com amálgama de potássio e obteve um pequeno pedaço de metal com aparência de estanho. Em 1827, Friedrich Wöhler melhorou o método usando potássio puro e obteve alumínio em pó; em 1845, produziu glóbulos sólidos do metal.',
      'Por décadas o alumínio foi caríssimo. Em 1886, Charles Martin Hall (EUA) e Paul Héroult (França), independentemente, inventaram a eletrólise da alumina dissolvida em criolita fundida — o processo Hall-Héroult, usado até hoje — e o metal se tornou comum.',
    ],
    nameOrigin: 'Do latim alumen, nome do alúmen. Davy propôs "alumium", depois "aluminum"; outros químicos preferiram "aluminium", forma usada pela IUPAC.',
    symbolOrigin: 'Al são as duas primeiras letras de aluminium.',
    nature: {
      text: 'É o metal mais abundante da crosta terrestre (cerca de 8%) e o terceiro elemento mais comum, depois de oxigênio e silício. Nunca é encontrado livre: está em argilas, feldspatos e micas. O principal minério é a bauxita, abundante no Brasil, na Austrália e na Guiné.',
      minerals: ['Bauxita', 'Feldspatos', 'Micas', 'Criolita', 'Coríndon (rubi e safira)'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'transporte', text: 'Ligas leves e resistentes em aviões, carros, trens e navios.' },
      { area: 'alimentos', text: 'Latas de bebidas, papel-alumínio e embalagens que protegem da luz e do ar.' },
      { area: 'construcao', text: 'Esquadrias, coberturas e estruturas que resistem à corrosão.' },
      { area: 'energia', text: 'Cabos de transmissão de eletricidade de alta tensão.' },
      { area: 'eletronica', text: 'Dissipadores de calor e carcaças de equipamentos.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'O alumínio metálico tem baixa toxicidade e é seguro no uso cotidiano. O pó fino pode ser inflamável e explosivo, e a inalação crônica de poeira em ambientes industriais pode afetar os pulmões.',
    },
    curiosities: [
      'O topo do Monumento a Washington (EUA), de 1884, é uma pirâmide de alumínio — na época, um material raro e caro.',
      'Reciclar alumínio usa cerca de 5% da energia necessária para produzi-lo a partir da bauxita.',
      'Rubis e safiras são cristais de óxido de alumínio com pequenas impurezas que lhes dão cor.',
    ],
  },
  {
    z: 14,
    discoveryStory: [
      'Lavoisier suspeitava, em 1787, que a sílica (o quartzo e a areia) fosse o óxido de um elemento desconhecido, mas a ligação entre silício e oxigênio é tão forte que nenhum método da época conseguia separá-los.',
      'Em 1811, Gay-Lussac e Thénard aqueceram potássio com tetrafluoreto de silício e provavelmente obtiveram silício impuro, mas não o identificaram. Em 1824, em Estocolmo, Jöns Jacob Berzelius usou o mesmo tipo de reação, aquecendo um composto de flúor e silício com potássio metálico, e lavou cuidadosamente o produto até restar um pó marrom: silício amorfo, que ele identificou como novo elemento.',
      'Em 1854, Henri Sainte-Claire Deville preparou o silício cristalino, com brilho metálico. No século XX, o silício ultrapuro se tornou a base da indústria eletrônica.',
    ],
    nameOrigin: 'Do latim silex ou silicis, "pederneira" (sílex). O final "-on" foi sugerido por Thomas Thomson por analogia com carbono e boro.',
    symbolOrigin: 'Si são as duas primeiras letras de silicium.',
    nature: {
      text: 'É o segundo elemento mais abundante da crosta (cerca de 28% da massa), superado apenas pelo oxigênio. Nunca ocorre livre: forma a sílica (quartzo, areia, ágata, ametista, opala) e os silicatos, que compõem a maioria das rochas.',
      minerals: ['Quartzo', 'Feldspatos', 'Micas', 'Argilas', 'Opala'],
      where: ['crosta', 'minerais', 'organismos', 'estrelas'],
    },
    uses: [
      { area: 'eletronica', text: 'Silício ultrapuro e dopado é a base de chips, transistores e processadores.' },
      { area: 'energia', text: 'Células solares fotovoltaicas.' },
      { area: 'construcao', text: 'Areia, cimento, concreto, vidro e cerâmica são feitos de compostos de silício.' },
      { area: 'industria', text: 'Ligas de alumínio-silício e ferrossilício; silicones para vedação, lubrificação e próteses.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['toxico'],
      text: 'O silício e a areia são pouco tóxicos. Mas respirar por longos períodos poeira fina de sílica cristalina (em minas, pedreiras e no jateamento de areia) causa silicose, uma doença pulmonar grave e irreversível.',
    },
    curiosities: [
      'O Vale do Silício, na Califórnia, recebeu esse nome por causa da indústria de chips.',
      'Diatomáceas, algas microscópicas, constroem suas carapaças de sílica.',
    ],
  },
  {
    z: 15,
    discoveryStory: [
      'Em 1669, em Hamburgo, o alquimista Hennig Brand procurava a "pedra filosofal", que transformaria metais comuns em ouro. Ele acreditava que a urina, por ser dourada, poderia conter esse segredo.',
      'Brand deixou dezenas de baldes de urina apodrecerem por dias, ferveu o líquido até virar uma pasta e aqueceu o resíduo a temperaturas muito altas. Os vapores, condensados em água, formaram uma substância branca, como cera, que brilhava no escuro com uma luz esverdeada e às vezes pegava fogo sozinha.',
      'Brand guardou o segredo e vendeu o método. Mais tarde, Robert Boyle e outros também o prepararam. Por volta de 1770, Johan Gahn e Carl Scheele mostraram que os ossos contêm fosfato de cálcio, uma fonte muito melhor. Em 1777, Lavoisier reconheceu o fósforo como elemento.',
    ],
    nameOrigin: 'Do grego phosphoros, "portador de luz", porque o fósforo branco brilha no escuro. Era também o nome antigo do planeta Vênus quando aparece antes do nascer do Sol.',
    symbolOrigin: 'P é a inicial de phosphorus.',
    nature: {
      text: 'Nunca é encontrado livre, por ser muito reativo. Está em rochas fosfáticas (com o mineral apatita), cujas maiores jazidas ficam no Marrocos, na China e nos EUA. É essencial à vida: faz parte do DNA, do RNA, do ATP (a "moeda de energia" das células) e dos ossos e dentes.',
      minerals: ['Apatita', 'Fosforita (rocha fosfática)'],
      where: ['crosta', 'organismos', 'minerais', 'oceanos'],
    },
    uses: [
      { area: 'agricultura', text: 'Fertilizantes fosfatados — o principal uso do fósforo no mundo.' },
      { area: 'industria', text: 'Ácido fosfórico, detergentes, tratamento de metais e aditivos alimentares.' },
      { area: 'tecnologia', text: 'Fósforo vermelho na lixa das caixas de fósforos de segurança.' },
      { area: 'eletronica', text: 'Dopante do silício para produzir semicondutores do tipo n.' },
      { area: 'medicina', text: 'O fósforo-32 radioativo já foi usado no tratamento de algumas doenças do sangue e da medula.' },
    ],
    hazards: {
      level: 'alto',
      flags: ['toxico', 'inflamavel'],
      text: 'O fósforo branco é muito tóxico e pega fogo espontaneamente no ar, causando queimaduras graves; por isso é guardado sob a água. O fósforo vermelho é bem mais estável e pouco tóxico. Excesso de fosfatos em rios e lagos causa a proliferação de algas (eutrofização).',
    },
    curiosities: [
      'Foi o primeiro elemento cuja descoberta tem data e autor registrados.',
      'O brilho do fósforo branco no escuro vem da reação lenta com o oxigênio do ar (quimiluminescência), e não de radioatividade.',
    ],
  },
  {
    z: 16,
    discoveryStory: [
      'O enxofre é conhecido desde a Antiguidade porque aparece puro (nativo) perto de vulcões e fontes termais, como cristais amarelos. Era usado para fumigar ambientes, em remédios e, na China, na pólvora. Homero, por volta de 800 a.C., já mencionava o "enxofre que afasta as pragas".',
      'Os alquimistas o consideravam um dos princípios fundamentais da matéria, ligado à combustibilidade. Em 1777, Antoine Lavoisier argumentou que o enxofre era um elemento, e não um composto.',
      'Alguns químicos ainda achavam que ele continha hidrogênio e oxigênio. Em 1809, Joseph Louis Gay-Lussac e Louis Jacques Thénard demonstraram de forma convincente sua natureza elementar.',
    ],
    nameOrigin: 'Do latim sulfur (ou sulphur), provavelmente de origem indo-europeia; no sânscrito, sulvere. Em inglês antigo era brimstone, "pedra que queima".',
    symbolOrigin: 'S é a inicial de sulfur.',
    nature: {
      text: 'Ocorre nativo em regiões vulcânicas e em domos de sal, e combinado em muitos minerais: sulfetos (pirita, galena, cinábrio) e sulfatos (gesso, barita). Está no petróleo e no gás natural, de onde hoje vem a maior parte do enxofre produzido. Também faz parte de proteínas, como a queratina dos cabelos.',
      minerals: ['Enxofre nativo', 'Pirita', 'Galena', 'Gipsita (gesso)', 'Barita', 'Cinábrio'],
      where: ['crosta', 'oceanos', 'organismos', 'minerais'],
    },
    uses: [
      { area: 'industria', text: 'Ácido sulfúrico, o produto químico mais fabricado do mundo, usado em quase todas as indústrias.' },
      { area: 'agricultura', text: 'Fertilizantes (sulfatos) e fungicidas para lavouras.' },
      { area: 'industria', text: 'Vulcanização da borracha, que a torna resistente e elástica.' },
      { area: 'energia', text: 'Baterias de chumbo-ácido de automóveis usam ácido sulfúrico.' },
      { area: 'medicina', text: 'Componente de medicamentos como as sulfonamidas, primeiros antibacterianos sintéticos.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['inflamavel'],
      text: 'O enxofre puro é pouco tóxico, mas inflamável; ao queimar libera dióxido de enxofre (SO₂), gás irritante que contribui para a chuva ácida. O sulfeto de hidrogênio (H₂S), com cheiro de ovo podre, é muito tóxico em concentrações altas e paralisa o olfato.',
    },
    curiosities: [
      'O cheiro de "ovo podre" e o do alho e da cebola vêm de compostos de enxofre.',
      'Io, uma das luas de Júpiter, tem vulcões ativos que expelem enxofre, dando-lhe cores amarelas e laranjas.',
    ],
  },
  {
    z: 17,
    discoveryStory: [
      'Em 1774, o farmacêutico sueco Carl Wilhelm Scheele estudava o mineral pirolusita (dióxido de manganês). Ao tratá-lo com ácido clorídrico (então chamado ácido muriático), obteve um gás amarelo-esverdeado, de cheiro sufocante, que descoloria flores e folhas.',
      'Scheele, seguindo a teoria da época, achou que o gás fosse um composto contendo oxigênio. Por mais de 30 anos, químicos o chamaram de "ácido muriático oxigenado".',
      'Em 1810, Humphry Davy tentou de todas as formas retirar oxigênio desse gás e não conseguiu. Concluiu que era um elemento e o chamou de chlorine, pela cor. Isso também mostrou que nem todos os ácidos contêm oxigênio, ao contrário do que Lavoisier pensava.',
    ],
    nameOrigin: 'Do grego chloros, "verde-amarelado", a cor do gás.',
    symbolOrigin: 'Cl são as duas primeiras letras de chlorum; C já era o símbolo do carbono.',
    nature: {
      text: 'Nunca é encontrado livre. Está principalmente no cloreto de sódio da água do mar e em depósitos de sal-gema, além de minerais como a silvita e a carnalita. É o halogênio mais abundante.',
      minerals: ['Halita (NaCl)', 'Silvita (KCl)', 'Carnalita'],
      where: ['oceanos', 'crosta', 'organismos', 'minerais'],
    },
    uses: [
      { area: 'ambiente', text: 'Desinfecção de água potável e de piscinas — uma das maiores conquistas da saúde pública.' },
      { area: 'industria', text: 'Produção de PVC, solventes, papel branqueado, tecidos e medicamentos.' },
      { area: 'medicina', text: 'Antissépticos e desinfetantes hospitalares (hipoclorito).' },
      { area: 'alimentos', text: 'O cloreto de sódio é o sal de cozinha.' },
    ],
    hazards: {
      level: 'alto',
      flags: ['toxico', 'oxidante', 'corrosivo'],
      text: 'O gás cloro é muito tóxico e irritante: ataca os olhos e as vias respiratórias e pode ser fatal em altas concentrações. Foi usado como arma química na Primeira Guerra Mundial (1915). Nunca se deve misturar água sanitária com produtos ácidos ou com amônia, pois isso libera gases tóxicos.',
    },
    curiosities: [
      'Sódio (metal que explode na água) e cloro (gás venenoso) formam juntos o inofensivo sal de cozinha.',
      'O ácido clorídrico é produzido no nosso estômago para ajudar na digestão.',
    ],
  },
  {
    z: 18,
    discoveryStory: [
      'Em 1785, Henry Cavendish fez faíscas elétricas passarem por ar misturado com oxigênio e removeu os produtos. Sobrou sempre uma pequena bolha de gás — cerca de 1/120 do volume — que não reagia. Ninguém deu muita importância a isso por mais de um século.',
      'Em 1892, Lord Rayleigh notou que o nitrogênio retirado do ar era cerca de 0,5% mais denso que o nitrogênio obtido de compostos químicos, como a amônia. Ele e William Ramsay suspeitaram que o "nitrogênio do ar" estivesse misturado com um gás desconhecido e mais pesado.',
      'Em 1894, Ramsay removeu todo o nitrogênio do ar fazendo-o reagir com magnésio aquecido. Sobrou um gás que não reagia com nada e mostrava linhas espectrais novas: o argônio. Rayleigh e Ramsay receberam os prêmios Nobel de Física e de Química de 1904.',
    ],
    nameOrigin: 'Do grego argos, "preguiçoso" ou "inativo", porque o gás não reagia com outras substâncias.',
    symbolOrigin: 'Ar são as duas primeiras letras de argon. Até 1957 usava-se apenas "A".',
    nature: {
      text: 'Forma cerca de 0,93% da atmosfera, sendo o terceiro gás mais abundante do ar, depois do nitrogênio e do oxigênio. Quase todo o argônio da Terra é argônio-40, produzido pelo decaimento radioativo do potássio-40 nas rochas.',
      where: ['atmosfera', 'crosta'],
    },
    uses: [
      { area: 'industria', text: 'Gás de proteção em soldagem (MIG/TIG) e na produção de aço e titânio.' },
      { area: 'iluminacao', text: 'Enchimento de lâmpadas incandescentes e fluorescentes, protegendo o filamento.' },
      { area: 'eletronica', text: 'Atmosfera inerte para crescer cristais de silício e germânio.' },
      { area: 'construcao', text: 'Isolante térmico entre os vidros de janelas duplas.' },
      { area: 'ciencia', text: 'Datação de rochas pelo método potássio-argônio.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['asfixiante'],
      text: 'Não é tóxico, mas por ser mais denso que o ar pode se acumular em locais baixos e fechados, causando asfixia.',
    },
    curiosities: [
      'Em 2000, cientistas finlandeses produziram o primeiro composto de argônio, o fluoroidreto de argônio (HArF), estável apenas a temperaturas muito baixas.',
      'Há mais argônio na atmosfera do que gás carbônico — cerca de 20 vezes mais.',
    ],
  },
  {
    z: 19,
    discoveryStory: [
      'A potassa — o carbonato de potássio obtido das cinzas de plantas fervidas em potes ("pot ashes") — era usada há séculos para fazer sabão e vidro, mas ninguém conseguia decompô-la.',
      'Em 6 de outubro de 1807, Humphry Davy aplicou uma corrente elétrica intensa, de uma grande bateria, a potassa cáustica (hidróxido de potássio) levemente úmida. No polo negativo apareceram pequenos glóbulos metálicos que explodiam em chamas violetas ao tocar o ar. Segundo seu assistente, Davy dançou de alegria pelo laboratório.',
      'Foi o primeiro metal isolado por eletrólise. Poucos dias depois, Davy usou o mesmo método para obter o sódio.',
    ],
    nameOrigin: 'Do inglês potash, "cinzas de pote", pois a potassa era obtida das cinzas de madeira.',
    symbolOrigin: 'K vem do latim kalium, derivado do árabe al-qali, "cinzas de plantas" — a mesma raiz da palavra "álcali".',
    nature: {
      text: 'É o sétimo elemento mais abundante da crosta (cerca de 2,1–2,4%). Muito reativo, nunca ocorre livre. Está em feldspatos e micas e em grandes depósitos de sais formados pela evaporação de mares antigos (silvita, carnalita). É essencial para plantas e animais.',
      minerals: ['Silvita (KCl)', 'Carnalita', 'Langbeinita', 'Feldspato potássico'],
      where: ['crosta', 'oceanos', 'organismos', 'minerais'],
    },
    uses: [
      { area: 'agricultura', text: 'Cerca de 95% do potássio produzido vira fertilizante (potássio é o "K" do NPK).' },
      { area: 'industria', text: 'Hidróxido de potássio em sabões líquidos, detergentes e baterias alcalinas.' },
      { area: 'alimentos', text: 'Cloreto de potássio como substituto do sal; o potássio é abundante em bananas, feijão e batata.' },
      { area: 'medicina', text: 'Reposição de potássio em pacientes; o elemento regula os batimentos cardíacos e os impulsos nervosos.' },
    ],
    hazards: {
      level: 'alto',
      flags: ['reativo', 'inflamavel', 'corrosivo'],
      text: 'O metal reage com a água de forma ainda mais violenta que o sódio, inflamando o hidrogênio liberado. É guardado sob óleo mineral. O potássio dos alimentos é seguro; distúrbios no nível de potássio do sangue, porém, afetam o coração.',
    },
    curiosities: [
      'Uma pequena fração do potássio natural é o isótopo radioativo potássio-40 — por isso nosso corpo e as bananas são levemente radioativos.',
      'Seus compostos dão uma cor lilás à chama.',
    ],
  },
  {
    z: 20,
    discoveryStory: [
      'A cal (óxido de cálcio) é usada desde a Antiguidade em argamassas: os romanos a misturavam com cinzas vulcânicas para fazer concreto. Lavoisier, em 1789, listou a cal entre as "terras", suspeitando que fosse o óxido de um metal.',
      'Humphry Davy tentou eletrolisar a cal úmida sem sucesso. Em 1808, seguindo uma ideia de Jöns Jacob Berzelius e do médico Magnus Martin af Pontin, que haviam obtido amálgamas de cálcio, Davy eletrolisou uma mistura de cal e óxido de mercúrio usando mercúrio como polo negativo.',
      'Formou-se um amálgama (liga com mercúrio). Ao destilar o mercúrio, sobrou o metal: o cálcio. No mesmo ano, Davy isolou também o magnésio, o estrôncio e o bário.',
    ],
    nameOrigin: 'Do latim calx (genitivo calcis), "cal" ou "calcário".',
    symbolOrigin: 'Ca são as duas primeiras letras de calcium; C já era o carbono.',
    nature: {
      text: 'É o quinto elemento mais abundante da crosta (mais de 3%). Forma enormes depósitos de calcário, mármore e giz (carbonato de cálcio), além de gesso e fluorita. Está nos ossos e dentes (como fosfato de cálcio) e nas conchas e corais (como carbonato).',
      minerals: ['Calcita (calcário, mármore)', 'Gipsita (gesso)', 'Fluorita', 'Apatita', 'Dolomita'],
      where: ['crosta', 'oceanos', 'organismos', 'minerais'],
    },
    uses: [
      { area: 'construcao', text: 'Cimento, cal, argamassa e gesso — base da construção civil.' },
      { area: 'industria', text: 'Calcário como fundente na produção de aço; cal no tratamento de água e na fabricação de papel.' },
      { area: 'agricultura', text: 'Calagem: o calcário corrige a acidez do solo.' },
      { area: 'medicina', text: 'Suplementos de cálcio e antiácidos à base de carbonato de cálcio.' },
      { area: 'alimentos', text: 'Nutriente essencial, presente no leite e derivados, vegetais verde-escuros e sardinhas.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['reativo'],
      text: 'O cálcio metálico reage com a água liberando hidrogênio, mas de forma menos violenta que o sódio. A cal viva (óxido de cálcio) é cáustica e pode queimar a pele e os olhos.',
    },
    curiosities: [
      'Um adulto tem cerca de 1 kg de cálcio no corpo, quase todo nos ossos e dentes.',
      'Os íons de cálcio controlam a contração dos músculos, inclusive do coração.',
    ],
  },
];
