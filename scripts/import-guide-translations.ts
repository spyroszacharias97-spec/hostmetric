import { neon } from "@neondatabase/serverless";

const GUIDE_ID = 1;

type TranslationStatus = "draft" | "reviewed" | "approved";

type TranslationContent = {
  locale: string;
  translationStatus: "draft";
  title: string;
  excerpt: string;
  blocks: Array<Record<string, unknown>>;
  seo: {
    notes: string;
    title: string;
    ogImage: string;
    ogTitle: string;
    imageAlt: string;
    focusKeyword: string;
    searchIntent: "commercial";
    ogDescription: string;
    metaDescription: string;
    secondaryKeywords: string[];
    targetCommercialPage: string;
  };
};

const OG_IMAGE = "/api/guides/images/1hHzLp19So5mg0WdRBkiGHngBi6hneJoK";
const TARGET_PAGE = "/solutions/smarter-distribution";

const translations: TranslationContent[] = [
  {
    locale: "de",
    translationStatus: "draft",
    title: "Airbnb vs Booking.com: Welche Plattform lohnt sich mehr für Vermieter?",
    excerpt:
      "Airbnb oder Booking.com? Wir vergleichen die beiden führenden Buchungsplattformen hinsichtlich Zielgruppe, Provisionen, Verwaltung, Preisgestaltung und Potenzial für mehr Buchungen, damit Vermieter die richtige Strategie für ihre Unterkunft wählen können.",
    blocks: [
      {
        id: "s1-h2",
        type: "heading",
        level: 2,
        text: "Airbnb oder Booking.com? Die wichtigsten Unterschiede für Vermieter",
      },
      {
        id: "s1-paragraph",
        type: "paragraph",
        text:
          "Airbnb und Booking.com gehören zu den wichtigsten Buchungsplattformen für Kurzzeitvermietungen, verfolgen jedoch unterschiedliche Ansätze und können verschiedene Gästetypen ansprechen. Für Vermieter geht es deshalb nicht nur darum, welche Plattform „besser“ ist, sondern welche für die jeweilige Unterkunft mehr Buchungen, eine höhere Auslastung und eine bessere Gesamtleistung erzielen kann.\n\nAirbnb ist eng mit Kurzzeitvermietungen und persönlicheren Reiseerlebnissen verbunden, während Booking.com eine enorme Präsenz im weltweiten Reisemarkt besitzt und von Reisenden genutzt wird, die nach Hotels, Apartments und Ferienunterkünften suchen.\n\nIn der Praxis muss die Entscheidung jedoch nicht auf nur eine Plattform beschränkt sein. Eine Unterkunft kann von den unterschiedlichen Zielgruppen und der Nachfrage beider Plattformen profitieren, sofern Preise, Verfügbarkeit und Buchungen korrekt und koordiniert verwaltet werden.",
      },
      {
        id: "s1-h3",
        type: "heading",
        level: 3,
        text: "Warum es nicht für jede Unterkunft nur eine richtige Wahl gibt",
      },
      {
        id: "s1-bullets",
        type: "bulletList",
        items: [
          "Zugang zu unterschiedlichen Zielgruppen von Reisenden",
          "Höhere Gesamt-Sichtbarkeit der Unterkunft",
          "Mehr Chancen auf zusätzliche Buchungen",
          "Geringere Abhängigkeit von einer einzigen Plattform",
          "Potenzial für eine bessere Auslastung im Jahresverlauf",
        ],
      },
      {
        id: "s1-callout",
        type: "callout",
        text:
          "Die beste Plattform muss nicht zwingend nur eine sein. Für viele Unterkünfte ist eine gut koordinierte Präsenz auf Airbnb und Booking.com die stärkste Strategie.",
      },
      {
        id: "s1-internal-link",
        type: "internalLink",
        href: TARGET_PAGE,
        label: TARGET_PAGE,
      },
    ],
    seo: {
      notes: "",
      title: "Airbnb vs Booking.com: Welche Plattform ist besser?",
      ogImage: OG_IMAGE,
      ogTitle: "Airbnb vs Booking.com: Was ist besser für Vermieter?",
      imageAlt:
        "Vermieter vergleicht Airbnb und Booking.com für Kurzzeitvermietungen",
      focusKeyword: "Airbnb vs Booking.com",
      searchIntent: "commercial",
      ogDescription:
        "Airbnb oder Booking.com? Entdecken Sie die wichtigsten Unterschiede für Vermieter und warum die Nutzung beider Plattformen Sichtbarkeit, Buchungen und Auslastung steigern kann.",
      metaDescription:
        "Airbnb oder Booking.com? Vergleichen Sie die wichtigsten Unterschiede für Vermieter und erfahren Sie, wie beide Plattformen Buchungen und Auslastung steigern können.",
      secondaryKeywords: [
        "Airbnb oder Booking.com",
        "Airbnb Booking.com Vermieter",
        "Plattformen für Kurzzeitvermietung",
        "Buchungsplattformen",
        "mehr Buchungen",
        "Auslastung steigern",
      ],
      targetCommercialPage: TARGET_PAGE,
    },
  },
  {
    locale: "fr",
    translationStatus: "draft",
    title: "Airbnb vs Booking.com : quelle plateforme est la plus avantageuse pour les propriétaires ?",
    excerpt:
      "Airbnb ou Booking.com ? Nous comparons les deux principales plateformes de réservation selon leur audience, leurs commissions, leur gestion, leur tarification et leur potentiel pour générer davantage de réservations, afin d’aider les propriétaires à choisir la bonne stratégie.",
    blocks: [
      {
        id: "s1-h2",
        type: "heading",
        level: 2,
        text: "Airbnb ou Booking.com ? Les principales différences pour les propriétaires",
      },
      {
        id: "s1-paragraph",
        type: "paragraph",
        text:
          "Airbnb et Booking.com font partie des plateformes de réservation les plus importantes pour les locations de courte durée, mais elles fonctionnent selon des approches différentes et peuvent attirer des profils de voyageurs distincts. Pour un propriétaire, la question n’est donc pas simplement de savoir quelle plateforme est « meilleure », mais laquelle peut générer davantage de réservations, un meilleur taux d’occupation et de meilleures performances globales pour le bien concerné.\n\nAirbnb est fortement associé aux locations de courte durée et aux expériences de voyage plus personnalisées, tandis que Booking.com bénéficie d’une présence considérable sur le marché mondial du voyage et est largement utilisé par les voyageurs à la recherche d’hôtels, d’appartements et d’hébergements touristiques.\n\nEn pratique, il n’est toutefois pas nécessaire de choisir exclusivement l’une ou l’autre. Un hébergement peut profiter des différents publics et de la demande générée par les deux plateformes, à condition que les tarifs, les disponibilités et les réservations soient gérés correctement et de manière coordonnée.",
      },
      {
        id: "s1-h3",
        type: "heading",
        level: 3,
        text: "Pourquoi il n’existe pas une seule bonne option pour chaque hébergement",
      },
      {
        id: "s1-bullets",
        type: "bulletList",
        items: [
          "Accès à différents profils de voyageurs",
          "Meilleure visibilité globale de l’hébergement",
          "Davantage d’opportunités de réservation",
          "Moindre dépendance à une seule plateforme",
          "Possibilité d’améliorer le taux d’occupation tout au long de l’année",
        ],
      },
      {
        id: "s1-callout",
        type: "callout",
        text:
          "La meilleure plateforme n’est pas nécessairement une seule plateforme. Pour de nombreux hébergements, la stratégie la plus efficace consiste à être présent de manière coordonnée sur Airbnb et Booking.com.",
      },
      {
        id: "s1-internal-link",
        type: "internalLink",
        href: TARGET_PAGE,
        label: TARGET_PAGE,
      },
    ],
    seo: {
      notes: "",
      title: "Airbnb vs Booking.com : quelle plateforme choisir ?",
      ogImage: OG_IMAGE,
      ogTitle: "Airbnb vs Booking.com : lequel est le meilleur pour les propriétaires ?",
      imageAlt:
        "Propriétaire comparant Airbnb et Booking.com pour des réservations de courte durée",
      focusKeyword: "Airbnb vs Booking.com",
      searchIntent: "commercial",
      ogDescription:
        "Airbnb ou Booking.com ? Découvrez les principales différences pour les propriétaires et pourquoi utiliser efficacement les deux plateformes peut augmenter visibilité, réservations et occupation.",
      metaDescription:
        "Airbnb ou Booking.com ? Comparez les principales différences pour les propriétaires et découvrez comment les deux plateformes peuvent augmenter les réservations et l’occupation.",
      secondaryKeywords: [
        "Airbnb ou Booking.com",
        "Airbnb Booking.com propriétaires",
        "plateformes de location courte durée",
        "plateformes de réservation",
        "augmenter les réservations",
        "taux d’occupation",
      ],
      targetCommercialPage: TARGET_PAGE,
    },
  },
  {
    locale: "it",
    translationStatus: "draft",
    title: "Airbnb vs Booking.com: quale piattaforma conviene di più ai proprietari?",
    excerpt:
      "Airbnb o Booking.com? Confrontiamo le due principali piattaforme di prenotazione per pubblico, commissioni, gestione, prezzi e possibilità di aumentare le prenotazioni, così da aiutare i proprietari a scegliere la strategia più adatta alla propria struttura.",
    blocks: [
      {
        id: "s1-h2",
        type: "heading",
        level: 2,
        text: "Airbnb o Booking.com? Le principali differenze per i proprietari",
      },
      {
        id: "s1-paragraph",
        type: "paragraph",
        text:
          "Airbnb e Booking.com sono tra le piattaforme di prenotazione più importanti per gli affitti brevi, ma funzionano con approcci diversi e possono attirare tipologie differenti di ospiti. Per un proprietario, quindi, la domanda non è semplicemente quale piattaforma sia “migliore”, ma quale possa generare più prenotazioni, una maggiore occupazione e una migliore performance complessiva per quella specifica struttura.\n\nAirbnb è fortemente legato agli affitti brevi e alle esperienze di viaggio più personalizzate, mentre Booking.com ha una presenza enorme nel mercato globale dei viaggi ed è ampiamente utilizzato da chi cerca hotel, appartamenti e strutture turistiche.\n\nNella pratica, però, non è necessario limitarsi a una sola piattaforma. Una struttura può sfruttare i diversi pubblici e la domanda generata da entrambe, purché prezzi, disponibilità e prenotazioni vengano gestiti correttamente e in modo coordinato.",
      },
      {
        id: "s1-h3",
        type: "heading",
        level: 3,
        text: "Perché non esiste una sola scelta giusta per ogni struttura",
      },
      {
        id: "s1-bullets",
        type: "bulletList",
        items: [
          "Accesso a diversi segmenti di viaggiatori",
          "Maggiore visibilità complessiva della struttura",
          "Più opportunità di ottenere prenotazioni",
          "Minore dipendenza da una sola piattaforma",
          "Possibilità di migliorare l’occupazione durante tutto l’anno",
        ],
      },
      {
        id: "s1-callout",
        type: "callout",
        text:
          "La piattaforma migliore non deve necessariamente essere una sola. Per molte strutture, la strategia più efficace è una presenza ben coordinata sia su Airbnb sia su Booking.com.",
      },
      {
        id: "s1-internal-link",
        type: "internalLink",
        href: TARGET_PAGE,
        label: TARGET_PAGE,
      },
    ],
    seo: {
      notes: "",
      title: "Airbnb vs Booking.com: quale piattaforma scegliere?",
      ogImage: OG_IMAGE,
      ogTitle: "Airbnb vs Booking.com: quale conviene ai proprietari?",
      imageAlt:
        "Proprietario che confronta Airbnb e Booking.com per prenotazioni di affitti brevi",
      focusKeyword: "Airbnb vs Booking.com",
      searchIntent: "commercial",
      ogDescription:
        "Airbnb o Booking.com? Scopri le principali differenze per i proprietari e perché utilizzare bene entrambe le piattaforme può aumentare visibilità, prenotazioni e occupazione.",
      metaDescription:
        "Airbnb o Booking.com? Confronta le principali differenze per i proprietari e scopri come entrambe le piattaforme possono aumentare prenotazioni e occupazione.",
      secondaryKeywords: [
        "Airbnb o Booking.com",
        "Airbnb Booking.com proprietari",
        "piattaforme affitti brevi",
        "piattaforme di prenotazione",
        "aumentare prenotazioni",
        "aumentare occupazione",
      ],
      targetCommercialPage: TARGET_PAGE,
    },
  },
  {
    locale: "es",
    translationStatus: "draft",
    title: "Airbnb vs Booking.com: ¿qué plataforma conviene más a los propietarios?",
    excerpt:
      "¿Airbnb o Booking.com? Comparamos las dos principales plataformas de reservas en cuanto a audiencia, comisiones, gestión, precios y capacidad para aumentar las reservas, ayudando a los propietarios a elegir la estrategia adecuada para su alojamiento.",
    blocks: [
      {
        id: "s1-h2",
        type: "heading",
        level: 2,
        text: "¿Airbnb o Booking.com? Las principales diferencias para los propietarios",
      },
      {
        id: "s1-paragraph",
        type: "paragraph",
        text:
          "Airbnb y Booking.com son dos de las plataformas de reservas más importantes para alojamientos de corta estancia, pero funcionan con enfoques diferentes y pueden atraer a distintos tipos de huéspedes. Para un propietario, la cuestión no es simplemente cuál es “mejor”, sino cuál puede generar más reservas, una mayor ocupación y un mejor rendimiento global para una propiedad concreta.\n\nAirbnb está muy vinculado al alquiler vacacional y a experiencias de viaje más personalizadas, mientras que Booking.com tiene una enorme presencia en el mercado mundial de viajes y es utilizado ampliamente por viajeros que buscan hoteles, apartamentos y alojamientos turísticos.\n\nEn la práctica, sin embargo, no es necesario limitarse a una sola plataforma. Un alojamiento puede aprovechar las diferentes audiencias y la demanda de ambas, siempre que los precios, la disponibilidad y las reservas se gestionen correctamente y de forma coordinada.",
      },
      {
        id: "s1-h3",
        type: "heading",
        level: 3,
        text: "Por qué no existe una única opción correcta para cada alojamiento",
      },
      {
        id: "s1-bullets",
        type: "bulletList",
        items: [
          "Acceso a diferentes públicos de viajeros",
          "Mayor visibilidad global del alojamiento",
          "Más oportunidades de conseguir reservas",
          "Menor dependencia de una sola plataforma",
          "Posibilidad de mejorar la ocupación durante todo el año",
        ],
      },
      {
        id: "s1-callout",
        type: "callout",
        text:
          "La mejor plataforma no tiene por qué ser solo una. Para muchos alojamientos, la estrategia más sólida es mantener una presencia bien coordinada tanto en Airbnb como en Booking.com.",
      },
      {
        id: "s1-internal-link",
        type: "internalLink",
        href: TARGET_PAGE,
        label: TARGET_PAGE,
      },
    ],
    seo: {
      notes: "",
      title: "Airbnb vs Booking.com: ¿qué plataforma es mejor?",
      ogImage: OG_IMAGE,
      ogTitle: "Airbnb vs Booking.com: ¿cuál conviene a los propietarios?",
      imageAlt:
        "Propietario comparando Airbnb y Booking.com para reservas de alquiler vacacional",
      focusKeyword: "Airbnb vs Booking.com",
      searchIntent: "commercial",
      ogDescription:
        "¿Airbnb o Booking.com? Descubre las principales diferencias para propietarios y por qué usar bien ambas plataformas puede aumentar visibilidad, reservas y ocupación.",
      metaDescription:
        "¿Airbnb o Booking.com? Compara las principales diferencias para propietarios y descubre cómo ambas plataformas pueden ayudar a aumentar las reservas y la ocupación.",
      secondaryKeywords: [
        "Airbnb o Booking.com",
        "Airbnb Booking.com propietarios",
        "plataformas de alquiler vacacional",
        "plataformas de reservas",
        "aumentar reservas",
        "aumentar ocupación",
      ],
      targetCommercialPage: TARGET_PAGE,
    },
  },
  {
    locale: "pt",
    translationStatus: "draft",
    title: "Airbnb vs Booking.com: qual plataforma compensa mais para proprietários?",
    excerpt:
      "Airbnb ou Booking.com? Comparamos as duas principais plataformas de reservas em público, comissões, gestão, preços e potencial para aumentar reservas, ajudando proprietários a escolher a estratégia certa para o seu alojamento.",
    blocks: [
      {
        id: "s1-h2",
        type: "heading",
        level: 2,
        text: "Airbnb ou Booking.com? As principais diferenças para proprietários",
      },
      {
        id: "s1-paragraph",
        type: "paragraph",
        text:
          "Airbnb e Booking.com estão entre as plataformas de reservas mais importantes para alojamentos de curta duração, mas funcionam com abordagens diferentes e podem atrair perfis distintos de hóspedes. Para um proprietário, a questão não é simplesmente qual plataforma é “melhor”, mas qual pode gerar mais reservas, maior ocupação e melhor desempenho global para um determinado imóvel.\n\nO Airbnb está fortemente associado ao alojamento de curta duração e a experiências de viagem mais personalizadas, enquanto o Booking.com tem uma enorme presença no mercado mundial de viagens e é amplamente utilizado por viajantes que procuram hotéis, apartamentos e alojamentos turísticos.\n\nNa prática, no entanto, não é necessário limitar a estratégia a apenas uma plataforma. Um alojamento pode aproveitar os diferentes públicos e a procura gerada por ambas, desde que os preços, a disponibilidade e as reservas sejam geridos corretamente e de forma coordenada.",
      },
      {
        id: "s1-h3",
        type: "heading",
        level: 3,
        text: "Por que não existe uma única escolha certa para todos os alojamentos",
      },
      {
        id: "s1-bullets",
        type: "bulletList",
        items: [
          "Acesso a diferentes públicos de viajantes",
          "Maior visibilidade global do alojamento",
          "Mais oportunidades de conseguir reservas",
          "Menor dependência de uma única plataforma",
          "Possibilidade de melhorar a ocupação ao longo do ano",
        ],
      },
      {
        id: "s1-callout",
        type: "callout",
        text:
          "A melhor plataforma não tem necessariamente de ser apenas uma. Para muitos alojamentos, a estratégia mais forte é uma presença bem coordenada tanto no Airbnb como no Booking.com.",
      },
      {
        id: "s1-internal-link",
        type: "internalLink",
        href: TARGET_PAGE,
        label: TARGET_PAGE,
      },
    ],
    seo: {
      notes: "",
      title: "Airbnb vs Booking.com: qual plataforma escolher?",
      ogImage: OG_IMAGE,
      ogTitle: "Airbnb vs Booking.com: qual é melhor para proprietários?",
      imageAlt:
        "Proprietário a comparar Airbnb e Booking.com para reservas de curta duração",
      focusKeyword: "Airbnb vs Booking.com",
      searchIntent: "commercial",
      ogDescription:
        "Airbnb ou Booking.com? Descubra as principais diferenças para proprietários e por que usar bem ambas as plataformas pode aumentar visibilidade, reservas e ocupação.",
      metaDescription:
        "Airbnb ou Booking.com? Compare as principais diferenças para proprietários e descubra como ambas as plataformas podem ajudar a aumentar reservas e ocupação.",
      secondaryKeywords: [
        "Airbnb ou Booking.com",
        "Airbnb Booking.com proprietários",
        "plataformas de alojamento local",
        "plataformas de reservas",
        "aumentar reservas",
        "aumentar ocupação",
      ],
      targetCommercialPage: TARGET_PAGE,
    },
  },
  {
    locale: "bg",
    translationStatus: "draft",
    title: "Airbnb срещу Booking.com: коя платформа е по-изгодна за собственици?",
    excerpt:
      "Airbnb или Booking.com? Сравняваме двете водещи платформи за резервации по аудитория, комисиони, управление, ценообразуване и възможности за повече резервации, за да помогнем на собствениците да изберат правилната стратегия за своя имот.",
    blocks: [
      {
        id: "s1-h2",
        type: "heading",
        level: 2,
        text: "Airbnb или Booking.com? Основните разлики за собствениците",
      },
      {
        id: "s1-paragraph",
        type: "paragraph",
        text:
          "Airbnb и Booking.com са сред най-важните платформи за резервации на имоти за краткосрочно настаняване, но работят по различен начин и могат да привличат различни типове гости. За собственика въпросът не е просто коя платформа е „по-добра“, а коя може да донесе повече резервации, по-висока заетост и по-добри общи резултати за конкретния имот.\n\nAirbnb е силно свързан с краткосрочните наеми и по-персонализираните туристически изживявания, докато Booking.com има огромно присъствие на световния туристически пазар и се използва широко от пътуващи, които търсят хотели, апартаменти и туристически места за настаняване.\n\nНа практика обаче изборът не е необходимо да се ограничава само до едната платформа. Един имот може да се възползва от различните аудитории и търсенето и в двете платформи, стига цените, наличността и резервациите да се управляват правилно и координирано.",
      },
      {
        id: "s1-h3",
        type: "heading",
        level: 3,
        text: "Защо няма един правилен избор за всеки имот",
      },
      {
        id: "s1-bullets",
        type: "bulletList",
        items: [
          "Достъп до различни групи пътуващи",
          "По-голяма обща видимост на имота",
          "Повече възможности за резервации",
          "По-малка зависимост от една платформа",
          "Възможност за по-висока заетост през цялата година",
        ],
      },
      {
        id: "s1-callout",
        type: "callout",
        text:
          "Най-добрата платформа не е задължително само една. За много имоти най-силната стратегия е добре координирано присъствие както в Airbnb, така и в Booking.com.",
      },
      {
        id: "s1-internal-link",
        type: "internalLink",
        href: TARGET_PAGE,
        label: TARGET_PAGE,
      },
    ],
    seo: {
      notes: "",
      title: "Airbnb vs Booking.com: коя платформа е по-добра?",
      ogImage: OG_IMAGE,
      ogTitle: "Airbnb vs Booking.com: кое е по-добро за собственици?",
      imageAlt:
        "Собственик сравнява Airbnb и Booking.com за краткосрочни резервации",
      focusKeyword: "Airbnb vs Booking.com",
      searchIntent: "commercial",
      ogDescription:
        "Airbnb или Booking.com? Вижте основните разлики за собствениците и защо правилното използване и на двете платформи може да увеличи видимостта, резервациите и заетостта.",
      metaDescription:
        "Airbnb или Booking.com? Сравнете основните разлики за собствениците и вижте как използването и на двете платформи може да увеличи резервациите и заетостта.",
      secondaryKeywords: [
        "Airbnb или Booking.com",
        "Airbnb Booking.com собственици",
        "платформи за краткосрочни наеми",
        "платформи за резервации",
        "повече резервации",
        "по-висока заетост",
      ],
      targetCommercialPage: TARGET_PAGE,
    },
  },
  {
    locale: "sr",
    translationStatus: "draft",
    title: "Airbnb vs Booking.com: koja platforma je isplativija za vlasnike?",
    excerpt:
      "Airbnb ili Booking.com? Poredimo dve vodeće platforme za rezervacije po publici, provizijama, upravljanju, cenama i mogućnostima za povećanje broja rezervacija, kako bi vlasnici izabrali pravu strategiju za svoj smeštaj.",
    blocks: [
      {
        id: "s1-h2",
        type: "heading",
        level: 2,
        text: "Airbnb ili Booking.com? Glavne razlike za vlasnike",
      },
      {
        id: "s1-paragraph",
        type: "paragraph",
        text:
          "Airbnb i Booking.com spadaju među najvažnije platforme za rezervacije kratkoročnog smeštaja, ali funkcionišu na različite načine i mogu privući različite tipove gostiju. Za vlasnika pitanje nije samo koja je platforma „bolja“, već koja može doneti više rezervacija, veću popunjenost i bolje ukupne rezultate za konkretan objekat.\n\nAirbnb je snažno povezan sa kratkoročnim izdavanjem i personalizovanijim iskustvima putovanja, dok Booking.com ima ogromno prisustvo na globalnom turističkom tržištu i široko ga koriste putnici koji traže hotele, apartmane i turistički smeštaj.\n\nU praksi, međutim, izbor ne mora biti ograničen samo na jednu platformu. Smeštaj može iskoristiti različitu publiku i potražnju obe platforme, pod uslovom da se cene, dostupnost i rezervacije pravilno i usklađeno upravljaju.",
      },
      {
        id: "s1-h3",
        type: "heading",
        level: 3,
        text: "Zašto ne postoji samo jedan pravi izbor za svaki smeštaj",
      },
      {
        id: "s1-bullets",
        type: "bulletList",
        items: [
          "Pristup različitim grupama putnika",
          "Veća ukupna vidljivost smeštaja",
          "Više mogućnosti za rezervacije",
          "Manja zavisnost od samo jedne platforme",
          "Mogućnost bolje popunjenosti tokom cele godine",
        ],
      },
      {
        id: "s1-callout",
        type: "callout",
        text:
          "Najbolja platforma ne mora nužno biti samo jedna. Za mnoge objekte najsnažnija strategija je dobro usklađeno prisustvo i na Airbnb-u i na Booking.com-u.",
      },
      {
        id: "s1-internal-link",
        type: "internalLink",
        href: TARGET_PAGE,
        label: TARGET_PAGE,
      },
    ],
    seo: {
      notes: "",
      title: "Airbnb vs Booking.com: koja platforma je bolja?",
      ogImage: OG_IMAGE,
      ogTitle: "Airbnb vs Booking.com: šta je bolje za vlasnike?",
      imageAlt:
        "Vlasnik upoređuje Airbnb i Booking.com za kratkoročne rezervacije",
      focusKeyword: "Airbnb vs Booking.com",
      searchIntent: "commercial",
      ogDescription:
        "Airbnb ili Booking.com? Otkrijte glavne razlike za vlasnike i zašto pravilno korišćenje obe platforme može povećati vidljivost, rezervacije i popunjenost.",
      metaDescription:
        "Airbnb ili Booking.com? Uporedite glavne razlike za vlasnike i saznajte kako obe platforme mogu pomoći da povećate rezervacije i popunjenost.",
      secondaryKeywords: [
        "Airbnb ili Booking.com",
        "Airbnb Booking.com vlasnici",
        "platforme za kratkoročno izdavanje",
        "platforme za rezervacije",
        "više rezervacija",
        "veća popunjenost",
      ],
      targetCommercialPage: TARGET_PAGE,
    },
  },
  {
    locale: "tr",
    translationStatus: "draft",
    title: "Airbnb vs Booking.com: ev sahipleri için hangi platform daha avantajlı?",
    excerpt:
      "Airbnb mi Booking.com mu? İki önde gelen rezervasyon platformunu hedef kitle, komisyonlar, yönetim, fiyatlandırma ve rezervasyonları artırma potansiyeli açısından karşılaştırıyor; ev sahiplerinin konaklamaları için doğru stratejiyi seçmesine yardımcı oluyoruz.",
    blocks: [
      {
        id: "s1-h2",
        type: "heading",
        level: 2,
        text: "Airbnb mi Booking.com mu? Ev sahipleri için temel farklar",
      },
      {
        id: "s1-paragraph",
        type: "paragraph",
        text:
          "Airbnb ve Booking.com kısa süreli kiralama konaklamaları için en önemli rezervasyon platformlarından ikisidir, ancak farklı yaklaşımlarla çalışırlar ve farklı misafir profillerini çekebilirler. Bir ev sahibi için soru yalnızca hangi platformun “daha iyi” olduğu değil, belirli bir tesis için hangisinin daha fazla rezervasyon, daha yüksek doluluk ve daha güçlü genel performans sağlayabileceğidir.\n\nAirbnb kısa süreli kiralamalar ve daha kişiselleştirilmiş seyahat deneyimleriyle güçlü biçimde ilişkilendirilirken, Booking.com küresel seyahat pazarında çok büyük bir varlığa sahiptir ve otel, daire ve turistik konaklama arayan gezginler tarafından yaygın olarak kullanılır.\n\nAncak pratikte seçim yalnızca tek bir platformla sınırlı olmak zorunda değildir. Fiyatlar, müsaitlik ve rezervasyonlar doğru ve koordineli şekilde yönetildiği sürece bir tesis her iki platformun farklı kitlelerinden ve talebinden yararlanabilir.",
      },
      {
        id: "s1-h3",
        type: "heading",
        level: 3,
        text: "Neden her konaklama için tek bir doğru seçenek yoktur?",
      },
      {
        id: "s1-bullets",
        type: "bulletList",
        items: [
          "Farklı gezgin kitlelerine erişim",
          "Tesisin toplam görünürlüğünün artması",
          "Daha fazla rezervasyon fırsatı",
          "Tek bir platforma bağımlılığın azalması",
          "Yıl boyunca daha yüksek doluluk potansiyeli",
        ],
      },
      {
        id: "s1-callout",
        type: "callout",
        text:
          "En iyi platform mutlaka yalnızca bir tane değildir. Birçok tesis için en güçlü strateji, hem Airbnb’de hem de Booking.com’da iyi koordine edilmiş bir varlıktır.",
      },
      {
        id: "s1-internal-link",
        type: "internalLink",
        href: TARGET_PAGE,
        label: TARGET_PAGE,
      },
    ],
    seo: {
      notes: "",
      title: "Airbnb vs Booking.com: hangi platform daha iyi?",
      ogImage: OG_IMAGE,
      ogTitle: "Airbnb vs Booking.com: ev sahipleri için hangisi daha iyi?",
      imageAlt:
        "Kısa süreli kiralama rezervasyonları için Airbnb ve Booking.com'u karşılaştıran ev sahibi",
      focusKeyword: "Airbnb vs Booking.com",
      searchIntent: "commercial",
      ogDescription:
        "Airbnb mi Booking.com mu? Ev sahipleri için temel farkları ve iki platformu doğru kullanmanın görünürlük, rezervasyon ve doluluğu nasıl artırabileceğini keşfedin.",
      metaDescription:
        "Airbnb mi Booking.com mu? Ev sahipleri için temel farkları karşılaştırın ve iki platformun rezervasyonları ve doluluğu nasıl artırabileceğini öğrenin.",
      secondaryKeywords: [
        "Airbnb mi Booking.com mu",
        "Airbnb Booking.com ev sahipleri",
        "kısa süreli kiralama platformları",
        "rezervasyon platformları",
        "rezervasyon artırma",
        "doluluk artırma",
      ],
      targetCommercialPage: TARGET_PAGE,
    },
  },
  {
    locale: "pl",
    translationStatus: "draft",
    title: "Airbnb vs Booking.com: która platforma bardziej opłaca się właścicielom?",
    excerpt:
      "Airbnb czy Booking.com? Porównujemy dwie najważniejsze platformy rezerwacyjne pod względem odbiorców, prowizji, zarządzania, cen i możliwości zwiększenia liczby rezerwacji, aby pomóc właścicielom wybrać odpowiednią strategię dla obiektu.",
    blocks: [
      {
        id: "s1-h2",
        type: "heading",
        level: 2,
        text: "Airbnb czy Booking.com? Najważniejsze różnice dla właścicieli",
      },
      {
        id: "s1-paragraph",
        type: "paragraph",
        text:
          "Airbnb i Booking.com należą do najważniejszych platform rezerwacyjnych dla obiektów najmu krótkoterminowego, jednak działają w nieco inny sposób i mogą przyciągać różne grupy gości. Dla właściciela pytanie nie sprowadza się więc do tego, która platforma jest „lepsza”, ale która może zapewnić więcej rezerwacji, wyższe obłożenie i lepsze wyniki dla konkretnego obiektu.\n\nAirbnb jest silnie kojarzone z najmem krótkoterminowym i bardziej spersonalizowanymi doświadczeniami podróżniczymi, natomiast Booking.com ma ogromną obecność na globalnym rynku turystycznym i jest szeroko wykorzystywany przez osoby szukające hoteli, apartamentów i innych obiektów noclegowych.\n\nW praktyce nie trzeba jednak ograniczać się tylko do jednej platformy. Obiekt może korzystać z różnych grup odbiorców i popytu generowanego przez obie platformy, pod warunkiem że ceny, dostępność i rezerwacje są zarządzane prawidłowo i w sposób skoordynowany.",
      },
      {
        id: "s1-h3",
        type: "heading",
        level: 3,
        text: "Dlaczego nie istnieje jeden właściwy wybór dla każdego obiektu",
      },
      {
        id: "s1-bullets",
        type: "bulletList",
        items: [
          "Dostęp do różnych grup podróżnych",
          "Większa ogólna widoczność obiektu",
          "Więcej możliwości pozyskania rezerwacji",
          "Mniejsza zależność od jednej platformy",
          "Możliwość zwiększenia obłożenia w ciągu całego roku",
        ],
      },
      {
        id: "s1-callout",
        type: "callout",
        text:
          "Najlepsza platforma nie musi oznaczać tylko jednej platformy. Dla wielu obiektów najmocniejszą strategią jest dobrze skoordynowana obecność zarówno na Airbnb, jak i Booking.com.",
      },
      {
        id: "s1-internal-link",
        type: "internalLink",
        href: TARGET_PAGE,
        label: TARGET_PAGE,
      },
    ],
    seo: {
      notes: "",
      title: "Airbnb vs Booking.com: którą platformę wybrać?",
      ogImage: OG_IMAGE,
      ogTitle: "Airbnb vs Booking.com: co jest lepsze dla właścicieli?",
      imageAlt:
        "Właściciel porównujący Airbnb i Booking.com dla rezerwacji krótkoterminowych",
      focusKeyword: "Airbnb vs Booking.com",
      searchIntent: "commercial",
      ogDescription:
        "Airbnb czy Booking.com? Poznaj najważniejsze różnice dla właścicieli i sprawdź, dlaczego skuteczne wykorzystanie obu platform może zwiększyć widoczność, rezerwacje i obłożenie.",
      metaDescription:
        "Airbnb czy Booking.com? Porównaj najważniejsze różnice dla właścicieli i dowiedz się, jak obie platformy mogą pomóc zwiększyć liczbę rezerwacji i obłożenie.",
      secondaryKeywords: [
        "Airbnb czy Booking.com",
        "Airbnb Booking.com właściciele",
        "platformy najmu krótkoterminowego",
        "platformy rezerwacyjne",
        "więcej rezerwacji",
        "większe obłożenie",
      ],
      targetCommercialPage: TARGET_PAGE,
    },
  },
  {
    locale: "ru",
    translationStatus: "draft",
    title: "Airbnb vs Booking.com: какая платформа выгоднее владельцам жилья?",
    excerpt:
      "Airbnb или Booking.com? Сравниваем две ведущие платформы бронирования по аудитории, комиссиям, управлению, ценообразованию и потенциалу увеличения бронирований, чтобы помочь владельцам выбрать правильную стратегию для своего объекта.",
    blocks: [
      {
        id: "s1-h2",
        type: "heading",
        level: 2,
        text: "Airbnb или Booking.com? Основные различия для владельцев",
      },
      {
        id: "s1-paragraph",
        type: "paragraph",
        text:
          "Airbnb и Booking.com — две из наиболее важных платформ бронирования для объектов краткосрочной аренды, однако они работают по-разному и могут привлекать разные категории гостей. Для владельца вопрос заключается не просто в том, какая платформа «лучше», а в том, какая способна обеспечить больше бронирований, более высокую заполняемость и лучшие общие результаты для конкретного объекта.\n\nAirbnb тесно связан с краткосрочной арендой и более персонализированными путешествиями, тогда как Booking.com обладает огромным присутствием на мировом туристическом рынке и широко используется путешественниками, которые ищут отели, апартаменты и другие варианты размещения.\n\nНа практике, однако, выбор не обязательно должен ограничиваться одной платформой. Объект может использовать разные аудитории и спрос обеих платформ при условии, что цены, доступность и бронирования управляются правильно и согласованно.",
      },
      {
        id: "s1-h3",
        type: "heading",
        level: 3,
        text: "Почему не существует одного правильного выбора для каждого объекта",
      },
      {
        id: "s1-bullets",
        type: "bulletList",
        items: [
          "Доступ к разным аудиториям путешественников",
          "Более высокая общая видимость объекта",
          "Больше возможностей для получения бронирований",
          "Меньшая зависимость от одной платформы",
          "Возможность повысить заполняемость в течение года",
        ],
      },
      {
        id: "s1-callout",
        type: "callout",
        text:
          "Лучшая платформа — не обязательно только одна. Для многих объектов наиболее сильной стратегией является хорошо скоординированное присутствие как на Airbnb, так и на Booking.com.",
      },
      {
        id: "s1-internal-link",
        type: "internalLink",
        href: TARGET_PAGE,
        label: TARGET_PAGE,
      },
    ],
    seo: {
      notes: "",
      title: "Airbnb vs Booking.com: какую платформу выбрать?",
      ogImage: OG_IMAGE,
      ogTitle: "Airbnb vs Booking.com: что лучше для владельцев?",
      imageAlt:
        "Владелец сравнивает Airbnb и Booking.com для краткосрочных бронирований",
      focusKeyword: "Airbnb vs Booking.com",
      searchIntent: "commercial",
      ogDescription:
        "Airbnb или Booking.com? Узнайте основные различия для владельцев и почему эффективное использование обеих платформ может повысить видимость, количество бронирований и заполняемость.",
      metaDescription:
        "Airbnb или Booking.com? Сравните основные различия для владельцев и узнайте, как обе платформы могут помочь увеличить количество бронирований и заполняемость.",
      secondaryKeywords: [
        "Airbnb или Booking.com",
        "Airbnb Booking.com владельцы",
        "платформы краткосрочной аренды",
        "платформы бронирования",
        "увеличить бронирования",
        "увеличить заполняемость",
      ],
      targetCommercialPage: TARGET_PAGE,
    },
  },
];

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is missing. Run this script with --env-file=.env.local."
    );
  }

  const sql = neon(databaseUrl);

  const guideRows = await sql`
    SELECT id, status
    FROM guides
    WHERE id = ${GUIDE_ID}
    LIMIT 1;
  `;

  if (guideRows.length === 0) {
    throw new Error(`Guide #${GUIDE_ID} was not found.`);
  }

  const sourceRows = await sql`
    SELECT locale
    FROM guide_translations
    WHERE guide_id = ${GUIDE_ID}
      AND locale = 'el'
    LIMIT 1;
  `;

  if (sourceRows.length === 0) {
    throw new Error(
      `Greek source translation for guide #${GUIDE_ID} was not found. Nothing was changed.`
    );
  }

  console.log(`Starting bulk translation import for guide #${GUIDE_ID}...`);
  console.log(`Article status: ${guideRows[0].status}`);
  console.log("");

  let imported = 0;
  let skipped = 0;

  for (const content of translations) {
    const existingRows = await sql`
      SELECT translation_status
      FROM guide_translations
      WHERE guide_id = ${GUIDE_ID}
        AND locale = ${content.locale}
      LIMIT 1;
    `;

    const existingStatus = existingRows[0]?.translation_status as
      | TranslationStatus
      | undefined;

    if (
      existingStatus === "reviewed" ||
      existingStatus === "approved"
    ) {
      console.log(
        `↷ ${content.locale.toUpperCase()} skipped — already ${existingStatus}.`
      );
      skipped++;
      continue;
    }

    await sql`
      INSERT INTO guide_translations (
        guide_id,
        locale,
        translation_status,
        content,
        updated_at
      )
      VALUES (
        ${GUIDE_ID},
        ${content.locale},
        'draft',
        ${JSON.stringify(content)}::jsonb,
        NOW()
      )
      ON CONFLICT (guide_id, locale)
      DO UPDATE SET
        translation_status = 'draft',
        content = EXCLUDED.content,
        updated_at = NOW();
    `;

    console.log(`✓ ${content.locale.toUpperCase()} imported as draft.`);
    imported++;
  }

  await sql`
    UPDATE guides
    SET updated_at = NOW()
    WHERE id = ${GUIDE_ID};
  `;

  console.log("");
  console.log("Bulk import finished.");
  console.log(`✓ Imported: ${imported}`);
  console.log(`↷ Skipped: ${skipped}`);
  console.log(`✓ Article status was NOT changed: ${guideRows[0].status}`);
  console.log("✓ No translation was approved.");
  console.log("✓ Nothing was published.");
}

main().catch((error) => {
  console.error("");
  console.error("Bulk translation import failed:");
  console.error(error);
  process.exit(1);
});
