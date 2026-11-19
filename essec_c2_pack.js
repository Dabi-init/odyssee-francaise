/* ============================================================================
 * L'ODYSSÉE FRANÇAISE — v28.0 · ESSEC CERGY REAL-LIFE & DALF C2 OFFICIAL PACK
 * - 6 Authentic A2 → C1 ESSEC / Cergy / RER A / Préfecture / La Défense Scenarios
 * - 2 Official-Scale DALF C2 Multi-Document Dossiers (~1,950–2,050 words each)
 * - 2 Layer-B Multi-Speaker Native Radio Debates + Adversarial Jury Prompts
 * ============================================================================ */
(function () {
  const scenarios = [
    {
      id: "essec_rer_cergy",
      cefr: "A2",
      icon: "🚆",
      title: "Cergy-Préfecture, RER A & Colocation",
      enTitle: "Cergy-Préfecture, RER A & Student Flatshare",
      location: "Gare de Cergy-Préfecture · Val-d'Oise (95)",
      summary: "Gérer une perturbation sur le RER A vers La Défense, activer votre passe Navigo, et clarifier bail, garant Visale et état des lieux avec votre propriétaire.",
      enSummary: "Handle a RER A delay toward La Défense, set up your Navigo pass, and sort out your lease, Visale guarantor, and move-in inspection.",
      speaker: "Contrôleur Moreau & Mme Solange",
      img: "assets/scene_metro_chatelet.webp",
      lines: [
        {
          sp: "Agent SNCF · Cergy-Préfecture",
          fr: "Bonjour ! Attention, le trafic sur le RER A direction Paris est ralenti à cause d'un incident à Nanterre. Vous prenez le train pour La Défense ?",
          en: "Hello! Careful, RER A traffic toward Paris is slowed due to an incident at Nanterre. Are you taking the train to La Défense?",
          q: "Comment répondre naturellement et demander la durée du retard ?",
          opts: [
            "Oui bonjour ! J'ai un cours à La Défense — vous savez combien de temps va durer le retard, s'il vous plaît ?",
            "Non merci, je suis un train de retard aujourd'hui.",
            "Donnez-moi un autre RER tout de suite, c'est nul."
          ],
          ok: 0,
          tip: "Commencez toujours par « Bonjour » en France avant de poser une question pratique, même quand vous êtes pressé."
        },
        {
          sp: "Guichet Navigo · Cergy",
          fr: "Pour votre passe Navigo Imagine R étudiant, j'ai besoin de votre certificat de scolarité ESSEC et d'un justificatif de domicile à Cergy.",
          en: "For your student Imagine R Navigo pass, I need your ESSEC enrollment certificate and proof of address in Cergy.",
          q: "Vous avez les deux documents sur votre téléphone et imprimés. Que dites-vous ?",
          opts: [
            "Voici mon certificat de scolarité et mon attestation d'hébergement. Est-ce que le passe fonctionne tout de suite ?",
            "J'ai oublié mon école dans mon sac hier matin.",
            "Je voudrais acheter une baguette avec le Navigo."
          ],
          ok: 0,
          tip: "« Certificat de scolarité » + « justificatif de domicile » (ou « attestation d'hébergement ») sont les deux papiers demandés partout en France."
        },
        {
          sp: "Mme Solange · Propriétaire à Cergy-le-Haut",
          fr: "Avant de signer le bail de la colocation, vous avez bien votre garantie Visale validée par Action Logement ?",
          en: "Before signing the flatshare lease, do you indeed have your Visale guarantee approved by Action Logement?",
          q: "Confirmez poliment que votre visa Visale est prêt et demandez quand aura lieu l'état des lieux.",
          opts: [
            "Oui, tout à fait ! J'ai téléchargé mon visa Visale certifié. Quand pouvons-nous faire l'état des lieux d'entrée ?",
            "Non, je ne mange pas de Visale, je suis végétarien.",
            "Je signe le bail sans regarder l'appartement, c'est pareil."
          ],
          ok: 0,
          tip: "« L'état des lieux d'entrée » protège votre dépôt de garantie (caution) : notez toujours chaque détail avant de signer !"
        },
        {
          sp: "Mme Solange · État des lieux",
          fr: "Regardez bien le radiateur et la fenêtre de votre chambre. Tout vous semble en bon état ?",
          en: "Take a close look at the radiator and window in your bedroom. Does everything look in good condition to you?",
          q: "Vous remarquez une petite rayure sur le bureau et un volet qui ferme difficilement. Comment le signaler sans être impoli ?",
          opts: [
            "L'appartement est très bien, merci ! On peut juste noter cette petite rayure sur le bureau et le volet qui coince un peu ?",
            "C'est catastrophique, je refuse de payer le loyer ce mois-ci !",
            "Tout est parfait, ne notez rien du tout."
          ],
          ok: 0,
          tip: "« On peut juste noter… ? » est la formule magique, calme et ferme, pour faire inscrire une remarque sur l'état des lieux."
        }
      ],
      writePrompt: "Écrivez un e-mail poli (70–100 mots) à votre propriétaire à Cergy pour confirmer la réception de votre garantie Visale, proposer un créneau pour l'état des lieux d'entrée, et poser une question sur les charges (eau, chauffage, Internet).",
      writeMinWords: 70
    },
    {
      id: "essec_prefecture",
      cefr: "B1",
      icon: "🏛️",
      title: "Préfecture de Cergy-Pontoise, CAF & Ameli",
      enTitle: "Cergy-Pontoise Prefecture, CAF Housing Aid & Healthcare",
      location: "Préfecture du Val-d'Oise & Agence Bancaire · Cergy",
      summary: "Renouveler votre titre de séjour sur l'ANEF, préparer le passage vers l'APS/RECE après votre MIM, débloquer l'APL de la CAF et ouvrir un compte bancaire français.",
      enSummary: "Renew your student residence permit on ANEF, plan your post-MIM RECE/APS permit, activate CAF housing aid, and open a French bank account.",
      speaker: "Agent de Préfecture & Conseillère Bancaire",
      img: "assets/scene_prefecture_banque.webp",
      lines: [
        {
          sp: "Agent · Préfecture de Cergy-Pontoise",
          fr: "Bonjour Monsieur. Pour le renouvellement de votre titre de séjour étudiant sur l'ANEF, votre attestation de prolongation arrive bientôt à échéance. Il nous manque vos relevés de notes de l'ESSEC.",
          en: "Hello Sir. For your student residence permit renewal on ANEF, your extension certificate is expiring soon. We are missing your ESSEC transcripts.",
          q: "Expliquez calmement que vous venez de déposer les relevés sur le portail et demandez un récépissé.",
          opts: [
            "Bonjour Madame. Je viens tout juste de téléverser mes relevés de notes sur mon espace ANEF ce matin ; pourrais-je vérifier que le dossier est complet afin d'obtenir mon récépissé ?",
            "C'est impossible, l'ordinateur a mangé mes notes hier soir.",
            "Je n'ai pas besoin de titre de séjour, j'ai ma carte étudiante."
          ],
          ok: 0,
          tip: "En administration française, le conditionnel poli (« pourrais-je vérifier… ») + le vocabulaire exact (« téléverser », « récépissé », « dossier complet ») débloquent tout."
        },
        {
          sp: "Agent · Transition après le Master",
          fr: "Puisque vous terminez votre deuxième Master en Management, envisagez-vous de demander une carte RECE (Recherche d'Emploi / Création d'Entreprise) dès l'obtention de votre diplôme ?",
          en: "Since you are finishing your second Master in Management, do you plan to apply for a RECE job-seeker permit as soon as you graduate?",
          q: "Confirmez votre projet professionnel en France avec clarté.",
          opts: [
            "Exactement : dès que j'aurai mon attestation de réussite de l'ESSEC, je compte demander la carte RECE afin de poursuivre ma recherche de CDI à Paris ou La Défense.",
            "Je ne sais pas ce que je ferai l'année prochaine, peut-être rien.",
            "Oui, je veux la carte RECE pour voyager gratuitement en RER."
          ],
          ok: 0,
          tip: "Notez le futur antérieur très naturel après « dès que » : « dès que j'aurai mon attestation de réussite… »."
        },
        {
          sp: "Conseillère · CAF du Val-d'Oise",
          fr: "Votre demande d'aide au logement (APL) est en attente parce que le propriétaire n'a pas encore rempli l'attestation de loyer, et votre RIB français n'était pas encore rattaché.",
          en: "Your APL housing aid application is pending because the landlord hasn't completed the rent certificate yet, and your French RIB wasn't linked yet.",
          q: "Rassurez la conseillère et vérifiez si le versement sera rétroactif.",
          opts: [
            "Merci de me le signaler ! J'ai désormais mon RIB français et je vais relancer mon propriétaire dès aujourd'hui. Une fois les pièces validées, le versement couvrira-t-il bien le mois précédent ?",
            "Gardez l'APL, c'est trop compliqué pour moi.",
            "Mon propriétaire habite loin, donc tant pis."
          ],
          ok: 0,
          tip: "« Relancer quelqu'un » = to follow up politely with someone. Indispensable dans la vie administrative et professionnelle en France !"
        },
        {
          sp: "Accueil · CPAM / Ameli",
          fr: "Votre numéro de Sécurité sociale provisoire est actif. Avez-vous déclaré un médecin traitant et transmis votre RIB pour vos remboursements ?",
          en: "Your provisional Social Security number is active. Have you declared a primary doctor and submitted your RIB for reimbursements?",
          q: "Répondez précisément sur vos démarches Ameli.",
          opts: [
            "J'ai déjà transmis mon RIB sur le site Ameli, et j'ai pris rendez-vous la semaine prochaine avec un médecin généraliste à Cergy pour le déclarer comme médecin traitant.",
            "Je ne suis jamais malade, je n'ai pas besoin d'Ameli.",
            "Mon médecin habite en Inde, il va m'envoyer une Carte Vitale."
          ],
          ok: 0,
          tip: "En France, déclarer un « médecin traitant » permet d'être remboursé au taux maximal (70 % Sécu + mutuelle)."
        }
      ],
      writePrompt: "Rédigez un message formel (130–170 mots) adressé à la Préfecture de Cergy-Pontoise via la messagerie ANEF pour signaler l'ajout de votre attestation de réussite ESSEC, rappeler la date d'expiration de votre titre actuel et solliciter une attestation de prolongation d'instruction.",
      writeMinWords: 120
    },
    {
      id: "essec_apero",
      cefr: "B1",
      icon: "🥂",
      title: "Apéro Campus ESSEC, Verlan & Second Degré",
      enTitle: "ESSEC Student Apéro, 20s Slang & French Irony",
      location: "Coloc près du Port de Cergy & Quai de Valmy",
      summary: "Comprendre vos camarades français de 23 ans en soirée (verlan, élisions, second degré), manier le passage tu/vous entre amis et professeurs, et rebondir avec naturel.",
      enSummary: "Understand 23-year-old French classmates at an apéro (verlan, rapid reductions, dry humor), master tu/vous boundaries, and jump in naturally.",
      speaker: "Yanis & Camille (Camarades MIM)",
      img: "assets/scene_appartement_coloc.webp",
      lines: [
        {
          sp: "Yanis · Apéro au Port de Cergy",
          fr: "Eh mais t'as survécu au cours de finance corporate ce matin ?! Franchement le prof il a tracé de ouf, j'suis carrément largué sur les flux de trésorerie !",
          en: "Hey you survived corporate finance this morning?! Honestly the prof sped through like crazy, I'm totally lost on cash flows!",
          q: "Décodez le français parlé rapide (« de ouf », « largué ») et répondez comme un vrai camarade de promo.",
          opts: [
            "Grave, il allait à deux cents à l'heure ! Si tu veux, on se cale une heure à la bibliothèque demain pour reprendre le cas ensemble.",
            "Monsieur Yanis, je vous prie d'agréer mes salutations les plus distinguées.",
            "Non, je n'ai pas pris le bateau sur les flux de trésorerie."
          ],
          ok: 0,
          tip: "« Grave » (= totally), « on se cale un créneau » (= let's lock in a slot), « de ouf » (= crazy/intense) : 100 % authentique sur un campus de Grande École !"
        },
        {
          sp: "Camille · Sur la terrasse",
          fr: "Oh là là, tu ramènes du fromage ET des samosas maison ? Mais t'es un génie, c'est pas du tout le meilleur apéro du semestre ça !",
          en: "Oh wow, you brought cheese AND homemade samosas? You're a genius — this is totally not the best apéro of the semester!",
          q: "Repérez le second degré affectueux (« c'est pas du tout le meilleur… ») et répondez avec humour.",
          opts: [
            "Haha merci ! J'ai tenté la fusion Cergy–Bengaluru, vous me direz si ça passe avec le comté !",
            "Désolé si c'est mauvais, je vais tout jeter à la poubelle.",
            "Pourquoi dis-tu que ce n'est pas le meilleur apéro ?"
          ],
          ok: 0,
          tip: "Les Français adorent l'antiphrase affectueuse (« c'est pas du tout génial ! » = c'est génial !). Le sourire et la répartie légère font mouche à tous les coups."
        },
        {
          sp: "Yanis · Changement de registre soudain",
          fr: "Oups, regarde qui passe devant la brasserie : c'est le professeur Valcourt, notre prof de stratégie ! Vas-y, dis-lui bonjour !",
          en: "Oops, look who's walking past the brasserie: it's Prof. Valcourt, our strategy professor! Go on, say hi!",
          q: "Basculez instantanément du tutoiement étudiant au vouvoiement respectueux.",
          opts: [
            "Bonsoir Professeur ! J'ai beaucoup apprécié votre étude de cas ce matin, nous en discutions justement entre étudiants. Très bonne soirée à vous !",
            "Wesh Valcourt ! T'es chaud pour un verre avec nous ?",
            "Salut professeur, tu vas bien ? Le cours était de ouf."
          ],
          ok: 0,
          tip: "En France, maîtriser la bascule instantanée tu (camarades) ↔ vous (professeur / supérieur) est un marqueur immédiat de finesse sociale."
        },
        {
          sp: "Camille · Invitation pour le week-end",
          fr: "Dis, samedi soir on fait un petit dîner chez moi dans le 10e, rien de guindé, juste quelques potes de l'ESSEC. Ça te dit de passer ? T'es pas obligé hein !",
          en: "Hey, Saturday evening we're having a casual dinner at my place in the 10th, nothing fancy, just a few ESSEC friends. Feel like coming by? No pressure!",
          q: "Acceptez chaleureusement en suivant le code social français de l'invitation.",
          opts: [
            "Avec grand plaisir ! Merci pour l'invit', je peux apporter quelque chose à boire ou un dessert ?",
            "Oui j'arrive à 19h00 pile, prépare trois plats.",
            "Puisque je ne suis pas obligé, je viendrai peut-être sans prévenir."
          ],
          ok: 0,
          tip: "En France, on ne vient JAMAIS les mains vides chez des amis : demander « Je peux apporter quelque chose ? » est un réflexe en or."
        }
      ],
      writePrompt: "Écrivez un message décontracté mais soigné (90–130 mots) sur le groupe WhatsApp de votre équipe de projet ESSEC pour proposer un créneau de révision, répartir les slides d'un cas de stratégie et proposer un café après le cours.",
      writeMinWords: 90
    },
    {
      id: "essec_cas_mim",
      cefr: "B2",
      icon: "📊",
      title: "Séminaire ESSEC MIM : Exposé en 2 Parties & Interruptions",
      enTitle: "ESSEC MIM Seminar: Two-Part Presentation & Live Pushback",
      location: "Amphithéâtre ESSEC · Cergy",
      summary: "Structurer une étude de cas à la française (Problématique → I. Thèse / II. Limites & Recommandation → Ouverture) et répondre à une interruption vive en plein exposé.",
      enSummary: "Structure a French Grande École case study (Problem Statement → Part I / Part II → Broader Opening) and handle sharp seminar interruptions.",
      speaker: "Prof. Valcourt & Étudiants MIM",
      img: "assets/scene_bibliotheque_sorbonne.webp",
      lines: [
        {
          sp: "Prof. Valcourt · Ouverture du séminaire",
          fr: "Vous avez dix minutes pour présenter votre recommandation stratégique sur le virage électrique d'un constructeur européen. Quelle est votre problématique et votre plan ?",
          en: "You have ten minutes to present your strategic recommendation on a European automaker's EV pivot. What is your central question and outline?",
          q: "Annoncez une problématique nette et un plan structuré en deux parties à la française.",
          opts: [
            "Nous nous demanderons comment le groupe peut financer sa transition électrique sans sacrifier sa rentabilité à court terme. Dans un premier temps, nous analyserons la vulnérabilité de sa chaîne de valeur ; dans un second temps, nous proposerons un partenariat industriel ciblé.",
            "Bonjour, je vais parler des voitures électriques et ensuite je vais donner mon avis personnel.",
            "Voici vingt chiffres sur les batteries, puis nous verrons bien à la fin."
          ],
          ok: 0,
          tip: "En Grande École comme au DALF C2, annoncer explicitement la problématique + « Dans un premier temps… / Dans un second temps… » rassure immédiatement un auditoire français."
        },
        {
          sp: "Camille · Interruption en plein exposé",
          fr: "Excuse-moi de t'interrompre, mais ton hypothèse de marge à 8 % me paraît franchement optimiste vu la guerre des prix lancée par les constructeurs asiatiques !",
          en: "Sorry to interrupt, but your 8% margin assumption seems frankly optimistic given the price war launched by Asian automakers!",
          q: "Accueillez l'objection avec calme, concédez le risque, puis défendez votre scénario avec un connecteur de nuance.",
          opts: [
            "C'est une objection tout à fait pertinente, et tu as raison de souligner la pression tarifaire. Toutefois, notre scénario repose non pas sur le volume d'entrée de gamme, mais sur le segment flotte d'entreprise où la valeur résiduelle reste protégée.",
            "Attends que j'aie fini avant de critiquer mes chiffres !",
            "Ah oui, tu as raison, mon modèle est complètement faux."
          ],
          ok: 0,
          tip: "La formule reine du débat français : 1) Valider (« C'est une objection tout à fait pertinente ») → 2) Pivoter (« Toutefois / En revanche ») → 3) Recadrer sur un fait précis."
        },
        {
          sp: "Prof. Valcourt · Question de synthèse critique",
          fr: "Bien que votre alliance industrielle soit séduisante sur le papier, ne craignez-vous pas une perte de souveraineté technologique sur le logiciel embarqué ?",
          en: "Although your industrial alliance looks attractive on paper, don't you fear a loss of technological sovereignty over embedded software?",
          q: "Répondez au subjonctif et proposez un garde-fou contractuel clair.",
          opts: [
            "Effectivement, ce risque existe ; c'est précisément pourquoi il est indispensable que le groupe conserve la propriété intellectuelle de son architecture logicielle, quand bien même la fabrication des cellules serait mutualisée.",
            "Non, le logiciel n'est pas important dans une voiture moderne.",
            "Bien que c'est risqué, on va espérer que tout marche bien."
          ],
          ok: 0,
          tip: "Notice « il est indispensable que + subjonctif » (« conserve ») et « quand bien même + conditionnel » (« serait mutualisée ») : pur niveau B2+/C1 !"
        },
        {
          sp: "Prof. Valcourt · Conclusion & Ouverture",
          fr: "Il vous reste trente secondes pour conclure votre exposé devant le comité.",
          en: "You have thirty seconds left to close your presentation before the committee.",
          q: "Clôturez par une synthèse incisive suivie d'une ouverture stratégique.",
          opts: [
            "En somme, la survie du groupe passe par une discipline financière couplée à des alliances ciblées. Au-delà de ce cas, cette équation pose plus largement la question de la politique industrielle européenne face aux subventions américaines et chinoises. Je vous remercie de votre attention.",
            "Voilà, c'est fini, merci à tous.",
            "En conclusion, il faut vendre plus de voitures et dépenser moins d'argent."
          ],
          ok: 0,
          tip: "En France, une grande conclusion se termine toujours par une « ouverture » (« Au-delà de ce cas, cela pose plus largement la question de… »)."
        }
      ],
      writePrompt: "Rédigez une note de recommandation structurée (200–260 mots) pour un séminaire ESSEC MIM : « Comment une entreprise européenne peut-elle concilier compétitivité prix et exigences ESG ? » Incluez une problématique, deux parties équilibrées avec connecteurs (d'une part / en revanche / dès lors) et une ouverture.",
      writeMinWords: 180
    },
    {
      id: "essec_defense_cdi",
      cefr: "C1",
      icon: "💼",
      title: "Entretien CDI à La Défense & Négociation Salariale",
      enTitle: "La Défense Executive Interview & Salary Negotiation",
      location: "Tour First · La Défense (92)",
      summary: "Valoriser un double parcours Inde → ESSEC MIM en français soutenu, démonter une réticence implicite sur la maîtrise culturelle, et négocier votre rémunération avec diplomatie.",
      enSummary: "Pitch your India → ESSEC MIM profile in polished executive French, defuse subtle cultural-fit doubts, and negotiate compensation diplomatically.",
      speaker: "Marc-Antoine · Associé en Conseil & DRH",
      img: "assets/bg_career.jpg",
      lines: [
        {
          sp: "Marc-Antoine · Associé, Cabinet de Stratégie (La Défense)",
          fr: "Bonjour Sreenath, ravi de vous rencontrer. Votre parcours est singulier : vous arrivez d'Inde pour un deuxième Master en Management à l'ESSEC. Pourquoi choisir de bâtir votre carrière en France plutôt qu'à Londres ou Singapour ?",
          en: "Hello Sreenath, delighted to meet you. Your path is unique: you came from India for a second Master in Management at ESSEC. Why choose to build your career in France rather than London or Singapore?",
          q: "Transformez votre parcours international en avantage stratégique distinctif, sans formule clichée.",
          opts: [
            "Bonjour Marc-Antoine, merci de me recevoir. Ce choix est délibéré : la France concentre des champions industriels et technologiques mondiaux tout en cultivant une rigueur analytique qui me correspond. Mon double ancrage Inde–ESSEC me permet justement d'apporter à vos clients un regard biculturel sur les marchés à forte croissance, tout en m'inscrivant durablement dans l'écosystème parisien.",
            "Parce que j'aime bien Paris et les croissants, et Londres était trop cher.",
            "Je cherche juste un premier stage quelque part en Europe, peu importe le pays."
          ],
          ok: 0,
          tip: "Les recruteurs français redoutent le candidat « de passage ». Montrer un ancrage réfléchi (« m'inscrire durablement ») + une valeur ajoutée concrète (« double ancrage ») rassure instantanément."
        },
        {
          sp: "Marc-Antoine · Test implicite sur le français au COMEX",
          fr: "Nos missions exigent de rédiger des notes de synthèse pour des comités de direction du CAC 40 et d'animer des ateliers tendus en français. Honnêtement, vous sentez-vous à l'aise dans cet exercice exigeant ?",
          en: "Our projects require writing executive memos for CAC 40 leadership committees and leading tense workshops in French. Honestly, do you feel comfortable with that demanding exercise?",
          q: "Répondez avec assurance mesurée, preuves concrètes et élégance C1.",
          opts: [
            "Je mesure pleinement le niveau d'exigence qu'implique un COMEX. C'est précisément pourquoi j'ai investi massivement dans la maîtrise du français analytique et des registres professionnels — de la note de synthèse structurée à la gestion d'objections en direct. Bien que je reste attentif à affiner sans cesse mes nuances, je suis pleinement opérationnel pour porter une recommandation devant un client exigeant.",
            "Oui, je parle parfaitement français sans jamais faire une seule erreur.",
            "Non, pas encore, mais je peux faire toutes les présentations en anglais si vos clients sont d'accord."
          ],
          ok: 0,
          tip: "L'humilité lucide + la preuve de maîtrise (« Bien que je reste attentif à… je suis pleinement opérationnel ») impressionne infiniment plus que l'arrogance ou l'auto-dépréciation."
        },
        {
          sp: "DRH · Question sur le statut administratif (RECE / Passeport Talent)",
          fr: "Sur le plan administratif, comment se présente votre autorisation de travail à l'issue de votre diplôme à l'ESSEC ?",
          en: "Administratively, what does your work authorization look like upon graduating from ESSEC?",
          q: "Rassurez la DRH en maîtrisant les termes juridiques exacts (Passeport Talent · Salarié qualifié).",
          opts: [
            "C'est un point très fluide : en tant que diplômé d'un Master reconnu en France, je suis éligible soit à la carte RECE dès l'obtention du diplôme, soit directement au Passeport Talent « Salarié qualifié », qui dispense l'entreprise de la procédure d'opposabilité de l'emploi.",
            "Je ne sais pas trop, il faudra demander à la préfecture je pense.",
            "Il faudra que votre entreprise fasse un parrainage compliqué pendant six mois."
          ],
          ok: 0,
          tip: "Connaître le terme exact « Passeport Talent — Salarié qualifié » (sans opposabilité de la situation de l'emploi) lève immédiatement la plus grande peur d'un DRH français !"
        },
        {
          sp: "DRH · Négociation de la rémunération",
          fr: "Notre proposition initiale se situe à 48 000 € brut annuel fixe. Est-ce cohérent avec vos prétentions salariales ?",
          en: "Our initial offer is €48,000 gross annual base salary. Is that aligned with your salary expectations?",
          q: "Négociez fermement vers 52–54 k€ tout en restant courtois et constructif.",
          opts: [
            "Je vous remercie vivement de cette proposition, et je suis très enthousiaste à l'idée de rejoindre l'équipe. Compte tenu de mon double Master, de mon expérience préalable et des standards du marché à La Défense sur ce périmètre, j'envisageais plutôt une fourchette autour de 52 à 54 k€ brut fixe. Serait-il possible d'étudier un ajustement en ce sens, ou d'échanger sur la structure du variable ?",
            "48 000 €, c'est vraiment trop bas, je refuse en dessous de 55 000 €.",
            "Oui parfait, j'accepte tout de suite sans rien demander."
          ],
          ok: 0,
          tip: "En négociation française : gratitude d'abord → critères objectifs (« compte tenu de… ») → fourchette calme → question ouverte au conditionnel (« Serait-il possible… »)."
        }
      ],
      writePrompt: "Rédigez un e-mail de suivi post-entretien (220–280 mots) adressé à Marc-Antoine (Associé à La Défense) : remerciez-le pour l'échange, reprenez un point stratégique discuté sur la transformation IA d'un client CAC 40 en apportant une nuance supplémentaire, et réaffirmez votre motivation en registre soutenu.",
      writeMinWords: 220
    },
    {
      id: "essec_debat_civique",
      cefr: "C1",
      icon: "⚖️",
      title: "Débat Intellectuel & Citoyen : Méritocratie & Modèle Français",
      enTitle: "French Civic Debate: Meritocracy, Secularism & Public Debate",
      location: "Salon du Quartier Latin · Paris 5e",
      summary: "Maîtriser l'art typiquement français de la contradiction courtoise lors d'un dîner intellectuel : nuancer sans céder, éviter les anglicismes conceptuels et monter en généralité.",
      enSummary: "Master the uniquely French art of courteous intellectual disagreement: nuance without backing down, avoid calques, and elevate the argument.",
      speaker: "Céleste Vance & Prof. Valcourt",
      img: "assets/scene_diner_marais.webp",
      lines: [
        {
          sp: "Céleste Vance · Dîner au Marais",
          fr: "On parle beaucoup de « méritocratie républicaine » en France, notamment autour des Grandes Écoles. Mais entre nous, l'ascenseur social n'est-il pas aujourd'hui largement en panne ?",
          en: "People talk a lot about 'Republican meritocracy' in France, especially around Grandes Écoles. Between us, isn't the social elevator largely broken today?",
          q: "Construisez une réponse C1 qui échappe à la caricature binaire (ni cynisme total, ni naïveté).",
          opts: [
            "Force est de constater que la reproduction sociale demeure tenace, comme le montrent les études sur l'accès aux classes préparatoires. Il n'en demeure pas moins que l'ouverture par les bourses, l'apprentissage et les voies internationales montre qu'il s'agit moins de condamner le principe méritocratique que d'en corriger les biais d'origine.",
            "Oui, tout est cassé en France et personne ne peut réussir.",
            "Non, tout le monde a exactement les mêmes chances dès la naissance."
          ],
          ok: 0,
          tip: "La « montée en généralité » française consiste à dépasser le « pour/contre » en reformulant le problème (« il s'agit moins de X que de Y »)."
        },
        {
          sp: "Prof. Valcourt · Relance sur le rôle de l'État",
          fr: "Vous qui connaissez le dynamisme entrepreneurial indien et anglo-saxon, ne trouvez-vous pas que l'État français étouffe l'initiative privée à force de normes ?",
          en: "You who know Indian and Anglo-Saxon entrepreneurial dynamism, don't you find that the French State stifles private initiative with excessive regulations?",
          q: "Comparez les deux modèles avec finesse diplomatique (litote + concession + synthèse).",
          opts: [
            "Il serait excessif d'affirmer que la lourdeur administrative facilite toujours l'audace entrepreneuriale ! Toutefois, réduire le modèle français à ses seules contraintes ferait oublier ce que les infrastructures publiques, la santé et la formation financée par la collectivité apportent en stabilité aux talents et aux entreprises.",
            "Oui, la bureaucratie française est insupportable et devrait copier entièrement les États-Unis.",
            "Je préfère ne pas avoir d'opinion sur la politique française."
          ],
          ok: 0,
          tip: "Admirez la litote C1/C2 : « Il serait excessif d'affirmer que… » critique poliment sans jamais braquer votre interlocuteur !"
        },
        {
          sp: "Céleste · Piège du calque anglais",
          fr: "Certains invités affirment que la culture française est trop « défensive » face à la mondialisation anglophone. Qu'en pensez-vous ?",
          en: "Some guests claim French culture is too 'defensive' toward English-speaking globalization. What do you think?",
          q: "Répondez dans un français châtié en distinguant protection culturelle et repli identitaire.",
          opts: [
            "Tout dépend de la manière dont on conçoit l'exception culturelle : si elle devient un repli frileux, elle s'appauvrit ; mais dès lors qu'elle garantit la diversité des récits, du cinéma et de la pensée face à l'uniformisation des plateformes, elle constitue au contraire une richesse universelle.",
            "C'est un gros challenge pour la culture française de faire du marketing global.",
            "Tout le monde devrait parler uniquement anglais, ce serait plus simple."
          ],
          ok: 0,
          tip: "Remplacez toujours les anglicismes paresseux (« challenge », « impactant », « focus ») par le mot juste français (« défi », « décisif », « priorité ») au DALF C1/C2."
        },
        {
          sp: "Prof. Valcourt · Clôture du débat",
          fr: "En un mot, quelle qualité vous paraît indispensable pour réussir son intégration intellectuelle en France ?",
          en: "In a word, what quality seems indispensable to succeed in one's intellectual integration in France?",
          q: "Offrez une formule mémorable de niveau C1/C2.",
          opts: [
            "L'appétit du débat contradictoire : comprendre qu'en France, contredire quelqu'un avec rigueur et courtoisie n'est pas une marque d'hostilité, mais la plus haute forme de respect intellectuel.",
            "Toujours être d'accord avec tout le monde pour éviter les problèmes.",
            "Apprendre par cœur la liste des rois de France."
          ],
          ok: 0,
          tip: "Exactement ! En France, débattre vivement autour d'une table est une preuve d'estime et d'engagement intellectuel."
        }
      ],
      writePrompt: "Rédigez une tribune argumentée (280–340 mots) sur le thème : « Le modèle social et réglementaire européen est-il un frein ou un atout à l'ère de la compétition technologique mondiale ? » Employez au moins deux concessions nuancées, un subjonctif et zéro anglicisme inutile.",
      writeMinWords: 260
    }
  ];

  // ============================================================================
  // 2 FULL OFFICIAL-SCALE DALF C2 MULTI-DOCUMENT DOSSIERS (~1,950–2,050 words each)
  // ============================================================================
  const dossiers = [
    {
      id: "dalf_c2_ia_travail",
      cefr: "C2",
      domain: "Économie & Management",
      title: "Dossier DALF C2 · IA générative, travail et souveraineté européenne",
      enTitle: "DALF C2 Dossier · Generative AI, Work & European Sovereignty",
      format: "Rapport stratégique / Éditorial de synthèse",
      role: "Vous êtes conseiller auprès d'un cercle de réflexion économique européen basé à Paris. À l'occasion d'un sommet réunissant dirigeants d'entreprises, syndicats et responsables académiques de Grandes Écoles, on vous charge de rédiger une note de synthèse et de prise de position (700 mots minimum).",
      task: "En vous appuyant rigoureusement sur l'ensemble des quatre documents du dossier (sans les paraphraser ni les juxtaposer artificiellement), rédigez un texte structuré d'au moins 700 mots analysant les promesses économiques de l'IA générative, ses risques sur la qualification humaine et le dilemme réglementaire européen, puis défendez une feuille de route réaliste pour les entreprises et les formations supérieures.",
      minWords: 700,
      docs: [
        {
          id: "doc1",
          tag: "Document 1 · Éditorial",
          title: "L'illusion de la productivité sans coût humain",
          source: "Le Monde Économie · Tribune de la rédaction",
          text: "À entendre les promesses répétées des géants numériques et de certains cabinets de conseil, l'intelligence artificielle générative ouvrirait enfin l'ère d'une abondance indolore : les tâches ingrates disparaîtraient comme par enchantement, tandis que chaque salarié se verrait promu stratège créatif. Force est pourtant de constater que cette fable technophile résiste mal à l'observation concrète des entreprises qui ont déployé ces outils à marche forcée depuis deux ans. Ce qui s'érode en premier lieu, ce n'est pas le travail subalterne, mais l'échelle silencieuse de l'apprentissage professionnel.\n\nDans la finance, le droit, l'audit ou le conseil en management, les jeunes diplômés ont longtemps appris leur métier en rédigeant des synthèses intermédiaires, en vérifiant des annexes comptables ou en préparant des premières versions imparfaites relues par un associé. Or, dès lors qu'un modèle statistique produit en trente secondes une note propre en apparence, la tentation est immense de réduire les effectifs juniors ou de confiner les recrues à un rôle de simple vérificateur. Le paradoxe est redoutable : comment former demain des experts capables de déceler les erreurs subtiles d'un algorithme si l'on supprime aujourd'hui les années de pratique qui forgent précisément le jugement critique ?\n\nÀ ce risque de dessèchement des compétences s'ajoute une transformation plus discrète de l'intensité du travail. Loin de libérer du temps pour la réflexion de fond, l'accélération algorithmique conduit fréquemment à relever les attentes de cadence : un analyste qui remettait deux études par semaine se voit désormais sommé d'en livrer six, au prix d'une fatigue cognitive accrue et d'une uniformisation préoccupante des raisonnements. Lorsque tous les acteurs d'un secteur interrogent les mêmes modèles entraînés sur les mêmes corpus anglo-saxons, la singularité stratégique tend à se dissoudre dans une prose lisse, interchangeable et dépourvue de véritable prise de risque intellectuelle.\n\nEnfin, la question du partage de la valeur demeure largement esquivée. Si l'automatisation cognitive accroît effectivement les marges de quelques groupes déjà dominants, rien ne garantit spontanément que ces gains irriguent les salaires ou financent la reconversion des métiers fragilisés, en particulier dans les services administratifs, la traduction ou le support client. Sans dialogue social renouvelé ni droit de regard des représentants du personnel sur le déploiement des algorithmes managériaux, l'IA risque moins d'émanciper le travail que d'en accentuer la polarisation entre une minorité d'architectes très rémunérés et une masse de superviseurs interchangeables. Refuser cette pente ne relève nullement d'un archaïsme technophobe : c'est au contraire la condition pour que le progrès technique demeure au service d'une économie véritablement humaine.\n\nDans plusieurs grandes entreprises européennes, les observateurs constatent déjà un phénomène d'autocensure silencieuse chez les jeunes cadres : craignant de paraître moins rapides que l'outil, ils hésitent à contester une recommandation générée par le modèle interne, quand bien même leur intuition de terrain leur signalerait une anomalie. Cette déférence envers la machine, que les psychologues du travail nomment « biais d'automatisation », fragilise la responsabilité individuelle et dilue la chaîne de décision. Préserver des espaces de réflexion lente, de contradiction collégiale et d'apprentissage encadré n'est donc pas un luxe nostalgique : c'est le socle même de la fiabilité stratégique."
        },
        {
          id: "doc2",
          tag: "Document 2 · Rapport institutionnel",
          title: "L'IA, levier incontournable face au déclin démographique européen",
          source: "Note du Conseil d'Analyse Économique (CAE) & France Stratégie",
          text: "Débattre de l'intelligence artificielle en Europe sans tenir compte de la trajectoire démographique du continent reviendrait à ignorer l'éléphant dans la pièce. D'ici 2040, la population en âge de travailler au sein de l'Union européenne devrait diminuer de près de deux millions de personnes par an, tandis que les dépenses liées au vieillissement — retraites, santé, dépendance — pèseront toujours plus lourdement sur les finances publiques. Dans un tel contexte, renoncer aux gains de productivité permis par l'automatisation intelligente ne protégerait pas le modèle social européen : cela en précipiterait au contraire l'asphyxie budgétaire.\n\nLes premières études économétriques menées auprès de PME industrielles et d'administrations françaises nuancent d'ailleurs fortement le scénario catastrophiste d'une destruction massive d'emplois. Dans près de sept cas sur dix, l'intégration d'assistants génératifs agit davantage comme un facteur de complémentarité que de substitution brute. Surtout, un phénomène contre-intuitif apparaît : les gains de qualité et de rapidité profitent proportionnellement le plus aux travailleurs intermédiaires et aux petites structures, qui accèdent soudainement à des capacités d'analyse juridique, de codage ou de prospection internationale autrefois réservées aux multinationales dotées d'équipes pléthoriques.\n\nSur le plan macroéconomique, l'enjeu majeur pour la France et ses partenaires n'est pas l'excès d'adoption, mais bien le retard d'investissement. Alors que les entreprises nord-américaines consacrent plus de trois fois plus de capitaux par salarié au déploiement d'infrastructures de calcul et de modèles propriétaires, l'écosystème européen peine encore à transformer son excellence mathématique en champions commerciaux de taille critique. La France dispose pourtant d'atouts enviables : une électricité abondante et décarbonée grâce au parc nucléaire — avantage décisif pour héberger des centres de données sobres en carbone —, des laboratoires de recherche de premier plan et l'émergence d'acteurs européens crédibles dans les modèles ouverts.\n\nEncore faut-il accompagner cette mutation par une politique massive de formation continue. Les économistes du Conseil soulignent que la compétitivité future reposera moins sur l'interdiction préventive des usages que sur la capacité des entreprises à réinvestir une part des gains de productivité dans la montée en qualification de leurs salariés. Flécher la commande publique vers des solutions souveraines européennes, simplifier l'accès au capital-risque pour les jeunes pousses et généraliser des comptes de formation dédiés aux métiers en transition : telles sont les conditions concrètes pour transformer la vague de l'IA en instrument de réindustrialisation plutôt qu'en nouvelle dépendance stratégique.\n\nLes projections sectorielles annexées au rapport montrent enfin que les services publics eux-mêmes — hôpitaux, justice, collectivités territoriales — pourraient tirer un bénéfice considérable d'outils d'aide à la synthèse administrative hébergés en Europe. En réduisant de trente pour cent le temps consacré par les médecins ou les greffiers à la saisie répétitive, l'automatisation bien encadrée rendrait au contraire du temps humain au soin, à l'écoute et à l'accompagnement des citoyens. Loin de déshumaniser l'action publique, l'outil numérique pourrait ainsi réconcilier efficacité budgétaire et qualité relationnelle, pourvu que la gouvernance des données demeure strictement publique et transparente."
        },
        {
          id: "doc3",
          tag: "Document 3 · Entretien académique",
          title: "« Former des esprits critiques, pas des presse-boutons »",
          source: "Entretien avec Claire Delmas, directrice académique en Grande École (Cergy / Paris)",
          text: "Question — L'arrivée de l'IA générative a-t-elle bouleversé la pédagogie au sein des Grandes Écoles de management françaises ?\n\nClaire Delmas — Profondément, et bien plus vite que nous ne l'imaginions. Pendant des décennies, notre enseignement s'est appuyé sur des devoirs écrits réalisés à domicile : études de cas, notes de lecture, mémoires de recherche. En quelques mois, nous avons compris qu'interdire purement et simplement ces outils était une illusion totale, doublée d'une erreur professionnelle : nos diplômés utiliseront l'IA dès leur premier jour à La Défense, à Lyon ou à Singapour. En revanche, laisser un étudiant sous-traiter sa pensée à une machine reviendrait à vider le diplôme de sa substance.\n\nQuestion — Comment distingue-t-on désormais un véritable travail intellectuel d'une production automatisée ?\n\nClaire Delmas — Nous avons déplacé le centre de gravité de l'évaluation vers deux exercices que l'algorithme ne peut pas accomplir à la place de l'humain : la soutenance orale contradictoire et la confrontation à des données contradictoires de terrain. Dans nos séminaires, un étudiant peut parfaitement mobiliser un modèle pour explorer des hypothèses préliminaires, à condition d'en documenter l'usage et d'en critiquer les angles morts. Mais devant le jury, sans écran, il doit défendre sa thèse sous le feu des objections, justifier ses arbitrages éthiques et prouver qu'il maîtrise les nuances culturelles de ses interlocuteurs.\n\nQuestion — Observez-vous une inégalité face à ces nouveaux outils, notamment parmi les étudiants internationaux ?\n\nClaire Delmas — C'est une observation fascinante. Pour des étudiants brillants venus d'Inde, d'Afrique ou d'Amérique latine qui perfectionnent leur français professionnel, l'IA peut être un formidable tuteur de reformulation — ou au contraire une béquille dangereuse. Ceux qui réussissent le mieux dans les cabinets et les directions stratégiques françaises sont précisément ceux qui refusent la facilité du copier-coller : ils s'entraînent à penser directement en français, à structurer un plan rigoureux et à assumer une voix personnelle. Au fond, plus la machine écrit de manière fluide, plus la valeur marchande se déplace vers l'incarnation, l'écoute fine, le courage managérial et la clarté de parole en direct.\n\nQuestion — Quel conseil donneriez-vous à un jeune diplômé qui entre sur le marché européen cette année ?\n\nClaire Delmas — Ne rivalisez jamais avec un algorithme sur la vitesse de compilation : vous perdrez toujours. Cultivez ce qui résiste à la statistique : la formulation de bonnes questions, la compréhension des non-dits humains, l'esprit de synthèse sous pression et l'intégrité du jugement. C'est ce socle humaniste qui fera la différence au cours des trente prochaines années.\n\nQuestion — Pensez-vous que les entreprises partenaires des Grandes Écoles partagent cette exigence humaniste lors du recrutement ?\n\nClaire Delmas — De plus en plus, oui ! Lors de nos comités d'orientation avec des associés de cabinets et des dirigeants industriels de La Défense, le constat est unanime : ils ne manquent pas de candidats capables de rédiger une requête rapide sur un outil génératif, mais ils peinent à trouver des jeunes professionnels capables de hiérarchiser des priorités ambiguës, d'assumer un désaccord courtois avec un client et de prendre la parole avec clarté sans lire un écran. C'est pourquoi l'exigence de langue, de culture générale et de débat contradictoire revient aujourd'hui en force au sommet des critères d'embauche."
        },
        {
          id: "doc4",
          tag: "Document 4 · Contrepoint juridique & géopolitique",
          title: "Réguler sans brider : le pari risqué de l'AI Act européen",
          source: "Les Échos · Idées & Débats, par Maître Laurent Ferrier",
          text: "En adoptant le premier grand cadre législatif mondial consacré à l'intelligence artificielle — le règlement européen dit « AI Act » —, Bruxelles a revendiqué un rôle de pionnier éthique. La philosophie du texte repose sur une approche graduée par niveaux de risque : interdiction de la notation sociale et de la surveillance biométrique de masse, obligations strictes de transparence et d'audit pour les systèmes dits « à haut risque » dans le recrutement, le crédit bancaire ou la justice, et encadrement du respect des droits d'auteur sur les données d'entraînement. Sur le papier, l'ambition force le respect : prouver qu'une démocratie peut imposer l'État de droit aux géants de la Silicon Valley.\n\nPourtant, sur le terrain économique, une inquiétude grandissante s'exprime chez les entrepreneurs européens eux-mêmes. Nombre de fondateurs de jeunes pousses redoutent que l'empilement de normes — combinant le RGPD, le Digital Services Act et désormais l'AI Act — ne crée un coût de conformité juridique aisément absorbable par les géants américains, mais écrasant pour une société innovante de cinquante ingénieurs basée à Paris, Munich ou Stockholm. Le risque est bien connu des juristes sous le nom « d'effet pervers de la barrière réglementaire » : en voulant protéger les citoyens contre les monopoles, on consolide parfois involontairement la rente des acteurs déjà installés, seuls capables d'entretenir des armées d'avocats.\n\nPar ailleurs, la promesse du fameux « effet Bruxelles » — l'idée que les normes européennes finiraient naturellement par s'imposer au reste du monde — semble aujourd'hui moins assurée qu'à l'époque du RGPD. Face à des puissances américaine et chinoise engagées dans une course géopolitique sans merci pour la suprématie technologique, l'Europe ne peut plus se contenter d'être l'arbitre vertueux d'un match joué par d'autres. Si nos règles protègent impeccablement la vie privée tout en privant nos hôpitaux, nos universités et nos industriels de modèles européens performants, nous aurons gagné la bataille morale tout en perdant notre autonomie stratégique.\n\nFaut-il pour autant céder aux sirènes de la dérégulation totale ? Certainement pas. La confiance des citoyens et des entreprises clientes constitue au contraire un véritable actif commercial : dans la santé, l'aéronautique ou la banque, personne ne souhaite confier des décisions critiques à une boîte noire incontrôlable. La voie de crête est donc exigeante mais claire : simplifier drastiquement les démarches de conformité pour les PME via des « bacs à sable réglementaires », harmoniser l'interprétation entre les vingt-sept États membres et assortir toute exigence juridique d'un soutien financier et industriel à la hauteur. La souveraineté européenne ne se décrète pas par la norme seule ; elle se construit par la capacité d'innover selon nos propres valeurs.\n\nÀ cet égard, la question des droits d'auteur et de la rémunération des créateurs — presse, éditeurs, scientifiques, artistes — offre un test grandeur nature de la crédibilité européenne. Sans accord de licence équitable garantissant le financement d'une information vérifiée et d'une recherche indépendante, les modèles de demain risqueraient de s'alimenter exclusivement de contenus synthétiques appauvris, enfermant l'économie de la connaissance dans un cercle vicieux de dégradation qualitative."
        }
      ],
      rubricPoints: [
        "Respect de la consigne & synthèse fidèle et équilibrée des 4 documents (15 pts)",
        "Problématique claire, plan dialectique structuré et prise de position argumentée (10 pts)",
        "Étendue, précision lexicale et absence d'anglicismes paresseux (10 pts)",
        "Correction morphosyntaxique (subjonctif, concordance des temps, pronoms, syntaxe complexe) (10 pts)",
        "Cohésion, connecteurs logiques C2 et maîtrise du registre soutenu (5 pts)"
      ],
      keyConcepts: [
        "érosion de l'apprentissage junior",
        "complémentarité vs substitution",
        "déclin démographique européen",
        "souveraineté technologique et énergétique",
        "soutenance orale et esprit critique",
        "AI Act et coût de conformité des PME",
        "dialogue social et partage de la valeur",
        "bacs à sable réglementaires et formation continue"
      ]
    },
    {
      id: "dalf_c2_ecologie_justice",
      cefr: "C2",
      domain: "Société & Politiques Publiques",
      title: "Dossier DALF C2 · Transition écologique, sobriété et justice sociale en France",
      enTitle: "DALF C2 Dossier · Ecological Transition, Sufficiency & Social Justice in France",
      format: "Article de fond / Discours devant une convention citoyenne",
      role: "Vous êtes invité(e) à rédiger une grande tribune de synthèse et de proposition (700 mots minimum) pour une revue française d'idées consacrée à la soutenabilité sociale de la transition climatique en France.",
      task: "En synthétisant avec rigueur les tensions exposées dans les quatre documents du dossier, rédigez un texte argumenté d'au moins 700 mots examinant comment la France peut accélérer sa décarbonation sans fracturer sa cohésion territoriale et sociale, en articulant sobriété, innovation industrielle et justice fiscale.",
      minWords: 700,
      docs: [
        {
          id: "doc1",
          tag: "Document 1 · Enquête sociologique",
          title: "Entre métropoles décarbonées et France périurbaine : la fracture des mobilités",
          source: "Alternatives Économiques · Dossier Territoires",
          text: "En France, la question climatique ne se heurte plus guère au déni scientifique : plus de huit citoyens sur dix reconnaissent l'urgence du réchauffement et subissent déjà ses manifestations concrètes, des canicules estivales aux inondations hivernales. Ce qui cristallise désormais les colères, c'est le sentiment profond d'une écologie à deux vitesses. Depuis le mouvement des Gilets jaunes jusqu'aux débats houleux autour des Zones à Faibles Émissions (ZFE) dans les grandes agglomérations, un même clivage réapparaît avec insistance : celui qui oppose les centres métropolitains denses, maillés par le métro, le RER et les pistes cyclables, aux couronnes périurbaines et aux territoires ruraux où la voiture individuelle demeure un outil de survie quotidienne.\n\nDans les départements de la grande couronne francilienne comme dans les villes moyennes de province, la dépendance automobile ne résulte nullement d'un caprice consumériste : elle est le produit direct de quarante années d'étalement urbain, de hausse des prix immobiliers dans les centres-villes et de fermeture progressive de services publics de proximité. Lorsqu'un foyer modeste contraint d'habiter à trente kilomètres de son lieu de travail se voit interdire l'accès à l'agglomération avec son véhicule diesel de douze ans — faute de moyens pour acquérir un modèle électrique même subventionné —, la norme environnementale est vécue non comme une protection, mais comme une relégation sociale.\n\nLes sociologues soulignent un second facteur de crispation, tout aussi décisif : l'exemplarité perçue des plus aisés. Les ménages appartenant aux dix pour cent les plus riches émettent en moyenne près de cinq fois plus de gaz à effet de serre que les plus modestes, principalement en raison des vols long-courriers, des résidences secondaires et des véhicules lourds. Dès lors, toute mesure uniformément punitive — qu'il s'agisse d'une taxe carbone non redistribuée ou d'une hausse indifférenciée de la fiscalité énergétique — frappe proportionnellement beaucoup plus durement les budgets contraints et alimente un rejet politique massif.\n\nPourtant, les expériences réussies dans plusieurs intercommunalités montrent que le blocage n'est pas une fatalité. Là où le déploiement de transports collectifs fiables, de cars express cadencés, de leasing social pour les véhicules électriques légers et d'aides à la rénovation thermique réellement accessibles précède la contrainte, l'adhésion citoyenne progresse spectaculairement. L'écologie ne deviendra majoritaire en France qu'à une condition limpide : prouver concrètement qu'elle allège les factures et améliore la vie quotidienne des classes populaires et moyennes avant de leur imposer de nouveaux interdits.\n\nEncore faut-il associer directement les habitants à la conception de ces solutions locales plutôt que de les décider depuis des ministères parisiens jugés lointains. Les conventions citoyennes locales menées dans plusieurs régions ont démontré qu'informés de manière transparente sur les contraintes budgétaires et climatiques, les citoyens proposent souvent des mesures plus ambitieuses — et nettement mieux acceptées — que les décrets descendants. La confiance territoriale constitue ainsi un levier écologique tout aussi décisif que le budget ou la technique : sans sentiment d'équité géographique, même la réforme la mieux intentionnée se heurte à un mur de défiance."
        },
        {
          id: "doc2",
          tag: "Document 2 · Rapport économique & fiscal",
          title: "Financer la neutralité carbone 2050 : le mur d'investissement",
          source: "Synthèse inspirée du rapport Pisani-Ferry / Mahfouz (France Stratégie)",
          text: "Atteindre la neutralité carbone à l'horizon 2050 n'est pas seulement un défi technologique ou comportemental ; c'est d'abord une équation macroéconomique d'une ampleur inédite depuis l'après-guerre. Selon les évaluations remises au gouvernement français, la décarbonation de l'économie exigera un surcroît d'investissements publics et privés d'environ soixante-six milliards d'euros par an d'ici 2030, afin de transformer simultanément les réseaux électriques, le parc immobilier — qui compte encore plusieurs millions de passoires thermiques —, les transports ferroviaires et les procédés industriels lourds comme l'acier ou le ciment.\n\nCette mobilisation intervient toutefois dans un contexte budgétaire particulièrement contraint, marqué par une dette publique supérieure à cent dix pour cent du produit intérieur brut et par la remontée des taux d'intérêt. Les économistes mettent en garde contre deux illusions symétriques. La première consisterait à croire que le marché seul, sans signal-prix ni planification publique, réorientera spontanément les capitaux vers des investissements verts de long terme dont la rentabilité immédiate reste incertaine. La seconde illusion serait de supposer que la dépense publique puisse tout absorber sans réallocation fiscale ni arbitrage transparent sur les dépenses brunes existantes.\n\nPour sortir de cette impasse sans étouffer les ménages modestes, le rapport propose plusieurs leviers complémentaires. D'une part, la suppression progressive des subventions directes et indirectes aux énergies fossiles dégagerait plusieurs milliards d'euros chaque année. D'autre part, la création d'un prélèvement exceptionnel et temporaire sur le patrimoine financier des ménages les plus fortunés — ou une fiscalité ciblée sur les actifs fortement carbonés — permettrait de renforcer l'acceptabilité démocratique de l'effort collectif. Enfin, les auteurs insistent sur le mécanisme du « dividende climat » : si une fiscalité carbone est réintroduite à l'échelle européenne sur les carburants et le chauffage, l'intégralité des recettes doit être reversée sous forme de chèque vert progressif aux ménages modestes et intermédiaires, de sorte que les deux tiers des foyers y gagnent financièrement.\n\nReste un impératif d'efficacité administrative : les aides actuelles à la rénovation énergétique des logements souffrent d'une complexité décourageante et de restes à charge trop élevés pour les propriétaires occupants modestes. Simplifier le guichet unique, préfinancer intégralement les travaux pour les ménages précaires et former des dizaines de milliers d'artisans qualifiés constituent autant de préalables sans lesquels le mur d'investissement se heurtera à un mur d'exécution.\n\nParallèlement, les économistes rappellent que le coût de l'inaction est systématiquement sous-estimé dans les débats budgétaires annuels. Sécheresses agricoles, retrait-gonflement des argiles fissurant des centaines de milliers de pavillons, hausse rapide des primes d'assurance habitation et pertes de productivité lors des vagues de chaleur pèsent déjà plusieurs milliards d'euros chaque année sur la collectivité. Différer les investissements de décarbonation au nom de la rigueur comptable à court terme reviendrait en réalité à contracter une dette écologique et financière infiniment plus lourde pour les générations futures."
        },
        {
          id: "doc3",
          tag: "Document 3 · Essai philosophique",
          title: "La sobriété n'est pas l'austérité : réinventer le désir collectif",
          source: "Revue Esprit · Essais & Culture",
          text: "Peu de mots du débat public contemporain suscitent autant de malentendus que celui de « sobriété ». Pour ses détracteurs, il évoquerait immédiatement le rationnement, la bougie, la tristesse punitive et le recul du confort moderne. À l'inverse, pour des millions de ménages déjà confrontés à l'inflation alimentaire et énergétique, prôner la sobriété peut sonner comme une indécence : on ne choisit pas d'être sobre lorsque l'on subit déjà la privation au quotidien. Lever cette confusion sémantique est donc indispensable : la sobriété n'est pas l'austérité subie, elle est la modération choisie et partagée dans ce qui est superflu afin de préserver ce qui est essentiel.\n\nDepuis les Trente Glorieuses, nos sociétés ont étroitement confondu la qualité de vie avec l'accumulation matérielle illimitée : véhicules toujours plus lourds, renouvellement accéléré des appareils numériques, mode jetable produite à l'autre bout de la planète. Or, de nombreuses enquêtes montrent qu'au-delà d'un seuil de sécurité matérielle digne, l'hyperconsommation ne produit plus guère de bonheur durable, tandis qu'elle dévore le temps libre, fragilise le lien social et épuise les limites planétaires. Repenser la sobriété, c'est déplacer notre imaginaire de la réussite : valoriser la réparabilité plutôt que l'obsolescence, la qualité durable plutôt que la quantité jetable, les biens communs — bibliothèques, parcs, trains, espaces culturels — plutôt que la privatisation anxieuse de chaque objet.\n\nCette transformation culturelle ne saurait toutefois reposer sur la seule vertu individuelle ou sur la culpabilisation morale des consommateurs. Demander à chacun de « faire sa part » tout en laissant la publicité saturer l'espace urbain d'incitations à l'achat compulsif et en vendant le billet d'avion moins cher que le billet de train crée une dissonance insupportable. La sobriété devient désirable lorsqu'elle est organisée collectivement par des règles justes : garantie légale de durabilité allongée, bonus réparation financé par les fabricants, urbanisme à taille humaine où l'école, les commerces et le travail redeviennent accessibles en quinze minutes.\n\nEn définitive, l'enjeu le plus profond de la transition écologique est peut-être moins technique que culturel. Tant que la sobriété apparaîtra comme une perte de statut social, elle rencontrera une résistance farouche. Le jour où elle incarnera l'élégance, l'autonomie, la maîtrise de son temps et le soin porté aux lieux que nous habitons, elle cessera d'être perçue comme un sacrifice pour devenir un projet de civilisation.\n\nCe déplacement du regard se lit déjà dans l'essor d'une nouvelle génération de jeunes actifs et d'étudiants qui redéfinissent la réussite au-delà de la seule accumulation d'objets : priorité donnée à la qualité de l'alimentation locale, aux voyages ferroviaires, au réemploi des équipements numériques et à la recherche de sens dans le travail. Loin d'être un repli triste, cette culture de la mesure choisie renoue avec une tradition humaniste ancienne qui mesure la richesse d'une société non à la vitesse à laquelle elle épuise ses ressources, mais à la durée et à la beauté de ce qu'elle transmet."
        },
        {
          id: "doc4",
          tag: "Document 4 · Contrepoint industriel",
          title: "Croissance verte et innovation : pourquoi la décroissance serait une impasse géopolitique",
          source: "La Tribune · Chronique Industrielle",
          text: "À force d'opposer frontalement écologie et économie, une partie du débat intellectuel français en vient à présenter la décroissance du PIB comme l'unique horizon vertueux. Cette posture séduit par sa radicalité morale, mais elle méconnaît gravement deux réalités incontournables : les besoins matériels du modèle social français et les rapports de force géopolitiques du vingt-et-unième siècle. Une société qui organise délibérément la contraction de sa richesse nationale ne verrait pas surgir spontanément la fraternité ; elle s'exposerait à une lutte féroce pour le partage d'un gâteau rétréci, mettant en péril le financement de l'hôpital public, de l'université et de la recherche.\n\nPar ailleurs, la décarbonation elle-même est intensément industrielle. Construire des lignes ferroviaires à grande vitesse, moderniser le réseau électrique, déployer de nouveaux réacteurs nucléaires de génération récente, produire des pompes à chaleur, des batteries recyclables et de l'hydrogène bas-carbone exige des ingénieurs, des usines, des brevets et une croissance ciblée des filières propres. La France jouit à cet égard d'un atout considérable mais trop souvent sous-estimé : grâce à son mix électrique composé à plus de quatre-vingt-dix pour cent de nucléaire et de renouvelables, une usine implantée en France émet déjà beaucoup moins de dioxyde de carbone que son équivalente alimentée au charbon en Asie ou même dans certains pays voisins.\n\nDès lors, décourager la production industrielle sur le sol européen au nom d'une sobriété mal calibrée risquerait d'aboutir à un résultat écologiquement absurde : importer davantage de produits manufacturés à forte empreinte carbone tout en détruisant nos propres emplois qualifiés et notre autonomie stratégique. C'est précisément le sens du mécanisme européen d'ajustement carbone aux frontières : protéger les industries qui investissent dans des procédés propres contre une concurrence déloyale moins-disante sur le plan climatique.\n\nL'opposition stérile entre « tout-technologique » et « tout-sobriété » doit donc être dépassée. Oui, il faut éliminer les gaspillages manifestes et réduire notre empreinte matérielle par unité de valeur créée ; mais prétendre résoudre la crise climatique sans innovation scientifique, sans réindustrialisation bas-carbone et sans vitalité économique relève d'une chimère dangereuse. Seule une Europe prospère, souveraine et technologiquement ambitieuse aura les moyens financiers de protéger ses citoyens les plus vulnérables et d'entraîner le reste du monde vers la neutralité climatique.\n\nSur la scène internationale, cette crédibilité industrielle revêt enfin une dimension diplomatique capitale. Les grands pays émergents — de l'Inde au Brésil — n'adopteront jamais un modèle fondé sur la contraction volontaire du niveau de vie, alors même que des centaines de millions d'habitants aspirent légitimement à sortir de la précarité énergétique. En revanche, démontrer qu'une économie avancée peut conjuguer prospérité industrielle, électricité décarbonée, technologies sobres exportables et protection sociale robuste offrirait au monde entier un modèle désirable, reproductible et politiquement tenable."
        }
      ],
      rubricPoints: [
        "Respect de la consigne & synthèse fidèle et équilibrée des 4 documents (15 pts)",
        "Problématique claire, plan dialectique structuré et prise de position argumentée (10 pts)",
        "Étendue, précision lexicale et maîtrise des concepts économiques/sociaux (10 pts)",
        "Correction morphosyntaxique (subjonctif, concordance, pronoms, syntaxe complexe) (10 pts)",
        "Cohésion, connecteurs logiques C2 et registre soutenu (5 pts)"
      ],
      keyConcepts: [
        "fracture territoriale métropoles vs périurbain (ZFE)",
        "inégalités d'émissions et acceptabilité sociale",
        "66 milliards/an d'investissements et passoires thermiques",
        "dividende climat redistributif et fiscalité juste",
        "sobriété choisie vs austérité subie",
        "biens communs et réparabilité",
        "mix électrique décarboné et réindustrialisation verte",
        "mécanisme d'ajustement carbone aux frontières"
      ]
    }
  ];

  // ============================================================================
  // 2 LAYER-B FAIL-SAFE MULTI-SPEAKER RADIO DEBATES + LIVE ADVERSARIAL JURY
  // ============================================================================
  const debates = [
    {
      id: "debate_c2_ia",
      cefr: "C2",
      title: "Radio Débat C2 · L'IA va-t-elle vider les métiers intellectuels de leur sens ?",
      enTitle: "C2 Radio Debate · Will AI Hollow Out Knowledge Work?",
      durationLabel: "~10 min · Débat à 3 voix + Prise de notes",
      speakers: [
        { name: "Claire Martin (Animatrice France Culture)", pitch: 1.05, rate: 1.04 },
        { name: "Marc-Antoine Delacroix (Économiste & Investisseur)", pitch: 0.88, rate: 1.08 },
        { name: "Dr. Sophie Vasseur (Sociologue du travail)", pitch: 1.14, rate: 1.06 }
      ],
      segments: [
        {
          sp: "Claire Martin (Animatrice France Culture)",
          text: "Bonsoir à tous, bienvenue dans « Esprits Libres » sur Radio Lumière. Ce soir, une question qui agite autant les tours de La Défense que les amphithéâtres des Grandes Écoles : l'intelligence artificielle générative est-elle en train de libérer les métiers intellectuels, ou au contraire de les vider de leur substance ? Pour en débattre, Marc-Antoine Delacroix, économiste, et Sophie Vasseur, sociologue du travail. Sophie, vous tirez la sonnette d'alarme…"
        },
        {
          sp: "Dr. Sophie Vasseur (Sociologue du travail)",
          text: "Oui, enfin, soyons très précis : je ne suis pas contre la technique par principe, loin de là ! Ce qui m'inquiète dans nos enquêtes de terrain à Paris et à Lyon, c'est qu'on est en train de scier la branche sur laquelle reposait toute la transmission professionnelle. Avant, un jeune juriste ou un jeune consultant apprenait son métier en rédigeant des notes, en tâtonnant, en se faisant corriger. Aujourd'hui, la machine sort un premier jet en dix secondes… et les cabinets recrutent déjà moins de juniors."
        },
        {
          sp: "Marc-Antoine Delacroix (Économiste & Investisseur)",
          text: "Attendez, attendez Sophie, je vous arrête tout de suite ! On a entendu exactement le même discours à l'arrivée du tableur Excel dans les années quatre-vingts, puis d'Internet dans les années quatre-vingt-dix ! Est-ce que les métiers de la finance ont disparu ? Pas du tout : ils se sont déplacés vers l'analyse stratégique. Et puis, regardons la réalité démographique de l'Europe : on manque de bras et de cerveaux dans les dix ans qui viennent !"
        },
        {
          sp: "Dr. Sophie Vasseur (Sociologue du travail)",
          text: "Mais enfin Marc-Antoine, ne comparons pas Excel avec un système qui rédige un argumentaire entier à votre place ! Excel faisait un calcul ; là, c'est le raisonnement lui-même qu'on externalise. J'ai interviewé la semaine dernière un jeune diplômé d'école de commerce qui m'avouait : « On me demande de relire six dossiers par jour générés par l'IA, je n'ai plus le temps de comprendre un seul client en profondeur. » C'est ça que j'appelle l'appauvrissement cognitif."
        },
        {
          sp: "Claire Martin (Animatrice France Culture)",
          text: "Marc-Antoine, vous reconnaissez tout de même ce risque d'uniformisation et de perte de sens chez les jeunes recrues ?"
        },
        {
          sp: "Marc-Antoine Delacroix (Économiste & Investisseur)",
          text: "Écoutez, bien sûr que si une entreprise utilise l'IA uniquement pour presser ses équipes comme des citrons, c'est une faute managériale majeure ! Je vous le concède volontiers. En revanche, regardez ce qui se passe dans les PME françaises : grâce à ces outils, une petite boîte industrielle en région peut désormais répondre à un appel d'offres international en trois langues et rivaliser avec un géant allemand ou américain. L'IA est aussi un formidable égalisateur de chances !"
        },
        {
          sp: "Dr. Sophie Vasseur (Sociologue du travail)",
          text: "Un égalisateur… à condition que la valeur créée ne soit pas captée à quatre-vingt-dix pour cent par trois plateformes californiennes ! Parce que là encore, on touche à la souveraineté européenne. Si toutes nos PME deviennent dépendantes d'abonnements américains qui augmentent leurs tarifs dès que la concurrence disparaît, où est le gain de liberté ?"
        },
        {
          sp: "Claire Martin (Animatrice France Culture)",
          text: "Justement, parlons de la régulation européenne : l'AI Act est-il un bouclier protecteur indispensable ou un boulet qui ralentit nos start-ups face aux États-Unis et à la Chine ?"
        },
        {
          sp: "Marc-Antoine Delacroix (Économiste & Investisseur)",
          text: "Disons-le franchement : sur le principe éthique, l'Europe a raison d'interdire la surveillance de masse. Mais dans les faits, quand vous dirigez une jeune pousse de trente ingénieurs à Paris, la paperasse réglementaire vous coûte des mois précieux, pendant que vos concurrents américains lèvent des milliards sans attendre. Il faut absolument des bacs à sable réglementaires et de la commande publique européenne pour nos propres champions !"
        },
        {
          sp: "Dr. Sophie Vasseur (Sociologue du travail)",
          text: "Sur la commande publique européenne, je vous rejoins totalement ! Mais ne cédons pas au chantage à la dérégulation : la confiance est un avantage compétitif. Et surtout, réformons nos universités et nos Grandes Écoles dès maintenant : remettons l'oral contradictoire, la vérification critique et le droit à la lenteur analytique au cœur de la formation."
        },
        {
          sp: "Marc-Antoine Delacroix (Économiste & Investisseur)",
          text: "Là-dessus nous sommes d'accord : l'avenir appartient à ceux qui savent poser les questions que la machine ne devine pas, défendre une conviction en direct et piloter l'outil sans jamais s'y soumettre."
        },
        {
          sp: "Claire Martin (Animatrice France Culture)",
          text: "Merci infiniment à tous les deux pour cet échange passionnant. C'est désormais à vous, auditeurs et candidats, de tirer votre propre synthèse et de défendre votre thèse devant le jury !"
        }
      ],
      exposePrompt: "À partir de ce débat radiophonique et de vos connaissances, présentez un exposé structuré (objectif DALF C2 : 5–10 minutes) sur le thème : « Comment préserver l'intelligence humaine, la formation des jeunes talents et la souveraineté européenne à l'ère de l'IA générative ? » Annoncez votre problématique, un plan en deux parties et une ouverture.",
      outlineHints: [
        "Introduction : accroche actuelle, définition des enjeux, problématique précise et annonce du plan en 2 parties.",
        "Partie I : Les promesses réelles (productivité, démographie, PME) contrebalancées par le risque d'érosion de l'apprentissage junior et d'uniformisation.",
        "Partie II : Les conditions d'une maîtrise souveraine (réforme pédagogique par l'oral critique, dialogue social, AI Act pragmatique + commande publique européenne).",
        "Conclusion : synthèse concise + ouverture géopolitique ou philosophique."
      ],
      juryPersona: "Prof. Henri de Valcourt — Président de jury DALF C2 à la Sorbonne (exigeant, courtois, incisif : teste la nuance, interrompt les lieux communs, exige des exemples concrets et vérifie la maîtrise des registres).",
      juryOpenings: [
        "Merci pour votre exposé. Votre plan était clair, mais j'aimerais revenir sur un point qui m'a semblé un peu rapide : pensez-vous sincèrement que les entreprises privées accepteront de continuer à payer des juniors « pour qu'ils apprennent », si une IA fait déjà 80 % de leurs tâches gratuitement ?",
        "Intéressant. Cependant, vous défendez à la fois la régulation éthique européenne et la compétitivité des start-ups : n'y a-t-il pas là une contradiction insoluble que vous évitez de trancher ?"
      ],
      juryPushbacks: [
        "Attendez, vous citez des principes généraux, mais donnez-moi un exemple concret tiré du monde de l'entreprise ou d'une Grande École que vous connaissez.",
        "Justement, si je vous contredis frontalement : n'est-ce pas un réflexe conservateur de vouloir protéger d'anciens métiers intellectuels comme on a voulu protéger les copistes face à l'imprimerie ?",
        "Vous parlez de « souveraineté européenne », mais avec quels capitaux ? L'épargne européenne dort, alors que les fonds américains investissent massivement. Comment débloquez-vous concrètement ce verrou ?",
        "Pensez-vous que l'évaluation universitaire traditionnelle à l'écrit soit définitivement morte, ou faut-il simplement changer la nature des épreuves ?",
        "Si un dirigeant d'entreprise vous répondait que l'AI Act le pousse à délocaliser sa recherche aux États-Unis, que lui répondriez-vous les yeux dans les yeux ?",
        "Sur la question du partage de la valeur, êtes-vous favorable à une taxation des gains de productivité automatisés, ou craignez-vous qu'elle ne tue l'innovation ?",
        "Prenons du recul : dans vingt ans, quelle compétence humaine restera selon vous absolument irremplaçable dans le management ou la décision publique ?",
        "Pour conclure cet entretien, si vous deviez résumer en une phrase l'équilibre idéal entre audace technologique et vigilance humaniste, quelle serait votre formule ?"
      ]
    },
    {
      id: "debate_c2_ecologie",
      cefr: "C2",
      title: "Radio Débat C2 · Transition écologique : sobriété choisie ou pari technologique ?",
      enTitle: "C2 Radio Debate · Climate Transition: Sufficiency vs Green Tech?",
      durationLabel: "~10 min · Débat à 3 voix + Prise de notes",
      speakers: [
        { name: "Claire Martin (Animatrice France Culture)", pitch: 1.05, rate: 1.04 },
        { name: "Hélène Garnier (Sociologue des territoires)", pitch: 1.13, rate: 1.06 },
        { name: "Olivier Rocher (Directeur industriel énergie)", pitch: 0.86, rate: 1.07 }
      ],
      segments: [
        {
          sp: "Claire Martin (Animatrice France Culture)",
          text: "Bienvenue dans notre grand débat du soir consacré à la transition climatique en France. Tout le monde ou presque s'accorde sur l'objectif de neutralité carbone en 2050, mais dès qu'on aborde les moyens — zones à faibles émissions, fiscalité, sobriété ou réindustrialisation nucléaire —, le consensus éclate. Hélène Garnier, pourquoi les politiques écologiques suscitent-elles autant de résistances sur le terrain ?"
        },
        {
          sp: "Hélène Garnier (Sociologue des territoires)",
          text: "Parce qu'on a trop souvent commencé par la punition avant l'alternative ! Prenez un salarié qui vit dans la grande couronne autour de Cergy ou dans une ville moyenne : il ne prend pas sa voiture par amour du diesel, il la prend parce qu'il n'y a pas de bus à six heures du matin. Quand vous lui annoncez une restriction de circulation sans lui offrir un transport fiable ou un véhicule abordable, il ressent un mépris de classe."
        },
        {
          sp: "Olivier Rocher (Directeur industriel énergie)",
          text: "Je suis entièrement d'accord avec vous sur l'injustice des interdits sans alternatives, Hélène ! Mais justement, pour financer ces trains, ces pompes à chaleur et ces voitures électriques européennes à prix abordable, il faut une économie qui crée de la richesse ! Ce qui m'alarme dans le discours de la décroissance, c'est qu'on prétend décarboner tout en sabordant notre base industrielle."
        },
        {
          sp: "Hélène Garnier (Sociologue des territoires)",
          text: "Doucement, Olivier, ne caricaturons pas ! Parler de sobriété choisie, ce n'est pas vouloir retourner à la lampe à huile ! C'est simplement constater qu'on ne remplacera pas quarante millions de voitures thermiques par quarante millions de SUV électriques de deux tonnes sans piller les ressources minières de la planète. L'innovation technique ne suffira jamais si l'on ne modère pas la taille des véhicules et le gaspillage."
        },
        {
          sp: "Olivier Rocher (Directeur industriel énergie)",
          text: "Sur les véhicules surdimensionnés, je vous donne raison sans hésiter : encourager des citadines électriques légères fabriquées en France a infiniment plus de sens. Mais regardez notre atout maître : grâce au nucléaire et aux renouvelables, l'électricité française est déjà décarbonée à plus de quatre-vingt-dix pour cent. Si nous relocalisons des usines propres en France plutôt que d'importer de Chine, nous réduisons l'empreinte carbone mondiale tout en créant des emplois qualifiés !"
        },
        {
          sp: "Claire Martin (Animatrice France Culture)",
          text: "Reste la question qui fâche : qui paie les soixante-six milliards d'euros d'investissements supplémentaires estimés chaque année d'ici 2030 ?"
        },
        {
          sp: "Hélène Garnier (Sociologue des territoires)",
          text: "C'est là que la justice fiscale devient la clé de voûte démocratique. Si les ménages les plus aisés, dont l'empreinte carbone est cinq fois supérieure à celle des ménages modestes, contribuent davantage — par exemple sur le patrimoine financier carboné ou l'aviation privée — et si les recettes d'une fiscalité carbone sont redistribuées en dividende climat aux classes populaires et moyennes, alors la transition devient une mesure de pouvoir d'achat !"
        },
        {
          sp: "Olivier Rocher (Directeur industriel énergie)",
          text: "À condition toutefois de ne pas alourdir les impôts de production qui font fuir les usines hors d'Europe ! En revanche, un mécanisme d'ajustement carbone aux frontières efficace, combiné à un fléchage massif de l'épargne européenne vers les infrastructures vertes et la rénovation thermique, voilà un financement solide et crédible."
        },
        {
          sp: "Hélène Garnier (Sociologue des territoires)",
          text: "Encore faut-il que les aides à la rénovation thermique cessent d'être un labyrinthe bureaucratique ! Aujourd'hui, beaucoup de propriétaires modestes abandonnent leurs travaux à cause des formulaires et du reste à charge."
        },
        {
          sp: "Olivier Rocher (Directeur industriel énergie)",
          text: "Entièrement d'accord : simplicité administrative, guichet unique et formation de dizaines de milliers d'artisans. Sans exécution concrète sur le terrain, les grands rapports restent lettre morte."
        },
        {
          sp: "Claire Martin (Animatrice France Culture)",
          text: "En somme, loin d'opposer stérilement sobriété et innovation, nos deux invités convergent sur la nécessité d'une écologie à la fois industrielle, pragmatique et socialement juste. À vous désormais de prendre la parole devant le jury !"
        }
      ],
      exposePrompt: "À partir de ce débat radiophonique, présentez un exposé structuré (objectif DALF C2 : 5–10 minutes) répondant à la question : « À quelles conditions la transition écologique peut-elle devenir un projet socialement juste et économiquement souverain en France ? »",
      outlineHints: [
        "Introduction : constat du consensus climatique vs fractures sociales (ZFE, périurbain), problématique et annonce du plan.",
        "Partie I : Articuler sobriété choisie et justice sociale (transports avant contraintes, dividende climat, rénovation des passoires thermiques).",
        "Partie II : Mobiliser l'atout industriel bas-carbone (électricité décarbonée, réindustrialisation verte, taxe carbone aux frontières et financement soutenable).",
        "Conclusion : dépassement du clivage décroissance/tout-techno + ouverture sur l'exemplarité européenne."
      ],
      juryPersona: "Mme Claire Valéry — Membre du jury DALF C2 (spécialiste des politiques publiques : incisive sur les chiffres, la justice sociale et la faisabilité politique en France).",
      juryOpenings: [
        "Merci pour cette intervention structurée. Une question directe : le fameux « dividende climat » séduit les économistes, mais les Français font-ils réellement confiance à l'État pour redistribuer intégralement une nouvelle taxe ?",
        "Vous prônez la « sobriété choisie », mais dans une économie ouverte où la publicité et la croissance restent la norme, comment convaincre une majorité d'électeurs sans recourir à la contrainte ?"
      ],
      juryPushbacks: [
        "Si un habitant d'une zone rurale vous dit qu'il n'a ni RER ni moyens d'acheter une voiture électrique même avec un bonus, quelle solution immédiate lui proposez-vous dès l'an prochain ?",
        "Vous évoquez l'atout du nucléaire français, mais nos voisins allemands et certains écologistes y restent opposés : comment bâtir une politique énergétique européenne commune malgré ce désaccord ?",
        "N'y a-t-il pas une hypocrisie européenne à décarboner nos propres usines tout en continuant d'importer massivement des biens fabriqués au charbon à l'autre bout du monde ?",
        "Avec une dette publique supérieure à 110 % du PIB, l'État français a-t-il vraiment les moyens de préfinancer la rénovation de millions de logements sans couper dans d'autres services publics ?",
        "Faut-il selon vous restreindre la publicité pour les produits très polluants, ou cela porte-t-il atteinte à la liberté d'entreprendre ?",
        "Comment répondre aux pays émergents — comme l'Inde — qui rappellent légitimement que l'Occident s'est industrialisé grâce au charbon pendant deux siècles ?",
        "Pensez-vous que l'écologie punitive ait durablement discrédité la cause climatique auprès des classes moyennes ?",
        "Pour terminer, quelle mesure unique — réaliste et immédiate — adopteriez-vous en priorité si vous dirigiez la planification écologique en France ?"
      ]
    }
  ];

  window.ESSEC_C2_PACK = {
    scenarios,
    dossiers,
    debates
  };
})();
