// ============================================================================
// 1. L'ATELIER D'ÉCRITURE & DALF C2 WRITING SIMULATOR (WRITING_MISSIONS)
// 12 Progressive Writing & Rhetoric Missions (A1 -> DALF C2)
// ============================================================================
window.WRITING_MISSIONS = [
  // --------------------------------------------------------------------------
  // A1 / A2 MISSIONS (2)
  // --------------------------------------------------------------------------
  {
    id: "write_a1_brasserie",
    cefr: "A1",
    category: "Vie Quotidienne",
    title: "Réservation au Café de Flore & Brasserie",
    location: "Saint-Germain-des-Prés (6e)",
    context: "You are organizing a dinner for four friends at a classic Parisian brasserie on Boulevard Saint-Germain. One friend is vegetarian, and you prefer a quiet table on the heated terrace.",
    prompt: "Write a polite reservation message (40–60 words) specifying the date, time, number of guests, seating preference, and dietary question.",
    requiredKeywords: [
      { fr: "je voudrais réserver", en: "I would like to book" },
      { fr: "une table pour quatre personnes", en: "a table for four people" },
      { fr: "en terrasse", en: "on the terrace" },
      { fr: "s'il vous plaît", en: "please (formal)" },
      { fr: "avez-vous des plats végétariens", en: "do you have vegetarian dishes" },
      { fr: "cordialement", en: "kind regards" }
    ],
    sentenceBuilders: [
      {
        step: 1,
        goal: "Polite opening & reservation request",
        fr: "Bonjour, je voudrais réserver une table pour quatre personnes ce samedi soir.",
        en: "Hello, I would like to book a table for four people this Saturday evening.",
        tiles: ["Bonjour,", "je voudrais", "réserver", "une table", "pour quatre personnes", "ce samedi soir."]
      },
      {
        step: 2,
        goal: "Time & terrace seating preference",
        fr: "Nous souhaitons arriver vers vingt heures et dîner en terrasse, s'il vous plaît.",
        en: "We wish to arrive around 8:00 PM and dine on the terrace, please.",
        tiles: ["Nous souhaitons", "arriver", "vers vingt heures", "et dîner", "en terrasse,", "s'il vous plaît."]
      },
      {
        step: 3,
        goal: "Dietary inquiry",
        fr: "Mon amie ne mange pas de viande : avez-vous des plats végétariens à la carte ?",
        en: "My friend does not eat meat: do you have vegetarian dishes on the menu?",
        tiles: ["Mon amie", "ne mange pas de viande :", "avez-vous", "des plats végétariens", "à la carte ?"]
      },
      {
        step: 4,
        goal: "Confirmation & sign-off",
        fr: "Merci beaucoup de confirmer ma réservation par message. Cordialement.",
        en: "Thank you very much for confirming my reservation by message. Kind regards.",
        tiles: ["Merci beaucoup", "de confirmer", "ma réservation", "par message.", "Cordialement."]
      }
    ],
    nativeModelText: {
      fr: "Bonjour, je voudrais réserver une table pour quatre personnes ce samedi soir vers vingt heures. Si possible, nous aimerions dîner en terrasse au calme, s'il vous plaît. Par ailleurs, mon amie ne mange pas de viande : avez-vous des plats végétariens à la carte ? Merci beaucoup de confirmer ma réservation. Cordialement.",
      en: "Hello, I would like to book a table for four people this Saturday evening around 8:00 PM. If possible, we would like to dine on a quiet part of the terrace, please. Furthermore, my friend does not eat meat: do you have vegetarian dishes on the menu? Thank you very much for confirming my reservation. Kind regards."
    }
  },
  {
    id: "write_a2_famille_accueil",
    cefr: "A2",
    category: "Mobilité & Accueil",
    title: "Lettre de Présentation à une Famille d'Accueil",
    location: "Quartier Latin (5e)",
    context: "Before moving to Paris for a language immersion semester at the Sorbonne, you write an introductory email to the Moreau family who will host you in their apartment near the Jardin du Luxembourg.",
    prompt: "Write a warm, respectful letter (60–80 words) introducing your background, daily habits, why you love French culture, and your arrival details at Gare du Nord.",
    requiredKeywords: [
      { fr: "je vous remercie de", en: "I thank you for" },
      { fr: "j'ai hâte de", en: "I look forward to / can't wait to" },
      { fr: "pendant mon séjour", en: "during my stay" },
      { fr: "passionné(e) par", en: "passionate about" },
      { fr: "j'arriverai à", en: "I will arrive at" },
      { fr: "bien à vous", en: "warm regards / yours truly" }
    ],
    sentenceBuilders: [
      {
        step: 1,
        goal: "Warm greeting & gratitude",
        fr: "Chère famille Moreau, je vous remercie de m'accueillir chez vous à Paris pendant mon séjour.",
        en: "Dear Moreau family, I thank you for welcoming me into your home in Paris during my stay.",
        tiles: ["Chère famille Moreau,", "je vous remercie de", "m'accueillir chez vous", "à Paris", "pendant mon séjour."]
      },
      {
        step: 2,
        goal: "Personal background & passions",
        fr: "Je suis quelqu'un de calme et curieux, passionné par le cinéma français et la gastronomie.",
        en: "I am a calm and curious person, passionate about French cinema and gastronomy.",
        tiles: ["Je suis quelqu'un", "de calme et curieux,", "passionné par", "le cinéma français", "et la gastronomie."]
      },
      {
        step: 3,
        goal: "Arrival logistics",
        fr: "J'arriverai à la Gare du Nord le dimanche 14 septembre à quinze heures trente.",
        en: "I will arrive at Gare du Nord on Sunday, September 14th at 3:30 PM.",
        tiles: ["J'arriverai à", "la Gare du Nord", "le dimanche 14 septembre", "à quinze heures trente."]
      },
      {
        step: 4,
        goal: "Enthusiastic closing",
        fr: "J'ai hâte de faire votre connaissance et de partager nos repas. Bien à vous.",
        en: "I look forward to meeting you and sharing our meals. Warm regards.",
        tiles: ["J'ai hâte de", "faire votre connaissance", "et de partager", "nos repas.", "Bien à vous."]
      }
    ],
    nativeModelText: {
      fr: "Chère famille Moreau, je vous remercie chaleureusement de m'accueillir chez vous à Paris pendant mon séjour d'études. Je suis quelqu'un d'ordonné et curieux, passionné par l'histoire de l'art et la gastronomie française. J'arriverai à la Gare du Nord le dimanche 14 septembre à quinze heures trente. J'ai hâte de faire votre connaissance et de pratiquer mon français à vos côtés. Bien à vous.",
      en: "Dear Moreau family, I warmly thank you for welcoming me into your home in Paris during my study stay. I am a tidy and curious person, passionate about art history and French gastronomy. I will arrive at Gare du Nord on Sunday, September 14th at 3:30 PM. I look forward to meeting you and practicing my French alongside you. Warm regards."
    }
  },

  // --------------------------------------------------------------------------
  // B1 / B2 MISSIONS (3)
  // --------------------------------------------------------------------------
  {
    id: "write_b1_dossier_locatif",
    cefr: "B1",
    category: "Immobilier Parisien",
    title: "Note de Synthèse du Dossier Locatif Haussmannien",
    location: "Boulevard Malesherbes (8e)",
    context: "Thirty applicants are competing for a sunny two-room Haussmannian apartment with parquet point de Hongrie. To stand out to the strict landlord, Monsieur de Villedieu, you must attach a persuasive cover note to your rental dossier.",
    prompt: "Write a formal cover note (90–120 words) highlighting your job stability, financial guarantor (garant Visale/bancaire), respect for building tranquility, and readiness to sign the lease immediately.",
    requiredKeywords: [
      { fr: "suite à ma visite", en: "following my visit" },
      { fr: "contrat à durée indéterminée (CDI)", en: "permanent employment contract" },
      { fr: "caution solidaire", en: "joint financial guarantor" },
      { fr: "locataire soigneux", en: "careful / conscientious tenant" },
      { fr: "pièces justificatives", en: "supporting documents" },
      { fr: "veuillez agréer", en: "please accept (formal closing)" }
    ],
    sentenceBuilders: [
      {
        step: 1,
        goal: "Reference the apartment visit & strong interest",
        fr: "Suite à ma visite de ce matin, je vous confirme mon vif intérêt pour votre appartement situé boulevard Malesherbes.",
        en: "Following my visit this morning, I confirm my strong interest in your apartment located on Boulevard Malesherbes.",
        tiles: ["Suite à ma visite", "de ce matin,", "je vous confirme", "mon vif intérêt", "pour votre appartement", "situé boulevard Malesherbes."]
      },
      {
        step: 2,
        goal: "Establish employment & financial stability",
        fr: "Titulaire d'un contrat à durée indéterminée, je dispose de revenus réguliers supérieurs à trois fois le montant du loyer.",
        en: "Holding a permanent employment contract, I have regular income exceeding three times the rent amount.",
        tiles: ["Titulaire d'un", "contrat à durée indéterminée,", "je dispose de", "revenus réguliers", "supérieurs à trois fois", "le montant du loyer."]
      },
      {
        step: 3,
        goal: "Mention guarantor & supporting documents",
        fr: "Vous trouverez ci-joint l'ensemble des pièces justificatives ainsi qu'un acte de caution solidaire bancaire.",
        en: "Please find attached all supporting documents as well as a bank joint guarantee deed.",
        tiles: ["Vous trouverez ci-joint", "l'ensemble des", "pièces justificatives", "ainsi qu'un acte", "de caution solidaire bancaire."]
      },
      {
        step: 4,
        goal: "Reassure landlord on building care & formal sign-off",
        fr: "Calme et non-fumeur, je m'engage à être un locataire soigneux. Veuillez agréer, Monsieur, mes salutations distinguées.",
        en: "Quiet and non-smoking, I pledge to be a conscientious tenant. Please accept, Sir, my distinguished regards.",
        tiles: ["Calme et non-fumeur,", "je m'engage à être", "un locataire soigneux.", "Veuillez agréer, Monsieur,", "mes salutations distinguées."]
      }
    ],
    nativeModelText: {
      fr: "Monsieur, suite à ma visite de ce matin, je vous confirme mon vif intérêt pour votre deux-pièces situé boulevard Malesherbes. Titulaire d'un contrat à durée indéterminée (CDI) hors période d'essai, je perçois des revenus nets trois fois supérieurs au loyer charges comprises, complétés par une caution solidaire. Vous trouverez ci-joint toutes les pièces justificatives requises. Attaché au calme de la copropriété, je saurai me montrer un locataire soigneux et pérenne. Veuillez agréer, Monsieur, l'expression de mes salutations distinguées.",
      en: "Sir, following my visit this morning, I confirm my strong interest in your two-room apartment on Boulevard Malesherbes. Holding a permanent employment contract beyond the trial period, I earn a net income three times higher than the rent including charges, backed by a joint guarantor. Please find attached all required supporting documents. Committed to the tranquility of the building, I will prove to be a careful and long-term tenant. Please accept, Sir, the expression of my distinguished regards."
    }
  },
  {
    id: "write_b2_reclamation_sncf",
    cefr: "B2",
    category: "Droits & Consommation",
    title: "Mise en Demeure & Réclamation Officielle (SNCF / Banque)",
    location: "Gare de Lyon & Opéra (12e / 9e)",
    forceSubjunctive: true,
    context: "Your high-speed TGV back to Paris was cancelled at the last minute without assistance, and the automatic ticket terminal double-charged your bank card (€290). Customer service ignored your first ticket.",
    prompt: "Write a firm, legally grounded B2 formal complaint letter requesting full reimbursement of the duplicate charge and statutory compensation within fifteen days.",
    requiredKeywords: [
      { fr: "par la présente", en: "hereby / by this letter" },
      { fr: "en dépit de mes relances", en: "despite my follow-ups" },
      { fr: "bien que", en: "although (+ subjunctive)" },
      { fr: "préjudice subi", en: "damage / detriment suffered" },
      { fr: "dans les plus brefs délais", en: "at the earliest opportunity / as soon as possible" },
      { fr: "à défaut de régularisation", en: "failing settlement / rectification" }
    ],
    sentenceBuilders: [
      {
        step: 1,
        goal: "Formal opening & statement of facts",
        fr: "Par la présente, je conteste le double débit abusif de 290 euros opéré lors de l'annulation du TGV 6614.",
        en: "Hereby, I contest the improper double debit of 290 euros made during the cancellation of TGV 6614.",
        tiles: ["Par la présente,", "je conteste", "le double débit abusif", "de 290 euros", "opéré lors de l'annulation", "du TGV 6614."]
      },
      {
        step: 2,
        goal: "Concessive clause with Subjunctive",
        fr: "Bien que j'aie transmis l'intégralité des justificatifs, mon dossier demeure sans réponse en dépit de mes relances.",
        en: "Although I transmitted all receipts, my file remains unanswered despite my follow-ups.",
        tiles: ["Bien que", "j'aie transmis", "l'intégralité des justificatifs,", "mon dossier demeure", "sans réponse", "en dépit de mes relances."]
      },
      {
        step: 3,
        goal: "Demand restitution & compensation",
        fr: "En conséquence, je vous prie de procéder au remboursement intégral dans les plus brefs délais afin de réparer le préjudice subi.",
        en: "Consequently, I ask you to proceed with a full refund as soon as possible in order to remedy the detriment suffered.",
        tiles: ["En conséquence,", "je vous prie de", "procéder au remboursement intégral", "dans les plus brefs délais", "afin de réparer", "le préjudice subi."]
      },
      {
        step: 4,
        goal: "Escalation warning to Ombudsman",
        fr: "À défaut de régularisation sous quinze jours, je saisirai le Médiateur national.",
        en: "Failing settlement within fifteen days, I will refer the matter to the National Ombudsman.",
        tiles: ["À défaut de", "régularisation", "sous quinze jours,", "je saisirai", "le Médiateur national."]
      }
    ],
    nativeModelText: {
      fr: "Madame, Monsieur, par la présente, je porte réclamation concernant l'annulation du TGV 6614 du 12 octobre ainsi que le double prélèvement de 290 euros constaté sur mon relevé bancaire. Bien que j'aie transmis l'ensemble des justificatifs dès le lendemain, aucune suite n'a été donnée en dépit de mes relances. Je vous mets donc en demeure de procéder au remboursement intégral des sommes indûment perçues dans les plus brefs délais, en réparation du préjudice subi. À défaut de régularisation sous quinzaine, je me verrai contraint de saisir le Médiateur de la consommation.",
      en: "Dear Sir or Madam, hereby I lodge a formal complaint regarding the cancellation of TGV 6614 on October 12th as well as the duplicate charge of 290 euros on my bank statement. Although I submitted all supporting receipts the very next day, no action has been taken despite my follow-ups. I therefore formally demand that you proceed with the full refund of the improperly collected sums as soon as possible, to remedy the detriment suffered. Failing settlement within fifteen days, I shall be compelled to refer the matter to the Consumer Ombudsman."
    }
  },
  {
    id: "write_b2_essai_teletravail",
    cefr: "B2",
    category: "Essai Argumenté DELF B2",
    title: "Tribune : Télétravail et Métamorphose de la Vie Urbaine",
    location: "Mairie de Paris & Le Monde Idées",
    context: "A major Parisian daily newspaper invites readers to contribute to a debate column: 'Is hybrid remote work saving or hollowing out the soul of central Paris?'",
    prompt: "Write a structured B2 argumentative essay (120–160 words) weighing the quality-of-life benefits of remote work against the socio-economic risks for urban social cohesion and local bistros.",
    requiredKeywords: [
      { fr: "force est de constater que", en: "one must acknowledge that" },
      { fr: "d'une part... d'autre part", en: "on the one hand... on the other hand" },
      { fr: "en revanche", en: "on the other hand / conversely" },
      { fr: "il n'en demeure pas moins que", en: "nevertheless / the fact remains that" },
      { fr: "le tissu social", en: "the social fabric" },
      { fr: "en définitive", en: "ultimately / in conclusion" }
    ],
    sentenceBuilders: [
      {
        step: 1,
        goal: "Frame the contemporary debate",
        fr: "Depuis l'essor du numérique, force est de constater que le télétravail redéfinit profondément notre rapport à la métropole.",
        en: "Since the rise of digital technology, one must acknowledge that remote work is profoundly redefining our relationship with the metropolis.",
        tiles: ["Depuis l'essor du numérique,", "force est de constater que", "le télétravail", "redéfinit profondément", "notre rapport", "à la métropole."]
      },
      {
        step: 2,
        goal: "Present the thesis (benefits for commuters)",
        fr: "D'une part, cette flexibilité épargne aux salariés la fatigue des transports saturés et favorise l'équilibre familial.",
        en: "On the one hand, this flexibility spares employees the fatigue of crowded transit and promotes work-life balance.",
        tiles: ["D'une part,", "cette flexibilité", "épargne aux salariés", "la fatigue des transports saturés", "et favorise", "l'équilibre familial."]
      },
      {
        step: 3,
        goal: "Present the antithesis (urban vitality & social cohesion)",
        fr: "En revanche, il n'en demeure pas moins que l'isolement prolongé fragilise le tissu social et pénalise les commerces de quartier.",
        en: "Conversely, the fact remains that prolonged isolation weakens the social fabric and penalizes neighborhood businesses.",
        tiles: ["En revanche,", "il n'en demeure pas moins que", "l'isolement prolongé", "fragilise le tissu social", "et pénalise", "les commerces de quartier."]
      },
      {
        step: 4,
        goal: "Synthesize a balanced conclusion",
        fr: "En définitive, seul un modèle hybride concerté préservera le dynamisme culturel parisien.",
        en: "Ultimately, only a concerted hybrid model will preserve Parisian cultural dynamism.",
        tiles: ["En définitive,", "seul un modèle hybride", "concerté", "préservera", "le dynamisme culturel parisien."]
      }
    ],
    nativeModelText: {
      fr: "Depuis quelques années, force est de constater que la généralisation du télétravail bouleverse l'équilibre des grandes métropoles comme Paris. D'une part, cette organisation offre un gain de temps considérable aux actifs en réduisant la pénibilité des trajets quotidiens, tout en apaisant la congestion urbaine. En revanche, d'autre part, il n'en demeure pas moins que la désertification des bureaux menace les restaurateurs indépendants et distend le tissu social au sein des équipes. En définitive, plutôt que d'opposer présence et distance, il convient d'inventer un rythme hybride qui sauvegarde la vitalité de nos quartiers.",
      en: "In recent years, one must acknowledge that the widespread adoption of remote work has disrupted the balance of major metropolises like Paris. On the one hand, this arrangement offers considerable time savings to workers by reducing the strain of daily commutes, while easing urban congestion. Conversely, on the other hand, the fact remains that the emptying of offices threatens independent restaurateurs and frays the social fabric within teams. Ultimately, rather than pitting presence against distance, we must invent a hybrid rhythm that safeguards the vitality of our neighborhoods."
    }
  },

  // --------------------------------------------------------------------------
  // C1 CORPORATE & EXECUTIVE LIFE MISSIONS (4)
  // --------------------------------------------------------------------------
  {
    id: "write_c1_pitch_ladefense",
    cefr: "C1",
    category: "Carrière & Executive",
    title: "Lettre d'Approche Exécutive — Tour Majunga, La Défense",
    location: "Quartier d'Affaires de La Défense",
    context: "You are applying for the role of Director of International Strategy at a flagship European luxury and clean-tech group headquartered in Tour Majunga at La Défense.",
    prompt: "Compose an incisive C1 executive pitch & cover letter (140–180 words) demonstrating strategic vision, cross-cultural leadership, nominalized achievements, and immediate operational value.",
    requiredKeywords: [
      { fr: "fort(e) d'une expérience de", en: "backed by experience in" },
      { fr: "s'inscrire dans la lignée de", en: "to align with / follow in the tradition of" },
      { fr: "à l'aune de", en: "in light of / measured by" },
      { fr: "levier de croissance", en: "growth lever / driver" },
      { fr: "mettre à profit", en: "to leverage / put to good use" },
      { fr: "je me tiens à votre entière disposition", en: "I remain at your full disposal" }
    ],
    sentenceBuilders: [
      {
        step: 1,
        goal: "Executive hook & alignment with company strategy",
        fr: "À l'aune de votre expansion européenne, ma candidature s'inscrit dans la lignée de votre ambition d'excellence durable.",
        en: "In light of your European expansion, my candidacy aligns with your ambition for sustainable excellence.",
        tiles: ["À l'aune de", "votre expansion européenne,", "ma candidature", "s'inscrit dans la lignée de", "votre ambition", "d'excellence durable."]
      },
      {
        step: 2,
        goal: "Highlight track record using C1 nominalization",
        fr: "Fort d'une expérience de huit ans en pilotage stratégique, j'ai accompagné la restructuration de trois filiales internationales.",
        en: "Backed by eight years of experience in strategic steering, I led the restructuring of three international subsidiaries.",
        tiles: ["Fort d'une expérience de", "huit ans en pilotage stratégique,", "j'ai accompagné", "la restructuration de", "trois filiales internationales."]
      },
      {
        step: 3,
        goal: "Articulate value proposition & growth levers",
        fr: "Mon souhait est de mettre à profit cette double compétence financière et diplomatique comme levier de croissance pour votre groupe.",
        en: "My aim is to leverage this dual financial and diplomatic expertise as a growth driver for your group.",
        tiles: ["Mon souhait est de", "mettre à profit", "cette double compétence", "financière et diplomatique", "comme levier de croissance", "pour votre groupe."]
      },
      {
        step: 4,
        goal: "Polished C1 call to interview",
        fr: "Je me tiens à votre entière disposition pour vous exposer de vive voix ma feuille de route opérationnelle.",
        en: "I remain at your full disposal to present my operational roadmap to you in person.",
        tiles: ["Je me tiens", "à votre entière disposition", "pour vous exposer", "de vive voix", "ma feuille de route opérationnelle."]
      }
    ],
    nativeModelText: {
      fr: "Madame la Directrice Générale, à l'aune de l'accélération de votre déploiement européen, ma candidature au poste de Directeur de la Stratégie s'inscrit dans la lignée de vos engagements en matière d'innovation bas-carbone. Fort d'une expérience de huit années dans le pilotage de projets transfrontaliers, j'ai notamment orchestré l'intégration de nouvelles filiales dont la rentabilité a crû de 28 %. Désireux de mettre à profit cette expertise analytique et managériale comme levier de croissance au sein de vos équipes de La Défense, je me tiens à votre entière disposition pour vous présenter ma vision lors d'un entretien.",
      en: "Madam Chief Executive Officer, in light of the acceleration of your European rollout, my application for the position of Strategy Director aligns with your commitments to low-carbon innovation. Backed by eight years of experience steering cross-border projects, I notably orchestrated the integration of new subsidiaries whose profitability grew by 28%. Eager to leverage this analytical and managerial expertise as a growth driver within your La Défense teams, I remain at your full disposal to present my vision during an interview."
    }
  },
  {
    id: "write_c1_negociation_salariale",
    cefr: "C1",
    category: "Négociation & Leadership",
    title: "Mémorandum de Revalorisation Salariale & Promotion",
    location: "Siège Social — Avenue Montaigne (8e)",
    context: "Over the past year, you absorbed the responsibilities of a departing VP, expanded client retention by 35%, and mentored six junior analysts. Ahead of your annual review, you send a strategic memo to the Managing Partner.",
    prompt: "Write a diplomatic yet uncompromising C1 internal memo proposing a promotion to Associate Director and a 18% compensation adjustment, anchored in quantifiable outcomes.",
    requiredKeywords: [
      { fr: "Force est de souligner", en: "It must be emphasized" },
      { fr: "élargissement du périmètre", en: "expansion of scope / responsibilities" },
      { fr: "en adéquation avec", en: "in alignment / commensurate with" },
      { fr: "création de valeur", en: "value creation" },
      { fr: "dès lors", en: "consequently / from then on" },
      { fr: "convenir d'un point d'étape", en: "to agree on a review meeting" }
    ],
    sentenceBuilders: [
      {
        step: 1,
        goal: "Establish context of expanded scope",
        fr: "À l'approche de notre bilan annuel, je souhaite porter à votre attention l'élargissement substantiel de mon périmètre de responsabilités.",
        en: "As our annual review approaches, I wish to bring to your attention the substantial expansion of my scope of responsibilities.",
        tiles: ["À l'approche de", "notre bilan annuel,", "je souhaite porter à votre attention", "l'élargissement substantiel", "de mon périmètre", "de responsabilités."]
      },
      {
        step: 2,
        goal: "Highlight measurable value creation",
        fr: "Force est de souligner que la refonte de notre portefeuille clients s'est traduite par une création de valeur pérenne (+35 %).",
        en: "It must be emphasized that the overhaul of our client portfolio resulted in lasting value creation (+35%).",
        tiles: ["Force est de souligner que", "la refonte de", "notre portefeuille clients", "s'est traduite par", "une création de valeur pérenne (+35 %)."]
      },
      {
        step: 3,
        goal: "Formulate the compensation & title adjustment request",
        fr: "Dès lors, il paraît légitime d'envisager une revalorisation salariale en adéquation avec les pratiques du marché et mon niveau d'engagement.",
        en: "Consequently, it seems legitimate to envisage a salary adjustment commensurate with market practices and my level of commitment.",
        tiles: ["Dès lors,", "il paraît légitime", "d'envisager une revalorisation salariale", "en adéquation avec", "les pratiques du marché", "et mon niveau d'engagement."]
      },
      {
        step: 4,
        goal: "Propose a constructive discussion",
        fr: "Je vous propose de convenir d'un point d'étape cette semaine afin d'en arrêter les modalités.",
        en: "I suggest we agree on a review meeting this week in order to finalize the terms.",
        tiles: ["Je vous propose de", "convenir d'un point d'étape", "cette semaine", "afin d'en arrêter", "les modalités."]
      }
    ],
    nativeModelText: {
      fr: "Monsieur l'Associé-Gérant, à l'approche de nos entretiens annuels d'évaluation, je tenais à dresser un bilan synthétique de l'élargissement du périmètre qui m'a été confié cette année. Force est de souligner que la reprise en main du pôle Grands Comptes ainsi que l'encadrement de six analystes ont généré une création de valeur mesurable, illustrée par une hausse de 35 % du taux de fidélisation. Dès lors, je sollicite l'évolution de mon titre vers celui de Directeur Associé, assortie d'une revalorisation globale de 18 %, en adéquation avec ces nouvelles prérogatives. Je vous remercie par avance et vous propose de convenir d'un point d'étape prochainement.",
      en: "Dear Managing Partner, as our annual performance reviews approach, I wanted to provide a concise summary of the expansion of scope entrusted to me this year. It must be emphasized that taking over the Key Accounts division and supervising six analysts generated measurable value creation, illustrated by a 35% increase in retention rate. Consequently, I request the progression of my title to Associate Director, accompanied by an overall 18% compensation adjustment, commensurate with these new prerogatives. I thank you in advance and suggest we agree on a review meeting shortly."
    }
  },
  {
    id: "write_c1_comite_crise",
    cefr: "C1",
    category: "Gouvernance & Stratégie",
    title: "Compte Rendu Exécutif de Cellule de Crise (COMEX)",
    location: "Tour First — La Défense",
    context: "A critical supply-chain and cybersecurity incident threatened your European logistics hub. You chaired the emergency COMEX session and must now issue the authoritative synthesis memo to the Board of Directors.",
    prompt: "Draft a rigorous C1 executive board summary detailing the containment protocol, stakeholder communication, mitigation measures, and governance safeguards.",
    requiredKeywords: [
      { fr: "à l'issue de", en: "at the conclusion of / following" },
      { fr: "mesures conservatoires", en: "precautionary / protective measures" },
      { fr: "circonscrire l'incident", en: "to contain / ring-fence the incident" },
      { fr: "afin qu'aucune", en: "so that no (+ subjunctive)" },
      { fr: "continuité d'activité", en: "business continuity" },
      { fr: "audit approfondi", en: "in-depth audit" }
    ],
    sentenceBuilders: [
      {
        step: 1,
        goal: "Summarize the emergency session outcome",
        fr: "À l'issue de la réunion extraordinaire du Comité Exécutif, un protocole d'urgence a été déployé pour circonscrire l'incident.",
        en: "At the conclusion of the extraordinary Executive Committee meeting, an emergency protocol was deployed to contain the incident.",
        tiles: ["À l'issue de", "la réunion extraordinaire", "du Comité Exécutif,", "un protocole d'urgence", "a été déployé", "pour circonscrire l'incident."]
      },
      {
        step: 2,
        goal: "Detail precautionary measures & subjunctive purpose clause",
        fr: "Des mesures conservatoires immédiates ont été prises afin qu'aucune donnée sensible ne soit compromise.",
        en: "Immediate precautionary measures were taken so that no sensitive data would be compromised.",
        tiles: ["Des mesures conservatoires", "immédiates", "ont été prises", "afin qu'aucune", "donnée sensible", "ne soit compromise."]
      },
      {
        step: 3,
        goal: "Confirm operational continuity",
        fr: "Le basculement sur nos serveurs redondants garantit désormais la pleine continuité d'activité de nos flux logistiques.",
        en: "Switching over to our redundant servers now guarantees full business continuity for our logistics flows.",
        tiles: ["Le basculement sur", "nos serveurs redondants", "garantit désormais", "la pleine continuité d'activité", "de nos flux logistiques."]
      },
      {
        step: 4,
        goal: "Mandate independent post-mortem audit",
        fr: "Parallèlement, un audit approfondi a été diligenté pour renforcer durablement notre résilience opérationnelle.",
        en: "In parallel, an in-depth audit has been commissioned to durably strengthen our operational resilience.",
        tiles: ["Parallèlement,", "un audit approfondi", "a été diligenté", "pour renforcer durablement", "notre résilience opérationnelle."]
      }
    ],
    nativeModelText: {
      fr: "Mesdames et Messieurs les Administrateurs, à l'issue de la cellule de crise réunie ce jour à 08h00, l'ensemble des mesures conservatoires nécessaires a été activé pour circonscrire l'incident affectant notre plateforme logistique. L'isolation préventive du réseau a été ordonnée afin qu'aucune donnée client ne soit compromise, tandis que le basculement sur nos infrastructures de secours assure d'ores et déjà la continuité d'activité. Par ailleurs, un audit approfondi indépendant a été diligenté sous quarante-huit heures en vue d'éliminer toute vulnérabilité résiduelle.",
      en: "Members of the Board, at the conclusion of the crisis unit convened today at 08:00, all necessary precautionary measures were activated to contain the incident affecting our logistics platform. Preventive network isolation was ordered so that no client data would be compromised, while switching to our backup infrastructure already ensures business continuity. Furthermore, an independent in-depth audit has been commissioned within forty-eight hours with a view to eliminating any residual vulnerability."
    }
  },
  {
    id: "write_c1_prefecture_recours",
    cefr: "C1",
    category: "Droit Administratif & Citoyenneté",
    title: "Recours Gracieux & Requête Préfectorale (Préfecture de Police)",
    location: "Île de la Cité (4e)",
    context: "Due to an IT glitch on the ANEF portal, your multi-year 'Passeport Talent' renewal or naturalization dossier was marked incomplete despite timely submission of every certified tax and employment certificate.",
    prompt: "Write a C1 administrative 'Recours Gracieux' addressed to Monsieur le Préfet de Police de Paris, citing administrative law principles, proving good-faith compliance, and requesting immediate re-examination.",
    requiredKeywords: [
      { fr: "j'ai l'honneur de solliciter", en: "I have the honor of requesting (high administrative register)" },
      { fr: "votre haute bienveillance", en: "your high consideration / benevolence" },
      { fr: "dysfonctionnement technique", en: "technical malfunction" },
      { fr: "dans les délais impartis", en: "within the prescribed deadlines" },
      { fr: "réexamen bienveillant", en: "favorable re-examination" },
      { fr: "je vous prie d'agréer, Monsieur le Préfet", en: "I beg you to accept, Mister Prefect" }
    ],
    sentenceBuilders: [
      {
        step: 1,
        goal: "Protocolary opening to the Prefect of Police",
        fr: "Monsieur le Préfet, j'ai l'honneur de solliciter de votre haute bienveillance le réexamen bienveillant de mon dossier.",
        en: "Mister Prefect, I have the honor of requesting from your high consideration the favorable re-examination of my file.",
        tiles: ["Monsieur le Préfet,", "j'ai l'honneur de solliciter", "de votre haute bienveillance", "le réexamen bienveillant", "de mon dossier."]
      },
      {
        step: 2,
        goal: "Demonstrate timely compliance & technical glitch",
        fr: "L'intégralité des pièces requises a été téléversée dans les délais impartis, malgré un dysfonctionnement technique du portail dématérialisé.",
        en: "All required documents were uploaded within the prescribed deadlines, despite a technical malfunction of the online portal.",
        tiles: ["L'intégralité des pièces requises", "a été téléversée", "dans les délais impartis,", "malgré un dysfonctionnement technique", "du portail dématérialisé."]
      },
      {
        step: 3,
        goal: "Emphasize professional & fiscal integration in France",
        fr: "Exerçant mes fonctions à Paris de manière ininterrompue et m'acquittant de l'ensemble de mes obligations fiscales, je joins les justificatifs horodatés.",
        en: "Exercising my duties in Paris uninterruptedly and fulfilling all my tax obligations, I attach the timestamped proofs.",
        tiles: ["Exerçant mes fonctions à Paris", "de manière ininterrompue", "et m'acquittant de", "mes obligations fiscales,", "je joins les justificatifs horodatés."]
      },
      {
        step: 4,
        goal: "Protocolary closing formula",
        fr: "Je vous prie d'agréer, Monsieur le Préfet, l'expression de ma très haute considération.",
        en: "I beg you to accept, Mister Prefect, the expression of my very high consideration.",
        tiles: ["Je vous prie d'agréer,", "Monsieur le Préfet,", "l'expression de", "ma très haute considération."]
      }
    ],
    nativeModelText: {
      fr: "Monsieur le Préfet, j'ai l'honneur de solliciter de votre haute bienveillance le réexamen bienveillant de ma demande de renouvellement de titre de séjour « Passeport Talent ». Bien que l'intégralité des pièces justificatives ait été transmise dans les délais impartis, un dysfonctionnement technique de la plateforme ANEF a fait obstacle à l'enregistrement de mon avis d'imposition. Vous trouverez sous ce pli les captures horodatées attestant ma parfaite bonne foi ainsi que la stabilité de mon insertion professionnelle à Paris. Dans l'attente d'une issue favorable, je vous prie d'agréer, Monsieur le Préfet, l'expression de ma très haute considération.",
      en: "Mister Prefect, I have the honor of requesting from your high consideration the favorable re-examination of my 'Talent Passport' residence permit renewal application. Although all supporting documents were submitted within the prescribed deadlines, a technical malfunction on the ANEF platform prevented the registration of my tax notice. Enclosed please find the timestamped screenshots attesting to my complete good faith as well as the stability of my professional integration in Paris. Awaiting a favorable outcome, I beg you to accept, Mister Prefect, the expression of my very high consideration."
    }
  },

  // --------------------------------------------------------------------------
  // DALF C2 SUPREME EXAM MISSIONS (3)
  // --------------------------------------------------------------------------
  {
    id: "write_c2_synthese_ia",
    cefr: "C2",
    category: "DALF C2 — Synthèse & Essai",
    title: "Synthèse Magistrale : Intelligence Artificielle et Génie Créatif Humain",
    location: "Grand Amphithéâtre de la Sorbonne (5e)",
    forceSubjunctive: true,
    context: "DALF C2 Written Examination — Humanities & Epistemology Jury. You must compose an objective, high-register synthesis examining whether generative algorithms eclipse human artistic creation or dialectical consciousness.",
    prompt: "Write a C2 synthesis & critical reflection (180–240 words) deploying literary connectors, past/present subjunctive, nominalization, and epistemological nuance.",
    requiredKeywords: [
      { fr: "quoique", en: "although / even though (+ subjunctive)" },
      { fr: "paradigme épistémologique", en: "epistemological paradigm" },
      { fr: "irréductible à", en: "irreducible to" },
      { fr: "en aucun cas... ne saurait", en: "under no circumstances could (literary conditional)" },
      { fr: "contingence existentielle", en: "existential contingency" },
      { fr: "en dernière analyse", en: "in the final analysis" }
    ],
    sentenceBuilders: [
      {
        step: 1,
        goal: "Establish the epistemological shift",
        fr: "L'avènement des modèles génératifs instaure un nouveau paradigme épistémologique qui interroge la singularité de l'acte créateur.",
        en: "The advent of generative models establishes a new epistemological paradigm that questions the singularity of the creative act.",
        tiles: ["L'avènement des modèles génératifs", "instaure un nouveau", "paradigme épistémologique", "qui interroge la singularité", "de l'acte créateur."]
      },
      {
        step: 2,
        goal: "Concessive subjunctive clause contrasting computation and lived experience",
        fr: "Quoique la puissance combinatoire de l'algorithme puisse imiter le style, elle demeure étrangère à la contingence existentielle.",
        en: "Although the combinatorial power of the algorithm may imitate style, it remains foreign to existential contingency.",
        tiles: ["Quoique la puissance combinatoire", "de l'algorithme", "puisse imiter le style,", "elle demeure étrangère", "à la contingence existentielle."]
      },
      {
        step: 3,
        goal: "Deploy literary negative 'ne saurait' and 'irréductible à'",
        fr: "En aucun cas la corrélation statistique ne saurait se substituer à l'intentionnalité poétique, irréductible à un simple calcul probabiliste.",
        en: "Under no circumstances could statistical correlation substitute for poetic intentionality, which is irreducible to a mere probabilistic calculation.",
        tiles: ["En aucun cas", "la corrélation statistique", "ne saurait se substituer", "à l'intentionnalité poétique,", "irréductible à", "un simple calcul probabiliste."]
      },
      {
        step: 4,
        goal: "Elevate to a dialectical conclusion",
        fr: "En dernière analyse, loin d'abolir l'esprit critique, l'outil numérique en révèle l'insubstituable souveraineté.",
        en: "In the final analysis, far from abolishing critical spirit, the digital tool reveals its irreplaceable sovereignty.",
        tiles: ["En dernière analyse,", "loin d'abolir", "l'esprit critique,", "l'outil numérique", "en révèle", "l'insubstituable souveraineté."]
      }
    ],
    nativeModelText: {
      fr: "L'irruption des intelligences artificielles génératives au cœur de la production symbolique instaure un changement de paradigme épistémologique majeur. Certes, la vélocité avec laquelle ces architectures synthétisent le patrimoine textuel et pictural bouscule nos catégories esthétiques traditionnelles. Toutefois, quoique la prouesse algorithmique puisse simuler l'harmonie formelle, en aucun cas elle ne saurait épuiser l'essence de l'œuvre d'art. Celle-ci procède en effet d'une contingence existentielle, d'un vertige devant la finitude qui demeure irréductible à toute modélisation stochastique. En dernière analyse, l'automatisation du pastiche contraint l'esprit humain à réinvestir ce qui lui appartient en propre : l'audace de la rupture et la souveraineté du sens.",
      en: "The emergence of generative artificial intelligence at the heart of symbolic production establishes a major epistemological paradigm shift. Admittedly, the velocity with which these architectures synthesize textual and pictorial heritage disrupts our traditional aesthetic categories. However, although algorithmic prowess may simulate formal harmony, under no circumstances could it exhaust the essence of the artwork. Indeed, the latter stems from an existential contingency, a vertigo before finitude that remains irreducible to any stochastic modeling. In the final analysis, the automation of pastiche compels the human mind to reinvest what is uniquely its own: the audacity of rupture and the sovereignty of meaning."
    }
  },
  {
    id: "write_c2_dialectique_ecologie",
    cefr: "C2",
    category: "DALF C2 — Politique & Économie",
    title: "Dissertation Dialectique : Transition Écologique et Souveraineté Économique",
    location: "Sciences Po & Rue Saint-Guillaume (7e)",
    forceSubjunctive: true,
    context: "DALF C2 Essay Prompt: 'Does radical decarbonization require sacrificing European industrial sovereignty, or is ecological planning the very condition of future geopolitical autonomy?'",
    prompt: "Write a C2 dialectical dissertation (180–240 words) moving seamlessly from thesis (short-term industrial competitiveness) to antithesis (ecological imperative) and dépassement (sovereign green re-industrialization).",
    requiredKeywords: [
      { fr: "loin de s'exclure mutuellement", en: "far from being mutually exclusive" },
      { fr: "à court terme", en: "in the short term" },
      { fr: "nonobstant", en: "notwithstanding / despite" },
      { fr: "pour peu que", en: "provided that (+ subjunctive)" },
      { fr: "découplage", en: "decoupling" },
      { fr: "dépassement dialectique", en: "dialectical transcendence / resolution" }
    ],
    sentenceBuilders: [
      {
        step: 1,
        goal: "Pose the apparent antinomy between ecology and industry",
        fr: "On oppose fréquemment l'impératif climatique à la compétitivité industrielle, comme s'il s'agissait d'un dilemme insoluble.",
        en: "The climate imperative is frequently pitted against industrial competitiveness, as though it were an insoluble dilemma.",
        tiles: ["On oppose fréquemment", "l'impératif climatique", "à la compétitivité industrielle,", "comme s'il s'agissait", "d'un dilemme insoluble."]
      },
      {
        step: 2,
        goal: "Analyze structural constraints with 'nonobstant'",
        fr: "Nonobstant le coût initial des normes environnementales à court terme, l'inaction exposerait nos économies à une dépendance énergétique fatale.",
        en: "Notwithstanding the initial cost of environmental standards in the short term, inaction would expose our economies to fatal energy dependency.",
        tiles: ["Nonobstant le coût initial", "des normes environnementales", "à court terme,", "l'inaction exposerait nos économies", "à une dépendance énergétique fatale."]
      },
      {
        step: 3,
        goal: "Introduce the conditional subjunctive trigger 'pour peu que'",
        fr: "Loin de s'exclure mutuellement, décarbonation et autonomie stratégique convergent pour peu que l'investissement public orchestre ce découplage.",
        en: "Far from being mutually exclusive, decarbonization and strategic autonomy converge provided that public investment orchestrates this decoupling.",
        tiles: ["Loin de s'exclure mutuellement,", "décarbonation et autonomie stratégique", "convergent", "pour peu que", "l'investissement public", "orchestre ce découplage."]
      },
      {
        step: 4,
        goal: "Formulate the C2 dialectical synthesis",
        fr: "Ce dépassement dialectique érige la sobriété technologique en véritable socle de la souveraineté européenne.",
        en: "This dialectical resolution elevates technological sobriety into the true foundation of European sovereignty.",
        tiles: ["Ce dépassement dialectique", "érige la sobriété technologique", "en véritable socle", "de la souveraineté européenne."]
      }
    ],
    nativeModelText: {
      fr: "La tension entre bifurcation écologique et préservation de la puissance productive constitue l'une des apories majeures du débat contemporain. À court terme, d'aucuns redoutent qu'une réglementation asymétrique ne fragilise le tissu manufacturier européen face à des concurrents moins scrupuleux. Nonobstant ces frictions transitoires, opposer pérennité biosphérique et indépendance géopolitique relève d'une myopie stratégique : l'asservissement aux hydrocarbures importés demeure notre plus grande vulnérabilité. Loin de s'exclure mutuellement, ces deux exigences s'articulent dans un dépassement dialectique fécond, pour peu que la puissance publique planifie le découplage carbone et réindustrialise les filières critiques.",
      en: "The tension between ecological transition and the preservation of productive power constitutes one of the major aporias of contemporary debate. In the short term, some fear that asymmetrical regulation might weaken the European manufacturing fabric against less scrupulous competitors. Notwithstanding these transitional frictions, pitting biospheric sustainability against geopolitical independence stems from strategic myopia: subservience to imported hydrocarbons remains our greatest vulnerability. Far from being mutually exclusive, these two imperatives interlock in a fruitful dialectical resolution, provided that public authorities plan carbon decoupling and re-industrialize critical sectors."
    }
  },
  {
    id: "write_c2_grand_oral_sorbonne",
    cefr: "C2",
    category: "DALF C2 — Grand Jury Oral",
    title: "Exorde du Grand Oral devant le Jury de la Sorbonne",
    location: "Salle des Actes — La Sorbonne & Panthéon (5e)",
    forceSubjunctive: true,
    context: "The culmination of your Parisian odyssey: you stand before the President of the Sorbonne DALF C2 Grand Jury to deliver your opening rhetorical statement (Exorde) on the role of language, nuance, and universalism in democratic debate.",
    prompt: "Deliver an unforgettable C2 Grand Jury opening address (180–240 words) demonstrating rhetorical cadence, inversion, subjunctive mastery, and philosophical depth.",
    requiredKeywords: [
      { fr: "Mesdames et Messieurs les membres du jury", en: "Ladies and Gentlemen of the Jury" },
      { fr: "il importe que", en: "it is imperative that (+ subjunctive)" },
      { fr: "quand bien même", en: "even if / even though (+ conditional)" },
      { fr: "l'exigence de nuance", en: "the requirement of nuance" },
      { fr: "à rebours de", en: "running counter to / against the grain of" },
      { fr: "c'est à cette aune que", en: "it is by this yardstick that" }
    ],
    sentenceBuilders: [
      {
        step: 1,
        goal: "Solemn opening address to the Sorbonne Jury",
        fr: "Mesdames et Messieurs les membres du jury, interroger la vitalité démocratique revient d'abord à scruter la justesse des mots qui la portent.",
        en: "Ladies and Gentlemen of the Jury, questioning democratic vitality first means scrutinizing the precision of the words that carry it.",
        tiles: ["Mesdames et Messieurs les membres du jury,", "interroger la vitalité démocratique", "revient d'abord à", "scruter la justesse des mots", "qui la portent."]
      },
      {
        step: 2,
        goal: "Contrast nuance with algorithmic polarization ('à rebours de')",
        fr: "À rebours de l'immédiateté polémique, il importe que l'espace public préserve l'exigence de nuance et la contradiction argumentée.",
        en: "Running counter to polemical immediacy, it is imperative that the public sphere preserve the requirement of nuance and reasoned debate.",
        tiles: ["À rebours de", "l'immédiateté polémique,", "il importe que", "l'espace public préserve", "l'exigence de nuance", "et la contradiction argumentée."]
      },
      {
        step: 3,
        goal: "Deploy 'quand bien même' + conditional",
        fr: "Quand bien même les passions contemporaines favoriseraient le slogan, la langue demeure notre seule architecture commune.",
        en: "Even if contemporary passions were to favor slogans, language remains our only shared architecture.",
        tiles: ["Quand bien même", "les passions contemporaines", "favoriseraient le slogan,", "la langue demeure", "notre seule architecture commune."]
      },
      {
        step: 4,
        goal: "Announce the tripartite French rhetorical plan",
        fr: "C'est à cette aune que nous examinerons successivement les périls de la simplification, puis les conditions d'un renouveau délibératif.",
        en: "It is by this yardstick that we shall successively examine the perils of simplification, and then the conditions for a deliberative renewal.",
        tiles: ["C'est à cette aune que", "nous examinerons successivement", "les périls de la simplification,", "puis les conditions", "d'un renouveau délibératif."]
      }
    ],
    nativeModelText: {
      fr: "Mesdames et Messieurs les membres du jury, penser la crise de la délibération contemporaine suppose d'interroger au préalable l'appauvrissement du langage civique. À rebours de la tyrannie de l'instant et des réflexes binaires, il importe que la parole publique reconquière l'exigence de nuance sans laquelle aucun dissensus fécond ne peut s'énoncer. Quand bien même l'économie de l'attention privilégierait l'invective au détriment de la démonstration, la rigueur conceptuelle demeure le rempart ultime contre l'arbitraire. C'est à cette aune que je me propose d'analyser, dans un premier temps, les mécanismes de la sidération rhétorique, avant d'esquisser, dans un second mouvement, les voies d'une éthique renouvelée de la discussion.",
      en: "Ladies and Gentlemen of the Jury, reflecting on the crisis of contemporary deliberation requires first questioning the impoverishment of civic language. Running counter to the tyranny of the instant and binary reflexes, it is imperative that public speech reclaim the requirement of nuance without which no fruitful dissent can be articulated. Even if the attention economy were to privilege invective at the expense of demonstration, conceptual rigor remains the ultimate bulwark against arbitrariness. It is by this yardstick that I propose to analyze, first, the mechanisms of rhetorical stupor, before outlining, in a second movement, the pathways toward a renewed ethics of discussion."
    }
  },
  {
    id: "write_a1_sms_camille",
    cefr: "A1",
    category: "A1 — Vie Quotidienne & SMS",
    title: "Premier SMS à Camille pour un café à Paris",
    location: "Café de Flore — Saint-Germain (6e)",
    forceSubjunctive: false,
    context: "You just arrived in Paris and want to text your French friend Camille to suggest meeting for coffee tomorrow morning at 10 AM.",
    prompt: "Write a warm, simple A1 French message (30–50 words) greeting Camille, saying you are in Paris, and asking to meet for a coffee tomorrow.",
    requiredKeywords: [
      { fr: "Bonjour", en: "Hello" },
      { fr: "je suis à Paris", en: "I am in Paris" },
      { fr: "demain matin", en: "tomorrow morning" },
      { fr: "un café", en: "a coffee" }
    ],
    sentenceBuilders: [
      { step: 1, goal: "Greet warmly and announce arrival", fr: "Salut Camille ! Je suis à Paris et je suis très content.", en: "Hi Camille! I am in Paris and I am very happy.", tiles: ["Salut Camille !", "Je suis à Paris", "et je suis", "très content."] },
      { step: 2, goal: "Suggest meeting tomorrow", fr: "Est-ce que tu es libre demain matin à dix heures pour un café ?", en: "Are you free tomorrow morning at 10 AM for a coffee?", tiles: ["Est-ce que tu es libre", "demain matin", "à dix heures", "pour un café ?"] }
    ],
    nativeModelText: {
      fr: "Salut Camille ! Je suis bien arrivé à Paris et je suis ravi. Est-ce que tu es libre demain matin à dix heures pour prendre un café en terrasse ? À très vite !",
      en: "Hi Camille! I arrived safely in Paris and I'm delighted. Are you free tomorrow morning at 10 AM to grab a coffee on the terrace? See you very soon!"
    }
  },
  {
    id: "write_a1_reservation_hotel",
    cefr: "A1",
    category: "A1 — Survie & Voyages",
    title: "Confirmer une réservation d'hôtel à Paris",
    location: "Quartier Latin — 5e Arrondissement",
    forceSubjunctive: false,
    context: "Send a polite short email to a small Parisian hotel to confirm your room for two nights and ask what time breakfast starts.",
    prompt: "Write a polite A1 email (35–55 words) confirming a room for two nights with 'vous' and asking about breakfast.",
    requiredKeywords: [
      { fr: "Bonjour", en: "Hello" },
      { fr: "je voudrais", en: "I would like" },
      { fr: "deux nuits", en: "two nights" },
      { fr: "petit-déjeuner", en: "breakfast" }
    ],
    sentenceBuilders: [
      { step: 1, goal: "Confirm the reservation politely", fr: "Bonjour, je voudrais confirmer ma réservation pour deux nuits.", en: "Hello, I would like to confirm my reservation for two nights.", tiles: ["Bonjour,", "je voudrais confirmer", "ma réservation", "pour deux nuits."] },
      { step: 2, goal: "Ask about breakfast hours", fr: "À quelle heure commence le petit-déjeuner, s'il vous plaît ?", en: "What time does breakfast start, please?", tiles: ["À quelle heure", "commence le petit-déjeuner,", "s'il vous plaît ?"] }
    ],
    nativeModelText: {
      fr: "Bonjour Madame, Monsieur, je voudrais confirmer ma réservation d'une chambre pour deux nuits, du vendredi au dimanche. À quelle heure est servi le petit-déjeuner, s'il vous plaît ? Merci beaucoup et à bientôt.",
      en: "Hello Madam, Sir, I would like to confirm my room reservation for two nights, from Friday to Sunday. What time is breakfast served, please? Thank you very much and see you soon."
    }
  },
  {
    id: "write_a2_recit_weekend",
    cefr: "A2",
    category: "A2 — Récit au Passé",
    title: "Raconter son week-end à Paris (Passé Composé & Imparfait)",
    location: "Canal Saint-Martin — 10e Arrondissement",
    forceSubjunctive: false,
    context: "Write a lively postcard/message to a friend describing your Parisian weekend using both Imparfait (weather/setting) and Passé Composé (events).",
    prompt: "Write a 60–90 word A2 story about your weekend: describe the weather (Imparfait) and 3 things you did (Passé Composé).",
    requiredKeywords: [
      { fr: "il faisait beau", en: "the weather was nice (Imparfait)" },
      { fr: "je suis allé", en: "I went (Passé Composé)" },
      { fr: "j'ai mangé", en: "I ate (Passé Composé)" },
      { fr: "c'était génial", en: "it was great" }
    ],
    sentenceBuilders: [
      { step: 1, goal: "Set the scene with Imparfait", fr: "Samedi matin, il faisait très beau et les rues étaient calmes.", en: "Saturday morning, the weather was lovely and the streets were quiet.", tiles: ["Samedi matin,", "il faisait très beau", "et les rues", "étaient calmes."] },
      { step: 2, goal: "Narrate actions with Passé Composé", fr: "Je suis allé au marché de la Bastille, puis j'ai mangé un croissant au canal.", en: "I went to the Bastille market, then I ate a croissant by the canal.", tiles: ["Je suis allé", "au marché de la Bastille,", "puis j'ai mangé", "un croissant au canal."] }
    ],
    nativeModelText: {
      fr: "Salut ! Mon week-end à Paris était superbe. Samedi, il faisait très beau : je suis allé au marché de la Bastille avec Yanis et j'ai acheté du fromage frais. Ensuite, nous avons mangé des crêpes près du canal. Dimanche, j'ai visité le Louvre : c'était génial !",
      en: "Hi! My weekend in Paris was superb. Saturday the weather was lovely: I went to the Bastille market with Yanis and bought fresh cheese. Then we ate crêpes near the canal. Sunday I visited the Louvre: it was awesome!"
    }
  },
  {
    id: "write_a2_decaler_rdv",
    cefr: "A2",
    category: "A2 — Démarches & Rendez-vous",
    title: "Décaler un rendez-vous chez le médecin",
    location: "Cabinet Médical — 5e Arrondissement",
    forceSubjunctive: false,
    context: "You have an unexpected work conflict and must politely write to Dr. Claire Valéry's office to reschedule your Thursday appointment.",
    prompt: "Write a polite A2 email (50–80 words) apologizing, explaining why you cannot come Thursday, and proposing Friday afternoon.",
    requiredKeywords: [
      { fr: "je suis désolé", en: "I am sorry" },
      { fr: "un empêchement", en: "an unexpected conflict" },
      { fr: "serait-il possible", en: "would it be possible" },
      { fr: "vendredi après-midi", en: "Friday afternoon" }
    ],
    sentenceBuilders: [
      { step: 1, goal: "Apologize and explain", fr: "Bonjour Docteur, je suis désolé mais j'ai un empêchement jeudi matin.", en: "Hello Doctor, I am sorry but I have a conflict Thursday morning.", tiles: ["Bonjour Docteur,", "je suis désolé", "mais j'ai un empêchement", "jeudi matin."] },
      { step: 2, goal: "Propose a new slot politely", fr: "Serait-il possible de décaler notre rendez-vous à vendredi après-midi ?", en: "Would it be possible to move our appointment to Friday afternoon?", tiles: ["Serait-il possible", "de décaler notre rendez-vous", "à vendredi après-midi ?"] }
    ],
    nativeModelText: {
      fr: "Bonjour Docteur Valéry, je suis vraiment désolé, mais j'ai un empêchement professionnel jeudi matin. Serait-il possible de décaler mon rendez-vous à vendredi après-midi ? Je vous remercie par avance pour votre compréhension. Bien cordialement.",
      en: "Hello Dr. Valéry, I am truly sorry, but I have a work conflict Thursday morning. Would it be possible to move my appointment to Friday afternoon? Thank you in advance for your understanding. Warm regards."
    }
  },
  {
    id: "write_b1_opinion_teletravail",
    cefr: "B1",
    category: "B1 — Essai d'Opinion & Connecteurs",
    title: "Donner son avis sur le télétravail à Paris",
    location: "Forum Citoyen & Entreprise — Paris",
    forceSubjunctive: false,
    context: "A French magazine asks readers whether remote work improves quality of life or creates isolation. Present a clear, structured B1 opinion.",
    prompt: "Write a structured B1 opinion post (100–140 words) weighing pros and cons using 'd'une part', 'cependant', and 'en conclusion'.",
    requiredKeywords: [
      { fr: "d'une part", en: "on the one hand" },
      { fr: "cependant", en: "however" },
      { fr: "en revanche", en: "on the other hand" },
      { fr: "à mon avis", en: "in my opinion" }
    ],
    sentenceBuilders: [
      { step: 1, goal: "State the main advantage", fr: "D'une part, le télétravail permet d'éviter les transports bondés et de gagner du temps.", en: "On the one hand, remote work avoids crowded transit and saves time.", tiles: ["D'une part,", "le télétravail permet", "d'éviter les transports bondés", "et de gagner du temps."] },
      { step: 2, goal: "Introduce a nuanced counterpoint", fr: "Cependant, travailler seul toute la semaine peut créer un sentiment d'isolement.", en: "However, working alone all week can create a feeling of isolation.", tiles: ["Cependant,", "travailler seul toute la semaine", "peut créer", "un sentiment d'isolement."] }
    ],
    nativeModelText: {
      fr: "À mon avis, le télétravail est une avancée formidable s'il reste équilibré. D'une part, il évite de perdre deux heures par jour dans le métro et améliore la concentration. Cependant, rester seul chez soi toute la semaine peut nuire à l'esprit d'équipe. En revanche, un rythme hybride — deux jours à la maison et trois jours au bureau — offre le meilleur des deux mondes.",
      en: "In my opinion, remote work is a wonderful step forward if it stays balanced. On the one hand, it avoids losing two hours a day on the metro and improves focus. However, staying alone at home all week can hurt team spirit. On the other hand, a hybrid schedule—two days at home and three at the office—offers the best of both worlds."
    }
  },
  {
    id: "write_b1_reclamation_sncf",
    cefr: "B1",
    category: "B1 — Lettre Formelle & Pronoms",
    title: "Réclamation polie suite à un TGV annulé",
    location: "Gare de Lyon — Service Client SNCF",
    forceSubjunctive: false,
    context: "Your Paris–Lyon TGV was cancelled last minute and you had to buy a new ticket. Write a clear, firm, polite B1 refund request.",
    prompt: "Write a 90–130 word B1 formal message explaining what happened, using object pronouns ('en', 'y', 'le') and requesting reimbursement.",
    requiredKeywords: [
      { fr: "je vous écris au sujet de", en: "I am writing to you regarding" },
      { fr: "malheureusement", en: "unfortunately" },
      { fr: "par conséquent", en: "consequently" },
      { fr: "remboursement", en: "reimbursement / refund" }
    ],
    sentenceBuilders: [
      { step: 1, goal: "State the issue clearly", fr: "Je vous écris au sujet de mon TGV Paris–Lyon qui a été annulé hier soir.", en: "I am writing regarding my Paris-Lyon TGV which was cancelled last night.", tiles: ["Je vous écris", "au sujet de mon TGV", "qui a été annulé", "hier soir."] },
      { step: 2, goal: "Request a refund politely", fr: "Par conséquent, je vous demande le remboursement intégral de mon billet.", en: "Consequently, I request a full refund of my ticket.", tiles: ["Par conséquent,", "je vous demande", "le remboursement intégral", "de mon billet."] }
    ],
    nativeModelText: {
      fr: "Madame, Monsieur, je vous écris au sujet de mon TGV Paris–Lyon de vendredi soir, qui a malheureusement été annulé au dernier moment. J'avais une réunion importante à Lyon et je devais absolument m'y rendre ; j'ai donc dû racheter un billet. Par conséquent, je sollicite le remboursement intégral de mon trajet initial. Je vous remercie par avance de votre retour rapide.",
      en: "Madam, Sir, I am writing regarding my Friday evening Paris–Lyon TGV, which was unfortunately cancelled at the last minute. I had an important meeting in Lyon and absolutely had to get there; I therefore had to buy another ticket. Consequently, I request a full refund of my original journey. Thank you in advance for your prompt reply."
    }
  }
];

