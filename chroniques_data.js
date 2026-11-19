/* ============================================================================
 * L'ODYSSÉE FRANÇAISE — v26.0 · LES CHRONIQUES DE PARIS (A1 → C2)
 * 6 Connected Story Episodes × 5 Living Interactive Scenes = 30 Voiced Scenes
 * Seamlessly weaves Listening, Reading, Writing (AZERTY), and Speaking
 * with zero exam-prep feel — pure living-world Paris immersion.
 * ============================================================================ */
(function () {
  window.CHRONIQUES_DE_PARIS = [
    {
      id: "ep1_flore",
      num: 1,
      cefr: "A1",
      friendId: "camille",
      friendName: "Camille",
      coverImg: "assets/bg_cafe.jpg",
      sceneId: "cafe_flore",
      npcImg: "assets/tutor_camille.jpg",
      icon: "☕",
      place: "Café de Flore · Saint-Germain-des-Prés",
      title: "Épisode 1 · Arrivée à Paris & Café de Flore",
      subEn: "Your first morning in Paris: greeting with tu/vous, reading a café SMS, typing your first reply, and ordering aloud.",
      subFr: "Votre premier matin à Paris : tutoiement/vouvoiement, SMS en terrasse, premier message écrit et commande à voix haute.",
      rewardTitle: "☕ Habitué du Café de Flore",
      scenes: [
        {
          k: "dialogue",
          place: "☕ Café de Flore · 09h15",
          npc: "Bonjour ! Bienvenue à Paris ! C'est ta première fois à Saint-Germain ?",
          npc_en: "Hello! Welcome to Paris! Is this your first time in Saint-Germain?",
          options: [
            { fr: "Bonjour Camille ! Oui, c'est ma première fois à Paris, je suis ravi !", ok: true, why: "Warm, natural A1 greeting — 'ravi' means delighted and immediately sounds authentic." },
            { fr: "Merci, au revoir, l'addition s'il vous plaît.", ok: false, why: "Too soon! You just sat down at the terrace." },
            { fr: "Je suis faim un café maintenant.", ok: false, why: "In French we say 'J'ai faim' (have hunger) and 'Je voudrais un café'." }
          ],
          skill: "listening"
        },
        {
          k: "reading",
          genre: "SMS & Carte du Café",
          title: "📱 SMS de Camille + Ardoise du Flore",
          text: "SMS de Camille (09h12) : « Je suis en terrasse à gauche ! Prends un café crème et un croissant chaud, c'est moi qui t'invite pour fêter ton arrivée à Paris ! »\n\nArdoise du jour : Café allongé 4,50 € · Café crème 5,50 € · Croissant au beurre 3,00 € · Jus d'orange pressé 6,50 €.",
          glossary: [
            { fr: "en terrasse", en: "on the outdoor patio" },
            { fr: "c'est moi qui t'invite", en: "it's my treat" },
            { fr: "au beurre", en: "made with real butter" }
          ],
          skill: "reading"
        },
        {
          k: "listen",
          mode: "meaning",
          q: "🎧 Le serveur arrive à votre table. Qu'est-ce qu'il demande ?",
          fr: "Bonjour messieurs-dames ! Qu'est-ce que je vous sers ce matin ?",
          choices: [
            "What can I get you this morning?",
            "Where is the nearest metro station?",
            "Do you want to pay by credit card?",
            "Is the terrace closed today?"
          ],
          answer: "What can I get you this morning?",
          why: "« Qu'est-ce que je vous sers ? » is the classic Parisian waiter phrase (literally: what do I serve you?).",
          skill: "listening"
        },
        {
          k: "memory",
          fr: "Bonjour, je voudrais un café crème et un croissant, s'il vous plaît.",
          en: "Hello, I would like a coffee with milk and a croissant, please.",
          chunks: ["Bonjour,", "je voudrais", "un café crème", "et un croissant,", "s'il vous plaît."],
          skill: "writing"
        },
        {
          k: "speak",
          lead: "🎙️ À voix haute devant le serveur — commandez avec un vrai accent parisien :",
          fr: "Bonjour ! Je voudrais un café crème, s'il vous plaît.",
          en: "Hello! I would like a coffee with milk, please.",
          skill: "speaking"
        }
      ]
    },
    {
      id: "ep2_coloc",
      num: 2,
      cefr: "A2",
      friendId: "yanis",
      friendName: "Yanis",
      coverImg: "assets/scene_appartement_coloc.webp",
      sceneId: "coloc_10e",
      npcImg: "assets/npc_yanis.webp",
      icon: "🌉",
      place: "Canal Saint-Martin · 10e Arrondissement",
      title: "Épisode 2 · La Coloc du 10e",
      subEn: "Moving into your Parisian flatshare: decoding spoken street French (T'inquiète, On se capte), reading the fridge note, and texting Yanis.",
      subFr: "Votre colocation près du canal : décoder le français parlé (T'inquiète, On se capte), lire le mot sur le frigo et répondre à Yanis.",
      rewardTitle: "🌉 Colocataire du Canal",
      scenes: [
        {
          k: "listen",
          mode: "meaning",
          q: "🎧 Note vocale de Yanis (écoutez aussi à ⚡ 1.25x !) — Que dit-il ?",
          fr: "T'inquiète pas pour les clés, je rentre vers dix-neuf heures et on se capte au canal !",
          choices: [
            "Don't worry about the keys, I'm coming back around 7 PM and we'll meet at the canal!",
            "I lost the keys at the canal and I won't be home tonight.",
            "Please clean the kitchen before 9 AM tomorrow.",
            "The rent is due on the nineteenth of the month."
          ],
          answer: "Don't worry about the keys, I'm coming back around 7 PM and we'll meet at the canal!",
          why: "« T'inquiète (pas) » = don't worry; « on se capte » = we'll catch up / meet up — essential everyday Parisian French.",
          skill: "listening"
        },
        {
          k: "reading",
          genre: "Post-it sur le frigo",
          title: "🗒️ Petit mot de la coloc — Rue de Lancry",
          text: "Salut la team ! Il n'y a plus de lait ni de pain pour demain matin. Si quelqu'un passe devant la boulangerie du coin avant 20h, prenez une baguette tradition bien cuite ! Ce soir, on mange tous ensemble sur le balcon. — Yanis",
          glossary: [
            { fr: "il n'y a plus de", en: "there is no more" },
            { fr: "du coin", en: "around the corner" },
            { fr: "bien cuite", en: "well-baked / crispy" }
          ],
          skill: "reading"
        },
        {
          k: "dialogue",
          place: "🥖 Boulangerie du Canal · 19h10",
          npc: "Bonsoir ! Ce sera tout avec la baguette tradition ?",
          npc_en: "Good evening! Will that be all with the traditional baguette?",
          options: [
            { fr: "Oui merci, ce sera tout ! Je peux payer par carte, s'il vous plaît ?", ok: true, why: "100% authentic Parisian bakery checkout exchange." },
            { fr: "Non, je suis une baguette tradition.", ok: false, why: "Careful: 'je suis' = I am! Use 'Oui merci, ce sera tout'." },
            { fr: "Bonjour, à demain matin la boulangerie.", ok: false, why: "In the evening in Paris, always switch from 'Bonjour' to 'Bonsoir'!" }
          ],
          skill: "listening"
        },
        {
          k: "memory",
          fr: "T'inquiète, j'ai pris une baguette tradition et du lait pour demain !",
          en: "Don't worry, I grabbed a traditional baguette and some milk for tomorrow!",
          chunks: ["T'inquiète,", "j'ai pris", "une baguette tradition", "et du lait", "pour demain !"],
          skill: "writing"
        },
        {
          k: "simturn",
          place: "🌉 Balcon du 10e · 19h45",
          npc: "Trop cool que t'aies pensé à la baguette ! Tu veux boire quoi avec le dîner ?",
          npc_en: "So cool you thought of the baguette! What do you want to drink with dinner?",
          keywords: ["voudrais", "eau", "merci"],
          model_fr: "Je voudrais un verre d'eau pétillante, merci beaucoup !",
          skill: "speaking"
        }
      ]
    },
    {
      id: "ep3_greve",
      num: 3,
      cefr: "B1",
      friendId: "camille",
      friendName: "Camille & Yanis",
      coverImg: "assets/scene_metro_chatelet.webp",
      sceneId: "metro_chatelet",
      npcImg: "assets/npc_moreau.jpg",
      icon: "🚇",
      place: "Station Châtelet · Métro Ligne 1",
      title: "Épisode 3 · Grève sur la Ligne 1",
      subEn: "True Parisian baptism: catching a fast RATP strike announcement, pivoting plans, writing a polite excuse, and improvising aloud.",
      subFr: "Baptême parisien : comprendre une annonce RATP rapide, changer de plan, écrire un message poli et improviser à l'oral.",
      rewardTitle: "🚇 Survivant de la Ligne 1",
      scenes: [
        {
          k: "listen",
          mode: "meaning",
          q: "🎧 Annonce RATP dans le métro (testez ⚡ 1.25x !) — Que se passe-t-il ?",
          fr: "En raison d'un mouvement social, le trafic est fortement perturbé sur l'ensemble de la ligne 1. Nous vous invitons à emprunter la ligne 14.",
          choices: [
            "Due to a strike, Line 1 is heavily disrupted; passengers should take Line 14.",
            "Line 1 is free today because of a music festival.",
            "Line 14 is permanently closed for renovations.",
            "The train will arrive two minutes early at Châtelet."
          ],
          answer: "Due to a strike, Line 1 is heavily disrupted; passengers should take Line 14.",
          why: "« Un mouvement social » is the official French euphemism for a strike; « emprunter une ligne » = to take a metro line.",
          skill: "listening"
        },
        {
          k: "reading",
          genre: "E-mail professionnel B1",
          title: "📧 Message de votre professeur à la Sorbonne",
          text: "Bonjour Sreenath,\n\nJe sais que les transports sont compliqués aujourd'hui à cause de la grève. Si vous avez du retard pour notre atelier de 14h, prévenez-moi simplement par message avant 13h45 afin que nous puissions réorganiser l'ordre des présentations.\n\nBien cordialement,\nProf. Valcourt",
          glossary: [
            { fr: "à cause de", en: "because of" },
            { fr: "prévenir", en: "to notify / let know" },
            { fr: "afin que (+ subj.)", en: "so that" }
          ],
          skill: "reading"
        },
        {
          k: "dialogue",
          place: "🚇 Quai de Châtelet · 13h35",
          npc: "Purée, la ligne 1 est complètement bloquée ! Tu crois qu'on prend la 14 ou qu'on y va à pied ?",
          npc_en: "Darn, Line 1 is completely stuck! Do you think we take Line 14 or walk there?",
          options: [
            { fr: "Prenons la ligne 14, ce sera beaucoup plus rapide, et je vais prévenir le prof tout de suite.", ok: true, why: "Natural B1 problem-solving with imperative 'Prenons' and future 'ce sera'." },
            { fr: "Je mange un croissant dans la ligne 14 hier.", ok: false, why: "Wrong tense and unrelated to the metro strike." },
            { fr: "Il ne faut pas que la grève existe parce que oui.", ok: false, why: "Awkward phrasing — focus on the practical solution!" }
          ],
          skill: "listening"
        },
        {
          k: "memory",
          fr: "Bonjour Professeur, en raison de la grève, j'aurai dix minutes de retard.",
          en: "Hello Professor, due to the strike, I will be ten minutes late.",
          chunks: ["Bonjour Professeur,", "en raison de la grève,", "j'aurai", "dix minutes", "de retard."],
          skill: "writing"
        },
        {
          k: "shadow",
          fr: "Désolé pour le retard, la ligne 1 était totalement paralysée ce matin !",
          en: "Sorry for the delay, Line 1 was completely paralyzed this morning!",
          chunks: ["Désolé pour le retard,", "la ligne 1", "était totalement paralysée", "ce matin !"],
          skill: "speaking"
        }
      ]
    },
    {
      id: "ep4_marais",
      num: 4,
      cefr: "B2",
      friendId: "celeste",
      friendName: "Céleste",
      coverImg: "assets/scene_diner_marais.webp",
      sceneId: "diner_marais",
      npcImg: "assets/npc_celeste_galeriste.jpg",
      icon: "🎨",
      place: "Place des Vosges · Le Marais",
      title: "Épisode 4 · Le Dîner du Marais",
      subEn: "Parisian dinner-party mastery: decoding irony & litotes, arguing a nuanced B2 viewpoint with connectors, and crafting an elegant note.",
      subFr: "L'art du dîner parisien : décoder l'ironie et la litote, défendre un point de vue nuancé (cependant, en revanche) et remercier avec style.",
      rewardTitle: "🎨 Convive du Marais",
      scenes: [
        {
          k: "reading",
          genre: "Carton d'invitation & Critique d'art",
          title: "💌 Dîner-débat chez Céleste · Place des Vosges",
          text: "« L'intelligence artificielle va-t-elle tuer le cinéma d'auteur ou lui offrir un second souffle ? »\n\nChronique du Monde : Si certains réalisateurs redoutent une standardisation des récits, d'autres soulignent en revanche que les outils génératifs libèrent la création indépendante. Tout dépendra, en somme, de la singularité du regard humain.",
          glossary: [
            { fr: "un second souffle", en: "a second wind / revival" },
            { fr: "en revanche", en: "on the other hand" },
            { fr: "en somme", en: "all in all / in short" }
          ],
          skill: "reading"
        },
        {
          k: "listen",
          mode: "meaning",
          q: "🎧 Un invité dit avec un sourire ironique — Que veut-il vraiment dire ?",
          fr: "Dire que les algorithmes remplacent Truffaut, c'est quand même un peu fort de café !",
          choices: [
            "Saying algorithms replace Truffaut is really going too far / outrageous!",
            "He thinks the espresso at this dinner party is too strong.",
            "He agrees completely that algorithms are better than Truffaut.",
            "He wants to leave early to go to a café."
          ],
          answer: "Saying algorithms replace Truffaut is really going too far / outrageous!",
          why: "« C'est un peu fort de café » is a classic B2–C1 Parisian idiom meaning 'that's a bit much / outrageous!'",
          skill: "listening"
        },
        {
          k: "dialogue",
          place: "🕯️ Table de la Place des Vosges · 21h30",
          npc: "Et vous, Sreenath, vous pensez vraiment que la technologie peut nourrir l'art sans le dénaturer ?",
          npc_en: "And you, Sreenath, do you really think technology can nourish art without distorting it?",
          options: [
            { fr: "Je comprends cette inquiétude ; cependant, l'outil n'a jamais remplacé la sensibilité de l'artiste.", ok: true, why: "Textbook B2/C1 Parisian debate move: validate first, then pivot with 'cependant'." },
            { fr: "Oui, c'est bien et c'est pas mal.", ok: false, why: "Too vague for a Marais dinner debate — bring nuance and a connector!" },
            { fr: "Vous avez complètement tort, arrêtez de parler.", ok: false, why: "Way too blunt! In France, intellectual disagreement thrives on courteous nuance." }
          ],
          skill: "listening"
        },
        {
          k: "memory",
          fr: "Je partage votre réserve ; en revanche, cet outil peut enrichir la création.",
          en: "I share your reservation; on the other hand, this tool can enrich creation.",
          chunks: ["Je partage votre réserve ;", "en revanche,", "cet outil", "peut enrichir", "la création."],
          skill: "writing"
        },
        {
          k: "simturn",
          place: "🌙 Sortie du Marais · 23h15",
          npc: "Merci d'être venu ce soir ! Quelle discussion passionnante — vous avez aimé la soirée ?",
          npc_en: "Thanks for coming tonight! What a fascinating discussion — did you enjoy the evening?",
          keywords: ["soirée", "merci", "passionnant"],
          model_fr: "Merci infiniment pour cette soirée merveilleuse, les échanges étaient passionnants !",
          skill: "speaking"
        }
      ]
    },
    {
      id: "ep5_comex",
      num: 5,
      cefr: "C1",
      friendId: "valcourt",
      friendName: "Prof. Valcourt & Céleste",
      coverImg: "assets/scene_prefecture_banque.webp",
      sceneId: "prefecture_banque",
      npcImg: "assets/npc_immortel_c2.jpg",
      icon: "🏢",
      place: "Tour First · La Défense",
      title: "Épisode 5 · Le Comex de La Défense",
      subEn: "Executive & C1 mastery: dissecting a strategic memo, countering board objections with the subjunctive (Bien que…), and commanding the room.",
      subFr: "Maîtrise C1 en comité de direction : analyser une note stratégique, parer une objection au subjonctif (Bien que…) et convaincre avec autorité.",
      rewardTitle: "🏢 Stratège de La Défense",
      scenes: [
        {
          k: "reading",
          genre: "Note de Synthèse · Comex",
          title: "📊 Note Stratégique — Transition Bas-Carbone 2027",
          text: "Bien que l'investissement initial puisse paraître conséquent à court terme, il n'en demeure pas moins que l'inaction exposerait le groupe à un risque réglementaire majeur. Dès lors, il convient d'engager dès ce trimestre la refonte de notre chaîne logistique, faute de quoi notre compétitivité s'en trouverait durablement affectée.",
          glossary: [
            { fr: "il n'en demeure pas moins que", en: "it nevertheless remains true that" },
            { fr: "dès lors", en: "consequently / from then on" },
            { fr: "faute de quoi", en: "failing which / otherwise" }
          ],
          skill: "reading"
        },
        {
          k: "mcq",
          qHtml: "🎯 Quel mode verbal s'impose après <b>« Bien que… »</b> dans une prise de parole C1 ?",
          big: "Bien que ce calendrier ___ ambitieux, nos équipes sont prêtes.",
          fr: "Bien que ce calendrier soit ambitieux, nos équipes sont prêtes.",
          choices: ["soit (subjonctif)", "est (indicatif)", "sera (futur)", "était (imparfait)"],
          answer: "soit (subjonctif)",
          sayAnswer: false,
          why: "« Bien que » ALWAYS triggers the subjunctive in standard & executive French: « Bien que ce calendrier soit ambitieux ».",
          skill: "grammar"
        },
        {
          k: "listen",
          mode: "meaning",
          q: "🎧 Objection du directeur financier (testez ⚡ 1.25x !) — Quelle est sa crainte ?",
          fr: "Votre feuille de route est séduisante sur le papier, mais je doute fort que nos marges absorbent un tel choc dès le premier semestre.",
          choices: [
            "He doubts profit margins can absorb the cost shock in the first half of the year.",
            "He thinks the roadmap is too cheap and needs more budget.",
            "He wants to cancel the meeting immediately.",
            "He is congratulating the team on doubling profits."
          ],
          answer: "He doubts profit margins can absorb the cost shock in the first half of the year.",
          why: "« Sur le papier » = on paper; « je doute fort que (+ subj.) » = I strongly doubt that — a classic C1 executive objection.",
          skill: "listening"
        },
        {
          k: "memory",
          fr: "Bien que le coût initial soit élevé, il n'en demeure pas moins indispensable.",
          en: "Although the initial cost is high, it nevertheless remains indispensable.",
          chunks: ["Bien que le coût initial", "soit élevé,", "il n'en demeure pas moins", "indispensable."],
          skill: "writing"
        },
        {
          k: "shadow",
          fr: "Dès lors, nous proposons un déploiement progressif afin de préserver nos marges.",
          en: "Consequently, we propose a phased rollout in order to preserve our margins.",
          chunks: ["Dès lors,", "nous proposons", "un déploiement progressif", "afin de préserver nos marges."],
          skill: "speaking"
        }
      ]
    },
    {
      id: "ep6_nuit",
      num: 6,
      cefr: "C2",
      friendId: "valcourt",
      friendName: "Camille, Yanis, Céleste & Valcourt",
      coverImg: "assets/scene_pont_des_arts.webp",
      sceneId: "pont_des_arts",
      npcImg: "assets/npc_immortel_c2.jpg",
      icon: "🏛️",
      place: "Sous la Coupole & Saint-Germain · Minuit",
      title: "Épisode 6 · La Nuit de Saint-Germain",
      subEn: "C2 Native Crowning Episode: switching effortlessly between street wit (Yanis) and Academic eloquence (Valcourt), and speaking like a true Parisian.",
      subFr: "Épisode final C2 : jongler sans effort entre l'esprit de la rue (Yanis) et l'éloquence académique (Valcourt), jusqu'au titre d'Immortel de Paris.",
      rewardTitle: "👑 Immortel de Saint-Germain",
      scenes: [
        {
          k: "reading",
          genre: "Discours sous la Coupole · C2",
          title: "🏛️ Allocution de Minuit — L'Éloge de la Langue Vivante",
          text: "Maîtriser une langue au seuil du C2, ce n'est point aligner des tournures figées dans un manuel : c'est sentir, à la fraction de seconde près, quand l'ironie effleure une phrase, quand le tutoiement scelle une amitié, et quand une période bien balancée emporte l'adhésion d'un auditoire.",
          glossary: [
            { fr: "ce n'est point", en: "it is not at all (literary)" },
            { fr: "effleurer", en: "to lightly touch / graze" },
            { fr: "emporter l'adhésion", en: "to win over the audience" }
          ],
          skill: "reading"
        },
        {
          k: "dialogue",
          place: "🥂 Quai de Conti · Transition de Registres C2",
          npc: "Yanis murmure : « Franchement t'as assuré de dingue ! » Puis le Prof. Valcourt se tourne vers vous : « Quelle synthèse tirez-vous de cette odyssée parisienne ? »",
          npc_en: "Yanis whispers: 'Honestly you totally crushed it!' Then Prof. Valcourt turns to you: 'What synthesis do you draw from this Parisian odyssey?'",
          options: [
            { fr: "Loin de se réduire à un simple code, le français est devenu pour moi une manière habitée de penser et de dialoguer.", ok: true, why: "Pure C2 elegance: 'Loin de se réduire à…' + 'une manière habitée de penser'." },
            { fr: "C'est trop stylé wesh, j'ai bien kiffé le français.", ok: false, why: "Great for Yanis, but register mismatch when addressing Prof. Valcourt under the Cupola!" },
            { fr: "Le français est une langue avec beaucoup de mots.", ok: false, why: "Grammatically correct, yet far too flat for a C2 crowning speech." }
          ],
          skill: "listening"
        },
        {
          k: "listen",
          mode: "meaning",
          q: "🎧 Toast final de Camille à vitesse parisienne (⚡ 1.25x !) — Que célèbre-t-elle ?",
          fr: "Quoi qu'il advienne désormais, tu n'es plus un simple visiteur : Paris fait partie de ta voix, et ta voix fait partie de Paris.",
          choices: [
            "Whatever happens from now on, you are no longer just a visitor: Paris is part of your voice.",
            "She is reminding you to renew your museum pass next week.",
            "She says you should avoid speaking French after midnight.",
            "She is announcing that she is moving away from Paris."
          ],
          answer: "Whatever happens from now on, you are no longer just a visitor: Paris is part of your voice.",
          why: "« Quoi qu'il advienne » (subjunctive of advenir) = whatever may happen — hallmark C2 literary grace.",
          skill: "listening"
        },
        {
          k: "memory",
          fr: "Quoi qu'il advienne, le français est désormais ma seconde patrie intérieure.",
          en: "Whatever happens, French is henceforth my second inner homeland.",
          chunks: ["Quoi qu'il advienne,", "le français est désormais", "ma seconde patrie", "intérieure."],
          skill: "writing"
        },
        {
          k: "simturn",
          place: "✨ Pont des Arts · 00h30",
          npc: "Camille, Yanis, Céleste et Valcourt lèvent leur verre : « À toi, Sreenath ! Un dernier mot en français pour clore ce chapitre ? »",
          npc_en: "Camille, Yanis, Céleste & Valcourt raise their glasses: 'To you, Sreenath! One final word in French to close this chapter?'",
          keywords: ["merci", "Paris", "français"],
          model_fr: "Merci du fond du cœur à vous quatre : grâce à Paris, je pense et je vis désormais en français !",
          skill: "speaking"
        }
      ]
    }
  ];
})();
