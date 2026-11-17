window.ODYSSEE_MISSIONS = {
  "1": {
    "write": {
      "prompt_en": "You have just joined your business school in Paris. Write a short message to introduce yourself to your new classmates on the class group chat.",
      "prompt_fr": "Vous venez d'arriver dans votre école de commerce à Paris. Écrivez un court message pour vous présenter à vos camarades sur le groupe de la classe.",
      "minWords": 20,
      "must_use": ["a greeting (Bonjour / Salut)", "your name with « je m'appelle »", "where you come from with « je viens de » or « je suis + nationality »", "a closing formula (À bientôt ! / Bonne journée !)"],
      "starter_fr": "Bonjour à tous ! Je m'appelle…",
      "model_fr": "Bonjour à tous ! Je m'appelle Sam. Je viens d'Inde, de Bangalore. J'habite à Paris depuis une semaine. Je suis étudiant en master de management. Enchanté et à bientôt !",
      "model_en": "Hello everyone! My name is Sam. I come from India, from Bangalore. I have been living in Paris for a week. I am a master's student in management. Nice to meet you and see you soon!"
    },
    "speak": {
      "prompt_en": "On your first day, introduce yourself to a colleague at the coffee machine: say hello, give your name, say where you're from and ask how they are.",
      "prompt_fr": "Le premier jour, présentez-vous à un collègue devant la machine à café : dites bonjour, votre nom, d'où vous venez et demandez comment il va.",
      "seconds": 20,
      "model_fr": "Bonjour ! Je m'appelle Sam. Je viens d'Inde, mais j'habite à Paris maintenant. Je suis nouveau dans l'équipe. Enchanté ! Et vous, comment vous appelez-vous ? Comment allez-vous ?",
      "keywords": ["bonjour", "je m'appelle", "je viens", "j'habite", "enchanté", "comment"]
    }
  },
  "2": {
    "write": {
      "prompt_en": "Your mother asks about life in Paris. Write her a short message describing today's weather, the season and your plans for the week.",
      "prompt_fr": "Votre mère vous demande des nouvelles de Paris. Écrivez-lui un court message sur la météo d'aujourd'hui, la saison et votre programme de la semaine.",
      "minWords": 20,
      "must_use": ["at least 2 weather expressions (il fait…, il pleut…)", "the current season (en automne, en hiver, au printemps, en été)", "at least 2 days of the week", "a temperature or another number written in letters"],
      "starter_fr": "Coucou maman ! Aujourd'hui, c'est…",
      "model_fr": "Coucou maman ! Aujourd'hui, c'est lundi. À Paris, il fait froid et il pleut. Il fait douze degrés. C'est l'automne. Mercredi, j'ai un examen et samedi, je visite le Louvre avec deux amis. Bisous !",
      "model_en": "Hi Mum! Today is Monday. In Paris, it's cold and it's raining. It's twelve degrees. It's autumn. On Wednesday I have an exam and on Saturday I'm visiting the Louvre with two friends. Love!"
    },
    "speak": {
      "prompt_en": "A colleague asks about the weather for the weekend. Describe the forecast for Saturday and Sunday and say which season you prefer.",
      "prompt_fr": "Un collègue vous demande la météo du week-end. Décrivez le temps de samedi et de dimanche, et dites quelle saison vous préférez.",
      "seconds": 20,
      "model_fr": "Samedi, il fait beau et il y a du soleil. Il fait vingt degrés. Dimanche, il pleut et il y a du vent. Moi, je préfère le printemps, parce qu'il fait doux.",
      "keywords": ["samedi", "dimanche", "il fait", "soleil", "il pleut", "degrés", "printemps"]
    }
  },
  "3": {
    "write": {
      "prompt_en": "Write a short note in your planner about important dates this year (your birthday, a holiday, an exam) and how you feel about them.",
      "prompt_fr": "Écrivez une petite note dans votre agenda sur les dates importantes de l'année (votre anniversaire, une fête, un examen) et ce que vous ressentez.",
      "minWords": 20,
      "must_use": ["at least 2 dates with le + number + month (le 14 juillet)", "at least 2 feelings (content, fatigué, stressé, heureux…)", "être + feeling adjective"],
      "starter_fr": "Mon anniversaire, c'est le…",
      "model_fr": "Mon anniversaire, c'est le trois mars. Je suis très content ! Le quatorze juillet, c'est la fête nationale : je suis heureux, parce qu'il y a des feux d'artifice. En décembre, j'ai mes examens. Je suis un peu stressé.",
      "model_en": "My birthday is on the third of March. I'm very happy! The fourteenth of July is the national holiday: I'm happy because there are fireworks. In December, I have my exams. I'm a little stressed."
    },
    "speak": {
      "prompt_en": "Tell a new friend today's date, when your birthday is, and how you feel today and why.",
      "prompt_fr": "Dites à un nouvel ami la date d'aujourd'hui, la date de votre anniversaire, et comment vous vous sentez aujourd'hui et pourquoi.",
      "seconds": 20,
      "model_fr": "Aujourd'hui, nous sommes le neuf novembre. Mon anniversaire, c'est le vingt-deux janvier. Aujourd'hui, je suis un peu fatigué, mais je suis content, parce que c'est vendredi !",
      "keywords": ["aujourd'hui", "nous sommes", "novembre", "anniversaire", "janvier", "je suis", "fatigué", "content"]
    }
  },
  "4": {
    "write": {
      "prompt_en": "Write a short message to the school secretary giving your full name, how to spell your surname, and your email address written as you would say it aloud.",
      "prompt_fr": "Écrivez un court message à la secrétaire de l'école avec votre nom complet, l'orthographe de votre nom de famille et votre adresse e-mail écrite comme on la dit à l'oral.",
      "minWords": 20,
      "must_use": ["your surname spelled letter by letter (K, U, M, A, R)", "« ça s'écrit » or « ça s'épelle »", "the words « arobase » and « point »"],
      "starter_fr": "Bonjour Madame, je m'appelle…",
      "model_fr": "Bonjour Madame, je m'appelle Sam Kumar. Kumar, ça s'écrit K, U, M, A, R. Mon adresse e-mail, c'est sam point kumar arobase gmail point com. Merci beaucoup et bonne journée !",
      "model_en": "Hello Madam, my name is Sam Kumar. Kumar is spelled K, U, M, A, R. My email address is sam dot kumar at gmail dot com. Thank you very much and have a nice day!"
    },
    "speak": {
      "prompt_en": "You call your bank's customer service. Give your name, spell your surname and dictate your email address clearly.",
      "prompt_fr": "Vous appelez le service client de votre banque. Donnez votre nom, épelez votre nom de famille et dictez clairement votre adresse e-mail.",
      "seconds": 20,
      "model_fr": "Bonjour, je m'appelle Sam Kumar. Mon nom, ça s'épelle K, U, M, A, R. Mon e-mail, c'est sam point kumar arobase gmail point com. Tout en minuscules.",
      "keywords": ["je m'appelle", "ça s'épelle", "arobase", "point", "com", "minuscules"]
    }
  },
  "5": {
    "write": {
      "prompt_en": "Write a short note about your Saturday shopping at the market: what you buy and what you like or don't like.",
      "prompt_fr": "Écrivez une petite note sur vos courses du samedi au marché : ce que vous achetez et ce que vous aimez ou n'aimez pas.",
      "minWords": 25,
      "must_use": ["at least 2 partitive articles (du, de la, de l', des)", "at least 2 definite articles after aimer/adorer/détester (j'adore le fromage)", "at least 1 indefinite article (un, une)"],
      "starter_fr": "Samedi, au marché, j'achète…",
      "model_fr": "Samedi, je vais au marché. J'achète du pain, du fromage, de la salade et des tomates. Je prends aussi une baguette et un poulet. J'adore le fromage, mais je n'aime pas le poisson. Je bois de l'eau et du café.",
      "model_en": "On Saturday, I go to the market. I buy bread, cheese, lettuce and tomatoes. I also take a baguette and a chicken. I love cheese, but I don't like fish. I drink water and coffee."
    },
    "speak": {
      "prompt_en": "You are at the boulangerie. Order what you want for breakfast, ask if they have a certain bread, and ask for the price.",
      "prompt_fr": "Vous êtes à la boulangerie. Commandez votre petit-déjeuner, demandez s'il y a un certain pain et demandez le prix.",
      "seconds": 20,
      "model_fr": "Bonjour Madame ! Je voudrais une baguette, deux croissants et un pain au chocolat, s'il vous plaît. Vous avez du pain complet ? Alors, je prends aussi du pain complet. Ça fait combien ?",
      "keywords": ["bonjour", "je voudrais", "une baguette", "croissants", "du pain", "s'il vous plaît", "combien"]
    }
  },
  "6": {
    "write": {
      "prompt_en": "Describe your new flatmates in Paris in a message to a friend back home.",
      "prompt_fr": "Décrivez vos nouveaux colocataires à Paris dans un message à un ami resté au pays.",
      "minWords": 25,
      "must_use": ["at least 3 different subject pronouns (il, elle, nous, ils…)", "être and avoir, each at least twice", "at least 3 adjectives with correct agreement (grand / grande)"],
      "starter_fr": "J'ai deux colocataires…",
      "model_fr": "J'ai deux colocataires. Elle s'appelle Léa : elle est française, elle est très sympa et elle a vingt-six ans. Il s'appelle Marco : il est italien et il est drôle. Il a un chat noir. Nous sommes contents et nous avons un grand appartement.",
      "model_en": "I have two flatmates. She is called Léa: she is French, she is very nice and she is twenty-six. He is called Marco: he is Italian and he is funny. He has a black cat. We are happy and we have a big apartment."
    },
    "speak": {
      "prompt_en": "Describe your manager and your team to a friend.",
      "prompt_fr": "Décrivez votre manager et votre équipe à un ami.",
      "seconds": 20,
      "model_fr": "Ma manager s'appelle Claire. Elle est grande et sérieuse, mais elle est gentille. Mes collègues sont jeunes : ils ont trente ans. Ils sont dynamiques. Nous sommes une petite équipe et nous avons beaucoup de travail !",
      "keywords": ["elle est", "gentille", "ils sont", "nous sommes", "nous avons", "équipe"]
    }
  },
  "7": {
    "write": {
      "prompt_en": "Write a short profile for a language-exchange app: describe your appearance, age, personality and favourite colour.",
      "prompt_fr": "Écrivez un court profil pour une application d'échange linguistique : décrivez votre physique, votre âge, votre caractère et votre couleur préférée.",
      "minWords": 25,
      "must_use": ["your age with avoir (j'ai … ans)", "at least 2 colours with correct agreement", "at least 3 conjunctions (et, mais, ou, parce que)"],
      "starter_fr": "Salut ! J'ai … ans.",
      "model_fr": "Salut ! J'ai vingt-huit ans. Je suis grand et brun, et j'ai les yeux noirs. Je suis calme, mais je suis très curieux. Ma couleur préférée, c'est le bleu, parce que c'est la couleur de la mer. Je porte souvent un pull gris ou une chemise blanche.",
      "model_en": "Hi! I'm twenty-eight. I'm tall and dark-haired, and I have dark eyes. I'm calm, but I'm very curious. My favourite colour is blue, because it's the colour of the sea. I often wear a grey jumper or a white shirt."
    },
    "speak": {
      "prompt_en": "Describe yourself to someone you are meeting at a café so they can recognise you.",
      "prompt_fr": "Décrivez-vous à une personne que vous retrouvez dans un café, pour qu'elle vous reconnaisse.",
      "seconds": 20,
      "model_fr": "Bonjour, c'est Sam ! Alors, j'ai vingt-huit ans, je suis assez grand et j'ai les cheveux courts et noirs. Aujourd'hui, je porte une veste bleue et un jean, mais pas de chapeau. Je suis en terrasse, à côté de la porte.",
      "keywords": ["j'ai", "ans", "cheveux", "je porte", "bleue", "et", "mais"]
    }
  },
  "8": {
    "write": {
      "prompt_en": "A colleague wants to know what you do in your free time. Write a short message about your hobbies and when you do them.",
      "prompt_fr": "Une collègue veut savoir ce que vous faites pendant votre temps libre. Écrivez un court message sur vos loisirs et quand vous les pratiquez.",
      "minWords": 25,
      "must_use": ["faire du / de la / de l' + activity at least twice", "jouer à or jouer de at least once", "at least 2 time expressions (le week-end, le mardi soir, souvent, tous les jours…)"],
      "starter_fr": "Pendant mon temps libre, je fais…",
      "model_fr": "Pendant mon temps libre, je fais beaucoup de sport. Le mardi soir, je fais du yoga et le week-end, je fais de la course à pied au bord de la Seine. Je joue aussi au tennis avec des amis le samedi matin. Le soir, je joue de la guitare.",
      "model_en": "In my free time, I do a lot of sport. On Tuesday evenings, I do yoga and at the weekend, I go running along the Seine. I also play tennis with friends on Saturday mornings. In the evening, I play the guitar."
    },
    "speak": {
      "prompt_en": "Invite a colleague to do an activity with you this weekend and explain what you usually do.",
      "prompt_fr": "Invitez un collègue à faire une activité avec vous ce week-end et expliquez ce que vous faites d'habitude.",
      "seconds": 20,
      "model_fr": "Tu fais quoi ce week-end ? Moi, le samedi, je joue au foot avec des amis. Le dimanche matin, je fais du vélo. Tu veux faire du vélo avec nous ? On part à dix heures.",
      "keywords": ["week-end", "je joue", "au foot", "le dimanche", "je fais", "du vélo", "heures"]
    }
  },
  "9": {
    "write": {
      "prompt_en": "Write a message to a friend about your travel plans this month: where you and other people go, and how.",
      "prompt_fr": "Écrivez un message à un ami sur vos voyages de ce mois-ci : où vous allez, où vont les autres, et comment.",
      "minWords": 25,
      "must_use": ["aller conjugated at least 3 times (je vais, nous allons, ils vont…)", "à / au / aux / en with cities and countries", "a means of transport (en train, à pied, en avion…)"],
      "starter_fr": "Ce mois-ci, je voyage beaucoup ! Je vais…",
      "model_fr": "Ce mois-ci, je voyage beaucoup ! Le week-end prochain, je vais à Lyon en train avec ma colocataire. Ensuite, nous allons en Belgique, à Bruxelles. Mes collègues vont au Portugal, mais moi, je vais aux États-Unis en décembre. Tous les jours, je vais au bureau à pied.",
      "model_en": "This month, I'm travelling a lot! Next weekend, I'm going to Lyon by train with my flatmate. Then, we're going to Belgium, to Brussels. My colleagues are going to Portugal, but I'm going to the United States in December. Every day, I walk to the office."
    },
    "speak": {
      "prompt_en": "A tourist asks you for directions. Explain how to get from the metro station to the boulangerie.",
      "prompt_fr": "Un touriste vous demande son chemin. Expliquez comment aller de la station de métro à la boulangerie.",
      "seconds": 20,
      "model_fr": "Alors, vous allez tout droit jusqu'à la pharmacie. Ensuite, vous tournez à gauche. La boulangerie est à côté de la banque, en face du café. C'est à cinq minutes à pied.",
      "keywords": ["vous allez", "tout droit", "à gauche", "à côté de", "en face du", "à pied"]
    }
  },
  "10": {
    "write": {
      "prompt_en": "Write a short diary entry: what you did yesterday, what you are doing today, and what you are going to do tomorrow.",
      "prompt_fr": "Écrivez une courte page de journal : ce que vous avez fait hier, ce que vous faites aujourd'hui et ce que vous allez faire demain.",
      "minWords": 25,
      "must_use": ["hier + at least 1 verb in passé composé", "aujourd'hui + at least 1 verb in présent", "demain + aller + infinitive"],
      "starter_fr": "Hier, j'ai…",
      "model_fr": "Hier, j'ai travaillé à la bibliothèque et j'ai mangé avec Léa. Aujourd'hui, je suis fatigué, alors je reste à la maison et je regarde un film. Demain, je vais aller au bureau et je vais appeler ma famille.",
      "model_en": "Yesterday, I worked at the library and I ate with Léa. Today, I'm tired, so I'm staying at home and watching a film. Tomorrow, I'm going to go to the office and I'm going to call my family."
    },
    "speak": {
      "prompt_en": "Your manager asks about your project. Say what you did yesterday, what you are doing today and what you will do tomorrow.",
      "prompt_fr": "Votre manager vous demande où en est votre projet. Dites ce que vous avez fait hier, ce que vous faites aujourd'hui et ce que vous allez faire demain.",
      "seconds": 20,
      "model_fr": "Alors, hier, j'ai fini la présentation. Aujourd'hui, je prépare le budget avec Thomas. Et demain, je vais envoyer le rapport au client.",
      "keywords": ["hier", "j'ai fini", "aujourd'hui", "je prépare", "demain", "je vais"]
    }
  },
  "11": {
    "write": {
      "prompt_en": "Write a message to your flatmate to organise this evening: what you want to do, what you must do first, and what they can bring.",
      "prompt_fr": "Écrivez un message à votre colocataire pour organiser la soirée : ce que vous voulez faire, ce que vous devez faire d'abord et ce qu'elle peut apporter.",
      "minWords": 25,
      "must_use": ["vouloir, pouvoir and devoir, each at least once + infinitive", "prendre at least once", "one more irregular verb (venir, faire, savoir…)"],
      "starter_fr": "Salut ! Ce soir, je veux…",
      "model_fr": "Salut Léa ! Ce soir, je veux faire un dîner avec des amis. Mais d'abord, je dois finir un rapport pour le travail. Est-ce que tu peux acheter du pain ? Je prends le vin et le dessert. Thomas vient à vingt heures. Tu veux inviter ton frère ?",
      "model_en": "Hi Léa! Tonight, I want to have a dinner with friends. But first, I have to finish a report for work. Can you buy some bread? I'll take care of the wine and the dessert. Thomas is coming at eight. Do you want to invite your brother?"
    },
    "speak": {
      "prompt_en": "Call a restaurant: book a table, ask if you can come at 8 pm, say when you must leave and ask if they take cards.",
      "prompt_fr": "Appelez un restaurant : réservez une table, demandez si vous pouvez venir à vingt heures, dites quand vous devez partir et demandez s'ils prennent la carte.",
      "seconds": 20,
      "model_fr": "Bonjour, je voudrais réserver une table pour quatre personnes, ce soir. Est-ce qu'on peut venir à vingt heures ? Nous devons partir à vingt-deux heures. Et vous prenez la carte bancaire ?",
      "keywords": ["réserver", "une table", "on peut", "vingt heures", "nous devons", "vous prenez"]
    }
  },
  "12": {
    "write": {
      "prompt_en": "Your new apartment has several problems. Write a message to your landlord listing what doesn't work.",
      "prompt_fr": "Votre nouvel appartement a plusieurs problèmes. Écrivez un message à votre propriétaire pour expliquer ce qui ne marche pas.",
      "minWords": 25,
      "must_use": ["at least 3 sentences with ne… pas / n'… pas", "« pas de » or « pas d' » before a noun at least twice", "a polite request at the end"],
      "starter_fr": "Bonjour Monsieur, dans l'appartement, …",
      "model_fr": "Bonjour Monsieur, je suis votre nouveau locataire. Il y a des problèmes dans l'appartement : le chauffage ne marche pas, il n'y a pas d'eau chaude et la fenêtre de la cuisine ne ferme pas. Je n'ai pas de clé pour la boîte aux lettres. Pouvez-vous venir cette semaine, s'il vous plaît ?",
      "model_en": "Hello Sir, I'm your new tenant. There are problems in the apartment: the heating doesn't work, there's no hot water and the kitchen window doesn't close. I don't have a key for the letterbox. Can you come this week, please?"
    },
    "speak": {
      "prompt_en": "A friend invites you out tonight, but you can't go. Refuse politely and explain why.",
      "prompt_fr": "Un ami vous invite à sortir ce soir, mais vous ne pouvez pas. Refusez poliment et expliquez pourquoi.",
      "seconds": 20,
      "model_fr": "Ah non, désolé, ce soir, je ne peux pas. Je n'ai pas le temps : je dois finir un dossier. Et je n'ai pas d'argent cette semaine ! Je ne suis pas libre demain non plus. Samedi, peut-être ?",
      "keywords": ["désolé", "je ne peux pas", "je n'ai pas", "pas d'argent", "je ne suis pas", "peut-être"]
    }
  },
  "13": {
    "write": {
      "prompt_en": "You are hesitating between two apartments in Paris. Write a message to a friend comparing them and saying which one you choose.",
      "prompt_fr": "Vous hésitez entre deux appartements à Paris. Écrivez un message à un ami pour les comparer et dire lequel vous choisissez.",
      "minWords": 35,
      "must_use": ["at least 2 comparatives (plus… que, moins… que, aussi… que)", "at least 1 superlative (le plus…, la moins…)", "« meilleur(e) » or « mieux » used correctly"],
      "starter_fr": "J'ai visité deux appartements…",
      "model_fr": "J'ai visité deux appartements. Le studio du Marais est plus petit que l'appartement de Montreuil, et il est aussi plus cher. L'appartement de Montreuil est plus grand et plus lumineux, et le quartier est aussi sympa que le Marais. En plus, il est moins loin de mon école. Pour moi, c'est la meilleure option : c'est le plus grand et le moins cher. Je choisis Montreuil !",
      "model_en": "I visited two apartments. The studio in the Marais is smaller than the apartment in Montreuil, and it's also more expensive. The Montreuil apartment is bigger and brighter, and the neighbourhood is as nice as the Marais. Plus, it's closer to my school. For me, it's the best option: it's the biggest and the cheapest. I'm choosing Montreuil!"
    },
    "speak": {
      "prompt_en": "Compare your hometown and Paris for a French colleague.",
      "prompt_fr": "Comparez votre ville natale et Paris pour un collègue français.",
      "seconds": 30,
      "model_fr": "Ma ville natale est plus grande que Paris, mais Paris est plus belle. Ici, la vie est plus chère, et le climat est moins chaud. Le plus difficile, c'est l'hiver ! Mais la meilleure chose à Paris, c'est la nourriture : le pain est le meilleur du monde.",
      "keywords": ["plus grande que", "plus chère", "moins chaud", "le plus difficile", "la meilleure", "le meilleur"]
    }
  },
  "14": {
    "write": {
      "prompt_en": "You are moving out. Write a note to your flatmate explaining which things in the apartment are yours and which stay.",
      "prompt_fr": "Vous déménagez. Écrivez un mot à votre colocataire pour expliquer quelles affaires de l'appartement sont à vous et lesquelles restent.",
      "minWords": 35,
      "must_use": ["at least 4 possessive adjectives (mon, ma, mes, ton, tes, notre, nos…)", "at least 3 demonstrative adjectives (ce, cet, cette, ces)", "« cet » before a masculine noun starting with a vowel"],
      "starter_fr": "Salut ! Avant mon déménagement, voici…",
      "model_fr": "Salut Léa ! Avant mon déménagement, voici une petite liste. Ce canapé, cette lampe et ces livres, ce sont mes affaires : j'emporte tout. Cet aspirateur est à notre propriétaire, donc il reste ici. Ton miroir est dans ma chambre, et tes clés sont sur cette étagère. Et nos plantes ? Tu peux garder mes plantes ! Merci pour cette belle année !",
      "model_en": "Hi Léa! Before my move, here is a little list. This sofa, this lamp and these books are my things: I'm taking everything. This vacuum cleaner belongs to our landlord, so it stays here. Your mirror is in my room, and your keys are on this shelf. And our plants? You can keep my plants! Thanks for this wonderful year!"
    },
    "speak": {
      "prompt_en": "Show a friend a photo of your family and describe who is who.",
      "prompt_fr": "Montrez une photo de votre famille à un ami et expliquez qui est qui.",
      "seconds": 30,
      "model_fr": "Regarde cette photo ! Ça, c'est ma sœur et son mari. Ces enfants, ce sont leurs fils. Et cet homme à gauche, c'est mon père. Ma mère prend la photo. Et cette maison, c'est notre maison en Inde.",
      "keywords": ["cette photo", "ma sœur", "son mari", "ces enfants", "leurs", "cet homme", "notre"]
    }
  },
  "15": {
    "write": {
      "prompt_en": "Write an email to a friend telling them about your weekend trip to Normandy.",
      "prompt_fr": "Écrivez un e-mail à une amie pour lui raconter votre week-end en Normandie.",
      "minWords": 40,
      "must_use": ["at least 3 verbs with être in passé composé (partir, arriver, aller, rester, rentrer…) with correct agreement", "at least 2 verbs with avoir in passé composé", "time markers (d'abord, ensuite, puis, enfin)"],
      "starter_fr": "Salut ! Le week-end dernier, je suis parti(e)…",
      "model_fr": "Salut Marie ! Le week-end dernier, je suis parti en Normandie avec Léa et Marco. Nous sommes partis samedi matin et nous sommes arrivés à Étretat vers midi. D'abord, nous avons marché sur les falaises. Ensuite, nous avons mangé des moules au restaurant. Puis Léa est allée à la plage, mais moi, je suis resté à l'hôtel. Enfin, nous sommes rentrés à Paris dimanche soir. C'était génial !",
      "model_en": "Hi Marie! Last weekend, I went to Normandy with Léa and Marco. We left on Saturday morning and we arrived in Étretat around noon. First, we walked on the cliffs. Then, we ate mussels at a restaurant. Then Léa went to the beach, but I stayed at the hotel. Finally, we came back to Paris on Sunday evening. It was great!"
    },
    "speak": {
      "prompt_en": "A colleague asks what you did last night. Tell them in detail.",
      "prompt_fr": "Un collègue vous demande ce que vous avez fait hier soir. Racontez-lui en détail.",
      "seconds": 30,
      "model_fr": "Hier soir ? Je suis sorti avec des amis. On est allés dans un bar à Oberkampf, puis on a dîné dans un petit resto. Je suis rentré vers minuit… alors je suis un peu fatigué ce matin !",
      "keywords": ["hier soir", "je suis sorti", "on est allés", "on a dîné", "je suis rentré", "minuit"]
    }
  },
  "16": {
    "write": {
      "prompt_en": "You are looking for a room in a flatshare. Write a message to the owner asking questions about the room.",
      "prompt_fr": "Vous cherchez une chambre en colocation. Écrivez un message au propriétaire pour poser des questions sur la chambre.",
      "minWords": 35,
      "must_use": ["at least 1 question with est-ce que", "at least 1 question with inversion (Pouvez-vous… ?)", "at least 3 different question words (combien, quand, où, comment, pourquoi…)"],
      "starter_fr": "Bonjour, j'ai vu votre annonce…",
      "model_fr": "Bonjour, j'ai vu votre annonce pour la chambre à Belleville. Elle est toujours disponible ? Combien coûte le loyer, charges comprises ? Est-ce que l'appartement est meublé ? Quand est-ce que la chambre est libre ? Où se trouve la station de métro la plus proche ? Pouvez-vous m'envoyer des photos ? Merci d'avance !",
      "model_en": "Hello, I saw your ad for the room in Belleville. Is it still available? How much is the rent, including charges? Is the apartment furnished? When is the room free? Where is the nearest metro station? Can you send me some photos? Thanks in advance!"
    },
    "speak": {
      "prompt_en": "You meet someone at a networking event. Ask them at least four questions.",
      "prompt_fr": "Vous rencontrez quelqu'un à un événement de networking. Posez-lui au moins quatre questions.",
      "seconds": 30,
      "model_fr": "Bonjour ! Vous travaillez dans quelle entreprise ? Est-ce que vous êtes dans le conseil ? Depuis combien de temps habitez-vous à Paris ? Comment avez-vous trouvé ce poste ? Et pourquoi avez-vous choisi Paris ?",
      "keywords": ["vous travaillez", "quelle", "est-ce que", "combien", "comment", "pourquoi"]
    }
  },
  "17": {
    "write": {
      "prompt_en": "You must organise a team lunch. Write a message to a colleague asking about their preferences.",
      "prompt_fr": "Vous devez organiser un déjeuner d'équipe. Écrivez un message à une collègue pour lui demander ses préférences.",
      "minWords": 35,
      "must_use": ["quel / quelle / quels / quelles at least 3 times with correct agreement", "lequel / laquelle / lesquels at least 2 times"],
      "starter_fr": "Salut ! Pour le déjeuner d'équipe, …",
      "model_fr": "Salut Julie ! Pour le déjeuner d'équipe, j'ai trouvé trois restaurants près du bureau. Lequel préfères-tu : l'italien, le japonais ou le libanais ? Il y a deux dates possibles, jeudi ou vendredi : laquelle est la meilleure pour toi ? Quelle heure te convient, midi ou midi et demi ? Quels collègues veulent venir ? Et quelles sont tes contraintes alimentaires ? Merci !",
      "model_en": "Hi Julie! For the team lunch, I found three restaurants near the office. Which one do you prefer: the Italian, the Japanese or the Lebanese? There are two possible dates, Thursday or Friday: which one is best for you? What time suits you, noon or half past twelve? Which colleagues want to come? And what are your dietary restrictions? Thanks!"
    },
    "speak": {
      "prompt_en": "You are in a shop choosing a gift. Ask the seller questions to compare the products.",
      "prompt_fr": "Vous êtes dans une boutique pour choisir un cadeau. Posez des questions au vendeur pour comparer les produits.",
      "seconds": 30,
      "model_fr": "Bonjour ! Je cherche un cadeau pour ma sœur. Quels parfums avez-vous ? Ah, ces deux-là sont jolis : lequel est le plus léger ? Et quelle est la différence de prix ? Parmi ces sacs, lesquels sont en cuir ? Bon, lequel vous me conseillez ?",
      "keywords": ["quels", "lequel", "le plus", "quelle", "lesquels", "conseillez"]
    }
  },
  "18": {
    "write": {
      "prompt_en": "Write a short blog post describing a flea market you visited in Paris.",
      "prompt_fr": "Écrivez un court article de blog pour décrire un marché aux puces que vous avez visité à Paris.",
      "minWords": 40,
      "must_use": ["at least 3 irregular plurals in -aux (journaux, animaux, travaux…)", "at least 2 plurals in -eux / -eaux / -oux (jeux, tableaux, bijoux, gâteaux)", "at least 2 plural adjectives with irregular forms (beaux, vieux, originaux, internationaux)"],
      "starter_fr": "Dimanche, je suis allé(e) au marché aux puces…",
      "model_fr": "Dimanche, je suis allé au marché aux puces de Saint-Ouen. Il y a des centaines de stands avec des objets originaux : de vieux journaux, des tableaux, des bijoux anciens et des jeux en bois. J'ai vu de beaux chapeaux et des animaux en porcelaine. Ensuite, j'ai mangé des gâteaux délicieux. Les vendeurs sont très sympas et il y a beaucoup de touristes internationaux. Mais attention : il y a des travaux dans le métro !",
      "model_en": "On Sunday, I went to the Saint-Ouen flea market. There are hundreds of stalls with original objects: old newspapers, paintings, antique jewellery and wooden games. I saw beautiful hats and porcelain animals. Then I ate delicious cakes. The sellers are very nice and there are lots of international tourists. But be careful: there are works in the metro!"
    },
    "speak": {
      "prompt_en": "Describe your favourite neighbourhood in Paris and what you can find there.",
      "prompt_fr": "Décrivez votre quartier préféré à Paris et ce qu'on peut y trouver.",
      "seconds": 30,
      "model_fr": "Mon quartier préféré, c'est le canal Saint-Martin. Il y a de beaux ponts, des bateaux sur l'eau et des cafés très originaux. Le dimanche, les gens viennent avec leurs animaux et leurs jeux de société. Il y a aussi des bureaux de start-up et de nouveaux restaurants.",
      "keywords": ["beaux", "bateaux", "originaux", "animaux", "jeux", "bureaux", "nouveaux"]
    }
  },
  "19": {
    "write": {
      "prompt_en": "Write a short review of your first month in your new job.",
      "prompt_fr": "Écrivez un court bilan de votre premier mois dans votre nouveau travail.",
      "minWords": 40,
      "must_use": ["at least 4 adverbs in -ment (rapidement, heureusement, vraiment, clairement…)", "at least 2 adverbs of frequency or degree (souvent, toujours, très, assez, trop)", "one irregular adverb (bien, mieux, mal, vite)"],
      "starter_fr": "Mon premier mois s'est…",
      "model_fr": "Mon premier mois au cabinet s'est très bien passé. Mes collègues m'ont chaleureusement accueilli et j'ai rapidement compris les outils internes. Je travaille souvent tard, mais heureusement, l'ambiance est vraiment agréable. Au début, j'ai parlé lentement en réunion, mais maintenant, je m'exprime mieux et plus facilement. Mon manager explique toujours clairement ses attentes. Franchement, je suis assez fier de moi !",
      "model_en": "My first month at the firm went very well. My colleagues welcomed me warmly and I quickly understood the internal tools. I often work late, but fortunately the atmosphere is really pleasant. At the beginning, I spoke slowly in meetings, but now I express myself better and more easily. My manager always explains his expectations clearly. Honestly, I'm quite proud of myself!"
    },
    "speak": {
      "prompt_en": "Explain to a friend how you are learning French and how it is going.",
      "prompt_fr": "Expliquez à un ami comment vous apprenez le français et comment ça se passe.",
      "seconds": 30,
      "model_fr": "Franchement, j'apprends assez vite. J'écoute régulièrement des podcasts et je lis souvent la presse. Je parle toujours lentement, mais je comprends beaucoup mieux qu'avant. Heureusement, mes collègues sont vraiment patients !",
      "keywords": ["franchement", "vite", "régulièrement", "souvent", "lentement", "mieux", "heureusement", "vraiment"]
    }
  },
  "20": {
    "write": {
      "prompt_en": "Your best friend is visiting Paris next weekend. Write an email describing the programme you are going to do together.",
      "prompt_fr": "Votre meilleur ami vient à Paris le week-end prochain. Écrivez-lui un e-mail pour décrire le programme que vous allez faire ensemble.",
      "minWords": 70,
      "must_use": ["at least 5 verbs in futur proche (aller + infinitive)", "at least 1 negative futur proche (on ne va pas…)", "time expressions (samedi matin, ensuite, le soir…)"],
      "starter_fr": "Salut ! J'ai hâte de te voir ! Samedi matin, je vais…",
      "model_fr": "Salut Rahul ! J'ai hâte de te voir ! Voici le programme. Samedi matin, je vais venir te chercher à la gare du Nord, puis nous allons déposer ta valise chez moi. Ensuite, on va prendre un brunch dans le Marais. L'après-midi, on va visiter le musée d'Orsay, mais on ne va pas monter à la tour Eiffel : il y a trop de monde ! Le soir, mes colocataires vont préparer un dîner pour toi. Dimanche, on va se promener au bord du canal. Tu vas adorer ! N'oublie pas ton parapluie : il va pleuvoir.",
      "model_en": "Hi Rahul! I can't wait to see you! Here's the plan. On Saturday morning, I'm going to pick you up at the Gare du Nord, then we're going to drop your suitcase at my place. Next, we're going to have brunch in the Marais. In the afternoon, we're going to visit the Musée d'Orsay, but we're not going to go up the Eiffel Tower: there are too many people! In the evening, my flatmates are going to cook dinner for you. On Sunday, we're going to walk along the canal. You're going to love it! Don't forget your umbrella: it's going to rain."
    },
    "speak": {
      "prompt_en": "Your manager asks about your plans for the new project. Explain what you are going to do this week.",
      "prompt_fr": "Votre manager vous demande votre plan pour le nouveau projet. Expliquez ce que vous allez faire cette semaine.",
      "seconds": 45,
      "model_fr": "Alors, cette semaine, je vais d'abord analyser les données du client. Mardi, je vais rencontrer l'équipe marketing, et mercredi, on va préparer la présentation ensemble. Jeudi, je vais envoyer une première version au client. Par contre, je ne vais pas travailler vendredi, parce que je vais à un séminaire.",
      "keywords": ["cette semaine", "je vais", "on va", "préparer", "présentation", "je ne vais pas"]
    }
  },
  "21": {
    "write": {
      "prompt_en": "Write a LinkedIn-style post about your professional goals for the next five years.",
      "prompt_fr": "Rédigez un post de style LinkedIn sur vos objectifs professionnels pour les cinq prochaines années.",
      "minWords": 70,
      "must_use": ["at least 5 verbs in futur simple, including 2 irregular ones (serai, aurai, ferai, pourrai, irai…)", "a « quand + futur simple » sentence (Quand j'aurai…, je…)", "a « si + présent, futur simple » condition"],
      "starter_fr": "Dans cinq ans, je serai…",
      "model_fr": "Dans cinq ans, où serai-je ? Voici mes objectifs. D'abord, je finirai mon master et je travaillerai dans un grand cabinet de conseil à Paris. Je parlerai couramment français et je ferai des présentations devant des clients sans stress. Quand j'aurai plus d'expérience, je dirigerai ma propre équipe. Si tout se passe bien, j'irai aussi travailler un an à Montréal. Je n'oublierai jamais mes débuts difficiles, et je pourrai aider d'autres étudiants étrangers. Rendez-vous dans cinq ans !",
      "model_en": "In five years, where will I be? Here are my goals. First, I will finish my master's and I will work in a big consulting firm in Paris. I will speak French fluently and I will give presentations to clients without stress. When I have more experience, I will lead my own team. If all goes well, I will also go and work in Montreal for a year. I will never forget my difficult beginnings, and I will be able to help other international students. See you in five years!"
    },
    "speak": {
      "prompt_en": "Describe how you imagine your life in ten years.",
      "prompt_fr": "Décrivez comment vous imaginez votre vie dans dix ans.",
      "seconds": 45,
      "model_fr": "Dans dix ans, j'habiterai dans un grand appartement à Paris, peut-être dans le onzième. Je serai consultant senior et je voyagerai beaucoup pour mon travail. J'aurai sûrement des enfants, et ils parleront français mieux que moi ! Le week-end, nous irons à la campagne. Et quand je serai vieux, je retournerai peut-être en Inde.",
      "keywords": ["dans dix ans", "j'habiterai", "je serai", "j'aurai", "nous irons", "quand"]
    }
  },
  "22": {
    "write": {
      "prompt_en": "For a magazine article about expats, describe your typical weekday routine in Paris.",
      "prompt_fr": "Pour un article de magazine sur les expatriés, décrivez votre routine habituelle en semaine à Paris.",
      "minWords": 70,
      "must_use": ["at least 6 reflexive verbs (se réveiller, se lever, se doucher, s'habiller, se dépêcher, se coucher…)", "at least 1 reflexive verb in the negative (je ne me lève pas…)", "at least 1 reflexive verb in passé composé (je me suis…)"],
      "starter_fr": "En semaine, je me réveille à…",
      "model_fr": "En semaine, je me réveille à sept heures, mais je ne me lève pas tout de suite : je regarde mes messages. Ensuite, je me douche, je me rase et je m'habille rapidement. Je prends un café et je me dépêche pour attraper le métro. Au bureau, je m'occupe des dossiers clients. Le soir, je me détends au parc ou je me promène le long du canal avec des amis. Je me couche vers minuit. Hier, par exemple, je me suis endormi devant une série !",
      "model_en": "On weekdays, I wake up at seven, but I don't get up straight away: I check my messages. Then I shower, I shave and I get dressed quickly. I have a coffee and I hurry to catch the metro. At the office, I take care of client files. In the evening, I relax in the park or I walk along the canal with friends. I go to bed around midnight. Yesterday, for example, I fell asleep in front of a series!"
    },
    "speak": {
      "prompt_en": "Tell a friend about your chaotic morning today: when you woke up, how you got ready and what happened.",
      "prompt_fr": "Racontez à un ami votre matinée chaotique d'aujourd'hui : à quelle heure vous vous êtes réveillé(e), comment vous vous êtes préparé(e) et ce qui s'est passé.",
      "seconds": 45,
      "model_fr": "Ce matin, je me suis réveillé en retard ! Je me suis levé à huit heures et demie, je me suis douché en cinq minutes et je me suis habillé très vite. Je ne me suis même pas rasé. Je me suis dépêché, mais j'ai quand même raté le métro !",
      "keywords": ["je me suis réveillé", "je me suis levé", "douché", "habillé", "ne me suis", "dépêché"]
    }
  },
  "23": {
    "write": {
      "prompt_en": "Write a short text about your childhood: where you lived, what you used to do and what life was like.",
      "prompt_fr": "Écrivez un court texte sur votre enfance : où vous habitiez, ce que vous faisiez et comment était la vie.",
      "minWords": 70,
      "must_use": ["at least 6 verbs in imparfait", "« quand j'étais petit(e) » or « à l'époque »", "habit markers (tous les matins, souvent, le dimanche)", "one passé composé event interrupting the description (Un jour, …)"],
      "starter_fr": "Quand j'étais petit(e), j'habitais…",
      "model_fr": "Quand j'étais petit, j'habitais dans une grande maison à Pune avec mes grands-parents. Tous les matins, ma grand-mère préparait le petit-déjeuner et mon grand-père lisait le journal sur la terrasse. J'allais à l'école à vélo avec mon frère. Le dimanche, nous jouions au cricket dans la rue pendant des heures. Il faisait toujours chaud et la vie était simple. À l'époque, je ne parlais pas un mot de français ! Un jour, mon oncle est revenu de Paris avec des photos, et j'ai décidé de découvrir la France.",
      "model_en": "When I was little, I lived in a big house in Pune with my grandparents. Every morning, my grandmother made breakfast and my grandfather read the newspaper on the terrace. I went to school by bike with my brother. On Sundays, we played cricket in the street for hours. It was always hot and life was simple. At the time, I didn't speak a word of French! One day, my uncle came back from Paris with photos, and I decided to discover France."
    },
    "speak": {
      "prompt_en": "Describe what your life was like before you moved to France.",
      "prompt_fr": "Décrivez comment était votre vie avant votre arrivée en France.",
      "seconds": 45,
      "model_fr": "Avant, je vivais à Mumbai. Je travaillais dans une banque et je prenais le train tous les jours. Le soir, je sortais souvent avec mes amis. C'était bien, mais je voulais changer de vie. Je rêvais de l'Europe, et surtout de Paris.",
      "keywords": ["avant", "je vivais", "je travaillais", "tous les jours", "souvent", "c'était", "je voulais"]
    }
  },
  "24": {
    "write": {
      "prompt_en": "Write a recommendation of your favourite street in Paris for a friend who is moving there.",
      "prompt_fr": "Écrivez une recommandation de votre rue préférée à Paris pour un ami qui va s'y installer.",
      "minWords": 70,
      "must_use": ["qui at least once", "que / qu' at least once", "où at least once", "dont at least once"],
      "starter_fr": "Si tu viens à Paris, il faut découvrir… C'est une rue que…",
      "model_fr": "Si tu viens à Paris, il faut absolument découvrir la rue des Martyrs. C'est une rue que j'adore, parce qu'elle a une vraie vie de quartier. Il y a une boulangerie qui fait les meilleurs croissants du neuvième et un petit café où je travaille souvent le dimanche. Le patron, dont la femme est italienne, prépare un tiramisu incroyable. C'est aussi le quartier où j'ai rencontré mes premiers amis français. Bref, c'est un endroit dont tu vas tomber amoureux !",
      "model_en": "If you come to Paris, you absolutely have to discover the rue des Martyrs. It's a street I love, because it has a real neighbourhood life. There's a bakery that makes the best croissants in the 9th and a little café where I often work on Sundays. The owner, whose wife is Italian, makes an incredible tiramisu. It's also the area where I met my first French friends. In short, it's a place you're going to fall in love with!"
    },
    "speak": {
      "prompt_en": "Describe a person who has helped you since you arrived in France.",
      "prompt_fr": "Décrivez une personne qui vous a aidé(e) depuis votre arrivée en France.",
      "seconds": 45,
      "model_fr": "La personne dont je veux parler, c'est Claire, une collègue qui travaille dans mon équipe. C'est quelqu'un que j'admire beaucoup. Elle m'a aidé à trouver l'appartement où j'habite maintenant. Et c'est aussi elle qui m'a présenté à ses amis.",
      "keywords": ["dont", "qui", "que", "j'admire", "m'a aidé", "où"]
    }
  },
  "25": {
    "write": {
      "prompt_en": "After a team dinner, coats and umbrellas got mixed up. Write a message to the group to sort out what belongs to whom.",
      "prompt_fr": "Après un dîner d'équipe, les manteaux et les parapluies ont été mélangés. Écrivez un message au groupe pour retrouver à qui appartient quoi.",
      "minWords": 70,
      "must_use": ["at least 3 possessive pronouns (le mien, le tien, la sienne, les vôtres…)", "at least 2 demonstrative pronouns (celui-ci, celle de, ceux qui…)", "at least 2 emphatic pronouns (moi, toi, lui, eux…)"],
      "starter_fr": "Salut l'équipe ! Petit souci : ce manteau n'est pas le mien…",
      "model_fr": "Salut l'équipe ! Petit souci après le dîner d'hier : je suis rentré avec un manteau noir, mais ce n'est pas le mien. Le mien a une capuche, celui-ci n'en a pas. Thomas, c'est le tien ? Toi aussi, tu avais un manteau noir, non ? Et Julie a récupéré une écharpe grise, mais elle pense que c'est celle de Sarah. Ce n'est pas la sienne, c'est sûr ! Quant aux parapluies, ceux qui sont restés au restaurant sont sûrement les vôtres, Marc et Inès : eux, ils sont partis sous la pluie. Moi, je rapporte tout demain au bureau !",
      "model_en": "Hi team! Small problem after last night's dinner: I went home with a black coat, but it isn't mine. Mine has a hood, this one doesn't. Thomas, is it yours? You had a black coat too, didn't you? And Julie picked up a grey scarf, but she thinks it's Sarah's. It's definitely not hers! As for the umbrellas, the ones left at the restaurant are surely yours, Marc and Inès: you two left in the rain. I'm bringing everything back to the office tomorrow!"
    },
    "speak": {
      "prompt_en": "You and a friend compare your apartments. Argue, with humour, that yours is better.",
      "prompt_fr": "Vous comparez vos appartements avec un ami. Défendez avec humour que le vôtre est meilleur.",
      "seconds": 45,
      "model_fr": "Ton appartement est sympa, mais franchement, le mien est plus lumineux. Celui de Léa est plus grand, d'accord, mais il est loin du métro. Moi, j'habite à deux minutes de la station. Et notre cuisine est plus grande que la vôtre ! Les voisins ? Les miens sont adorables, alors que ceux de Léa font la fête tous les soirs.",
      "keywords": ["le mien", "celui de", "moi", "la vôtre", "les miens", "ceux de"]
    }
  },
  "26": {
    "write": {
      "prompt_en": "A friend asks how to get her residence permit (titre de séjour). Reply explaining what you did at the préfecture.",
      "prompt_fr": "Une amie vous demande comment obtenir son titre de séjour. Répondez-lui en expliquant ce que vous avez fait à la préfecture.",
      "minWords": 70,
      "must_use": ["at least 2 direct object pronouns (le, la, les)", "at least 2 indirect object pronouns (lui, leur, me, te)", "y at least once and en at least once", "two pronouns in the same sentence in the correct order (je le lui ai donné, je t'en parle…)"],
      "starter_fr": "Salut ! Pour le titre de séjour, voici ce que j'ai fait…",
      "model_fr": "Salut Ana ! Pour le titre de séjour, voici ce que j'ai fait. D'abord, j'ai pris rendez-vous en ligne sur le site de la préfecture : tu dois le prendre vite, parce qu'il n'y a pas beaucoup de créneaux. Le jour J, j'y suis allé avec tous mes documents. L'agente m'a demandé mon contrat de travail et je le lui ai donné tout de suite. Elle m'a aussi demandé des photos ; heureusement, j'en avais quatre. Les justificatifs de domicile, je les ai imprimés la veille. Si tu veux, je t'envoie la liste et je t'en parle ce soir. Appelle-moi !",
      "model_en": "Hi Ana! For the residence permit, here's what I did. First, I booked an appointment online on the préfecture website: you have to book it quickly, because there aren't many slots. On the day, I went there with all my documents. The officer asked me for my employment contract and I gave it to her straight away. She also asked me for photos; luckily, I had four. The proofs of address, I printed them the day before. If you want, I'll send you the list and tell you about it tonight. Call me!"
    },
    "speak": {
      "prompt_en": "A colleague asks if you have been to the new canteen and tried the dishes. Answer using pronouns.",
      "prompt_fr": "Un collègue vous demande si vous êtes allé(e) à la nouvelle cantine et si vous avez goûté les plats. Répondez en utilisant des pronoms.",
      "seconds": 45,
      "model_fr": "La nouvelle cantine ? Oui, j'y suis allé hier ! J'ai goûté le curry, et je te le conseille. Les desserts ? Je n'en ai pas pris, ils étaient trop chers. Tu veux y aller demain ? Je peux en parler à Julie et lui demander de venir aussi.",
      "keywords": ["j'y suis allé", "je te le", "je n'en ai pas", "y aller", "en parler", "lui demander"]
    }
  },
  "27": {
    "write": {
      "prompt_en": "Write a polite email to your manager asking to work remotely two days a week.",
      "prompt_fr": "Écrivez un e-mail poli à votre manager pour demander à télétravailler deux jours par semaine.",
      "minWords": 70,
      "must_use": ["at least 2 polite conditionals (je voudrais, pourriez-vous, serait-il possible…)", "a « si + imparfait, conditionnel » sentence", "at least 5 verbs in conditionnel présent in total"],
      "starter_fr": "Bonjour Madame, je me permets de vous écrire au sujet de…",
      "model_fr": "Bonjour Madame Martin, je me permets de vous écrire au sujet de mon organisation de travail. Je voudrais savoir s'il serait possible de télétravailler deux jours par semaine, le mardi et le jeudi. Si je travaillais de chez moi, je gagnerais presque deux heures de transport par jour et je serais plus concentré sur les analyses. Je resterais bien sûr joignable à tout moment et je viendrais au bureau pour toutes les réunions importantes. Pourriez-vous m'accorder quelques minutes cette semaine pour en discuter ? Je vous remercie par avance. Cordialement, Sam",
      "model_en": "Hello Ms Martin, I am writing to you about my work arrangements. I would like to know if it would be possible to work from home two days a week, on Tuesdays and Thursdays. If I worked from home, I would save almost two hours of commuting a day and I would be more focused on the analyses. Of course, I would remain reachable at all times and I would come to the office for all important meetings. Could you give me a few minutes this week to discuss it? Thank you in advance. Kind regards, Sam"
    },
    "speak": {
      "prompt_en": "If you won the lottery tomorrow, what would you do? Answer spontaneously.",
      "prompt_fr": "Si vous gagniez au Loto demain, que feriez-vous ? Répondez spontanément.",
      "seconds": 45,
      "model_fr": "Si je gagnais au Loto, d'abord, je ne quitterais pas tout de suite mon travail. J'achèterais un appartement à Paris, avec un balcon. J'aiderais ma famille et je ferais le tour du monde avec mes amis. Et je donnerais une partie de l'argent à une association.",
      "keywords": ["si je gagnais", "je ne quitterais pas", "j'achèterais", "j'aiderais", "je ferais", "je donnerais"]
    }
  },
  "28": {
    "write": {
      "prompt_en": "You had a terrible first week in a new apartment. Write a humorous message to a friend complaining about it.",
      "prompt_fr": "Vous avez passé une première semaine horrible dans votre nouvel appartement. Écrivez un message plein d'humour à un ami pour vous plaindre.",
      "minWords": 70,
      "must_use": ["ne… plus", "ne… jamais", "ne… rien and ne… personne (or personne ne…)", "ne… que (restriction)"],
      "starter_fr": "Quelle semaine ! Le chauffage ne marche plus…",
      "model_fr": "Quelle semaine ! Mon nouvel appartement est une catastrophe. Le chauffage ne marche plus depuis lundi et le propriétaire ne répond jamais au téléphone. Je ne connais personne dans l'immeuble et personne ne dit bonjour dans l'escalier. Le frigo est vide : je n'ai rien mangé de bon depuis trois jours. Je n'ai que des pâtes et un vieux pot de moutarde ! Internet ne fonctionne pas encore, donc je ne peux ni travailler ni regarder de séries. Je ne déménagerai plus jamais en novembre !",
      "model_en": "What a week! My new apartment is a disaster. The heating hasn't worked since Monday and the landlord never answers the phone. I don't know anyone in the building and nobody says hello on the stairs. The fridge is empty: I haven't eaten anything good for three days. I only have pasta and an old jar of mustard! The internet doesn't work yet, so I can neither work nor watch series. I will never move in November again!"
    },
    "speak": {
      "prompt_en": "A journalist asks how your habits have changed since you moved to France. Answer using complex negations.",
      "prompt_fr": "Un journaliste vous demande comment vos habitudes ont changé depuis votre arrivée en France. Répondez avec des négations complexes.",
      "seconds": 45,
      "model_fr": "Depuis que j'habite en France, je ne mange plus de riz tous les jours. Je ne prends jamais la voiture : je ne prends que le métro ou le vélo. Au début, je ne connaissais personne et je ne comprenais rien aux blagues de mes collègues. Maintenant, ça va beaucoup mieux !",
      "keywords": ["depuis que", "ne mange plus", "jamais", "ne prends que", "personne", "rien"]
    }
  },
  "29": {
    "write": {
      "prompt_en": "You received three job offers. Write a short comparison of them and explain your choice.",
      "prompt_fr": "Vous avez reçu trois offres d'emploi. Écrivez une courte comparaison et expliquez votre choix.",
      "minWords": 70,
      "must_use": ["a progressive comparison (de plus en plus, de moins en moins)", "a comparison with nouns (plus de… que, autant de… que)", "a comparison with verbs (travailler plus que, gagner moins que)", "a superlative with « de » (le / la plus… de tous / de toutes)"],
      "starter_fr": "J'ai reçu trois offres et le choix devient de plus en plus…",
      "model_fr": "J'ai reçu trois offres et le choix devient de plus en plus difficile. La banque propose le meilleur salaire, mais on y travaille beaucoup plus que dans les deux autres entreprises. La start-up offre autant de jours de télétravail que le cabinet de conseil, mais elle a moins de clients internationaux. Au cabinet, je gagnerais un peu moins qu'à la banque, mais j'apprendrais beaucoup plus vite. En plus, c'est l'équipe la plus diverse de toutes celles que j'ai rencontrées. Plus j'y pense, plus je suis convaincu : je choisis le cabinet !",
      "model_en": "I received three offers and the choice is getting more and more difficult. The bank offers the best salary, but people work much more there than in the other two companies. The start-up offers as many remote-work days as the consulting firm, but it has fewer international clients. At the firm, I would earn a little less than at the bank, but I would learn much faster. Plus, it's the most diverse team of all the ones I met. The more I think about it, the more convinced I am: I'm choosing the firm!"
    },
    "speak": {
      "prompt_en": "Compare life in Paris with life in another city you know well.",
      "prompt_fr": "Comparez la vie à Paris avec la vie dans une autre ville que vous connaissez bien.",
      "seconds": 45,
      "model_fr": "Paris est de plus en plus chère, c'est clair. Il y a moins d'espaces verts qu'à Bangalore, mais autant de restaurants. Ici, les gens marchent beaucoup plus que chez moi. Mais plus je reste ici, plus j'aime cette ville. C'est la ville la plus belle que je connaisse !",
      "keywords": ["de plus en plus", "moins d'", "autant de", "plus que", "plus je", "la plus belle"]
    }
  },
  "30": {
    "write": {
      "prompt_en": "A new flatmate is moving in. Write a friendly email setting out the house rules and your expectations.",
      "prompt_fr": "Un nouveau colocataire emménage. Écrivez-lui un e-mail sympathique pour présenter les règles de la colocation et vos attentes.",
      "minWords": 120,
      "must_use": ["« il faut que » + subjonctif at least twice", "at least 2 verbs of wish or preference + subjonctif (je voudrais que, je préfère que, j'aimerais que)", "at least 1 irregular subjunctive (fasse, soit, aille, ait, puisse)", "at least 6 subjunctive forms in total"],
      "starter_fr": "Salut et bienvenue dans la coloc ! Pour que tout se passe bien, il faut que…",
      "model_fr": "Salut Hugo, bienvenue dans la coloc ! Pour que tout se passe bien, voici quelques règles simples. D'abord, il faut que chacun fasse la vaisselle juste après le repas : personne n'aime trouver une pile d'assiettes sales le matin. Il faut aussi que tu sortes les poubelles le mardi soir, à tour de rôle avec Léa et moi. Je voudrais que la salle de bain soit propre après chaque douche, et je préfère qu'on ne laisse pas traîner ses affaires dans le salon. Si tu invites des amis, j'aimerais que tu nous préviennes un peu à l'avance, surtout en semaine. Enfin, il est important que nous puissions discuter calmement s'il y a un problème. Je suis sûr que tout ira bien et que tu te sentiras vite chez toi ! À ce soir, Sam",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "Your team is preparing an important client meeting. Tell your colleagues what needs to happen before tomorrow.",
      "prompt_fr": "Votre équipe prépare une réunion client importante. Dites à vos collègues ce qui doit être fait avant demain.",
      "seconds": 60,
      "model_fr": "Bon, pour demain, il faut absolument que la présentation soit prête ce soir. Julie, il faut que tu finisses les graphiques. Thomas, je voudrais que tu vérifies les chiffres une dernière fois. Moi, il faut que j'aille voir le directeur pour valider le budget. Et j'aimerais qu'on fasse une répétition demain à huit heures, pour que tout le monde soit à l'aise. Ça vous va ?",
      "keywords": ["il faut que", "soit", "finisses", "je voudrais que", "que j'aille", "qu'on fasse", "pour que"]
    }
  },
  "31": {
    "write": {
      "prompt_en": "A friend is hesitating to accept a job in Lyon. Write a message reacting to the news and giving your opinion.",
      "prompt_fr": "Une amie hésite à accepter un poste à Lyon. Écrivez-lui un message pour réagir et lui donner votre avis.",
      "minWords": 120,
      "must_use": ["a subjunctive after an emotion (je suis heureux que, j'ai peur que)", "a subjunctive after doubt (je doute que, je ne pense pas que)", "at least 2 conjunctions requiring the subjunctive (bien que, avant que, à condition que, pour que)", "a contrast between « je pense que » + indicatif and « je ne pense pas que » + subjonctif"],
      "starter_fr": "Je suis vraiment heureux/heureuse que tu aies reçu cette offre…",
      "model_fr": "Coucou Inès ! Je suis vraiment heureux que tu aies reçu cette offre, tu la mérites. Je comprends que tu hésites : bien que Lyon soit une ville magnifique, toute ta vie est à Paris. Pourtant, je pense que c'est une occasion unique. Je ne pense pas que tu puisses trouver un poste aussi intéressant ici avant plusieurs années. J'ai juste peur que tu te sentes un peu seule au début, mais tu te fais des amis tellement facilement ! Accepte, à condition qu'ils te proposent un vrai plan de carrière. Et avant que tu partes, on organisera une grande fête pour que tout le monde puisse te dire au revoir. Honnêtement, je doute que tu le regrettes. Et tu sais que je serai toujours là pour toi, où que tu sois. Appelle-moi ce soir !",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "Your company wants everyone back in the office five days a week. Give your honest, reasoned reaction.",
      "prompt_fr": "Votre entreprise veut que tout le monde revienne au bureau cinq jours par semaine. Donnez votre réaction honnête et argumentée.",
      "seconds": 60,
      "model_fr": "Franchement, je suis surpris que la direction prenne cette décision maintenant. Je ne pense pas que ce soit une bonne idée. Bien que le bureau soit agréable, beaucoup de collègues habitent loin. J'ai peur que certains finissent par partir. Moi, j'accepterais à condition qu'on puisse garder au moins un jour de télétravail. Il faut qu'on en discute avant que la règle soit appliquée.",
      "keywords": ["je suis surpris que", "je ne pense pas que", "ce soit", "bien que", "j'ai peur que", "à condition qu'", "avant que"]
    }
  },
  "32": {
    "write": {
      "prompt_en": "Write a formal email to your landlord explaining a water leak in your apartment and the steps you have taken.",
      "prompt_fr": "Écrivez un e-mail formel à votre propriétaire pour signaler une fuite d'eau dans l'appartement et les mesures que vous avez prises.",
      "minWords": 120,
      "must_use": ["at least 3 complex prepositions (en raison de, grâce à, malgré, afin de, au lieu de, à cause de)", "at least 3 logical conjunctions (dès que, si bien que, puisque, alors que, de sorte que)", "a clear cause → consequence link", "formal opening and closing formulas"],
      "starter_fr": "Madame, Monsieur, je vous informe qu'une fuite d'eau s'est produite…",
      "model_fr": "Madame, je vous informe qu'une fuite d'eau s'est produite hier soir dans la salle de bain de l'appartement que je loue au 12, rue Oberkampf. En raison de l'ancienneté des canalisations, un tuyau a cédé sous le lavabo, si bien que l'eau a coulé jusque chez la voisine du dessous. Dès que je m'en suis aperçu, j'ai coupé l'arrivée d'eau afin de limiter les dégâts. Grâce à l'intervention rapide d'un plombier, la fuite est désormais réparée. Cependant, malgré nos efforts, le plafond de la voisine a été abîmé. Puisque les canalisations relèvent de la responsabilité du propriétaire, je vous serais reconnaissant de contacter votre assurance au lieu de laisser la situation se dégrader. Je tiens la facture du plombier à votre disposition. Je vous prie d'agréer, Madame, l'expression de mes salutations distinguées.",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "Explain to your manager why a project is delayed and what you propose.",
      "prompt_fr": "Expliquez à votre manager pourquoi un projet a pris du retard et ce que vous proposez.",
      "seconds": 60,
      "model_fr": "Alors, on a pris du retard à cause du client, qui nous a envoyé les données avec deux semaines de décalage. Malgré ça, l'équipe a beaucoup avancé grâce aux heures supplémentaires. Puisque la deadline est vendredi, je propose qu'on livre une première version jeudi, afin de recueillir leurs remarques. Au lieu de tout présenter d'un coup, on avancerait étape par étape, de sorte que le client reste impliqué.",
      "keywords": ["à cause du", "malgré", "grâce aux", "puisque", "afin de", "au lieu de", "de sorte que"]
    }
  },
  "33": {
    "write": {
      "prompt_en": "Write the « About us » paragraph for the start-up you work for.",
      "prompt_fr": "Rédigez le paragraphe « Qui sommes-nous ? » de la start-up pour laquelle vous travaillez.",
      "minWords": 120,
      "must_use": ["lequel / laquelle / lesquels after a preposition (pour laquelle, avec lesquels…)", "a form of auquel (auquel, à laquelle, auxquels, auxquelles, grâce auquel)", "a form of duquel (près duquel, autour desquels, au cours de laquelle…)", "at least 5 compound relative pronouns in total"],
      "starter_fr": "Fondée en…, notre start-up est une entreprise pour laquelle…",
      "model_fr": "Fondée en 2021 par trois anciens étudiants d'école de commerce, GreenRoute est une start-up pour laquelle je travaille depuis un an. Notre mission, à laquelle nous croyons profondément, est d'aider les entreprises à réduire l'empreinte carbone de leur logistique. Nous avons développé un logiciel grâce auquel les transporteurs peuvent optimiser leurs trajets en temps réel. Les clients avec lesquels nous collaborons sont surtout des PME, auxquelles nous offrons un accompagnement personnalisé. Notre bureau se trouve dans un ancien entrepôt à Pantin, près duquel passe le canal de l'Ourcq. Les défis auxquels nous faisons face sont nombreux, mais l'équipe, au sein de laquelle règne une vraie confiance, avance vite. Les valeurs autour desquelles nous avons construit l'entreprise sont simples : transparence, impact et audace.",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "Describe an important project you were part of and the people involved.",
      "prompt_fr": "Décrivez un projet important auquel vous avez participé et les personnes impliquées.",
      "seconds": 60,
      "model_fr": "Le projet dont je suis le plus fier, c'est une mission pour un groupe de luxe, pendant laquelle on a refait toute leur stratégie digitale. L'équipe avec laquelle je travaillais était géniale. La directrice, à laquelle je rendais compte, m'a énormément appris. Il y a eu des moments difficiles, au cours desquels j'ai failli abandonner, mais le résultat, auquel personne ne croyait au début, a dépassé toutes les attentes.",
      "keywords": ["dont", "pendant laquelle", "avec laquelle", "à laquelle", "au cours desquels", "auquel"]
    }
  },
  "34": {
    "write": {
      "prompt_en": "Write an account of a day when everything went wrong at work, explaining what had happened beforehand.",
      "prompt_fr": "Racontez une journée où tout est allé de travers au travail, en expliquant ce qui s'était passé auparavant.",
      "minWords": 120,
      "must_use": ["at least 5 verbs in plus-que-parfait", "plus-que-parfait combined with passé composé / imparfait to show what happened earlier", "at least 1 être-verb in plus-que-parfait with agreement (elle était arrivée)"],
      "starter_fr": "Ce matin-là, je suis arrivé(e) en retard parce que j'avais oublié…",
      "model_fr": "Lundi dernier restera gravé dans ma mémoire. Ce matin-là, je suis arrivé au bureau en retard parce que j'avais oublié de mettre mon réveil la veille. Quand je suis entré dans la salle de réunion, le client était déjà là : ma manager était arrivée une heure plus tôt pour tout préparer. J'ai ouvert mon ordinateur et j'ai découvert avec horreur que le fichier de la présentation avait disparu. En fait, un collègue l'avait supprimé par erreur pendant le week-end. Heureusement, j'en avais envoyé une copie à Julie, qui l'avait gardée dans ses e-mails. Le client, qui n'avait rien remarqué, a finalement signé le contrat. Le soir, j'ai compris que j'avais eu beaucoup de chance, et je me suis promis de toujours sauvegarder mes fichiers.",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "Tell a friend about a cultural misunderstanding you had in France, explaining what had happened before.",
      "prompt_fr": "Racontez à un ami un malentendu culturel que vous avez vécu en France, en expliquant ce qui s'était passé avant.",
      "seconds": 60,
      "model_fr": "Tu sais ce qui m'est arrivé la semaine dernière ? J'étais invité à dîner chez des collègues. Je n'avais jamais entendu parler du quart d'heure de politesse, alors je suis arrivé pile à l'heure. Évidemment, ils n'avaient pas encore fini de cuisiner, et Claire était partie acheter du pain ! Ils avaient pensé que j'arriverais un peu plus tard. On en a bien rigolé après.",
      "keywords": ["j'étais", "je n'avais jamais", "je suis arrivé", "n'avaient pas", "était partie", "avaient pensé"]
    }
  },
  "35": {
    "write": {
      "prompt_en": "Write a message to your team presenting the roadmap for next quarter: what will have been done by each key deadline.",
      "prompt_fr": "Écrivez un message à votre équipe pour présenter la feuille de route du prochain trimestre : ce qui aura été fait à chaque échéance.",
      "minWords": 120,
      "must_use": ["at least 5 verbs in futur antérieur", "quand / dès que / une fois que / lorsque + futur antérieur", "d'ici + date + futur antérieur"],
      "starter_fr": "Bonjour à tous, d'ici fin janvier, nous aurons…",
      "model_fr": "Bonjour à tous, voici notre feuille de route pour le prochain trimestre. D'ici fin janvier, nous aurons terminé l'audit des processus internes et nous aurons interrogé une vingtaine de managers. Dès que Julie aura analysé les résultats, nous présenterons nos premières recommandations au comité de direction. Une fois que le comité les aura validées, l'équipe de Thomas commencera la phase de déploiement. D'ici le 15 mars, nous aurons formé tous les responsables régionaux, et lorsque le nouvel outil aura été installé dans les trois sites pilotes, nous mesurerons son impact. Si tout se passe comme prévu, nous serons arrivés au bout du projet avant l'été. Je sais que le calendrier est serré, mais quand nous aurons franchi ces étapes, nous pourrons enfin souffler. Merci à tous pour votre engagement ! Sam",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "Imagine yourself one year from now: list everything you will have accomplished in France.",
      "prompt_fr": "Imaginez-vous dans un an : énumérez tout ce que vous aurez accompli en France.",
      "seconds": 60,
      "model_fr": "Dans un an, j'aurai fini mon master et j'aurai sûrement trouvé un CDI dans le conseil. J'aurai enfin obtenu mon titre de séjour pluriannuel. J'espère que j'aurai réussi le DALF C1. Dès que j'aurai signé mon contrat, je chercherai un appartement plus grand. Et d'ici là, je serai allé dans au moins dix régions françaises !",
      "keywords": ["dans un an", "j'aurai fini", "obtenu", "dès que j'aurai", "d'ici là", "je serai allé"]
    }
  },
  "36": {
    "write": {
      "prompt_en": "Write a reflective journal entry about a decision you regret since moving to France and what you would have done differently.",
      "prompt_fr": "Écrivez une page de journal sur une décision que vous regrettez depuis votre arrivée en France et sur ce que vous auriez fait autrement.",
      "minWords": 120,
      "must_use": ["at least 4 verbs in conditionnel passé", "a « si + plus-que-parfait, conditionnel passé » sentence", "a regret or self-reproach with « j'aurais dû » or « j'aurais pu »"],
      "starter_fr": "Avec le recul, je regrette de… Si j'avais…, j'aurais…",
      "model_fr": "Avec le recul, je regrette d'avoir passé ma première année à Paris presque uniquement avec d'autres étudiants étrangers. Si j'avais fait plus d'efforts pour rencontrer des Français, j'aurais progressé beaucoup plus vite. J'aurais dû m'inscrire dans un club de sport ou dans une association de quartier dès mon arrivée. J'aurais pu aussi accepter les invitations de mes camarades français, au lieu de rester dans ma zone de confort. Si j'avais osé parler davantage en cours, mes professeurs m'auraient sûrement aidé, et je n'aurais pas eu autant de mal pendant les entretiens de stage. Je serais peut-être même parti en échange à Montréal. Mais au fond, ces erreurs m'ont beaucoup appris : aujourd'hui, je sais exactement ce que je conseillerais à un nouvel arrivant.",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "You missed an important deadline. Explain to your manager what you should have done and what would have happened.",
      "prompt_fr": "Vous avez raté une échéance importante. Expliquez à votre manager ce que vous auriez dû faire et ce qui se serait passé.",
      "seconds": 60,
      "model_fr": "Je suis vraiment désolé pour ce retard. J'aurais dû vous prévenir dès lundi que les données étaient incomplètes. Si j'avais demandé de l'aide à Thomas plus tôt, on aurait fini à temps. J'aurais pu aussi découper le travail autrement. Avec un meilleur planning, le client n'aurait pas attendu. La prochaine fois, je vous alerterai tout de suite.",
      "keywords": ["désolé", "j'aurais dû", "si j'avais", "on aurait fini", "j'aurais pu", "n'aurait pas"]
    }
  },
  "37": {
    "write": {
      "prompt_en": "Write the opening of a short story set in Paris, in a literary style.",
      "prompt_fr": "Écrivez le début d'une nouvelle qui se déroule à Paris, dans un style littéraire.",
      "minWords": 160,
      "must_use": ["at least 8 verbs in passé simple, including irregular ones (fut, fit, prit, dit, sut, vint…)", "imparfait for the setting vs passé simple for the actions", "at least 1 third-person plural passé simple (-èrent, -irent, -urent)"],
      "starter_fr": "Ce soir-là, il pleuvait sur Paris. Antoine sortit du métro et…",
      "model_fr": "Ce soir-là, il pleuvait sur Paris depuis des heures. Les réverbères de la rue Mouffetard jetaient sur les pavés une lumière jaune et tremblante, et les rares passants pressaient le pas. Antoine sortit du métro, releva le col de son manteau et s'arrêta devant la vitrine d'une librairie ancienne. Un livre attira son regard : c'était le roman que sa mère lui lisait autrefois. Il hésita un instant, puis poussa la porte. Une clochette tinta. Derrière le comptoir, une vieille femme leva les yeux et le dévisagea longuement, comme si elle l'attendait. « Vous voilà enfin », dit-elle simplement. Antoine ne sut que répondre. Il fit quelques pas, prit le livre et l'ouvrit. Sur la première page, il reconnut aussitôt l'écriture de sa mère. Ses mains se mirent à trembler. Dehors, deux silhouettes s'approchèrent de la vitrine, observèrent la scène quelques secondes, puis disparurent dans la nuit. La vieille femme éteignit la lampe. Ce fut le début de la plus étrange aventure de sa vie.",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "Tell a famous French historical anecdote as a storyteller would, using the passé simple.",
      "prompt_fr": "Racontez une anecdote célèbre de l'histoire de France comme un conteur, au passé simple.",
      "seconds": 75,
      "model_fr": "En 1911, un matin d'août, la Joconde disparut du Louvre. Personne ne comprit comment. La police interrogea des centaines de personnes, et l'on soupçonna même le poète Apollinaire et le jeune Picasso ! Pendant plus de deux ans, le tableau resta introuvable. Puis, en 1913, un Italien, Vincenzo Peruggia, essaya de le vendre à un marchand de Florence. Il fut arrêté immédiatement. En réalité, il avait travaillé au Louvre et il était tout simplement reparti avec le tableau caché sous sa blouse. La Joconde revint à Paris, et elle devint le tableau le plus célèbre du monde.",
      "keywords": ["disparut", "personne ne comprit", "interrogea", "resta", "fut arrêté", "revint", "devint"]
    }
  },
  "38": {
    "write": {
      "prompt_en": "Write a press release announcing a company's new sustainability programme.",
      "prompt_fr": "Rédigez un communiqué de presse annonçant le nouveau programme de développement durable d'une entreprise.",
      "minWords": 160,
      "must_use": ["at least 4 passive constructions (être + participe passé) in different tenses", "at least 1 passive with « par » introducing the agent", "at least 2 alternatives to the passive (on, se faire + infinitif, pronominal passive like « se développe »)"],
      "starter_fr": "Paris, le… — Un nouveau programme a été lancé aujourd'hui par…",
      "model_fr": "Paris, le 9 novembre — Un nouveau programme de réduction des émissions a été lancé aujourd'hui par le groupe Lumen, leader européen de la logistique urbaine. Annoncé lors d'une conférence de presse à La Défense, ce plan ambitieux sera déployé dans l'ensemble des quinze pays où l'entreprise est implantée. D'ici 2030, 80 % de la flotte de camions aura été remplacée par des véhicules électriques, et tous les entrepôts seront alimentés par des énergies renouvelables. Le projet a été conçu en partenariat avec l'Agence de la transition écologique et il est financé en partie par des fonds européens. « Ce n'est pas une décision qui a été prise à la légère », a déclaré la directrice générale, Claire Dumont. Les salariés se sont fait présenter les nouvelles mesures dès ce matin, et des formations seront proposées à tous les chauffeurs. On estime que plus de deux cent mille tonnes de CO2 pourront ainsi être évitées chaque année. Ce type d'initiative se développe rapidement dans le secteur, mais rarement à une telle échelle.",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "Report a news event (real or imagined) in the style of a radio journalist, using passive structures.",
      "prompt_fr": "Présentez une information (réelle ou imaginaire) à la manière d'un journaliste radio, en utilisant des tournures passives.",
      "seconds": 75,
      "model_fr": "Bonsoir. Un important incendie s'est déclaré cet après-midi dans un entrepôt de la banlieue nord. Le feu a été maîtrisé vers dix-huit heures par une centaine de pompiers. Une trentaine de personnes ont été évacuées et deux salariés ont été légèrement blessés. Selon les premières informations, l'incendie aurait été provoqué par un court-circuit. Une enquête a été ouverte par le parquet de Bobigny. Le site restera fermé jusqu'à nouvel ordre, et les employés seront accueillis dans un autre bâtiment dès demain.",
      "keywords": ["s'est déclaré", "a été maîtrisé", "ont été évacuées", "blessés", "aurait été provoqué", "a été ouverte", "seront accueillis"]
    }
  },
  "39": {
    "write": {
      "prompt_en": "Write a letter to your younger self, recounting what you believed, what you had been told and what actually happened.",
      "prompt_fr": "Écrivez une lettre à vous-même plus jeune, en racontant ce que vous croyiez, ce qu'on vous avait dit et ce qui s'est réellement passé.",
      "minWords": 200,
      "must_use": ["a past main verb followed by subordinates in imparfait, plus-que-parfait and conditionnel présent (tu croyais que…, on t'avait dit que…, tu pensais que tu abandonnerais)", "conditionnel passé as a future-in-the-past (tu ne pouvais pas imaginer que tu aurais trouvé…)", "a subjunctive in a past context (il fallait que…, bien que…)", "at least 3 different tense shifts handled correctly"],
      "starter_fr": "Cher moi d'il y a cinq ans, quand tu as atterri à Roissy, tu croyais que…",
      "model_fr": "Cher moi d'il y a cinq ans, quand tu as atterri à Roissy, tu croyais que tu maîtrisais déjà le français. Tu avais passé des mois à étudier la grammaire et tu étais convaincu que ce serait suffisant. On t'avait pourtant prévenu que les Parisiens parlaient vite et qu'ils ne finiraient jamais leurs phrases comme dans les manuels. Tu ne l'as pas cru. Dès la première semaine, tu as compris que tu t'étais trompé : à la boulangerie, tu ne savais même pas qu'il fallait demander « une tradition » plutôt qu'« une baguette ». Ton directeur de master t'avait annoncé que tu trouverais un stage en quelques semaines ; il t'a fallu six mois. Tu pensais que tu abandonnerais avant la fin de l'année, bien que tu ne l'aies jamais avoué à personne. Il fallait que tu acceptes de te tromper, que tu oses parler sans attendre d'être parfait. Si quelqu'un t'avait dit alors que tu animerais un jour des ateliers en français devant des directeurs, tu aurais éclaté de rire. Tu ne pouvais pas imaginer qu'au bout de cinq ans, tu aurais trouvé ta place ici. Et pourtant, je t'écris aujourd'hui depuis un bureau de La Défense, dans cette langue qui te faisait si peur. Avec toute mon affection, ton futur toi.",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "Tell the story of an important job interview: what you expected beforehand, what you had been told and what actually happened.",
      "prompt_fr": "Racontez un entretien d'embauche important : ce que vous imaginiez avant, ce qu'on vous avait dit et ce qui s'est réellement passé.",
      "seconds": 90,
      "model_fr": "Avant mon entretien final, j'étais persuadé que ça se passerait mal. La veille, on m'avait dit que le directeur était très dur et qu'il posait des questions impossibles. Je pensais qu'il me demanderait de résoudre une étude de cas en dix minutes. En fait, il voulait surtout savoir pourquoi j'avais choisi la France. À la fin, il m'a dit qu'il me rappellerait dans la semaine, mais je ne pensais pas qu'il le ferait si vite. Le lendemain matin, il m'a annoncé que j'étais pris, et il m'a promis qu'une fois que j'aurais signé, il me présenterait à toute l'équipe.",
      "keywords": ["j'étais persuadé", "se passerait", "on m'avait dit", "je pensais", "j'avais choisi", "il me rappellerait", "j'aurais signé"]
    }
  },
  "40": {
    "write": {
      "prompt_en": "Write an email to a colleague who missed a client meeting, reporting what the client said, asked and requested.",
      "prompt_fr": "Écrivez un e-mail à une collègue absente lors d'une réunion client pour lui rapporter ce que le client a dit, demandé et exigé.",
      "minWords": 200,
      "must_use": ["at least 4 different reporting verbs (a expliqué que, a précisé que, a demandé si, a voulu savoir ce que, a ajouté que)", "tense backshift (présent → imparfait, futur → conditionnel, passé composé → plus-que-parfait)", "an indirect question with « si » and one with « ce que » or « ce qui »", "transformed time markers (hier → la veille, demain → le lendemain)"],
      "starter_fr": "Salut, comme tu n'as pas pu assister à la réunion, voici ce que le client a dit : il a expliqué que…",
      "model_fr": "Salut Julie, comme tu n'as pas pu assister à la réunion de ce matin, voici un compte rendu des échanges avec le client. M. Lefèvre a d'abord expliqué que le comité de direction avait examiné notre proposition la veille et qu'il la trouvait globalement convaincante. Il a toutefois précisé que le budget lui paraissait trop élevé et que le conseil d'administration ne l'accepterait pas en l'état. Il a ensuite demandé si nous pourrions réduire la durée de la mission de deux semaines sans compromettre la qualité des livrables. Sa directrice financière a voulu savoir ce qui justifiait le coût de la phase de diagnostic et ce que nous avions prévu pour la formation des équipes. Quand Thomas lui a répondu que nous enverrions un détail chiffré, elle a insisté pour le recevoir avant vendredi. Enfin, M. Lefèvre a déclaré qu'il nous rappellerait le lendemain de la réception du document pour nous donner une réponse définitive, et il a ajouté qu'il avait apprécié notre réactivité depuis le début. Il a même confié qu'il n'avait jamais travaillé avec une équipe aussi disponible. Bref, ils sont intéressés, mais il faut que nous revoyions notre copie rapidement. Peux-tu me dire si tu es disponible demain matin pour qu'on retravaille le budget ensemble ? Merci ! Sam",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "Tell a friend about a surprising conversation you had with a stranger, reporting what each person said.",
      "prompt_fr": "Racontez à un ami une conversation surprenante avec un inconnu, en rapportant ce que chacun a dit.",
      "seconds": 90,
      "model_fr": "Alors écoute ça : hier, dans le métro, une dame m'a demandé si j'étais perdu. Je lui ai répondu que non, que je rentrais du travail. Elle m'a dit qu'elle m'avait vu la veille au même endroit et qu'elle pensait que j'étais touriste ! Puis elle a voulu savoir ce que je faisais à Paris. Quand je lui ai expliqué que j'étais consultant, elle m'a demandé si je pourrais aider son fils à trouver un stage ! Elle a ajouté qu'elle reviendrait le lendemain avec son CV. Et tu sais quoi ? Ce matin, elle était là !",
      "keywords": ["m'a demandé si", "je lui ai répondu", "elle m'a dit", "la veille", "ce que je faisais", "elle a ajouté", "le lendemain"]
    }
  },
  "41": {
    "write": {
      "prompt_en": "Write a long, casual message in your French friends' group chat recounting your chaotic day and proposing an apéro tonight, the way a native would write it.",
      "prompt_fr": "Écrivez un long message décontracté sur le groupe de vos amis français pour raconter votre journée chaotique et proposer un apéro ce soir, comme un natif.",
      "minWords": 160,
      "must_use": ["dropped « ne » in negations (c'est pas grave, t'as pas vu)", "at least 4 spoken markers (bon, bref, du coup, genre, en fait, carrément, trop)", "« on » instead of « nous » throughout", "at least 2 familiar expressions (j'en peux plus, c'est n'importe quoi, ça vous dit, t'inquiète)"],
      "starter_fr": "Bon les gars, faut que je vous raconte ma journée…",
      "model_fr": "Bon les gars, faut que je vous raconte ma journée parce que c'est n'importe quoi. Ce matin, grève RATP, et évidemment personne m'avait prévenu. Du coup, j'ai marché quarante minutes sous la pluie, genre trempé de la tête aux pieds. J'arrive au bureau, et là, mon boss me dit : « Ah, t'as pas vu le mail ? La réunion est annulée. » Sérieux ? J'étais trop dégoûté. Après, en fait, la journée s'est plutôt bien passée : on a bouclé le dossier Lambert et le client était carrément content. Mais bref, j'en peux plus, j'ai besoin de décompresser. Ça vous dit, un petit apéro ce soir ? On se retrouve au bar en bas de chez Léa vers dix-neuf heures, ça vous va ? Si vous êtes chauds, je réserve une table en terrasse ; avec les chauffages, c'est grave agréable. Et Marco, t'inquiète, cette fois c'est moi qui paie la première tournée. Allez, dites-moi vite, sinon je rentre et je m'écroule devant Netflix, et ça, franchement, ce serait triste. Bisous !",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "A friend calls: you are running late for dinner at their place. React and explain naturally, like a native speaker.",
      "prompt_fr": "Un ami vous appelle : vous êtes en retard pour le dîner chez lui. Réagissez et expliquez naturellement, comme un natif.",
      "seconds": 75,
      "model_fr": "Allô ? Ouais, c'est moi. Écoute, je suis vraiment désolé, je vais être à la bourre. Le métro est bloqué, y a un colis suspect à Châtelet, du coup on bouge plus. Franchement, ça me saoule. Bon, je pense que j'arrive dans vingt minutes, max. Commencez sans moi, hein, c'est pas grave ! Ah, et tu veux que je ramène un truc ? Du pain, du vin ? OK, ça marche. À tout de suite !",
      "keywords": ["ouais", "à la bourre", "y a", "du coup", "ça me saoule", "c'est pas grave", "un truc", "ça marche"]
    }
  },
  "42": {
    "write": {
      "prompt_en": "Write a formal email to an estate agency to apply for an apartment you visited, presenting your rental file.",
      "prompt_fr": "Écrivez un e-mail formel à une agence immobilière pour postuler à un appartement que vous avez visité, en présentant votre dossier de location.",
      "minWords": 160,
      "must_use": ["formal opening and closing formulas (Madame, Monsieur… ; Je vous prie d'agréer…)", "at least 5 housing / admin terms (dossier de location, garant ou garantie Visale, fiches de paie, avis d'imposition, bail, état des lieux, charges comprises)", "a polite request in the conditional", "precise facts (address, rent, salary, date of availability)"],
      "starter_fr": "Madame, Monsieur, je me permets de vous contacter à la suite de la visite…",
      "model_fr": "Objet : Candidature pour le T2 du 18, rue de la Roquette. Madame, Monsieur, je me permets de vous contacter à la suite de la visite de samedi dernier concernant le deux-pièces situé au 18, rue de la Roquette, proposé à 1 350 euros charges comprises. L'appartement correspond parfaitement à mes attentes et je souhaiterais vous soumettre ma candidature. Je suis consultant en CDI depuis septembre au sein d'un cabinet de conseil à La Défense, avec un salaire net mensuel de 3 900 euros, soit près de trois fois le montant du loyer. Ma période d'essai est validée. Vous trouverez ci-joint mon dossier de location complet : pièce d'identité, titre de séjour, contrat de travail, mes trois dernières fiches de paie, mon dernier avis d'imposition ainsi que mes quittances de loyer actuelles. Par ailleurs, je bénéficie de la garantie Visale, qui couvre les loyers en cas d'impayé. Je serais disponible pour signer le bail et effectuer l'état des lieux d'entrée dès le 1er décembre. N'hésitez pas à me contacter si vous avez besoin de pièces complémentaires. Dans l'attente de votre retour, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées. Sam Kumar",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "Call your GP's practice to book an urgent appointment, describe your symptoms and ask about payment (carte Vitale, mutuelle).",
      "prompt_fr": "Appelez le cabinet de votre médecin pour obtenir un rendez-vous urgent, décrivez vos symptômes et posez des questions sur le paiement (carte Vitale, mutuelle).",
      "seconds": 75,
      "model_fr": "Bonjour Madame, je vous appelle parce que je souhaiterais prendre rendez-vous avec le docteur Morel, si possible aujourd'hui ou demain. Depuis trois jours, j'ai de la fièvre, mal à la gorge et je tousse beaucoup. C'est mon médecin traitant, je suis déjà venu l'année dernière. Quinze heures trente ? Parfait. Est-ce que le docteur pratique le tiers payant ? Je viendrai avec ma carte Vitale et mon attestation de mutuelle. Merci beaucoup, bonne journée.",
      "keywords": ["prendre rendez-vous", "de la fièvre", "mal à la gorge", "médecin traitant", "tiers payant", "carte vitale", "mutuelle"]
    }
  },
  "43": {
    "write": {
      "prompt_en": "As a newly appointed manager, write an email to your team announcing a new organisation and setting priorities, with tact.",
      "prompt_fr": "En tant que manager fraîchement nommé(e), écrivez un e-mail à votre équipe pour annoncer une nouvelle organisation et fixer les priorités, avec tact.",
      "minWords": 160,
      "must_use": ["professional vocabulary (piloter, enjeux, feuille de route, livrables, arbitrer, montée en compétences)", "at least 2 tactful hedges (il me semble, je propose que, il serait souhaitable que)", "a subjunctive in a recommendation", "a clear structure with connectors (tout d'abord, par ailleurs, enfin)"],
      "starter_fr": "Bonjour à toutes et à tous, comme vous le savez, j'ai pris la direction de l'équipe…",
      "model_fr": "Objet : Nouvelle organisation de l'équipe Stratégie. Bonjour à toutes et à tous, comme vous le savez, j'ai pris la direction de l'équipe lundi dernier, et je tiens d'abord à vous remercier pour votre accueil. Après mes premiers échanges individuels avec chacun d'entre vous, il me semble essentiel de clarifier notre organisation pour les mois à venir. Tout d'abord, nous allons nous structurer en deux pôles : l'un pilotera les missions de transformation, l'autre se concentrera sur les études de marché. Inès et Karim en assureront respectivement la coordination. Par ailleurs, je propose que nous tenions un point d'équipe hebdomadaire de trente minutes, le lundi matin, afin d'arbitrer rapidement les priorités et de suivre l'avancement des livrables. Les enjeux de ce trimestre sont considérables : le comité exécutif attend notre feuille de route d'ici fin janvier. Il serait donc souhaitable que chacun identifie dès cette semaine les compétences qu'il aimerait développer, car la montée en compétences de l'équipe sera l'une de mes priorités. Enfin, ma porte reste ouverte : n'hésitez pas à venir me voir pour toute question ou suggestion. Bien à vous, Sam",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "In an interview for a senior role, answer: « Parlez-moi d'une situation où vous avez dû gérer un conflit dans votre équipe. »",
      "prompt_fr": "Lors d'un entretien pour un poste senior, répondez à la question : « Parlez-moi d'une situation où vous avez dû gérer un conflit dans votre équipe. »",
      "seconds": 75,
      "model_fr": "Bien sûr. Lors de ma dernière mission, deux consultants de mon équipe ne s'entendaient plus du tout sur la méthodologie, et l'ambiance commençait à peser sur les livrables. J'ai d'abord reçu chacun en entretien individuel pour comprendre ses arguments, sans prendre parti. Ensuite, je les ai réunis autour d'un objectif commun : la satisfaction du client. On a défini ensemble un mode de fonctionnement clair, avec des rôles bien répartis. En deux semaines, la tension était retombée, et le client a salué la qualité du rendu. Ce que j'en retiens, c'est qu'un conflit mal géré coûte beaucoup plus cher qu'une conversation difficile.",
      "keywords": ["lors de", "mon équipe", "entretien individuel", "sans prendre parti", "objectif commun", "le client", "ce que j'en retiens"]
    }
  },
  "44": {
    "write": {
      "prompt_en": "Announce the same news — you are leaving your job to start your own company — in three registers: a text to a close friend, an email to your manager, and a literary passage for your memoirs.",
      "prompt_fr": "Annoncez la même nouvelle — vous quittez votre poste pour créer votre entreprise — dans trois registres : un texto à un ami proche, un e-mail à votre manager et un passage littéraire pour vos mémoires.",
      "minWords": 200,
      "must_use": ["three clearly labelled versions: Familier, Courant, Littéraire", "familiar features in version 1 (slang or verlan, dropped « ne », « on »)", "standard-formal features in version 2 (vous, formules de politesse, conditionnel)", "literary features in version 3 (passé simple, inversion, rich vocabulary)"],
      "starter_fr": "Familier : « Mec, c'est officiel : … » Courant : « Bonjour…, je souhaitais vous informer… » Littéraire : « Ce fut un matin de… »",
      "model_fr": "Familier : « Mec, je te jure, c'est officiel : je me casse de la boîte ! J'en pouvais plus des réunions qui servent à rien et des slides jusqu'à minuit. Du coup, je me lance, je monte ma propre start-up avec Karim. Ouais, c'est un peu ouf, j'ai la trouille, mais bon, si je le fais pas maintenant, je le ferai jamais. On fête ça samedi ? C'est moi qui régale ! » Courant : « Bonjour Claire, je souhaitais vous informer personnellement de ma décision de quitter le cabinet à l'issue de mon préavis, fin mars. Après quatre années très enrichissantes à vos côtés, j'ai choisi de créer ma propre entreprise dans le secteur de la logistique durable. Je tiens à vous remercier sincèrement pour votre confiance et votre accompagnement. Je ferai bien entendu en sorte d'assurer une transition sereine sur mes dossiers. Pourrions-nous en discuter de vive voix cette semaine ? » Littéraire : « Ce fut un matin de mars, sous un ciel d'une pâleur presque ironique, que je résolus enfin de quitter cette tour de verre où s'étaient dissoutes tant de mes ambitions. Rarement décision me parut à la fois si téméraire et si évidente ; il me sembla, en franchissant les portiques pour la dernière fois, que je respirais pour la première fois depuis des années. »",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "Someone cut in front of you in the queue at the post office. Tell it first as you would to a friend, then report it formally to the manager.",
      "prompt_fr": "Quelqu'un vous est passé devant dans la file d'attente à la Poste. Racontez-le d'abord comme à un ami, puis signalez-le de façon formelle à la responsable.",
      "seconds": 90,
      "model_fr": "Alors, version potes : « Nan mais t'imagines, je fais la queue à la Poste depuis vingt minutes, et y a un mec qui me passe devant, tranquille, genre j'existe pas ! J'étais vénère. » Et maintenant, version formelle : « Bonjour Madame, je souhaiterais vous signaler un incident. Alors que j'attendais mon tour depuis une vingtaine de minutes, un monsieur s'est placé devant moi sans la moindre explication. Je trouve regrettable qu'aucun agent ne soit intervenu, et je vous serais reconnaissant de veiller à ce que la file d'attente soit mieux organisée. »",
      "keywords": ["y a un mec", "genre", "vénère", "je souhaiterais vous signaler", "alors que", "je vous serais reconnaissant", "file d'attente"]
    }
  },
  "45": {
    "write": {
      "prompt_en": "Write a nuanced opinion piece (tribune) on the four-day working week, weighing both sides.",
      "prompt_fr": "Rédigez une tribune nuancée sur la semaine de quatre jours, en pesant le pour et le contre.",
      "minWords": 200,
      "must_use": ["at least 2 concessive structures (bien que + subjonctif, certes… mais, il n'en demeure pas moins que, quitte à)", "at least 2 hypothesis structures (à supposer que, pour peu que, si tant est que, au cas où + conditionnel)", "at least 3 subjunctives", "modal nuances (il se pourrait que, il n'est pas exclu que, sans doute)"],
      "starter_fr": "La semaine de quatre jours : promesse ou mirage ? Certes, l'idée a de quoi séduire…",
      "model_fr": "La semaine de quatre jours : promesse ou mirage ? Certes, l'idée a de quoi séduire. Plusieurs expérimentations, notamment au Royaume-Uni et en Islande, suggèrent que la productivité ne baisse pas, voire qu'elle progresse, pour peu que l'organisation du travail soit repensée en profondeur. Moins de fatigue, moins d'arrêts maladie, des salariés plus engagés : le tableau semble idyllique. Il n'en demeure pas moins que ce modèle ne saurait être appliqué partout de la même manière. Bien que les métiers de bureau puissent s'y adapter assez facilement, qu'en est-il des soignants, des enseignants ou des commerçants, dont l'activité repose sur une présence continue ? À supposer même que les entreprises acceptent de recruter davantage, encore faudrait-il qu'elles en aient les moyens. Il se pourrait aussi que la compression des horaires accroisse le stress, si tant est que les objectifs restent inchangés. Faut-il pour autant renoncer ? Sans doute pas. Il n'est pas exclu que la semaine de quatre jours devienne, d'ici une décennie, la norme dans certains secteurs. Mais plutôt que de l'imposer par la loi, mieux vaudrait laisser chaque branche l'expérimenter, quitte à revenir en arrière au cas où les résultats se révéleraient décevants. La nuance, ici, n'est pas une frilosité : c'est une méthode.",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "A colleague abroad asks whether you would recommend moving to Paris. Give a nuanced answer, neither enthusiastic nor negative.",
      "prompt_fr": "Un collègue à l'étranger vous demande si vous lui recommanderiez de s'installer à Paris. Donnez une réponse nuancée, ni enthousiaste ni négative.",
      "seconds": 90,
      "model_fr": "Alors, c'est une vraie question. Je dirais oui, mais avec des nuances. Certes, Paris est une ville extraordinaire, culturellement surtout. Mais bien que j'y sois très heureux aujourd'hui, la première année a été rude : le logement, l'administration, la solitude. Pour peu que tu aies un bon réseau ou un employeur qui t'accompagne, ça se passe nettement mieux. En revanche, si tu cherches le calme ou l'espace, il se pourrait que tu sois déçu. Disons que ça vaut le coup, à condition d'y aller lucide.",
      "keywords": ["je dirais", "certes", "bien que", "j'y sois", "pour peu que", "il se pourrait que", "à condition"]
    }
  },
  "46": {
    "write": {
      "prompt_en": "DALF C2 style: write the introduction and the first argumentative paragraph of an essay on « Le télétravail menace-t-il le lien social dans l'entreprise ? »",
      "prompt_fr": "Type DALF C2 : rédigez l'introduction et le premier paragraphe argumentatif d'un essai sur le sujet « Le télétravail menace-t-il le lien social dans l'entreprise ? »",
      "minWords": 200,
      "must_use": ["an introduction with an accroche, a problématique phrased as a question and an annonce de plan", "at least 4 rhetorical connectors (or, dès lors, en effet, force est de constater, il convient de)", "at least 1 rhetorical device (question rhétorique, concession-réfutation, accumulation)", "an impersonal, objective register (no « je »)"],
      "starter_fr": "Depuis la crise sanitaire de 2020, le télétravail s'est imposé…",
      "model_fr": "Depuis la crise sanitaire de 2020, le télétravail s'est imposé dans le quotidien de millions de salariés français. Ce qui relevait hier de l'exception est devenu, pour beaucoup, une composante ordinaire de la vie professionnelle. Or, si ce mode d'organisation est plébiscité pour la souplesse qu'il offre, il suscite également de vives inquiétudes : l'entreprise peut-elle demeurer une communauté lorsque ses membres ne s'y croisent plus qu'occasionnellement ? Dès lors, il convient de se demander dans quelle mesure le télétravail fragilise le lien social au sein des organisations. Nous verrons dans un premier temps que cette pratique distend incontestablement les relations informelles, avant de montrer qu'elle invite surtout à réinventer les formes de la sociabilité professionnelle. Force est de constater, en premier lieu, que l'éloignement physique affecte les interactions spontanées qui font la vie d'un collectif. En effet, la conversation devant la machine à café, le déjeuner improvisé ou l'échange de couloir constituent autant d'occasions de tisser des liens, de transmettre des savoirs tacites et de désamorcer des tensions. Certes, les outils numériques permettent de maintenir une communication continue ; il n'en reste pas moins qu'une visioconférence planifiée ne remplacera jamais la richesse d'une rencontre fortuite. Les jeunes recrues en sont les premières victimes : comment s'approprier la culture d'une entreprise que l'on ne fréquente qu'à travers un écran ?",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "DALF-style oral: present a structured argument on « Faut-il interdire la voiture dans le centre de Paris ? »",
      "prompt_fr": "Oral de type DALF : présentez une argumentation structurée sur le sujet « Faut-il interdire la voiture dans le centre de Paris ? »",
      "seconds": 90,
      "model_fr": "Le sujet qui nous intéresse aujourd'hui est la place de la voiture dans le centre de Paris. Faut-il, au nom de la santé publique, l'en exclure totalement ? Je défendrai l'idée qu'une restriction forte est souhaitable, mais qu'une interdiction totale serait contre-productive. D'abord, force est de constater que la pollution et le bruit dégradent la qualité de vie des habitants. Ensuite, la ville a développé des alternatives crédibles, comme le vélo et les transports en commun. Néanmoins, interdire purement et simplement la voiture pénaliserait les personnes à mobilité réduite, les artisans et les habitants de banlieue mal desservis. En conclusion, plutôt qu'une interdiction, il convient de privilégier une régulation intelligente et progressive.",
      "keywords": ["je défendrai", "force est de constater", "d'abord", "ensuite", "néanmoins", "en conclusion", "il convient de"]
    }
  },
  "47": {
    "write": {
      "prompt_en": "Write a text message to a friend the way French people really text, inviting them for a drink tonight.",
      "prompt_fr": "Écrivez un texto à une amie comme les Français l'écrivent vraiment, pour l'inviter à boire un verre ce soir.",
      "minWords": 35,
      "must_use": ["dropped « ne » in at least 2 negations (c'est pas, j'ai pas)", "« on » instead of « nous »", "at least 2 spoken words (ouais, trop, le boulot, du coup, un truc)", "a question without inversion (Tu viens ?)"],
      "starter_fr": "Salut ! Ça va ? Ce soir, on…",
      "model_fr": "Salut Léa ! Ça va ? Ce soir, on va boire un verre au bar du coin avec Marco. Tu viens ? C'est pas loin de chez toi. Moi, j'ai pas envie de rester à la maison, je suis trop fatigué du boulot. Du coup, on se retrouve à 19 h ? Dis-moi vite ! Bisous",
      "model_en": "Hi Léa! How are you? Tonight, we're going for a drink at the local bar with Marco. Are you coming? It's not far from your place. I don't feel like staying at home, I'm so tired from work. So, shall we meet at 7 pm? Let me know quickly! Kisses"
    },
    "speak": {
      "prompt_en": "A colleague asks what you did this weekend. Answer casually, the way people really speak.",
      "prompt_fr": "Un collègue vous demande ce que vous avez fait ce week-end. Répondez de façon décontractée, comme on parle vraiment.",
      "seconds": 30,
      "model_fr": "Ce week-end ? Bah, rien de spécial. Samedi, on est allés au ciné avec des potes, c'était trop bien. Dimanche, j'ai pas bougé, j'étais crevé. Et toi, t'as fait quoi ?",
      "keywords": ["bah", "on est allés", "des potes", "trop bien", "j'ai pas", "crevé", "t'as fait quoi"]
    }
  },
  "48": {
    "write": {
      "prompt_en": "Your friend sends you three pieces of news: she got the job, her phone was stolen, and she is adopting a cat. Write your reactions.",
      "prompt_fr": "Votre amie vous envoie trois nouvelles : elle a eu le poste, on lui a volé son téléphone et elle adopte un chat. Écrivez vos réactions.",
      "minWords": 35,
      "must_use": ["at least 4 different interjections or reactions (Génial !, Oh là là !, Mince !, Sérieux ?, Trop mignon !)", "one reaction of sympathy (Ça doit être…, Je suis désolé(e) pour toi)", "at least one follow-up question"],
      "starter_fr": "Félicitations ! Génial, …",
      "model_fr": "Félicitations pour le poste ! Génial, je suis super content pour toi, tu le mérites ! Par contre, ton téléphone ? Oh là là, mince ! Sérieux, dans le métro ? Ça doit être vraiment énervant, je suis désolé pour toi. Et un chat ? Trop mignon ! Il s'appelle comment ? Envoie-moi une photo !",
      "model_en": "Congratulations on the job! Great, I'm so happy for you, you deserve it! But your phone? Oh dear, damn! Seriously, in the metro? That must be really annoying, I'm sorry for you. And a cat? So cute! What's its name? Send me a photo!"
    },
    "speak": {
      "prompt_en": "React out loud, naturally, as your colleague tells you: (1) they are getting married, (2) the meeting is cancelled, (3) the coffee machine is broken again.",
      "prompt_fr": "Réagissez à voix haute, naturellement, quand votre collègue vous annonce : (1) qu'il se marie, (2) que la réunion est annulée, (3) que la machine à café est encore en panne.",
      "seconds": 30,
      "model_fr": "Ah bon ? Tu te maries ? Mais c'est génial, félicitations ! Quoi, la réunion est annulée ? Ah, tant mieux, j'avais trop de travail. Et la machine à café est encore en panne ? Oh non, c'est pas vrai ! La galère…",
      "keywords": ["ah bon", "génial", "félicitations", "tant mieux", "oh non", "c'est pas vrai", "la galère"]
    }
  },
  "49": {
    "write": {
      "prompt_en": "A friend from abroad is invited to dinner at a French family's home. Write them an email explaining the cultural codes.",
      "prompt_fr": "Un ami étranger est invité à dîner dans une famille française. Écrivez-lui un e-mail pour lui expliquer les codes culturels.",
      "minWords": 70,
      "must_use": ["at least 3 cultural codes (la bise, arriver un peu en retard, apporter du vin ou des fleurs, l'apéro, ne pas parler d'argent…)", "advice with « il faut », « il vaut mieux » or « évite de »", "the tu / vous distinction"],
      "starter_fr": "Salut ! Pour le dîner de samedi, voici quelques conseils…",
      "model_fr": "Salut Rahul ! Pour le dîner de samedi chez les parents de Léa, voici quelques conseils. D'abord, n'arrive pas pile à l'heure : il vaut mieux arriver dix ou quinze minutes en retard. Apporte une bouteille de vin ou des fleurs, mais pas de chrysanthèmes ! Pour saluer, on fait souvent la bise, mais attends qu'ils commencent. Dis « vous » aux parents, sauf s'ils te proposent de les tutoyer. Le repas commence par l'apéro et peut durer trois heures, alors ne mange pas trop de cacahuètes ! Enfin, évite de parler d'argent ou de salaire à table. Tu vas voir, ça va être super !",
      "model_en": "Hi Rahul! For Saturday's dinner at Léa's parents' place, here's some advice. First, don't arrive exactly on time: it's better to arrive ten or fifteen minutes late. Bring a bottle of wine or flowers, but no chrysanthemums! To say hello, people often do la bise, but wait for them to start. Say « vous » to the parents, unless they suggest using « tu ». The meal starts with the apéro and can last three hours, so don't eat too many peanuts! Finally, avoid talking about money or salaries at the table. You'll see, it's going to be great!"
    },
    "speak": {
      "prompt_en": "Explain to a newcomer how to behave in a French workplace: greetings, lunch, tu/vous and emails.",
      "prompt_fr": "Expliquez à un nouvel arrivant comment se comporter dans une entreprise française : salutations, déjeuner, tu/vous et e-mails.",
      "seconds": 45,
      "model_fr": "Alors, au bureau, le matin, on dit bonjour à tout le monde, c'est très important. Avec certains collègues, on fait la bise, avec d'autres, on se serre la main. Le déjeuner, c'est sacré : on prend une vraie pause, souvent une heure, et on mange ensemble. Au début, il vaut mieux vouvoyer les gens, surtout les managers. Et dans les mails, on commence toujours par « Bonjour » et on finit par « Bonne journée » ou « Cordialement ».",
      "keywords": ["bonjour", "la bise", "serre la main", "le déjeuner", "il vaut mieux", "vouvoyer", "cordialement"]
    }
  },
  "50": {
    "write": {
      "prompt_en": "Write a message to a friend about last night's party using slang and verlan, adding the standard French word in brackets for three of them.",
      "prompt_fr": "Écrivez un message à un ami sur la soirée d'hier en utilisant de l'argot et du verlan, avec le mot standard entre parenthèses pour trois d'entre eux.",
      "minWords": 60,
      "must_use": ["at least 3 verlan words (teuf, ouf, relou, chelou, keufs, vénère)", "at least 3 slang words (potes, boulot, bouffe, kiffer, fric)", "the standard French equivalent in brackets for 3 words"],
      "starter_fr": "La teuf (fête) d'hier, c'était ouf (fou) !",
      "model_fr": "Salut Karim ! La teuf (fête) d'hier, c'était ouf (fou) ! Y avait plein de potes du boulot. La bouffe était trop bonne, j'ai kiffé. Par contre, le voisin était relou (lourd) : il est venu trois fois se plaindre du bruit. À deux heures, il a appelé les keufs ! Un peu chelou, non ? Moi, j'ai pas dépensé un rond, j'avais plus de fric de toute façon. Bref, on remet ça samedi ?",
      "model_en": "Hi Karim! Last night's party was crazy! There were loads of friends from work. The food was so good, I loved it. On the other hand, the neighbour was annoying: he came three times to complain about the noise. At two o'clock, he called the cops! A bit weird, right? I didn't spend a penny, I had no money left anyway. Anyway, shall we do it again on Saturday?"
    },
    "speak": {
      "prompt_en": "Tell a friend about your weekend using as much slang and verlan as feels natural.",
      "prompt_fr": "Racontez votre week-end à un ami avec autant d'argot et de verlan que possible, naturellement.",
      "seconds": 45,
      "model_fr": "Franchement, ce week-end, c'était ouf ! Vendredi soir, je suis allé à une teuf chez une meuf de mon taf. Y avait trop de monde, j'ai kiffé. Samedi, j'étais complètement claqué, j'ai rien fait de la journée. Et dimanche, mon coloc a voulu faire le ménage à huit heures du mat', trop relou !",
      "keywords": ["ouf", "teuf", "meuf", "mon taf", "kiffé", "claqué", "relou"]
    }
  },
  "51": {
    "write": {
      "prompt_en": "Tell the story of a stressful first week in a new job, using French idioms.",
      "prompt_fr": "Racontez une première semaine stressante dans un nouveau travail en utilisant des expressions imagées.",
      "minWords": 120,
      "must_use": ["at least 5 French idioms (avoir du pain sur la planche, mettre les pieds dans le plat, poser un lapin, tomber dans les pommes, avoir le cafard…)", "each idiom used in a natural, correct context", "a mix of past tenses (passé composé, imparfait, plus-que-parfait)"],
      "starter_fr": "Ma première semaine au bureau, je ne suis pas près de l'oublier…",
      "model_fr": "Ma première semaine au cabinet, je ne suis pas près de l'oublier. Dès le lundi, mon manager m'a prévenu que nous avions du pain sur la planche : un client exigeait une étude complète en dix jours. Le mardi, j'ai mis les pieds dans le plat en demandant devant tout le monde pourquoi le projet précédent avait échoué… alors que c'était justement celui de ma directrice. J'aurais voulu disparaître sous terre ! Le mercredi, un collègue qui devait m'aider m'a posé un lapin, et j'ai dû me débrouiller seul jusqu'à minuit. Le jeudi, j'étais tellement épuisé que j'ai failli tomber dans les pommes pendant la réunion. Le soir, loin de ma famille, j'avais un peu le cafard. Mais le vendredi, coup de théâtre : le client a adoré notre présentation, et mon manager m'a dit que j'avais fait un travail du tonnerre. Finalement, je ne regrette rien : après la pluie, le beau temps !",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "Describe your current situation (work, money, love life, mood) using at least four idioms.",
      "prompt_fr": "Décrivez votre situation actuelle (travail, argent, vie sentimentale, moral) avec au moins quatre expressions imagées.",
      "seconds": 60,
      "model_fr": "En ce moment, j'ai vraiment du pain sur la planche : j'ai trois dossiers à rendre avant vendredi. Mon nouvel appartement m'a coûté les yeux de la tête, donc je dois me serrer la ceinture. Côté cœur, c'est calme : la fille que je voyais m'a posé un lapin samedi, je crois que c'est fichu ! Mais bon, je ne vais pas en faire tout un fromage. Je garde le moral : après la pluie, le beau temps !",
      "keywords": ["du pain sur la planche", "les yeux de la tête", "me serrer la ceinture", "posé un lapin", "tout un fromage", "après la pluie"]
    }
  },
  "52": {
    "write": {
      "prompt_en": "Write a reflective blog post entitled « Le jour où j'ai commencé à penser en français ».",
      "prompt_fr": "Rédigez un billet de blog intitulé « Le jour où j'ai commencé à penser en français ».",
      "minWords": 160,
      "must_use": ["at least 2 mises en relief (ce qui…, c'est… ; ce que…, c'est… ; c'est… que)", "at least 3 natural discourse markers (en fait, du coup, d'ailleurs, quoi qu'il en soit)", "a reformulation (autrement dit, c'est-à-dire, bref)", "at least 2 idiomatic structures with no literal English equivalent (avoir beau, faillir, il m'arrive de, s'en rendre compte)"],
      "starter_fr": "Ce qui m'a frappé, c'est que ça s'est produit sans que je m'en rende compte…",
      "model_fr": "Ce qui m'a frappé, c'est que ça s'est produit sans que je m'en rende compte. Un matin de février, dans le métro, une dame m'a dit « Excusez-moi » et je me suis surpris à répondre « Je vous en prie » sans passer par l'anglais. Autrement dit, la traduction avait disparu. Pendant des mois, j'avais beau apprendre des listes de vocabulaire, je restais prisonnier de ma langue maternelle : je construisais mes phrases en anglais, puis je les traduisais mot à mot. Du coup, je parlais lentement et, d'ailleurs, mes collègues finissaient souvent mes phrases à ma place. C'est en arrêtant de traduire que j'ai vraiment progressé. J'ai commencé à écouter des podcasts en boucle, à me parler tout seul en faisant la cuisine, à noter les expressions telles quelles plutôt que leur équivalent. Ce que je retiens, c'est qu'une langue ne s'apprend pas : elle s'habite. Aujourd'hui, il m'arrive même de rêver en français, et j'ai failli répondre « Bah ouais » à ma mère au téléphone ! Quoi qu'il en soit, c'est le plus beau compliment que je puisse me faire.",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "Without hesitating, explain a French word that has no exact English equivalent (la flemme, flâner, le dépaysement…) and when you use it.",
      "prompt_fr": "Sans hésiter, expliquez un mot français qui n'a pas d'équivalent exact en anglais (la flemme, flâner, le dépaysement…) et quand vous l'utilisez.",
      "seconds": 75,
      "model_fr": "Alors, un mot que j'adore, c'est « la flemme ». En fait, c'est pas exactement de la paresse, c'est plutôt ce moment où t'as aucune envie de faire quelque chose, même si tu sais que tu devrais. Par exemple, dimanche soir, j'avais la flemme de faire les courses, du coup j'ai commandé une pizza. Ce qui est drôle, c'est que les Français l'utilisent tout le temps, même au boulot : « J'ai la flemme de faire ce reporting. » Autrement dit, c'est un mot qui résume tout un art de vivre !",
      "keywords": ["la flemme", "en fait", "c'est plutôt", "par exemple", "du coup", "ce qui est drôle", "autrement dit"]
    }
  },
  "53": {
    "write": {
      "prompt_en": "Write a message to a colleague with the caterer's phone number, address and prices for the office party, writing all numbers in letters.",
      "prompt_fr": "Écrivez un message à un collègue avec le numéro, l'adresse et les prix du traiteur pour la fête du bureau, en écrivant tous les nombres en lettres.",
      "minWords": 35,
      "must_use": ["a French phone number written in pairs, in letters (zéro six, quatre-vingt-dix-sept…)", "at least 2 numbers above 70 written in letters (soixante-quinze, quatre-vingt-onze…)", "at least 3 compulsory liaisons marked with ‿ (vingt‿euros, les‿apéritifs)"],
      "starter_fr": "Salut ! Le numéro du traiteur, c'est le zéro six…",
      "model_fr": "Salut Thomas ! Le traiteur pour la fête s'appelle « Chez Paul ». Son numéro, c'est le zéro six, quatre-vingt-dix-sept, soixante-douze, quinze, quatre-vingts. L'adresse : quatre-vingt-onze, rue de Rivoli. Le menu coûte vingt‿euros par personne, et les‿apéritifs, trois‿euros. Pour soixante-quinze personnes, ça fait mille cinq cents‿euros. Tu peux l'appeler ?",
      "model_en": "Hi Thomas! The caterer for the party is called « Chez Paul ». Their number is 06 97 72 15 80. The address: 91 rue de Rivoli. The menu costs twenty euros per person, and the aperitifs three euros. For seventy-five people, that comes to one thousand five hundred euros. Can you call them?"
    },
    "speak": {
      "prompt_en": "At the market, ask for products and prices and pay, paying attention to liaisons and numbers.",
      "prompt_fr": "Au marché, demandez des produits et des prix, puis payez, en faisant attention aux liaisons et aux nombres.",
      "seconds": 30,
      "model_fr": "Bonjour ! Je voudrais deux kilos de pommes et six œufs, s'il vous plaît. C'est combien, les avocats ? Un euro quatre-vingt-dix pièce ? D'accord, j'en prends trois. Ça fait combien en tout ? Dix-sept euros soixante-dix ? Voilà vingt euros.",
      "keywords": ["kilos", "pommes", "œufs", "les avocats", "combien", "en tout", "euros"]
    }
  },
  "54": {
    "write": {
      "prompt_en": "Write an email to a colleague about your weekend, correctly using at least four words that are false friends for English speakers.",
      "prompt_fr": "Écrivez un e-mail à une collègue sur votre week-end en utilisant correctement au moins quatre faux amis pour les anglophones.",
      "minWords": 40,
      "must_use": ["at least 4 false friends with their real French meaning (assister à, librairie, actuellement, sensible, location, rester, éventuellement)", "« en fait » for 'actually' and « j'ai hâte » instead of « je suis excité(e) »", "no anglicism traps"],
      "starter_fr": "Salut ! Ce week-end, j'ai assisté à…",
      "model_fr": "Salut Julie ! Ce week-end, j'ai assisté à une conférence sur l'économie à la Sorbonne. Ensuite, je suis passé dans une librairie du Quartier latin et j'ai acheté deux romans. En fait, je cherche actuellement un livre facile pour améliorer mon français. Samedi soir, je suis resté chez moi : je suis un peu sensible au froid. Dimanche, j'ai regardé des annonces de location pour un appartement plus grand. Éventuellement, on pourrait en visiter ensemble ? Sinon, j'ai vraiment hâte de commencer le nouveau projet !",
      "model_en": "Hi Julie! This weekend, I attended a lecture on economics at the Sorbonne. Then I went into a bookshop in the Latin Quarter and bought two novels. Actually, I'm currently looking for an easy book to improve my French. On Saturday evening, I stayed at home: I'm a bit sensitive to the cold. On Sunday, I looked at rental ads for a bigger apartment. Maybe we could visit some together? Otherwise, I'm really looking forward to starting the new project!"
    },
    "speak": {
      "prompt_en": "Explain to an English-speaking newcomer three false friends that tricked you, with an example for each.",
      "prompt_fr": "Expliquez à un nouvel arrivant anglophone trois faux amis qui vous ont piégé(e), avec un exemple pour chacun.",
      "seconds": 30,
      "model_fr": "Alors, attention aux faux amis ! Par exemple, « librairie », ça ne veut pas dire library : c'est un magasin où on achète des livres. Library, c'est « bibliothèque ». Ensuite, « actuellement », ça veut dire « en ce moment », pas actually. Actually, c'est « en fait ». Et surtout, ne dites jamais « je suis excité » pour excited ! Dites plutôt « j'ai hâte ».",
      "keywords": ["faux amis", "librairie", "bibliothèque", "actuellement", "en ce moment", "en fait", "j'ai hâte"]
    }
  },
  "55": {
    "write": {
      "prompt_en": "Your parcel was marked as delivered but you never received it. Write a message to the delivery company's customer service.",
      "prompt_fr": "Votre colis est indiqué comme livré, mais vous ne l'avez jamais reçu. Écrivez un message au service client du transporteur.",
      "minWords": 70,
      "must_use": ["the problem with a precise date and tracking number", "at least 2 verbs in passé composé describing what you did", "a polite request (pourriez-vous, je voudrais)", "everyday vocabulary (colis, numéro de suivi, boîte aux lettres, gardien(ne), point relais)"],
      "starter_fr": "Bonjour, je vous contacte au sujet de mon colis, numéro de suivi…",
      "model_fr": "Bonjour, je vous contacte au sujet de mon colis, numéro de suivi 8L45291300FR. Selon votre site, il a été livré le 6 novembre à 14 h, mais je ne l'ai jamais reçu. J'étais chez moi toute la journée et personne n'a sonné. J'ai vérifié ma boîte aux lettres et j'ai demandé à la gardienne de l'immeuble : elle n'a rien vu. Le colis n'est pas non plus au point relais de ma rue. Pourriez-vous ouvrir une enquête et me dire quand je vais recevoir mon colis ou être remboursé ? Merci d'avance. Cordialement, Sam Kumar",
      "model_en": "Hello, I'm contacting you about my parcel, tracking number 8L45291300FR. According to your website, it was delivered on 6 November at 2 pm, but I never received it. I was at home all day and nobody rang. I checked my letterbox and asked the building's caretaker: she didn't see anything. The parcel isn't at the pick-up point on my street either. Could you open an investigation and tell me when I will receive my parcel or be refunded? Thanks in advance. Kind regards, Sam Kumar"
    },
    "speak": {
      "prompt_en": "You are locked out of your apartment. Call a locksmith, explain the situation, give your address and ask for the price.",
      "prompt_fr": "Vous êtes enfermé(e) dehors. Appelez un serrurier, expliquez la situation, donnez votre adresse et demandez le prix.",
      "seconds": 45,
      "model_fr": "Bonjour, je vous appelle parce que je suis bloqué devant ma porte : j'ai laissé mes clés à l'intérieur et la porte s'est fermée. J'habite au 25, rue des Pyrénées, dans le vingtième, au troisième étage. Vous pouvez venir quand ? Et ça coûte combien, à peu près, pour ouvrir la porte ? Je préfère savoir avant, parce qu'on m'a dit que certains serruriers sont très chers !",
      "keywords": ["je vous appelle", "mes clés", "la porte", "j'habite", "vous pouvez venir", "combien", "à peu près"]
    }
  },
  "56": {
    "write": {
      "prompt_en": "Write an update to a former classmate about your life in France since you arrived.",
      "prompt_fr": "Écrivez des nouvelles à une ancienne camarade de classe sur votre vie en France depuis votre arrivée.",
      "minWords": 70,
      "must_use": ["depuis, il y a and pendant, each used correctly", "at least 1 gérondif (en + -ant)", "« c'est » vs « il / elle est » used correctly", "faire + infinitive (j'ai fait repeindre…)"],
      "starter_fr": "Salut ! Ça fait longtemps ! Je suis arrivé(e) à Paris il y a…",
      "model_fr": "Salut Priya ! Ça fait longtemps ! Je suis arrivé à Paris il y a deux ans et j'habite dans le onzième depuis six mois. C'est un quartier génial : il est vivant et très bien situé. Pendant ma première année, j'ai fait un stage dans une banque. Maintenant, je suis consultant. C'est un métier intense, mais il est passionnant. J'ai amélioré mon français en regardant des séries et en parlant avec mes collègues. La semaine dernière, j'ai fait repeindre mon appartement : il est beaucoup plus lumineux ! Et toi, quoi de neuf ?",
      "model_en": "Hi Priya! It's been a long time! I arrived in Paris two years ago and I've been living in the 11th for six months. It's a great neighbourhood: it's lively and very well located. During my first year, I did an internship in a bank. Now I'm a consultant. It's an intense job, but it's fascinating. I improved my French by watching series and talking with my colleagues. Last week, I had my apartment repainted: it's much brighter! What about you, what's new?"
    },
    "speak": {
      "prompt_en": "A new acquaintance asks about your French-learning journey. Answer naturally using depuis, il y a, pendant and a gérondif.",
      "prompt_fr": "Une nouvelle connaissance vous interroge sur votre apprentissage du français. Répondez naturellement avec depuis, il y a, pendant et un gérondif.",
      "seconds": 45,
      "model_fr": "J'apprends le français depuis trois ans, à peu près. J'ai commencé il y a trois ans en Inde, avec une appli. Ensuite, pendant six mois, j'ai pris des cours à l'Alliance française. Mais c'est en vivant ici que j'ai vraiment progressé. En écoutant les gens dans le métro, on apprend énormément ! C'est une langue difficile, mais elle est tellement belle.",
      "keywords": ["depuis", "il y a", "pendant", "en vivant", "en écoutant", "c'est", "elle est"]
    }
  },
  "57": {
    "write": {
      "prompt_en": "Write a short piece for your company intranet about a francophone region you dream of discovering, including proverbs.",
      "prompt_fr": "Rédigez un court article pour l'intranet de votre entreprise sur une région francophone que vous rêvez de découvrir, en y glissant des proverbes.",
      "minWords": 120,
      "must_use": ["at least 3 French proverbs used appropriately (Petit à petit, l'oiseau fait son nid ; Qui ne tente rien n'a rien ; L'habit ne fait pas le moine…)", "at least 2 facts about the francophonie (number of speakers, OIF, regions)", "at least 2 words or expressions from another francophone region, explained"],
      "starter_fr": "On l'oublie souvent depuis Paris, mais le français est parlé…",
      "model_fr": "Pourquoi je rêve de découvrir le Québec. On l'oublie souvent depuis Paris, mais le français est parlé par plus de trois cents millions de personnes sur les cinq continents, et l'Organisation internationale de la Francophonie rassemble près de quatre-vingt-dix États et gouvernements. Parmi toutes ces régions, c'est le Québec qui me fascine le plus. Là-bas, on ne fait pas du shopping, on « magasine », et l'on répond « bienvenue » quand quelqu'un dit merci. Quand un Québécois parle de « son char », il parle de sa voiture ! Les Québécois ont défendu leur langue avec une ténacité admirable : comme dit le proverbe, petit à petit, l'oiseau fait son nid. Certes, l'hiver y est rude, mais qui ne tente rien n'a rien. Et puis, l'habit ne fait pas le moine : derrière le froid se cache, paraît-il, l'accueil le plus chaleureux de la francophonie. J'espère y faire une mission d'ici deux ans, et peut-être même y vivre quelque temps.",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "Choose a French proverb, explain its meaning and tell a personal story that illustrates it.",
      "prompt_fr": "Choisissez un proverbe français, expliquez son sens et racontez une histoire personnelle qui l'illustre.",
      "seconds": 60,
      "model_fr": "Le proverbe que je préfère, c'est « Qui ne tente rien n'a rien ». Ça veut dire que si on ne prend jamais de risques, on n'obtient rien. Pour moi, ça résume mon arrivée en France. Il y a trois ans, j'avais un bon poste en Inde, mais j'ai tout quitté pour faire un master à Paris. Mes parents pensaient que c'était une folie. Les premiers mois ont été durs, mais aujourd'hui, j'ai un travail passionnant et des amis formidables. Donc oui, vraiment, qui ne tente rien n'a rien !",
      "keywords": ["proverbe", "qui ne tente rien n'a rien", "ça veut dire", "risques", "pour moi", "il y a"]
    }
  },
  "58": {
    "write": {
      "prompt_en": "Write a polite but firm reply to a client who is demanding an unrealistic deadline.",
      "prompt_fr": "Rédigez une réponse polie mais ferme à une cliente qui exige un délai irréaliste.",
      "minWords": 120,
      "must_use": ["at least 4 subjunctives in different structures (bien que, il est essentiel que, pour que, nous craignons que, à moins que)", "a subjunctive after « le seul » or a superlative (le seul délai qui soit réaliste)", "formal register with nuanced hedging (nous comprenons parfaitement, il nous semble)", "the expletive « ne » at least once (craindre que… ne, à moins que… ne)"],
      "starter_fr": "Madame, nous vous remercions pour votre message. Bien que nous souhaitions…",
      "model_fr": "Madame Durand, nous vous remercions pour votre message et comprenons parfaitement l'urgence de la situation. Bien que nous souhaitions sincèrement vous donner satisfaction, nous craignons qu'un rendu dès vendredi ne compromette la fiabilité de nos analyses. Il est essentiel que les données financières soient vérifiées avec rigueur, d'autant plus que le comité d'investissement s'appuiera directement sur nos conclusions. C'est pourquoi le 20 novembre nous semble être le seul délai qui soit véritablement réaliste. Pour que vous puissiez néanmoins avancer de votre côté, nous vous proposons de vous transmettre une synthèse intermédiaire mercredi prochain. À moins que vous ne préfériez en discuter de vive voix, nous partirons sur ce calendrier. Nous restons naturellement à votre entière disposition et ferons tout notre possible pour que ce projet soit une réussite. Bien cordialement, Sam Kumar, consultant senior",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "A friend wants to quit their job without a plan. Give nuanced advice using the subjunctive.",
      "prompt_fr": "Un ami veut démissionner sans plan B. Donnez-lui des conseils nuancés en utilisant le subjonctif.",
      "seconds": 60,
      "model_fr": "Écoute, je ne dis pas que tu aies tort, mais j'ai peur que tu le regrettes si tu pars sans plan. Il faudrait au moins que tu aies six mois d'économies de côté. Bien que ton boulot soit épuisant, c'est quand même le seul qui te permette de payer ton loyer pour l'instant. À moins que tu aies déjà une autre piste ? Dans ce cas, fonce ! Je veux juste que tu prennes la décision la plus lucide possible.",
      "keywords": ["j'ai peur que", "il faudrait", "que tu aies", "bien que", "le seul qui", "à moins que", "que tu prennes"]
    }
  },
  "59": {
    "write": {
      "prompt_en": "Write a review of an exhibition you saw in Paris, in the style of a French cultural magazine.",
      "prompt_fr": "Rédigez la critique d'une exposition vue à Paris, dans le style d'un magazine culturel français.",
      "minWords": 160,
      "must_use": ["at least 3 evaluative literary expressions (pari audacieux, scénographie épurée, on ressort…, d'une poésie saisissante)", "at least 2 nominalisations (la réussite de…, l'électrification de…)", "varied syntax, including an inversion or apposition", "a nuanced verdict mixing praise and reservation"],
      "starter_fr": "Pari audacieux que celui du musée…",
      "model_fr": "Exposition « Paris, ville lumière » au musée Carnavalet. Pari audacieux que celui du musée : raconter deux siècles d'histoire parisienne à travers le seul prisme de la lumière, des lanternes à huile aux néons des années 1980. Dès la première salle, plongée dans une pénombre savamment dosée, le visiteur est saisi. La scénographie, épurée et d'une grande élégance, laisse respirer chaque objet ; on s'attarde volontiers devant une enseigne de cabaret de Pigalle ou devant les clichés nocturnes de Brassaï, d'une poésie saisissante. La réussite de l'exposition tient surtout à sa capacité à mêler histoire sociale et émotion esthétique. L'électrification de la capitale, loin d'être présentée comme un simple progrès technique, apparaît comme une révolution des usages : la nuit, désormais, appartient aussi aux ouvriers, aux flâneurs, aux amoureux. On regrettera toutefois une dernière partie un peu expédiée, où l'époque contemporaine, pourtant riche en débats sur la pollution lumineuse, n'est qu'effleurée. Reste une exposition intelligente et sensible, dont on ressort avec l'envie irrépressible d'arpenter Paris à la tombée du jour.",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "Summarise a press article you read recently and give your opinion, as in a French radio press review.",
      "prompt_fr": "Résumez un article de presse lu récemment et donnez votre avis, comme dans une revue de presse à la radio.",
      "seconds": 75,
      "model_fr": "J'ai lu récemment dans un grand quotidien un article sur la pénurie de logements étudiants à Paris. Le journaliste y explique qu'il manque des dizaines de milliers de places et que de nombreux étudiants sont contraints de vivre très loin de leur université, voire de renoncer à leurs études. L'article s'appuie sur des témoignages assez saisissants. Ce qui m'a frappé, c'est la précision des chiffres et la qualité de l'enquête. En revanche, j'aurais aimé que les solutions soient davantage développées : l'auteur se contente d'évoquer la construction de nouvelles résidences. Bref, c'est un article éclairant, mais qui laisse le lecteur un peu sur sa faim.",
      "keywords": ["j'ai lu", "l'article", "le journaliste", "explique", "ce qui m'a frappé", "en revanche", "sur sa faim"]
    }
  },
  "60": {
    "write": {
      "prompt_en": "Write a diplomatic email declining a colleague's project proposal without hurting them, using French understatement and tact.",
      "prompt_fr": "Rédigez un e-mail diplomatique pour décliner le projet d'un collègue sans le blesser, avec la litote et le tact à la française.",
      "minWords": 160,
      "must_use": ["at least 2 litotes or understatements (ce n'est pas inintéressant, légèrement ambitieux, je ne suis pas tout à fait certain que…)", "softening conditionals and modal expressions (il se pourrait que, peut-être pourrions-nous)", "an implicit criticism wrapped in praise", "a constructive alternative proposal"],
      "starter_fr": "Cher…, merci beaucoup de m'avoir fait parvenir ta proposition. La démarche n'est pas inintéressante…",
      "model_fr": "Cher Antoine, merci beaucoup de m'avoir fait parvenir ta proposition de refonte du processus d'intégration des nouveaux arrivants. J'ai pris le temps de la lire attentivement, et je dois dire que la démarche n'est pas inintéressante : on sent que tu as beaucoup réfléchi au sujet, et certaines idées, notamment le système de parrainage, me semblent très prometteuses. Cela dit, je ne suis pas tout à fait certain que le calendrier proposé soit compatible avec les contraintes actuelles de l'équipe. Mettre en place six nouveaux outils d'ici janvier me paraît, comment dire, légèrement ambitieux, surtout en pleine période de clôture budgétaire. Il se pourrait aussi que la direction juge le budget un peu élevé au regard des priorités du moment. Peut-être pourrions-nous envisager une version plus resserrée, centrée sur le parrainage, que l'on testerait d'abord avec deux ou trois nouvelles recrues ? Si les résultats sont concluants, nous aurions alors des arguments solides pour défendre le projet complet au printemps. Qu'en penses-tu ? Je serais ravi d'en discuter autour d'un café cette semaine. Bien amicalement, Sam",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "A friend proudly shows you a painting they made, and it is terrible. Respond with native tact and a touch of irony.",
      "prompt_fr": "Un ami vous montre fièrement un tableau qu'il a peint, et c'est un désastre. Répondez avec le tact d'un natif et une pointe d'ironie.",
      "seconds": 75,
      "model_fr": "Ah, d'accord… Eh bien, on ne peut pas dire que ça passe inaperçu ! C'est… comment dire… très personnel. Les couleurs sont, disons, audacieuses. Ce n'est pas vraiment mon style, mais je vois que tu t'es fait plaisir, et c'est l'essentiel. Le ciel, là, il est volontairement violet ? Bon, en tout cas, il faut du courage pour se lancer. Je ne suis pas sûr que je l'accrocherais dans mon salon, mais dans ton atelier, il a toute sa place !",
      "keywords": ["on ne peut pas dire", "comment dire", "disons", "ce n'est pas vraiment", "en tout cas", "je ne suis pas sûr"]
    }
  },
  "61": {
    "write": {
      "prompt_en": "Write a persuasive cover letter (lettre de motivation) for a consulting position in Paris.",
      "prompt_fr": "Rédigez une lettre de motivation convaincante pour un poste de consultant(e) à Paris.",
      "minWords": 160,
      "must_use": ["the classic three-part structure (vous / moi / nous)", "at least 3 persuasive techniques (a quantified achievement, a rhetorical question or tricolon, a call to action)", "formal formulas (Madame, Monsieur ; Je vous prie d'agréer…)", "at least 4 strong action verbs (piloter, fédérer, conduire, déployer, optimiser)"],
      "starter_fr": "Madame, Monsieur, accompagner les grandes entreprises dans leur transformation : telle est…",
      "model_fr": "Madame, Monsieur, accompagner les grandes entreprises françaises dans leur transformation durable : telle est l'ambition qui a guidé mon parcours, et c'est précisément celle que porte votre cabinet. Votre récente mission auprès d'un acteur majeur de l'énergie, saluée par la presse spécialisée, illustre la manière dont vous conjuguez rigueur analytique et impact concret. Diplômé d'un master en stratégie, j'ai piloté, lors de mon stage dans un grand groupe industriel, un projet d'optimisation de la chaîne logistique qui a permis de réduire les coûts de transport de 12 % en six mois. J'ai su fédérer une équipe de huit personnes issues de quatre pays, conduire des entretiens avec la direction générale et déployer des recommandations directement opérationnelles. Curieux, rigoureux et résolument tourné vers le client, je parle couramment anglais, hindi et français. Pourquoi votre cabinet ? Parce que j'y vois l'environnement idéal pour mettre mes compétences au service de projets exigeants, apprendre auprès des meilleurs et contribuer, à mon échelle, à la croissance de vos activités. Je serais heureux de vous exposer plus en détail ma motivation lors d'un entretien. Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées. Sam Kumar",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "Pitch an idea to your boss: convince them to fund a French-language programme for international employees.",
      "prompt_fr": "Présentez une idée à votre directrice : convainquez-la de financer un programme de français pour les salariés internationaux.",
      "seconds": 75,
      "model_fr": "Je voudrais vous soumettre une idée qui, je pense, peut vraiment faire la différence. Aujourd'hui, près d'un tiers de nos consultants sont internationaux, et beaucoup ont du mal à intervenir en français devant les clients. Résultat : on perd des opportunités, et certains talents finissent par partir. Je propose donc un programme de formation en français, deux heures par semaine, pendant six mois. Le coût est modeste, environ trente mille euros, soit moins que le recrutement d'un seul consultant. Imaginez des équipes plus autonomes, des clients plus satisfaits, des talents plus fidèles. Franchement, que risque-t-on ? Je vous propose de lancer un pilote dès janvier avec une dizaine de volontaires.",
      "keywords": ["je propose", "résultat", "le coût", "soit", "imaginez", "que risque-t-on", "dès janvier"]
    }
  },
  "62": {
    "write": {
      "prompt_en": "Write an elegant, witty farewell speech for your leaving party after five years in France, mixing humour, emotion and literary flair.",
      "prompt_fr": "Rédigez un discours d'adieu élégant et plein d'esprit pour votre pot de départ après cinq ans en France, mêlant humour, émotion et style littéraire.",
      "minWords": 200,
      "must_use": ["at least 1 literary tense or structure (passé simple, subjonctif imparfait / plus-que-parfait, inversion)", "at least 2 stylistic devices (anaphore, chiasme, antithèse, gradation)", "a touch of wit or self-deprecating humour", "a quotation or allusion to French literature or culture"],
      "starter_fr": "Chers amis, chers collègues, il y a cinq ans, je débarquai à Roissy…",
      "model_fr": "Chers amis, chers collègues, il y a cinq ans, je débarquai à Roissy avec deux valises, un dictionnaire et une confiance en moi parfaitement injustifiée. Je croyais parler français ; Paris se chargea, avec l'élégance qu'on lui connaît, de me détromper. Ma première commande dans une boulangerie fut un désastre, mon premier « tu » adressé à un directeur, une catastrophe diplomatique, et ma première grève, une révélation philosophique. Et pourtant, je suis resté. Je suis resté pour les terrasses en hiver et les débats en été. Je suis resté pour vos apéros qui commencent à dix-neuf heures et finissent, mystérieusement, à deux heures du matin. Je suis resté, surtout, pour vous. Vous m'avez appris que le français n'est pas une langue que l'on parle, mais une langue que l'on discute ; qu'un « pas mal » vaut un compliment et qu'un « c'est intéressant » vaut une condamnation. Vous m'avez appris l'art de râler avec bonheur et d'être heureux en râlant. Proust écrivait que le véritable voyage de découverte ne consiste pas à chercher de nouveaux paysages, mais à avoir de nouveaux yeux. Grâce à vous, je repars avec ces yeux-là. J'eusse aimé, pour l'occasion, maîtriser l'imparfait du subjonctif ; il faudra vous contenter de mon émotion, qui, elle, est parfaitement conjuguée. Alors je ne vous dis pas adieu. Je vous dis : à bientôt, et merci.",
      "model_en": ""
    },
    "speak": {
      "prompt_en": "Improvise a witty, elegant toast for a French colleague who is leaving the company.",
      "prompt_fr": "Improvisez un toast élégant et plein d'esprit pour une collègue française qui quitte l'entreprise.",
      "seconds": 90,
      "model_fr": "Mesdames et messieurs, si vous le permettez, je voudrais lever mon verre à Claire. Claire, c'est la seule personne que je connaisse capable de corriger un tableau Excel, de recadrer un client et de choisir le vin du déjeuner, le tout en moins de cinq minutes. Quand je suis arrivé dans l'équipe, je disais encore « je suis plein » à la fin des repas. Elle aurait pu se moquer de moi ; elle a préféré m'apprendre. Enfin… elle s'est un peu moquée, quand même. Claire, tu nous quittes pour Bordeaux, et l'on dit que le vin y est meilleur. Permets-moi d'en douter : rien ne vaudra celui que nous avons partagé ici. À ta nouvelle vie, à ton talent, et à notre amitié. Santé !",
      "keywords": ["lever mon verre", "la seule personne que je connaisse", "elle aurait pu", "permets-moi", "rien ne vaudra", "santé"]
    }
  }
};