// ============================================================================
// 2. ROCKSTAR-STYLE "VIE À PARIS" OPEN-WORLD DISTRICT SCENARIOS
// 6 Interactive Parisian Districts with Multi-Step Register Branching
// Registers: "Familier", "Courant", "Soutenu"
// ============================================================================
window.PARIS_LIFE_DISTRICTS = [
  // --------------------------------------------------------------------------
  // DISTRICT 1: METRO & GARE DU NORD (10e)
  // --------------------------------------------------------------------------
  {
    id: "district_gare_du_nord",
    name: "Gare du Nord & Ligne 4",
    arrondissement: "10e Arrondissement",
    cefrRange: "A2–B1",
    vibe: "Rush-hour RATP turnstiles, malfunctioning Navigo passes, and stern ticket inspectors.",
    icon: "🚇",
    accentColor: "#38bdf8",
    targetRegister: "Courant",
    npc: {
      name: "Contrôleur Karim Benali (RATP)",
      role: "Brigade de Contrôle RATP",
      avatar: "👮‍♂️",
      personality: "By-the-book, skeptical of tourist excuses, respects calm and polite 'Courant' French with proper 'vouvoiement'."
    },
    steps: [
      {
        stepIndex: 1,
        situation: "The RATP turnstile flashes red and eats your paper ticket right as three RATP inspectors block the corridor: « Bonjour, contrôle des titres de transport ! Votre passe Navigo ou votre ticket, s'il vous plaît. »",
        npcLineFr: "Bonjour. Contrôle des titres de transport. Présentez votre passe validé, s'il vous plaît.",
        npcLineEn: "Hello. Ticket inspection. Present your validated pass, please.",
        requiredRegister: "Courant",
        choices: [
          {
            register: "Familier",
            fr: "Wesh frère, la machine a bouffé mon ticket, c'est grave abusé vos portiques là !",
            en: "Yo bro, the machine ate my ticket, your turnstiles are seriously rigged!",
            isOptimal: false,
            reputationDelta: -15,
            feedback: "❌ Too Familier! Calling an RATP inspector 'frère' and using 'bouffer' escalates the fine immediately."
          },
          {
            register: "Courant",
            fr: "Bonjour Monsieur. Je viens d'acheter mon billet au guichet, mais le portique l'a avalé sans s'ouvrir.",
            en: "Hello Sir. I just bought my ticket at the counter, but the turnstile swallowed it without opening.",
            isOptimal: true,
            reputationDelta: +25,
            feedback: "✅ Perfect Courant register! Polite 'Bonjour Monsieur', clear explanation, calm tone."
          },
          {
            register: "Soutenu",
            fr: "Monsieur l'Agent, je déplore l'incurie mécanique de cet automate qui a confisqué mon titre de circulation.",
            en: "Officer, I deplore the mechanical negligence of this automaton which confiscated my transit deed.",
            isOptimal: false,
            reputationDelta: +5,
            feedback: "⚠️ Overly Soutenu! You sound like a 19th-century viscount in a metro tunnel, though he appreciates the politeness."
          }
        ]
      },
      {
        stepIndex: 2,
        situation: "Karim frowns slightly and checks his handheld terminal: « Sans ticket validé, c'est une amende forfaitaire de 35 euros. Avez-vous une preuve d'achat ? »",
        npcLineFr: "Sans titre validé, le règlement prévoit une amende de 35 euros. Vous avez un justificatif de paiement ?",
        npcLineEn: "Without a validated ticket, regulations stipulate a 35-euro fine. Do you have proof of payment?",
        requiredRegister: "Courant",
        choices: [
          {
            register: "Courant",
            fr: "Tout à fait, voici mon reçu bancaire de 18h02. Pouvez-vous vérifier le numéro du tourniquet numéro 4 ?",
            en: "Absolutely, here is my bank receipt from 6:02 PM. Could you check turnstile number 4?",
            isOptimal: true,
            reputationDelta: +30,
            feedback: "✅ Spot-on! 'Tout à fait' + factual timestamped receipt convinces the inspector."
          },
          {
            register: "Familier",
            fr: "Laisse tomber les 35 balles, regarde mon appli bancaire, j'ai payé cash il y a deux minutes !",
            en: "Forget the 35 bucks, look at my banking app, I paid two minutes ago!",
            isOptimal: false,
            reputationDelta: -15,
            feedback: "❌ '35 balles' and 'Laisse tomber' (tu) are inappropriate with an official."
          },
          {
            register: "Soutenu",
            fr: "Je vous saurais gré d'examiner ce récépissé fiduciaire attestant ma probité irréprochable.",
            en: "I would be grateful if you examined this fiduciary receipt attesting to my irreproachable probity.",
            isOptimal: false,
            reputationDelta: +10,
            feedback: "⚠️ Grammatically impressive C2, but way too theatrical for Line 4 at rush hour."
          }
        ]
      },
      {
        stepIndex: 3,
        situation: "Karim opens turnstile #4, retrieves your jammed ticket, and stamps you a replacement pass: « C'est bon pour cette fois, le lecteur magnétique était bloqué. Bonne fin de journée. »",
        npcLineFr: "Effectivement, votre ticket était coincé dans le lecteur. Voici une contremarque pour passer. Bonne soirée.",
        npcLineEn: "Indeed, your ticket was stuck in the reader. Here is a replacement pass to get through. Have a good evening.",
        requiredRegister: "Courant",
        choices: [
          {
            register: "Courant",
            fr: "Je vous remercie pour votre compréhension, Monsieur. Bon courage pour la fin de votre service !",
            en: "Thank you for your understanding, Sir. Good luck with the rest of your shift!",
            isOptimal: true,
            reputationDelta: +25,
            feedback: "✅ Native Parisian touch! Wishing a worker 'Bon courage pour votre service' is the gold standard of everyday French civility."
          },
          {
            register: "Familier",
            fr: "Nickel, merci chef, à plus !",
            en: "Sweet, thanks boss, see ya!",
            isOptimal: false,
            reputationDelta: -5,
            feedback: "⚠️ A bit too casual after a formal inspection."
          },
          {
            register: "Soutenu",
            fr: "Agréez, Monsieur le Contrôleur, l'expression de ma gratitude éternelle.",
            en: "Accept, Mister Inspector, the expression of my eternal gratitude.",
            isOptimal: false,
            reputationDelta: +5,
            feedback: "⚠️ Written letter-closing formulas ('Agréez...') are never spoken aloud at a metro gate!"
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // DISTRICT 2: MONTMARTRE BISTROT & STREET BANTER (18e)
  // --------------------------------------------------------------------------
  {
    id: "district_montmartre_bistrot",
    name: "Montmartre & Zinc des Abbesses",
    arrondissement: "18e Arrondissement",
    cefrRange: "B1–B2",
    vibe: "Cobblestone alleys, accordion echoes, clinking espresso cups at the zinc counter, and rapid-fire Parisian argot & verlan.",
    icon: "🍷",
    accentColor: "#f59e0b",
    targetRegister: "Familier",
    npc: {
      name: "Bastien « Le Titi » & Léa",
      role: "Habitués du Comptoir aux Abbesses",
      avatar: "🎨",
      personality: "Witty local artist and musician friends who find stiff textbook formality hilarious and bond instantly over natural 'Familier' banter."
    },
    steps: [
      {
        stepIndex: 1,
        situation: "You squeeze up to the zinc counter at a packed Montmartre bistrot. Your neighbor Bastien grins as the bartender slams down two espressos: « Salut ! C'est blindé ce soir, hein ? Tu cherches une place ou tu prends juste un p'tit noir au comptoir ? »",
        npcLineFr: "Salut ! C'est blindé ce soir, hein ? Tu prends juste un p'tit noir au comptoir ?",
        npcLineEn: "Hey! It's packed tonight, huh? Are you just grabbing a quick espresso at the counter?",
        requiredRegister: "Familier",
        choices: [
          {
            register: "Familier",
            fr: "Grave, c'est noir de monde ! Je prends juste un café serré au zinc, j'ai eu une journée de ouf.",
            en: "Totally, it's packed! I'm just grabbing a strong espresso at the counter, I had a crazy day.",
            isOptimal: true,
            reputationDelta: +30,
            feedback: "✅ Authentic Parisian zinc banter! 'Grave', 'au zinc', and 'une journée de ouf' make you sound like a true local."
          },
          {
            register: "Courant",
            fr: "Bonsoir Monsieur. En effet, il y a beaucoup de clients. Je souhaite simplement boire un café.",
            en: "Good evening Sir. Indeed, there are many customers. I simply wish to drink a coffee.",
            isOptimal: false,
            reputationDelta: +5,
            feedback: "⚠️ Polite, but Bastien used 'tu' and 'Salut'—answering with 'Bonsoir Monsieur' creates a cold distance."
          },
          {
            register: "Soutenu",
            fr: "Il est manifeste que l'affluence en cet établissement excède sa capacité d'accueil habituelle.",
            en: "It is manifest that the attendance in this establishment exceeds its habitual capacity.",
            isOptimal: false,
            reputationDelta: -10,
            feedback: "❌ Bastien bursts out laughing: 'On a trouvé un académicien au comptoir !'"
          }
        ]
      },
      {
        stepIndex: 2,
        situation: "Léa joins with two glasses of natural Côtes-du-Rhône: « Carrément ! Nous on file voir un concert indé à La Cigale après, mais leur batteur nous a posé un lapin. Ça te dit de boire un verre avec nous ? »",
        npcLineFr: "Leur batteur nous a posé un lapin ! Ça te dit de boire un verre avec nous avant le concert ?",
        npcLineEn: "Their drummer stood us up! Feel like grabbing a drink with us before the gig?",
        requiredRegister: "Familier",
        choices: [
          {
            register: "Familier",
            fr: "Avec plaisir ! C'est relou pour votre batteur, mais je vous paye la première tournée !",
            en: "With pleasure! That sucks about your drummer, but the first round is on me!",
            isOptimal: true,
            reputationDelta: +30,
            feedback: "✅ 'C'est relou' (verlan for lourd) + 'payer sa tournée' wins instant friendship in Montmartre."
          },
          {
            register: "Courant",
            fr: "C'est dommage pour le musicien. J'accepte volontiers votre invitation cordiale.",
            en: "That is a pity for the musician. I gladly accept your cordial invitation.",
            isOptimal: false,
            reputationDelta: +5,
            feedback: "⚠️ 'Votre invitation cordiale' sounds like a wedding RSVP."
          },
          {
            register: "Soutenu",
            fr: "Je déplore cette défection impromptue et consens volontiers à partager ces libations.",
            en: "I deplore this impromptu defection and gladly consent to share these libations.",
            isOptimal: false,
            reputationDelta: -10,
            feedback: "❌ 'Partager ces libations' belongs in Molière, not Rue des Martyrs."
          }
        ]
      },
      {
        stepIndex: 3,
        situation: "After a lively hour of music talk, it's time to head down toward Pigalle: « T'es vraiment cool ! On se capte ce week-end aux Abbesses ? »",
        npcLineFr: "Franchement, t'es super sympa ! On se capte ce week-end dans le quartier ?",
        npcLineEn: "Honestly, you're super cool! Shall we catch up this weekend in the neighborhood?",
        requiredRegister: "Familier",
        choices: [
          {
            register: "Familier",
            fr: "Carrément ! File-moi ton 06, je vous envoie un texto samedi sans faute !",
            en: "Definitely! Give me your number, I'll text you guys Saturday for sure!",
            isOptimal: true,
            reputationDelta: +25,
            feedback: "✅ 'Carrément' + 'File-moi ton 06' (mobile number) is 100% authentic modern Parisian spoken French."
          },
          {
            register: "Courant",
            fr: "Oui, donnez-moi votre numéro de téléphone portable afin que je vous contacte.",
            en: "Yes, give me your mobile phone number so that I may contact you.",
            isOptimal: false,
            reputationDelta: +5,
            feedback: "⚠️ Switching back to 'vous' after sharing a round of drinks feels awkward."
          },
          {
            register: "Soutenu",
            fr: "Veuillez me communiquer vos coordonnées téléphoniques afin d'établir une correspondance ultérieure.",
            en: "Please communicate your telephone coordinates so as to establish subsequent correspondence.",
            isOptimal: false,
            reputationDelta: -10,
            feedback: "❌ Way too stiff for new friends in Montmartre!"
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // DISTRICT 3: HAUSSMANN REAL ESTATE & BANK (8e / 16e)
  // --------------------------------------------------------------------------
  {
    id: "district_haussmann_immobilier",
    name: "Avenue Hoche — Immobilier & Banque Privée",
    arrondissement: "8e Arrondissement",
    cefrRange: "B2–C1",
    vibe: "Gilded moldings, herringbone oak parquet, skeptical real-estate directors, and ironclad French lease negotiations.",
    icon: "🏛️",
    accentColor: "#a855f7",
    targetRegister: "Soutenu",
    npc: {
      name: "Madame Solange de Rochefort",
      role: "Directrice d'Agence Immobilière Haussmannienne",
      avatar: "👩‍💼",
      personality: "Aristocratic, razor-sharp, judges tenants by their mastery of formal legal-financial French and impeccable manners."
    },
    steps: [
      {
        stepIndex: 1,
        situation: "Standing beneath the crystal chandelier of a 75m² Haussmannian apartment near Parc Monceau, Madame de Rochefort eyes your folder: « Monsieur le propriétaire est extrêmement sélectif. Quelles garanties financières présentez-vous pour ce bail ? »",
        npcLineFr: "Le propriétaire est extrêmement exigeant. Quelles garanties de solvabilité présentez-vous à l'appui de votre dossier ?",
        npcLineEn: "The owner is extremely demanding. What solvency guarantees do you present in support of your application?",
        requiredRegister: "Soutenu",
        choices: [
          {
            register: "Soutenu",
            fr: "Outre la pérennité de mon contrat cadre, mon dossier est assorti d'une caution bancaire solidaire couvrant trente-six mois de loyer.",
            en: "Beyond the stability of my executive contract, my application is backed by a joint bank guarantee covering thirty-six months of rent.",
            isOptimal: true,
            reputationDelta: +30,
            feedback: "✅ Magistrale! 'Outre la pérennité' + 'assorti d'une caution bancaire solidaire' instantly commands Madame de Rochefort's respect."
          },
          {
            register: "Courant",
            fr: "J'ai un bon travail en CDI et ma banque peut payer si jamais j'ai un problème d'argent.",
            en: "I have a good permanent job and my bank can pay if I ever have a money problem.",
            isOptimal: false,
            reputationDelta: +5,
            feedback: "⚠️ Understandable, but mentioning 'un problème d'argent' makes a Parisian landlord nervous."
          },
          {
            register: "Familier",
            fr: "Vous inquiétez pas, je gagne super bien ma vie, j'ai largement de quoi payer le loyer rubis sur l'ongle !",
            en: "Don't worry, I make a great living, I have plenty to pay the rent on the nail!",
            isOptimal: false,
            reputationDelta: -20,
            feedback: "❌ Dropping 'Ne' ('Vous inquiétez pas') in an 8th-arrondissement agency puts your dossier at the bottom of the pile."
          }
        ]
      },
      {
        stepIndex: 2,
        situation: "She nods approvingly and turns to the state of the apartment: « Vous avez constaté que la peinture du vestibule présente quelques fissures. Souhaitez-vous inscrire une clause particulière avant la signature du bail ? »",
        npcLineFr: "Souhaitez-vous consigner une réserve quant à la réfection du vestibule avant la signature de l'état des lieux ?",
        npcLineEn: "Do you wish to record a reservation regarding the refurbishment of the entrance hall before signing the inventory of fixtures?",
        requiredRegister: "Soutenu",
        choices: [
          {
            register: "Soutenu",
            fr: "Il conviendrait en effet que ces dégradations antérieures soient dûment mentionnées à l'état des lieux d'entrée, afin qu'elles ne puissent m'être imputées.",
            en: "It would indeed be appropriate that these prior damages be duly noted in the move-in inventory, so that they cannot be attributed to me.",
            isOptimal: true,
            reputationDelta: +35,
            feedback: "✅ Elite C1/C2 legal precision! Subjunctive ('soient dûment mentionnées', 'puissent m'être imputées') protects your security deposit."
          },
          {
            register: "Courant",
            fr: "Oui, il faut écrire sur le papier que le mur était déjà abîmé avant mon arrivée.",
            en: "Yes, we need to write on the paper that the wall was already damaged before my arrival.",
            isOptimal: false,
            reputationDelta: +10,
            feedback: "⚠️ Functional B1, but lacks the legal terminology ('état des lieux contradictoire', 'imputer')."
          },
          {
            register: "Familier",
            fr: "Carrément, hors de question qu'on me fasse sauter ma caution pour des fissures qui datent d'avant !",
            en: "Totally, no way you're taking my deposit for cracks from before!",
            isOptimal: false,
            reputationDelta: -15,
            feedback: "❌ 'Faire sauter ma caution' sounds combative and informal."
          }
        ]
      },
      {
        stepIndex: 3,
        situation: "Madame de Rochefort smiles and hands you the fountain pen: « Votre maîtrise de nos usages juridiques est remarquable. Quand seriez-vous en mesure de procéder au virement du dépôt de garantie ? »",
        npcLineFr: "Votre dossier est retenu. À quelle échéance seriez-vous en mesure d'effectuer le virement du dépôt de garantie ?",
        npcLineEn: "Your application is selected. Within what timeframe would you be able to execute the transfer of the security deposit?",
        requiredRegister: "Soutenu",
        choices: [
          {
            register: "Soutenu",
            fr: "L'ordre de virement irrévocable sera exécuté dès réception du bail paraphé, soit dans un délai de vingt-quatre heures.",
            en: "The irrevocable transfer order will be executed upon receipt of the initialed lease, within twenty-four hours.",
            isOptimal: true,
            reputationDelta: +30,
            feedback: "✅ Flawless nominalization and legal vocabulary ('bail paraphé', 'virement irrévocable'). The apartment is yours!"
          },
          {
            register: "Courant",
            fr: "Je peux faire le virement bancaire demain matin dès que vous m'envoyez le contrat signé.",
            en: "I can do the bank transfer tomorrow morning as soon as you send me the signed contract.",
            isOptimal: false,
            reputationDelta: +15,
            feedback: "⚠️ Good Courant French, though less authoritative than the Soutenu option."
          },
          {
            register: "Familier",
            fr: "Je vous balance les sous demain à la première heure, c'est réglé !",
            en: "I'll shoot you the cash first thing tomorrow, all sorted!",
            isOptimal: false,
            reputationDelta: -20,
            feedback: "❌ 'Balancer les sous' at the finish line nearly ruins your Haussmannian dream!"
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // DISTRICT 4: CABINET MÉDICAL & PHARMACIE (6e)
  // --------------------------------------------------------------------------
  {
    id: "district_cabinet_medical",
    name: "Cabinet Médical & Pharmacie de Garde",
    arrondissement: "6e Arrondissement (Odéon)",
    cefrRange: "B1–B2",
    vibe: "Precise symptom description, Carte Vitale & Mutuelle reimbursement rules, and medical etiquette.",
    icon: "⚕️",
    accentColor: "#10b981",
    targetRegister: "Courant",
    npc: {
      name: "Docteur Claire Valéry",
      role: "Médecin Généraliste Conventionnée Secteur 1",
      avatar: "👩‍⚕️",
      personality: "Empathetic, methodical, appreciates clear, accurate 'Courant' symptom descriptions without slang or pompous jargon."
    },
    steps: [
      {
        stepIndex: 1,
        situation: "You enter Dr. Valéry's consultation room near Odéon after three days of fever and bronchial cough: « Bonjour, installez-vous je vous prie. Qu'est-ce qui vous amène aujourd'hui ? »",
        npcLineFr: "Bonjour, prenez place. Décrivez-moi vos symptômes : depuis quand vous sentez-vous souffrant ?",
        npcLineEn: "Hello, take a seat. Describe your symptoms to me: how long have you been feeling unwell?",
        requiredRegister: "Courant",
        choices: [
          {
            register: "Courant",
            fr: "Bonjour Docteur. Depuis trois jours, j'ai une forte fièvre accompagnée de courbatures et d'une toux persistante.",
            en: "Hello Doctor. For three days, I have had a high fever accompanied by body aches and a persistent cough.",
            isOptimal: true,
            reputationDelta: +30,
            feedback: "✅ Clear, accurate medical French ('forte fièvre', 'courbatures', 'toux persistante')."
          },
          {
            register: "Familier",
            fr: "Salut Doc, je suis complètementHS depuis trois jours, je crache mes poumons et j'ai la tête en vrac.",
            en: "Hey Doc, I've been totally wiped out for three days, coughing my lungs out and my head's a mess.",
            isOptimal: false,
            reputationDelta: -10,
            feedback: "❌ In France, doctors are addressed as 'Bonjour Docteur' with 'vous', never 'Salut Doc'."
          },
          {
            register: "Soutenu",
            fr: "Docteur, une pyrexie aiguë doublée de myalgies rédhibitoires m'accable depuis soixante-douze heures.",
            en: "Doctor, an acute pyrexia coupled with prohibitive myalgias has afflicted me for seventy-two hours.",
            isOptimal: false,
            reputationDelta: +10,
            feedback: "⚠️ Dr. Valéry smiles: 'Vous avez lu le dictionnaire médical Vidal dans la salle d'attente ?'"
          }
        ]
      },
      {
        stepIndex: 2,
        situation: "After examining your lungs with her stethoscope, she prepares a prescription (ordonnance): « Ce n'est qu'une bronchite virale, mais vous avez besoin de repos. Avez-vous des allergies médicamenteuses et avez-vous besoin d'un arrêt de travail ? »",
        npcLineFr: "Il s'agit d'une bronchite virale. Êtes-vous allergique à certains médicaments, et vous faut-il un arrêt de travail ?",
        npcLineEn: "It is a viral bronchitis. Are you allergic to any medications, and do you need a sick-leave certificate?",
        requiredRegister: "Courant",
        choices: [
          {
            register: "Courant",
            fr: "Je suis allergique à la pénicilline. Par ailleurs, pourriez-vous me prescrire un arrêt de travail de quarante-huit heures pour mon employeur ?",
            en: "I am allergic to penicillin. Furthermore, could you prescribe me a 48-hour sick-leave certificate for my employer?",
            isOptimal: true,
            reputationDelta: +30,
            feedback: "✅ Exact terminology ('allergique à la pénicilline', 'arrêt de travail') + polite conditional ('pourriez-vous')."
          },
          {
            register: "Familier",
            fr: "Pas de pénicilline sinon je gonfle ! Et ouais, filez-moi deux jours de congé maladie pour mon boss.",
            en: "No penicillin or I swell up! And yeah, hand me two days of sick leave for my boss.",
            isOptimal: false,
            reputationDelta: -15,
            feedback: "❌ 'Filez-moi' is rude when asking a physician for an official CPAM certificate."
          },
          {
            register: "Soutenu",
            fr: "Mon organisme manifeste une intolérance aux bêta-lactamines ; daignez en outre m'octroyer une dispense professionnelle.",
            en: "My organism manifests an intolerance to beta-lactams; deign moreover to grant me a professional dispensation.",
            isOptimal: false,
            reputationDelta: +5,
            feedback: "⚠️ 'Dispense professionnelle' is not the official French term—it's 'un avis d'arrêt de travail'."
          }
        ]
      },
      {
        stepIndex: 3,
        situation: "She prints the prescription and asks for your Carte Vitale: « Voici votre ordonnance et le volet pour votre employeur. Avez-vous votre Carte Vitale à jour pour la télétransmission ? »",
        npcLineFr: "Voici l'ordonnance. Avez-vous votre Carte Vitale ou faut-il établir une feuille de soins papier ?",
        npcLineEn: "Here is the prescription. Do you have your Carte Vitale or should I issue a paper care sheet?",
        requiredRegister: "Courant",
        choices: [
          {
            register: "Courant",
            fr: "Voici ma Carte Vitale ainsi que mon attestation de mutuelle. Merci infiniment pour votre écoute, Docteur.",
            en: "Here is my Carte Vitale as well as my supplemental insurance certificate. Thank you very much for listening, Doctor.",
            isOptimal: true,
            reputationDelta: +25,
            feedback: "✅ Complete mastery of the French healthcare workflow (Carte Vitale + Mutuelle)."
          },
          {
            register: "Familier",
            fr: "Tenez la carte verte, c'est remboursé direct par la Sécu, non ?",
            en: "Here's the green card, it's refunded straight by Social Security, right?",
            isOptimal: false,
            reputationDelta: -5,
            feedback: "⚠️ A bit abrupt at the end of a medical consultation."
          },
          {
            register: "Soutenu",
            fr: "Je vous remets ce support magnétique d'assurance maladie et vous prie d'agréer ma considération distinguée.",
            en: "I hand you this magnetic health insurance medium and beg you to accept my distinguished consideration.",
            isOptimal: false,
            reputationDelta: +5,
            feedback: "⚠️ Nobody calls a Carte Vitale 'un support magnétique d'assurance maladie'!"
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // DISTRICT 5: LA DÉFENSE EXECUTIVE SKYSCRAPER (92 / Grand Paris)
  // --------------------------------------------------------------------------
  {
    id: "district_la_defense_comex",
    name: "La Défense — Sommet Exécutif Tour Majunga",
    arrondissement: "Quartier d'Affaires (Puteaux / Courbevoie)",
    cefrRange: "C1–C2",
    vibe: "38th-floor glass boardroom overlooking the Arc de Triomphe, high-stakes M&A diplomacy, and C1/C2 strategic French.",
    icon: "🏙️",
    accentColor: "#6366f1",
    targetRegister: "Soutenu",
    npc: {
      name: "Philippe Castex-Valmont",
      role: "Président-Directeur Général (PDG)",
      avatar: "🕴️",
      personality: "Enarque and former inspection des finances; expects razor-sharp C1/C2 synthesis, subjunctive precision, and zero anglicisms."
    },
    steps: [
      {
        stepIndex: 1,
        situation: "In the 38th-floor boardroom of Tour Majunga, the CEO interrupts a heated debate on acquiring a German clean-tech rival: « Les avis divergent au sein du Conseil. Quelle est votre analyse sur la viabilité financière de cette opération ? »",
        npcLineFr: "Les avis divergent au sein du Comité Exécutif. Quelle est votre lecture stratégique de cette acquisition ?",
        npcLineEn: "Opinions diverge within the Executive Committee. What is your strategic reading of this acquisition?",
        requiredRegister: "Soutenu",
        choices: [
          {
            register: "Soutenu",
            fr: "Quoique le coût d'acquisition paraisse élevé à court terme, les synergies industrielles dégagées consolideront durablement notre souveraineté technologique.",
            en: "Although the acquisition cost appears high in the short term, the resulting industrial synergies will durably consolidate our technological sovereignty.",
            isOptimal: true,
            reputationDelta: +35,
            feedback: "✅ Pure C2 COMEX authority! 'Quoique + subjunctive' + 'synergies industrielles dégagées'."
          },
          {
            register: "Courant",
            fr: "Même si l'entreprise coûte cher aujourd'hui, je pense que c'est un bon investissement pour notre futur.",
            en: "Even if the company is expensive today, I think it is a good investment for our future.",
            isOptimal: false,
            reputationDelta: +10,
            feedback: "⚠️ Accurate B1/B2, but lacks the executive gravitas expected by a French PDG."
          },
          {
            register: "Familier",
            fr: "Franchement, faut foncer ! C'est un deal en or, on va écraser la concurrence !",
            en: "Honestly, we gotta go for it! It's a golden deal, we're gonna crush the competition!",
            isOptimal: false,
            reputationDelta: -25,
            feedback: "❌ Anglicism ('deal') + 'faut foncer' triggers an icy stare from the Énarque CEO."
          }
        ]
      },
      {
        stepIndex: 2,
        situation: "The CFO raises an eyebrow: « Et qu'en est-il du risque social et réglementaire lors de la fusion des équipes ? »",
        npcLineFr: "Comment entendez-vous prévenir tout blocage syndical ou réglementaire lors de l'intégration ?",
        npcLineEn: "How do you intend to prevent any union or regulatory deadlock during integration?",
        requiredRegister: "Soutenu",
        choices: [
          {
            register: "Soutenu",
            fr: "Il importe que nous engagions un dialogue social exemplaire en amont, afin qu'aucune restructuration ne compromette la cohésion des équipes.",
            en: "It is imperative that we initiate exemplary social dialogue upstream, so that no restructuring compromises team cohesion.",
            isOptimal: true,
            reputationDelta: +35,
            feedback: "✅ Double subjunctive ('engagions', 'ne compromette') + 'en amont' wins over the entire board."
          },
          {
            register: "Courant",
            fr: "Nous devons discuter avec les syndicats avant la fusion pour éviter une grève des employés.",
            en: "We must talk with the unions before the merger to avoid an employee strike.",
            isOptimal: false,
            reputationDelta: +10,
            feedback: "⚠️ Clear, but 'discuter pour éviter une grève' sounds reactive rather than strategic."
          },
          {
            register: "Familier",
            fr: "On va gérer les syndicats au calme, tant qu'on touche pas aux salaires ça passera crème !",
            en: "We'll handle the unions chill, as long as we don't touch salaries it'll go down smooth!",
            isOptimal: false,
            reputationDelta: -25,
            feedback: "❌ 'Ça passera crème' in a La Défense boardroom is career suicide!"
          }
        ]
      },
      {
        stepIndex: 3,
        situation: "Philippe Castex-Valmont closes his leather portfolio: « Parfait. Êtes-vous prêt à piloter personnellement cette task-force franco-allemande dès lundi ? »",
        npcLineFr: "Êtes-vous disposé à prendre la direction opérationnelle de ce comité d'intégration dès lundi ?",
        npcLineEn: "Are you prepared to take operational leadership of this integration committee starting Monday?",
        requiredRegister: "Soutenu",
        choices: [
          {
            register: "Soutenu",
            fr: "C'est avec un sens aigu de mes responsabilités que j'accepte ce mandat ; je vous soumettrai ma feuille de route dès lundi matin.",
            en: "It is with an acute sense of my responsibilities that I accept this mandate; I shall submit my roadmap to you first thing Monday morning.",
            isOptimal: true,
            reputationDelta: +35,
            feedback: "✅ Cleft structure ('C'est avec... que') + 'feuille de route' seals your promotion to Executive Director."
          },
          {
            register: "Courant",
            fr: "Oui, j'accepte cette mission avec plaisir et je préparerai un plan de travail pour lundi.",
            en: "Yes, I accept this mission with pleasure and I will prepare a work plan for Monday.",
            isOptimal: false,
            reputationDelta: +15,
            feedback: "⚠️ Solid Courant response, though 'accepter ce mandat' + 'feuille de route' is the true C1/C2 executive idiom."
          },
          {
            register: "Familier",
            fr: "Carrément chaud ! Vous pouvez compter sur moi, je gère ça dès lundi !",
            en: "Totally down! You can count on me, I'm on it Monday!",
            isOptimal: false,
            reputationDelta: -20,
            feedback: "❌ 'Carrément chaud' means enthusiastic in street slang, never in a boardroom."
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // DISTRICT 6: LA SORBONNE & PANTHÉON C2 JURY (5e)
  // --------------------------------------------------------------------------
  {
    id: "district_sorbonne_jury_c2",
    name: "La Sorbonne & Panthéon — Grand Jury DALF C2",
    arrondissement: "5e Arrondissement (Quartier Latin)",
    cefrRange: "C2 Maîtrise",
    vibe: "Centuries-old oak paneling in the Salle des Actes, philosophical cross-examination, and the supreme test of native-level French rhetoric.",
    icon: "🎓",
    accentColor: "#eab308",
    targetRegister: "Soutenu",
    npc: {
      name: "Professeure Hélène Cassin-Vauclair",
      role: "Présidente du Jury DALF C2 — Université Paris-Sorbonne",
      avatar: "🦉",
      personality: "Chair of Rhetoric & Epistemology; demands dialectical nuance, literary syntax, negative 'ne saurait', and effortless C2 precision."
    },
    steps: [
      {
        stepIndex: 1,
        situation: "Beneath the frescoes of the Sorbonne, Professeure Cassin-Vauclair leans forward after your monologue: « Vous affirmez que le progrès technique émancipe l'individu. Ne craignez-vous pas, à l'inverse, qu'il n'engendre une nouvelle servitude volontaire ? »",
        npcLineFr: "Ne redoutez-vous pas que l'hyper-connexion, loin d'émanciper le citoyen, n'instaure une servitude volontaire inédite ?",
        npcLineEn: "Do you not fear that hyper-connectivity, far from emancipating the citizen, establishes an unprecedented voluntary servitude?",
        requiredRegister: "Soutenu",
        choices: [
          {
            register: "Soutenu",
            fr: "Votre objection touche au cœur du paradoxe : en aucun cas l'outil technique ne saurait être neutre, à moins que l'esprit critique n'en régule l'usage.",
            en: "Your objection touches the heart of the paradox: under no circumstances could the technical tool be neutral, unless critical spirit regulates its use.",
            isOptimal: true,
            reputationDelta: +40,
            feedback: "✅ Supreme DALF C2 mastery! 'En aucun cas... ne saurait' + 'à moins que... ne + subjunctive' (ne explétif)."
          },
          {
            register: "Courant",
            fr: "C'est une bonne question. Il est vrai que la technologie peut nous rendre dépendants si nous ne faisons pas attention.",
            en: "That is a good question. It is true that technology can make us dependent if we are not careful.",
            isOptimal: false,
            reputationDelta: +10,
            feedback: "⚠️ B1/B2 level. At the Sorbonne C2 Jury, 'C'est une bonne question' is far too pedestrian."
          },
          {
            register: "Familier",
            fr: "C'est clair qu'on est tous accros à nos écrans, mais bon, on peut pas revenir à l'âge de pierre non plus !",
            en: "Sure we're all hooked on our screens, but hey, we can't go back to the Stone Age either!",
            isOptimal: false,
            reputationDelta: -30,
            feedback: "❌ Colloquialisms ('accros', 'mais bon') fail the DALF C2 oral defense criteria."
          }
        ]
      },
      {
        stepIndex: 2,
        situation: "She nods with visible admiration and presses deeper: « Fort bien. Mais selon quels critères éthiques la puissance publique devrait-elle arbitrer entre liberté d'innovation et principe de précaution ? »",
        npcLineFr: "Selon quelle boussole éthique le législateur doit-il concilier audace scientifique et principe de précaution ?",
        npcLineEn: "According to what ethical compass must the legislator reconcile scientific audacity and the precautionary principle?",
        requiredRegister: "Soutenu",
        choices: [
          {
            register: "Soutenu",
            fr: "Loin d'être antinomiques, ces deux impératifs s'articulent autour de la dignité humaine, pour peu que la délibération démocratique précède le fait accompli.",
            en: "Far from being antithetical, these two imperatives interlock around human dignity, provided that democratic deliberation precedes the fait accompli.",
            isOptimal: true,
            reputationDelta: +40,
            feedback: "✅ Dazzling C2 philosophical diction: 'Loin d'être antinomiques' + 'pour peu que + subjunctive'."
          },
          {
            register: "Courant",
            fr: "L'État doit consulter les scientifiques et les citoyens avant d'autoriser des innovations qui peuvent être dangereuses.",
            en: "The State must consult scientists and citizens before authorizing innovations that may be dangerous.",
            isOptimal: false,
            reputationDelta: +10,
            feedback: "⚠️ Sensible B2 argument, but lacks the dialectical elevation of C2."
          },
          {
            register: "Familier",
            fr: "Faut juste mettre des garde-fous pour éviter que les labos fassent n'importe quoi en douce !",
            en: "We just gotta put up guardrails so labs don't do whatever on the sly!",
            isOptimal: false,
            reputationDelta: -30,
            feedback: "❌ 'Faire n'importe quoi en douce' is Familier register."
          }
        ]
      },
      {
        stepIndex: 3,
        situation: "The three examiners exchange a look of unanimous approval. Professeure Cassin-Vauclair rises: « Je vous remercie. En une formule finale, comment définiriez-vous la maîtrise d'une langue seconde ? »",
        npcLineFr: "Pour conclure cet entretien, comment définiriez-vous l'aboutissement véritable de la maîtrise d'une langue ?",
        npcLineEn: "To conclude this interview, how would you define the true culmination of mastering a language?",
        requiredRegister: "Soutenu",
        choices: [
          {
            register: "Soutenu",
            fr: "Habiter pleinement une langue, c'est épouser l'intégralité de ses registres afin que la pensée y déploie toutes ses nuances sans jamais trahir son intention.",
            en: "To fully inhabit a language is to embrace the entirety of its registers so that thought may deploy all its nuances without ever betraying its intent.",
            isOptimal: true,
            reputationDelta: +50,
            feedback: "🏆 FÉLICITATIONS DU JURY! You have conquered the Sorbonne DALF C2 Oral Defense with native-level distinction!"
          },
          {
            register: "Courant",
            fr: "Maîtriser une langue, c'est pouvoir comprendre tout le monde et s'exprimer facilement dans toutes les situations.",
            en: "Mastering a language means being able to understand everyone and express oneself easily in all situations.",
            isOptimal: false,
            reputationDelta: +15,
            feedback: "⚠️ Honest B2 definition, but the C2 option captures the literary soul of the French language."
          },
          {
            register: "Familier",
            fr: "C'est quand tu captes toutes les vannes au bistrot aussi bien que les discours à la télé !",
            en: "It's when you get all the jokes at the bistro just as well as speeches on TV!",
            isOptimal: false,
            reputationDelta: -10,
            feedback: "⚠️ Witty truth, but keep the Soutenu register until the Jury officially closes the session!"
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // DISTRICT 7: LE MARAIS & PLACE DES VOSGES (3e & 4e)
  // --------------------------------------------------------------------------
  {
    id: "district_marais_galerie",
    name: "Le Marais & Place des Vosges",
    arrondissement: "3e & 4e Arrondissements",
    cefrRange: "A2–B1",
    vibe: "Sunlit red-brick arcades, contemporary art vernissages, and refined gallery negotiations.",
    icon: "🎨",
    accentColor: "#f472b6",
    targetRegister: "Courant",
    npc: {
      name: "Céleste Vance (Galeriste)",
      role: "Directrice de la Galerie des Arcades",
      avatar: "👩‍🎨",
      personality: "Passionate about contemporary art, appreciates articulate 'Courant' curiosity without pompous pretension or rude familiarity."
    },
    steps: [
      {
        stepIndex: 1,
        situation: "Under the vaulted stone arcades of Place des Vosges, Céleste welcomes you to a private vernissage: « Bonsoir et bienvenue ! Ce triptyque vient d'arriver de l'atelier de Lyon. Qu'est-ce qui attire votre regard dans cette toile ? »",
        npcLineFr: "Bonsoir ! Ce triptyque vient tout juste d'être installé. Qu'est-ce qui vous touche particulièrement dans cette œuvre ?",
        npcLineEn: "Good evening! This triptych was just installed. What touches you particularly in this work?",
        requiredRegister: "Courant",
        choices: [
          {
            register: "Courant",
            fr: "Bonsoir Madame. J'aime beaucoup le contraste des couleurs chaudes et le jeu d'ombres sous les arcades.",
            en: "Good evening Madam. I really like the contrast of warm colors and the play of shadows under the arcades.",
            isOptimal: true,
            reputationDelta: +25,
            feedback: "✅ Excellent Courant register! Warm, observant, and natural for a Parisian gallery opening."
          },
          {
            register: "Familier",
            fr: "Franchement ça claque de ouf, le peintre a géré les couleurs, c'est grave stylé !",
            en: "Honestly it slaps like crazy, the painter nailed the colors, it's super stylish!",
            isOptimal: false,
            reputationDelta: -10,
            feedback: "❌ 'Ça claque de ouf' is lively street slang, but out of place when addressing a gallery director for the first time."
          },
          {
            register: "Soutenu",
            fr: "Cette polychromie transcende l'indicible contingence du réel par une fulgurance quasi métaphysique.",
            en: "This polychromy transcends the unspeakable contingency of reality through a quasi-metaphysical radiance.",
            isOptimal: false,
            reputationDelta: +10,
            feedback: "⚠️ Impressive vocabulary, though Céleste smiles at the overly theatrical art-critic monologue."
          }
        ]
      },
      {
        stepIndex: 2,
        situation: "You notice a smaller framed study beside the main canvas and want to ask about its price and whether the artist signed it: « C'est une étude préparatoire sur papier Arches. Vous souhaitez connaître ses conditions d'acquisition ? »",
        npcLineFr: "Il s'agit d'une étude préparatoire numérotée. Souhaitez-vous que je vous précise son prix et son certificat ?",
        npcLineEn: "This is a numbered preparatory study. Would you like me to specify its price and certificate?",
        requiredRegister: "Courant",
        choices: [
          {
            register: "Courant",
            fr: "Oui, volontiers. Pourriez-vous m'indiquer son tarif et me confirmer si l'œuvre est accompagnée d'un certificat d'authenticité ?",
            en: "Yes, gladly. Could you tell me its price and confirm whether the work comes with a certificate of authenticity?",
            isOptimal: true,
            reputationDelta: +30,
            feedback: "✅ Spot-on! 'Oui, volontiers' + conditional 'Pourriez-vous' is the gold standard of polite commercial inquiry."
          },
          {
            register: "Familier",
            fr: "Carrément, tu me la fais à combien si je paie direct ?",
            en: "Totally, how much will you give it to me for if I pay right now?",
            isOptimal: false,
            reputationDelta: -15,
            feedback: "❌ Switching to 'tu' and bargaining like a flea market hurts your credibility in a Place des Vosges gallery."
          },
          {
            register: "Soutenu",
            fr: "Daignez me révéler la quotité pécuniaire requise pour l'aliénation de cette esquisse.",
            en: "Deign to reveal to me the pecuniary amount required for the alienation of this sketch.",
            isOptimal: false,
            reputationDelta: +5,
            feedback: "⚠️ Archaic legal terminology ('quotité pécuniaire', 'aliénation') sounds unnatural in conversation."
          }
        ]
      },
      {
        stepIndex: 3,
        situation: "Céleste offers to reserve the piece until Saturday so you can see it in daylight: « Je peux poser une option gratuite jusqu'à samedi midi, le temps que vous la revoyiez à la lumière du jour. »",
        npcLineFr: "Je vous propose de bloquer l'œuvre jusqu'à samedi midi, sans engagement de votre part.",
        npcLineEn: "I suggest holding the artwork until Saturday noon, with no obligation on your part.",
        requiredRegister: "Courant",
        choices: [
          {
            register: "Courant",
            fr: "C'est parfait, je vous remercie. Je repasserai samedi matin dès l'ouverture pour confirmer mon choix.",
            en: "That's perfect, thank you. I will stop by again Saturday morning right at opening to confirm my choice.",
            isOptimal: true,
            reputationDelta: +30,
            feedback: "✅ Effortless Parisian poise! Clear commitment and courteous 'je vous remercie'."
          },
          {
            register: "Familier",
            fr: "Top, garde-la sous le coude, je te tiens au jus samedi !",
            en: "Great, keep it under your elbow, I'll keep you posted Saturday!",
            isOptimal: false,
            reputationDelta: -5,
            feedback: "⚠️ 'Je te tiens au jus' is great with friends, but keep 'vous' and 'je vous tiendrai au courant' with a professional."
          },
          {
            register: "Soutenu",
            fr: "Votre mansuétude m'honore ; je ne manquerai point de comparaître en ces lieux dès l'aube sabbatique.",
            en: "Your clemency honors me; I shall not fail to appear in these premises at the Sabbath dawn.",
            isOptimal: false,
            reputationDelta: +5,
            feedback: "⚠️ 'Comparaître' is for court summonses, not art galleries!"
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // DISTRICT 8: CANAL SAINT-MARTIN & QUAI DE VALMY (10e)
  // --------------------------------------------------------------------------
  {
    id: "district_canal_saint_martin",
    name: "Canal Saint-Martin & Quai de Valmy",
    arrondissement: "10e Arrondissement",
    cefrRange: "B1–B2",
    vibe: "Iron footbridges at sunset, acoustic guitars on the waterside, and fast-paced Parisian friend-group banter.",
    icon: "🌉",
    accentColor: "#34d399",
    targetRegister: "Familier",
    npc: {
      name: "Yanis & sa Bande du Quai",
      role: "Musiciens & Habitués du Canal",
      avatar: "🎸",
      personality: "Warm, spontaneous, speaks authentic everyday Parisian 'Familier' (without aggression); stiff bureaucracy makes them laugh."
    },
    steps: [
      {
        stepIndex: 1,
        situation: "By the iron footbridge of Grange-aux-Belles, your neighbor Yanis waves you over to their waterside picnic: « Hé ! Viens t'asseoir avec nous, on vient d'ouvrir une bouteille de cidre et il reste des parts de quiche ! »",
        npcLineFr: "Hé ! Pose-toi avec nous au bord de l'eau, on partage une quiche tout juste sortie du four !",
        npcLineEn: "Hey! Sit down with us by the water, we're sharing a quiche fresh out of the oven!",
        requiredRegister: "Familier",
        choices: [
          {
            register: "Familier",
            fr: "Grave avec plaisir ! J'avoue que j'ai une petite faim, je vais chercher des gobelets à l'épicerie d'à côté.",
            en: "Totally with pleasure! I admit I'm a bit hungry, I'll go grab some cups at the corner grocery.",
            isOptimal: true,
            reputationDelta: +30,
            feedback: "✅ Authentic Parisian camaraderie! 'Avec plaisir', 'j'avoue', and offering to grab cups hits the exact social note."
          },
          {
            register: "Soutenu",
            fr: "Je vous sais gré de cette convocation riveraine et accepte volontiers une portion de cette tourte salée.",
            en: "I am grateful to you for this waterside summons and gladly accept a portion of this savory pie.",
            isOptimal: false,
            reputationDelta: -10,
            feedback: "❌ Calling a Canal Saint-Martin picnic a 'convocation riveraine' makes the whole group burst out laughing!"
          },
          {
            register: "Courant",
            fr: "Je vous remercie infiniment pour votre invitation, mais je ne voudrais surtout pas vous déranger.",
            en: "Thank you very much for your invitation, but I really wouldn't want to bother you.",
            isOptimal: false,
            reputationDelta: +10,
            feedback: "⚠️ Polite, but using 'vous' with young neighbors who just said 'Pose-toi' creates an awkward distance."
          }
        ]
      },
      {
        stepIndex: 2,
        situation: "Suddenly a light summer shower starts drizzling over the lock: « Aïe, il commence à flotter ! On se replie sous le préau du café ou on attend que ça passe ? »",
        npcLineFr: "Mince, il commence à flotter ! On bouge sous l'auvent du bistrot d'en face ?",
        npcLineEn: "Darn, it's starting to rain! Shall we move under the awning of the bistro across the street?",
        requiredRegister: "Familier",
        choices: [
          {
            register: "Familier",
            fr: "Carrément, filons sous l'auvent avant d'être trempés, ce n'est qu'une averse de cinq minutes !",
            en: "Definitely, let's dash under the awning before getting soaked, it's just a five-minute shower!",
            isOptimal: true,
            reputationDelta: +30,
            feedback: "✅ Native flow! Understanding 'flotter' (to rain) and replying with 'filons avant d'être trempés' is effortless B2 spoken French."
          },
          {
            register: "Courant",
            fr: "Effectivement, les précipitations s'intensifient ; il serait préférable de nous abriter sous cet établissement.",
            en: "Indeed, precipitation is intensifying; it would be preferable to shelter under this establishment.",
            isOptimal: false,
            reputationDelta: +10,
            feedback: "⚠️ You sound like a Météo-France weather bulletin!"
          },
          {
            register: "Soutenu",
            fr: "Fuyons sans délai l'inclémence des cieux sous ce portique providentiel !",
            en: "Let us flee without delay the inclemency of the skies beneath this providential portico!",
            isOptimal: false,
            reputationDelta: -5,
            feedback: "⚠️ Pure Molière, hilarious in the rain, but not natural spoken register."
          }
        ]
      },
      {
        stepIndex: 3,
        situation: "The rain stops, the streetlights reflect on the canal, and Yanis invites you to their concert next Friday at La Bellevilloise: « On joue vendredi prochain à Ménilmontant, tu passeras nous voir ? »",
        npcLineFr: "On monte sur scène vendredi soir à Ménilmontant, tu seras dans le coin ?",
        npcLineEn: "We're going on stage Friday night in Ménilmontant, will you be around?",
        requiredRegister: "Familier",
        choices: [
          {
            register: "Familier",
            fr: "Compte sur moi, je ne raterais ça pour rien au monde ! Envoie-moi l'heure par message.",
            en: "Count on me, I wouldn't miss that for anything in the world! Text me the time.",
            isOptimal: true,
            reputationDelta: +30,
            feedback: "✅ Warm and idiomatic! 'Compte sur moi' and 'je ne raterais ça pour rien au monde' seal a real Parisian friendship."
          },
          {
            register: "Courant",
            fr: "Je vérifierai mon emploi du temps professionnel et vous confirmerai ma présence par courriel.",
            en: "I will check my professional schedule and confirm my attendance by email.",
            isOptimal: false,
            reputationDelta: -10,
            feedback: "❌ Sending an email ('courriel') to confirm a friend's indie concert is way too corporate."
          },
          {
            register: "Soutenu",
            fr: "Je m'honorerai d'assister à votre récital vespéral en cette salle illustre.",
            en: "I shall be honored to attend your evening recital in that illustrious hall.",
            isOptimal: false,
            reputationDelta: +5,
            feedback: "⚠️ 'Récital vespéral' is C2 gold for the Opera, not for an indie gig in Ménilmontant!"
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // DISTRICT 9: PALAIS DE JUSTICE & ÎLE DE LA CITÉ (1er)
  // --------------------------------------------------------------------------
  {
    id: "district_palais_justice",
    name: "Palais de Justice & Île de la Cité",
    arrondissement: "1er Arrondissement",
    cefrRange: "C1–C2",
    vibe: "Gilded courtroom columns, formal civil-liberty mediation, and razor-sharp legal eloquence.",
    icon: "⚖️",
    accentColor: "#60a5fa",
    targetRegister: "Soutenu",
    npc: {
      name: "Bâtonnière Claire de Montmirail",
      role: "Présidente de la Commission de Médiation · Cour d'Appel",
      avatar: "👩‍⚖️",
      personality: "Demands rigorous 'Soutenu' syntax, precise causal and concessive connectors, and zero colloquial approximation."
    },
    steps: [
      {
        stepIndex: 1,
        situation: "Inside the gilded Galerie Marchande of the Palais de Justice, Bâtonnière de Montmirail opens the mediation hearing on algorithmic transparency: « La parole est à la défense. Comment conciliez-vous le secret industriel avec le droit des citoyens à l'explicabilité ? »",
        npcLineFr: "Vous avez la parole. En quoi l'opacité d'un algorithme portant sur des droits sociaux vous paraît-elle contestable ?",
        npcLineEn: "You have the floor. In what way does the opacity of an algorithm affecting social rights appear questionable to you?",
        requiredRegister: "Soutenu",
        choices: [
          {
            register: "Soutenu",
            fr: "Madame la Bâtonnière, bien que la protection du savoir-faire technique soit légitime, elle ne saurait prévaloir sur le droit fondamental de chaque administré à comprendre les motifs d'une décision qui l'affecte.",
            en: "Madam President of the Bar, although the protection of technical know-how is legitimate, it cannot prevail over every citizen's fundamental right to understand the grounds of a decision affecting them.",
            isOptimal: true,
            reputationDelta: +45,
            feedback: "✅ Magistrale plaidoirie C1/C2 ! 'Bien que + subjonctif' + 'ne saurait prévaloir sur' is authentic Cour d'Appel eloquence."
          },
          {
            register: "Courant",
            fr: "Je pense que les entreprises ont le droit de garder leurs secrets, mais les citoyens doivent quand même savoir pourquoi un ordinateur refuse leur dossier.",
            en: "I think companies have the right to keep their secrets, but citizens still need to know why a computer rejects their file.",
            isOptimal: false,
            reputationDelta: +15,
            feedback: "⚠️ Clear B1/B2 argument, but 'Je pense que' and 'quand même' lack the juridical gravity expected at the Palais de Justice."
          },
          {
            register: "Familier",
            fr: "C'est clair qu'on ne peut pas laisser une boîte noire décider toute seule sans jamais rendre de comptes à personne !",
            en: "Clearly we can't let a black box decide all by itself without ever answering to anyone!",
            isOptimal: false,
            reputationDelta: -20,
            feedback: "❌ Spoken indignation without formal structure will be dismissed immediately in chambers."
          }
        ]
      },
      {
        stepIndex: 2,
        situation: "Opposing counsel claims that publishing the criteria would paralyze public administration: « La partie adverse soutient qu'une transparence intégrale ralentirait le traitement des dossiers. Que lui répondez-vous ? »",
        npcLineFr: "La partie adverse affirme que cette exigence ralentirait l'action administrative. Quelle est votre réplique ?",
        npcLineEn: "The opposing party claims that this requirement would slow down administrative action. What is your rebuttal?",
        requiredRegister: "Soutenu",
        choices: [
          {
            register: "Soutenu",
            fr: "Force est toutefois de constater que la célérité administrative, si souhaitable soit-elle, perd toute légitimité dès lors qu'elle s'affranchit du principe contradictoire.",
            en: "One must however note that administrative speed, desirable though it may be, loses all legitimacy as soon as it exempts itself from the adversarial principle.",
            isOptimal: true,
            reputationDelta: +45,
            feedback: "✅ Coup de maître ! 'Force est toutefois de constater', 'si souhaitable soit-elle' (inverted concessive subjunctive), and 'dès lors que' command the courtroom."
          },
          {
            register: "Courant",
            fr: "Aller vite est important pour l'administration, mais cela ne doit pas empêcher les citoyens de se défendre en cas d'erreur.",
            en: "Going fast is important for the administration, but that must not prevent citizens from defending themselves in case of error.",
            isOptimal: false,
            reputationDelta: +15,
            feedback: "⚠️ Sensible Courant point, but misses the C1/C2 legal collocations ('célérité', 'principe contradictoire')."
          },
          {
            register: "Familier",
            fr: "Aller vite en faisant n'importe quoi, ça crée juste encore plus de galères derrière !",
            en: "Going fast while doing whatever just creates even more trouble afterward!",
            isOptimal: false,
            reputationDelta: -25,
            feedback: "❌ 'Faire n'importe quoi' and 'galères' are completely unacceptable before the Bâtonnière."
          }
        ]
      },
      {
        stepIndex: 3,
        situation: "Bâtonnière de Montmirail nods approvingly and asks for your concluding compromise proposal: « Quelle mesure concrète préconisez-vous pour clore cette médiation ? »",
        npcLineFr: "En définitive, quel dispositif transactionnel soumettez-vous à l'appréciation de la commission ?",
        npcLineEn: "Ultimately, what settlement mechanism do you submit to the commission's assessment?",
        requiredRegister: "Soutenu",
        choices: [
          {
            register: "Soutenu",
            fr: "Nous préconisons l'instauration d'un audit indépendant assorti d'une notice explicative systématique, afin qu'aucune décision automatisée ne demeure soustraite au contrôle du juge.",
            en: "We advocate establishing an independent audit accompanied by a systematic explanatory notice, so that no automated decision remains exempt from judicial review.",
            isOptimal: true,
            reputationDelta: +50,
            feedback: "🏆 PLAIDOIRIE SOUVERAINE ! 'Assorti de', 'afin qu'aucune... ne demeure' (+ subjunctive) achieves pure C2 legal mastery."
          },
          {
            register: "Courant",
            fr: "Nous proposons de créer un contrôle indépendant et d'envoyer une explication écrite à chaque citoyen concerné.",
            en: "We propose creating an independent check and sending a written explanation to each citizen concerned.",
            isOptimal: false,
            reputationDelta: +20,
            feedback: "⚠️ Accurate summary, though the Soutenu formulation carries far greater institutional weight."
          },
          {
            register: "Familier",
            fr: "Il suffit d'obliger l'organisme à tout vérifier par un expert et à envoyer un récap clair aux gens.",
            en: "We just have to force the agency to have an expert check everything and send a clear recap to people.",
            isOptimal: false,
            reputationDelta: -15,
            feedback: "❌ 'Un récap clair aux gens' breaks the solemnity of the closing protocol."
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // DISTRICT 10: ACADÉMIE FRANÇAISE — SOUS LA COUPOLE (6e)
  // --------------------------------------------------------------------------
  {
    id: "district_academie_coupole",
    name: "Académie Française — Sous la Coupole",
    arrondissement: "6e Arrondissement (Quai de Conti)",
    cefrRange: "C2 · Natif",
    vibe: "The golden dome of the Institut de France, green-embroidered Immortels, and the pinnacle of literary French.",
    icon: "👑",
    accentColor: "#fbbf24",
    targetRegister: "Soutenu",
    npc: {
      name: "Secrétaire Perpétuel Henri de Valcourt",
      role: "Académie Française · Quai de Conti",
      avatar: "👑",
      personality: "Guardian of the Dictionnaire and literary style; reveres rhythmic cadence, imperfect/present subjunctive nuance, and luminous precision."
    },
    steps: [
      {
        stepIndex: 1,
        situation: "Under the golden dome of the Institut de France on Quai de Conti, the Secrétaire Perpétuel welcomes you to the solemn session on the vitality of French: « La langue française doit-elle redouter l'emprunt et le néologisme, ou y puiser un surcroît de vigueur ? »",
        npcLineFr: "Aux yeux de qui fréquente nos classiques, la langue s'enrichit-elle par la fermeture ou par la métamorphose maîtrisée ?",
        npcLineEn: "In the eyes of one who frequents our classics, does the language enrich itself through closure or through mastered metamorphosis?",
        requiredRegister: "Soutenu",
        choices: [
          {
            register: "Soutenu",
            fr: "Monsieur le Secrétaire perpétuel, loin de s'ériger en citadelle figée, une langue vivante ne préserve son génie propre qu'à la condition de féconder l'apport extérieur par la rigueur de sa syntaxe.",
            en: "Mr. Perpetual Secretary, far from setting itself up as a frozen citadel, a living language preserves its own genius only on condition that it fertilizes external contributions through the rigor of its syntax.",
            isOptimal: true,
            reputationDelta: +55,
            feedback: "✅ Sublimité académique ! 'Loin de s'ériger en', 'son génie propre', and 'ne... qu'à la condition de' echo the finest speeches under the Coupole."
          },
          {
            register: "Courant",
            fr: "Une langue vivante doit accepter de nouveaux mots venus d'ailleurs tout en gardant ses règles grammaticales principales.",
            en: "A living language must accept new words from elsewhere while keeping its main grammatical rules.",
            isOptimal: false,
            reputationDelta: +15,
            feedback: "⚠️ Thoughtful B2/C1 idea, but Sous la Coupole calls for architectural C2 periodicity."
          },
          {
            register: "Familier",
            fr: "Si une langue bloque tous les nouveaux mots, elle finit au musée, faut qu'elle bouge avec son époque !",
            en: "If a language blocks all new words, it ends up in a museum, it has to move with its times!",
            isOptimal: false,
            reputationDelta: -20,
            feedback: "❌ Elliding 'il' in 'faut qu'elle bouge' under the dome of the Institut de France causes a collective gasp among the Forty Immortels."
          }
        ]
      },
      {
        stepIndex: 2,
        situation: "The Secrétaire Perpétuel leans forward, eyes gleaming under the dome: « D'aucuns prétendent que l'exigence stylistique serait un luxe aristocratique étranger à la démocratie. Que leur opposez-vous ? »",
        npcLineFr: "D'aucuns soutiennent que la précision du style relèverait d'un privilège suranné. Qu'en jugez-vous ?",
        npcLineEn: "Some maintain that precision of style belongs to an outdated privilege. How do you judge this?",
        requiredRegister: "Soutenu",
        choices: [
          {
            register: "Soutenu",
            fr: "Tout au contraire, renoncer à l'exigence de précision reviendrait à priver le citoyen des armes conceptuelles sans lesquelles il demeure captif des sophismes du moment.",
            en: "Quite the contrary, renouncing the requirement of precision would amount to depriving the citizen of the conceptual weapons without which he remains captive to the sophistries of the moment.",
            isOptimal: true,
            reputationDelta: +55,
            feedback: "✅ Démonstration souveraine ! 'Reviendrait à', 'sans lesquelles', and 'captif des sophismes' exemplify French philosophical clarity."
          },
          {
            register: "Courant",
            fr: "Au contraire, bien maîtriser la langue permet à chaque citoyen de mieux réfléchir et de ne pas se laisser manipuler.",
            en: "On the contrary, mastering the language well allows every citizen to think better and not be manipulated.",
            isOptimal: false,
            reputationDelta: +15,
            feedback: "⚠️ True and clear, but lacks the literary elevation of 'sans lesquelles' and 'reviendrait à'."
          },
          {
            register: "Familier",
            fr: "C'est tout l'inverse : moins on a de vocabulaire, plus on se fait embobiner par les beaux parleurs !",
            en: "It's the exact opposite: the less vocabulary we have, the more we get sweet-talked by smooth talkers!",
            isOptimal: false,
            reputationDelta: -15,
            feedback: "❌ 'Se faire embobiner' is vivid colloquial French, not Coupole rhetoric."
          }
        ]
      },
      {
        stepIndex: 3,
        situation: "The assembly rises in salute as you conclude your reception address: « Enfin, quelle promesse formulez-vous au seuil de cette maîtrise souveraine du français ? »",
        npcLineFr: "Pour clore cette séance solennelle, quel vœu formez-vous pour quiconque s'approprie notre langue ?",
        npcLineEn: "To close this solemn session, what wish do you form for anyone who makes our language their own?",
        requiredRegister: "Soutenu",
        choices: [
          {
            register: "Soutenu",
            fr: "Puisse chacun trouver dans la musique du français non point un idiome d'emprunt, mais une seconde patrie de l'esprit où la justesse du mot éclaire la liberté du jugement.",
            en: "May everyone find in the music of French not a borrowed idiom, but a second homeland of the mind where the exactness of the word illuminates the freedom of judgment.",
            isOptimal: true,
            reputationDelta: +65,
            feedback: "👑 CONSÉCRATION SOUS LA COUPOLE ! Optative subjunctive 'Puisse chacun...' + 'seconde patrie de l'esprit' crowns your C2 Odyssey!"
          },
          {
            register: "Courant",
            fr: "Je souhaite que chacun puisse se sentir chez soi en français et exprimer exactement ce qu'il pense avec liberté.",
            en: "I wish that everyone may feel at home in French and express exactly what they think with freedom.",
            isOptimal: false,
            reputationDelta: +20,
            feedback: "⚠️ Sincere and grammatically sound, though 'Puisse chacun...' delivers the immortal literary cadence."
          },
          {
            register: "Familier",
            fr: "Que tout le monde kiffe parler français et se sente à la maison à Paris !",
            en: "May everyone love speaking French and feel at home in Paris!",
            isOptimal: false,
            reputationDelta: -15,
            feedback: "⚠️ Heartfelt, but save 'kiffer' for the Canal Saint-Martin afterparty!"
          }
        ]
      }
    ]
  },
  {
    id: "district_boulangerie_bastille",
    name: "Boulangerie & Marché Bastille",
    arrondissement: "11e Arrondissement",
    cefrRange: "A1",
    vibe: "Crisp morning air, warm baguettes tradition, market stalls, and essential everyday Parisian politeness.",
    icon: "🥖",
    accentColor: "#f59e0b",
    targetRegister: "Courant",
    npc: {
      name: "Jean-Luc le Boulanger",
      role: "Artisan Boulanger de Bastille",
      avatar: "🥖",
      personality: "Warm and proud of his craft — loves when newcomers start with 'Bonjour' and order clearly with 'Je voudrais'."
    },
    steps: [
      {
        stepIndex: 1,
        situation: "You step up to the warm golden counter at 8:30 AM. The line behind you moves quickly: « Bonjour ! Qu'est-ce qui vous ferait plaisir ce matin ? »",
        npcLineFr: "Bonjour ! Qu'est-ce qui vous ferait plaisir ce matin ?",
        npcLineEn: "Hello! What would make you happy this morning?",
        requiredRegister: "Courant",
        choices: [
          { register: "Courant", fr: "Bonjour Monsieur ! Je voudrais une baguette tradition bien cuite et un croissant, s'il vous plaît.", en: "Hello Sir! I would like a well-baked traditional baguette and a croissant, please.", isOptimal: true, reputationDelta: +20, feedback: "✅ Parfait ! Starting with 'Bonjour' + 'Je voudrais' + 's'il vous plaît' wins every Parisian baker's heart." },
          { register: "Familier", fr: "Donne-moi vite du pain, j'ai pas le temps !", en: "Give me bread fast, I don't have time!", isOptimal: false, reputationDelta: -15, feedback: "❌ Skipping 'Bonjour' and using imperative 'Donne-moi' with a baker is a major French faux pas!" },
          { register: "Soutenu", fr: "Veuillez agréer ma requête d'un pain allongé.", en: "Please accept my formal petition for an elongated bread.", isOptimal: false, reputationDelta: +5, feedback: "⚠️ Funny and super polite, but way too stiff for a neighborhood bakery!" }
        ]
      },
      {
        stepIndex: 2,
        situation: "The baker hands you the warm paper bag: « Et avec ceci, ce sera tout ? »",
        npcLineFr: "Voilà une belle tradition bien chaude ! Et avec ceci, ce sera tout ?",
        npcLineEn: "Here's a lovely warm tradition baguette! And with that, will that be all?",
        requiredRegister: "Courant",
        choices: [
          { register: "Courant", fr: "Oui merci, ce sera tout ! Je peux payer par carte sans contact ?", en: "Yes thank you, that will be all! Can I pay by contactless card?", isOptimal: true, reputationDelta: +20, feedback: "✅ Spot-on everyday Paris checkout phrasing!" },
          { register: "Familier", fr: "Ouais c'est bon, tu prends la carte ou quoi ?", en: "Yeah it's fine, do you take card or what?", isOptimal: false, reputationDelta: -10, feedback: "❌ Avoid tutoying ('tu prends') a shopkeeper you don't know!" },
          { register: "Soutenu", fr: "Point davantage, cher maître artisan.", en: "No more, dear master artisan.", isOptimal: false, reputationDelta: +5, feedback: "⚠️ Charming 18th-century flair, though 'Oui merci, ce sera tout' is what Parisians actually say." }
        ]
      }
    ]
  },
  {
    id: "district_odeon_debat",
    name: "Ciné-Club & Débat Odéon",
    arrondissement: "6e Arrondissement",
    cefrRange: "B2",
    vibe: "Post-screening debate at Odéon cinema: nuanced opinions, subjunctive triggers, and courteous French disagreement.",
    icon: "🎬",
    accentColor: "#a855f7",
    targetRegister: "Courant",
    npc: {
      name: "Claire Delorme",
      role: "Critique de Cinéma à Odéon",
      avatar: "🎬",
      personality: "Loves passionate yet nuanced debate — rewards B2 connectors ('cependant', 'bien que') and sharp viewpoints."
    },
    steps: [
      {
        stepIndex: 1,
        situation: "After the film screening at Odéon, Claire asks the room: « Ne trouvez-vous pas que les plateformes de streaming menacent le cinéma en salle ? »",
        npcLineFr: "Ne trouvez-vous pas que les plateformes de streaming menacent le cinéma en salle ?",
        npcLineEn: "Don't you think streaming platforms threaten movie theaters?",
        requiredRegister: "Courant",
        choices: [
          { register: "Courant", fr: "Bien que le streaming offre une grande accessibilité, rien ne remplace l'émotion collective d'une salle obscure.", en: "Although streaming offers great accessibility, nothing replaces the collective emotion of a dark theater.", isOptimal: true, reputationDelta: +25, feedback: "✅ Textbook B2 brilliance: 'Bien que + subjunctive' + balanced nuance!" },
          { register: "Familier", fr: "Franchement les cinés c'est trop cher, tout le monde s'en fout maintenant.", en: "Honestly cinemas are too expensive, nobody cares anymore.", isOptimal: false, reputationDelta: -10, feedback: "❌ Too blunt and informal for an Odéon film debate." },
          { register: "Soutenu", fr: "Le septième art périclite inexorablement sous le joug algorithmique.", en: "The seventh art inexorably declines under the algorithmic yoke.", isOptimal: false, reputationDelta: +15, feedback: "⚠️ Very eloquent, though slightly over-dramatic without conceding the streaming convenience." }
        ]
      },
      {
        stepIndex: 2,
        situation: "A spectator disagrees with you. How do you acknowledge their point and defend yours with B2 grace?",
        npcLineFr: "Mais avec le prix des billets aujourd'hui, les jeunes préfèrent regarder les films chez eux !",
        npcLineEn: "But with ticket prices today, young people prefer watching movies at home!",
        requiredRegister: "Courant",
        choices: [
          { register: "Courant", fr: "Je comprends tout à fait votre argument ; en revanche, les cartes illimitées et les tarifs réduits prouvent que les salles attirent encore les jeunes.", en: "I completely understand your point; on the other hand, unlimited passes and student rates prove theaters still attract young people.", isOptimal: true, reputationDelta: +25, feedback: "✅ Classic French debate etiquette: validate first, pivot cleanly with 'en revanche'!" },
          { register: "Familier", fr: "N'importe quoi, t'as rien compris au cinéma !", en: "Nonsense, you don't understand cinema at all!", isOptimal: false, reputationDelta: -20, feedback: "❌ Never dismiss someone's view aggressively in a French cultural salon." },
          { register: "Soutenu", fr: "Votre observation n'est point dénuée de fondement, nonobstant les abonnements.", en: "Your observation is not devoid of merit, notwithstanding subscriptions.", isOptimal: false, reputationDelta: +15, feedback: "⚠️ Grammatically sharp, though slightly archaic for a lively Odéon cinema Q&A." }
        ]
      }
    ]
  }
];

// ============================================================================
// 3. 12-METRIC FRENCH WRITING & C2 RHETORIC RUBRIC (C2_RUBRIC_MARKERS)
// Used by the In-Browser Writing Grader to detect A1-C2 mastery & give feedback
// ============================================================================
window.C2_RUBRIC_MARKERS = {
  metrics: [
    {
      id: "logical_connectors",
      number: 1,
      name: "Connecteurs Logiques & Articulation",
      weight: 10,
      cefrTarget: "B2–C2",
      description: "Deploys sophisticated logical transitions (cause, consequence, concession, opposition) beyond basic 'mais/et/parce que'.",
      markers: [
        "en revanche", "toutefois", "néanmoins", "cependant", "par ailleurs",
        "en outre", "de surcroît", "dès lors", "par conséquent", "en conséquence",
        "force est de constater", "force est de souligner", "il n'en demeure pas moins",
        "nonobstant", "d'une part", "d'autre part", "en définitive", "en dernière analyse",
        "à cet égard", "à l'aune de", "à rebours de", "loin de"
      ],
      upgradeTip: "Replace basic 'mais' or 'aussi' with 'en revanche', 'toutefois', 'de surcroît', or 'il n'en demeure pas moins que'."
    },
    {
      id: "subjunctive_triggers",
      number: 2,
      name: "Maîtrise du Subjonctif (Présent & Passé)",
      weight: 12,
      cefrTarget: "B2–C2",
      description: "Uses concessive, purpose, and necessity subjunctive triggers with accurate subjunctive verb forms.",
      markers: [
        "bien que", "quoique", "pour que", "afin que", "afin qu'aucune",
        "avant que", "à moins que", "pour peu que", "sans que",
        "il importe que", "il convient que", "il faut que", "je doute que",
        "soit", "soient", "ait", "aient", "puisse", "puissent", "fasse", "fassent",
        "compromette", "sache", "aille", "vienne"
      ],
      upgradeTip: "Introduce a concessive or purpose subjunctive clause such as 'bien que + subj.', 'quoique + subj.', 'pour peu que + subj.', or 'afin qu'aucune... ne soit...'."
    },
    {
      id: "nominalization_density",
      number: 3,
      name: "Nominalisation & Densité Conceptuelle",
      weight: 10,
      cefrTarget: "C1–C2",
      description: "Transforms heavy verb clauses into abstract noun phrases typical of French executive, legal, and academic prose.",
      markers: [
        "l'élargissement", "la restructuration", "la généralisation", "l'avènement",
        "l'irruption", "le réexamen", "la régularisation", "l'essor", "la désertification",
        "la pérennité", "le basculement", "la refonte", "l'appauvrissement", "le découplage",
        "le dépassement", "l'intégration", "la création de valeur", "la continuité d'activité"
      ],
      upgradeTip: "Use C1/C2 nominalizations (e.g., 'l'élargissement du périmètre', 'la refonte de', 'l'avènement de') instead of simple verb clauses."
    },
    {
      id: "dialectical_framing",
      number: 4,
      name: "Pensée Dialectique (Thèse / Antithèse / Dépassement)",
      weight: 10,
      cefrTarget: "C1–C2",
      description: "Balances competing perspectives before synthesizing a higher resolution (plan dialectique français).",
      markers: [
        "certes", "il est vrai que", "d'aucuns", "à première vue", "à court terme",
        "loin de s'exclure mutuellement", "dépassement dialectique", "paradoxe",
        "aporie", "antinomique", "concilier", "s'articulent", "dans un premier temps",
        "dans un second mouvement"
      ],
      upgradeTip: "Frame your argument dialectically: concede a point with 'Certes...' or 'À court terme...', pivot with 'Toutefois / Nonobstant', and synthesize with 'Loin de s'exclure mutuellement...'."
    },
    {
      id: "conditional_nuance",
      number: 5,
      name: "Conditionnel de Politesse & d'Hypothèse",
      weight: 8,
      cefrTarget: "B1–C2",
      description: "Uses the conditional mood for diplomatic attenuation, hypothesis, or high-register negative ('ne saurait').",
      markers: [
        "je voudrais", "aimerais", "souhaiterais", "pourriez-vous", "seriez-vous",
        "il conviendrait", "il paraîtrait", "ne saurait", "ne sauraient",
        "quand bien même", "exposerait", "privilégierait", "favoriseraient"
      ],
      upgradeTip: "Soften requests or sharpen hypotheses with the conditional ('pourriez-vous', 'il conviendrait', 'quand bien même + cond.', or the literary 'ne saurait')."
    },
    {
      id: "protocolary_register",
      number: 6,
      name: "Formules Protocolaires & Registre Soutenu",
      weight: 8,
      cefrTarget: "B2–C2",
      description: "Commands French administrative, corporate, and academic epistolary conventions.",
      markers: [
        "par la présente", "j'ai l'honneur de solliciter", "votre haute bienveillance",
        "veuillez agréer", "je vous prie d'agréer", "salutations distinguées",
        "très haute considération", "je me tiens à votre entière disposition",
        "mesdames et messieurs les membres du jury", "sous ce pli", "ci-joint"
      ],
      upgradeTip: "Match French epistolary protocol to your recipient (e.g., 'Veuillez agréer... mes salutations distinguées' or 'J'ai l'honneur de solliciter de votre haute bienveillance')."
    },
    {
      id: "syntactic_sophistication",
      number: 7,
      name: "Architecture Syntaxique & Mise en Relief",
      weight: 8,
      cefrTarget: "B2–C2",
      description: "Uses cleft sentences ('C'est... que'), relative pronouns ('dont', 'auquel', 'lequel'), and present participles/gerunds.",
      markers: [
        "dont", "auquel", "auxquels", "à laquelle", "duquel", "sans laquelle",
        "c'est à cette aune que", "c'est avec", "tout en", "en réduisant",
        "exerçant", "s'acquittant", "illustré par", "assorti de", "assortie d'une"
      ],
      upgradeTip: "Elevate clause complexity with relative pronouns ('dont', 'auquel', 'sans laquelle'), gerunds ('tout en + -ant'), or cleft emphasis ('C'est à cette aune que...')."
    },
    {
      id: "lexical_precision",
      number: 8,
      name: "Précision Lexicale & Idiomatisme",
      weight: 8,
      cefrTarget: "B2–C2",
      description: "Replaces generic verbs ('faire', 'avoir', 'dire') with precise French collocations.",
      markers: [
        "procéder à", "dresser un bilan", "porter à votre attention", "mettre à profit",
        "circonscrire", "diligenter", "ériger en", "s'inscrire dans la lignée",
        "paver la voie", "faire obstacle à", "saisir le médiateur", "orchestrer"
      ],
      upgradeTip: "Avoid weak verbs like 'faire' or 'avoir': use precise collocations such as 'procéder au remboursement', 'dresser un bilan', 'mettre à profit', or 'diligenter un audit'."
    },
    {
      id: "argumentative_stance",
      number: 9,
      name: "Modalisation & Prise de Position Impersonnelle",
      weight: 7,
      cefrTarget: "B2–C2",
      description: "Uses impersonal French academic openings rather than repetitive 'Je pense que'.",
      markers: [
        "il convient de", "il importe de", "il paraît légitime", "il s'avère que",
        "force est de", "on ne saurait", "il y a lieu de", "tout porte à croire"
      ],
      upgradeTip: "Replace 'Je pense que' with impersonal C1/C2 framing: 'Il convient de', 'Force est de constater que', or 'Il paraît légitime d'envisager'."
    },
    {
      id: "cohesion_anaphora",
      number: 10,
      name: "Cohésion Textuelle & Reprises Anaphoriques",
      weight: 7,
      cefrTarget: "B2–C2",
      description: "Links sentences smoothly using demonstrative/pronoun anaphora ('celui-ci', 'celle-ci', 'ces derniers', 'un tel').",
      markers: [
        "celui-ci", "celle-ci", "ceux-ci", "ces derniers", "ces dernières",
        "une telle", "un tel", "cette dernière", "ledit", "ladite", "y", "en"
      ],
      upgradeTip: "Avoid repeating nouns across adjacent sentences by using French anaphoric pronouns: 'celle-ci', 'ces derniers', or 'une telle démarche'."
    },
    {
      id: "orthographic_accents",
      number: 11,
      name: "Rigueur Orthographique & Diacritiques",
      weight: 6,
      cefrTarget: "A1–C2",
      description: "Accurate placement of French diacritics (é, è, ê, à, ç, œ) and punctuation spacing.",
      markers: [
        "é", "è", "ê", "à", "â", "ù", "û", "ô", "î", "ï", "ç", "œ"
      ],
      upgradeTip: "Use the French accent bar above the editor to ensure accurate accents (é, è, ê, à, ç, œ)."
    },
    {
      id: "rhetorical_cadence",
      number: 12,
      name: "Souffle Rhétorique & Longueur Développée",
      weight: 6,
      cefrTarget: "B1–C2",
      description: "Sustains multi-clause periodicity and meets the target word count with varied sentence lengths.",
      markers: [
        ":", ";", "—", "«", "»"
      ],
      upgradeTip: "Develop at least 3–4 full, multi-clause sentences using colons (:) or semicolons (;) to explain cause and consequence."
    }
  ],

  // Instant register-upgrade dictionary for actionable feedback in the Grader UI
  registerUpgrades: [
    { basic: "mais", c2Upgrade: "en revanche / toutefois / néanmoins", note: "Sharpens contrast in B2–C2 essays" },
    { basic: "aussi", c2Upgrade: "de surcroît / en outre / par ailleurs", note: "Adds C1/C2 cumulative weight" },
    { basic: "je pense que", c2Upgrade: "force est de constater que / il convient de souligner que", note: "Shifts from personal opinion to objective authority" },
    { basic: "parce que", c2Upgrade: "dans la mesure où / eu égard à / dès lors que", note: "Elevates causal explanation" },
    { basic: "même si", c2Upgrade: "bien que (+ subj.) / quoique (+ subj.) / quand bien même (+ cond.)", note: "Unlocks DALF C1/C2 concession points" },
    { basic: "pour", c2Upgrade: "afin de / en vue de / afin que (+ subj.)", note: "Expresses purposeful strategic intent" },
    { basic: "faire", c2Upgrade: "procéder à / orchestrer / mettre en œuvre", note: "Replaces vague verb with precise executive collocation" },
    { basic: "problème", c2Upgrade: "dysfonctionnement / écueil / aporie / préjudice", note: "Matches legal, technical, or philosophical context" },
    { basic: "finalement", c2Upgrade: "en définitive / en dernière analyse / à l'issue de", note: "Delivers a true French synthesis conclusion" }
  ]
};
