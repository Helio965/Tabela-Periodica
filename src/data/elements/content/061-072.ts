import type { ElementContent } from '../../types';

/** Conteúdo educativo — elementos 61 a 72. */
export const CONTENT_061_072: ElementContent[] = [
  {
    z: 61,
    discoveryStory: [
      'Em 1902, o químico tcheco Bohuslav Brauner previu que faltava um elemento entre o neodímio e o samário. Em 1914, Henry Moseley confirmou, com raios X, que havia de fato uma lacuna no número atômico 61.',
      'Nas décadas seguintes, grupos na Itália ("florêncio") e nos EUA ("ilínio") anunciaram tê-lo encontrado em minerais, mas os resultados não se confirmaram: o elemento 61 não tem isótopos estáveis e praticamente não existe na Terra.',
      'Em 1945, no Laboratório Clinton (atual Oak Ridge), Jacob Marinsky, Lawrence Glendenin e Charles Coryell analisavam os produtos da fissão do urânio em um reator nuclear. Usando cromatografia de troca iônica, separaram e identificaram quimicamente isótopos do elemento 61. A descoberta foi anunciada em 1947, depois do fim do sigilo da guerra. O nome foi sugerido pela esposa de Coryell, Grace Mary.',
    ],
    nameOrigin: 'De Prometeu, o titã da mitologia grega que roubou o fogo dos deuses — simbolizando a ousadia e os riscos de dominar a energia nuclear.',
    symbolOrigin: 'Pm são a primeira e a terceira letras de promethium (Pr já era o praseodímio).',
    nature: {
      text: 'Praticamente não existe na natureza: há apenas traços ínfimos em minérios de urânio, produzidos pela fissão espontânea do urânio-238. Foi detectado no espectro de algumas estrelas. Todo o promécio usado é obtido em reatores nucleares.',
      where: ['crosta', 'estrelas', 'apenas-laboratorio'],
    },
    uses: [
      { area: 'energia', text: 'Baterias nucleares de longa duração: o promécio-147 emite partículas beta que geram eletricidade, em aplicações como marca-passos antigos e sondas.' },
      { area: 'industria', text: 'Medidores de espessura de materiais finos.' },
      { area: 'tecnologia', text: 'Já foi usado em tintas luminescentes de mostradores e sinalizadores.' },
    ],
    hazards: {
      level: 'alto',
      flags: ['radioativo'],
      text: 'Todos os isótopos são radioativos. O promécio-147 emite radiação beta de baixa energia, perigosa principalmente se for inalado ou ingerido. Só é manuseado em instalações autorizadas.',
    },
    curiosities: [
      'É, junto com o tecnécio, um dos dois únicos elementos mais leves que o bismuto sem nenhum isótopo estável.',
      'O promécio metálico só foi preparado pela primeira vez em 1963.',
    ],
  },
  {
    z: 62,
    discoveryStory: [
      'Em 1853, o suíço Jean Charles Galissard de Marignac observou linhas espectrais que não se encaixavam em elementos conhecidos em amostras de didímio. Em 1878, Marc Delafontaine anunciou o "decípio", que depois se revelou uma mistura.',
      'Em 1879, o francês Paul-Émile Lecoq de Boisbaudran trabalhava com didímio extraído do mineral samarskita. Usando espectroscopia e precipitações fracionadas, identificou um novo elemento e o chamou de samário, pelo nome do mineral.',
      'Em 1901, Eugène Demarçay mostrou que o "samário" de Lecoq ainda continha um pouco de outro elemento: o európio.',
    ],
    nameOrigin: 'Do mineral samarskita, que por sua vez homenageia Vasili Samarsky-Bykhovets, oficial de minas russo.',
    symbolOrigin: 'Sm são a primeira e a terceira letras de samarium.',
    nature: {
      text: 'Ocorre com outras terras-raras em monazita (cerca de 2,8%) e bastnasita. Um de seus isótopos naturais, o samário-147, é radioativo com meia-vida de cerca de 100 bilhões de anos.',
      minerals: ['Monazita', 'Bastnasita', 'Samarskita'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'tecnologia', text: 'Ímãs de samário-cobalto, que resistem a altas temperaturas, em motores, sensores e equipamentos militares e aeroespaciais.' },
      { area: 'medicina', text: 'O samário-153 alivia a dor de metástases ósseas.' },
      { area: 'energia', text: 'Absorvedor de nêutrons em reatores nucleares.' },
      { area: 'ciencia', text: 'Datação de rochas muito antigas pelo método samário-neodímio.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'Pouco se sabe sobre sua toxicidade, considerada baixa. O metal pode inflamar quando em pó.',
    },
    curiosities: [
      'Foi o primeiro elemento cujo nome deriva (indiretamente) do nome de uma pessoa.',
      'Os ímãs de samário-cobalto foram os ímãs permanentes mais fortes até a chegada dos de neodímio, nos anos 1980.',
    ],
  },
  {
    z: 63,
    discoveryStory: [
      'Em 1892, Lecoq de Boisbaudran notou linhas espectrais estranhas em amostras de samário e gadolínio, mas não conseguiu explicá-las.',
      'Em 1896, o químico francês Eugène-Anatole Demarçay, especialista em espectroscopia, suspeitou que o samário estivesse contaminado por um elemento desconhecido. Por meio de longas séries de cristalizações de nitrato duplo de samário e magnésio, conseguiu concentrar a impureza.',
      'Em 1901, obteve o óxido relativamente puro e anunciou o novo elemento, batizando-o em homenagem à Europa.',
    ],
    nameOrigin: 'Do continente europeu, Europa.',
    symbolOrigin: 'Eu são as duas primeiras letras de europium.',
    nature: {
      text: 'É uma das terras-raras menos abundantes. Ocorre em monazita, bastnasita e xenotímio. Foi identificado espectroscopicamente no Sol e em outras estrelas.',
      minerals: ['Bastnasita', 'Monazita', 'Xenotímio'],
      where: ['crosta', 'minerais', 'estrelas'],
    },
    uses: [
      { area: 'iluminacao', text: 'Fósforos vermelhos e azuis de lâmpadas fluorescentes, LEDs e antigas TVs de tubo.' },
      { area: 'tecnologia', text: 'Marcas fluorescentes de segurança nas cédulas de euro, visíveis sob luz ultravioleta.' },
      { area: 'energia', text: 'Absorvedor de nêutrons em barras de controle de reatores.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['reativo'],
      text: 'Tem toxicidade baixa. É a terra-rara mais reativa: oxida rapidamente no ar e reage com a água.',
    },
    curiosities: [
      'O európio é tão reativo que precisa ser guardado sob óleo ou em atmosfera inerte.',
      'Alguns compostos de európio brilham em vermelho intenso sob luz ultravioleta.',
    ],
  },
  {
    z: 64,
    discoveryStory: [
      'Em 1880, em Genebra, Jean Charles Galissard de Marignac estudava os minerais samarskita e gadolinita. Ao separar suas "terras", observou linhas espectrais de um elemento desconhecido.',
      'Em 1886, Paul-Émile Lecoq de Boisbaudran isolou o óxido do novo elemento e, com a concordância de Marignac, o chamou de gadolínio, em homenagem a Johan Gadolin, pioneiro no estudo das terras-raras.',
      'O metal só foi obtido relativamente puro em 1935, por Félix Trombe.',
    ],
    nameOrigin: 'Do mineral gadolinita, que homenageia o químico finlandês Johan Gadolin, descobridor do ítrio. É um dos poucos elementos com nome de cientista que não foram sintetizados.',
    symbolOrigin: 'Gd são a primeira e a terceira letras de gadolinium.',
    nature: {
      text: 'Ocorre com as outras terras-raras na monazita e na bastnasita, das quais é separado por troca iônica e extração por solventes.',
      minerals: ['Monazita', 'Bastnasita', 'Gadolinita'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'medicina', text: 'Agentes de contraste à base de gadolínio realçam imagens de ressonância magnética.' },
      { area: 'energia', text: 'Absorve nêutrons térmicos melhor que qualquer outro elemento; usado em barras de controle e combustível nuclear.' },
      { area: 'tecnologia', text: 'Fósforos de telas de raios X e detectores; refrigeração magnética.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['toxico'],
      text: 'Os íons livres de gadolínio são tóxicos; por isso, nos contrastes médicos, ele fica preso em moléculas que o eliminam pelos rins. Em pacientes com insuficiência renal grave, há riscos raros.',
    },
    curiosities: [
      'É ferromagnético (atraído por ímãs) só abaixo de cerca de 20 °C — em um dia frio, uma peça de gadolínio gruda no ímã; num dia quente, não.',
      'O gadolínio-157 tem a maior capacidade de capturar nêutrons térmicos entre todos os isótopos estáveis.',
    ],
  },
  {
    z: 65,
    discoveryStory: [
      'Em 1843, Carl Gustaf Mosander, em Estocolmo, reexaminou a "ítria" obtida do mineral de Ytterby e conseguiu separá-la em três óxidos: um incolor (ítria propriamente dita), um amarelo e um rosado.',
      'Ele chamou o óxido amarelo de érbia e o rosado de térbia. Anos depois, por confusão entre químicos, os nomes foram trocados: o que hoje chamamos de térbia (óxido de térbio) corresponde à "érbia" original de Mosander.',
      'A existência do térbio chegou a ser questionada nas décadas seguintes, até ser confirmada no final do século XIX. O metal puro só foi obtido com as técnicas de troca iônica do século XX.',
    ],
    nameOrigin: 'Da vila de Ytterby, na Suécia, de onde vinha o mineral.',
    symbolOrigin: 'Tb são a primeira e a terceira letras de terbium.',
    nature: {
      text: 'É raro. Ocorre em monazita, xenotímio e euxenita e, sobretudo, em argilas de adsorção iônica do sul da China.',
      minerals: ['Monazita', 'Xenotímio', 'Euxenita'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'iluminacao', text: 'Fósforo verde de lâmpadas fluorescentes e telas.' },
      { area: 'tecnologia', text: 'Liga Terfenol-D, que muda de forma com o campo magnético, em sonares e atuadores.' },
      { area: 'energia', text: 'Pequenas adições a ímãs de neodímio para manter o desempenho em altas temperaturas (motores elétricos).' },
      { area: 'medicina', text: 'Isótopos como o térbio-161 são estudados para terapias contra o câncer.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'Pouco se sabe sobre sua toxicidade, considerada baixa como a das demais terras-raras.',
    },
    curiosities: [
      'Sais de térbio brilham em verde intenso sob luz ultravioleta.',
      'Alguns marcadores de segurança em cédulas usam fluorescência de térbio.',
    ],
  },
  {
    z: 66,
    discoveryStory: [
      'Em 1878, o óxido de érbio ("érbia") foi separado em vários componentes, entre eles a hólmia. Lecoq de Boisbaudran suspeitou que a própria hólmia escondesse mais um elemento.',
      'Em 1886, em Paris, ele dissolveu o óxido de hólmio em ácido e fez precipitações sucessivas com amônia — mais de 30 tentativas, segundo relatos — até conseguir uma fração com espectro diferente. Era o disprósio.',
      'O elemento só foi obtido em forma relativamente pura em 1906, por Georges Urbain, e o metal puro apenas nos anos 1950, com as técnicas de troca iônica desenvolvidas por Frank Spedding.',
    ],
    nameOrigin: 'Do grego dysprositos, "difícil de obter", por causa do trabalho árduo para isolá-lo.',
    symbolOrigin: 'Dy são a primeira e a segunda consoantes de dysprosium.',
    nature: {
      text: 'Ocorre em monazita, bastnasita e xenotímio e, principalmente, em argilas de adsorção iônica do sul da China.',
      minerals: ['Xenotímio', 'Monazita', 'Bastnasita'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'energia', text: 'Adicionado aos ímãs de neodímio para que funcionem em altas temperaturas — essencial em motores de carros elétricos e turbinas eólicas.' },
      { area: 'iluminacao', text: 'Lâmpadas de iodeto metálico de alta intensidade.' },
      { area: 'medicina', text: 'O disprósio-165 é usado no tratamento de inflamações articulares (radiossinovectomia).' },
      { area: 'tecnologia', text: 'Liga Terfenol-D e discos de armazenamento de dados.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'Tem toxicidade baixa. O pó metálico pode pegar fogo.',
    },
    curiosities: [
      'Abaixo de cerca de −188 °C (85 K), o disprósio se torna ferromagnético, como o ferro.',
      'É um dos elementos considerados mais críticos para a transição energética.',
    ],
  },
  {
    z: 67,
    discoveryStory: [
      'Em 1878, os suíços Jacques-Louis Soret e Marc Delafontaine observaram, no espectro de amostras de érbio, linhas de absorção de um elemento desconhecido, que Soret chamou de "elemento X".',
      'Em 1879, em Uppsala, Per Teodor Cleve trabalhava com a érbia e, depois de remover as impurezas conhecidas, separou dois óxidos novos: um marrom e outro verde. Chamou o marrom de hólmia e o verde de túlia.',
      'Ficou claro que a hólmia de Cleve era o "elemento X" de Soret. Mais tarde, descobriu-se que a hólmia ainda continha disprósio. O metal relativamente puro foi obtido em 1911.',
    ],
    nameOrigin: 'Do latim Holmia, nome de Estocolmo, cidade natal de Cleve.',
    symbolOrigin: 'Ho são as duas primeiras letras de holmium.',
    nature: {
      text: 'É uma das terras-raras menos abundantes. Ocorre em monazita, gadolinita e xenotímio.',
      minerals: ['Monazita', 'Gadolinita', 'Xenotímio'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'tecnologia', text: 'Peças polares de ímãs muito potentes, pois concentra campos magnéticos.' },
      { area: 'medicina', text: 'Lasers de hólmio (Ho:YAG) em cirurgias urológicas, como a quebra de cálculos renais.' },
      { area: 'ciencia', text: 'Padrão de calibração de espectrofotômetros (óxido de hólmio).' },
      { area: 'energia', text: 'Absorvedor de nêutrons em reatores.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'Tem toxicidade baixa, como as demais terras-raras.',
    },
    curiosities: [
      'Tem o maior momento magnético entre todos os elementos naturais.',
      'O óxido de hólmio muda de cor conforme a luz: amarelado à luz do dia e rosado sob lâmpadas fluorescentes.',
    ],
  },
  {
    z: 68,
    discoveryStory: [
      'Em 1843, Carl Gustaf Mosander separou a "ítria" de Ytterby em três frações. Ao óxido rosado ele chamou de térbia e ao amarelo, de érbia.',
      'Por volta de 1877, outros químicos trocaram os nomes, e o óxido rosado passou a ser chamado de érbia — o nome que permanece. Nas décadas seguintes, a "érbia" mostrou-se uma mistura que deu origem ao itérbio, ao escândio, ao hólmio e ao túlio.',
      'O óxido de érbio razoavelmente puro foi obtido em 1905 por Georges Urbain e Charles James, e o metal puro em 1934.',
    ],
    nameOrigin: 'Da vila de Ytterby, na Suécia.',
    symbolOrigin: 'Er são as duas primeiras letras de erbium.',
    nature: {
      text: 'Ocorre com outras terras-raras em minerais como xenotímio, euxenita e gadolinita e em argilas do sul da China.',
      minerals: ['Xenotímio', 'Euxenita', 'Gadolinita'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'tecnologia', text: 'Amplificadores de fibra óptica dopada com érbio: sustentam as comunicações intercontinentais por cabos submarinos.' },
      { area: 'medicina', text: 'Lasers de érbio em dermatologia e odontologia.' },
      { area: 'industria', text: 'Corante rosa para vidros, esmaltes e zircônias.' },
      { area: 'energia', text: 'Absorvedor de nêutrons em combustíveis nucleares.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'Tem toxicidade baixa.',
    },
    curiosities: [
      'Óculos de sol e joias às vezes usam vidro rosa colorido com érbio.',
      'Seu nome e o de outros três elementos vêm da mesma vila sueca: Ytterby.',
    ],
  },
  {
    z: 69,
    discoveryStory: [
      'Em 1879, Per Teodor Cleve, em Uppsala, retirou da érbia todas as impurezas conhecidas e obteve dois óxidos novos: a hólmia (marrom) e a túlia (verde).',
      'A túlia continha um elemento novo, que Cleve chamou de túlio, em homenagem a Thule, nome antigo do extremo norte da Europa.',
      'Obter túlio puro foi extremamente difícil. Em 1911, o químico Charles James, nos EUA, precisou de cerca de 15 mil cristalizações de bromato para conseguir uma amostra pura.',
    ],
    nameOrigin: 'De Thule, nome mitológico dado pelos antigos às terras do extremo norte, associado à Escandinávia.',
    symbolOrigin: 'Tm são a primeira e a terceira letras de thulium.',
    nature: {
      text: 'É uma das terras-raras menos abundantes, ainda assim mais comum na crosta que o ouro ou a prata. Ocorre em monazita, xenotímio e argilas de adsorção iônica.',
      minerals: ['Monazita', 'Xenotímio'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'medicina', text: 'O túlio-170 serve como fonte de raios X em equipamentos portáteis.' },
      { area: 'medicina', text: 'Lasers de fibra de túlio em cirurgias urológicas.' },
      { area: 'industria', text: 'Radiografia industrial de soldas.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'Tem toxicidade baixa.',
    },
    curiosities: [
      'Charles James fez cerca de 15 mil cristalizações para obter túlio puro.',
      'Por ser raro e caro, tem poucas aplicações comerciais.',
    ],
  },
  {
    z: 70,
    discoveryStory: [
      'Em 1878, em Genebra, Jean Charles Galissard de Marignac aqueceu nitrato de érbio até decompô-lo parcialmente e extraiu o resíduo com água. Obteve dois óxidos: um vermelho (a érbia) e um branco, novo.',
      'Chamou esse óxido branco de itérbia, de onde veio o elemento itérbio — mais um nome inspirado na vila de Ytterby.',
      'Mais tarde, descobriu-se que a itérbia de Marignac continha também lutécio (separado em 1907) e escândio. O metal relativamente puro só foi obtido em 1953.',
    ],
    nameOrigin: 'Da vila de Ytterby, na Suécia.',
    symbolOrigin: 'Yb são a primeira e a terceira letras de ytterbium.',
    nature: {
      text: 'Ocorre com outras terras-raras em monazita (cerca de 0,03%), xenotímio e gadolinita.',
      minerals: ['Monazita', 'Xenotímio', 'Gadolinita'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'tecnologia', text: 'Relógios atômicos ópticos de itérbio, entre os mais precisos do mundo.' },
      { area: 'industria', text: 'Lasers de fibra dopada com itérbio para corte e solda de metais.' },
      { area: 'medicina', text: 'O itérbio-169 é estudado como fonte de radiação em braquiterapia e radiografia portátil.' },
      { area: 'industria', text: 'Melhora propriedades mecânicas do aço inoxidável.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'Tem baixa toxicidade aguda, mas deve ser manuseado com cuidado; o pó metálico pode pegar fogo.',
    },
    curiosities: [
      'Relógios de itérbio atrasariam menos de um segundo em bilhões de anos.',
      'Sua resistência elétrica muda com a pressão, o que permite usá-lo em medidores de pressão de explosões e terremotos.',
    ],
  },
  {
    z: 71,
    discoveryStory: [
      'A itérbia de Marignac (1878) parecia ser o óxido de um único elemento. No início do século XX, porém, vários químicos suspeitaram que ela fosse uma mistura.',
      'Em 1907, o francês Georges Urbain, em Paris, separou a itérbia em duas frações por cristalizações fracionadas de nitratos e chamou o novo elemento de lutécio. Quase ao mesmo tempo, o austríaco Carl Auer von Welsbach chegou ao mesmo resultado e o chamou de cassiopeio, e o americano Charles James também o isolou.',
      'Como Urbain publicou primeiro, a Comissão Internacional de Pesos Atômicos adotou o nome lutécio em 1909. Na Alemanha e na Áustria, porém, o nome cassiopeio foi usado até a década de 1950. A IUPAC oficializou "lutetium" em 1949.',
    ],
    nameOrigin: 'De Lutetia, nome latino da cidade de Paris, onde trabalhava Urbain.',
    symbolOrigin: 'Lu são as duas primeiras letras de lutetium. Até 1949 o símbolo foi Lu ou Cp (cassiopeio), conforme o país.',
    nature: {
      text: 'É uma das terras-raras menos abundantes e uma das mais caras de separar. Ocorre em monazita e xenotímio.',
      minerals: ['Monazita', 'Xenotímio'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'medicina', text: 'O lutécio-177 é usado em terapias com radioligantes contra tumores neuroendócrinos e câncer de próstata.' },
      { area: 'medicina', text: 'Cristais de ortossilicato de lutécio detectam a radiação em tomógrafos PET.' },
      { area: 'industria', text: 'Catalisadores no refino de petróleo e na produção de polímeros.' },
      { area: 'ciencia', text: 'Datação de rochas e meteoritos pelo método lutécio-háfnio.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'Considerado de baixa toxicidade, mas, como as outras terras-raras, deve ser manuseado com cuidado.',
    },
    curiosities: [
      'O lutécio-176 natural é levemente radioativo, com meia-vida de cerca de 37 bilhões de anos.',
      'Há um debate antigo sobre se o grupo 3 da tabela deve conter lantânio ou lutécio; a IUPAC usa o formato com 15 lantanídeos.',
    ],
  },
  {
    z: 72,
    discoveryStory: [
      'Em 1913–1914, Henry Moseley mostrou que cada elemento tem um número atômico, medido pelos raios X que emite. Isso revelou uma lacuna no número 72.',
      'Muitos químicos procuraram o elemento 72 entre as terras-raras. Georges Urbain chegou a anunciar o "céltio". Mas Niels Bohr, com sua nova teoria da estrutura eletrônica, previu que o elemento 72 não seria uma terra-rara, e sim um "parente" do zircônio.',
      'Seguindo essa previsão, Dirk Coster e George de Hevesy, no instituto de Bohr em Copenhague, analisaram minérios de zircônio por espectroscopia de raios X. Em 1923, encontraram as linhas do elemento 72 — que estava "escondido" no zircônio o tempo todo.',
    ],
    nameOrigin: 'De Hafnia, nome latino de Copenhague, cidade onde foi descoberto.',
    symbolOrigin: 'Hf são a primeira e a terceira letras de hafnium.',
    nature: {
      text: 'Não forma minérios próprios: está sempre junto com o zircônio (geralmente de 1% a 3% em relação ao zircônio), com o qual é quimicamente quase idêntico. É obtido como subproduto da purificação do zircônio para a indústria nuclear.',
      minerals: ['Zircão', 'Baddeleyíta'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'energia', text: 'Barras de controle de reatores nucleares (absorve muitos nêutrons), inclusive em submarinos.' },
      { area: 'eletronica', text: 'Óxido de háfnio como isolante nos transistores dos processadores modernos.' },
      { area: 'aeroespacial', text: 'Superligas para turbinas e bocais de foguete; o carbeto de háfnio está entre os materiais mais resistentes ao calor.' },
      { area: 'industria', text: 'Eletrodos de corte a plasma.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['inflamavel'],
      text: 'Tem baixa toxicidade. Em pó fino, é pirofórico: pode pegar fogo espontaneamente no ar.',
    },
    curiosities: [
      'Foi um dos últimos elementos estáveis descobertos — e graças a uma previsão teórica da física quântica.',
      'Zircônio e háfnio são tão parecidos que foram necessários mais de 100 anos após a descoberta do zircônio para perceber que havia dois elementos.',
    ],
  },
];
