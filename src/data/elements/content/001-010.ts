import type { ElementContent } from '../../types';

/**
 * Conteúdo educativo — elementos 1 a 10.
 * Base: textos históricos e de usos do CIAAW, Jefferson Lab e Los Alamos
 * National Laboratory (via PubChem) e da tabela IUPAC de isótopos (IPTEI).
 */
export const CONTENT_001_010: ElementContent[] = [
  {
    z: 1,
    discoveryStory: [
      'No século XVII, vários químicos notaram que metais como ferro e zinco, ao reagirem com ácidos, liberavam bolhas de um gás que pegava fogo. Robert Boyle chegou a produzir esse gás em 1671, mas ninguém percebeu que se tratava de uma substância nova.',
      'Em 1766, o inglês Henry Cavendish recolheu o gás com cuidado, mediu sua densidade e mostrou que ele era muito mais leve que o ar. Chamou-o de "ar inflamável" e percebeu que era sempre o mesmo, qualquer que fosse o metal usado.',
      'Mais tarde, Cavendish observou que, ao queimar, o gás formava água. Antoine Lavoisier repetiu e interpretou esses experimentos e, em 1783, deu ao elemento o nome hydrogène — "gerador de água".',
    ],
    nameOrigin: 'Do grego hydro ("água") + genes ("que forma"): o hidrogênio, ao queimar no ar, produz água. O nome foi proposto por Lavoisier.',
    symbolOrigin: 'H é a inicial de Hydrogenium, a forma latina do nome.',
    nature: {
      text: 'É o elemento mais abundante do Universo: forma a maior parte das estrelas e dos planetas gigantes como Júpiter. Na Terra quase não existe livre; está combinado na água, nos hidrocarbonetos (petróleo e gás natural) e em todas as moléculas dos seres vivos.',
      minerals: ['Água (H₂O)', 'Gás natural (metano)', 'Petróleo'],
      where: ['estrelas', 'oceanos', 'organismos', 'atmosfera'],
    },
    uses: [
      { area: 'agricultura', text: 'Combinado ao nitrogênio do ar no processo Haber-Bosch para produzir amônia, base dos fertilizantes.' },
      { area: 'industria', text: 'Refino de petróleo (remoção de enxofre) e hidrogenação de óleos vegetais.' },
      { area: 'aeroespacial', text: 'Hidrogênio líquido com oxigênio líquido é um dos combustíveis de foguete mais eficientes.' },
      { area: 'energia', text: 'Células a combustível geram eletricidade a partir do hidrogênio, liberando apenas água.' },
      { area: 'ciencia', text: 'O deutério (²H) e o trítio (³H) são estudados como combustível da fusão nuclear.' },
    ],
    hazards: {
      level: 'moderado',
      flags: ['inflamavel'],
      text: 'O gás é extremamente inflamável e forma misturas explosivas com o ar em uma faixa ampla de concentrações. Não é tóxico, mas pode deslocar o oxigênio em ambientes fechados.',
    },
    curiosities: [
      'É o único elemento cujos isótopos têm nomes próprios: prótio, deutério e trítio.',
      'O Sol "queima" cerca de 600 milhões de toneladas de hidrogênio por segundo, transformando-o em hélio por fusão nuclear.',
      'O átomo de hidrogênio comum não tem nêutrons: é apenas um próton e um elétron.',
    ],
  },
  {
    z: 2,
    discoveryStory: [
      'Em 18 de agosto de 1868, durante um eclipse total do Sol visto da Índia, o astrônomo francês Pierre Janssen analisou a luz da borda solar com um espectroscópio — instrumento que separa a luz em suas cores. Ele notou uma linha amarela brilhante em uma posição que não correspondia exatamente à do sódio.',
      'Meses depois, o inglês Norman Lockyer estudou a mesma linha (com comprimento de onda de cerca de 587,49 nanômetros) e concluiu que nenhum elemento conhecido a produzia. Propôs que ela vinha de um elemento novo, existente no Sol, e o chamou de hélio.',
      'Por quase 30 anos, o hélio foi considerado um elemento "solar". Em 1895, William Ramsay tratou com ácido o mineral de urânio cleveíta e recolheu um gás cujo espectro mostrava a mesma linha amarela. Na mesma época, os suecos Per Teodor Cleve e Nils Langlet chegaram ao mesmo resultado. Mais tarde, Rutherford mostrou que as partículas alfa da radioatividade são núcleos de hélio.',
    ],
    nameOrigin: 'Do grego helios, "Sol", porque foi detectado primeiro no espectro solar.',
    symbolOrigin: 'He são as duas primeiras letras de helium. A segunda letra é necessária porque H já pertence ao hidrogênio.',
    nature: {
      text: 'É o segundo elemento mais abundante do Universo, mas é raro na Terra: como é muito leve, escapa da atmosfera para o espaço. O hélio que usamos vem de jazidas de gás natural, onde se acumula a partir do decaimento alfa de urânio e tório nas rochas.',
      minerals: ['Gás natural', 'Minerais de urânio (cleveíta, uraninita)'],
      where: ['estrelas', 'atmosfera', 'crosta'],
    },
    uses: [
      { area: 'medicina', text: 'Hélio líquido resfria os ímãs supercondutores dos aparelhos de ressonância magnética.' },
      { area: 'ciencia', text: 'Criogenia e pesquisa em supercondutividade a temperaturas próximas do zero absoluto.' },
      { area: 'industria', text: 'Gás de proteção em soldagem e na fabricação de semicondutores e fibras ópticas.' },
      { area: 'aeroespacial', text: 'Pressurização de tanques de combustível de foguetes e enchimento de balões científicos.' },
      { area: 'tecnologia', text: 'Misturado ao oxigênio, forma gases de respiração para mergulho profundo.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['asfixiante'],
      text: 'Não é tóxico nem inflamável. O risco é a asfixia: em locais fechados, pode deslocar o oxigênio. Inalar hélio de balões para "afinar a voz" pode causar perda de consciência.',
    },
    curiosities: [
      'É o único elemento que não solidifica à pressão atmosférica, mesmo perto do zero absoluto.',
      'Abaixo de 2,17 K, o hélio-4 líquido vira um superfluido: escoa sem atrito e consegue "subir" pelas paredes do recipiente.',
      'A voz fica fina ao inalar hélio porque o som se propaga mais rápido nesse gás do que no ar.',
    ],
  },
  {
    z: 3,
    discoveryStory: [
      'Em 1800, o brasileiro José Bonifácio de Andrada e Silva descreveu um novo mineral encontrado na ilha sueca de Utö: a petalita. Em 1817, o jovem químico Johan August Arfwedson, que trabalhava no laboratório de Jöns Jacob Berzelius em Estocolmo, analisou esse mineral.',
      'Arfwedson encontrou no mineral um álcali que, à primeira vista, parecia ser soda (composto de sódio). Mas as quantidades medidas não batiam com as do sódio, e os sais tinham propriedades diferentes. Ele concluiu que se tratava de um álcali novo — e, portanto, de um novo elemento.',
      'Arfwedson não conseguiu obter o metal. Pequenas quantidades foram isoladas por eletrólise por William Brande e Humphry Davy em 1821, e Robert Bunsen e Augustus Matthiessen produziram quantidades maiores em 1855, eletrolisando cloreto de lítio fundido.',
    ],
    nameOrigin: 'Do grego lithos, "pedra", porque foi descoberto em um mineral, enquanto o sódio e o potássio eram conhecidos a partir de cinzas de plantas.',
    symbolOrigin: 'Li são as duas primeiras letras de lithium.',
    nature: {
      text: 'Não existe livre na natureza por ser muito reativo. Aparece em pequenas quantidades em rochas ígneas, em minerais como espodumênio e lepidolita e, principalmente, em salmouras de lagos salgados, como os do "triângulo do lítio" (Chile, Argentina e Bolívia).',
      minerals: ['Espodumênio', 'Lepidolita', 'Petalita', 'Ambligonita', 'Salmouras'],
      where: ['crosta', 'oceanos', 'minerais'],
    },
    uses: [
      { area: 'energia', text: 'Baterias de íons de lítio de celulares, notebooks e carros elétricos.' },
      { area: 'medicina', text: 'Carbonato de lítio é um medicamento usado no tratamento do transtorno bipolar.' },
      { area: 'aeroespacial', text: 'Ligas de alumínio-lítio, leves e resistentes, para aviões.' },
      { area: 'industria', text: 'Graxas lubrificantes de alta temperatura, vidros e cerâmicas especiais.' },
      { area: 'aeroespacial', text: 'Hidróxido de lítio remove o gás carbônico do ar em naves espaciais e submarinos.' },
    ],
    hazards: {
      level: 'moderado',
      flags: ['reativo', 'inflamavel', 'corrosivo'],
      text: 'O metal reage com a água liberando hidrogênio e formando hidróxido corrosivo; pode pegar fogo. Baterias de lítio danificadas podem superaquecer e incendiar. Como medicamento, exige acompanhamento médico, pois a dose terapêutica é próxima da tóxica.',
    },
    curiosities: [
      'É o metal mais leve: sua densidade é cerca de metade da densidade da água.',
      'O lítio está entre os poucos elementos formados no Big Bang, junto com hidrogênio e hélio.',
      'Seus compostos dão uma cor vermelho-carmim à chama.',
    ],
  },
  {
    z: 4,
    discoveryStory: [
      'O berilo e a esmeralda eram conhecidos desde a Antiguidade, mas ninguém sabia que eram o mesmo mineral. Em 1798, o mineralogista René-Just Haüy notou que tinham a mesma forma cristalina e pediu ao químico Louis-Nicolas Vauquelin que os analisasse.',
      'Vauquelin dissolveu os minerais e separou seus componentes. Encontrou uma "terra" (óxido) parecida com a alumina, mas que se comportava de forma diferente: não formava alúmen, dissolvia-se em carbonato de amônio e produzia sais de sabor adocicado. Concluiu que continha um elemento novo.',
      'O metal só foi isolado em 1828, de forma independente, por Friedrich Wöhler (Alemanha) e Antoine Bussy (França), que aqueceram cloreto de berílio com potássio.',
    ],
    nameOrigin: 'Do grego beryllos, nome do mineral berilo. Por causa do sabor doce de seus sais, o elemento também foi chamado de glucínio (de glykys, "doce") até 1949, quando a IUPAC adotou o nome berílio.',
    symbolOrigin: 'Be são as duas primeiras letras de beryllium; B já era o símbolo do boro.',
    nature: {
      text: 'É relativamente raro na crosta. Ocorre em cerca de 30 minerais; os principais comercialmente são o berilo e a bertrandita. Variedades preciosas do berilo incluem a esmeralda (verde) e a água-marinha (azul).',
      minerals: ['Berilo', 'Bertrandita', 'Crisoberilo', 'Fenacita'],
      where: ['crosta', 'minerais'],
    },
    uses: [
      { area: 'aeroespacial', text: 'Metal muito leve e rígido, usado em satélites e nos espelhos do Telescópio Espacial James Webb.' },
      { area: 'ciencia', text: 'Janelas de tubos de raios X, pois é quase transparente a essa radiação.' },
      { area: 'industria', text: 'Ligas de cobre-berílio para molas e ferramentas que não soltam faíscas.' },
      { area: 'energia', text: 'Moderador e refletor de nêutrons em reatores nucleares.' },
    ],
    hazards: {
      level: 'alto',
      flags: ['toxico'],
      text: 'O berílio e seus compostos são tóxicos. Inalar poeira ou fumos de berílio pode causar beriliose, uma doença pulmonar crônica, e o elemento é classificado como cancerígeno. O metal sólido em peças acabadas apresenta risco bem menor.',
    },
    curiosities: [
      'Os primeiros químicos provavam o sabor dos compostos — e por isso o berílio era chamado de "glucínio" (doce).',
      'Os 18 segmentos do espelho principal do telescópio James Webb são de berílio revestido de ouro.',
    ],
  },
  {
    z: 5,
    discoveryStory: [
      'Compostos de boro, como o bórax, eram usados há séculos em soldas e vidros, mas o elemento em si era desconhecido. No início do século XIX, a eletrólise e o uso do potássio metálico como reagente permitiram atacar compostos antes impossíveis de decompor.',
      'Em 1808, os franceses Joseph Louis Gay-Lussac e Louis Jacques Thénard aqueceram ácido bórico com potássio e obtiveram um pó escuro, que identificaram como um novo elemento. Quase ao mesmo tempo, em Londres, Humphry Davy chegou ao mesmo resultado, primeiro por eletrólise e depois também com potássio.',
      'O boro obtido era impuro. Boro de alta pureza só foi produzido no século XX, por redução de seus haletos com hidrogênio em filamentos aquecidos.',
    ],
    nameOrigin: 'Do árabe buraq e do persa burah, nomes do bórax; o "-on" final foi inspirado em carbon, elemento com o qual o boro se parece em alguns aspectos.',
    symbolOrigin: 'B é a inicial de boron (inglês) e borium.',
    nature: {
      text: 'Não ocorre livre. Aparece como ácido bórico em águas de fontes vulcânicas e como boratos em depósitos de lagos secos. A Turquia e os Estados Unidos (deserto de Mojave) têm as maiores jazidas.',
      minerals: ['Bórax (tincal)', 'Kernita', 'Colemanita', 'Ulexita'],
      where: ['crosta', 'oceanos', 'organismos', 'minerais'],
    },
    uses: [
      { area: 'industria', text: 'Vidro borossilicato (como o Pyrex), resistente a mudanças bruscas de temperatura.' },
      { area: 'energia', text: 'O boro-10 absorve nêutrons e é usado em barras de controle de reatores nucleares.' },
      { area: 'agricultura', text: 'Micronutriente essencial para as plantas, presente em fertilizantes.' },
      { area: 'medicina', text: 'Terapia por captura de nêutrons em boro (BNCT), estudada contra certos tumores.' },
      { area: 'tecnologia', text: 'Ímãs de neodímio-ferro-boro e fibras de boro em compósitos leves.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'O boro elementar e os boratos comuns têm baixa toxicidade, embora o ácido bórico seja nocivo se ingerido em quantidade. Alguns hidretos de boro (boranos) são muito tóxicos e inflamáveis.',
    },
    curiosities: [
      'O boro dá cor verde a fogos de artifício e sinalizadores.',
      'O nitreto de boro cúbico é um dos materiais mais duros conhecidos, perdendo apenas para o diamante.',
    ],
  },
  {
    z: 6,
    discoveryStory: [
      'O carbono é conhecido desde a pré-história na forma de carvão vegetal e fuligem, usados em pinturas rupestres e para fundir metais. Os diamantes e o grafite também eram conhecidos, mas ninguém imaginava que fossem a mesma substância.',
      'No século XVIII, Antoine Lavoisier mostrou que o diamante, ao queimar, produzia o mesmo gás que o carvão (gás carbônico). Em 1797, Smithson Tennant demonstrou que uma massa de diamante produzia exatamente a mesma quantidade de gás carbônico que a mesma massa de carvão — provando que o diamante é carbono puro.',
      'Lavoisier incluiu o carbono em sua lista de elementos de 1789. No século XX foram descobertas novas formas: os fulerenos (1985), os nanotubos (1991) e o grafeno, isolado em 2004.',
    ],
    nameOrigin: 'Do latim carbo, "carvão".',
    symbolOrigin: 'C é a inicial de carbo/carbonium.',
    nature: {
      text: 'É o quarto elemento mais abundante do Universo e a base química de todos os seres vivos. Na Terra, está nas rochas carbonáticas (calcário, mármore), no petróleo, carvão e gás natural, no gás carbônico do ar e dissolvido nos oceanos. Diamantes naturais se formam no manto e chegam à superfície em rochas vulcânicas (kimberlitos).',
      minerals: ['Grafite', 'Diamante', 'Calcita (calcário)', 'Dolomita', 'Carvão mineral'],
      where: ['crosta', 'atmosfera', 'oceanos', 'organismos', 'estrelas'],
    },
    uses: [
      { area: 'energia', text: 'Combustíveis fósseis (carvão, petróleo, gás) ainda são a principal fonte de energia mundial.' },
      { area: 'industria', text: 'O coque reduz o minério de ferro na produção de aço; o negro de fumo reforça pneus e é pigmento de tintas.' },
      { area: 'tecnologia', text: 'Grafite em eletrodos de baterias de lítio, lápis e lubrificantes; fibras de carbono em compósitos leves.' },
      { area: 'ciencia', text: 'Datação por carbono-14 de materiais arqueológicos com até cerca de 50 mil anos.' },
      { area: 'joias', text: 'Diamantes em joalheria e, sobretudo, em ferramentas de corte industriais.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['baixo-risco'],
      text: 'O carbono puro tem baixa toxicidade, mas poeiras finas (carvão, negro de fumo) podem irritar os pulmões e ser inflamáveis. Muitos compostos de carbono são perigosos, como o monóxido de carbono (CO), gás tóxico e inodoro.',
    },
    curiosities: [
      'Forma mais compostos do que todos os outros elementos juntos (exceto o hidrogênio): são milhões de substâncias orgânicas.',
      'Desde 1961, a massa atômica de todos os elementos é medida em relação ao carbono-12.',
      'O grafeno, uma folha de carbono com um átomo de espessura, rendeu o Prêmio Nobel de Física de 2010.',
    ],
  },
  {
    z: 7,
    discoveryStory: [
      'No século XVIII, os químicos tentavam entender a combustão e a respiração usando a teoria do "flogisto". Sabiam que, quando uma vela queimava em um recipiente fechado, sobrava um ar onde nada mais queimava nem os animais conseguiam respirar.',
      'Em 1772, o médico escocês Daniel Rutherford, aluno de Joseph Black, fez animais respirarem em um volume de ar fechado e depois removeu o gás carbônico com uma solução alcalina. O gás que restava continuava apagando chamas e sufocando os animais: ele o chamou de "ar flogisticado" ou "ar nocivo".',
      'Scheele, Cavendish e Priestley estudaram o mesmo gás na mesma época. Lavoisier o reconheceu como elemento e o chamou de azote ("sem vida"); o nome nitrogène foi proposto por Jean-Antoine Chaptal em 1790.',
    ],
    nameOrigin: 'Do grego nitron (salitre, o nitrato de potássio) + genes ("que forma"): "formador de salitre". Em Portugal e na França também é chamado de azoto, do grego "sem vida".',
    symbolOrigin: 'N é a inicial de nitrogenium.',
    nature: {
      text: 'Forma cerca de 78% do volume da atmosfera, como gás N₂. Também está em todas as proteínas e no DNA dos seres vivos e em depósitos minerais de nitratos, como o salitre do Chile.',
      minerals: ['Salitre do Chile (nitrato de sódio)', 'Salitre (nitrato de potássio)'],
      where: ['atmosfera', 'organismos', 'crosta'],
    },
    uses: [
      { area: 'agricultura', text: 'Produção de amônia e fertilizantes nitrogenados — essenciais para alimentar a população mundial.' },
      { area: 'alimentos', text: 'Gás inerte para conservar alimentos embalados; nitrogênio líquido para congelamento rápido.' },
      { area: 'medicina', text: 'Nitrogênio líquido conserva amostras biológicas e é usado na remoção de verrugas (crioterapia).' },
      { area: 'eletronica', text: 'Atmosfera protetora na fabricação de semicondutores.' },
      { area: 'industria', text: 'Ácido nítrico, explosivos, náilon e muitos outros compostos.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['asfixiante'],
      text: 'O gás não é tóxico, mas em locais fechados pode deslocar o oxigênio e causar asfixia sem nenhum aviso (não tem cheiro). O nitrogênio líquido causa queimaduras pelo frio intenso (−196 °C).',
    },
    curiosities: [
      'As plantas não conseguem usar o N₂ do ar diretamente; dependem de bactérias fixadoras de nitrogênio ou de fertilizantes.',
      'O processo Haber-Bosch, que fixa o nitrogênio do ar em amônia, consome cerca de 1% a 2% de toda a energia do mundo.',
    ],
  },
  {
    z: 8,
    discoveryStory: [
      'Por volta de 1771–1772, o farmacêutico sueco Carl Wilhelm Scheele aqueceu óxido de mercúrio e outros compostos e obteve um gás em que as velas queimavam com brilho intenso. Chamou-o de "ar de fogo", mas seu livro só foi publicado em 1777.',
      'Em 1º de agosto de 1774, o clérigo inglês Joseph Priestley concentrou a luz do Sol com uma lente sobre óxido de mercúrio e recolheu o gás liberado. Notou que uma vela queimava vigorosamente nele e que um camundongo sobrevivia mais tempo do que no ar comum. Publicou o resultado, chamando o gás de "ar desflogisticado".',
      'Em Paris, Antoine Lavoisier repetiu os experimentos e entendeu o que acontecia: a combustão e a respiração eram reações com esse gás, e não liberação de "flogisto". Essa interpretação derrubou a teoria antiga e marcou o nascimento da química moderna.',
    ],
    nameOrigin: 'Do grego oxys ("ácido") + genes ("que forma"). Lavoisier acreditava, erradamente, que o oxigênio estava presente em todos os ácidos.',
    symbolOrigin: 'O é a inicial de oxygenium.',
    nature: {
      text: 'É o elemento mais abundante da crosta terrestre (cerca de 46% da massa), presente em silicatos, óxidos e carbonatos. Forma 21% do ar, cerca de 89% da massa da água e dois terços da massa do corpo humano. Quase todo o O₂ do ar foi produzido pela fotossíntese.',
      minerals: ['Quartzo (SiO₂)', 'Silicatos', 'Óxidos metálicos', 'Água'],
      where: ['atmosfera', 'oceanos', 'crosta', 'organismos', 'estrelas'],
    },
    uses: [
      { area: 'medicina', text: 'Oxigenoterapia em hospitais, para pacientes com dificuldade respiratória.' },
      { area: 'industria', text: 'Produção de aço: jatos de oxigênio queimam as impurezas do ferro-gusa.' },
      { area: 'industria', text: 'Maçaricos de oxiacetileno para corte e solda de metais.' },
      { area: 'aeroespacial', text: 'Oxigênio líquido é o oxidante de muitos foguetes.' },
      { area: 'ambiente', text: 'Tratamento de esgoto e de água; o ozônio (O₃) é usado como desinfetante.' },
    ],
    hazards: {
      level: 'moderado',
      flags: ['oxidante'],
      text: 'Não é inflamável, mas faz outros materiais queimarem com muito mais intensidade. Atmosferas enriquecidas em oxigênio aumentam muito o risco de incêndio. Respirar oxigênio puro por longos períodos ou sob pressão também pode ser tóxico.',
    },
    curiosities: [
      'O oxigênio líquido e o sólido têm cor azul-clara e são atraídos por ímãs.',
      'A camada de ozônio (O₃) na estratosfera filtra grande parte da radiação ultravioleta do Sol.',
      'As cores verde e vermelha das auroras polares vêm de átomos de oxigênio excitados.',
    ],
  },
  {
    z: 9,
    discoveryStory: [
      'Desde o século XVI, mineiros usavam a fluorita como "fundente" — algo que ajuda os minérios a derreter. Por volta de 1670, descobriu-se que a fluorita tratada com ácido corroía o vidro. Em 1771, Carl Wilhelm Scheele preparou o ácido responsável: o ácido fluorídrico.',
      'Em 1810, André-Marie Ampère sugeriu que esse ácido continha um elemento ainda desconhecido, semelhante ao cloro. Durante mais de 70 anos, químicos como Davy, Gay-Lussac e os irmãos Knox tentaram isolá-lo; vários sofreram envenenamentos graves, e alguns morreram. O problema: o flúor reage com quase tudo, inclusive com os recipientes.',
      'Em 26 de junho de 1886, o francês Henri Moissan conseguiu: fez a eletrólise de uma solução de fluoreto de potássio em ácido fluorídrico líquido, resfriada bem abaixo de 0 °C, em um tubo de platina-irídio fechado com tampas de fluorita. Um gás amarelo-pálido se formou no ânodo. O feito lhe rendeu o Prêmio Nobel de Química de 1906.',
    ],
    nameOrigin: 'Do latim fluere, "fluir": a fluorita era usada como fundente, para fazer os minérios fluírem ao derreter.',
    symbolOrigin: 'F é a inicial de fluorine (inglês) e fluorum.',
    nature: {
      text: 'Por ser extremamente reativo, nunca ocorre livre. É encontrado em minerais como a fluorita, a criolita e a fluorapatita, e em pequenas quantidades na água do mar, nos ossos e no esmalte dos dentes.',
      minerals: ['Fluorita (CaF₂)', 'Criolita', 'Fluorapatita'],
      where: ['crosta', 'oceanos', 'organismos', 'minerais'],
    },
    uses: [
      { area: 'medicina', text: 'Fluoretos em cremes dentais e na água de abastecimento ajudam a prevenir cáries.' },
      { area: 'medicina', text: 'O flúor-18 radioativo é usado no exame de PET (tomografia por emissão de pósitrons).' },
      { area: 'energia', text: 'O hexafluoreto de urânio (UF₆) permite separar isótopos de urânio para combustível nuclear.' },
      { area: 'industria', text: 'Polímeros como o PTFE (teflon), gases refrigerantes e gravação de vidro com ácido fluorídrico.' },
      { area: 'tecnologia', text: 'Cristais de fluorita em lentes para luz infravermelha e ultravioleta.' },
    ],
    hazards: {
      level: 'muito-alto',
      flags: ['toxico', 'reativo', 'oxidante', 'corrosivo'],
      text: 'O gás flúor é extremamente tóxico e corrosivo e reage violentamente com quase todas as substâncias. O ácido fluorídrico causa queimaduras profundas que podem ser fatais. Já os fluoretos em baixas doses, como nos cremes dentais, são seguros; em excesso causam fluorose.',
    },
    curiosities: [
      'É o elemento mais eletronegativo de todos (3,98 na escala de Pauling).',
      'O flúor reage até com alguns gases nobres, como o xenônio.',
      'O nome "fluorescência" vem da fluorita, mineral que brilha sob luz ultravioleta.',
    ],
  },
  {
    z: 10,
    discoveryStory: [
      'Depois de descobrir o argônio (1894) e encontrar o hélio na Terra (1895), William Ramsay suspeitava que faltavam outros gases inertes na tabela periódica, em uma coluna nova.',
      'Em 1898, Ramsay e seu assistente Morris Travers liquefizeram o ar e o deixaram evaporar lentamente, recolhendo as frações separadamente (destilação fracionada). Em maio encontraram o kriptônio e, em junho, uma fração mais leve que o argônio.',
      'Ao aplicar uma descarga elétrica nesse gás, viram um brilho vermelho-alaranjado intenso, nunca observado antes. Travers relatou que "o brilho do tubo contava sua própria história". Segundo o relato tradicional, o filho de Ramsay, de 13 anos, sugeriu o nome novum ("novo"), adaptado para o grego neon.',
    ],
    nameOrigin: 'Do grego neos, "novo".',
    symbolOrigin: 'Ne são as duas primeiras letras de neon; N já era o símbolo do nitrogênio.',
    nature: {
      text: 'Está entre os cinco elementos mais abundantes do Universo, mas é raro na Terra: forma apenas cerca de 0,0018% do ar. É obtido exclusivamente pela destilação fracionada do ar liquefeito.',
      where: ['atmosfera', 'estrelas'],
    },
    uses: [
      { area: 'iluminacao', text: 'Letreiros luminosos de "neon" vermelho-alaranjado.' },
      { area: 'tecnologia', text: 'Lasers de hélio-neônio, usados em leitores e instrumentos de alinhamento.' },
      { area: 'eletronica', text: 'Lâmpadas indicadoras de alta tensão e misturas de gases para a fabricação de chips (litografia).' },
      { area: 'ciencia', text: 'Neônio líquido como refrigerante criogênico.' },
    ],
    hazards: {
      level: 'baixo',
      flags: ['asfixiante'],
      text: 'É inerte e não tóxico. Como qualquer gás que desloca o oxigênio, pode causar asfixia em ambientes fechados.',
    },
    curiosities: [
      'Não forma nenhum composto químico estável conhecido.',
      'Só o neônio produz a cor vermelho-alaranjada dos letreiros; as outras cores vêm de outros gases ou de revestimentos fluorescentes.',
    ],
  },
];
