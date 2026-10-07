import type { ElementContent } from '../../types';

/** Conteúdo educativo — elementos 21 a 30. */
export const CONTENT_021_030: ElementContent[] = [
  {
    z: 21,
    discoveryStory: [
      'Em 1869, Dmitri Mendeleev deixou uma lacuna em sua tabela entre o cálcio e o titânio e previu as propriedades de um elemento desconhecido, que chamou de "eka-boro".',
      'Dez anos depois, em Uppsala, o sueco Lars Fredrik Nilson tentava obter itérbio puro a partir de cerca de 10 kg dos minerais euxenita e gadolinita. Ao analisar o espectro das frações separadas, encontrou linhas que não pertenciam a nenhum elemento conhecido. Isolou um óxido novo e chamou o elemento de escândio, em homenagem à Escandinávia.',
      'Ainda em 1879, seu colega Per Teodor Cleve mostrou que as propriedades do escândio coincidiam com as do eka-boro previsto por Mendeleev — uma das confirmações mais marcantes da tabela periódica. O metal só foi produzido em 1937, por eletrólise.',
    ],
    nameOrigin: 'Do latim Scandia, "Escandinávia", região onde foram encontrados os minerais de origem.',
    symbolOrigin: 'Sc são as duas primeiras letras de scandium; S já pertencia ao enxofre.',
    nature: {
      text: 'Está espalhado em quantidades minúsculas em mais de 800 minerais, mas raramente concentrado. O único mineral rico em escândio, a thortveitita, é raro. Hoje é obtido principalmente como subproduto do processamento de urânio, terras-raras e outros minérios. É relativamente mais abundante no Sol do que na Terra.',
      minerals: ['Thortveitita', 'Euxenita', 'Gadolinita'],
      where: ['crosta', 'minerais', 'estrelas'],
    },
    uses: [
      { area: 'aeroespacial', text: 'Pequenas adições de escândio tornam ligas de alumínio mais resistentes, usadas em aeronaves.' },
      { area: 'transporte', text: 'Quadros de bicicleta e equipamentos esportivos de alumínio-escândio.' },
      { area: 'iluminacao', text: 'Iodeto de escândio em lâmpadas de vapor metálico, que produzem luz parecida com a do Sol, para estádios e estúdios.' },
      { area: 'energia', text: 'Óxido de escândio em eletrólitos de células a combustível de óxido sólido.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'Pouco se sabe sobre a toxicidade do escândio; por precaução, seus compostos devem ser manuseados com cuidado. Não tem função biológica conhecida.',
    },
    curiosities: [
      'Foi uma das três previsões de Mendeleev confirmadas em poucos anos, ao lado do gálio e do germânio.',
      'Apesar de pouco conhecido, é mais abundante na crosta do que o chumbo.',
    ],
  },
  {
    z: 22,
    discoveryStory: [
      'Em 1791, o reverendo William Gregor, clérigo e mineralogista amador da Cornualha (Inglaterra), analisou uma areia preta e magnética do vale de Manaccan. Separou o ferro com um ímã e, ao tratar o resto com ácido, obteve o óxido impuro de um metal desconhecido, que chamou de "menaccanita".',
      'Em 1795, o químico alemão Martin Heinrich Klaproth encontrou o mesmo elemento no mineral rutilo, da Hungria. Sem saber das propriedades do metal, escolheu um nome "neutro", inspirado nos Titãs da mitologia grega. Mais tarde confirmou que a menaccanita de Gregor continha o mesmo elemento.',
      'Isolar o titânio puro foi muito difícil, porque ele se combina facilmente com oxigênio, nitrogênio e carbono. Matthew Hunter, nos EUA, produziu o metal 99,9% puro em 1910, e o processo industrial (processo Kroll) só surgiu na década de 1940.',
    ],
    nameOrigin: 'Dos Titãs, filhos de Urano (o Céu) e Gaia (a Terra) na mitologia grega. Klaproth, que também batizou o urânio, escolheu um nome mitológico.',
    symbolOrigin: 'Ti são as duas primeiras letras de titanium.',
    nature: {
      text: 'É o nono elemento mais abundante da crosta. Está presente em quase todas as rochas ígneas, principalmente nos minerais ilmenita e rutilo, encontrados em areias de praia. Rochas trazidas da Lua pela missão Apollo 17 continham mais de 12% de óxido de titânio.',
      minerals: ['Ilmenita', 'Rutilo', 'Anatásio', 'Titanita (esfeno)'],
      where: ['crosta', 'minerais', 'estrelas'],
    },
    uses: [
      { area: 'aeroespacial', text: 'Ligas de titânio em aviões, motores a jato e foguetes, por combinar leveza, resistência e tolerância ao calor.' },
      { area: 'medicina', text: 'Implantes dentários, próteses de quadril e parafusos ósseos: o titânio é compatível com o corpo humano.' },
      { area: 'industria', text: 'Dióxido de titânio é o pigmento branco de tintas, papel, plásticos, cremes dentais e protetores solares.' },
      { area: 'transporte', text: 'Peças de navios e equipamentos expostos à água do mar, que não o corrói.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'O titânio metálico é considerado não tóxico e é bem tolerado pelo organismo. Em pó fino, pode ser inflamável.',
    },
    curiosities: [
      'O Museu Guggenheim de Bilbao (Espanha) é revestido por placas finas de titânio.',
      'O titânio é um dos poucos metais que queimam em atmosfera de nitrogênio puro.',
    ],
  },
  {
    z: 23,
    discoveryStory: [
      'Em 1801, na Cidade do México, o mineralogista espanhol Andrés Manuel del Río analisou um mineral de chumbo marrom (hoje chamado vanadinita). Encontrou um metal cujos compostos assumiam muitas cores diferentes e o chamou de "pancrômio" e, depois, de "eritrônio", porque seus sais ficavam vermelhos ao aquecer.',
      'Del Río enviou amostras ao Instituto de França, mas parte da documentação se perdeu em um naufrágio. O químico francês Hippolyte Collet-Descotils analisou o material e concluiu, erradamente, que se tratava apenas de crômio impuro. Del Río aceitou o veredito e retirou sua reivindicação.',
      'Em 1830, o sueco Nils Gabriel Sefström encontrou o elemento em minério de ferro de Taberg e o chamou de vanádio, pelas cores belas de seus compostos. Pouco depois, Friedrich Wöhler mostrou que era o mesmo "eritrônio" de del Río. O metal foi isolado por Henry Roscoe em 1867.',
    ],
    nameOrigin: 'De Vanadís, outro nome de Freya, a deusa nórdica da beleza, por causa dos muitos compostos coloridos do elemento.',
    symbolOrigin: 'V é a inicial de vanadium.',
    nature: {
      text: 'Ocorre em cerca de 65 minerais, como vanadinita, carnotita e patronita, e também em rochas fosfáticas, alguns minérios de ferro e no petróleo bruto (especialmente da Venezuela). Alguns organismos marinhos, como as ascídias, acumulam vanádio no sangue.',
      minerals: ['Vanadinita', 'Carnotita', 'Patronita', 'Magnetita titanífera'],
      where: ['crosta', 'minerais', 'oceanos', 'organismos'],
    },
    uses: [
      { area: 'industria', text: 'Cerca de 80% vira ferrovanádio, adicionado ao aço para torná-lo mais resistente a impactos e ao desgaste (ferramentas, molas, eixos).' },
      { area: 'aeroespacial', text: 'Ligas de titânio-alumínio-vanádio em motores a jato e estruturas de aviões.' },
      { area: 'energia', text: 'Baterias de fluxo redox de vanádio para armazenar energia de fontes renováveis.' },
      { area: 'industria', text: 'Pentóxido de vanádio como catalisador na produção de ácido sulfúrico.' },
    ],
    hazards: {
      level: 'moderado',
      flags: ['toxico'],
      text: 'Os compostos de vanádio são tóxicos, especialmente o pentóxido (V₂O₅), cuja poeira irrita os pulmões e os olhos. O metal em peças é pouco perigoso.',
    },
    curiosities: [
      'Henry Ford usou aço-vanádio no Modelo T por ser mais leve e resistente.',
      'Seus íons em solução podem ser lilás, verdes, azuis ou amarelos, conforme o estado de oxidação.',
    ],
  },
  {
    z: 24,
    discoveryStory: [
      'Em 1761, foi encontrado nos Montes Urais um belo mineral laranja-avermelhado, o "chumbo vermelho da Sibéria" (crocoíta), muito usado depois como pigmento. Sua composição era um mistério.',
      'Em 1797, em Paris, Louis-Nicolas Vauquelin ferveu a crocoíta com carbonato de potássio, removeu o chumbo e obteve uma solução amarela que formava compostos de várias cores — vermelhos, amarelos e verdes. Concluiu que continha um metal novo.',
      'Em 1798, ele aqueceu o óxido desse metal com carvão em um forno e obteve o crômio metálico. No mesmo ano, detectou o elemento em rubis e esmeraldas, mostrando que ele era o responsável pelas suas cores.',
    ],
    nameOrigin: 'Do grego chroma, "cor", por causa dos compostos vivamente coloridos.',
    symbolOrigin: 'Cr são a primeira e a segunda consoantes de chromium.',
    nature: {
      text: 'O principal minério é a cromita (óxido de ferro e crômio), encontrada sobretudo na África do Sul, no Cazaquistão, na Índia e na Turquia. O crômio também colore minerais preciosos, como rubi, esmeralda e alexandrita.',
      minerals: ['Cromita', 'Crocoíta'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'industria', text: 'Aço inoxidável: com pelo menos cerca de 10,5% de crômio, o aço forma uma película protetora e não enferruja.' },
      { area: 'transporte', text: 'Cromagem decorativa e protetora de peças de carros, motos e torneiras.' },
      { area: 'industria', text: 'Curtimento de couro, pigmentos amarelos e verdes e preservação de madeira.' },
      { area: 'alimentos', text: 'O crômio(III) é considerado um micronutriente ligado ao metabolismo da glicose.' },
    ],
    hazards: {
      level: 'alto',
      flags: ['toxico', 'ambiental'],
      text: 'A toxicidade depende do estado de oxidação: o crômio(III) é pouco tóxico, mas o crômio(VI) (hexavalente) é cancerígeno, irrita a pele e as vias respiratórias e contamina águas subterrâneas.',
    },
    curiosities: [
      'O vermelho do rubi e o verde da esmeralda vêm do mesmo elemento: o crômio.',
      'O amarelo dos ônibus escolares americanos era tradicionalmente feito com pigmento de cromato de chumbo.',
    ],
  },
  {
    z: 25,
    discoveryStory: [
      'A pirolusita (dióxido de manganês) era usada desde a pré-história como pigmento preto e, na Antiguidade, para clarear o vidro. Os químicos do século XVIII a confundiam com minerais de ferro e com a magnetita.',
      'Em 1774, Carl Wilhelm Scheele estudou a pirolusita com cuidado (foi ao fazer isso que descobriu o cloro) e concluiu que ela continha um elemento desconhecido, mas não conseguiu isolá-lo.',
      'No mesmo ano, seu amigo Johan Gottlieb Gahn misturou pirolusita em pó com óleo e carvão e aqueceu a mistura em um cadinho. Obteve pequenos glóbulos de um metal novo: o manganês.',
    ],
    nameOrigin: 'Do latim magnes, "ímã", ou de magnesia nigra ("magnésia negra"), nome antigo da pirolusita, confundida com minerais magnéticos da região de Magnésia, na Grécia.',
    symbolOrigin: 'Mn são a primeira e a terceira letras de manganum, para diferenciar do magnésio (Mg).',
    nature: {
      text: 'É um dos metais mais comuns da crosta, em óxidos, silicatos e carbonatos. Grandes jazidas existem na África do Sul, Austrália, Gabão e Brasil. O fundo dos oceanos tem bilhões de toneladas de "nódulos polimetálicos" ricos em manganês. É um micronutriente essencial para plantas e animais.',
      minerals: ['Pirolusita', 'Rodocrosita', 'Psilomelano', 'Nódulos polimetálicos'],
      where: ['crosta', 'oceanos', 'organismos', 'minerais'],
    },
    uses: [
      { area: 'industria', text: 'Cerca de 90% do manganês vai para o aço: remove oxigênio e enxofre e aumenta a resistência. Trilhos de trem usam aço-manganês.' },
      { area: 'energia', text: 'Dióxido de manganês em pilhas alcalinas e manganês em baterias de íons de lítio.' },
      { area: 'transporte', text: 'Ligas de alumínio com manganês em latas de bebidas, que resistem à corrosão.' },
      { area: 'agricultura', text: 'Sulfato de manganês em fertilizantes e rações.' },
    ],
    hazards: {
      level: 'moderado',
      flags: ['toxico'],
      text: 'Em pequenas quantidades é essencial à vida, mas a inalação prolongada de poeira e fumos de manganês (em mineração e soldagem) pode causar danos neurológicos semelhantes ao mal de Parkinson.',
    },
    curiosities: [
      'O permanganato de potássio, de cor violeta intensa, é usado como desinfetante e oxidante.',
      'Pinturas rupestres pré-históricas usavam óxidos de manganês como pigmento preto.',
    ],
  },
  {
    z: 26,
    discoveryStory: [
      'O ferro é conhecido desde a pré-história. Os primeiros objetos de ferro, de mais de 5 mil anos atrás, foram feitos com ferro de meteoritos, que já vem quase puro e misturado com níquel.',
      'Por volta de 1200 a.C., povos da Anatólia e do Oriente Médio dominaram a técnica de extrair ferro de minérios, aquecendo-os com carvão em fornos. Isso deu início à Idade do Ferro, que transformou a agricultura, as armas e as ferramentas.',
      'Não há um "descobridor" do ferro. Mas a química moderna, a partir do século XVIII, explicou o processo: o carbono do carvão retira o oxigênio dos óxidos de ferro, liberando o metal.',
    ],
    nameOrigin: 'Do latim ferrum. A palavra "ferro" chegou ao português diretamente do latim.',
    symbolOrigin: 'Fe vem do latim ferrum.',
    nature: {
      text: 'É o elemento mais abundante da Terra como um todo (por massa), concentrado principalmente no núcleo, e o quarto mais abundante da crosta. Os principais minérios são a hematita e a magnetita; o Brasil é um dos maiores produtores mundiais, com grandes jazidas em Minas Gerais e no Pará. No corpo humano, o ferro está na hemoglobina do sangue.',
      minerals: ['Hematita', 'Magnetita', 'Goethita', 'Siderita', 'Pirita'],
      where: ['crosta', 'organismos', 'minerais', 'estrelas'],
    },
    uses: [
      { area: 'construcao', text: 'O aço (ferro com um pouco de carbono) é o metal mais usado do mundo: prédios, pontes e vergalhões.' },
      { area: 'transporte', text: 'Carros, navios, trens e trilhos.' },
      { area: 'industria', text: 'Máquinas, ferramentas, aço inoxidável e ímãs.' },
      { area: 'medicina', text: 'Suplementos de ferro tratam a anemia ferropriva.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'O ferro metálico é seguro. Em excesso no organismo (por exemplo, intoxicação acidental de crianças com suplementos) pode ser tóxico. Poeira fina de ferro pode ser inflamável.',
    },
    curiosities: [
      'O ferro-56 é um dos núcleos mais estáveis que existem; por isso a fusão nas estrelas massivas termina no ferro.',
      'O sangue é vermelho por causa do ferro na hemoglobina, que transporta oxigênio.',
      'O campo magnético da Terra é gerado pelo movimento do ferro líquido no núcleo externo.',
    ],
  },
  {
    z: 27,
    discoveryStory: [
      'Desde a Antiguidade, certos minerais eram usados para colorir vidros e cerâmicas de azul. Os mineiros alemães chamavam de "kobold" (duende) os minérios que pareciam conter metal, mas não o liberavam nos fornos e ainda soltavam vapores tóxicos (por causa do arsênio).',
      'Acreditava-se que a cor azul vinha do bismuto. Por volta de 1735, o químico sueco Georg Brandt investigou esses minérios em Estocolmo e mostrou que o azul vinha de um metal novo, que manteve o nome de cobalto.',
      'Brandt foi um dos primeiros a defender que esse e outros "semimetais" eram elementos verdadeiros, e não frutos de transformações alquímicas.',
    ],
    nameOrigin: 'Do alemão Kobold, "duende" ou "espírito maligno" das minas, a quem os mineiros culpavam pelos minérios "enganadores" e tóxicos.',
    symbolOrigin: 'Co são as duas primeiras letras de cobaltum. É diferente de CO (monóxido de carbono), que tem dois elementos.',
    nature: {
      text: 'Ocorre em minerais como cobaltita e eritrita, geralmente junto com minérios de níquel, cobre e prata, dos quais é obtido como subproduto. A República Democrática do Congo produz mais da metade do cobalto mundial. Faz parte da vitamina B12.',
      minerals: ['Cobaltita', 'Eritrita', 'Esmaltita', 'Heterogenita'],
      where: ['crosta', 'minerais', 'organismos', 'oceanos'],
    },
    uses: [
      { area: 'energia', text: 'Cátodos de baterias de íons de lítio de celulares e carros elétricos.' },
      { area: 'aeroespacial', text: 'Superligas resistentes ao calor em turbinas de aviões.' },
      { area: 'medicina', text: 'O cobalto-60 emite raios gama usados em radioterapia contra o câncer e na esterilização de material médico.' },
      { area: 'alimentos', text: 'O cobalto-60 também é usado na irradiação de alimentos para eliminar microrganismos.' },
      { area: 'industria', text: 'Ímãs permanentes (Alnico, samário-cobalto) e o pigmento "azul cobalto".' },
    ],
    hazards: {
      level: 'moderado',
      flags: ['toxico'],
      text: 'Em pequenas doses é essencial (vitamina B12), mas a exposição a poeiras de cobalto pode causar problemas pulmonares e alergias de pele. O cobalto-60 é uma fonte intensa de radiação e deve ficar sempre blindado.',
    },
    curiosities: [
      'O azul de muitas porcelanas chinesas antigas vem de pigmentos de cobalto.',
      'O cobalto-60 não existe na natureza: é produzido em reatores, irradiando o cobalto-59 natural com nêutrons.',
    ],
  },
  {
    z: 28,
    discoveryStory: [
      'Mineiros alemães encontravam um minério avermelhado que parecia minério de cobre, mas do qual não conseguiam extrair cobre. Chamaram-no de "Kupfernickel" — algo como "cobre do Nick", um duende travesso.',
      'Em 1751, o mineralogista sueco Axel Fredrik Cronstedt, em Estocolmo, aqueceu esse minério (hoje chamado nicolita, um arseneto de níquel) com carvão e obteve um metal branco e duro, atraído por ímãs, diferente do cobre. Concluiu que era um elemento novo e o chamou de níquel.',
      'Muitos químicos duvidaram, achando que fosse uma mistura de ferro, cobalto e arsênio. Em 1775, Torbern Bergman obteve níquel mais puro e confirmou que era um elemento.',
    ],
    nameOrigin: 'Do alemão Kupfernickel, nome dado pelos mineiros ao minério que "enganava" parecendo minério de cobre.',
    symbolOrigin: 'Ni são as duas primeiras letras de nickel.',
    nature: {
      text: 'É abundante no núcleo da Terra e nos meteoritos de ferro, que contêm de 5% a 20% de níquel. Na crosta, os principais minérios são a pentlandita (sulfeto) e as lateritas. Grandes jazidas estão na Indonésia, nas Filipinas, na Rússia, no Canadá (região de Sudbury) e no Brasil.',
      minerals: ['Pentlandita', 'Garnierita', 'Nicolita', 'Lateritas niquelíferas'],
      where: ['crosta', 'minerais', 'estrelas'],
    },
    uses: [
      { area: 'industria', text: 'Aço inoxidável: cerca de dois terços do níquel produzido vão para essas ligas.' },
      { area: 'energia', text: 'Baterias de níquel-hidreto metálico e cátodos ricos em níquel de baterias de lítio.' },
      { area: 'aeroespacial', text: 'Superligas de níquel em turbinas, resistentes a altas temperaturas.' },
      { area: 'industria', text: 'Catalisador na hidrogenação de óleos vegetais e niquelação de peças; moedas.' },
    ],
    hazards: {
      level: 'moderado',
      flags: ['toxico'],
      text: 'O níquel é uma causa comum de alergia de contato (em bijuterias e fechos). Poeira e fumos de alguns compostos de níquel são reconhecidos como cancerígenos por inalação.',
    },
    curiosities: [
      'Um quilograma de níquel pode ser estirado em um fio de cerca de 300 km.',
      'A cratera de Sudbury, no Canadá, uma das maiores jazidas de níquel, pode ter sido formada pelo impacto de um meteorito.',
    ],
  },
  {
    z: 29,
    discoveryStory: [
      'O cobre foi um dos primeiros metais usados pela humanidade: objetos de cobre nativo de cerca de 9000 a.C. foram encontrados no Oriente Médio. Ele aparece puro na natureza e pode ser martelado a frio.',
      'Por volta de 5000 a.C., surgiu a fundição: aquecer minérios coloridos, como a malaquita (verde), com carvão liberava o cobre. Depois, misturar cobre com estanho produziu o bronze, mais duro, iniciando a Idade do Bronze por volta de 3300 a.C.',
      'Os romanos obtinham grande parte do seu cobre na ilha de Chipre, que deu origem ao nome do metal.',
    ],
    nameOrigin: 'Do latim cuprum, abreviação de aes Cyprium, "metal de Chipre".',
    symbolOrigin: 'Cu vem do latim cuprum.',
    nature: {
      text: 'Às vezes ocorre nativo (puro), mas a maior parte vem de sulfetos, como a calcopirita, e de óxidos e carbonatos, como a malaquita e a azurita. O Chile é o maior produtor mundial; Peru e Brasil (Carajás, no Pará) também têm grandes minas. É um nutriente essencial em pequenas quantidades.',
      minerals: ['Calcopirita', 'Calcocita', 'Bornita', 'Malaquita', 'Azurita', 'Cuprita'],
      where: ['crosta', 'minerais', 'organismos'],
    },
    uses: [
      { area: 'eletronica', text: 'Fios elétricos, cabos e trilhas de circuitos — é o segundo melhor condutor, depois da prata, e muito mais barato.' },
      { area: 'energia', text: 'Motores, geradores, transformadores e turbinas eólicas.' },
      { area: 'construcao', text: 'Encanamentos de água e gás, telhados e coberturas.' },
      { area: 'industria', text: 'Ligas como latão (com zinco) e bronze (com estanho); moedas.' },
      { area: 'medicina', text: 'Superfícies de cobre têm ação antimicrobiana; o DIU de cobre é um método contraceptivo.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['ambiental'],
      text: 'O cobre metálico é seguro no uso cotidiano e essencial em pequenas doses. Em excesso, sais de cobre são tóxicos, especialmente para organismos aquáticos.',
    },
    curiosities: [
      'A Estátua da Liberdade é revestida de cobre; a cor verde é a pátina formada pela corrosão ao longo dos anos.',
      'Polvos e lulas têm sangue azul porque usam hemocianina, uma proteína com cobre, para transportar oxigênio.',
    ],
  },
  {
    z: 30,
    discoveryStory: [
      'O latão, liga de cobre e zinco, era fabricado desde a Antiguidade aquecendo cobre com o mineral calamina — sem que se soubesse que ela continha um metal novo. O zinco metálico é difícil de obter porque ferve a apenas 907 °C e escapa como vapor dos fornos comuns.',
      'Na Índia, em Zawar (Rajastão), produzia-se zinco metálico por destilação desde pelo menos o século XIV, e a China também o produzia em grande escala. Lingotes de zinco chegavam à Europa trazidos por comerciantes.',
      'Em 1746, o químico alemão Andreas Sigismund Marggraf aqueceu calamina com carvão em recipientes fechados e recolheu o zinco destilado, descrevendo o processo em detalhe. Por isso é tradicionalmente creditado com o isolamento do elemento na Europa.',
    ],
    nameOrigin: 'Do alemão Zink, termo usado por Paracelso no século XVI, possivelmente ligado a Zinke ("ponta, dente"), pela forma dos cristais do metal.',
    symbolOrigin: 'Zn são a primeira e a última consoantes de zinc/zincum.',
    nature: {
      text: 'O principal minério é a esfalerita (sulfeto de zinco), frequentemente associada ao chumbo. Também ocorre na smithsonita e na hemimorfita. É um nutriente essencial: faz parte de centenas de enzimas do corpo humano.',
      minerals: ['Esfalerita (blenda)', 'Smithsonita', 'Hemimorfita (calamina)', 'Franklinita'],
      where: ['crosta', 'minerais', 'organismos', 'oceanos'],
    },
    uses: [
      { area: 'construcao', text: 'Galvanização: uma camada de zinco protege o aço da ferrugem (telhas, postes, pregos). É o principal uso.' },
      { area: 'industria', text: 'Ligas como o latão e peças fundidas sob pressão.' },
      { area: 'energia', text: 'Pilhas alcalinas e de zinco-carbono.' },
      { area: 'medicina', text: 'Óxido de zinco em pomadas e protetores solares; suplementos de zinco.' },
      { area: 'agricultura', text: 'Micronutriente em fertilizantes e rações.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'O zinco tem baixa toxicidade. Inalar fumos de óxido de zinco recém-formado (em soldagem de metal galvanizado) causa a "febre dos fumos metálicos", com sintomas semelhantes aos da gripe.',
    },
    curiosities: [
      'A deficiência de zinco afeta o paladar, o olfato e o sistema imunológico.',
      'Desde 1982, a moeda de 1 centavo dos EUA é feita de zinco revestido de cobre.',
    ],
  },
];
