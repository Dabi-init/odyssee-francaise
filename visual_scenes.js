/* ============================================================================
 * L'ODYSSÉE FRANÇAISE — v27.0 · VISUAL SCENE & NON-READING SENSORY ENGINE
 * - 10 Interactive SVG Hotspot Parisian Scenes (A1 → C2, zero-English Audio Hunts)
 * - Smart Visual Scene Router (resolveVisualScene) for all steps & Chroniques
 * - Image-First Audio Reflex Pool (Voir & Entendre, A1 → C2)
 * - Tactile Left/Right Arcade Swipe Decks for EVERY CEFR level (A1 → C2)
 * ============================================================================ */
(function () {
  const VISUAL_SCENES = [
    {
      id: "boulangerie",
      cefr: "A1",
      title: "La Boulangerie de Saint-Germain",
      place: "🥖 Boulangerie Artisanale · 6e",
      bg: "assets/scene_boulangerie.webp",
      npc: "assets/npc_boulanger.webp",
      npcName: "Jean-Luc le Boulanger",
      introFr: "Bonjour ! Touchez les objets dans la boulangerie pour les entendre, puis trouvez ce que je vous demande !",
      hotspots: [
        { id: "baguette", x: 10, y: 44, fr: "La baguette tradition", spokenFr: "Une baguette tradition bien cuite, s'il vous plaît.", huntFr: "Bonjour ! Je voudrais une baguette tradition bien cuite, s'il vous plaît !", icon: "🥖" },
        { id: "croissant", x: 54, y: 60, fr: "Le croissant au beurre", spokenFr: "Un croissant au beurre tout chaud.", huntFr: "Donnez-moi un croissant au beurre bien doré, s'il vous plaît !", icon: "🥐" },
        { id: "ardoise", x: 65, y: 24, fr: "L'ardoise des prix", spokenFr: "Regardez les prix sur l'ardoise.", huntFr: "Excusez-moi, où sont affichés les prix du jour ?", icon: "📋" },
        { id: "cafe", x: 86, y: 54, fr: "La machine à espresso", spokenFr: "Un petit café allongé à emporter.", huntFr: "Vous pouvez me préparer un espresso à emporter ?", icon: "☕" },
        { id: "carte", x: 66, y: 86, fr: "Le terminal sans contact", spokenFr: "Je règle par carte sans contact.", huntFr: "Je peux payer par carte bancaire sans contact ?", icon: "💳" }
      ]
    },
    {
      id: "cafe_flore",
      cefr: "A1",
      title: "Terrasse du Café de Flore",
      place: "☕ Café de Flore · Saint-Germain",
      bg: "assets/bg_cafe.jpg",
      npc: "assets/npc_serveur.webp",
      npcName: "Henri le Serveur",
      introFr: "Bienvenue en terrasse ! Explorez la table du Flore puis répondez à la commande du serveur.",
      hotspots: [
        { id: "tasse", x: 34, y: 68, fr: "Le café crème", spokenFr: "Un café crème en terrasse.", huntFr: "Qui a commandé le café crème ce matin ?", icon: "☕" },
        { id: "carte_menu", x: 60, y: 72, fr: "La carte du café", spokenFr: "Je peux voir la carte, s'il vous plaît ?", huntFr: "Pouvez-vous me passer la carte pour choisir une boisson ?", icon: "📖" },
        { id: "terrasse", x: 22, y: 36, fr: "La terrasse au soleil", spokenFr: "On s'installe en terrasse au soleil.", huntFr: "Est-ce qu'il reste une table libre en terrasse ?", icon: "☀️" },
        { id: "addition", x: 76, y: 58, fr: "L'addition", spokenFr: "L'addition, s'il vous plaît !", huntFr: "Monsieur, nous sommes prêts à régler l'addition, s'il vous plaît !", icon: "🧾" },
        { id: "carafe", x: 48, y: 54, fr: "La carafe d'eau", spokenFr: "Une carafe d'eau fraîche, s'il vous plaît.", huntFr: "Pourriez-vous nous apporter une carafe d'eau gratuite ?", icon: "💧" }
      ]
    },
    {
      id: "marche_paris",
      cefr: "A1",
      title: "Le Marché de la Bastille",
      place: "🍎 Marché en plein air · 11e",
      bg: "assets/scene_marche_paris.webp",
      npc: "assets/npc_boulanger.webp",
      npcName: "Marc le Commerçant",
      introFr: "C'est jour de marché à Paris ! Touchez les étals pour découvrir les produits frais.",
      hotspots: [
        { id: "fromage", x: 20, y: 60, fr: "Le fromage affiné", spokenFr: "Un morceau de comté bien affiné.", huntFr: "Je vais prendre un bon morceau de fromage affiné, s'il vous plaît.", icon: "🧀" },
        { id: "tomates", x: 48, y: 64, fr: "Les tomates mûres", spokenFr: "Un kilo de tomates bien mûres.", huntFr: "Mettez-moi un kilo de tomates rouges bien mûres !", icon: "🍅" },
        { id: "pain", x: 78, y: 56, fr: "Le pain de campagne", spokenFr: "Un grand pain de campagne tranché.", huntFr: "Il vous reste du pain de campagne frais ?", icon: "🍞" },
        { id: "panier", x: 64, y: 78, fr: "Le panier en osier", spokenFr: "J'ai apporté mon panier pour les courses.", huntFr: "Où est-ce que j'ai posé mon panier en osier ?", icon: "🧺" },
        { id: "auvent", x: 50, y: 18, fr: "L'étal du marché", spokenFr: "On se retrouve devant l'étal rayé.", huntFr: "Retrouve-moi sous l'auvent rouge et blanc du marché !", icon: "🎪" }
      ]
    },
    {
      id: "coloc_10e",
      cefr: "A2",
      title: "La Coloc du Canal Saint-Martin",
      place: "🏠 Appartement Coloc · 10e",
      bg: "assets/scene_appartement_coloc.webp",
      npc: "assets/npc_yanis.webp",
      npcName: "Yanis",
      introFr: "Bienvenue dans la coloc ! Repère les objets du quotidien avant qu'on sorte au canal.",
      hotspots: [
        { id: "postit", x: 18, y: 40, fr: "Le mot sur le frigo", spokenFr: "Yanis a laissé un petit mot sur le frigo.", huntFr: "T'as lu le post-it jaune que j'ai collé sur le frigo ?", icon: "🗒️" },
        { id: "cles", x: 48, y: 68, fr: "Les clés de l'appartement", spokenFr: "N'oublie pas les clés sur la table basse !", huntFr: "Attends, t'as pris les clés de l'appartement sur la table ?", icon: "🔑" },
        { id: "cafetiere", x: 58, y: 60, fr: "La cafetière à piston", spokenFr: "J'ai préparé du café frais ce matin.", huntFr: "Tu veux une tasse ? Le café est encore chaud dans la cafetière !", icon: "☕" },
        { id: "canape", x: 80, y: 64, fr: "Le canapé du salon", spokenFr: "Pose ton sac sur le canapé.", huntFr: "Installe-toi tranquille sur le canapé deux minutes !", icon: "🛋️" },
        { id: "balcon", x: 52, y: 28, fr: "Le balcon sur les toits", spokenFr: "Ce soir, on dîne sur le balcon.", huntFr: "Viens voir la vue sur les toits de Paris depuis le balcon !", icon: "🌇" }
      ]
    },
    {
      id: "pharmacie_medecin",
      cefr: "A2",
      title: "Pharmacie & Cabinet Médical",
      place: "💊 Pharmacie de Quartier · 5e",
      bg: "assets/scene_pharmacie_medecin.webp",
      npc: "assets/npc_medecin.webp",
      npcName: "Dr. Claire Valéry",
      introFr: "Santé et urgences à Paris : touchez chaque élément essentiel d'une consultation.",
      hotspots: [
        { id: "croix", x: 16, y: 34, fr: "La croix verte de la pharmacie", spokenFr: "Cherchez la croix verte au bout de la rue.", huntFr: "Comment reconnaît-on une pharmacie ouverte en France ?", icon: "➕" },
        { id: "vitale", x: 44, y: 70, fr: "La Carte Vitale", spokenFr: "Voici ma Carte Vitale pour le remboursement.", huntFr: "Avez-vous votre Carte Vitale sur vous aujourd'hui ?", icon: "💳" },
        { id: "ordonnance", x: 58, y: 74, fr: "L'ordonnance du médecin", spokenFr: "Le médecin m'a rédigé une ordonnance.", huntFr: "Pouvez-vous me montrer l'ordonnance prescrite par votre médecin ?", icon: "📝" },
        { id: "medicaments", x: 54, y: 36, fr: "Les boîtes de médicaments", spokenFr: "Prenez ce médicament matin et soir pendant cinq jours.", huntFr: "Où sont rangés les médicaments contre le rhume ?", icon: "💊" },
        { id: "stethoscope", x: 78, y: 66, fr: "Le stéthoscope", spokenFr: "Respirez profondément, je vais vous ausculter.", huntFr: "Le docteur va écouter votre respiration avec quel instrument ?", icon: "🩺" }
      ]
    },
    {
      id: "metro_chatelet",
      cefr: "B1",
      title: "Métro Ligne 1 · Châtelet",
      place: "🚇 Quai de Châtelet · Ligne 1",
      bg: "assets/scene_metro_chatelet.webp",
      npc: "assets/npc_moreau.jpg",
      npcName: "Contrôleur Moreau",
      introFr: "Heure de pointe à Châtelet ! Repérez les repères du métro parisien sans hésiter.",
      hotspots: [
        { id: "plan", x: 24, y: 40, fr: "Le plan de la ligne 1", spokenFr: "Vérifiez la correspondance sur le plan du métro.", huntFr: "Excusez-moi, où puis-je vérifier les correspondances de la ligne 1 ?", icon: "🗺️" },
        { id: "panneau", x: 52, y: 22, fr: "L'affichage du prochain train", spokenFr: "Le panneau indique trafic fortement perturbé.", huntFr: "Regardez le panneau en haut : dans combien de minutes arrive la prochaine rame ?", icon: "📟" },
        { id: "portique", x: 80, y: 62, fr: "Le portique Navigo", spokenFr: "Validez votre passe Navigo au portique.", huntFr: "N'oubliez pas de valider votre titre de transport en passant le portique !", icon: "🎫" },
        { id: "rame", x: 28, y: 68, fr: "La rame de métro", spokenFr: "Attention à la fermeture automatique des portes !", huntFr: "Dépêche-toi, la rame vient d'entrer en station !", icon: "🚇" },
        { id: "quai", x: 56, y: 76, fr: "Le quai de correspondance", spokenFr: "Ne restez pas près de la bordure du quai.", huntFr: "Reculez légèrement sur le quai avant l'arrivée du train.", icon: "🚶" }
      ]
    },
    {
      id: "boutique_rue",
      cefr: "B1",
      title: "Rue & Boutique de la Rive Gauche",
      place: "🛍️ Rive Gauche · 6e",
      bg: "assets/scene_boutique_rue.webp",
      npc: "assets/tutor_camille.jpg",
      npcName: "Camille",
      introFr: "Averse de printemps sur la Rive Gauche : explorez la vitrine et la rue parisienne !",
      hotspots: [
        { id: "vitrine", x: 24, y: 48, fr: "La vitrine de la boutique", spokenFr: "Ce manteau en vitrine te va super bien.", huntFr: "Viens voir l'imperméable exposé dans la vitrine !", icon: "🧥" },
        { id: "parapluie", x: 38, y: 66, fr: "Le parapluie pliant", spokenFr: "Heureusement que j'ai pris un parapluie !", huntFr: "Il commence à pleuvoir des cordes, il me faut absolument un parapluie !", icon: "☂️" },
        { id: "entree_metro", x: 78, y: 42, fr: "L'entrée Art Nouveau du métro", spokenFr: "On se retrouve devant la bouche de métro.", huntFr: "Si on veut rentrer vite, où est l'entrée du métro ?", icon: "Ⓜ️" },
        { id: "paves", x: 54, y: 80, fr: "Les pavés mouillés", spokenFr: "Fais attention, les pavés glissent sous la pluie.", huntFr: "Regarde où tu marches, les pavés parisiens sont glissants !", icon: "🌧️" },
        { id: "mariniere", x: 16, y: 64, fr: "La marinière rayée", spokenFr: "J'aimerais essayer cette marinière en taille M.", huntFr: "Je cherche le pull rayé classique à la française !", icon: "👕" }
      ]
    },
    {
      id: "diner_marais",
      cefr: "B2",
      title: "Le Dîner-Débat du Marais",
      place: "🕯️ Place des Vosges · Le Marais",
      bg: "assets/scene_diner_marais.webp",
      npc: "assets/npc_celeste_galeriste.jpg",
      npcName: "Céleste Vance",
      introFr: "Soirée parisienne chez Céleste : observez les codes de la table et de la conversation.",
      hotspots: [
        { id: "verres", x: 36, y: 68, fr: "Les verres à pied (Trinquer)", spokenFr: "On se regarde toujours dans les yeux en trinquant !", huntFr: "En France, que tient-on en se regardant dans les yeux avant de boire ?", icon: "🍷" },
        { id: "plateau", x: 54, y: 74, fr: "Le plateau de fromages", spokenFr: "Le fromage se déguste toujours avant le dessert.", huntFr: "On passe au fromage avant le dessert — où est le plateau ?", icon: "🧀" },
        { id: "bougies", x: 48, y: 54, fr: "Les bougies de la table", spokenFr: "L'ambiance est chaleureuse et tamisée.", huntFr: "Qu'est-ce qui éclaire doucement toute la tablée ce soir ?", icon: "🕯️" },
        { id: "tableau", x: 24, y: 30, fr: "La toile contemporaine", spokenFr: "Cette toile suscite un débat passionné entre les invités.", huntFr: "Céleste veut vous présenter une œuvre accrochée au mur : laquelle ?", icon: "🖼️" },
        { id: "fenetre", x: 76, y: 34, fr: "Les fenêtres haussmanniennes", spokenFr: "Les toits du Marais scintillent à la tombée du soir.", huntFr: "Regardez Paris illuminé à travers les grandes fenêtres !", icon: "🌃" }
      ]
    },
    {
      id: "prefecture_banque",
      cefr: "C1",
      title: "Banque & Démarches Administratives",
      place: "🏛️ Agence & Préfecture · Paris",
      bg: "assets/scene_prefecture_banque.webp",
      npc: "assets/npc_immobilier.webp",
      npcName: "Mme Solange de Rochefort",
      introFr: "Maîtriser la bureaucratie et la négociation en France : vérifiez chaque pièce du dossier.",
      hotspots: [
        { id: "dossier", x: 34, y: 68, fr: "Le dossier complet (RIB & justificatifs)", spokenFr: "Voici mon dossier complet avec justificatif de domicile.", huntFr: "Avez-vous rassemblé l'ensemble de vos pièces justificatives dans votre dossier ?", icon: "📁" },
        { id: "passeport", x: 48, y: 74, fr: "La pièce d'identité / Passeport", spokenFr: "Permettez-moi de vous présenter mon passeport.", huntFr: "Il me faut une pièce d'identité officielle en cours de validité.", icon: "🛂" },
        { id: "ecran_file", x: 76, y: 24, fr: "L'écran de file d'attente", spokenFr: "Le numéro B42 est appelé au guichet 3.", huntFr: "Où faut-il surveiller l'appel de son ticket d'attente ?", icon: "🔢" },
        { id: "bureau", x: 64, y: 62, fr: "Le guichet de conseil", spokenFr: "J'ai rendez-vous avec ma conseillère bancaire.", huntFr: "Installez-vous au comptoir pour signer la convention.", icon: "💼" },
        { id: "salle", x: 82, y: 54, fr: "Le bureau confidentiel", spokenFr: "Pouvons-nous évoquer le contrat en toute confidentialité ?", huntFr: "Où allons-nous pour discuter des clauses confidentielles du bail ?", icon: "🚪" }
      ]
    },
    {
      id: "pont_des_arts",
      cefr: "C2",
      title: "Minuit sur le Pont des Arts",
      place: "✨ Pont des Arts & Quai de Conti",
      bg: "assets/scene_pont_des_arts.webp",
      npc: "assets/npc_immortel_c2.jpg",
      npcName: "Prof. Henri de Valcourt",
      introFr: "Sous les étoiles de Paris : chaque détail du quai de Conti porte un siècle de littérature.",
      hotspots: [
        { id: "bouquinistes", x: 20, y: 56, fr: "Les boîtes des bouquinistes", spokenFr: "On y déniche des éditions rares entre deux pages d'histoire.", huntFr: "Où flâne-t-on le long des quais pour chiner des livres anciens ?", icon: "📚" },
        { id: "reverbere", x: 40, y: 30, fr: "Le réverbère parisien", spokenFr: "Sa lueur dorée découpe les silhouettes sur les planches du pont.", huntFr: "Quelle lumière en fer forgé éclaire les promeneurs du pont la nuit ?", icon: "🏮" },
        { id: "seine", x: 54, y: 74, fr: "Les reflets de la Seine", spokenFr: "Le fleuve emporte les murmures de la Rive Gauche et de la Rive Droite.", huntFr: "Sur quoi dansent les reflets dorés des lumières de Paris ?", icon: "🌊" },
        { id: "toureiffel", x: 78, y: 32, fr: "La Tour Eiffel scintillante", spokenFr: "À minuit pile, elle scintille comme une ponctuation de lumière.", huntFr: "Quel monument s'illumine au loin dans le ciel étoilé ?", icon: "🗼" },
        { id: "passerelle", x: 50, y: 58, fr: "La passerelle des Arts", spokenFr: "Face à l'Institut de France, c'est le pont des esprits libres.", huntFr: "Où se retrouvent nos quatre amis parisiens pour fêter le niveau C2 ?", icon: "🌉" }
      ]
    }
  ];

  // Tactile Left/Right Arcade Swipe Decks — balanced across ALL 6 levels (A1 → C2)
  const SWIPE_DECKS = {
    A1: {
      title: "⚡ Arcade A1 · Genre (Le / La) & Politesse (Tu / Vous)",
      leftLabel: "⬅️ LE (Masc.) / TU (Ami)",
      rightLabel: "LA (Fém.) / VOUS (Poli) ➡️",
      cards: [
        { prompt: "___ croissant chaud", sub: "Genre à la boulangerie", side: "left", answerFr: "Le croissant", why: "Masculin : un croissant, le croissant." },
        { prompt: "___ baguette tradition", sub: "Genre à la boulangerie", side: "right", answerFr: "La baguette", why: "Féminin (-ette est presque toujours féminin) : la baguette." },
        { prompt: "___ café crème", sub: "Genre au café", side: "left", answerFr: "Le café", why: "Masculin : un café, le café." },
        { prompt: "___ carafe d'eau", sub: "Genre au restaurant", side: "right", answerFr: "La carafe", why: "Féminin : une carafe, la carafe d'eau." },
        { prompt: "Parler à un inconnu dans le métro", sub: "Tu ou Vous ?", side: "right", answerFr: "Vous (« Excusez-moi »)", why: "Avec un inconnu adulte en France, on vouvoie toujours." },
        { prompt: "Parler à Yanis, ton colocataire", sub: "Tu ou Vous ?", side: "left", answerFr: "Tu (« Salut Yanis ! »)", why: "Entre amis, étudiants ou colocataires, on tutoie !" },
        { prompt: "___ boulangerie du coin", sub: "Genre en ville", side: "right", answerFr: "La boulangerie", why: "Les commerces en -erie sont féminins : la boulangerie, la pharmacie." },
        { prompt: "___ métro parisien", sub: "Genre des transports", side: "left", answerFr: "Le métro", why: "Masculin : le métro, le bus, le train." }
      ]
    },
    A2: {
      title: "⚡ Arcade A2 · Passé Composé vs Imparfait & Avoir vs Être",
      leftLabel: "⬅️ PASSÉ COMPOSÉ / AVOIR",
      rightLabel: "IMPARFAIT / ÊTRE ➡️",
      cards: [
        { prompt: "Soudain, le téléphone ___ (sonner)", sub: "Action ponctuelle qui coupe le récit", side: "left", answerFr: "a sonné (Passé Composé)", why: "Un événement soudain et terminé = Passé Composé." },
        { prompt: "Quand j'étais petit, je ___ à Lyon (habiter)", sub: "Habitude ou décor dans le passé", side: "right", answerFr: "j'habitais (Imparfait)", why: "Habitude passée / description = Imparfait." },
        { prompt: "Hier, je ___ allé(e) au marché", sub: "Auxiliaire Avoir ou Être ?", side: "right", answerFr: "Je suis allé(e) (Être)", why: "Aller est un verbe de mouvement (DR MRS VANDERTRAMP) → Être." },
        { prompt: "J'___ pris un café avec Camille", sub: "Auxiliaire Avoir ou Être ?", side: "left", answerFr: "J'ai pris (Avoir)", why: "Prendre se conjugue avec Avoir : j'ai pris." },
        { prompt: "Il ___ beau ce matin-là (faire)", sub: "Météo / arrière-plan du récit", side: "right", answerFr: "Il faisait beau (Imparfait)", why: "La météo et le décor utilisent l'Imparfait." },
        { prompt: "Elle ___ arrivée à 19h pile", sub: "Auxiliaire Avoir ou Être ?", side: "right", answerFr: "Elle est arrivée (Être)", why: "Arriver prend Être (avec accord : arrivée)." },
        { prompt: "Tout à coup, la pluie ___ (commencer)", sub: "Événement soudain", side: "left", answerFr: "a commencé (Passé Composé)", why: "« Tout à coup » annonce un événement ponctuel → Passé Composé." },
        { prompt: "Nous ___ mangé une crêpe (manger)", sub: "Auxiliaire Avoir ou Être ?", side: "left", answerFr: "Nous avons mangé (Avoir)", why: "Manger se conjugue avec Avoir." }
      ]
    },
    B1: {
      title: "⚡ Arcade B1 · Pronoms (Y / EN) & Oral vs Formel",
      leftLabel: "⬅️ Y (Lieu / à) · ORAL",
      rightLabel: "EN (de / Quantité) · FORMEL ➡️",
      cards: [
        { prompt: "Tu vas à Paris ? — Oui, j'___ vais !", sub: "Pronom Y ou EN ?", side: "left", answerFr: "J'y vais (Y)", why: "Y remplace un lieu introduit par à / en / dans." },
        { prompt: "Tu veux du café ? — Oui, j'___ veux bien !", sub: "Pronom Y ou EN ?", side: "right", answerFr: "J'en veux bien (EN)", why: "EN remplace un partitif (du / de la / des) ou une quantité." },
        { prompt: "« Chais pas, j'suis crevé ! »", sub: "Oral de rue ou Formel ?", side: "left", answerFr: "Oral familier (Je ne sais pas, je suis fatigué)", why: "Réductions typiques du français parlé à Paris." },
        { prompt: "« Je vous prie d'agréer mes salutations »", sub: "Oral ou Formel ?", side: "right", answerFr: "Formel (E-mail / Lettre)", why: "Formule de politesse officielle en B1–C2." },
        { prompt: "Tu penses à ton projet ? — Oui, j'___ pense.", sub: "Pronom Y ou EN ?", side: "left", answerFr: "J'y pense (Y)", why: "Penser À quelque chose → Y." },
        { prompt: "Tu parles de ce film ? — Oui, j'___ parle souvent.", sub: "Pronom Y ou EN ?", side: "right", answerFr: "J'en parle (EN)", why: "Parler DE quelque chose → EN." }
      ]
    },
    B2: {
      title: "⚡ Arcade B2 · Tribunal Indicatif vs Subjonctif",
      leftLabel: "⬅️ INDICATIF (Certitude)",
      rightLabel: "SUBJONCTIF (Doute / Volonté) ➡️",
      cards: [
        { prompt: "Il faut que tu ___ (venir) à l'heure", sub: "Obligation", side: "right", answerFr: "viennes (Subjonctif)", why: "« Il faut que » exige toujours le subjonctif." },
        { prompt: "Je pense que c'___ (être) une bonne idée", sub: "Opinion affirmative", side: "left", answerFr: "est (Indicatif)", why: "« Je pense que » à l'affirmatif prend l'indicatif !" },
        { prompt: "Je ne pense pas qu'il ___ (pouvoir) venir", sub: "Opinion négative = doute", side: "right", answerFr: "puisse (Subjonctif)", why: "« Je ne pense pas que » exprime le doute → Subjonctif." },
        { prompt: "Bien qu'il ___ (pleuvoir), nous sortons", sub: "Concession", side: "right", answerFr: "pleuve (Subjonctif)", why: "« Bien que » déclenche systématiquement le subjonctif." },
        { prompt: "Je suis certain qu'elle ___ (réussir)", sub: "Certitude absolue", side: "left", answerFr: "réussira (Indicatif)", why: "La certitude (« être certain que ») gouverne l'indicatif." },
        { prompt: "Avant que la réunion ne ___ (finir)", sub: "Antériorité", side: "right", answerFr: "finisse (Subjonctif)", why: "« Avant que » prend toujours le subjonctif." }
      ]
    },
    C1: {
      title: "⚡ Arcade C1 · Alchimie des Registres (Courant vs Soutenu)",
      leftLabel: "⬅️ COURANT (Quotidien)",
      rightLabel: "SOUTENU (Comex / C1) ➡️",
      cards: [
        { prompt: "« Il n'en demeure pas moins que… »", sub: "Quel registre ?", side: "right", answerFr: "Soutenu (Concession C1)", why: "Connecteur de nuance incontournable en réunion ou synthèse C1." },
        { prompt: "« Mais quand même, c'est vrai que… »", sub: "Quel registre ?", side: "left", answerFr: "Courant parlé", why: "Naturel à l'oral, à remplacer par « néanmoins / toutefois » à l'écrit C1." },
        { prompt: "« Faute de quoi, le projet échouera. »", sub: "Quel registre ?", side: "right", answerFr: "Soutenu (= Sinon)", why: "Élégant et précis pour un rapport ou un Comex." },
        { prompt: "« Du coup, on fait quoi maintenant ? »", sub: "Quel registre ?", side: "left", answerFr: "Courant / Familier", why: "Très fréquent à Paris ; en C1 soutenu on préfère « Dès lors »." },
        { prompt: "« Il convient d'entériner cette décision. »", sub: "Quel registre ?", side: "right", answerFr: "Soutenu (= Valider officiellement)", why: "Verbe « entériner » + tournure impersonnelle « il convient de »." },
        { prompt: "« On va essayer de régler ce souci. »", sub: "Quel registre ?", side: "left", answerFr: "Courant", why: "En soutenu : « Nous nous emploierons à pallier cette difficulté. »" }
      ]
    },
    C2: {
      title: "⚡ Arcade C2 · Litote, Ironie & Esprit de l'Académie",
      leftLabel: "⬅️ SENS LITTÉRAL / NEUTRE",
      rightLabel: "LITOTE / IRONIE C2 ➡️",
      cards: [
        { prompt: "« Ce n'est pas tout à fait faux… »", sub: "Sous-entendu parisien ?", side: "right", answerFr: "Litote C2 (= C'est très juste !)", why: "Le classique « C'est pas faux » / litote pour acquiescer avec retenue." },
        { prompt: "« C'est un peu fort de café ! »", sub: "Nuance ?", side: "right", answerFr: "Ironie / Indignation élégante", why: "Signifie que la situation dépasse les bornes." },
        { prompt: "« La séance débute à quatorze heures. »", sub: "Nuance ?", side: "left", answerFr: "Énoncé neutre et factuel", why: "Pure information sans sous-entendu." },
        { prompt: "« Il ne brille pas par son audace. »", sub: "Sous-entendu ?", side: "right", answerFr: "Litote critique (= Il est très timoré)", why: "Critiquer poliment en niant la qualité opposée." },
        { prompt: "« Je ne vous le fais pas dire ! »", sub: "Nuance ?", side: "right", answerFr: "Accord emphatique ironique", why: "Signifie « Vous avez mille fois raison, c'est évident ! »." },
        { prompt: "« Le rapport comporte douze pages. »", sub: "Nuance ?", side: "left", answerFr: "Constat littéral", why: "Aucun double sens ni figure d'atténuation." }
      ]
    }
  };

  // Image-First Audio Reflex Pool (Voir & Entendre — Hear French, Tap the Right Scene!)
  const VISREFLEX_POOL = [
    { cefr: "A1", sceneId: "boulangerie", fr: "Bonjour ! Je voudrais une baguette tradition et deux croissants, s'il vous plaît.", labelFr: "🥖 À la boulangerie" },
    { cefr: "A1", sceneId: "cafe_flore", fr: "Garçon ! Un café crème et une carafe d'eau en terrasse, s'il vous plaît.", labelFr: "☕ Au Café de Flore" },
    { cefr: "A1", sceneId: "marche_paris", fr: "Mettez-moi un kilo de tomates mûres et un morceau de fromage, merci !", labelFr: "🍎 Au marché" },
    { cefr: "A2", sceneId: "coloc_10e", fr: "T'inquiète pas, j'ai laissé les clés sur la table et un mot sur le frigo !", labelFr: "🏠 À la coloc" },
    { cefr: "A2", sceneId: "pharmacie_medecin", fr: "Bonjour Docteur, voici ma Carte Vitale et l'ordonnance pour la pharmacie.", labelFr: "💊 À la pharmacie" },
    { cefr: "B1", sceneId: "metro_chatelet", fr: "En raison d'un mouvement social, le trafic est perturbé sur la ligne 1.", labelFr: "🚇 Dans le métro" },
    { cefr: "B1", sceneId: "boutique_rue", fr: "Il pleut sur les pavés ! Prends un parapluie avant de descendre au métro.", labelFr: "🛍️ Rue & Boutique" },
    { cefr: "B2", sceneId: "diner_marais", fr: "Levons nos verres ! Le plateau de fromages et ce débat sur l'art sont passionnants.", labelFr: "🕯️ Dîner du Marais" },
    { cefr: "C1", sceneId: "prefecture_banque", fr: "Voici mon dossier complet avec passeport et justificatif ; j'attends mon numéro au guichet.", labelFr: "🏛️ Banque / Préfecture" },
    { cefr: "C2", sceneId: "pont_des_arts", fr: "Quoi qu'il advienne, les bouquinistes et les reflets de la Seine à minuit restent inoubliables.", labelFr: "✨ Pont des Arts" }
  ];

  function resolveVisualScene(node, mode, st) {
    const byId = (id) => VISUAL_SCENES.find((s) => s.id === id);
    if (st && st.sceneId && byId(st.sceneId)) return byId(st.sceneId);
    const m = String(mode || "").toLowerCase();
    if (m.includes("ep1_flore")) return byId("cafe_flore");
    if (m.includes("ep2_coloc")) return byId("coloc_10e");
    if (m.includes("ep3_greve")) return byId("metro_chatelet");
    if (m.includes("ep4_marais")) return byId("diner_marais");
    if (m.includes("ep5_comex")) return byId("prefecture_banque");
    if (m.includes("ep6_nuit")) return byId("pont_des_arts");
    const hay = [
      st && st.place, st && st.title, st && st.fr, st && st.npc,
      node && node.title, node && node.id, node && node.data && node.data.id, node && node.data && node.data.title
    ].filter(Boolean).join(" ").toLowerCase();
    if (/boulanger|baguette|croissant|pain au chocolat/.test(hay)) return byId("boulangerie");
    if (/m[ée]tro|ch[âa]telet|ratp|ligne 1|ligne 4|navigo|gr[èe]ve/.test(hay)) return byId("metro_chatelet");
    if (/march[ée]|fromage|tomate|l[ée]gume|bastille/.test(hay)) return byId("marche_paris");
    if (/coloc|appartement|frigo|loyer|balcon|cl[ée]s|canal/.test(hay)) return byId("coloc_10e");
    if (/pharmac|m[ée]decin|docteur|vitale|ordonnance|cabinet|sant[ée]/.test(hay)) return byId("pharmacie_medecin");
    if (/d[îi]ner|marais|vosges|invit[ée]|table|fromage.*dessert/.test(hay)) return byId("diner_marais");
    if (/pont des arts|bouquiniste|seine|minuit|tour eiffel/.test(hay)) return byId("pont_des_arts");
    if (/banque|pr[ée]fecture|dossier|bail|immobilier|guichet|comex|d[ée]fense/.test(hay)) return byId("prefecture_banque");
    if (/boutique|parapluie|manteau|pluie|v[êe]tement|shopping|rue/.test(hay)) return byId("boutique_rue");
    if (/caf[ée]|flore|terrasse|serveur|addition|brasserie/.test(hay)) return byId("cafe_flore");
    return null;
  }

  window.VISUAL_SCENES = VISUAL_SCENES;
  window.SWIPE_DECKS = SWIPE_DECKS;
  window.VISREFLEX_POOL = VISREFLEX_POOL;
  window.resolveVisualScene = resolveVisualScene;
})();
