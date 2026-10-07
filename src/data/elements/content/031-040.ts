import type { ElementContent } from '../../types';

/** Conteúdo educativo — elementos 31 a 40. */
export const CONTENT_031_040: ElementContent[] = [
  {
    z: 31,
    discoveryStory: [
      'Em 1871, Mendeleev previu um elemento abaixo do alumínio, o "eka-alumínio", com massa atômica de cerca de 68 e densidade de cerca de 5,9 g/cm³.',
      'Em 1875, o francês Paul-Émile Lecoq de Boisbaudran, especialista em espectroscopia, examinava um concentrado de blenda de zinco dos Pireneus. No espectro, viu duas linhas violetas que nenhum elemento conhecido produzia. Ainda naquele ano, isolou o metal por eletrólise.',
      'Lecoq mediu a densidade do gálio como 4,7 g/cm³. Mendeleev escreveu dizendo que o valor deveria estar errado e que devia ser próximo de 5,9. Lecoq purificou melhor a amostra, mediu de novo e encontrou 5,9 — uma confirmação impressionante do poder preditivo da tabela periódica.',
    ],
    nameOrigin: 'Do latim Gallia, nome da França. Há quem diga que Lecoq ("o galo") também fez um trocadilho com o próprio nome, já que gallus é "galo" em latim — ele negou.',
    symbolOrigin: 'Ga são as duas primeiras letras de gallium.',
    nature: {
      text: 'Não forma minérios próprios: aparece em traços na bauxita, na esfalerita e no carvão. É obtido como subproduto do processamento da bauxita (para alumínio) e do zinco.',
      minerals: ['Bauxita', 'Esfalerita', 'Germanita', 'Diásporo'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'eletronica', text: 'Arseneto de gálio (GaAs) e nitreto de gálio (GaN) em LEDs, lasers, chips de alta frequência e carregadores rápidos.' },
      { area: 'iluminacao', text: 'O nitreto de gálio tornou possíveis os LEDs azuis e, com eles, os LEDs brancos (Nobel de Física de 2014).' },
      { area: 'energia', text: 'Células solares de alta eficiência usadas em satélites.' },
      { area: 'medicina', text: 'Gálio-67 e gálio-68 em exames de imagem (cintilografia e PET).' },
      { area: 'tecnologia', text: 'Ligas de baixo ponto de fusão, como o galinstan, substituto não tóxico do mercúrio em termômetros.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'Tem baixa toxicidade, mas deve ser manuseado com cuidado. O gálio líquido ataca e fragiliza o alumínio e outros metais, por isso não é permitido em bagagens de avião.',
    },
    curiosities: [
      'Derrete a 29,8 °C, mas só ferve acima de 2.200 °C: tem uma das maiores faixas de temperatura no estado líquido entre os metais.',
      'Assim como a água, o gálio se expande ao solidificar.',
    ],
  },
  {
    z: 32,
    discoveryStory: [
      'Em 1871, Mendeleev previu o "eka-silício", um elemento entre o silício e o estanho, com massa atômica 72, densidade 5,5 g/cm³ e um óxido de densidade 4,7.',
      'Em 1885, foi encontrado em uma mina de prata de Freiberg (Alemanha) um mineral novo, a argirodita. O químico Clemens Winkler a analisou e notou que a soma dos componentes conhecidos (prata e enxofre) dava apenas cerca de 93% — faltavam 7%.',
      'Em fevereiro de 1886, depois de meses de trabalho, Winkler isolou o elemento que faltava. Suas propriedades — massa atômica cerca de 72,3 e densidade 5,35 g/cm³ — batiam quase exatamente com as previsões de Mendeleev. Foi a confirmação mais espetacular da tabela periódica.',
    ],
    nameOrigin: 'Do latim Germania, "Alemanha", país do descobridor.',
    symbolOrigin: 'Ge são as duas primeiras letras de germanium.',
    nature: {
      text: 'É raro e disperso. Ocorre em minerais como argirodita e germanita, mas é obtido sobretudo como subproduto do refino de minérios de zinco e de certas cinzas de carvão.',
      minerals: ['Argirodita', 'Germanita', 'Esfalerita'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'eletronica', text: 'Foi o material dos primeiros transistores (1947); hoje é usado em ligas de silício-germânio para chips de alta velocidade.' },
      { area: 'tecnologia', text: 'Lentes e janelas para câmeras de infravermelho e visão noturna, pois é transparente a essa radiação.' },
      { area: 'tecnologia', text: 'Dióxido de germânio no núcleo das fibras ópticas.' },
      { area: 'ciencia', text: 'Detectores de radiação gama de alta resolução, feitos de germânio ultrapuro.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'O germânio e a maioria de seus compostos têm baixa toxicidade. Alguns compostos, como o germano (GeH₄), são tóxicos e inflamáveis. Suplementos "de germânio" vendidos como medicinais já causaram intoxicações graves.',
    },
    curiosities: [
      'Mendeleev previu até a temperatura de ebulição aproximada do tetracloreto de germânio.',
      'Durante a Segunda Guerra, o germânio foi estudado para detectores de radar, o que acelerou a invenção do transistor.',
    ],
  },
  {
    z: 33,
    discoveryStory: [
      'Compostos de arsênio, como os sulfetos amarelos (ouropigmento) e vermelhos (realgar), eram usados como pigmentos e venenos desde a Antiguidade pelos chineses, gregos e egípcios.',
      'O arsênio elementar foi provavelmente obtido pela primeira vez por volta de 1250 pelo alquimista e filósofo alemão Alberto Magno, que aqueceu ouropigmento com sabão. A atribuição, porém, é incerta.',
      'Em 1649, Johann Schröder publicou dois métodos para preparar o elemento. Mais tarde, Lavoisier o incluiu em sua lista de substâncias simples (1789).',
    ],
    nameOrigin: 'Do persa zarnikh ("ouropigmento"), que passou ao grego arsenikon, associado a arsenikos, "masculino" ou "potente".',
    symbolOrigin: 'As são as duas primeiras letras de arsenicum.',
    nature: {
      text: 'Pode ocorrer nativo, mas aparece principalmente em minerais como arsenopirita, realgar e ouropigmento, frequentemente junto com minérios de cobre, chumbo, ouro e prata. Em algumas regiões (como Bangladesh e partes do Chile e da Argentina), contamina naturalmente águas subterrâneas.',
      minerals: ['Arsenopirita', 'Realgar', 'Ouropigmento', 'Arsênio nativo'],
      where: ['crosta', 'minerais', 'oceanos'],
    },
    uses: [
      { area: 'eletronica', text: 'Arseneto de gálio em chips de alta frequência, LEDs e lasers; dopante de semicondutores.' },
      { area: 'medicina', text: 'O trióxido de arsênio é um medicamento eficaz contra a leucemia promielocítica aguda.' },
      { area: 'industria', text: 'Ligas de chumbo para baterias e munições; uso histórico como preservante de madeira (hoje restrito).' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['toxico', 'ambiental'],
      text: 'O arsênio e seus compostos inorgânicos são muito tóxicos e cancerígenos. A exposição crônica pela água contaminada causa lesões na pele, câncer e doenças cardiovasculares — um problema de saúde pública em vários países.',
    },
    curiosities: [
      'Foi tão usado em envenenamentos que ganhou o apelido de "pó da herança".',
      'Em pressão normal, o arsênio sólido passa direto a vapor (sublima) a cerca de 615 °C, sem derreter.',
    ],
  },
  {
    z: 34,
    discoveryStory: [
      'Em 1817, Jöns Jacob Berzelius e Johan Gottlieb Gahn eram sócios de uma fábrica de ácido sulfúrico em Gripsholm, na Suécia. No fundo das câmaras de chumbo acumulava-se uma lama avermelhada.',
      'Inicialmente acharam que a lama continha telúrio, porque soltava um cheiro forte parecido com o de compostos desse elemento. Berzelius investigou com cuidado e percebeu que não havia telúrio: era um elemento novo, semelhante ao telúrio e ao enxofre.',
      'Como o telúrio havia recebido o nome da Terra (Tellus), Berzelius batizou o novo elemento em homenagem à Lua.',
    ],
    nameOrigin: 'Do grego Selene, a Lua — em contraste com o telúrio, nomeado a partir de Tellus, a Terra.',
    symbolOrigin: 'Se são as duas primeiras letras de selenium.',
    nature: {
      text: 'Raramente forma minerais próprios; acompanha o enxofre em sulfetos de cobre, chumbo e outros metais. É obtido principalmente como subproduto do refino eletrolítico do cobre. Algumas plantas acumulam selênio de solos ricos nesse elemento; a castanha-do-pará é uma das maiores fontes alimentares.',
      minerals: ['Clausthalita', 'Eucairita', 'Sulfetos de cobre'],
      where: ['crosta', 'organismos', 'minerais'],
    },
    uses: [
      { area: 'industria', text: 'Descolorir o vidro (anula o tom verde do ferro) ou dar-lhe cor vermelho-rubi.' },
      { area: 'energia', text: 'Células solares de filme fino CIGS (cobre-índio-gálio-selênio).' },
      { area: 'agricultura', text: 'Suplemento em rações e fertilizantes em regiões com solos pobres em selênio.' },
      { area: 'medicina', text: 'Xampus anticaspa com sulfeto de selênio; o selênio é micronutriente essencial.' },
      { area: 'tecnologia', text: 'Por conduzir mais eletricidade na luz, foi usado em fotômetros e nos tambores das antigas fotocopiadoras.' },
    ],
    hazards: {
      level: 'moderado',
      flags: ['toxico'],
      text: 'É essencial em doses muito pequenas, mas tóxico em excesso: a margem entre o necessário e o prejudicial é estreita. O seleneto de hidrogênio (H₂Se) é um gás extremamente tóxico.',
    },
    curiosities: [
      'Comer muitas castanhas-do-pará de uma vez pode ultrapassar a dose diária segura de selênio.',
      'Seu efeito fotoelétrico inspirou, no século XIX, as primeiras tentativas de transmitir imagens à distância.',
    ],
  },
  {
    z: 35,
    discoveryStory: [
      'Em 1825, o estudante alemão Carl Löwig, em Kreuznach, tratou a água de uma fonte mineral com cloro e extraiu com éter um líquido vermelho de cheiro forte. Levou-o ao professor Leopold Gmelin, em Heidelberg, que o incentivou a produzir mais para estudá-lo.',
      'Enquanto Löwig se atrasava com provas e férias, o farmacêutico francês Antoine-Jérôme Balard, em Montpellier, estudava as águas-mães das salinas (o resíduo após cristalizar o sal marinho). Ao tratá-las com cloro, obteve o mesmo líquido vermelho-escuro.',
      'Balard mostrou que era um elemento, semelhante ao cloro e ao iodo, e publicou em 1826. Por isso recebeu o crédito, embora Löwig o tivesse obtido antes.',
    ],
    nameOrigin: 'Do grego bromos, "mau cheiro", por causa do odor forte e irritante de seus vapores. Balard queria chamá-lo de "muride", mas a Academia Francesa sugeriu "brome".',
    symbolOrigin: 'Br são as duas primeiras letras de bromum; B já era o boro.',
    nature: {
      text: 'Ocorre como brometos dissolvidos na água do mar (cerca de 65 a 85 mg por litro) e em salmouras subterrâneas e de lagos salgados. O Mar Morto e as salmouras dos EUA, de Israel e da Jordânia são as principais fontes.',
      minerals: ['Salmouras', 'Água do mar'],
      where: ['oceanos', 'crosta'],
    },
    uses: [
      { area: 'industria', text: 'Retardantes de chama bromados em plásticos, espumas e eletrônicos (alguns hoje restritos).' },
      { area: 'industria', text: 'Fluidos densos para perfuração de poços de petróleo.' },
      { area: 'ambiente', text: 'Desinfecção de piscinas e banheiras de hidromassagem.' },
      { area: 'medicina', text: 'Base de vários medicamentos; brometos foram os primeiros sedativos e anticonvulsivantes.' },
      { area: 'tecnologia', text: 'O brometo de prata foi a base da fotografia em filme.' },
    ],
    hazards: {
      level: 'alto',
      flags: ['toxico', 'corrosivo', 'oxidante'],
      text: 'O bromo líquido causa queimaduras graves na pele e seus vapores irritam os olhos, o nariz e os pulmões. Alguns compostos bromados, como o brometo de metila, destroem a camada de ozônio e foram banidos.',
    },
    curiosities: [
      'É o único não metal líquido à temperatura ambiente; entre os elementos, só ele e o mercúrio são líquidos nessas condições.',
      'O pigmento "púrpura de Tiro", corante dos imperadores romanos, é um composto de bromo extraído de moluscos.',
    ],
  },
  {
    z: 36,
    discoveryStory: [
      'Depois de descobrirem o argônio e o hélio, William Ramsay e Morris Travers suspeitavam que mais gases inertes estivessem escondidos no ar.',
      'Em maio de 1898, eles conseguiram ar líquido em quantidade, graças a uma máquina de liquefação recém-inventada. Deixaram-no evaporar lentamente e examinaram o pequeno resíduo que sobrava por último.',
      'Em 30 de maio de 1898, o espectro desse resíduo mostrou linhas amarelas e verdes brilhantes, diferentes de tudo que conheciam. Era o kriptônio. Nas semanas seguintes, o mesmo método revelou o neônio e o xenônio.',
    ],
    nameOrigin: 'Do grego kryptos, "escondido", porque estava oculto no ar.',
    symbolOrigin: 'Kr são as duas primeiras letras de krypton.',
    nature: {
      text: 'Forma cerca de 1 parte por milhão do ar. É obtido como subproduto da destilação fracionada do ar liquefeito. O kriptônio-85 radioativo é liberado no reprocessamento de combustível nuclear.',
      where: ['atmosfera'],
    },
    uses: [
      { area: 'iluminacao', text: 'Lâmpadas de alto desempenho, faróis de aeroportos e flashes de fotografia de alta velocidade.' },
      { area: 'construcao', text: 'Isolamento térmico entre os vidros de janelas de alto desempenho.' },
      { area: 'tecnologia', text: 'Lasers de fluoreto de kriptônio, usados em pesquisa de fusão e litografia.' },
      { area: 'aeroespacial', text: 'Propelente em propulsores iônicos de satélites, como os da constelação Starlink.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['asfixiante'],
      text: 'É inerte e não tóxico; como outros gases, pode causar asfixia em espaços fechados. Em altas concentrações tem efeito anestésico.',
    },
    curiosities: [
      'O nome lembra a "kriptonita" do Super-Homem, mas o elemento real é um gás incolor e inofensivo.',
      'Em 1963 foi preparado o difluoreto de kriptônio (KrF₂), mostrando que o kriptônio forma compostos.',
    ],
  },
  {
    z: 37,
    discoveryStory: [
      'Em 1859, Robert Bunsen e Gustav Kirchhoff, em Heidelberg, inventaram o espectroscópio de chama: cada elemento, ao ser aquecido, emite um conjunto próprio de linhas de cor — uma espécie de "impressão digital".',
      'Em 1861, ao analisar o mineral lepidolita, eles viram duas linhas vermelho-escuras que nenhum elemento conhecido produzia. Era o segundo elemento descoberto com o espectroscópio (o primeiro fora o césio, um ano antes).',
      'Para obter quantidades mensuráveis de sais de rubídio, eles tiveram de processar cerca de 150 kg de lepidolita. Bunsen obteve o metal em 1863.',
    ],
    nameOrigin: 'Do latim rubidus, "vermelho-escuro", a cor das linhas espectrais que revelaram o elemento.',
    symbolOrigin: 'Rb são a primeira e a terceira letras de rubidium.',
    nature: {
      text: 'É mais abundante do que se pensava (está entre os 25 elementos mais comuns da crosta), mas muito disperso: não forma minerais próprios e substitui o potássio em minerais como lepidolita e polucita. É obtido como subproduto do processamento do lítio e do césio.',
      minerals: ['Lepidolita', 'Polucita', 'Zinnwaldita'],
      where: ['crosta', 'oceanos', 'minerais'],
    },
    uses: [
      { area: 'tecnologia', text: 'Relógios atômicos de rubídio, compactos, usados em satélites de GPS e redes de telecomunicação.' },
      { area: 'ciencia', text: 'Pesquisa em física quântica: o primeiro condensado de Bose-Einstein (1995) foi feito com rubídio-87.' },
      { area: 'medicina', text: 'O rubídio-82 é usado em exames de PET para avaliar o fluxo sanguíneo do coração.' },
      { area: 'ciencia', text: 'Datação de rochas antigas pelo método rubídio-estrôncio.' },
    ],
    hazards: {
      level: 'alto',
      flags: ['reativo', 'inflamavel'],
      text: 'O metal reage violentamente com a água e pode pegar fogo espontaneamente no ar. É guardado em ampolas seladas ou sob óleo. Seus sais têm baixa toxicidade.',
    },
    curiosities: [
      'Derrete a apenas 39 °C — um dia muito quente poderia liquefazê-lo.',
      'O rubídio-87 natural é levemente radioativo, com meia-vida de cerca de 49 bilhões de anos.',
    ],
  },
  {
    z: 38,
    discoveryStory: [
      'Em 1787, foi encontrado nas minas de chumbo de Strontian, na Escócia, um mineral que se acreditava ser um carbonato de bário.',
      'Em 1790, o médico Adair Crawford e seu colega William Cruickshank, em Londres, notaram que o mineral se comportava de forma diferente dos compostos de bário e concluíram que continha uma "terra" nova. Em 1791–1792, Thomas Charles Hope, em Edimburgo, estudou-o em detalhe e observou que seus sais davam à chama uma cor vermelha intensa, diferente do verde do bário.',
      'Em 1808, Humphry Davy isolou o metal estrôncio por eletrólise, usando o mesmo método que empregara para o cálcio e o bário.',
    ],
    nameOrigin: 'De Strontian, vila da Escócia onde o mineral estroncianita foi encontrado.',
    symbolOrigin: 'Sr são a primeira e a terceira letras de strontium.',
    nature: {
      text: 'Ocorre principalmente nos minerais celestita (sulfato) e estroncianita (carbonato). Está presente na água do mar e é absorvido pelo corpo de forma parecida com o cálcio.',
      minerals: ['Celestita', 'Estroncianita'],
      where: ['crosta', 'oceanos', 'minerais'],
    },
    uses: [
      { area: 'tecnologia', text: 'Nitrato e carbonato de estrôncio dão o vermelho de fogos de artifício e sinalizadores de emergência.' },
      { area: 'industria', text: 'Ímãs de ferrita de estrôncio em alto-falantes e pequenos motores.' },
      { area: 'medicina', text: 'Alguns radioisótopos de estrôncio aliviam a dor de metástases ósseas; o cloreto de estrôncio é usado em cremes para dentes sensíveis.' },
      { area: 'tecnologia', text: 'Relógios atômicos ópticos de estrôncio estão entre os mais precisos do mundo.' },
      { area: 'energia', text: 'O estrôncio-90 já alimentou geradores termoelétricos em locais remotos.' },
    ],
    hazards: {
      level: 'moderado',
      flags: ['reativo', 'radioativo'],
      text: 'O estrôncio natural (estável) tem baixa toxicidade; o metal reage com água. O estrôncio-90, produzido na fissão nuclear e liberado em testes atômicos e acidentes, é perigoso porque se acumula nos ossos no lugar do cálcio.',
    },
    curiosities: [
      'Foi o estrôncio-90 dos testes nucleares, detectado em dentes de leite de crianças, que ajudou a motivar o tratado de proibição de testes atmosféricos de 1963.',
      'Os quatro isótopos naturais do estrôncio são estáveis.',
    ],
  },
  {
    z: 39,
    discoveryStory: [
      'Em 1787, o tenente e químico amador sueco Carl Axel Arrhenius encontrou um mineral negro e pesado em uma pedreira de feldspato em Ytterby, perto de Estocolmo.',
      'Em 1794, o químico finlandês Johan Gadolin, em Turku (Åbo), analisou o mineral e descobriu nele uma "terra" (óxido) nova, que chamou de ítria. Foi a primeira das chamadas "terras-raras".',
      'Mais tarde, a ítria revelou-se uma mistura de vários óxidos, dos quais saíram muitos outros elementos. O ítrio impuro foi obtido por Friedrich Wöhler em 1828. O mineral original passou a se chamar gadolinita, em homenagem a Gadolin.',
    ],
    nameOrigin: 'Da vila de Ytterby, na Suécia, onde foi encontrado o mineral de origem.',
    symbolOrigin: 'Y é a inicial de yttrium.',
    nature: {
      text: 'Ocorre em quase todos os minerais de terras-raras, como monazita, xenotímio e bastnasita, e em argilas de adsorção iônica do sul da China. Amostras lunares das missões Apollo mostraram teor relativamente alto de ítrio.',
      minerals: ['Xenotímio', 'Monazita', 'Gadolinita', 'Bastnasita'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'iluminacao', text: 'Fósforos de óxido de ítrio com európio produzem a cor vermelha de telas e lâmpadas; o YAG com cério gera a luz dos LEDs brancos.' },
      { area: 'tecnologia', text: 'Lasers Nd:YAG (granada de ítrio e alumínio) em indústria, medicina e estética.' },
      { area: 'medicina', text: 'O ítrio-90 é usado em radioterapia interna de alguns cânceres do fígado.' },
      { area: 'tecnologia', text: 'Óxido de ítrio estabiliza a zircônia de próteses dentárias e cerâmicas técnicas.' },
      { area: 'ciencia', text: 'O supercondutor YBCO (ítrio-bário-cobre-óxido) funciona acima da temperatura do nitrogênio líquido.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'Os compostos de ítrio têm toxicidade baixa a moderada; a poeira pode irritar os pulmões. Não tem função biológica conhecida.',
    },
    curiosities: [
      'A pedreira de Ytterby deu nome a quatro elementos: ítrio, itérbio, térbio e érbio.',
      'Apesar de não ser um lantanídeo, o ítrio é classificado entre as "terras-raras" por ter química muito parecida.',
    ],
  },
  {
    z: 40,
    discoveryStory: [
      'O zircão é conhecido como pedra preciosa desde a Antiguidade e já foi confundido com o diamante. Em 1789, em Berlim, Martin Heinrich Klaproth analisou um zircão (jargão) do Ceilão (atual Sri Lanka).',
      'Klaproth aqueceu o mineral com hidróxido de sódio, separou a sílica e obteve um óxido desconhecido, que chamou de zircônia. Concluiu que continha um novo elemento.',
      'O metal impuro foi obtido por Berzelius em 1824, aquecendo um fluoreto de zircônio e potássio com potássio metálico. Zircônio puro só foi produzido em 1914; a dificuldade era separá-lo do háfnio, quimicamente quase idêntico, que só seria descoberto em 1923.',
    ],
    nameOrigin: 'Do persa zargun, "cor de ouro", pela cor de alguns zircões, através do árabe zarkun.',
    symbolOrigin: 'Zr são a primeira e a terceira letras de zirconium.',
    nature: {
      text: 'O principal mineral é o zircão (silicato de zircônio), muito resistente, encontrado em areias de praia junto com ilmenita e rutilo. Também ocorre na baddeleyíta. O zircão sempre contém um pouco de háfnio. Austrália e África do Sul são os maiores produtores.',
      minerals: ['Zircão', 'Baddeleyíta'],
      where: ['crosta', 'minerais', 'estrelas'],
    },
    uses: [
      { area: 'energia', text: 'Ligas de zircônio (zircaloy) revestem o combustível dos reatores nucleares, pois quase não absorvem nêutrons.' },
      { area: 'medicina', text: 'Zircônia (óxido de zircônio) em coroas e implantes dentários e próteses.' },
      { area: 'joias', text: 'A zircônia cúbica sintética imita o diamante em joias.' },
      { area: 'industria', text: 'Equipamentos resistentes à corrosão na indústria química; cerâmicas refratárias e abrasivos.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['inflamavel'],
      text: 'O zircônio e seus compostos têm baixa toxicidade. Em pó fino, o metal pode pegar fogo espontaneamente no ar.',
    },
    curiosities: [
      'Cristais de zircão de Jack Hills, na Austrália, com cerca de 4,4 bilhões de anos, são os fragmentos mais antigos conhecidos da crosta terrestre.',
      'O zircão retém urânio, mas expulsa chumbo ao se formar — por isso é excelente para datação de rochas.',
    ],
  },
];
