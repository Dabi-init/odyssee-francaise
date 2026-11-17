window.ODYSSEE_EXAMS = {
  "A1": {
    "title": "Passage A1 → A2",
    "intro_en": "Prove you can handle simple everyday French: greetings, numbers, family and daily routines.",
    "passMark": 0.7,
    "listening": [
      { "fr": "Bonjour, je m'appelle Julie et j'ai trente ans.", "q": "How old is Julie?", "choices": ["13", "30", "20", "33"], "answer": "30" },
      { "fr": "Le train part à huit heures et quart.", "q": "When does the train leave?", "choices": ["8:15", "8:45", "7:15", "8:00"], "answer": "8:15" },
      { "fr": "Un café et un croissant, s'il vous plaît.", "q": "What does the person order?", "choices": ["A coffee and a croissant", "A tea and a croissant", "A coffee and a sandwich", "Two coffees"], "answer": "A coffee and a croissant" },
      { "fr": "La pharmacie est à côté de la banque.", "q": "Where is the pharmacy?", "choices": ["Next to the bank", "Opposite the bank", "Behind the station", "Next to the bakery"], "answer": "Next to the bank" },
      { "fr": "Ma sœur habite à Lyon avec son mari.", "q": "Who lives in Lyon?", "choices": ["The speaker's sister", "The speaker's brother", "The speaker's mother", "The speaker's husband"], "answer": "The speaker's sister" },
      { "fr": "Il fait froid aujourd'hui, prends ton manteau.", "q": "What is the weather like?", "choices": ["It's cold", "It's hot", "It's raining", "It's sunny"], "answer": "It's cold" },
      { "fr": "Le magasin est fermé le dimanche.", "q": "When is the shop closed?", "choices": ["On Sundays", "On Mondays", "On Saturdays", "Every evening"], "answer": "On Sundays" },
      { "fr": "Ça fait douze euros cinquante, madame.", "q": "How much does it cost?", "choices": ["€12.50", "€2.50", "€15.20", "€10.50"], "answer": "€12.50" }
    ],
    "dictation": [
      "Je suis étudiante à Paris.",
      "Nous avons deux enfants.",
      "Il n'aime pas le café.",
      "Elle habite près de la gare."
    ],
    "grammar": [
      { "q": "Je ___ français.", "choices": ["suis", "es", "est", "sommes"], "answer": "suis", "why": "Être with je → je suis." },
      { "q": "Nous ___ une grande maison.", "choices": ["avons", "avez", "ont", "as"], "answer": "avons", "why": "Avoir with nous → nous avons." },
      { "q": "C'est ___ pomme.", "choices": ["une", "un", "des", "le"], "answer": "une", "why": "Pomme is feminine and singular → une." },
      { "q": "J'aime beaucoup ___ chocolat.", "choices": ["le", "la", "l'", "les"], "answer": "le", "why": "After aimer, use the definite article; chocolat is masculine and starts with a consonant → le." },
      { "q": "Il ne parle ___ anglais.", "choices": ["pas", "non", "rien", "aucun"], "answer": "pas", "why": "Basic negation is ne … pas around the verb." },
      { "q": "Vous ___ d'où ?", "choices": ["êtes", "es", "sont", "est"], "answer": "êtes", "why": "Être with vous → vous êtes." },
      { "q": "Ils ___ au cinéma ce soir.", "choices": ["vont", "allons", "va", "vas"], "answer": "vont", "why": "Aller with ils → ils vont." },
      { "q": "Marie est très ___.", "choices": ["contente", "content", "contents", "contentes"], "answer": "contente", "why": "The adjective agrees with Marie (feminine singular) → add -e." },
      { "q": "Je n'ai pas ___ voiture.", "choices": ["de", "une", "la", "des"], "answer": "de", "why": "After a negation, un/une/des become de." },
      { "q": "Tu ___ quel âge ?", "choices": ["as", "es", "a", "ai"], "answer": "as", "why": "French uses avoir for age: tu as … ans." }
    ],
    "reading": {
      "title": "Un message de Léa",
      "genre": "SMS",
      "text_fr": "Salut Tom ! Je suis enfin à Bordeaux. L'appartement est petit mais très joli, avec un balcon et une grande cuisine. Ma colocataire s'appelle Inès ; elle est espagnole et elle travaille dans un restaurant. Demain, je commence mon nouveau travail à la banque, à neuf heures. Je suis un peu stressée ! Samedi, on organise une petite fête à la maison. Tu viens ? Il y a un train à dix heures de Paris. Réponds-moi vite ! Bisous, Léa",
      "questions": [
        { "q": "Where is Léa now?", "choices": ["In Bordeaux", "In Paris", "In Spain", "In Lyon"], "answer": "In Bordeaux", "why": "« Je suis enfin à Bordeaux » = I'm finally in Bordeaux." },
        { "q": "What is Inès's job?", "choices": ["She works in a restaurant", "She works in a bank", "She is a student", "She works in a shop"], "answer": "She works in a restaurant", "why": "« Elle travaille dans un restaurant »; it is Léa who will work in a bank." },
        { "q": "When does Léa start her new job?", "choices": ["Tomorrow at 9", "Saturday at 10", "Today at 9", "Tomorrow at 10"], "answer": "Tomorrow at 9", "why": "« Demain, je commence … à neuf heures » = tomorrow at nine." },
        { "q": "How does Léa feel about her new job?", "choices": ["A little stressed", "Very sad", "Bored", "Angry"], "answer": "A little stressed", "why": "« Je suis un peu stressée » = I'm a bit stressed." },
        { "q": "Why is Léa writing to Tom?", "choices": ["To invite him to a party on Saturday", "To ask him for money", "To find a flatmate", "To cancel a trip"], "answer": "To invite him to a party on Saturday", "why": "« Samedi, on organise une petite fête … Tu viens ? » = she invites him." }
      ]
    },
    "writing": {
      "prompt_en": "You are on holiday. Write a short message to a French friend: say where you are, what the weather is like and what you do every day.",
      "prompt_fr": "Vous êtes en vacances. Écrivez un court message à un ami français : dites où vous êtes, quel temps il fait et ce que vous faites chaque jour.",
      "minWords": 25,
      "maxWords": 50,
      "model_fr": "Salut Camille ! Je suis à Nice avec ma famille. Il fait beau et chaud. Le matin, je vais à la plage et je nage. L'après-midi, nous visitons la vieille ville. Le soir, on mange au restaurant. C'est super ! À bientôt, Marc",
      "checklist": [
        "Greets the friend and signs off (Salut … / À bientôt …)",
        "Says where you are with être + à (Je suis à …)",
        "Describes the weather with il fait …",
        "Uses at least 3 different verbs correctly conjugated in the present tense",
        "Uses time expressions (le matin, l'après-midi, le soir)",
        "Stays between 25 and 50 words"
      ],
      "task_type": "message"
    },
    "speaking": {
      "prompt_en": "Introduce yourself: your name, age, where you live, your job and one thing you like.",
      "prompt_fr": "Présentez-vous : votre nom, votre âge, où vous habitez, votre profession et une chose que vous aimez.",
      "seconds": 30,
      "model_fr": "Bonjour ! Je m'appelle Sarah. J'ai vingt-huit ans et j'habite à Londres. Je suis infirmière dans un grand hôpital. J'aime beaucoup la musique et le cinéma. Le week-end, je fais du sport avec mes amis. J'apprends le français parce que j'adore Paris !",
      "keywords": ["je m'appelle", "j'ai", "ans", "j'habite", "je suis", "j'aime", "travaille", "parce que"]
    }
  },
  "A2": {
    "title": "Passage A2 → B1",
    "intro_en": "Show you can talk about past events, plans and comparisons in everyday situations.",
    "passMark": 0.7,
    "listening": [
      { "fr": "Hier soir, nous sommes allés au cinéma avec des collègues.", "q": "What did they do last night?", "choices": ["They went to the cinema", "They went to a restaurant", "They worked late", "They stayed at home"], "answer": "They went to the cinema" },
      { "fr": "Je vais prendre le métro, c'est plus rapide que le bus.", "q": "Why is the speaker taking the metro?", "choices": ["It's faster than the bus", "It's cheaper than the bus", "The buses are on strike", "It's closer to home"], "answer": "It's faster than the bus" },
      { "fr": "Le rendez-vous chez le dentiste est mardi prochain à quinze heures.", "q": "When is the dentist appointment?", "choices": ["Next Tuesday at 3 p.m.", "Next Thursday at 3 p.m.", "Last Tuesday at 5 p.m.", "Next Tuesday at 5 p.m."], "answer": "Next Tuesday at 3 p.m." },
      { "fr": "Pour la poste, c'est tout droit, puis la deuxième rue à gauche.", "q": "What are the directions to the post office?", "choices": ["Straight on, then the second street on the left", "Straight on, then the first street on the right", "Turn left, then the second street on the right", "Go back, then turn left"], "answer": "Straight on, then the second street on the left" },
      { "fr": "Mon frère est plus grand que moi, mais il est moins sportif.", "q": "What do we learn about the brother?", "choices": ["He is taller but less sporty", "He is shorter but more sporty", "He is taller and more sporty", "He is younger and less sporty"], "answer": "He is taller but less sporty" },
      { "fr": "Désolée, je ne peux pas venir samedi, j'ai un mariage en Bretagne.", "q": "Why can't she come on Saturday?", "choices": ["She has a wedding in Brittany", "She has to work", "She is ill", "She has a family dinner in Paris"], "answer": "She has a wedding in Brittany" },
      { "fr": "Pour le dîner, j'ai acheté du poisson, des légumes et une bouteille de vin.", "q": "What did the speaker NOT buy?", "choices": ["Cheese", "Fish", "Vegetables", "Wine"], "answer": "Cheese" },
      { "fr": "Le vol pour Rome a une heure de retard à cause de la neige.", "q": "What is the problem?", "choices": ["The flight is one hour late because of snow", "The flight is cancelled because of a strike", "The flight is leaving one hour early", "The flight is late because of fog"], "answer": "The flight is one hour late because of snow" }
    ],
    "dictation": [
      "Hier, nous sommes allés au marché ensemble.",
      "Elle a acheté une jolie robe bleue.",
      "Demain, je vais travailler chez moi.",
      "Mes parents sont plus âgés que les tiens."
    ],
    "grammar": [
      { "q": "Hier, elle ___ partie à huit heures.", "choices": ["est", "a", "ai", "as"], "answer": "est", "why": "Partir is a verb of movement: it takes être in the passé composé." },
      { "q": "Nous ___ visité le Louvre la semaine dernière.", "choices": ["avons", "sommes", "allons", "étions"], "answer": "avons", "why": "Visiter takes avoir in the passé composé." },
      { "q": "Ce soir, je ___ regarder un film.", "choices": ["vais", "va", "suis", "ai"], "answer": "vais", "why": "Futur proche = aller (je vais) + infinitive." },
      { "q": "Paris est ___ grand que Lyon.", "choices": ["plus", "plus de", "le plus", "beaucoup"], "answer": "plus", "why": "Comparative of an adjective: plus + adjective + que." },
      { "q": "C'est le restaurant ___ cher du quartier.", "choices": ["le moins", "moins", "le moindre", "plus"], "answer": "le moins", "why": "Superlative: le moins / le plus + adjective + de." },
      { "q": "Pierre et Anne ont un chien. C'est ___ chien.", "choices": ["leur", "leurs", "son", "ses"], "answer": "leur", "why": "Leur = their, for one thing owned by several people." },
      { "q": "J'ai perdu ___ clés !", "choices": ["mes", "ma", "mon", "me"], "answer": "mes", "why": "Clés is plural → mes." },
      { "q": "___ habites-tu ?", "choices": ["Où", "Quand", "Qui", "Quel"], "answer": "Où", "why": "Où asks about place: where do you live?" },
      { "q": "Elles se sont ___ tôt ce matin.", "choices": ["levées", "levé", "levés", "lever"], "answer": "levées", "why": "Reflexive verbs take être; the participle agrees with elles (feminine plural)." },
      { "q": "___ heure est-il ?", "choices": ["Quelle", "Quel", "Quelles", "Qu'est-ce que"], "answer": "Quelle", "why": "Heure is feminine singular → quelle." }
    ],
    "reading": {
      "title": "Appartement à louer – Lyon",
      "genre": "petite annonce",
      "text_fr": "À louer : beau deux-pièces de 45 m² au cœur du quartier de la Croix-Rousse, à Lyon. L'appartement se trouve au troisième étage d'un immeuble ancien, sans ascenseur. Il comprend un salon lumineux, une chambre calme qui donne sur la cour, une cuisine équipée et une salle de bains avec douche. Le métro est à cinq minutes à pied et il y a beaucoup de commerces dans la rue. Le loyer est de 780 euros par mois, charges comprises. Les animaux ne sont pas acceptés. L'appartement est libre à partir du 1er septembre. Idéal pour un jeune couple ou une personne qui travaille. Pour visiter, appelez Mme Garnier en semaine après 18 heures au 06 12 34 56 78. Merci de ne pas envoyer de SMS.",
      "questions": [
        { "q": "Which floor is the flat on?", "choices": ["The third floor, with no lift", "The third floor, with a lift", "The ground floor", "The second floor, with no lift"], "answer": "The third floor, with no lift", "why": "« au troisième étage … sans ascenseur »." },
        { "q": "What is included in the rent?", "choices": ["The service charges", "Internet and electricity", "A parking space", "Furniture"], "answer": "The service charges", "why": "« charges comprises » = service charges included." },
        { "q": "Who cannot rent this flat?", "choices": ["People with pets", "Young couples", "People who work", "People without a car"], "answer": "People with pets", "why": "« Les animaux ne sont pas acceptés » = no pets." },
        { "q": "When is the flat available?", "choices": ["From 1 September", "Immediately", "From 1 October", "From 18 September"], "answer": "From 1 September", "why": "« libre à partir du 1er septembre »." },
        { "q": "How should you contact Mrs Garnier?", "choices": ["Call her on a weekday after 6 p.m.", "Send her a text message", "Call her at the weekend", "Send her an email"], "answer": "Call her on a weekday after 6 p.m.", "why": "« appelez Mme Garnier en semaine après 18 heures » and no texts." }
      ]
    },
    "writing": {
      "prompt_en": "Write an email to a French friend about your last weekend (what you did, with whom, your opinion) and your plans for next weekend.",
      "prompt_fr": "Écrivez un courriel à un ami français : racontez votre week-end dernier (ce que vous avez fait, avec qui, votre avis) et parlez de vos projets pour le week-end prochain.",
      "minWords": 50,
      "maxWords": 80,
      "model_fr": "Salut Antoine,\n\nComment vas-tu ? Le week-end dernier, je suis allée à Strasbourg avec ma cousine. Nous avons visité la cathédrale et nous avons mangé une délicieuse choucroute. Dimanche, il a plu, alors nous sommes restées au musée. C'était vraiment génial ! Le week-end prochain, je vais rester à Paris : je vais faire du vélo et je vais voir une exposition. Tu veux venir avec moi ?\n\nBises,\nClaire",
      "checklist": [
        "Opens and closes the email appropriately (Salut … / Bises …)",
        "Uses at least 4 verbs in the passé composé, with both être and avoir",
        "Makes past participles agree when the auxiliary is être",
        "Uses the futur proche (aller + infinitive) at least twice for plans",
        "Gives an opinion (C'était …)",
        "Uses linking words (alors, et, mais, puis)",
        "Stays between 50 and 80 words"
      ],
      "task_type": "courriel amical"
    },
    "speaking": {
      "prompt_en": "Describe your town or neighbourhood: what there is, what you like and dislike, and compare it with another place.",
      "prompt_fr": "Décrivez votre ville ou votre quartier : ce qu'il y a, ce que vous aimez ou n'aimez pas, et comparez-le avec un autre endroit.",
      "seconds": 45,
      "model_fr": "J'habite à Manchester, dans un quartier assez calme. Il y a un grand parc, deux supermarchés et beaucoup de petits cafés. J'aime bien mon quartier parce que les gens sont sympas et c'est près de mon travail. Par contre, je n'aime pas le temps : il pleut tout le temps ! Manchester est moins belle que Paris, mais c'est plus calme et les loyers sont moins chers. L'année dernière, je suis allé à Paris et j'ai adoré.",
      "keywords": ["j'habite", "il y a", "quartier", "j'aime", "parce que", "plus", "moins", "que", "par contre"]
    }
  },
  "B1": {
    "title": "Passage B1 → B2",
    "intro_en": "Prove you can narrate, explain your opinions and handle common work and travel situations.",
    "passMark": 0.7,
    "listening": [
      { "fr": "Quand j'étais petit, je passais toutes mes vacances chez mes grands-parents en Normandie.", "q": "What does the speaker remember?", "choices": ["Spending all his holidays at his grandparents' in Normandy", "One trip to Normandy with his parents", "Living in Normandy as an adult", "Working on a farm in Normandy"], "answer": "Spending all his holidays at his grandparents' in Normandy" },
      { "fr": "Si tu veux, je t'envoie le dossier ce soir ; comme ça, tu pourras le lire demain matin.", "q": "What does the speaker offer?", "choices": ["To send the file tonight so it can be read tomorrow morning", "To read the file tomorrow morning", "To bring the file to the office tomorrow", "To send the file next week"], "answer": "To send the file tonight so it can be read tomorrow morning" },
      { "fr": "Mesdames et messieurs, en raison d'un incident technique, le TGV 6205 partira avec environ vingt minutes de retard.", "q": "What is announced?", "choices": ["The train will leave about 20 minutes late", "The train is cancelled", "The train will leave from another platform", "The train will arrive 20 minutes early"], "answer": "The train will leave about 20 minutes late" },
      { "fr": "J'aimerais bien venir à ta fête, mais j'ai promis à ma mère de l'aider à déménager.", "q": "Why might the speaker not come to the party?", "choices": ["She promised to help her mother move house", "She is ill", "She has to work", "She doesn't like parties"], "answer": "She promised to help her mother move house" },
      { "fr": "Le restaurant dont je t'ai parlé a fermé ; on pourrait essayer le nouveau thaï près du canal.", "q": "What does the speaker suggest?", "choices": ["Trying the new Thai restaurant near the canal", "Going back to their usual restaurant", "Cooking at home", "Booking the restaurant he mentioned"], "answer": "Trying the new Thai restaurant near the canal" },
      { "fr": "Je cherche un poste à mi-temps, idéalement dans le tourisme, parce que je reprends mes études en octobre.", "q": "Why does the speaker want a part-time job?", "choices": ["She is going back to university in October", "She has young children", "She already has another job", "She wants to travel"], "answer": "She is going back to university in October" },
      { "fr": "Ce matin, il y avait tellement de bouchons que je suis arrivé au bureau à dix heures.", "q": "Why was he late this morning?", "choices": ["There were a lot of traffic jams", "His train was cancelled", "He woke up late", "He had a doctor's appointment"], "answer": "There were a lot of traffic jams" },
      { "fr": "Tu as pensé à acheter du pain ? — Ah non, j'ai complètement oublié ! J'y retourne.", "q": "What will the second person do?", "choices": ["Go back to the shop to buy bread", "Buy bread tomorrow", "Ask someone else to buy bread", "Make bread at home"], "answer": "Go back to the shop to buy bread" }
    ],
    "dictation": [
      "Quand nous étions enfants, nous allions souvent à la plage.",
      "Les documents que tu m'as envoyés sont arrivés ce matin.",
      "Si j'avais plus de temps, je voyagerais davantage en Europe.",
      "C'est dans cette ville que mes parents se sont rencontrés."
    ],
    "grammar": [
      { "q": "Quand je suis arrivé, il ___.", "choices": ["pleuvait", "a plu", "pleuvra", "pleut"], "answer": "pleuvait", "why": "The imparfait describes the background situation when a passé composé action happens." },
      { "q": "Je lisais tranquillement quand, soudain, le téléphone ___.", "choices": ["a sonné", "sonnait", "sonne", "sonnerait"], "answer": "a sonné", "why": "A sudden, completed event (soudain) interrupting an ongoing action takes the passé composé." },
      { "q": "L'année prochaine, nous ___ au Canada.", "choices": ["irons", "allions", "irions", "sommes allés"], "answer": "irons", "why": "Futur simple of aller: nous irons." },
      { "q": "Tu vas à la boulangerie ? — Oui, j'___ vais.", "choices": ["y", "en", "le", "lui"], "answer": "y", "why": "Y replaces a place introduced by à." },
      { "q": "Combien de frères as-tu ? — J'___ ai deux.", "choices": ["en", "y", "les", "leur"], "answer": "en", "why": "En replaces a noun of quantity (de frères) and is used with a number." },
      { "q": "Tu as vu Marie ? — Oui, je ___ ai vue hier.", "choices": ["l'", "lui", "la", "y"], "answer": "l'", "why": "Voir quelqu'un: direct object pronoun la, elided to l' before a vowel." },
      { "q": "J'ai téléphoné à mes parents et je ___ ai annoncé la nouvelle.", "choices": ["leur", "les", "lui", "y"], "answer": "leur", "why": "Annoncer à quelqu'un: indirect object, plural → leur." },
      { "q": "Le film ___ je t'ai parlé passe ce soir.", "choices": ["dont", "que", "qui", "où"], "answer": "dont", "why": "Parler de quelque chose → the relative pronoun is dont." },
      { "q": "La ville ___ je suis né est au bord de la mer.", "choices": ["où", "que", "dont", "qui"], "answer": "où", "why": "Où is the relative pronoun for a place." },
      { "q": "Si j'étais riche, j'___ une maison à la campagne.", "choices": ["achèterais", "achèterai", "achetais", "achète"], "answer": "achèterais", "why": "Si + imparfait → conditionnel présent in the main clause." }
    ],
    "reading": {
      "title": "Le télétravail, quelques années après",
      "genre": "article",
      "text_fr": "Depuis la crise sanitaire, le télétravail s'est installé durablement dans la vie des salariés français. Selon une enquête récente, près d'un cadre sur deux travaille désormais à domicile au moins un jour par semaine. Pour beaucoup, c'est un vrai progrès : moins de temps perdu dans les transports, plus de calme pour se concentrer et une meilleure organisation de la vie familiale.\n\nPourtant, tout n'est pas rose. Camille, 34 ans, chargée de communication à Nantes, travaille chez elle trois jours par semaine. « Au début, j'étais ravie. Mais au bout de quelques mois, je me suis sentie isolée. Les pauses café avec mes collègues me manquaient, et j'avais du mal à m'arrêter le soir », raconte-t-elle.\n\nLes entreprises, elles aussi, cherchent le bon équilibre. Certaines ont réduit la taille de leurs bureaux pour faire des économies ; d'autres, au contraire, demandent à leurs équipes de revenir plus souvent sur place afin de renforcer la cohésion. Les spécialistes recommandent une solution intermédiaire : deux jours de télétravail maximum, des horaires clairs et un véritable « droit à la déconnexion ». Car si le télétravail offre plus de liberté, il exige aussi beaucoup de discipline.",
      "questions": [
        { "q": "Quelle proportion de cadres télétravaille au moins un jour par semaine ?", "choices": ["Environ la moitié", "Un quart", "Presque tous", "Un sur dix"], "answer": "Environ la moitié", "why": "« près d'un cadre sur deux » = environ 50 %." },
        { "q": "Quelles difficultés Camille a-t-elle rencontrées ?", "choices": ["Elle s'est sentie isolée et avait du mal à s'arrêter le soir", "Son employeur a refusé le télétravail", "Elle passait trop de temps dans les transports", "Elle n'avait pas d'ordinateur chez elle"], "answer": "Elle s'est sentie isolée et avait du mal à s'arrêter le soir", "why": "« je me suis sentie isolée … j'avais du mal à m'arrêter le soir »." },
        { "q": "Pourquoi certaines entreprises ont-elles réduit la taille de leurs bureaux ?", "choices": ["Pour faire des économies", "Pour renforcer la cohésion", "Pour obliger les salariés à revenir", "À cause d'un déménagement"], "answer": "Pour faire des économies", "why": "« Certaines ont réduit la taille de leurs bureaux pour faire des économies »." },
        { "q": "Que recommandent les spécialistes ?", "choices": ["Deux jours de télétravail maximum et des horaires clairs", "Le télétravail cinq jours sur cinq", "La suppression du télétravail", "Trois jours de télétravail minimum"], "answer": "Deux jours de télétravail maximum et des horaires clairs", "why": "« deux jours de télétravail maximum, des horaires clairs et un véritable droit à la déconnexion »." },
        { "q": "Quelle est la conclusion de l'article ?", "choices": ["Le télétravail apporte de la liberté mais demande de la discipline", "Le télétravail est une mauvaise idée", "Le télétravail va bientôt disparaître", "Toutes les entreprises préfèrent le télétravail"], "answer": "Le télétravail apporte de la liberté mais demande de la discipline", "why": "Dernière phrase : « s'il offre plus de liberté, il exige aussi beaucoup de discipline »." }
      ]
    },
    "writing": {
      "prompt_en": "A French friend is hesitating between a well-paid job in Paris and a less well-paid job in their home town. Write back with your advice, your arguments and a personal experience.",
      "prompt_fr": "Un ami français hésite entre un poste bien payé à Paris et un poste moins bien payé dans sa ville natale. Répondez-lui : donnez-lui votre conseil, vos arguments et racontez une expérience personnelle.",
      "minWords": 120,
      "maxWords": 160,
      "model_fr": "Chère Julie,\n\nMerci pour ton message ! Je comprends que tu hésites, car c'est une décision importante.\n\nÀ ta place, je choisirais le poste à Paris. D'abord, c'est une excellente occasion pour ta carrière : tu travaillerais dans une grande entreprise et tu apprendrais beaucoup. Ensuite, le salaire est plus élevé, même si la vie à Paris coûte cher.\n\nJe te dis ça parce que j'ai vécu une situation similaire il y a cinq ans. On m'a proposé un poste à Lyon, loin de ma famille. Au début, j'avais peur, mais finalement, c'était la meilleure décision de ma vie : je me suis fait des amis et j'ai beaucoup progressé.\n\nCela dit, si ta famille est vraiment essentielle pour toi, rester chez toi n'est pas une erreur. Écoute ton cœur !\n\nTiens-moi au courant.\nGrosses bises,\nThomas",
      "checklist": [
        "Uses appropriate informal opening and closing formulas",
        "Gives clear advice with the conditional (À ta place, je …)",
        "Presents at least two arguments with connectors (d'abord, ensuite, cela dit)",
        "Tells a personal experience combining passé composé and imparfait correctly",
        "Acknowledges the other option before concluding",
        "Stays between 120 and 160 words"
      ],
      "task_type": "lettre amicale"
    },
    "speaking": {
      "prompt_en": "Talk about a trip or an experience that changed you: what happened, how you felt and what you learned.",
      "prompt_fr": "Parlez d'un voyage ou d'une expérience qui vous a changé(e) : ce qui s'est passé, ce que vous avez ressenti et ce que vous avez appris.",
      "seconds": 60,
      "model_fr": "Alors, je vais vous parler d'un voyage qui m'a vraiment marquée. Il y a trois ans, je suis partie seule au Portugal pendant deux semaines. Au début, j'étais un peu stressée, parce que je ne parlais pas portugais et que je ne connaissais personne. Mais très vite, j'ai rencontré des gens super sympas dans les auberges de jeunesse. Un jour, on a fait une randonnée le long de la côte : c'était magnifique. Ce voyage m'a appris à avoir confiance en moi et à sortir de ma zone de confort. Aujourd'hui, quand j'ai un problème, je me dis : « Si j'ai réussi à voyager seule, je peux le faire ! » Et si j'avais l'occasion, j'y retournerais tout de suite.",
      "keywords": ["il y a", "je suis parti", "au début", "j'étais", "un jour", "j'ai rencontré", "m'a appris", "si j'avais", "finalement"]
    }
  },
  "B2": {
    "title": "Passage B2 → C1",
    "intro_en": "Prove you can argue, nuance your views and follow complex discussions about work and society.",
    "passMark": 0.75,
    "listening": [
      { "fr": "Bien que le projet ait pris du retard, la direction a décidé de maintenir la date de lancement prévue en mars.", "q": "Que décide la direction ?", "choices": ["Elle maintient le lancement en mars malgré le retard", "Elle reporte le lancement à cause du retard", "Elle annule le projet", "Elle avance la date de lancement"], "answer": "Elle maintient le lancement en mars malgré le retard" },
      { "fr": "Si j'avais su que la réunion était annulée, je ne serais pas venu exprès de Lille ce matin.", "q": "Que comprend-on ?", "choices": ["Il s'est déplacé de Lille pour rien", "Il n'est pas venu à la réunion", "Il savait que la réunion était annulée", "La réunion a eu lieu à Lille"], "answer": "Il s'est déplacé de Lille pour rien" },
      { "fr": "Franchement, le candidat avait un CV impressionnant, mais il n'a pas su répondre aux questions les plus simples.", "q": "Quel est l'avis de la personne sur le candidat ?", "choices": ["Elle est déçue : un bon CV mais un entretien raté", "Elle est enthousiaste : c'est le candidat idéal", "Elle n'a aucun avis", "Elle trouve son CV faible mais son entretien réussi"], "answer": "Elle est déçue : un bon CV mais un entretien raté" },
      { "fr": "Il faudrait qu'on revoie notre stratégie de communication avant que nos concurrents ne s'emparent du marché.", "q": "Pourquoi faut-il revoir la stratégie ?", "choices": ["Pour devancer les concurrents", "Parce que le budget a baissé", "Parce que les clients se plaignent", "Pour recruter de nouveaux employés"], "answer": "Pour devancer les concurrents" },
      { "fr": "Contrairement à ce qu'on pourrait croire, les jeunes diplômés ne cherchent pas avant tout un gros salaire, mais du sens dans leur travail.", "q": "Selon cette phrase, que recherchent surtout les jeunes diplômés ?", "choices": ["Un travail qui a du sens", "Un salaire élevé", "La sécurité de l'emploi", "Des horaires flexibles"], "answer": "Un travail qui a du sens" },
      { "fr": "J'avais à peine terminé ma présentation que le client m'a interrompue pour me demander une remise de quinze pour cent.", "q": "Que s'est-il passé ?", "choices": ["Dès la fin de sa présentation, le client a réclamé une remise", "Le client a refusé d'écouter la présentation", "Elle a proposé elle-même une remise de 15 %", "Le client a écouté sans rien dire"], "answer": "Dès la fin de sa présentation, le client a réclamé une remise" },
      { "fr": "Les syndicats ont appelé à la grève jeudi ; la circulation des RER devrait être fortement perturbée toute la journée.", "q": "Quelle conséquence est annoncée ?", "choices": ["D'importantes perturbations sur le RER jeudi", "Le RER sera gratuit jeudi", "Les syndicats ont annulé la grève", "Le trafic sera normal, sauf le matin"], "answer": "D'importantes perturbations sur le RER jeudi" },
      { "fr": "Ce n'est pas que je refuse de t'aider, c'est juste que j'ai un dossier à rendre avant ce soir.", "q": "Quelle est l'attitude de la personne ?", "choices": ["Elle ne refuse pas d'aider, mais elle manque de temps", "Elle refuse catégoriquement d'aider", "Elle a déjà terminé son dossier", "Elle demande elle-même de l'aide"], "answer": "Elle ne refuse pas d'aider, mais elle manque de temps" }
    ],
    "dictation": [
      "Bien qu'elle soit très compétente, elle n'a pas obtenu le poste qu'elle espérait.",
      "Les décisions que la direction a prises hier ont surpris l'ensemble des salariés.",
      "Si nous avions anticipé la crise, nous aurions pu éviter de nombreux licenciements.",
      "Il faut que vous preniez rendez-vous avant que le service ne ferme ses portes."
    ],
    "grammar": [
      { "q": "Il faut que tu ___ ce rapport avant midi.", "choices": ["finisses", "finis", "finiras", "finirais"], "answer": "finisses", "why": "« Il faut que » est toujours suivi du subjonctif." },
      { "q": "Je doute qu'il ___ raison.", "choices": ["ait", "a", "aura", "avait"], "answer": "ait", "why": "Les verbes de doute (douter que) entraînent le subjonctif." },
      { "q": "Quand je suis arrivé à la gare, le train ___ déjà.", "choices": ["était parti", "est parti", "partait", "sera parti"], "answer": "était parti", "why": "Plus-que-parfait : action accomplie avant une autre action passée." },
      { "q": "Si tu m'avais prévenu, je ___ te chercher.", "choices": ["serais venu", "viendrais", "serai venu", "venais"], "answer": "serais venu", "why": "Si + plus-que-parfait → conditionnel passé (irréel du passé)." },
      { "q": "Il m'a dit qu'il ___ le lendemain.", "choices": ["viendrait", "viendra", "vient", "venait"], "answer": "viendrait", "why": "Concordance des temps : le futur dans le passé s'exprime au conditionnel présent." },
      { "q": "___ la pluie, le match a été maintenu.", "choices": ["Malgré", "Bien que", "Quoique", "Puisque"], "answer": "Malgré", "why": "« Malgré » se construit avec un nom ; bien que, quoique et puisque introduisent une proposition." },
      { "q": "Il a énormément travaillé ; ___, il a brillamment réussi son examen.", "choices": ["par conséquent", "pourtant", "en revanche", "néanmoins"], "answer": "par conséquent", "why": "Le lien est une conséquence, pas une opposition." },
      { "q": "Je suis ravi que vous ___ venus.", "choices": ["soyez", "êtes", "serez", "étiez"], "answer": "soyez", "why": "L'expression d'un sentiment (être ravi que) exige le subjonctif." },
      { "q": "Elle est partie sans que nous ___ lui dire au revoir.", "choices": ["ayons pu", "avons pu", "aurions pu", "pouvions"], "answer": "ayons pu", "why": "« Sans que » est suivi du subjonctif (ici passé)." },
      { "q": "C'est un projet ___ je suis particulièrement fier.", "choices": ["dont", "que", "lequel", "où"], "answer": "dont", "why": "Être fier de quelque chose → pronom relatif dont." }
    ],
    "reading": {
      "title": "Faut-il en finir avec les open spaces ?",
      "genre": "article d'opinion",
      "text_fr": "Il y a vingt ans, l'open space incarnait la modernité. Fini les bureaux cloisonnés et les portes fermées : place à la transparence, à la circulation des idées et à la collaboration spontanée. Les entreprises y voyaient aussi, il faut bien le dire, un moyen efficace de réduire leurs coûts immobiliers.\n\nAujourd'hui, le bilan est pour le moins mitigé. Plusieurs études montrent que les salariés installés dans de grands plateaux ouverts échangent paradoxalement moins en face à face que leurs collègues disposant de bureaux individuels. Pour échapper au bruit et aux regards, beaucoup se réfugient derrière leur casque audio ou communiquent par messagerie avec un voisin assis à deux mètres. Quant à la concentration, elle souffre : selon certains chercheurs, il faudrait plus de vingt minutes pour retrouver pleinement le fil de sa pensée après une interruption.\n\nFaut-il pour autant revenir au bureau fermé ? Rien n'est moins sûr. La généralisation du télétravail a profondément changé la donne. Si les salariés viennent désormais au bureau deux ou trois jours par semaine, ce n'est plus pour accomplir des tâches qu'ils peuvent effectuer chez eux, mais pour rencontrer leurs collègues, échanger et créer du lien. Dans cette perspective, l'espace de travail doit devenir un lieu de rencontre plutôt qu'une simple juxtaposition de postes.\n\nC'est pourquoi de nombreuses entreprises misent sur le « flex office » : des zones calmes pour se concentrer, des salles pour les réunions, des espaces conviviaux pour les échanges informels. Encore faut-il que ces aménagements répondent aux besoins réels des équipes, et non à une simple logique d'économies. Car un bureau mal pensé, qu'il soit ouvert ou fermé, finit toujours par coûter cher.",
      "questions": [
        { "q": "Selon l'auteur, quelle motivation moins avouable a favorisé l'essor des open spaces ?", "choices": ["La réduction des coûts immobiliers", "Le bien-être des salariés", "Le développement du télétravail", "La lutte contre le bruit"], "answer": "La réduction des coûts immobiliers", "why": "« il faut bien le dire » signale un aveu : réduire les coûts immobiliers." },
        { "q": "Quel paradoxe l'article met-il en évidence ?", "choices": ["En open space, les salariés échangent moins en face à face", "Les open spaces coûtent plus cher que les bureaux fermés", "Le télétravail multiplie les interruptions", "Les casques audio améliorent la communication orale"], "answer": "En open space, les salariés échangent moins en face à face", "why": "L'open space devait favoriser les échanges, mais on y échange « paradoxalement moins »." },
        { "q": "Pourquoi les salariés viennent-ils désormais au bureau, selon l'auteur ?", "choices": ["Pour rencontrer leurs collègues et créer du lien", "Pour se concentrer loin du bruit", "Pour accomplir leurs tâches habituelles", "Parce que le télétravail est interdit"], "answer": "Pour rencontrer leurs collègues et créer du lien", "why": "« ce n'est plus pour accomplir des tâches … mais pour rencontrer leurs collègues »." },
        { "q": "Dans le texte, « Rien n'est moins sûr » signifie :", "choices": ["C'est très douteux", "C'est absolument certain", "C'est sans importance", "C'est déjà décidé"], "answer": "C'est très douteux", "why": "L'expression exprime un fort doute sur la proposition qui précède." },
        { "q": "Quelle réserve l'auteur émet-il à propos du flex office ?", "choices": ["Il doit répondre aux besoins réels des équipes, pas seulement réduire les coûts", "Il est encore plus bruyant que l'open space", "Il rend le télétravail impossible", "Il coûte toujours plus cher qu'un open space"], "answer": "Il doit répondre aux besoins réels des équipes, pas seulement réduire les coûts", "why": "« Encore faut-il que ces aménagements répondent aux besoins réels des équipes, et non à une simple logique d'économies »." }
      ]
    },
    "writing": {
      "prompt_en": "Your company plans to remove all assigned desks and switch to flex office. As a staff representative, write a formal letter to the HR director expressing the staff's concerns and proposing alternatives.",
      "prompt_fr": "Votre entreprise prévoit de supprimer tous les bureaux attitrés pour passer au « flex office ». En tant que délégué(e) du personnel, écrivez une lettre formelle à la directrice des ressources humaines pour exprimer les inquiétudes des salariés et proposer des solutions.",
      "minWords": 200,
      "maxWords": 260,
      "model_fr": "Madame la Directrice,\n\nAu nom des salariés que je représente, je souhaite vous faire part de nos inquiétudes concernant le projet de passage au « flex office » annoncé lors de la réunion du 3 mars.\n\nNous comprenons parfaitement la volonté de l'entreprise de réduire ses coûts et de s'adapter au développement du télétravail. Néanmoins, la suppression de tous les postes attitrés soulève plusieurs difficultés. D'une part, de nombreux collègues craignent de ne pas trouver de place les jours de forte affluence, ce qui risquerait de créer des tensions inutiles. D'autre part, certains métiers, notamment au service comptable, exigent un environnement calme et un accès permanent à des dossiers confidentiels.\n\nC'est pourquoi nous souhaiterions que la direction envisage des solutions intermédiaires. Il serait par exemple possible de conserver des bureaux fixes pour les fonctions qui le justifient, tout en créant des espaces partagés pour les autres équipes. Par ailleurs, il nous paraît indispensable que les salariés soient consultés avant toute décision définitive, par le biais d'un questionnaire ou de groupes de travail.\n\nNous restons convaincus qu'un dialogue constructif permettra de concilier les objectifs économiques de l'entreprise et le bien-être de ses collaborateurs. Je me tiens à votre disposition pour en discuter lors d'un prochain rendez-vous.\n\nJe vous prie d'agréer, Madame la Directrice, l'expression de mes salutations distinguées.\n\nJulien Moreau\nDélégué du personnel",
      "checklist": [
        "Uses formal opening and closing formulas (Madame la Directrice, … Je vous prie d'agréer …)",
        "States the purpose of the letter in the first paragraph",
        "Acknowledges the company's position before objecting (Nous comprenons … Néanmoins …)",
        "Structures arguments with connectors (d'une part, d'autre part, par ailleurs, c'est pourquoi)",
        "Uses at least two subjunctives and one conditional for polite proposals",
        "Keeps a consistent formal register (vous, no colloquialisms)",
        "Stays between 200 and 260 words"
      ],
      "task_type": "lettre formelle"
    },
    "speaking": {
      "prompt_en": "Should French companies adopt the four-day week? Give arguments for and against, then conclude with your position.",
      "prompt_fr": "Les entreprises françaises devraient-elles adopter la semaine de quatre jours ? Présentez des arguments pour et contre, puis concluez en donnant votre position.",
      "seconds": 90,
      "model_fr": "Alors, la semaine de quatre jours, c'est un sujet qui fait beaucoup débat en ce moment. Personnellement, je pense que c'est une bonne idée, à condition qu'elle soit bien organisée.\n\nD'abord, les expériences menées en Islande ou au Royaume-Uni montrent que les salariés sont moins stressés et souvent plus productifs. Quand on a un jour de repos supplémentaire, on revient au travail plus motivé. Ensuite, c'est un vrai atout pour attirer les jeunes talents, qui accordent de plus en plus d'importance à l'équilibre entre vie professionnelle et vie privée.\n\nCela dit, il ne faut pas être naïf. Dans certains secteurs, comme la santé ou le commerce, il est difficile de fermer un jour de plus. Et si on condense trente-cinq heures sur quatre jours, les journées deviennent très longues, ce qui peut augmenter la fatigue.\n\nDonc, pour conclure, je dirais que la semaine de quatre jours n'est pas une solution miracle, mais qu'elle mérite d'être testée, secteur par secteur, en concertation avec les salariés.",
      "keywords": ["personnellement", "d'abord", "ensuite", "cela dit", "à condition", "équilibre", "vie privée", "stressés", "pour conclure"]
    }
  },
  "C1": {
    "title": "Passage C1 → C2",
    "intro_en": "Prove you can grasp implicit meaning, shifting registers and complex arguments with precision.",
    "passMark": 0.75,
    "listening": [
      { "fr": "Le ministre a beau répéter que la réforme ne touchera pas les classes moyennes, les économistes interrogés hier soir semblaient pour le moins sceptiques.", "q": "Quelle est la position des économistes ?", "choices": ["Ils doutent des affirmations du ministre", "Ils soutiennent pleinement la réforme", "Ils pensent que la réforme ne concerne que les plus riches", "Ils refusent de se prononcer"], "answer": "Ils doutent des affirmations du ministre" },
      { "fr": "Je ne dis pas que ton idée est mauvaise ; je dis simplement qu'avant de la présenter au comité, il vaudrait mieux en chiffrer le coût.", "q": "Que suggère la personne ?", "choices": ["Évaluer le coût de l'idée avant de la présenter", "Abandonner l'idée", "Présenter l'idée immédiatement", "Demander d'abord l'avis du comité"], "answer": "Évaluer le coût de l'idée avant de la présenter" },
      { "fr": "Il fut un temps où l'on achetait sa voiture pour la vie ; aujourd'hui, la location longue durée séduit près d'un ménage sur deux.", "q": "Quelle évolution est décrite ?", "choices": ["La location longue durée remplace progressivement l'achat", "Les ménages achètent de plus en plus de voitures", "La voiture n'intéresse plus personne", "Les voitures durent plus longtemps qu'avant"], "answer": "La location longue durée remplace progressivement l'achat" },
      { "fr": "Encore heureux qu'on ait réservé : à vingt heures, il n'y avait plus une seule table de libre, même en terrasse.", "q": "Que ressent la personne ?", "choices": ["Du soulagement d'avoir réservé", "De la colère contre le restaurant", "De la déception de dîner en terrasse", "De l'indifférence"], "answer": "Du soulagement d'avoir réservé" },
      { "fr": "Loin de freiner l'innovation, la contrainte budgétaire a obligé nos équipes à repenser entièrement leurs méthodes, avec des résultats inattendus.", "q": "Quel a été l'effet de la contrainte budgétaire ?", "choices": ["Elle a stimulé l'innovation", "Elle a bloqué tous les projets", "Elle a provoqué des licenciements", "Elle n'a eu aucun effet"], "answer": "Elle a stimulé l'innovation" },
      { "fr": "Ce roman, qui avait été boudé par la critique à sa sortie, est aujourd'hui considéré comme l'un des chefs-d'œuvre du vingtième siècle.", "q": "Comment le roman a-t-il été accueilli à sa sortie ?", "choices": ["La critique l'a dédaigné", "Il a été immédiatement salué", "Il a été censuré", "Il a obtenu un grand prix"], "answer": "La critique l'a dédaigné" },
      { "fr": "À supposer que les négociations aboutissent, l'accord ne saurait entrer en vigueur avant le printemps prochain.", "q": "Que signifie cette phrase ?", "choices": ["Même en cas d'accord, rien ne changera avant le printemps", "L'accord entre en vigueur immédiatement", "Les négociations ont déjà échoué", "L'accord s'appliquera dès cet hiver"], "answer": "Même en cas d'accord, rien ne changera avant le printemps" },
      { "fr": "Tu parles d'une réunion productive : deux heures de débat pour finalement reporter la décision au mois prochain !", "q": "Quel est le ton de la personne ?", "choices": ["Ironique", "Enthousiaste", "Neutre", "Reconnaissant"], "answer": "Ironique" }
    ],
    "dictation": [
      "Quoiqu'ils aient longuement hésité, les associés se sont finalement résolus à céder une partie de leurs parts.",
      "La réunion qu'on nous avait annoncée comme décisive s'est achevée sans qu'aucune mesure concrète ait été adoptée.",
      "Les efforts qu'il a fallu fournir pour redresser l'entreprise ont été considérables, mais ils ont porté leurs fruits.",
      "Elle s'est rendu compte trop tard que les chiffres qu'on lui avait transmis étaient erronés."
    ],
    "grammar": [
      { "q": "Il ___ la porte et sortit sans un mot.", "choices": ["ferma", "fermait", "fermera", "ferme"], "answer": "ferma", "why": "Récit au passé simple : deux actions successives et ponctuelles (ferma, sortit)." },
      { "q": "Dans « ils firent », on reconnaît le passé simple du verbe :", "choices": ["faire", "finir", "fuir", "fier"], "answer": "faire", "why": "Faire → je fis, ils firent ; finir donnerait « ils finirent », fuir « ils fuirent »." },
      { "q": "Le contrat ___ par les deux parties la semaine dernière.", "choices": ["a été signé", "a signé", "a été signée", "avait signé"], "answer": "a été signé", "why": "Voix passive (être + participe) ; le participe s'accorde avec « le contrat », masculin singulier." },
      { "q": "Elle m'a demandé : « Où vas-tu ? » → Elle m'a demandé ___.", "choices": ["où j'allais", "où vais-je", "où j'irai", "si j'allais où"], "answer": "où j'allais", "why": "Discours indirect au passé : pas d'inversion, et le présent devient imparfait." },
      { "q": "Il a déclaré : « Je partirai demain. » → Il a déclaré qu'il partirait ___.", "choices": ["le lendemain", "hier", "la veille", "aujourd'hui"], "answer": "le lendemain", "why": "Au discours indirect passé, « demain » devient « le lendemain »." },
      { "q": "Quelque brillants qu'ils ___, ils ont échoué.", "choices": ["soient", "sont", "seront", "étaient"], "answer": "soient", "why": "« Quelque + adjectif + que » (concession) se construit avec le subjonctif ; quelque est ici adverbe, donc invariable." },
      { "q": "Encore que les résultats ___ encourageants, la prudence reste de mise.", "choices": ["soient", "sont", "seront", "étaient"], "answer": "soient", "why": "La locution concessive « encore que » appelle le subjonctif." },
      { "q": "Le projet est ambitieux ; ___, son financement reste incertain.", "choices": ["toutefois", "ainsi", "c'est-à-dire", "autrement dit"], "answer": "toutefois", "why": "Le rapport est d'opposition : « toutefois » introduit une restriction." },
      { "q": "Il a agi de la sorte ___ éviter tout malentendu.", "choices": ["afin d'", "de sorte qu'", "pour que", "faute d'"], "answer": "afin d'", "why": "But avec infinitif et même sujet : afin de ; de sorte que et pour que exigent une proposition conjuguée." },
      { "q": "Elle ___ licencier après dix ans de service.", "choices": ["s'est fait", "s'est faite", "a été fait", "s'est fait été"], "answer": "s'est fait", "why": "« Se faire + infinitif » : le participe « fait » reste invariable." }
    ],
    "reading": {
      "title": "L'éloge de la lenteur, nouveau produit de luxe ?",
      "genre": "éditorial",
      "text_fr": "Il est des paradoxes que notre époque cultive avec une constance admirable. Après avoir passé deux décennies à vanter la vitesse – livraisons en dix minutes, réponses instantanées, carrières menées tambour battant –, voilà que nous redécouvrons, émerveillés, les vertus de la lenteur. Les librairies regorgent de manuels consacrés à la « déconnexion », les agences de voyage proposent des retraites silencieuses au fond des Cévennes, et les cadres les plus pressés s'initient à la méditation entre deux conférences téléphoniques.\n\nOn pourrait s'en réjouir. Qui contesterait qu'il soit sain de lever le pied, de réapprendre à lire un livre d'une traite ou à dîner sans consulter son téléphone ? Le problème n'est pas l'aspiration elle-même, mais ce qu'elle est en train de devenir : un marqueur social. Car la lenteur, aujourd'hui, se paie, et elle se paie cher. Le stage de « digital detox » dans un monastère réaménagé coûte l'équivalent d'un mois de salaire minimum ; le droit de ne pas répondre à ses courriels le soir reste, dans les faits, l'apanage de ceux qui occupent des postes suffisamment élevés pour se permettre de faire attendre les autres.\n\nPendant ce temps, le livreur à vélo, la caissière aux horaires fragmentés ou l'auto-entrepreneur suspendu à son application n'ont guère le loisir de méditer sur le sens du temps. Leur rythme est précisément celui qui permet aux premiers de ralentir. On ne se fait pas livrer un dîner en vingt minutes sans que quelqu'un, quelque part, pédale sous la pluie. Autrement dit, la lenteur des uns repose, pour une large part, sur l'accélération des autres.\n\nFaut-il pour autant jeter le bébé avec l'eau du bain ? Certainement pas. Mais si nous voulons que le temps retrouvé ne soit pas un privilège de plus, il faudra cesser d'en faire une affaire de choix individuel et de consommation. Le droit à la déconnexion, la régulation des cadences, la protection des travailleurs des plateformes sont des questions politiques, non des options de bien-être. Ralentir, oui ; mais ensemble, ou pas du tout.",
      "questions": [
        { "q": "Quel est le ton du premier paragraphe ?", "choices": ["Ironique", "Lyrique", "Neutre et descriptif", "Indigné"], "answer": "Ironique", "why": "« constance admirable », « émerveillés », les cadres qui méditent « entre deux conférences » : l'auteur se moque doucement du paradoxe." },
        { "q": "Quelle est la thèse principale de l'auteur ?", "choices": ["La lenteur est devenue un privilège social qui repose sur l'accélération des autres", "La lenteur est une mode passagère sans intérêt", "Il faut interdire la livraison à domicile", "La méditation améliore la productivité des cadres"], "answer": "La lenteur est devenue un privilège social qui repose sur l'accélération des autres", "why": "Voir « un marqueur social » et « la lenteur des uns repose … sur l'accélération des autres »." },
        { "q": "Que sous-entend l'expression « l'apanage de ceux qui occupent des postes suffisamment élevés » ?", "choices": ["Seuls les salariés haut placés peuvent réellement se déconnecter", "Les cadres travaillent davantage que les autres", "Le droit à la déconnexion est appliqué partout de la même manière", "Les cadres refusent de se déconnecter"], "answer": "Seuls les salariés haut placés peuvent réellement se déconnecter", "why": "Un « apanage » est un privilège réservé : dans les faits, le droit théorique profite aux plus puissants." },
        { "q": "En écrivant « Faut-il pour autant jeter le bébé avec l'eau du bain ? », l'auteur veut dire :", "choices": ["Qu'il ne faut pas rejeter l'idée de ralentir malgré ses dérives", "Qu'il faut renoncer complètement à l'éloge de la lenteur", "Que les familles devraient ralentir en priorité", "Que la question est sans importance"], "answer": "Qu'il ne faut pas rejeter l'idée de ralentir malgré ses dérives", "why": "L'expression signifie : ne pas sacrifier l'essentiel en voulant éliminer le défaut ; il répond d'ailleurs « Certainement pas »." },
        { "q": "Quelle solution l'auteur préconise-t-il ?", "choices": ["Faire de la lenteur une question politique et collective", "Encourager chacun à s'offrir des stages de déconnexion", "Interdire les applications de livraison", "Laisser les entreprises décider seules"], "answer": "Faire de la lenteur une question politique et collective", "why": "« des questions politiques, non des options de bien-être » ; « Ralentir, oui ; mais ensemble »." }
      ]
    },
    "writing": {
      "prompt_en": "Write a structured argumentative essay: « Is professional success still a central value for younger generations? »",
      "prompt_fr": "Rédigez un essai argumenté et structuré sur le sujet suivant : « La réussite professionnelle est-elle encore une valeur centrale pour les jeunes générations ? »",
      "minWords": 250,
      "maxWords": 320,
      "model_fr": "Longtemps, la réussite professionnelle a constitué l'horizon naturel de toute existence accomplie : un bon diplôme, un poste stable, une ascension progressive. Or, à en croire les nombreuses enquêtes consacrées aux jeunes actifs, ce modèle semble aujourd'hui s'essouffler. Faut-il pour autant conclure que le travail a cessé d'être une valeur centrale ?\n\nIl est indéniable que les attentes ont évolué. Les jeunes diplômés n'hésitent plus à quitter un emploi bien rémunéré s'ils le jugent dépourvu de sens, et l'équilibre entre vie professionnelle et vie personnelle figure désormais parmi leurs premiers critères de choix. Les réseaux sociaux regorgent d'ailleurs de témoignages de jeunes cadres ayant tout quitté pour ouvrir une boulangerie ou devenir artisans. Le phénomène de la « grande démission », observé après la crise sanitaire, en témoigne : la loyauté envers l'entreprise ne va plus de soi.\n\nToutefois, il serait hâtif d'y voir un désintérêt pour le travail. Ce que rejettent ces jeunes, c'est moins la réussite elle-même qu'une certaine définition de celle-ci, fondée sur le statut et le salaire. Nombre d'entre eux s'investissent au contraire intensément dans des projets entrepreneuriaux, associatifs ou écologiques, pourvu qu'ils y trouvent une utilité sociale. Autrement dit, ils ne veulent pas travailler moins : ils veulent travailler autrement. Loin de disparaître, l'ambition se déplace.\n\nEn définitive, la réussite professionnelle demeure une valeur importante, mais elle a cessé d'être un absolu. Elle s'inscrit désormais dans une quête plus large d'épanouissement et de cohérence personnelle. Reste aux entreprises à prendre la mesure de cette mutation : celles qui sauront offrir du sens, de l'autonomie et de la souplesse attireront les talents de demain ; les autres risquent de les voir partir aussi vite qu'ils sont arrivés.",
      "checklist": [
        "Introduces the topic and states a clear problématique as a question",
        "Follows a dialectical structure (observation, nuance, synthesis)",
        "Uses advanced connectors (or, toutefois, autrement dit, en définitive, loin de …)",
        "Supports each idea with concrete examples or social phenomena",
        "Uses at least two concessive or subjunctive structures (pourvu que, bien que, il serait hâtif de …)",
        "Concludes with a nuanced answer and an opening (ouverture)",
        "Stays between 250 and 320 words"
      ],
      "task_type": "essai argumenté"
    },
    "speaking": {
      "prompt_en": "Present and discuss the question: « Should smartphones be banned at school? » Weigh both sides and give a nuanced position.",
      "prompt_fr": "Présentez et discutez la question suivante : « Faut-il interdire les smartphones à l'école ? » Pesez le pour et le contre, puis exprimez une position nuancée.",
      "seconds": 120,
      "model_fr": "Alors, la question de l'interdiction des smartphones à l'école revient régulièrement dans le débat public, et elle est d'autant plus sensible que la plupart des adolescents possèdent aujourd'hui un téléphone dès l'entrée au collège.\n\nD'un côté, les arguments en faveur de l'interdiction sont assez convaincants. Plusieurs études ont montré que la simple présence d'un téléphone sur la table nuit à la concentration. On sait aussi que le harcèlement en ligne se prolonge souvent dans la cour de récréation, et inversement. Interdire les portables, ce serait donc protéger à la fois l'attention des élèves et leur bien-être.\n\nCela étant, je ne suis pas sûr qu'une interdiction pure et simple règle le problème. D'abord, elle est difficile à faire respecter : les élèves trouvent toujours le moyen de la contourner. Ensuite, et c'est à mon avis le point essentiel, l'école a aussi pour mission d'apprendre aux jeunes à se servir intelligemment de ces outils. Si on les bannit complètement, on renonce en quelque sorte à cette éducation au numérique.\n\nDonc, ma position serait plutôt nuancée : oui à une interdiction pendant les cours et les récréations au collège, mais à condition qu'elle s'accompagne de véritables séances consacrées aux usages responsables, à l'esprit critique face aux réseaux sociaux et à la gestion du temps d'écran. Au fond, il ne s'agit pas tant de diaboliser la technologie que d'apprendre à en garder la maîtrise.",
      "keywords": ["d'un côté", "cela étant", "à mon avis", "nuancée", "à condition", "esprit critique", "concentration", "il ne s'agit pas tant", "au fond"]
    }
  },
  "C2": {
    "title": "Passage C2 → Natif",
    "intro_en": "Prove near-native mastery: literary nuance, subtle registers and fast, dense argumentation.",
    "passMark": 0.8,
    "listening": [
      { "fr": "Qu'on ne vienne pas me dire, après ça, que la concertation a eu lieu : on nous a présenté un projet bouclé, à prendre ou à laisser, la veille du vote.", "q": "Que reproche le locuteur ?", "choices": ["Une concertation de pure façade, la décision étant déjà prise", "L'absence totale de projet", "Un vote organisé trop tard", "Le refus des syndicats de négocier"], "answer": "Une concertation de pure façade, la décision étant déjà prise" },
      { "fr": "Il n'est pas exclu que le conseil revienne sur sa décision, pour peu que les actionnaires minoritaires parviennent à s'entendre d'ici l'assemblée générale.", "q": "Que laisse entendre cette phrase ?", "choices": ["Un revirement reste possible, sous condition", "Le conseil a définitivement tranché", "Les actionnaires minoritaires se sont déjà entendus", "L'assemblée générale est annulée"], "answer": "Un revirement reste possible, sous condition" },
      { "fr": "Elle a eu l'élégance de ne pas relever la remarque, mais à la façon dont elle a refermé son dossier, on a tous compris que, pour elle, la réunion était terminée.", "q": "Que comprend-on de son attitude ?", "choices": ["Elle était froissée, mais l'a fait sentir sans un mot", "Elle n'avait pas entendu la remarque", "Elle a répondu vivement à la remarque", "Elle était satisfaite de la réunion"], "answer": "Elle était froissée, mais l'a fait sentir sans un mot" },
      { "fr": "Ce n'est pas tant le prix qui me dérange que cette manie de nous vendre comme une révolution ce qui n'est, au fond, qu'une mise à jour cosmétique.", "q": "Qu'est-ce qui agace surtout le locuteur ?", "choices": ["Un discours marketing exagéré", "Un prix trop élevé", "L'absence de mise à jour", "La complexité du produit"], "answer": "Un discours marketing exagéré" },
      { "fr": "On aurait tort de ne voir dans ce recueil qu'une suite de souvenirs d'enfance : sous la légèreté apparente affleure une méditation assez sombre sur la perte et l'exil.", "q": "Que pense le critique de ce recueil ?", "choices": ["Sa légèreté apparente cache une réflexion grave", "C'est un livre léger et sans profondeur", "C'est un essai politique sur l'immigration", "C'est un roman d'aventures"], "answer": "Sa légèreté apparente cache une réflexion grave" },
      { "fr": "Je veux bien croire à sa bonne foi, mais avouez que démissionner deux jours avant la publication des comptes, ça tombe drôlement bien.", "q": "Que sous-entend le locuteur ?", "choices": ["Il soupçonne un lien entre la démission et les comptes", "Il est convaincu de la bonne foi de la personne", "Il pense que les comptes sont excellents", "Il approuve sans réserve cette démission"], "answer": "Il soupçonne un lien entre la démission et les comptes" },
      { "fr": "À force de vouloir ménager la chèvre et le chou, le gouvernement a fini par mécontenter tout le monde, y compris ses propres soutiens.", "q": "Que reproche-t-on au gouvernement ?", "choices": ["D'avoir voulu satisfaire tous les camps sans trancher", "D'avoir pris une décision trop radicale", "D'avoir négligé le monde agricole", "D'avoir favorisé ses soutiens"], "answer": "D'avoir voulu satisfaire tous les camps sans trancher" },
      { "fr": "Sans vouloir jouer les Cassandre, je crains que l'on ne sous-estime gravement l'ampleur de la dette que nous laissons aux générations futures.", "q": "Quelle est l'attitude du locuteur ?", "choices": ["Il exprime une vive inquiétude tout en se défendant d'être alarmiste", "Il est optimiste quant à l'avenir", "Il accuse les générations futures", "Il refuse d'aborder la question de la dette"], "answer": "Il exprime une vive inquiétude tout en se défendant d'être alarmiste" }
    ],
    "dictation": [
      "Quelles que soient les difficultés qu'ils ont rencontrées, ils ne se sont jamais plaints, ce qui force l'admiration de leurs proches.",
      "Bien qu'il ait affirmé le contraire, il est évident qu'il était au courant des malversations dont l'entreprise s'était rendue coupable.",
      "Les quelques heures qu'elle a passées à relire ce manuscrit lui ont permis de déceler des incohérences que personne n'avait remarquées.",
      "Il eût été préférable que les responsables se fussent concertés avant de prendre des décisions aussi lourdes de conséquences."
    ],
    "grammar": [
      { "q": "Dans « Il fallait qu'il sût la vérité », la forme « sût » est :", "choices": ["un subjonctif imparfait", "un passé simple", "un conditionnel passé", "un subjonctif présent"], "answer": "un subjonctif imparfait", "why": "L'accent circonflexe distingue le subjonctif imparfait (qu'il sût) du passé simple (il sut)." },
      { "q": "Je crains qu'il ___ trop tard.", "choices": ["ne soit", "n'est", "ne sera", "soit pas"], "answer": "ne soit", "why": "« Craindre que » exige le subjonctif, volontiers précédé du ne explétif (sans valeur négative) en registre soutenu." },
      { "q": "Elle est bien plus compétente qu'on ___ le pense.", "choices": ["ne", "pas", "n'en", "y"], "answer": "ne", "why": "Ne explétif après un comparatif d'inégalité : « plus … qu'on ne le pense »." },
      { "q": "Peut-être ___ raison, mais il s'y prend fort mal.", "choices": ["a-t-il", "il a", "a-il", "il a-t-il"], "answer": "a-t-il", "why": "En tête de phrase, « peut-être » entraîne l'inversion du sujet en langue soignée (ou « peut-être que »), avec le -t- euphonique." },
      { "q": "___ brillante qu'elle soit, elle reste d'une grande modestie.", "choices": ["Toute", "Tout", "Tous", "Toutes"], "answer": "Toute", "why": "« Tout » adverbe s'accorde devant un adjectif féminin commençant par une consonne ou un h aspiré." },
      { "q": "Cette réforme est ___ réduire les inégalités.", "choices": ["censée", "sensée", "censé", "sensé"], "answer": "censée", "why": "Censé(e) = supposé(e) ; sensé(e) = raisonnable. Accord avec « réforme »." },
      { "q": "Ce mot est pris ici dans son ___ juridique.", "choices": ["acception", "acceptation", "exception", "accession"], "answer": "acception", "why": "Une acception est le sens particulier d'un mot ; l'acceptation est le fait d'accepter." },
      { "q": "Quoi qu'il en ___, nous maintiendrons notre offre.", "choices": ["soit", "est", "sera", "serait"], "answer": "soit", "why": "Locution figée « quoi qu'il en soit », au subjonctif." },
      { "q": "___ vous fassiez, faites-le avec rigueur.", "choices": ["Quoi que", "Quoique", "Quelque", "Quel que"], "answer": "Quoi que", "why": "« Quoi que » (en deux mots) = quelle que soit la chose que ; « quoique » = bien que." },
      { "q": "Lequel de ces énoncés relève du registre soutenu ?", "choices": ["Je ne saurais vous dire combien je vous suis reconnaissant.", "Je sais pas comment te remercier.", "Merci mille fois, c'est trop sympa.", "Je vous remercie beaucoup pour tout."], "answer": "Je ne saurais vous dire combien je vous suis reconnaissant.", "why": "« Je ne saurais » (conditionnel de savoir sans « pas ») et « être reconnaissant » marquent le registre soutenu." }
    ],
    "reading": {
      "title": "Les jeudis de la rue Jacob",
      "genre": "extrait littéraire",
      "text_fr": "Ma tante Hélène recevait comme d'autres font la guerre : avec méthode, sans illusions et en comptant les pertes. Chaque premier jeudi du mois, depuis plus de quarante ans, une douzaine de convives franchissaient le seuil de son appartement de la rue Jacob, où rien n'avait bougé depuis la mort de mon oncle, sinon la poussière, qu'une domestique hors d'âge déplaçait avec une lenteur cérémonieuse.\n\nOn y croisait d'anciens ministres dont plus personne ne se rappelait le portefeuille, des romanciers qui n'écrivaient plus et des critiques qui ne lisaient plus guère, tous unis par la conviction tranquille que le monde avait cessé d'être intéressant le jour où ils avaient cessé d'y jouer un rôle. Ma tante présidait cette assemblée de fantômes avec une bienveillance dont il eût été imprudent de sonder la sincérité. Elle avait l'art de poser à chacun la seule question qui le flattait, puis de feindre d'écouter la réponse en surveillant, du coin de l'œil, le niveau des verres.\n\nJ'avais vingt ans, j'étais pauvre, et j'étais là pour faire nombre. On m'avait placé, ce soir-là, entre un académicien sourd et une veuve qui me parla de son chien avec une ferveur qu'elle n'avait sans doute jamais accordée à son mari. De temps à autre, l'académicien se penchait vers moi pour me demander, d'une voix de stentor, si j'avais lu le dernier livre de Chardonne, et je hochais la tête avec une conviction d'autant plus grande que je n'en avais jamais ouvert un seul. Je m'ennuyais avec application, persuadé que l'ennui, dans ce genre de lieux, était le prix à payer pour avoir un jour quelque chose à raconter.\n\nCe n'est que bien plus tard que je compris ce qui se jouait sous mes yeux. Ces dîners n'étaient pas des réceptions : c'étaient des répétitions. Chaque mois, ma tante vérifiait qui était encore vivant, qui avait vieilli, qui s'était brouillé avec qui, et elle ajustait en conséquence le plan de table de ses propres funérailles, qu'elle voulait, disait-elle, « sobres mais bien fréquentées ». Rien n'était laissé au hasard : ni les préséances, ni les inimitiés, ni même les silences.\n\nElle mourut un jeudi, évidemment. L'église était comble. Au premier rang, l'académicien, toujours sourd, demandait à voix haute qui était mort. Il ne manquait personne, sinon elle, et je crois bien qu'elle l'aurait regretté : jamais elle n'avait réuni une aussi belle assistance.",
      "questions": [
        { "q": "Que suggère la comparaison initiale « recevait comme d'autres font la guerre » ?", "choices": ["Ses dîners relevaient du calcul stratégique plus que du plaisir", "Elle avait un tempérament violent", "Elle ne recevait que d'anciens militaires", "Ses dîners se terminaient souvent en disputes"], "answer": "Ses dîners relevaient du calcul stratégique plus que du plaisir", "why": "« avec méthode, sans illusions et en comptant les pertes » : la réception est une opération planifiée." },
        { "q": "Quel regard le narrateur porte-t-il sur les convives ?", "choices": ["Ironique : des gloires déchues persuadées de leur importance", "Admiratif : les grands esprits de leur temps", "Haineux : il les méprise ouvertement", "Neutre : il se contente de les énumérer"], "answer": "Ironique : des gloires déchues persuadées de leur importance", "why": "Ministres oubliés, romanciers qui n'écrivent plus, « assemblée de fantômes » : l'ironie est mordante mais feutrée." },
        { "q": "« Une bienveillance dont il eût été imprudent de sonder la sincérité » signifie que :", "choices": ["La bienveillance de la tante était probablement de façade", "La tante était d'une générosité sincère", "Les invités se méfiaient d'elle à tort", "Il était interdit de parler de sincérité chez elle"], "answer": "La bienveillance de la tante était probablement de façade", "why": "La litote suggère qu'un examen attentif aurait révélé une bienveillance calculée." },
        { "q": "Selon le narrateur devenu adulte, quelle était la véritable fonction de ces dîners ?", "choices": ["Préparer, en quelque sorte, ses propres funérailles", "Trouver un bon parti pour le narrateur", "Relancer la carrière des invités", "Honorer la mémoire de l'oncle"], "answer": "Préparer, en quelque sorte, ses propres funérailles", "why": "« c'étaient des répétitions » ; elle ajustait « le plan de table de ses propres funérailles »." },
        { "q": "Quel effet produit la chute du texte ?", "choices": ["Un humour noir qui prolonge l'ironie du portrait", "Une émotion purement tragique", "Une critique de l'Église", "Un retour au ton neutre du début"], "answer": "Un humour noir qui prolonge l'ironie du portrait", "why": "L'académicien qui demande qui est mort et la « belle assistance » qu'elle regretterait : la mort même devient sa dernière réception réussie." }
      ]
    },
    "writing": {
      "prompt_en": "Write an op-ed (tribune) for a national newspaper on the question: « Will artificial intelligence kill creativity? » Take a clear, nuanced stance with rhetorical flair.",
      "prompt_fr": "Rédigez une tribune pour un quotidien national sur la question : « L'intelligence artificielle va-t-elle tuer la créativité ? » Défendez une position claire et nuancée, avec un véritable souffle rhétorique.",
      "minWords": 300,
      "maxWords": 380,
      "model_fr": "L'IA ne tuera pas la créativité ; elle tuera la paresse qui se faisait passer pour elle\n\nÀ chaque révolution technique, son cortège de prophètes de malheur. La photographie devait tuer la peinture, le cinéma le théâtre, la télévision le livre. Aucune de ces disparitions annoncées n'a eu lieu ; toutes ont pourtant profondément transformé les arts qu'elles prétendaient menacer. Il serait étonnant que l'intelligence artificielle fasse exception.\n\nReconnaissons d'emblée ce que l'inquiétude a de légitime. Lorsqu'un logiciel produit en quelques secondes, et de façon tout à fait honorable, une illustration, un slogan ou une mélodie, ce sont des métiers entiers qui vacillent : graphistes, traducteurs, rédacteurs publicitaires voient leur travail dévalué, parfois du jour au lendemain. Feindre de l'ignorer au nom du progrès serait aussi naïf que cynique.\n\nMais il convient de distinguer la production de la création. Ce que la machine imite à la perfection, c'est la moyenne : l'image attendue, la phrase convenue, le refrain qui ressemble à tous les autres. En cela, elle ne menace guère que ce qui, dans nos pratiques, relevait déjà de la répétition. La véritable création, elle, naît de l'écart, de l'accident, d'une expérience singulière du monde qu'aucun algorithme, nourri de ce qui a déjà été fait, ne saurait reproduire.\n\nParadoxalement, l'IA pourrait donc nous contraindre à redevenir exigeants. Si le banal est désormais gratuit et illimité, seul l'inattendu conservera de la valeur. L'artiste de demain ne sera pas celui qui refuse l'outil, ni celui qui s'y abandonne, mais celui qui saura s'en servir pour aller là où la machine ne va pas.\n\nEncore faut-il que nous en ayons les moyens. Protéger les droits des auteurs dont les œuvres alimentent ces modèles, soutenir les métiers fragilisés, apprendre aux jeunes générations à penser avant de générer : voilà les vrais chantiers. La créativité n'est pas en danger de mort ; elle est sommée de se réinventer. Ce n'est pas la première fois, et ce n'est sans doute pas la pire des nouvelles.",
      "checklist": [
        "Has a striking title and a strong opening hook (accroche)",
        "Defends a clear, nuanced thesis rather than a simple yes/no",
        "Explicitly concedes the opposing view before refuting it",
        "Uses soutenu structures (inversion, ne … guère, ne saurait, encore faut-il)",
        "Uses rhetorical devices (antithesis, enumeration, paradox, formula)",
        "Ends with concrete proposals and a memorable closing line (chute)",
        "Stays between 300 and 380 words"
      ],
      "task_type": "tribune"
    },
    "speaking": {
      "prompt_en": "Comment on this quotation by Albert Camus: « Mal nommer un objet, c'est ajouter au malheur de ce monde. » Explain it, illustrate it and qualify it.",
      "prompt_fr": "Commentez cette phrase d'Albert Camus : « Mal nommer un objet, c'est ajouter au malheur de ce monde. » Expliquez-la, illustrez-la par des exemples et nuancez-la.",
      "seconds": 150,
      "model_fr": "Cette phrase d'Albert Camus, tirée d'un article de 1944, est devenue presque proverbiale, et l'on comprend pourquoi : elle condense en quelques mots une idée vertigineuse, à savoir que le langage n'est jamais neutre.\n\nAu premier abord, on pourrait n'y voir qu'une exigence de précision, presque une remarque de grammairien. Mais Camus va beaucoup plus loin. Il suggère que mal nommer, c'est déjà agir sur le réel, et souvent le dégrader. Pensez aux euphémismes du langage politique ou managérial : quand on parle de « plan de sauvegarde de l'emploi » pour désigner des licenciements, ou de « dommages collatéraux » pour évoquer des victimes civiles, on ne se contente pas d'adoucir la réalité, on la rend acceptable, on anesthésie l'indignation.\n\nÀ l'inverse, nommer juste, c'est rendre visible. Bien des combats ont commencé par l'invention d'un mot : parler de « harcèlement » ou de « féminicide », c'est sortir certaines violences du registre du fait divers pour les inscrire dans celui du problème collectif.\n\nCela dit, je nuancerais un peu le propos. Le mot juste n'existe pas toujours, et vouloir tout nommer avec une précision absolue peut aussi conduire à une forme de rigidité, voire de police du langage. La langue vit de ses approximations, de ses métaphores, de ses ambiguïtés, et la littérature, justement, en tire sa richesse.\n\nPour conclure, je dirais que cette phrase nous rappelle une responsabilité plutôt qu'une règle : celle de nous demander, chaque fois que nous parlons, si nos mots éclairent le réel ou s'ils servent à le masquer. Et à une époque saturée de communication, cette vigilance me semble plus nécessaire que jamais.",
      "keywords": ["euphémisme", "au premier abord", "à l'inverse", "cela dit", "je nuancerais", "langage", "réel", "responsabilité", "pour conclure"]
    }
  },
  "NATIF": {
    "title": "Le Grand Examen Natif",
    "intro_en": "Prove you understand French like a native: slang, irony, idioms, registers and real-speed speech.",
    "passMark": 0.8,
    "listening": [
      { "fr": "Franchement, chais pas ce qu'il a, Karim, en ce moment… Il répond plus aux messages, il vient plus aux soirées ; j'crois qu'il a un gros coup de mou.", "q": "Que pense le locuteur de Karim ?", "choices": ["Il traverse une période de déprime ou de grande fatigue", "Il est fâché contre ses amis", "Il a déménagé à l'étranger", "Il a trouvé un nouveau travail très prenant"], "answer": "Il traverse une période de déprime ou de grande fatigue" },
      { "fr": "Attends, t'as vu le loyer ? Mille huit cents balles pour un trente mètres carrés à Montreuil… Non mais sérieux, ils se mouchent pas du coude, les proprios !", "q": "Quelle est la réaction du locuteur ?", "choices": ["Il trouve le loyer exorbitant et s'en indigne", "Il trouve que c'est une bonne affaire", "Il veut absolument visiter l'appartement", "Il trouve que Montreuil est trop loin"], "answer": "Il trouve le loyer exorbitant et s'en indigne" },
      { "fr": "Le stage ? Ouais, c'était top… On m'a fait faire des photocopies et le café pendant six mois. Franchement, j'ai appris plein de trucs, hein !", "q": "Que veut dire le locuteur ?", "choices": ["Le stage ne lui a presque rien appris", "Il a énormément appris pendant ce stage", "Il adore préparer le café", "Il espère être embauché dans cette entreprise"], "answer": "Le stage ne lui a presque rien appris" },
      { "fr": "Elle m'a posé un lapin pour la troisième fois ! La prochaine fois qu'elle me propose un ciné, je lui dis que j'ai piscine.", "q": "Que compte faire le locuteur ?", "choices": ["Trouver un prétexte pour refuser", "Aller nager avec elle", "Lui proposer un autre film", "L'attendre plus longtemps"], "answer": "Trouver un prétexte pour refuser" },
      { "fr": "Ouais, nan, c'est mort pour le resto, y a une queue de malade. On se fait un kebab vite fait et on file au concert ?", "q": "Que propose la personne ?", "choices": ["Renoncer au restaurant à cause de l'attente et manger sur le pouce", "Attendre devant le restaurant", "Annuler le concert", "Réserver le restaurant pour un autre soir"], "answer": "Renoncer au restaurant à cause de l'attente et manger sur le pouce" },
      { "fr": "Il est gentil, hein, Bertrand, vraiment… Mais bon, disons que c'est pas lui qui a inventé le fil à couper le beurre.", "q": "Que pense-t-on de Bertrand ?", "choices": ["Il n'est pas très futé", "C'est un inventeur talentueux", "Il est remarquablement organisé", "Il est méchant mais brillant"], "answer": "Il n'est pas très futé" },
      { "fr": "Le boss m'a passé un savon devant toute l'équipe parce que j'avais zappé le rendez-vous avec le client… La honte, j'savais plus où me mettre.", "q": "Que s'est-il passé ?", "choices": ["Son chef l'a sévèrement réprimandé en public pour un oubli", "Son chef l'a félicité devant l'équipe", "Il a offert un cadeau au client", "Il a raté son train pour aller voir le client"], "answer": "Son chef l'a sévèrement réprimandé en public pour un oubli" },
      { "fr": "Bon, ben, on va pas en faire tout un fromage : t'as cassé un verre, c'est pas la mort, y en a plein d'autres dans le placard.", "q": "Quelle est l'attitude du locuteur ?", "choices": ["Il dédramatise la situation", "Il est furieux", "Il exige qu'on rachète des verres", "Il propose du fromage pour le dîner"], "answer": "Il dédramatise la situation" }
    ],
    "dictation": [
      "Ils se sont succédé à la tribune sans qu'aucun d'eux eût le courage de dire tout haut ce que chacun pensait tout bas.",
      "Les cent euros que ce dîner m'a coûté ne valaient pas les trois heures d'ennui qu'il m'a fallu endurer.",
      "Quelque admirables que soient leurs intentions, ces gens-là se sont laissé berner par des promesses qu'ils auraient dû flairer.",
      "Elle s'est fait l'écho de rumeurs qui, pour invraisemblables qu'elles fussent, n'en ont pas moins semé le trouble."
    ],
    "grammar": [
      { "q": "Depuis son retour de vacances, Léa a le cafard. Cela signifie qu'elle :", "choices": ["a le moral à zéro", "a des insectes chez elle", "est très en colère", "a attrapé la grippe"], "answer": "a le moral à zéro", "why": "« Avoir le cafard » = être triste, mélancolique, déprimé." },
      { "q": "« Il est vraiment chelou, ce type. » Le mot « chelou » signifie :", "choices": ["louche, bizarre", "sympa, cool", "épuisé", "riche"], "answer": "louche, bizarre", "why": "« Chelou » est le verlan de « louche » : bizarre, suspect." },
      { "q": "« Arrête, t'es relou ! » Le mot « relou » signifie :", "choices": ["lourd, pénible", "drôle", "lent", "gentil"], "answer": "lourd, pénible", "why": "« Relou » est le verlan de « lourd » : agaçant, insistant." },
      { "q": "« C'était ouf, ce concert ! » Ici, « ouf » signifie :", "choices": ["incroyable, dingue", "raté", "ennuyeux", "trop court"], "answer": "incroyable, dingue", "why": "« Ouf » est le verlan de « fou » : extraordinaire, génial." },
      { "q": "Quel est l'équivalent soutenu de « Il se casse » (= il s'en va) ?", "choices": ["Il prend congé", "Il se barre", "Il se tire", "Il se brise"], "answer": "Il prend congé", "why": "« Se barrer » et « se tirer » sont familiers ; « se briser » est un faux ami littéral ; « prendre congé » est soutenu." },
      { "q": "Ce sac m'a coûté ___ !", "choices": ["un bras", "une jambe", "un pied", "une main"], "answer": "un bras", "why": "« Coûter un bras » (familier) = coûter très cher ; variante : coûter les yeux de la tête." },
      { "q": "Quelle phrase emploie correctement « éventuellement » ?", "choices": ["Si nécessaire, nous pourrons éventuellement reporter la réunion.", "Après des mois d'efforts, il a éventuellement réussi.", "Éventuellement, tout le monde finit par vieillir.", "Il est éventuellement devenu directeur en 2010."], "answer": "Si nécessaire, nous pourrons éventuellement reporter la réunion.", "why": "Faux ami : « éventuellement » = le cas échéant, peut-être ; jamais « finalement » (eventually)." },
      { "q": "Tu arrives à 10 h 30 pour une réunion prévue à 9 h. Ta collègue lance avec un sourire : « Ah, t'es en avance, toi, aujourd'hui ! » Elle :", "choices": ["se moque gentiment de ton retard", "te félicite sincèrement", "croit que la réunion commence à 11 h", "ne sait pas quelle heure il est"], "answer": "se moque gentiment de ton retard", "why": "Antiphrase ironique : on dit le contraire de ce qu'on pense pour souligner le retard." },
      { "q": "À l'oral familier, « Je ne sais pas, il n'y a personne » se prononce le plus souvent :", "choices": ["Chais pas, y a personne.", "Je sais pas, il a personne.", "Je ne sais, il n'y a nul.", "Sais pas, il y a pas personne."], "answer": "Chais pas, y a personne.", "why": "À l'oral : chute du « ne », « je sais » réduit en « chais », « il y a » réduit en « y a »." },
      { "q": "« Mettre les pieds dans le plat », c'est :", "choices": ["aborder maladroitement un sujet délicat", "aider à faire la cuisine", "renverser le repas", "arriver en retard au dîner"], "answer": "aborder maladroitement un sujet délicat", "why": "Expression figurée : évoquer sans tact ce que tout le monde évitait." }
    ],
    "reading": {
      "title": "Dimanche, jour du brunch",
      "genre": "chronique humoristique",
      "text_fr": "Le Parisien moderne ne se repose pas le dimanche : il brunche. Nuance capitale. Se reposer suppose de rester chez soi en pyjama, ce qui, dans un deux-pièces de vingt-huit mètres carrés loué au prix d'un château en Sologne, relève davantage de l'assignation à résidence que du loisir. Bruncher, en revanche, c'est exister.\n\nLe rituel commence vers onze heures, heure à laquelle il est encore possible de faire semblant d'avoir couru. On enfourche un Vélib' – électrique, cela va de soi, on n'est pas des bêtes – et l'on file vers ce petit café du onzième arrondissement « découvert » la veille sur Instagram par trois cent mille autres personnes. L'établissement porte invariablement un nom anglais imprononçable. Là, on fait la queue. Quarante minutes. Sur le trottoir. Dans le froid. Mais attention : on ne dit pas qu'on fait la queue, on dit qu'il y a « une ambiance de ouf ».\n\nUne fois juché sur un tabouret manifestement conçu par un ennemi du genre humain, on commande l'assiette « signature » : un œuf poché, trois lamelles d'avocat et une tartine de pain au levain, le tout pour vingt-neuf euros. Le serveur, barbu et tatoué, vous explique avec le sérieux d'un sommelier que l'œuf provient d'une poule élevée en plein air dans le Perche. Elle s'appelle Simone, précise-t-il, et elle est très épanouie. Vous hochez la tête, ému. Vous ignoriez que vous aviez besoin de connaître la biographie de votre petit-déjeuner.\n\nVers quinze heures, repu et délesté d'une somme qui aurait jadis nourri pendant un mois une famille du Second Empire, le Parisien s'accorde une « petite expo ». Peu importe laquelle : l'essentiel est d'en poster une photo floue, accompagnée d'un commentaire sibyllin du genre « bouleversant ». Puis vient l'apéro, continuation du brunch par d'autres moyens, au cours duquel on se plaint unanimement que Paris soit devenu invivable, trop cher, trop bruyant, trop pollué.\n\nEt c'est là tout le génie de cette ville : on la déteste avec une ferveur qui ressemble à s'y méprendre à de l'amour. Le soir venu, en remontant à pied une rue pavée sous la lumière jaune des réverbères, notre héros soupire qu'il partira s'installer à Bordeaux l'an prochain. Il le dit depuis neuf ans. Personne n'y croit, lui moins que quiconque. Le lundi matin, il s'engouffre dans la ligne 13, et tout rentre dans l'ordre : métro, boulot, dodo, en attendant dimanche.",
      "questions": [
        { "q": "Quel est le registre dominant de cette chronique ?", "choices": ["Une ironie tendre et moqueuse", "Une indignation sincère", "Un lyrisme sans distance", "Une neutralité journalistique"], "answer": "Une ironie tendre et moqueuse", "why": "L'auteur se moque des rituels parisiens (« on n'est pas des bêtes », « ennemi du genre humain ») sans hostilité réelle, comme le montre la fin affectueuse." },
        { "q": "Que sous-entend la phrase « Vous ignoriez que vous aviez besoin de connaître la biographie de votre petit-déjeuner » ?", "choices": ["L'auteur raille la surenchère marketing autour de l'origine des produits", "L'auteur recommande de s'informer sur l'origine des œufs", "Le serveur raconte sa propre vie", "Le client est sincèrement bouleversé par l'histoire de la poule"], "answer": "L'auteur raille la surenchère marketing autour de l'origine des produits", "why": "Le décalage entre un simple œuf et sa « biographie » (la poule Simone) ridiculise le storytelling commercial." },
        { "q": "L'expression « continuation du brunch par d'autres moyens » parodie :", "choices": ["La formule de Clausewitz sur la guerre, continuation de la politique par d'autres moyens", "Un slogan publicitaire pour un apéritif", "Une fable de La Fontaine", "La devise de la République"], "answer": "La formule de Clausewitz sur la guerre, continuation de la politique par d'autres moyens", "why": "Clin d'œil culturel : « La guerre n'est que la continuation de la politique par d'autres moyens »." },
        { "q": "Que révèle la phrase « Il le dit depuis neuf ans » ?", "choices": ["Il ne quittera sans doute jamais Paris malgré ses plaintes", "Il va enfin s'installer à Bordeaux", "Il habite à Bordeaux depuis neuf ans", "Il déteste réellement Paris et part bientôt"], "answer": "Il ne quittera sans doute jamais Paris malgré ses plaintes", "why": "La répétition depuis neuf ans, puis « Personne n'y croit, lui moins que quiconque », montrent que c'est une plainte rituelle." },
        { "q": "Quelle est l'idée centrale de la chronique ?", "choices": ["Les Parisiens critiquent leur ville tout en y étant profondément attachés", "Paris est devenu trop cher et il faut le quitter", "Le brunch est une vieille tradition française", "Les cafés parisiens servent une cuisine médiocre"], "answer": "Les Parisiens critiquent leur ville tout en y étant profondément attachés", "why": "« on la déteste avec une ferveur qui ressemble à s'y méprendre à de l'amour »." }
      ]
    },
    "writing": {
      "prompt_en": "Write a humorous newspaper column (chronique) about a typical French workplace ritual (the Monday meeting, the coffee machine, the leaving drinks…). Use irony, deliberately mix soutenu and familier registers, and include at least two idioms.",
      "prompt_fr": "Rédigez une chronique humoristique sur un rituel typique du monde du travail en France (la réunion du lundi, la machine à café, le pot de départ…). Faites preuve d'ironie, mêlez volontairement registres soutenu et familier, et employez au moins deux expressions idiomatiques.",
      "minWords": 300,
      "maxWords": 380,
      "model_fr": "Éloge funèbre de la réunion de 9 h 30\n\nIl est, dans la vie de l'entreprise française, des institutions plus solides que la Ve République. La réunion du lundi, dite « point hebdo », est de celles-là. Nul ne sait qui l'a instituée, ni pourquoi ; on sait seulement qu'elle est prévue pour durer une heure, qu'elle en dure deux, et qu'elle s'achève invariablement par la phrase rituelle : « On se refait un point la semaine prochaine. »\n\nTout commence par l'attente. Le manager, retenu par un appel « hyper important », arrive avec un quart d'heure de retard, un café à la main et le sourire de celui qui n'a pas lu l'ordre du jour. Il l'a pourtant rédigé lui-même. On s'installe. Quelqu'un partage son écran et, comme à l'accoutumée, c'est sa boîte mail qui s'affiche, avec en objet « RE: RE: TR: Urgent – pot de départ de Sylvie ». Fou rire étouffé. Ambiance.\n\nViennent ensuite les tours de table, exercice de haute voltige où chacun s'efforce de paraître débordé sans avoir l'air de se plaindre. Les uns « avancent bien sur le dossier », ce qui signifie qu'ils ne l'ont pas ouvert ; les autres « reviennent vers nous très vite », ce qui signifie jamais. Quand une question gêne, le manager noie le poisson avec un brio qui force le respect. Et il y a toujours un collègue pour poser, à cinq minutes de la fin, la question qui relance le débat pour trois quarts d'heure. Celui-là, on ne le tue pas, mais l'envie y est.\n\nSoyons justes, néanmoins : la réunion a ses vertus. Elle permet de vérifier que tout le monde est vivant, de savoir qui est en froid avec qui et, surtout, de ne pas travailler tout en ayant le sentiment du devoir accompli. C'est une forme de méditation collective, le chant grégorien du tertiaire.\n\nAlors, de grâce, qu'on ne vienne pas nous parler de la supprimer au nom de l'efficacité. Ce serait ôter le pain de la bouche à des générations de cadres qui n'ont que ce rendez-vous pour se sentir utiles. Et puis, entre nous, sans elle, de quoi parlerait-on à la machine à café ?",
      "checklist": [
        "Has a catchy title and an ironic angle from the very first line",
        "Deliberately alternates registers (soutenu: nul ne sait, de grâce, comme à l'accoutumée / familier: hyper, ambiance, l'envie y est)",
        "Uses at least two idioms correctly (e.g. noyer le poisson, être en froid, ôter le pain de la bouche)",
        "Relies on irony or antiphrasis that a native reader would immediately catch",
        "Includes vivid, culturally specific details of French office life",
        "Ends with a punchline (chute)",
        "Stays between 300 and 380 words"
      ],
      "task_type": "chronique"
    },
    "speaking": {
      "prompt_en": "Tell a friend, in natural colloquial French, about a disastrous evening; then switch to a more formal register to draw a reflective conclusion. Use idioms and features of spoken French.",
      "prompt_fr": "Raconte à un ami, en français familier et naturel, une soirée catastrophique ; puis change de registre pour en tirer une conclusion plus réfléchie, dans une langue soutenue. Utilise des expressions idiomatiques et les tournures de l'oral.",
      "seconds": 150,
      "model_fr": "Alors écoute, faut que je te raconte ma soirée de samedi, parce que franchement, c'était n'importe quoi. Donc, Julien m'avait invitée à un dîner chez des potes à lui, à Vincennes. Moi, j'arrive, tout sourire, avec ma bouteille de vin… et là, je me rends compte que c'était pas samedi, c'était vendredi ! Ils avaient fait la soirée la veille. Je te raconte pas la tête que j'ai faite. J'savais plus où me mettre.\n\nBon, du coup, ils m'ont quand même fait entrer, hein, ils sont sympas. Mais y avait plus rien à manger, à part un reste de quiche et des chips. On a ouvert ma bouteille, et c'est là que le chat a décidé de sauter sur la table et de tout renverser sur le canapé blanc. Un canapé blanc, avec un chat, sérieux, faut être ouf ! Bref, j'ai passé la soirée à frotter avec du sel et de l'eau gazeuse.\n\nEt le pire, c'est que Julien, lui, il était même pas là la veille : il leur avait posé un lapin, il avait la crève.\n\nCela dit, avec le recul, je dois reconnaître que cette soirée s'est révélée, à sa manière, mémorable. Il y a dans ces fiascos une forme de grâce involontaire : ils nous rappellent que les moments les plus réussis ne sont pas nécessairement ceux que l'on a soigneusement planifiés. Et puis, entre nous, c'est quand même ce genre d'histoire qu'on finit par raconter pendant des années.",
      "keywords": ["franchement", "du coup", "je te raconte pas", "bref", "poser un lapin", "j'savais plus où me mettre", "cela dit", "avec le recul", "entre nous"]
    }
  }
};
