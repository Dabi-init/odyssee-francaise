// Native Gym — extra content: 30 scenes, 20 readings, 80 definitions.
// Extends window.NATIVE_GYM_DATA (defined in gym_data.js). Load after gym_data.js.
(function(){ var G = window.NATIVE_GYM_DATA = window.NATIVE_GYM_DATA || {scenes:[],readings:[],spoken:[],definitions:[],culture:[]};

// ───────────── SCENES A2 ─────────────
G.scenes = G.scenes.concat([
 {
  id: "plombier_telephone",
  title: "Appeler un plombier",
  cefr: "A2",
  place: "🔧 Au téléphone avec un plombier",
  goal: "Explain a leak, book a visit and ask about the quote.",
  turns: [
   {npc: "Plomberie Martin, bonjour !", npc_en: "Martin Plumbing, hello!", options: [
    {fr: "Bonjour monsieur, j'ai une fuite d'eau sous mon évier. Vous pouvez venir ?", ok: true, why: "You greet him, explain the problem clearly and ask politely."},
    {fr: "Salut, ça va ? Il y a de l'eau partout chez toi.", ok: false, why: "'Salut' and 'tu' are too familiar with a tradesman, and 'chez toi' means at HIS place."},
    {fr: "Bonjour, je voudrais réparer un plombier.", ok: false, why: "You want to repair the leak, not the plumber! Say 'J'ai besoin d'un plombier'."}
   ]},
   {npc: "D'accord. C'est une grosse fuite ou ça goutte un peu ?", npc_en: "OK. Is it a big leak or is it just dripping a bit?", options: [
    {fr: "Oui, c'est une fuite.", ok: false, why: "It's an either/or question: 'oui' doesn't tell him which."},
    {fr: "Ça goutte un peu, mais depuis deux jours.", ok: true, why: "You answer the either/or question and say how long with 'depuis'."},
    {fr: "Il y a deux jours que ça goutte pendant.", ok: false, why: "'Pendant' can't end the sentence like that. Say 'ça goutte depuis deux jours'."}
   ]},
   {npc: "Vous avez coupé l'eau ?", npc_en: "Have you turned the water off?", options: [
    {fr: "Non, j'ai coupé l'eau avec un couteau.", ok: false, why: "'Couper l'eau' means turning off the supply, not cutting anything with a knife."},
    {fr: "Oui, j'ai éteint l'eau.", ok: false, why: "'Éteindre' is for lights or fires. For water, say 'couper l'eau' or 'fermer le robinet'."},
    {fr: "Oui, j'ai fermé le robinet sous l'évier.", ok: true, why: "Clear and correct: 'fermer le robinet' = turn off the tap."}
   ]},
   {npc: "Je peux passer demain matin entre 8 h et 10 h. Ça vous va ?", npc_en: "I can come by tomorrow morning between 8 and 10. Does that suit you?", options: [
    {fr: "Oui, ça me va. Je serai à la maison.", ok: true, why: "'Ça me va' is the natural answer to 'Ça vous va ?'."},
    {fr: "Oui, ça me va bien, c'est ma taille.", ok: false, why: "'Ça me va' can also mean 'it fits me' for clothes, but 'c'est ma taille' makes no sense here."},
    {fr: "Demain, je suis libre à 22 h.", ok: false, why: "He offered 8 to 10 a.m.: 10 p.m. ignores his proposal."}
   ]},
   {npc: "Très bien. C'est à quelle adresse ?", npc_en: "Very good. What's the address?", options: [
    {fr: "J'habite dans un appartement.", ok: false, why: "Too vague: he needs the actual address."},
    {fr: "C'est au 12, rue des Pyrénées, dans le 20e. Troisième étage, code 4521B.", ok: true, why: "Number, street, district, floor and door code: everything a Parisian tradesman needs."},
    {fr: "Mon adresse est très jolie.", ok: false, why: "He doesn't need your opinion of the street, just the address."}
   ]},
   {npc: "C'est noté. Le déplacement est à 50 euros, et je vous fais un devis sur place.", npc_en: "Noted. The call-out fee is 50 euros, and I'll give you a quote on site.", options: [
    {fr: "Je ne veux pas payer, c'est votre problème.", ok: false, why: "Rude, and a call-out fee is normal in France."},
    {fr: "Merci, je vais deviner le prix.", ok: false, why: "'Deviner' means to guess. 'Un devis' is a written quote."},
    {fr: "D'accord. Et le devis est gratuit ?", ok: true, why: "You accept and ask a smart question: quotes are often free, but it's worth checking."}
   ]}
  ]
 },
 {
  id: "brocante_marchander",
  title: "Marchander à la brocante",
  cefr: "A2",
  place: "🪑 Brocante du dimanche à Montreuil",
  goal: "Ask the price of an old object, haggle politely and pay.",
  turns: [
   {npc: "Bonjour ! Vous cherchez quelque chose en particulier ?", npc_en: "Hello! Are you looking for anything in particular?", options: [
    {fr: "Non, je regarde, merci. Ah, il est joli, ce miroir !", ok: true, why: "Polite and natural: you're browsing, then you show interest."},
    {fr: "Oui, je cherche quelque chose de particulier.", ok: false, why: "This just repeats his words without saying what you want."},
    {fr: "Je cherche un mirror.", ok: false, why: "Anglicism: in French it's 'un miroir'."}
   ]},
   {npc: "Il est ancien, des années 1930. Et il est en très bon état.", npc_en: "It's old, from the 1930s. And it's in very good condition.", options: [
    {fr: "Combien d'années il a ?", ok: false, why: "He just told you how old it is. Ask the price."},
    {fr: "Combien tu veux pour ça ?", ok: false, why: "'Tu' with a stranger you're bargaining with sounds rude."},
    {fr: "Il fait combien, s'il vous plaît ?", ok: true, why: "'Il fait combien ?' is the everyday way to ask the price of an item."}
   ]},
   {npc: "Pour vous, 80 euros.", npc_en: "For you, 80 euros.", options: [
    {fr: "80 euros ? C'est un peu cher... Vous me le faites à 50 ?", ok: true, why: "'Vous me le faites à... ?' is the classic way to make an offer."},
    {fr: "D'accord, je vous donne 100 euros.", ok: false, why: "Offering more than the asking price isn't haggling!"},
    {fr: "C'est trop cher, vous êtes un voleur.", ok: false, why: "Calling him a thief is insulting. Haggling in France stays friendly."}
   ]},
   {npc: "50, non, c'est trop peu. Je peux descendre à 70.", npc_en: "50, no, that's too little. I can go down to 70.", options: [
    {fr: "70 ? Bon, alors 75.", ok: false, why: "You're raising your own offer above his price!"},
    {fr: "Allez, 60 et je le prends tout de suite.", ok: true, why: "A middle offer plus a promise to buy right now: very effective."},
    {fr: "Moi aussi, je descends au métro.", ok: false, why: "Here 'descendre' means lowering the price, not going down to the metro."}
   ]},
   {npc: "Bon, d'accord, 60. Mais c'est bien parce que c'est vous !", npc_en: "OK, fine, 60. But only because it's you!", options: [
    {fr: "Vous acceptez les chèques de voyage ?", ok: false, why: "Traveller's cheques are obsolete. At a brocante, people pay cash."},
    {fr: "C'est parce que je suis beau ?", ok: false, why: "'C'est bien parce que c'est vous' is just a friendly formula, not a compliment to answer."},
    {fr: "Merci, c'est gentil ! Je vous paie en liquide.", ok: true, why: "At a brocante, people almost always pay cash ('en liquide' or 'en espèces')."}
   ]},
   {npc: "Voilà. Je vous l'emballe dans du papier journal ?", npc_en: "Here you go. Shall I wrap it in newspaper for you?", options: [
    {fr: "Non, je ne lis pas le journal.", ok: false, why: "He's offering to wrap the mirror, not to sell you a newspaper."},
    {fr: "Oui, volontiers, merci ! Bonne journée !", ok: true, why: "'Volontiers' = gladly. A warm, polite ending."},
    {fr: "Oui, emballe-le vite.", ok: false, why: "'Tu' plus a bare imperative sounds bossy."}
   ]}
  ]
 },
 {
  id: "colis_point_relais",
  title: "Récupérer un colis au point relais",
  cefr: "A2",
  place: "📦 Point relais (épicerie de quartier)",
  goal: "Collect a parcel, show your ID and sort out a small problem.",
  turns: [
   {npc: "Bonjour ! C'est pour un retrait de colis ?", npc_en: "Hello! Is it to collect a parcel?", options: [
    {fr: "Non, c'est pour un retrait d'argent.", ok: false, why: "This is a shop, not a bank or a cash machine."},
    {fr: "Bonjour ! Oui, j'ai reçu un SMS : mon colis est arrivé.", ok: true, why: "You greet him and explain why you're here."},
    {fr: "Oui, je viens chercher mon colis de moi.", ok: false, why: "'Mon colis de moi' is redundant and incorrect: just say 'mon colis'."}
   ]},
   {npc: "Vous avez le code de retrait ?", npc_en: "Do you have the collection code?", options: [
    {fr: "Oui, attendez, je le cherche sur mon téléphone... Voilà : 482916.", ok: true, why: "You find the code in the SMS and read it out."},
    {fr: "Le code ? Non, c'est secret.", ok: false, why: "The code is meant for him: you have to show it."},
    {fr: "Oui, je l'ai, merci.", ok: false, why: "Saying you have it isn't enough: give it to him."}
   ]},
   {npc: "Et une pièce d'identité, s'il vous plaît.", npc_en: "And some ID, please.", options: [
    {fr: "Je n'ai pas de pièces, seulement des billets.", ok: false, why: "'Une pièce d'identité' is an ID document, not a coin ('une pièce')."},
    {fr: "Mon identité, c'est moi.", ok: false, why: "Not an answer: he needs a document."},
    {fr: "Voici ma carte de séjour.", ok: true, why: "A residence permit is valid ID."}
   ]},
   {npc: "Hmm... Je ne le trouve pas. Il est à quel nom ?", npc_en: "Hmm... I can't find it. What name is it under?", options: [
    {fr: "Il est au nom de Garcia : G-A-R-C-I-A.", ok: true, why: "Spelling your name avoids mistakes. 'Au nom de' = under the name of."},
    {fr: "Il est à mon nom de famille.", ok: false, why: "He needs the actual name."},
    {fr: "C'est un très joli nom.", ok: false, why: "Off topic."}
   ]},
   {npc: "Ah, le voilà ! Il était derrière. Attention, il est lourd.", npc_en: "Ah, here it is! It was at the back. Careful, it's heavy.", options: [
    {fr: "Lourd ? Vous êtes fatigué ?", ok: false, why: "He's warning you, not complaining."},
    {fr: "Je ne le veux pas, il est trop lourd.", ok: false, why: "It's your parcel: refusing it makes no sense."},
    {fr: "Merci ! Ça va, je vais me débrouiller.", ok: true, why: "You thank him and reassure him: 'je vais me débrouiller' = I'll manage."}
   ]},
   {npc: "Signez ici, s'il vous plaît. Voilà, bonne journée !", npc_en: "Sign here, please. There you go, have a nice day!", options: [
    {fr: "Merci, à vous aussi ! Au revoir.", ok: true, why: "The ritual reply: thank him and return the wish."},
    {fr: "Je signe ma signature ?", ok: false, why: "Redundant: just sign."},
    {fr: "Bonne journée à toi !", ok: false, why: "'Toi' is too familiar with a shopkeeper."}
   ]}
  ]
 },
 {
  id: "dejeuner_collegue_cantine",
  title: "Déjeuner avec une nouvelle collègue",
  cefr: "A2",
  place: "🍽️ Cantine de l'entreprise",
  goal: "Have lunch with a colleague: introduce yourself, talk about your job and your weekend.",
  turns: [
   {npc: "Salut ! Tu es nouveau, non ? Je peux m'asseoir avec toi ?", npc_en: "Hi! You're new, right? Can I sit with you?", options: [
    {fr: "Oui, vous pouvez vous asseoir, madame.", ok: false, why: "She used 'tu': between young colleagues, 'vous' and 'madame' sound stiff."},
    {fr: "Oui, bien sûr, assieds-toi ! Je suis arrivé lundi.", ok: true, why: "Friendly, you keep her 'tu' and give a bit of information."},
    {fr: "Non, c'est ma chaise.", ok: false, why: "Unfriendly: in a canteen, people share tables."}
   ]},
   {npc: "Moi, c'est Camille, je suis au service marketing. Et toi, tu fais quoi ?", npc_en: "I'm Camille, I'm in marketing. And you, what do you do?", options: [
    {fr: "Je suis un consultant junior.", ok: false, why: "In French, there's no article before a job after 'je suis'."},
    {fr: "Je suis consultant junior, dans l'équipe stratégie.", ok: true, why: "Correct: no article before the job title, plus your team."},
    {fr: "Moi aussi, je suis au service.", ok: false, why: "Incomplete: 'au service' needs a department name."}
   ]},
   {npc: "Ah, cool ! Et ça se passe bien, ta première semaine ?", npc_en: "Oh, cool! And is your first week going well?", options: [
    {fr: "Oui, je passe bien.", ok: false, why: "The fixed expression is 'ça se passe bien'. 'Je passe bien' means nothing."},
    {fr: "Je suis très excité de travailler ici !", ok: false, why: "False friend: 'excité' can sound sexual or hyperactive. Say 'Je suis très content'."},
    {fr: "Oui, ça se passe bien, l'équipe est sympa ! Par contre, il y a beaucoup de réunions.", ok: true, why: "Positive, with a light comment: perfect small talk."}
   ]},
   {npc: "Ha ha, oui, ici on adore les réunions ! Tu viens d'où, au fait ?", npc_en: "Ha ha, yes, we love meetings here! Where are you from, by the way?", options: [
    {fr: "Je viens de Lisbonne, mais j'habite à Paris depuis six mois.", ok: true, why: "'Depuis' is used for something that started in the past and is still true."},
    {fr: "Je viens de la cantine.", ok: false, why: "She's asking where you're from, not where you've just walked from."},
    {fr: "J'habite à Paris pour six mois.", ok: false, why: "'Pour six mois' means you'll only stay six months. Use 'depuis' for an ongoing situation."}
   ]},
   {npc: "Sympa ! Et tu fais quoi ce week-end ?", npc_en: "Nice! And what are you doing this weekend?", options: [
    {fr: "Je visite des amis samedi.", ok: false, why: "Anglicism: you 'visitez' places, but you 'rendez visite à' people (or 'je vois des amis')."},
    {fr: "Rien, et ce n'est pas tes affaires.", ok: false, why: "Very rude: it's normal small talk."},
    {fr: "Je vais au musée d'Orsay avec des amis. Et toi ?", ok: true, why: "You answer and ask back: that keeps the conversation going."}
   ]},
   {npc: "Moi, je vais au marché d'Aligre dimanche. Bon, il faut que j'y retourne. À plus !", npc_en: "I'm going to the Aligre market on Sunday. Right, I've got to get back. See you!", options: [
    {fr: "À plus, Camille ! Bon après-midi !", ok: true, why: "Matches her casual tone; 'bon après-midi' fits after lunch."},
    {fr: "Au revoir, madame. Veuillez agréer mes salutations distinguées.", ok: false, why: "Way too formal: that's the closing formula of an official letter."},
    {fr: "Bonne nuit !", ok: false, why: "It's lunchtime: 'bonne nuit' is only said before going to bed."}
   ]}
  ]
 }
]);

// ───────────── SCENES B1 ─────────────
G.scenes = G.scenes.concat([
 {
  id: "caf_aide_logement",
  title: "Appeler la CAF",
  cefr: "B1",
  place: "📞 CAF, plateforme téléphonique",
  goal: "Chase up your housing benefit (APL), give your file number and find out what's missing.",
  turns: [
   {npc: "Caisse d'allocations familiales de Paris, bonjour. Je vous écoute.", npc_en: "Paris Family Allowance Fund, hello. How can I help?", options: [
    {fr: "Bonjour madame. J'ai fait une demande d'APL il y a deux mois et je n'ai toujours pas de réponse.", ok: true, why: "Clear context: what you applied for, when, and what the problem is."},
    {fr: "Bonjour, je veux mon argent.", ok: false, why: "Too blunt and too vague: explain your request."},
    {fr: "Bonjour, j'appelle pour mon application de logement.", ok: false, why: "False friend: 'une application' is an app. An application form is 'une demande'."}
   ]},
   {npc: "Vous avez votre numéro d'allocataire ?", npc_en: "Do you have your claimant number?", options: [
    {fr: "Oui, je l'ai, merci.", ok: false, why: "Saying you have it isn't enough: read it out."},
    {fr: "Non, je ne suis pas allocataire, je suis locataire.", ok: false, why: "Confuses 'allocataire' (benefit claimant) with 'locataire' (tenant). Once you've applied, you have a claimant number."},
    {fr: "Oui, c'est le 1234567. Je m'appelle Rossi, R-O-S-S-I.", ok: true, why: "You give the number and spell your name: the agent can find your file straight away."}
   ]},
   {npc: "Je vois votre dossier. Il manque une pièce justificative : l'attestation de loyer signée par votre propriétaire.", npc_en: "I can see your file. One supporting document is missing: the rent certificate signed by your landlord.", options: [
    {fr: "Ce n'est pas possible, vous avez perdu mon dossier !", ok: false, why: "Accusatory: the agent is just reading your file."},
    {fr: "Ah bon ? Personne ne m'a prévenu. Comment est-ce que je peux l'envoyer ?", ok: true, why: "You show surprise politely and ask how to fix it."},
    {fr: "Une pièce ? Je peux payer en euros ?", ok: false, why: "'Une pièce justificative' is a supporting document, not a coin."}
   ]},
   {npc: "Votre propriétaire peut la remplir directement en ligne, sur caf.fr, dans son espace bailleur.", npc_en: "Your landlord can fill it in directly online, on caf.fr, in their landlord account.", options: [
    {fr: "D'accord, je vais le demander de le faire.", ok: false, why: "Grammar: it's 'demander à quelqu'un', so 'je vais lui demander'."},
    {fr: "D'accord, je vais lui demander de le faire cette semaine.", ok: true, why: "Correct indirect pronoun ('lui') and a concrete timeframe."},
    {fr: "Mon propriétaire ne sait pas internet, c'est votre travail.", ok: false, why: "'Savoir internet' is incorrect, and pushing the job onto her is rude."}
   ]},
   {npc: "Une fois la pièce reçue, comptez environ trois semaines de traitement.", npc_en: "Once we receive the document, allow about three weeks for processing.", options: [
    {fr: "Trois semaines ? Vous rigolez ?", ok: false, why: "Too familiar and sarcastic with an official."},
    {fr: "D'accord, je compte : un, deux, trois.", ok: false, why: "'Comptez trois semaines' means 'allow three weeks', not 'count'."},
    {fr: "Et les deux mois d'attente, ils seront versés rétroactivement ?", ok: true, why: "A smart question: 'rétroactivement' = backdated."}
   ]},
   {npc: "Oui, les droits sont calculés à partir de la date de votre demande. Autre chose ?", npc_en: "Yes, your entitlement is calculated from the date of your application. Anything else?", options: [
    {fr: "Non, c'est tout. Merci beaucoup pour votre aide, bonne journée.", ok: true, why: "A clear, polite way to end the call."},
    {fr: "Non merci, je n'ai pas d'autres choses.", ok: false, why: "Clumsy: say 'Non, ce sera tout' or 'Non, c'est tout'."},
    {fr: "Oui : je vous aime !", ok: false, why: "Way too much for a helpful agent!"}
   ]}
  ]
 },
 {
  id: "cpam_carte_vitale",
  title: "Obtenir sa carte Vitale",
  cefr: "B1",
  place: "🏥 Accueil de la CPAM",
  goal: "Find out how to get your health insurance card and how reimbursement works.",
  turns: [
   {npc: "Bonjour, vous avez pris un ticket ? ... Très bien, je vous écoute.", npc_en: "Hello, did you take a ticket? ... Fine, how can I help?", options: [
    {fr: "Salut ! Ça marche comment, ici ?", ok: false, why: "'Salut' is too casual in a public office."},
    {fr: "Bonjour. Je viens d'arriver en France pour travailler et je voudrais obtenir ma carte Vitale.", ok: true, why: "You explain your situation and your request clearly."},
    {fr: "Bonjour, je voudrais une carte de crédit santé.", ok: false, why: "No such thing: the French health card is called 'la carte Vitale'."}
   ]},
   {npc: "Vous avez déjà un numéro de sécurité sociale ?", npc_en: "Do you already have a social security number?", options: [
    {fr: "Oui, je suis en sécurité.", ok: false, why: "'La sécurité sociale' is the public health system: it has nothing to do with being safe."},
    {fr: "Non, pas encore. Mon employeur m'a conseillé de venir ici.", ok: true, why: "A clear answer, plus useful context."},
    {fr: "Non, je ne suis pas très social.", ok: false, why: "Misunderstands the term completely."}
   ]},
   {npc: "Alors il faut d'abord ouvrir vos droits. Vous avez un acte de naissance traduit ?", npc_en: "Then we first need to open your entitlements. Do you have a translated birth certificate?", options: [
    {fr: "Oui, je l'ai traduit moi-même avec Google.", ok: false, why: "French administrations require a certified translation, not a machine one."},
    {fr: "Non, mais j'ai mon permis de conduire.", ok: false, why: "A driving licence doesn't replace a birth certificate."},
    {fr: "Oui, j'ai une traduction faite par un traducteur assermenté.", ok: true, why: "A sworn translation ('traducteur assermenté') is exactly what's required."}
   ]},
   {npc: "Parfait. En attendant la carte, vous recevrez une attestation de droits. Gardez-la bien.", npc_en: "Perfect. While you wait for the card, you'll receive a certificate of entitlement. Keep it safe.", options: [
    {fr: "D'accord. Je la montre au médecin si je suis malade avant d'avoir la carte ?", ok: true, why: "A relevant follow-up question showing you understood."},
    {fr: "Je peux la jeter après ?", ok: false, why: "She just told you to keep it."},
    {fr: "D'accord, je vais l'attester.", ok: false, why: "'Attester' means to certify: you just need to keep the document."}
   ]},
   {npc: "Exactement. Et pensez à déclarer un médecin traitant, sinon vous serez moins bien remboursé.", npc_en: "Exactly. And remember to register a regular GP, otherwise you'll be reimbursed less.", options: [
    {fr: "Je n'ai pas besoin de médecin, je suis en bonne santé.", ok: false, why: "Misses the point: having a registered GP affects your reimbursements whenever you need care."},
    {fr: "Je vais traiter mon médecin.", ok: false, why: "'Médecin traitant' = registered GP. 'Traiter quelqu'un de...' means to call someone names."},
    {fr: "Ah, je ne savais pas. Comment on fait pour le déclarer ?", ok: true, why: "You admit you didn't know and ask for the procedure."}
   ]},
   {npc: "C'est simple : vous le faites lors de votre première consultation, le médecin s'en occupe.", npc_en: "It's simple: you do it at your first appointment, the doctor takes care of it.", options: [
    {fr: "Merci pour toutes ces informations, ma chérie.", ok: false, why: "'Ma chérie' is far too familiar with an agent."},
    {fr: "Super, merci beaucoup pour toutes ces informations !", ok: true, why: "Warm and polite."},
    {fr: "Merci, vous êtes très informative.", ok: false, why: "'Informatif' describes documents, not people. Just say 'merci pour votre aide'."}
   ]}
  ]
 },
 {
  id: "pharmacie_ordonnance",
  title: "À la pharmacie avec une ordonnance",
  cefr: "B1",
  place: "💊 Pharmacie de quartier",
  goal: "Get a prescription filled, accept the generic and understand the dosage.",
  turns: [
   {npc: "Bonjour ! Vous avez une ordonnance ?", npc_en: "Hello! Do you have a prescription?", options: [
    {fr: "Oui, j'ai une recette du médecin.", ok: false, why: "'Une recette' is a recipe (or takings). A prescription is 'une ordonnance'."},
    {fr: "Bonjour, je veux des drogues.", ok: false, why: "False friend: 'la drogue' means illegal drugs. Say 'des médicaments'."},
    {fr: "Bonjour, oui, voilà. Le médecin m'a prescrit un antibiotique.", ok: true, why: "You hand over the prescription and say what it's for."}
   ]},
   {npc: "Je vous mets le générique, ça vous va ?", npc_en: "I'll give you the generic, is that OK?", options: [
    {fr: "Oui, pas de problème.", ok: true, why: "Generics are standard in France; refusing them can mean paying upfront."},
    {fr: "Non, je veux le vrai médicament, pas une copie.", ok: false, why: "A generic contains the same molecule. Refusing it often means you pay first and get reimbursed later."},
    {fr: "Le générique de quel film ?", ok: false, why: "Here 'générique' means a generic drug, not the credits of a film."}
   ]},
   {npc: "Vous avez votre carte Vitale et votre carte de mutuelle ?", npc_en: "Do you have your Vitale card and your top-up insurance card?", options: [
    {fr: "Oui, j'ai une mutuelle avec mon voisin.", ok: false, why: "'Une mutuelle' is your complementary health insurance, not something you share with a neighbour."},
    {fr: "Voici ma carte Vitale. Pour la mutuelle, j'ai l'attestation sur mon téléphone, ça marche ?", ok: true, why: "You give both and check a digital certificate is accepted."},
    {fr: "Je n'ai pas de carte, je paie avec mon passeport.", ok: false, why: "A passport is neither a payment card nor an insurance card."}
   ]},
   {npc: "Oui, c'est parfait. Alors : un comprimé matin et soir, pendant sept jours, au milieu du repas.", npc_en: "Yes, that's perfect. So: one tablet morning and evening, for seven days, in the middle of a meal.", options: [
    {fr: "Donc deux comprimés au milieu de la nuit ?", ok: false, why: "You misheard: morning and evening, with meals."},
    {fr: "D'accord. Et je peux arrêter si je me sens mieux avant la fin ?", ok: true, why: "A sensible question to check: with antibiotics, the answer is usually no."},
    {fr: "Pendant sept jours, je ne mange pas ?", ok: false, why: "'Au milieu du repas' means you take it during the meal."}
   ]},
   {npc: "Surtout pas ! Il faut aller jusqu'au bout du traitement, même si ça va mieux.", npc_en: "Absolutely not! You have to finish the course, even if you feel better.", options: [
    {fr: "Je vais aller au bout de la rue, alors.", ok: false, why: "'Aller jusqu'au bout du traitement' means finishing the treatment."},
    {fr: "D'accord, mais je prends les médicaments quand je veux.", ok: false, why: "Ignores medical advice."},
    {fr: "Entendu, je finirai la boîte. Il y a des effets secondaires ?", ok: true, why: "'Entendu' = understood; a useful follow-up question."}
   ]},
   {npc: "Parfois des troubles digestifs. Si ça persiste, rappelez votre médecin. Ça fera 2,40 €, le reste est pris en charge.", npc_en: "Sometimes digestive problems. If it persists, call your doctor back. That'll be €2.40, the rest is covered.", options: [
    {fr: "Très bien, merci pour vos conseils. Bonne journée !", ok: true, why: "Polite thanks for the advice."},
    {fr: "Pris en charge ? Je dois charger mon téléphone ?", ok: false, why: "'Pris en charge' means covered (reimbursed)."},
    {fr: "Seulement 2,40 € ? Gardez la monnaie, c'est un pourboire.", ok: false, why: "You don't tip pharmacists in France."}
   ]}
  ]
 },
 {
  id: "banque_ouverture_compte",
  title: "Ouvrir un compte en banque",
  cefr: "B1",
  place: "🏦 Agence bancaire",
  goal: "Open a bank account, negotiate fees and set up a standing order for your rent.",
  turns: [
   {npc: "Bonjour, vous avez rendez-vous ?", npc_en: "Hello, do you have an appointment?", options: [
    {fr: "Non, mais je suis là, donc c'est bon.", ok: false, why: "Presumptuous: French banks usually work by appointment."},
    {fr: "Bonjour, oui, à 14 h avec Mme Lefèvre, pour ouvrir un compte.", ok: true, why: "Time, adviser's name and purpose: perfect."},
    {fr: "Oui, j'ai un rendez-vous amoureux avec la banque.", ok: false, why: "Here 'rendez-vous' is just an appointment."}
   ]},
   {npc: "Très bien. Pour l'ouverture, il me faut une pièce d'identité, un justificatif de domicile et vos trois derniers bulletins de salaire.", npc_en: "Fine. To open it, I need ID, proof of address and your last three payslips.", options: [
    {fr: "Un justificatif de domicile ? Je ne suis pas un criminel !", ok: false, why: "Proof of address is routine, not an accusation."},
    {fr: "Je n'ai pas de bulletins, je n'ai pas voté.", ok: false, why: "'Bulletin de salaire' = payslip. 'Bulletin de vote' is for elections."},
    {fr: "J'ai tout, sauf les bulletins : je viens de commencer. J'ai mon contrat de travail, ça ira ?", ok: true, why: "You explain the gap and offer an alternative."}
   ]},
   {npc: "Oui, un CDI suffira. Vous voulez quel type de carte ?", npc_en: "Yes, a permanent contract will do. What kind of card would you like?", options: [
    {fr: "Une carte à débit immédiat, c'est plus simple pour gérer mon budget.", ok: true, why: "Precise banking vocabulary and a reason."},
    {fr: "Une carte de crédit avec beaucoup de crédit, s'il vous plaît.", ok: false, why: "Sounds naïve: most French cards are debit cards, and credit isn't handed out like that."},
    {fr: "La carte bleue, c'est ma couleur préférée.", ok: false, why: "'Carte bleue' is just the everyday name for a bank card, not a colour choice."}
   ]},
   {npc: "D'accord. Il y a des frais de tenue de compte de 2 euros par mois, et la carte coûte 45 euros par an.", npc_en: "OK. There's an account fee of €2 a month, and the card costs €45 a year.", options: [
    {fr: "Quoi ? C'est du vol !", ok: false, why: "Too aggressive: negotiate instead."},
    {fr: "Est-ce que vous pourriez faire un geste commercial ? Les banques en ligne sont gratuites.", ok: true, why: "Asking for a 'geste commercial' with a comparison is normal and polite."},
    {fr: "D'accord, et vous pouvez me prêter 2 euros ?", ok: false, why: "Asking the adviser for change is absurd."}
   ]},
   {npc: "Je peux vous offrir la carte la première année. Autre chose ?", npc_en: "I can give you the card free for the first year. Anything else?", options: [
    {fr: "Non, c'est assez. Je suis plein.", ok: false, why: "'Je suis plein' doesn't mean 'I'm done'; it sounds like 'I'm drunk'."},
    {fr: "Oui, je voudrais que vous payiez mon loyer chaque mois.", ok: false, why: "The bank won't pay it for you: you set up a standing order ('un virement permanent')."},
    {fr: "Oui, je voudrais mettre en place un virement permanent pour mon loyer.", ok: true, why: "'Virement permanent' = standing order. Exactly the right term."}
   ]},
   {npc: "C'est noté. Vous recevrez votre carte par courrier sous dix jours, et le code séparément.", npc_en: "Noted. You'll receive your card by post within ten days, and the PIN separately.", options: [
    {fr: "Le code, je peux vous le dire maintenant ?", ok: false, why: "The bank sends you the PIN: you don't tell it to the adviser."},
    {fr: "Sous dix jours ? Je vais regarder sous mon lit.", ok: false, why: "'Sous dix jours' means within ten days."},
    {fr: "Parfait, merci pour votre aide. Au revoir !", ok: true, why: "A polite ending."}
   ]}
  ]
 },
 {
  id: "apero_collegues",
  title: "Apéro avec les collègues",
  cefr: "B1",
  place: "🍻 Bar près du bureau, jeudi 19 h",
  goal: "Understand casual slang at after-work drinks and answer naturally.",
  turns: [
   {npc: "Alors, t'as kiffé ta première semaine ou t'es déjà au bout du rouleau ?", npc_en: "So, did you love your first week or are you already at the end of your tether?", options: [
    {fr: "Je ne comprends pas, quel rouleau ?", ok: false, why: "'Être au bout du rouleau' = to be exhausted. Taking it literally kills the vibe."},
    {fr: "J'ai kiffé ! Bon, je suis un peu crevé, mais ça va.", ok: true, why: "You pick up the slang ('kiffer', 'crevé') naturally."},
    {fr: "Je suis très satisfait de mes conditions de travail, je vous remercie.", ok: false, why: "Far too formal, and 'vous' among colleagues at an apéro."}
   ]},
   {npc: "Ha ha, normal. Tu bois quoi ? C'est ma tournée !", npc_en: "Ha ha, that's normal. What are you drinking? It's my round!", options: [
    {fr: "Je ne fais pas de tournée, je reste ici.", ok: false, why: "'C'est ma tournée' = it's my round (I'm paying), not a tour."},
    {fr: "Merci, mais je paie toujours ma bière tout seul.", ok: false, why: "Refusing a round can seem cold. Accept and offer the next one."},
    {fr: "Un demi, s'il te plaît. Merci ! La prochaine, c'est pour moi.", ok: true, why: "'Un demi' = a small draught beer; offering the next round is the etiquette."}
   ]},
   {npc: "Au fait, le boss, il t'a pas trop saoulé avec son tableau Excel ?", npc_en: "By the way, the boss didn't bore you to death with his Excel spreadsheet?", options: [
    {fr: "Un peu, mais bon, il a l'air sympa.", ok: true, why: "In slang, 'saouler' = to bore or annoy. You stay diplomatic about your boss."},
    {fr: "Non, il ne m'a pas donné d'alcool.", ok: false, why: "'Saouler quelqu'un' in slang means boring or annoying them, not getting them drunk."},
    {fr: "Oui, c'est un gros con.", ok: false, why: "Insulting your boss in public during your first week is very risky."}
   ]},
   {npc: "Tu viens samedi ? On se fait une soirée chez Karim, ça va être chanmé.", npc_en: "Are you coming on Saturday? We're having a party at Karim's, it's gonna be awesome.", options: [
    {fr: "Chanmé ? C'est méchant ?", ok: false, why: "'Chanmé' is verlan for 'méchant', but in slang it means awesome."},
    {fr: "Je dois consulter mon agenda et je reviendrai vers vous.", ok: false, why: "Too formal and stiff for friends."},
    {fr: "Grave ! Je ramène quoi ?", ok: true, why: "'Grave !' = totally! And offering to bring something is good manners."}
   ]},
   {npc: "Des chips ou un truc à grignoter, ça suffit. Bon, moi je me casse, sinon je vais rater le dernier métro.", npc_en: "Crisps or something to nibble, that's enough. Right, I'm off, otherwise I'll miss the last metro.", options: [
    {fr: "Tu te casses ? Tu as mal ?", ok: false, why: "In slang, 'se casser' = to leave. Nobody is breaking a bone."},
    {fr: "Ok, à samedi alors ! Rentre bien !", ok: true, why: "'Rentre bien' = get home safe: a very common goodbye."},
    {fr: "Pourquoi tu pars ? Tu es fâché ?", ok: false, why: "You're misreading a normal departure as anger."}
   ]}
  ]
 },
 {
  id: "point_equipe_lundi",
  title: "Le point d'équipe du lundi",
  cefr: "B1",
  place: "💻 Salle de réunion (et visio)",
  goal: "Give a short project update, ask for help and agree on next steps.",
  turns: [
   {npc: "Bon, on fait un petit tour de table. Tu commences ? Où en es-tu sur le dossier client ?", npc_en: "Right, let's go round the table. Will you start? Where are you on the client file?", options: [
    {fr: "Je suis sur la table.", ok: false, why: "'Où en es-tu ?' asks about your progress, not your location."},
    {fr: "J'ai fini les data et je dois écrire le summary.", ok: false, why: "Franglais: in a French meeting, say 'les données' and 'la synthèse'."},
    {fr: "J'ai fini l'analyse des données, il me reste la synthèse à rédiger.", ok: true, why: "Clear status: what's done, and what's left ('il me reste...')."}
   ]},
   {npc: "Super. Tu penses pouvoir l'envoyer quand ?", npc_en: "Great. When do you think you can send it?", options: [
    {fr: "D'ici jeudi midi, si tout va bien.", ok: true, why: "'D'ici' = by: a clear deadline with a realistic caveat."},
    {fr: "Jeudi midi, éventuellement.", ok: false, why: "False friend: 'éventuellement' means 'possibly', so it sounds noncommittal."},
    {fr: "Quand je serai prêt, on verra.", ok: false, why: "Too vague for a team meeting."}
   ]},
   {npc: "Ça marche. Tu as besoin de quelque chose ?", npc_en: "Sounds good. Do you need anything?", options: [
    {fr: "Oui, j'ai besoin que Julie fait mes graphiques.", ok: false, why: "'Avoir besoin que' takes the subjunctive ('fasse'), and you're dumping your work on her."},
    {fr: "Oui, j'aurais besoin que quelqu'un relise mes graphiques. Julie, tu aurais un moment ?", ok: true, why: "Polite conditional and a concrete request to a named colleague."},
    {fr: "Non, je n'ai jamais besoin d'aide.", ok: false, why: "Sounds arrogant: teamwork is valued."}
   ]},
   {npc: "(Julie) Pas de souci, envoie-les-moi demain matin, je regarde ça dans la journée.", npc_en: "(Julie) No worries, send them to me tomorrow morning, I'll look at them during the day.", options: [
    {fr: "Merci Julie, je vous les envoie demain.", ok: false, why: "Julie used 'tu': switching to 'vous' sounds cold."},
    {fr: "Merci, je te les ai envoyés hier.", ok: false, why: "Contradiction: she's asking you to send them tomorrow."},
    {fr: "Génial, merci Julie ! Je te les envoie avant 10 h.", ok: true, why: "Warm thanks, same 'tu', and a precise time."}
   ]},
   {npc: "Parfait. Dernier point : le client veut avancer la réunion de restitution à vendredi. Ça te paraît faisable ?", npc_en: "Perfect. One last point: the client wants to bring the debrief meeting forward to Friday. Does that seem doable?", options: [
    {fr: "Oui, avancer à vendredi, donc on a plus de temps.", ok: false, why: "'Avancer' a meeting means bringing it forward, so you have LESS time."},
    {fr: "Ça va être juste, mais c'est faisable si la relecture se fait mercredi.", ok: true, why: "Honest about the tight timing ('ça va être juste'), with a condition."},
    {fr: "C'est impossible, le client est fou.", ok: false, why: "Unprofessional."}
   ]},
   {npc: "Ok, je préviens le client. Merci tout le monde, bonne semaine !", npc_en: "OK, I'll let the client know. Thanks everyone, have a good week!", options: [
    {fr: "Merci, bonne semaine à tous !", ok: true, why: "The natural reply."},
    {fr: "Merci, bon week-end !", ok: false, why: "It's Monday!"},
    {fr: "De rien, c'était mon plaisir.", ok: false, why: "A calque of 'my pleasure', and you weren't thanked personally."}
   ]}
  ]
 },
 {
  id: "expliquer_outil_collegue",
  title: "Expliquer un outil à un collègue",
  cefr: "B1",
  place: "🖥️ Open space",
  goal: "Teach a colleague a tool step by step and check they've understood.",
  turns: [
   {npc: "Dis, tu pourrais me montrer comment on fait un tableau croisé dynamique ? J'y comprends rien.", npc_en: "Hey, could you show me how to make a pivot table? I don't get it at all.", options: [
    {fr: "Tu ne sais pas faire ça ? C'est super facile !", ok: false, why: "Condescending: it makes your colleague feel stupid."},
    {fr: "Bien sûr, je vais vous montrer, monsieur.", ok: false, why: "He used 'tu': 'vous' and 'monsieur' are too formal between colleagues."},
    {fr: "Bien sûr, viens, je te montre. Tu vas voir, ce n'est pas si compliqué.", ok: true, why: "Friendly and reassuring."}
   ]},
   {npc: "Merci ! Alors, je commence par où ?", npc_en: "Thanks! So, where do I start?", options: [
    {fr: "D'abord, tu sélectionnes toutes tes données, puis tu cliques sur « Insertion ».", ok: true, why: "'D'abord... puis...' structures the steps clearly."},
    {fr: "D'abord, tu sélectionnes tes datas, after tu cliques.", ok: false, why: "Mixing in English ('datas', 'after') only confuses him."},
    {fr: "Tu commences par la fin.", ok: false, why: "Unhelpful."}
   ]},
   {npc: "Ok, c'est fait. Et là, il y a plein d'options, je fais quoi ?", npc_en: "OK, done. And now there are loads of options, what do I do?", options: [
    {fr: "Ne t'inquiète pas pas, tu fais glisser.", ok: false, why: "Double 'pas' is a grammar mistake, and the instruction is incomplete."},
    {fr: "Ne t'inquiète pas. Fais glisser le champ « Région » dans les lignes et « Ventes » dans les valeurs.", ok: true, why: "Reassurance plus a precise instruction in the imperative."},
    {fr: "Fais comme tu veux, ça n'a pas d'importance.", ok: false, why: "It does matter: give a clear instruction."}
   ]},
   {npc: "Ah, ça y est, je vois les totaux ! Mais pourquoi il y a des cases vides ?", npc_en: "Ah, there we go, I can see the totals! But why are there empty cells?", options: [
    {fr: "Parce que tu as fait une faute, évidemment.", ok: false, why: "Accusatory and doesn't explain anything."},
    {fr: "Sans doute parce qu'il manque des données pour certaines régions. Vérifie le tableau source.", ok: true, why: "A plausible explanation ('sans doute' = probably) and a next step."},
    {fr: "Aucune idée, c'est la magie d'Excel.", ok: false, why: "Unhelpful: you're the one teaching."}
   ]},
   {npc: "Ah oui, il manquait la ligne de Lyon. Bon, je crois que j'ai compris !", npc_en: "Oh yes, the Lyon row was missing. Right, I think I've got it!", options: [
    {fr: "Tu as compris ? Alors explique-moi tout, de A à Z, maintenant.", ok: false, why: "Sounds like an exam: a bit patronising."},
    {fr: "Super ! Essaie de le refaire tout seul sur l'autre onglet, pour voir si c'est clair.", ok: true, why: "Having him practise alone is the best way to check he's understood."},
    {fr: "Parfait, alors maintenant c'est toi qui fais tous mes tableaux !", ok: false, why: "Taking advantage, even as a joke, can fall flat with a new colleague."}
   ]},
   {npc: "Merci, t'es un sauveur ! Je te dois un café.", npc_en: "Thanks, you're a lifesaver! I owe you a coffee.", options: [
    {fr: "Oui, un café et un croissant, je note.", ok: false, why: "Taking the joke literally sounds petty."},
    {fr: "Pas de quoi, c'est vrai que je suis un sauveur.", ok: false, why: "Sounds arrogant."},
    {fr: "Avec plaisir ! Et n'hésite pas si tu as d'autres questions.", ok: true, why: "Gracious, and leaves the door open."}
   ]}
  ]
 },
 {
  id: "projet_groupe_ecole",
  title: "Projet de groupe à l'école de commerce",
  cefr: "B1",
  place: "🎓 Salle de travail, école de commerce",
  goal: "Split the work fairly, deal with a passive teammate and set a deadline.",
  turns: [
   {npc: "Bon, le rendu est dans deux semaines. On se répartit les parties comment ?", npc_en: "Right, the deadline is in two weeks. How do we split up the parts?", options: [
    {fr: "Je propose que chacun prend une partie.", ok: false, why: "'Proposer que' requires the subjunctive: 'prenne'."},
    {fr: "Je propose que chacun prenne une partie. Moi, je peux m'occuper de l'étude de marché.", ok: true, why: "Correct subjunctive, and you volunteer for something concrete."},
    {fr: "Faites ce que vous voulez, moi je fais juste la présentation à la fin.", ok: false, why: "Taking the easy part and leaving the rest to others is unfair."}
   ]},
   {npc: "Ça me va. Moi, je prends la partie financière. Et Lucas ? Il ne répond jamais sur le groupe WhatsApp...", npc_en: "Fine by me. I'll take the finance part. And Lucas? He never answers on the WhatsApp group...", options: [
    {fr: "On le dénonce au prof tout de suite.", ok: false, why: "Too harsh as a first step."},
    {fr: "Lucas ? Mais il est super réactif !", ok: false, why: "'Réactif' means responsive: you're contradicting what she just said."},
    {fr: "On pourrait l'appeler directement, il n'a peut-être pas vu les messages.", ok: true, why: "You give him the benefit of the doubt and suggest a concrete step."}
   ]},
   {npc: "(Plus tard, Lucas arrive.) Salut... Désolé, j'ai été un peu débordé cette semaine.", npc_en: "(Later, Lucas turns up.) Hi... Sorry, I've been a bit swamped this week.", options: [
    {fr: "Pas de souci, ça arrive. Par contre, on a besoin de toi : tu pourrais prendre la partie marketing ?", ok: true, why: "Understanding but firm: 'par contre' introduces the request."},
    {fr: "Débordé ? Débordé de quoi, d'eau ?", ok: false, why: "'Débordé' = overwhelmed with work."},
    {fr: "Tu es toujours en retard, tu es nul.", ok: false, why: "Insulting: it won't motivate him."}
   ]},
   {npc: "Ok, je veux bien. Mais je ne suis pas très fort en marketing...", npc_en: "OK, I'm happy to. But I'm not very good at marketing...", options: [
    {fr: "Tant pis pour toi, débrouille-toi.", ok: false, why: "Unsupportive."},
    {fr: "On t'aidera si tu bloques. L'important, c'est d'avancer.", ok: true, why: "Supportive and focused on progress."},
    {fr: "Tu es fort en quoi, alors ? En rien ?", ok: false, why: "Sarcastic and hurtful."}
   ]},
   {npc: "Merci. On fixe une date pour tout mettre en commun ?", npc_en: "Thanks. Shall we set a date to put everything together?", options: [
    {fr: "Disons la veille du rendu, à minuit.", ok: false, why: "Too late to proofread and harmonise the work."},
    {fr: "On la fixe avec un clou ?", ok: false, why: "'Fixer une date' = to set a date."},
    {fr: "Disons mardi prochain, 18 h, à la bibliothèque. Ça nous laisse une semaine pour relire.", ok: true, why: "A precise time and place, with a reason."}
   ]},
   {npc: "Parfait, je crée un Google Doc partagé et je vous envoie le lien.", npc_en: "Perfect, I'll create a shared Google Doc and send you the link.", options: [
    {fr: "Top, merci ! À mardi, alors.", ok: true, why: "Casual and positive, like students talk."},
    {fr: "Merci, je vous envoie mon lien de parenté.", ok: false, why: "'Lien de parenté' = family relationship. Nothing to do with a URL."},
    {fr: "Non, moi je préfère écrire sur papier et vous l'envoyer par la poste.", ok: false, why: "Impractical for group work."}
   ]}
  ]
 }
]);

// ───────────── SCENES B2 ─────────────
G.scenes = G.scenes.concat([
 {
  id: "negociation_salaire",
  title: "Négocier son salaire",
  cefr: "B2",
  place: "💼 Bureau de la DRH, cabinet de conseil",
  goal: "Negotiate your starting salary and benefits with tact and solid arguments.",
  turns: [
   {npc: "Bon, nous avons été très convaincus par vos entretiens. Avant d'aller plus loin, quelles sont vos prétentions salariales ?", npc_en: "Well, we were very impressed by your interviews. Before we go any further, what are your salary expectations?", options: [
    {fr: "Je veux gagner beaucoup, le plus possible.", ok: false, why: "Trop vague et naïf : on attend un chiffre ou une fourchette justifiée."},
    {fr: "Merci beaucoup. Au vu de mon double diplôme et des grilles du secteur, je vise une fourchette de 52 à 55 000 euros brut annuels.", ok: true, why: "Une fourchette argumentée, exprimée en brut annuel : c'est exactement ce qu'on attend en France."},
    {fr: "Je prétends à 55 000 euros net par mois.", ok: false, why: "Erreur de référence : en France, on négocie en brut annuel. « Net par mois » rend le chiffre absurde."}
   ]},
   {npc: "Hmm. C'est un peu au-dessus de ce qu'on propose habituellement pour un premier poste. On est plutôt autour de 48.", npc_en: "Hmm. That's a bit above what we usually offer for a first job. We're more around 48.", options: [
    {fr: "48 ? Alors je refuse, au revoir.", ok: false, why: "Rupture brutale : c'est précisément ici que la négociation commence."},
    {fr: "D'accord, 48, c'est parfait, merci beaucoup !", ok: false, why: "Vous capitulez aussitôt alors que votre fourchette était argumentée : vous laissez de l'argent sur la table."},
    {fr: "Je comprends. Est-ce que la part variable et les avantages pourraient compenser une partie de l'écart ?", ok: true, why: "Vous ne braquez pas votre interlocutrice et ouvrez la discussion sur la rémunération globale."}
   ]},
   {npc: "Il y a un bonus annuel pouvant aller jusqu'à 10 %, une mutuelle prise en charge à 70 % et douze jours de RTT.", npc_en: "There's an annual bonus of up to 10%, health insurance 70% paid by the company and twelve RTT days off.", options: [
    {fr: "C'est intéressant. Sur quels critères le bonus est-il calculé, et quel pourcentage est versé en moyenne ?", ok: true, why: "Question précise et professionnelle : vous évaluez le variable réel, pas le variable théorique."},
    {fr: "Avec le bonus garanti, ça me fait donc 53 000, parfait.", ok: false, why: "Un bonus « pouvant aller jusqu'à » n'est justement pas garanti : votre calcul est faux."},
    {fr: "Je m'en fiche, de la mutuelle, je ne suis jamais malade.", ok: false, why: "Registre familier (« je m'en fiche ») et raisonnement maladroit : la mutuelle fait partie de la rémunération."}
   ]},
   {npc: "En moyenne, les consultants touchent entre 6 et 8 %. Ça dépend de l'évaluation de fin d'année.", npc_en: "On average, consultants get between 6 and 8%. It depends on the end-of-year review.", options: [
    {fr: "Bon, ben tant pis, je verrai avec une autre boîte.", ok: false, why: "Menace à peine voilée, et registre trop familier (« ben », « boîte ») pour un entretien."},
    {fr: "Je vous propose 51 000, c'est à prendre ou à laisser.", ok: false, why: "L'ultimatum est bien trop agressif pour une première négociation."},
    {fr: "Dans ce cas, un fixe à 51 000 me paraîtrait équilibré, d'autant que mon stage dans le secteur me rend opérationnel immédiatement.", ok: true, why: "Contre-proposition chiffrée et justifiée : vous coupez la poire en deux avec un argument."}
   ]},
   {npc: "Écoutez, je dois en parler avec l'associé, mais 50 000 me semble jouable. Vous me laissez revenir vers vous d'ici vendredi ?", npc_en: "Listen, I need to discuss it with the partner, but 50,000 seems doable. Will you let me get back to you by Friday?", options: [
    {fr: "Bien sûr. Et si nous arrivions à 50 000, serait-il possible de prévoir une revue de salaire au bout de six mois ?", ok: true, why: "Vous acceptez le délai et sécurisez une perspective d'évolution."},
    {fr: "Revenir vers moi ? Vous partez où ?", ok: false, why: "« Revenir vers quelqu'un », tic du jargon d'entreprise, signifie simplement « recontacter »."},
    {fr: "Non, je veux une réponse tout de suite.", ok: false, why: "Exiger une réponse immédiate est contre-productif."}
   ]},
   {npc: "C'est tout à fait envisageable, je le note. Merci pour cet échange, très constructif.", npc_en: "That's entirely possible, I'll make a note of it. Thank you for this very constructive discussion.", options: [
    {fr: "Merci, c'était très constructif, comme un Lego !", ok: false, why: "Plaisanterie déplacée qui casse le sérieux de la conclusion."},
    {fr: "De rien, bisous !", ok: false, why: "Totalement inapproprié dans un cadre professionnel."},
    {fr: "Merci à vous. J'attends votre retour avec intérêt.", ok: true, why: "Formule professionnelle et cordiale pour clore l'échange."}
   ]}
  ]
 },
 {
  id: "appel_client_retard",
  title: "Annoncer un retard à un client",
  cefr: "B2",
  place: "📞 Appel client en visio",
  goal: "Break the news of a delay to a demanding client, own it and offer a solution.",
  turns: [
   {npc: "Bonjour. Je vous écoute, mais je vous préviens, j'ai un comité à 11 h, alors allons droit au but.", npc_en: "Hello. I'm listening, but I warn you, I have a committee meeting at 11, so let's get straight to the point.", options: [
    {fr: "Bien sûr, merci de me prendre entre deux réunions. Je vous appelle pour vous informer que le rapport final aura une semaine de retard.", ok: true, why: "Vous respectez sa demande : l'annonce est claire, dès la première phrase."},
    {fr: "Alors, comment allez-vous ? Et la famille ? Il fait beau chez vous ?", ok: false, why: "Le client a demandé d'aller droit au but : le bavardage va l'agacer."},
    {fr: "Je vous appelle pour vous dire que tout se passe à merveille.", ok: false, why: "Mensonge : vous allez annoncer un retard juste après."}
   ]},
   {npc: "Une semaine ?! Vous plaisantez, j'espère. Je dois présenter ces résultats au conseil d'administration le 15.", npc_en: "A week?! I hope you're joking. I have to present these results to the board on the 15th.", options: [
    {fr: "Ce n'est pas de notre faute, vos équipes nous ont envoyé les données en retard.", ok: false, why: "Rejeter la faute, même si c'est en partie vrai, envenime la situation à chaud."},
    {fr: "Je comprends tout à fait votre agacement, et je mesure l'enjeu pour vous. Permettez-moi de vous expliquer ce qui s'est passé et ce que nous proposons.", ok: true, why: "Empathie, reconnaissance de l'enjeu, puis transition vers les solutions."},
    {fr: "Calmez-vous, monsieur.", ok: false, why: "« Calmez-vous » produit presque toujours l'effet inverse."}
   ]},
   {npc: "Je vous écoute. Mais j'espère que vous avez une bonne raison.", npc_en: "I'm listening. But I hope you have a good reason.", options: [
    {fr: "On a eu des petits soucis techniques, rien de grave, bref.", ok: false, why: "Flou et désinvolte : le client attend une vraie explication."},
    {fr: "Mon collègue était en vacances, et moi, j'étais malade.", ok: false, why: "Raisons personnelles peu professionnelles, qui donnent une image désorganisée."},
    {fr: "En consolidant les données, nous avons détecté des incohérences dans les chiffres de 2022. Plutôt que de vous livrer des conclusions fragiles, nous avons préféré tout revérifier.", ok: true, why: "Explication factuelle qui transforme le retard en gage de rigueur."}
   ]},
   {npc: "Admettons. Mais concrètement, je fais comment pour mon conseil d'administration ?", npc_en: "Fair enough. But in practical terms, what do I do about my board meeting?", options: [
    {fr: "Nous pouvons vous transmettre dès mercredi une note de synthèse avec les premiers résultats consolidés, suffisante pour votre présentation. Le rapport complet suivra.", ok: true, why: "Solution concrète qui répond à son besoin réel : le conseil du 15."},
    {fr: "Vous pourriez peut-être le décaler ?", ok: false, why: "Vous renvoyez le problème au client au lieu de le résoudre."},
    {fr: "Franchement, je ne sais pas, c'est un peu votre problème.", ok: false, why: "Inacceptable face à un client."}
   ]},
   {npc: "Bon. Si j'ai la note mercredi, ça peut passer. Mais que ça ne se reproduise pas.", npc_en: "Right. If I have the memo on Wednesday, it could work. But don't let it happen again.", options: [
    {fr: "Ça ne se reproduira pas, je vous le jure sur la tête de ma mère.", ok: false, why: "Serment familier et théâtral, déplacé dans un cadre professionnel."},
    {fr: "C'est entendu. Je vous envoie un récapitulatif par e-mail dans l'heure, avec le nouveau calendrier.", ok: true, why: "Vous rassurez par un engagement précis et une trace écrite."},
    {fr: "On verra, on ne peut rien promettre.", ok: false, why: "Réponse qui inquiète au lieu de rassurer."}
   ]},
   {npc: "Très bien. Je compte sur vous. Bonne journée.", npc_en: "Very well. I'm counting on you. Have a good day.", options: [
    {fr: "Merci de votre compréhension, je vous embrasse.", ok: false, why: "« Je vous embrasse » est réservé aux proches."},
    {fr: "C'est ça, à la prochaine !", ok: false, why: "« C'est ça » peut sonner ironique, et le ton est trop familier."},
    {fr: "Merci pour votre compréhension. Bonne journée, et bon comité !", ok: true, why: "Remerciement, plus un clin d'œil à son comité : cordial sans excès."}
   ]}
  ]
 },
 {
  id: "proprio_depot_garantie",
  title: "Récupérer son dépôt de garantie",
  cefr: "B2",
  place: "🏠 Appartement vide, état des lieux de sortie",
  goal: "Contest unfair deductions from your deposit firmly, using the rules.",
  turns: [
   {npc: "Bon, je vois une rayure sur le parquet et des trous dans le mur. Je vais devoir garder 600 euros sur la caution.", npc_en: "Right, I can see a scratch on the parquet and holes in the wall. I'll have to keep 600 euros from the deposit.", options: [
    {fr: "Je comprends, mais je ne suis pas d'accord. Reprenons l'état des lieux d'entrée : la rayure y figure déjà.", ok: true, why: "Ferme mais courtois, et appuyé sur un document qui fait foi."},
    {fr: "600 euros ? Vous êtes un escroc !", ok: false, why: "L'insulte ferme toute discussion et peut se retourner contre vous."},
    {fr: "D'accord, pas de problème, gardez-les.", ok: false, why: "Vous renoncez sans vérifier, alors que toute retenue doit être justifiée."}
   ]},
   {npc: "Ah bon ? Faites voir... Effectivement, elle est notée. Mais les trous, eux, ne l'étaient pas.", npc_en: "Really? Let me see... Indeed, it's noted. But the holes weren't.", options: [
    {fr: "Les trous ? Quels trous ? Je ne vois rien.", ok: false, why: "Nier l'évidence vous décrédibilise."},
    {fr: "C'est votre mur, c'est votre problème.", ok: false, why: "Juridiquement faux, et agressif."},
    {fr: "C'est vrai. Il s'agit de trois chevilles pour des étagères : un rebouchage coûte quelques euros.", ok: true, why: "Vous reconnaissez le fait tout en le relativisant avec un argument concret."}
   ]},
   {npc: "Écoutez, il faudra quand même repeindre toute la pièce. Ça a un coût.", npc_en: "Look, the whole room will need repainting anyway. That costs money.", options: [
    {fr: "Repeindre ? Mais votre peinture date de Mathusalem !", ok: false, why: "L'idée est juste (la vétusté), mais l'expression est trop moqueuse pour une négociation tendue."},
    {fr: "La peinture avait déjà huit ans à mon arrivée. Avec la grille de vétusté, ce n'est pas à moi de financer une rénovation complète.", ok: true, why: "Argument précis : l'usure liée au temps (la vétusté) est à la charge du bailleur."},
    {fr: "D'accord, je vais repeindre moi-même, en rouge vif.", ok: false, why: "Provocation inutile."}
   ]},
   {npc: "Vous connaissez bien vos droits, dites donc. Bon, je peux retenir 150 euros, pas moins.", npc_en: "You certainly know your rights. Fine, I can keep 150 euros, no less.", options: [
    {fr: "Dites donc vous-même ! Je ne vous permets pas.", ok: false, why: "Vous prenez mal une remarque qui accompagnait en réalité une concession."},
    {fr: "Je vous propose 50 euros pour le rebouchage, sur présentation d'une facture. Ça me paraît juste pour nous deux.", ok: true, why: "Contre-proposition raisonnable, conditionnée à un justificatif."},
    {fr: "150 ? Allez, je vous en laisse 300, ça me fait plaisir.", ok: false, why: "Proposer plus que ce qu'il demande n'a aucun sens."}
   ]},
   {npc: "Bon... va pour 50. Vous voulez le reste sous combien de temps, au juste ?", npc_en: "Well... 50 it is. How soon do you want the rest, exactly?", options: [
    {fr: "Demain, sinon j'appelle mon avocat.", ok: false, why: "Exigence et menace disproportionnées."},
    {fr: "Gardez-le encore un an, je ne suis pas pressé.", ok: false, why: "Vous renoncez à un droit sans raison."},
    {fr: "La loi prévoit deux mois au maximum quand l'état des lieux de sortie présente des différences. Mais un virement avant serait appréciable.", ok: true, why: "Vous citez le cadre légal sans agressivité, et vous ouvrez la porte à un geste."}
   ]},
   {npc: "Entendu. On signe l'état des lieux, alors ?", npc_en: "Understood. Shall we sign the inventory, then?", options: [
    {fr: "Je ne signe jamais rien, c'est un principe.", ok: false, why: "Sans signature, le document ne vous protège pas non plus."},
    {fr: "Oui, à condition d'y mentionner la retenue de 50 euros et son motif.", ok: true, why: "Prudent : ce qui est écrit fait foi."},
    {fr: "Oui oui, je signe sans rien préciser, on s'arrangera.", ok: false, why: "Signer sans mentionner la retenue vous expose à de mauvaises surprises."}
   ]}
  ]
 },
 {
  id: "presentation_projet_comite",
  title: "Présenter un projet en comité",
  cefr: "B2",
  place: "📊 Salle du comité de direction",
  goal: "Present a project, handle tough questions and stay composed.",
  turns: [
   {npc: "Allez-y, vous avez dix minutes. Nous vous écoutons.", npc_en: "Go ahead, you have ten minutes. We're listening.", options: [
    {fr: "Euh... alors... je ne sais pas trop par où commencer, hein.", ok: false, why: "Une hésitation qui affaiblit d'emblée votre crédibilité."},
    {fr: "Mon projet est le meilleur, vous allez adorer.", ok: false, why: "Affirmation prétentieuse, sans la moindre preuve."},
    {fr: "Merci. En une phrase : ce projet réduirait nos délais de livraison de 20 % en dix-huit mois. Je vous présenterai le constat, la solution, puis le budget.", ok: true, why: "Accroche chiffrée et annonce du plan : la structure attendue en France."}
   ]},
   {npc: "(Le directeur financier) Vingt pour cent, c'est ambitieux. Sur quoi vous fondez-vous ?", npc_en: "(The CFO) Twenty percent is ambitious. What are you basing that on?", options: [
    {fr: "Sur un pilote mené à Lille pendant trois mois, où nous avons obtenu 23 %. J'ai volontairement retenu une hypothèse prudente.", ok: true, why: "Preuve concrète et prudence affichée : rassurant pour un financier."},
    {fr: "Sur mon intuition, j'ai un bon feeling.", ok: false, why: "Une intuition ne convainc pas un comité, et l'anglicisme « feeling » affaiblit le propos."},
    {fr: "Je l'ai lu quelque part sur internet.", ok: false, why: "Source vague : crédibilité nulle."}
   ]},
   {npc: "(La DRH) Et les équipes, elles en pensent quoi ? On sort d'une réorganisation douloureuse.", npc_en: "(The HR director) And what do the teams think? We're just coming out of a painful reorganisation.", options: [
    {fr: "Les équipes n'ont pas à donner leur avis.", ok: false, why: "Réponse autoritaire, à contre-courant de la culture managériale actuelle."},
    {fr: "C'est un point essentiel. Nous avons associé les chefs d'équipe dès la conception, et le déploiement se ferait par étapes, avec un accompagnement.", ok: true, why: "Vous validez la préoccupation et montrez qu'elle a été anticipée."},
    {fr: "Je ne sais pas, je ne leur ai pas demandé.", ok: false, why: "Aveu d'une lacune majeure."}
   ]},
   {npc: "(Le directeur financier) Votre budget de 1,2 million me semble sous-estimé. Vous avez prévu la maintenance ?", npc_en: "(The CFO) Your 1.2 million budget looks underestimated to me. Have you included maintenance?", options: [
    {fr: "Vous n'avez pas lu mon document ou quoi ?", ok: false, why: "Agressif, et familier (« ou quoi »)."},
    {fr: "Ah zut, j'ai oublié. Bon, ça ne coûte pas grand-chose.", ok: false, why: "Vous minimisez une lacune : très mauvais signal."},
    {fr: "Excellente question. La maintenance figure en annexe, page 14 : 80 000 euros par an. Je l'ai sortie du budget d'investissement par souci de lisibilité.", ok: true, why: "Calme et précis : vous renvoyez à une donnée existante."}
   ]},
   {npc: "(La présidente) Et si nous vous disons non aujourd'hui ?", npc_en: "(The CEO) And if we say no today?", options: [
    {fr: "Alors je démissionne.", ok: false, why: "Chantage disproportionné."},
    {fr: "Ce serait une énorme erreur de votre part.", ok: false, why: "Bien trop frontal face à la présidente."},
    {fr: "Je souhaiterais alors comprendre vos réserves pour revenir avec une version qui y réponde. Mais le statu quo a aussi un coût : environ 300 000 euros de pénalités clients par an.", ok: true, why: "Vous restez ouvert tout en rappelant le coût de l'inaction, un argument fort."}
   ]},
   {npc: "Bien. Merci, c'était clair. Nous vous ferons part de notre décision la semaine prochaine.", npc_en: "Good. Thank you, that was clear. We'll let you know our decision next week.", options: [
    {fr: "Merci pour votre écoute et vos questions. Je reste à votre disposition pour tout complément d'information.", ok: true, why: "Formule professionnelle classique pour conclure."},
    {fr: "Super, merci les gars !", ok: false, why: "Bien trop familier pour un comité de direction."},
    {fr: "La semaine prochaine ? Pourquoi pas tout de suite ?", ok: false, why: "Impatience déplacée."}
   ]}
  ]
 },
 {
  id: "soiree_networking",
  title: "Soirée de networking",
  cefr: "B2",
  place: "🥂 Afterwork des anciens élèves, rooftop à La Défense",
  goal: "Approach a stranger, pitch yourself briefly and get a contact without being pushy.",
  turns: [
   {npc: "Bonsoir ! On ne se connaît pas, je crois ? Moi, c'est Inès.", npc_en: "Good evening! I don't think we've met? I'm Inès.", options: [
    {fr: "Bonsoir, je cherche un job, vous embauchez ?", ok: false, why: "Bien trop direct : on crée d'abord un lien."},
    {fr: "Salut ma belle, tu viens souvent ici ?", ok: false, why: "Ton de drague totalement déplacé dans un contexte professionnel."},
    {fr: "Bonsoir Inès, enchanté. Non, c'est ma première soirée des anciens. Vous êtes de quelle promo ?", ok: true, why: "Présentation naturelle et question ouverte sur un point commun."}
   ]},
   {npc: "Promo 2014, ça ne me rajeunit pas ! Je suis directrice des opérations chez un acteur de la logistique. Et vous, vous faites quoi ?", npc_en: "Class of 2014, that makes me feel old! I'm head of operations at a logistics company. And what do you do?", options: [
    {fr: "Je suis en dernière année, en spécialisation supply chain justement, et je cherche un premier poste en conseil ou en opérations.", ok: true, why: "Pitch court, et vous rebondissez sur son secteur (« justement »)."},
    {fr: "Je suis étudiant. Voilà.", ok: false, why: "Trop laconique : vous ne donnez aucune prise à la conversation."},
    {fr: "Je fais le MBA le plus prestigieux d'Europe, et j'ai de loin les meilleures notes de ma promo.", ok: false, why: "Vantardise : en France, l'autopromotion trop appuyée est mal perçue."}
   ]},
   {npc: "Ah, intéressant ! Et qu'est-ce qui vous attire dans la logistique ? Ce n'est pas le secteur le plus glamour.", npc_en: "Oh, interesting! And what attracts you to logistics? It's not the most glamorous sector.", options: [
    {fr: "Honnêtement, rien, mais ça paie bien.", ok: false, why: "Franchise maladroite qui vous dessert."},
    {fr: "Justement, c'est ce qui me plaît : c'est concret, et la crise sanitaire a montré à quel point c'était stratégique.", ok: true, why: "Réponse réfléchie qui retourne l'objection avec un argument d'actualité."},
    {fr: "Ben, j'sais pas trop, c'est un peu au hasard.", ok: false, why: "Manque de motivation et registre relâché."}
   ]},
   {npc: "Tout à fait d'accord. On recrute pas mal en ce moment, d'ailleurs.", npc_en: "I completely agree. We're hiring quite a bit at the moment, actually.", options: [
    {fr: "Super ! Je vous envoie mon CV ce soir et vous me rappelez demain ?", ok: false, why: "Trop pressant : vous imposez un calendrier à quelqu'un que vous venez de rencontrer."},
    {fr: "Vous pourriez me pistonner ?", ok: false, why: "Demander ouvertement du piston est très maladroit."},
    {fr: "Ah oui ? Je serais ravi d'en savoir plus. Est-ce que je pourrais vous contacter sur LinkedIn pour en discuter à l'occasion ?", ok: true, why: "Intérêt clair mais demande mesurée : vous ne forcez pas la main."}
   ]},
   {npc: "Avec plaisir. Tenez, voilà ma carte. Bon, je vais aller saluer quelques personnes, mais on reste en contact !", npc_en: "With pleasure. Here's my card. Right, I'm going to go and say hello to a few people, but let's stay in touch!", options: [
    {fr: "Merci beaucoup, Inès. Ravi d'avoir fait votre connaissance, bonne fin de soirée !", ok: true, why: "Remerciement et formule de clôture élégante."},
    {fr: "Attendez, je n'ai pas fini ! J'ai encore plein de questions.", ok: false, why: "Retenir quelqu'un qui prend congé est impoli dans une soirée de networking."},
    {fr: "Merci, à plus dans le bus !", ok: false, why: "Formule enfantine et beaucoup trop familière."}
   ]}
  ]
 },
 {
  id: "deuxieme_rendez_vous",
  title: "Deuxième rendez-vous",
  cefr: "B2",
  place: "🍷 Bar à vin dans le Marais",
  goal: "Flirt lightly, read implicit signals and talk about where things are going, tactfully.",
  turns: [
   {npc: "Je suis contente qu'on se revoie. J'avoue que j'ai hésité à t'écrire la première, la dernière fois...", npc_en: "I'm glad we're seeing each other again. I'll admit I hesitated to text you first last time...", options: [
    {fr: "Je suis content que tu l'as fait.", ok: false, why: "Après « content que », il faut le subjonctif : « que tu l'aies fait »."},
    {fr: "Je suis content que tu l'aies fait. Moi, je n'osais pas, j'avais peur d'avoir l'air trop insistant.", ok: true, why: "Vous valorisez son initiative et vous montrez un peu vulnérable : c'est touchant."},
    {fr: "Normal, avec moi, ce sont toujours les filles qui écrivent en premier.", ok: false, why: "Fanfaronnade qui fait passer un message peu flatteur."}
   ]},
   {npc: "Ha ha, insistant, toi ? Tu m'as quand même laissée en vu pendant deux jours !", npc_en: "Ha ha, you, pushy? You left me on read for two days!", options: [
    {fr: "En vu ? C'est vrai, je ne t'ai pas vue pendant deux jours.", ok: false, why: "« Laisser quelqu'un en vu » signifie lire son message sans y répondre."},
    {fr: "Je fais toujours ça, c'est une stratégie.", ok: false, why: "Avouer une manipulation n'a rien de séduisant."},
    {fr: "Touché ! J'étais en plein rush au boulot, mais j'aurais dû te répondre plus vite. Pardon.", ok: true, why: "Vous reconnaissez votre tort avec humour et vous vous excusez simplement."}
   ]},
   {npc: "Je te taquine. Bon, et sinon, tu as fait quoi de ton week-end ?", npc_en: "I'm teasing. Anyway, what did you do at the weekend?", options: [
    {fr: "J'ai fait une grande balade le long du canal de l'Ourcq. D'ailleurs, il y a une super expo photo là-bas, ça te dirait d'y aller ensemble ?", ok: true, why: "Vous rebondissez pour proposer un prochain rendez-vous concret."},
    {fr: "Je suis sorti avec une amie.", ok: false, why: "Ambigu : « sortir avec quelqu'un » peut signifier être en couple. Dites plutôt « J'ai vu une amie »."},
    {fr: "Rien, j'ai dormi tout le week-end. Je suis quelqu'un d'ennuyeux, tu sais.", ok: false, why: "S'autodénigrer ainsi casse la dynamique de séduction."}
   ]},
   {npc: "Avec plaisir ! Dis-moi... je me demandais, tu vois d'autres personnes en ce moment, ou... ?", npc_en: "I'd love to! Tell me... I was wondering, are you seeing other people at the moment, or...?", options: [
    {fr: "Ça ne te regarde pas.", ok: false, why: "Brutal : la question est légitime après deux rendez-vous."},
    {fr: "Non, je ne vois personne d'autre. J'ai envie de prendre le temps d'apprendre à te connaître.", ok: true, why: "Réponse honnête et rassurante, sans dramatiser."},
    {fr: "Bien sûr, je vois plein de gens au bureau tous les jours.", ok: false, why: "Vous jouez sur le sens littéral de « voir » pour esquiver : maladroit."}
   ]},
   {npc: "Moi non plus. Ça me rassure, j'avoue. Bon, on reprend un verre ou tu dois te lever tôt demain ?", npc_en: "Me neither. I'll admit that's reassuring. So, shall we have another drink or do you have to get up early tomorrow?", options: [
    {fr: "Comme tu veux, ça m'est égal.", ok: false, why: "« Ça m'est égal » sonne indifférent, presque vexant."},
    {fr: "Je dois me lever tôt, donc je vais en boire trois très vite.", ok: false, why: "Incohérent, et peu engageant."},
    {fr: "Allez, un dernier ! Demain peut attendre.", ok: true, why: "Enthousiaste et complice."}
   ]},
   {npc: "(Plus tard, devant le métro) Bon, ben... c'était vraiment chouette. On s'écrit ?", npc_en: "(Later, outside the metro) Well... it was really lovely. Text each other?", options: [
    {fr: "Carrément. Et cette fois, je ne te laisse pas en vu, promis !", ok: true, why: "Vous reprenez la blague du début : complicité et légèreté."},
    {fr: "Oui, je t'envoie un e-mail lundi pour confirmer nos disponibilités.", ok: false, why: "Ton de réunion professionnelle, complètement décalé."},
    {fr: "Peut-être, on verra.", ok: false, why: "Froid et ambigu après une si bonne soirée."}
   ]}
  ]
 },
 {
  id: "degat_des_eaux_voisine",
  title: "Dégât des eaux chez la voisine",
  cefr: "B2",
  place: "💧 Sur le palier : la voisine du dessous sonne",
  goal: "Handle water damage with a neighbour: apologise, fill in the joint report and involve the insurers.",
  turns: [
   {npc: "Bonsoir... Excusez-moi de vous déranger, mais j'ai de l'eau qui coule du plafond de ma salle de bains. Je crois que ça vient de chez vous.", npc_en: "Good evening... Sorry to disturb you, but water's dripping from my bathroom ceiling. I think it's coming from your flat.", options: [
    {fr: "Impossible, chez moi tout est sec. Bonne soirée.", ok: false, why: "Refus immédiat sans vérifier : très mauvais voisinage."},
    {fr: "C'est sûrement ceux du dessus, pas moi. Allez les voir.", ok: false, why: "Vous vous défaussez sans même regarder."},
    {fr: "Oh non, je suis désolé ! Entrez, on va vérifier tout de suite.", ok: true, why: "Réaction empathique et immédiate."}
   ]},
   {npc: "(Dans votre salle de bains) Regardez, le joint de la baignoire est complètement noirci, et il y a de l'eau par terre.", npc_en: "(In your bathroom) Look, the bath seal is completely black, and there's water on the floor.", options: [
    {fr: "Effectivement. Je coupe l'arrivée d'eau et j'appelle un plombier dès demain matin.", ok: true, why: "Vous reconnaissez le problème et agissez aussitôt."},
    {fr: "C'est juste un peu d'humidité, ce n'est rien du tout.", ok: false, why: "Minimiser face à un plafond qui fuit est vexant."},
    {fr: "Bon, tant pis, ça séchera tout seul.", ok: false, why: "Négligent et irresponsable."}
   ]},
   {npc: "Merci. Il va falloir faire un constat amiable de dégât des eaux pour les assurances. Vous êtes assuré ?", npc_en: "Thank you. We'll need to fill in a joint water-damage report for the insurers. Are you insured?", options: [
    {fr: "Assuré ? Oui, je suis très sûr de moi.", ok: false, why: "Confusion : « être assuré » signifie ici avoir une assurance habitation."},
    {fr: "Oui, j'ai une assurance habitation. Je peux remplir le constat avec vous ce soir, si vous voulez.", ok: true, why: "Réponse claire et proactive."},
    {fr: "Non, les assurances, c'est de l'arnaque.", ok: false, why: "Pour un locataire, l'assurance habitation est obligatoire ; et le ton est déplacé."}
   ]},
   {npc: "Ce serait parfait. Par contre, ma peinture est fichue, et elle avait été refaite il y a un an...", npc_en: "That would be perfect. But my paintwork is ruined, and it had been redone a year ago...", options: [
    {fr: "Votre peinture, ce n'est pas mon problème.", ok: false, why: "Faux : votre responsabilité est engagée, et c'est blessant."},
    {fr: "Je vous repeins tout ça ce week-end avec mes potes, gratuitement !", ok: false, why: "Promesse impulsive qui court-circuite les assurances et peut créer un litige."},
    {fr: "Je comprends, c'est vraiment pénible. En principe, nos assurances s'arrangent entre elles ; prenez des photos dès maintenant.", ok: true, why: "Empathie, plus une information utile (la convention entre assureurs)."}
   ]},
   {npc: "D'accord, je fais des photos. C'est gentil de réagir comme ça. Avec certains voisins, ça finit en guerre !", npc_en: "OK, I'll take photos. It's kind of you to react like this. With some neighbours, it ends in all-out war!", options: [
    {fr: "La guerre ? Non, je suis pacifiste.", ok: false, why: "Vous prenez au pied de la lettre une expression figurée."},
    {fr: "C'est bien normal. Et tenez-moi au courant si ça recommence, même en pleine nuit.", ok: true, why: "Vous consolidez la bonne relation de voisinage."},
    {fr: "Oui, je suis le meilleur voisin de l'immeuble.", ok: false, why: "Autocongratulation maladroite."}
   ]},
   {npc: "Promis. Bon, je vous laisse, je vais éponger tout ça. Bonne soirée quand même !", npc_en: "Promise. Right, I'll leave you to it, I'm going to mop all that up. Have a good evening anyway!", options: [
    {fr: "Bonne soirée, et bonne baignade !", ok: false, why: "Plaisanterie déplacée alors qu'elle subit un dégât dont vous êtes responsable."},
    {fr: "Ok, salut !", ok: false, why: "Trop sec et trop familier après un incident dont vous êtes responsable."},
    {fr: "Encore désolé pour ce désagrément. Bonne soirée, et bon courage !", ok: true, why: "« Bon courage » est la formule idéale face à une corvée."}
   ]}
  ]
 },
 {
  id: "debat_retraites_cantine",
  title: "Parler politique à la cantine",
  cefr: "B2",
  place: "🍲 Cantine, table de collègues",
  goal: "Discuss a hot political topic politely: concede, nuance and disagree without offending.",
  turns: [
   {npc: "Vous avez vu ? Encore une journée de grève jeudi contre la réforme des retraites. Franchement, moi, je trouve qu'ils exagèrent.", npc_en: "Did you see? Another strike day on Thursday against the pension reform. Frankly, I think they're going too far.", options: [
    {fr: "T'es qu'un réac, c'est tout.", ok: false, why: "L'étiquette insultante coupe court à tout débat."},
    {fr: "Moi, la politique, j'y comprends rien et je m'en fiche.", ok: false, why: "Un désintérêt total paraît désinvolte ; une position nuancée est plus appréciée."},
    {fr: "Je comprends que ce soit pénible pour les transports, mais je comprends aussi l'inquiétude de ceux qui ont des métiers physiques.", ok: true, why: "Vous concédez un point avant de nuancer : la base du débat à la française."}
   ]},
   {npc: "Oui, mais enfin, on vit plus longtemps ! C'est mathématique, il faut bien financer les retraites.", npc_en: "Yes, but come on, we're living longer! It's simple maths, pensions have to be funded somehow.", options: [
    {fr: "C'est un argument sérieux, je ne dis pas le contraire. La question, c'est plutôt de savoir qui fait l'effort : il y a d'autres leviers.", ok: true, why: "Vous reconnaissez la logique adverse, puis vous déplacez le débat."},
    {fr: "Les mathématiques, c'est de la propagande.", ok: false, why: "Argument absurde qui vous discrédite."},
    {fr: "Mais t'es complètement idiot ou quoi ?", ok: false, why: "Insulte : le débat tourne au conflit."}
   ]},
   {npc: "(Une autre collègue) D'autres leviers, genre taxer les riches ? Ça fait fuir les investisseurs, ça.", npc_en: "(Another colleague) Other levers, like taxing the rich? That scares investors away.", options: [
    {fr: "Exactement, il faut taxer tous les riches à 90 %, point final.", ok: false, why: "Position caricaturale et fermée, sans aucune nuance."},
    {fr: "Pas forcément les taxer davantage, mais on peut débattre de l'équilibre entre revenus du travail et du capital. Il y a des économistes sérieux des deux côtés.", ok: true, why: "Ton mesuré et référence au débat d'experts : on reste dans l'échange d'idées."},
    {fr: "Ah, toi, tu votes à droite, évidemment.", ok: false, why: "Attaque personnelle sur les opinions supposées de votre collègue."}
   ]},
   {npc: "Mouais. En tout cas, je n'ai pas envie de bosser jusqu'à 70 ans, ça, c'est sûr !", npc_en: "Hmm. Anyway, I certainly don't want to be working till I'm 70!", options: [
    {fr: "Moi si, j'adore travailler, je bosserai jusqu'à 90 ans.", ok: false, why: "Fausse note : cela ressemble à de la provocation ou à du zèle."},
    {fr: "Ah ça, je crois que là-dessus, on est tous d'accord !", ok: true, why: "Vous trouvez un terrain d'entente avec humour pour détendre l'atmosphère."},
    {fr: "Toi, de toute façon, tu ne bosses déjà pas beaucoup.", ok: false, why: "Pique personnelle qui peut vexer."}
   ]},
   {npc: "Bon, on ne va pas refaire le monde entre la poire et le fromage. Quelqu'un veut un café ?", npc_en: "Right, we're not going to put the world to rights over lunch. Anyone want a coffee?", options: [
    {fr: "Si, on va refaire le monde, je n'ai pas fini mon argumentation.", ok: false, why: "Insister quand le groupe veut clore le sujet est lourd."},
    {fr: "Entre la poire et le fromage ? Mais on a mangé du poisson.", ok: false, why: "« Entre la poire et le fromage » signifie « en fin de repas, de façon informelle » : rien à voir avec le menu."},
    {fr: "Volontiers ! En tout cas, c'était un débat sympa, ça change de la météo.", ok: true, why: "Vous concluez sur une note positive, en valorisant l'échange."}
   ]}
  ]
 }
]);

// ───────────── SCENES C1 ─────────────
G.scenes = G.scenes.concat([
 {
  id: "dispute_associe",
  title: "Désamorcer un conflit avec un associé",
  cefr: "C1",
  place: "🔥 Bureau vitré, après une réunion houleuse",
  goal: "Defuse a heated row with your business partner and reach a compromise.",
  turns: [
   {npc: "Tu m'as complètement désavoué devant le client ! J'avais l'air de quoi, moi, franchement ? Tu aurais pu m'en parler avant au lieu de me griller en pleine réunion !", npc_en: "You completely undermined me in front of the client! What did that make me look like, honestly? You could have talked to me first instead of throwing me under the bus mid-meeting!", options: [
    {fr: "Calme-toi, tu fais une montagne de rien du tout.", ok: false, why: "« Calme-toi » et la minimisation jettent de l'huile sur le feu."},
    {fr: "Tu as raison sur un point : je n'aurais pas dû te contredire devant lui, et je te dois des excuses pour la forme. Sur le fond, en revanche, j'aimerais qu'on en parle à tête reposée.", ok: true, why: "Vous dissociez la forme (que vous concédez) et le fond (que vous maintenez), tout en proposant un cadre apaisé."},
    {fr: "Si tu avais mieux préparé ton dossier, je n'aurais pas eu besoin d'intervenir.", ok: false, why: "Contre-attaque personnelle : l'escalade est garantie."}
   ]},
   {npc: "À tête reposée ? Le mal est fait ! Il va penser qu'on ne sait pas où on va.", npc_en: "Calmly? The damage is done! He'll think we don't know where we're going.", options: [
    {fr: "Il pense ce qu'il veut, je m'en contrefiche.", ok: false, why: "Indifférence affichée et registre relâché, alors que l'enjeu commercial est réel."},
    {fr: "Bah, c'est fichu de toute façon, on aura d'autres clients.", ok: false, why: "Défaitisme qui ne répond en rien à son inquiétude."},
    {fr: "Pas forcément. Je propose qu'on l'appelle ensemble demain pour lui présenter une position commune. Ça lui montrera, au contraire, qu'on sait se coordonner.", ok: true, why: "Vous transformez l'incident en occasion d'afficher un front uni."}
   ]},
   {npc: "Hmm. Et sur le fond, alors ? Tu trouves vraiment que mon chiffrage était délirant ?", npc_en: "Hmm. And what about the substance? Do you really think my figures were crazy?", options: [
    {fr: "Délirant, non. Mais l'hypothèse d'une croissance à 15 % me paraît difficile à défendre face à un client aussi prudent. On pourrait présenter deux scénarios.", ok: true, why: "Vous écartez le mot blessant, précisez l'objection et proposez une solution qui intègre ses idées."},
    {fr: "Délirant, non ; complètement fou, oui.", ok: false, why: "Ironie blessante : vous reprenez le mot pour l'aggraver."},
    {fr: "Je ne sais pas, je ne l'ai pas vraiment regardé.", ok: false, why: "Incohérent : vous l'avez pourtant contredit en pleine réunion."}
   ]},
   {npc: "Deux scénarios... pourquoi pas. Mais la prochaine fois, si tu as un doute, tu me fais signe avant, d'accord ?", npc_en: "Two scenarios... why not. But next time, if you have doubts, you give me a heads-up first, OK?", options: [
    {fr: "Je ferai ce que je veux, on est associés, pas mariés.", ok: false, why: "Boutade agressive qui relance le conflit."},
    {fr: "C'est promis. Et l'inverse vaut aussi : si quelque chose te gêne dans mon travail, dis-le-moi sans détour.", ok: true, why: "Vous acceptez la règle et la rendez réciproque : une relation d'égal à égal."},
    {fr: "D'accord, chef !", ok: false, why: "Ironie malvenue qui le fait passer pour autoritaire."}
   ]},
   {npc: "Ça marche. Bon... désolé de m'être emporté. Ça fait trois semaines que je dors quatre heures par nuit avec ce dossier.", npc_en: "Deal. Well... sorry I lost my temper. I've been sleeping four hours a night for three weeks because of this file.", options: [
    {fr: "Ah ça, ça se voyait, tu étais imbuvable.", ok: false, why: "Vous profitez de ses excuses pour l'enfoncer."},
    {fr: "Tu devrais consulter, honnêtement.", ok: false, why: "Conseil condescendant, presque insultant dans ce contexte."},
    {fr: "Je comprends, on est tous les deux sur les rotules. Ça te dit qu'on aille déjeuner et qu'on reparte du bon pied ?", ok: true, why: "Vous accueillez ses excuses avec empathie et proposez un geste de réconciliation."}
   ]}
  ]
 },
 {
  id: "toast_mariage",
  title: "Porter un toast au mariage d'un ami",
  cefr: "C1",
  place: "💍 Dîner de mariage dans une grange en Bourgogne",
  goal: "Give a wedding toast: humour, emotion and the right register for 120 guests, grandparents included.",
  turns: [
   {npc: "(Le témoin vous tend le micro) À toi ! Et pas de dossiers compromettants, hein, il y a mamie au premier rang !", npc_en: "(The best man hands you the mic) Your turn! And no dirt on him, eh, Grandma's in the front row!", options: [
    {fr: "Salut tout le monde ! Bon, Thomas, on en a fait, des conneries, hein ? Je commence par la soirée à Ibiza ?", ok: false, why: "Registre grossier et menace d'anecdotes gênantes devant la famille : exactement ce qu'on vous demandait d'éviter."},
    {fr: "Bonsoir à toutes et à tous. Pour ceux qui ne me connaissent pas, je suis Paul, le colocataire de Thomas pendant nos années d'école... et rassurez-vous, je ne dirai pas tout.", ok: true, why: "Présentation claire, et vous rebondissez avec humour sur l'avertissement sans franchir la ligne."},
    {fr: "Mesdames et messieurs, honorables invités, c'est avec une immense déférence que je prends aujourd'hui la parole.", ok: false, why: "Trop solennel et ampoulé pour un mariage entre amis : on croirait un discours de préfet."}
   ]},
   {npc: "(Rires dans l'assistance. Thomas, faussement inquiet :) Attention à ce que tu vas dire, toi !", npc_en: "(Laughter from the guests. Thomas, mock-worried:) Careful what you say, you!", options: [
    {fr: "Promis, je ne parlerai pas de tes ex. Enfin, pas de toutes.", ok: false, why: "Évoquer les ex le jour du mariage est une faute de goût classique."},
    {fr: "Toi, tais-toi, c'est mon moment.", ok: false, why: "Brusque : la complicité doit rester bienveillante."},
    {fr: "Ne t'inquiète pas, je ne garde que le meilleur. Et le meilleur, c'est le soir où tu nous as parlé de Léa pour la première fois : tu avais les yeux qui brillaient comme jamais.", ok: true, why: "Vous passez de l'humour à l'émotion avec une anecdote touchante, centrée sur le couple."}
   ]},
   {npc: "(Léa, émue, porte la main à son cœur. L'assistance fait « Oooh ».)", npc_en: "(Léa, moved, puts her hand on her heart. The guests go 'Aww'.)", options: [
    {fr: "Léa, tu as réussi l'impossible : rendre Thomas ponctuel. Enfin, presque : aujourd'hui, il n'avait que vingt minutes de retard à son propre mariage. Un record !", ok: true, why: "Une taquinerie tendre sur un trait connu de tous, qui fait rire sans blesser."},
    {fr: "Léa, franchement, je ne sais pas ce que tu lui trouves.", ok: false, why: "Même pour rire, sous-entendre que le marié ne la mérite pas tombe à plat."},
    {fr: "Léa, tu es sublime ce soir ; si j'avais su, je t'aurais draguée avant lui.", ok: false, why: "Plaisanterie déplacée et gênante devant le marié et la famille."}
   ]},
   {npc: "(Rires. Vous sentez qu'il est temps de conclure.)", npc_en: "(Laughter. You sense it's time to wrap up.)", options: [
    {fr: "Bon, ben voilà, c'est tout, je crois. Euh... merci.", ok: false, why: "Une conclusion bâclée qui gâche l'effet d'un bon discours."},
    {fr: "Je vous souhaite d'être aussi heureux dans quarante ans que ce soir, et d'avoir toujours autant de choses à vous dire. Je vous invite tous à lever vos verres : aux mariés !", ok: true, why: "Un vœu chaleureux, puis l'invitation rituelle à trinquer : conclusion parfaite."},
    {fr: "Et maintenant, je vais vous lire les douze pages que j'ai préparées.", ok: false, why: "Personne ne veut d'un discours interminable : la brièveté est une politesse."}
   ]},
   {npc: "(Après le dîner, la grand-mère de Thomas vous arrête :) C'était charmant, jeune homme. Vous avez été très... sage.", npc_en: "(After dinner, Thomas's grandmother stops you:) That was charming, young man. You were very... well-behaved.", options: [
    {fr: "Merci beaucoup, madame, ça me touche. Thomas m'avait prévenu que vous seriez au premier rang !", ok: true, why: "Vous acceptez le compliment avec grâce et une pointe d'humour complice."},
    {fr: "Sage ? Vous voulez dire ennuyeux ?", ok: false, why: "Vous surinterprétez : « sage » signifie ici « convenable, mesuré », c'est un compliment."},
    {fr: "Merci mamie, t'es trop mignonne !", ok: false, why: "Tutoyer la grand-mère d'un autre et l'appeler « mamie » est bien trop familier."}
   ]}
  ]
 },
 {
  id: "entretien_associee_conseil",
  title: "Entretien final avec une associée",
  cefr: "C1",
  place: "🏢 Cabinet de conseil, 8e arrondissement",
  goal: "Get through a final-round interview with a partner: read between the lines and show judgement.",
  turns: [
   {npc: "Asseyez-vous. J'ai lu votre dossier, il est... très complet. Mais parlez-moi plutôt de ce qui ne figure pas sur votre CV.", npc_en: "Have a seat. I've read your file, it's... very thorough. But tell me instead about what isn't on your CV.", options: [
    {fr: "Volontiers. J'ai financé une partie de mes études en donnant des cours de maths en banlieue. Ça m'a appris à expliquer simplement des choses compliquées, ce qui me sert tous les jours.", ok: true, why: "Vous captez l'implicite (« très complet », sous-entendu : un peu trop scolaire) et apportez une dimension humaine reliée au métier."},
    {fr: "Il n'y a rien d'autre, tout est dans le CV.", ok: false, why: "Vous passez à côté de l'invitation : elle veut découvrir votre personnalité."},
    {fr: "Mes défauts, vous voulez dire ? Je suis trop perfectionniste.", ok: false, why: "Cliché éculé, et ce n'était pas la question."}
   ]},
   {npc: "Intéressant. Bon, cas pratique : un client industriel voit sa marge chuter de cinq points en deux ans. Par où commencez-vous ?", npc_en: "Interesting. Right, a case: an industrial client's margin has dropped five points in two years. Where do you start?", options: [
    {fr: "Je recommanderais de supprimer 20 % des effectifs.", ok: false, why: "Conclusion hâtive, sans diagnostic : précisément ce qu'on reproche aux candidats."},
    {fr: "Avant tout, je chercherais à savoir si le problème vient des prix ou des coûts. Ensuite, je décomposerais par produit et par marché pour isoler les poches de dégradation.", ok: true, why: "Démarche structurée, par hypothèses : c'est le raisonnement attendu."},
    {fr: "Je demanderais au client ce qu'il en pense, c'est lui qui sait.", ok: false, why: "Vous abdiquez votre rôle de conseil."}
   ]},
   {npc: "Admettons que ce soient les coûts des matières premières. Le client vous dit : « On n'y peut rien, c'est le marché. » Vous en pensez quoi ?", npc_en: "Let's say it's raw material costs. The client tells you: 'There's nothing we can do, it's the market.' What do you think?", options: [
    {fr: "Je lui dirais qu'il a tort et que son entreprise est mal gérée.", ok: false, why: "Trop frontal : un consultant doit convaincre sans humilier."},
    {fr: "Je serais d'accord avec lui : le client est roi.", ok: false, why: "Complaisance : on ne paie pas un cabinet pour entendre ce qu'on sait déjà."},
    {fr: "C'est en partie vrai, mais il reste des leviers : renégociation des contrats, couverture, voire reformulation des produits. Je le lui dirais avec tact, sans le contredire frontalement.", ok: true, why: "Vous nuancez le fatalisme du client et montrez que vous savez gérer la relation."}
   ]},
   {npc: "Hmm. Vous savez que nos semaines dépassent souvent soixante heures ? Certains candidats nous expliquent qu'ils tiennent beaucoup à leur équilibre de vie...", npc_en: "Hmm. You know our weeks often exceed sixty hours? Some candidates tell us they really care about their work-life balance...", options: [
    {fr: "Aucun problème, je n'ai pas de vie privée.", ok: false, why: "Réponse excessive, peu crédible, voire inquiétante sur la durée."},
    {fr: "Soixante heures ? Ce n'est pas légal en France, si ?", ok: false, why: "Remarque juridique maladroite, qui sonne comme une menace."},
    {fr: "J'en suis conscient, et j'accepte les périodes intenses. Je crois aussi qu'on est plus efficace sur la durée quand on sait préserver des moments pour souffler.", ok: true, why: "Vous avez compris le test implicite et répondez avec maturité, sans naïveté ni angélisme."}
   ]},
   {npc: "Très bien. Vous avez des questions pour moi ?", npc_en: "Very well. Do you have any questions for me?", options: [
    {fr: "Oui : qu'est-ce qui distingue, selon vous, les consultants qui réussissent ici de ceux qui partent au bout de deux ans ?", ok: true, why: "Question fine, qui montre votre réflexion et invite l'associée à se livrer."},
    {fr: "Non, je crois que tout est clair.", ok: false, why: "Ne poser aucune question peut passer pour un manque d'intérêt."},
    {fr: "Combien de jours de vacances j'aurai, et quand est-ce que je serai augmenté ?", ok: false, why: "Questions légitimes, mais prématurées et maladroitement formulées à ce stade."}
   ]},
   {npc: "Excellente question. (Elle sourit.) Ceux qui restent savent dire non à un client quand il le faut. Bon, nous vous recontactons très vite.", npc_en: "Excellent question. (She smiles.) The ones who stay know how to say no to a client when necessary. Right, we'll be in touch very soon.", options: [
    {fr: "Très vite, c'est-à-dire quand, exactement ?", ok: false, why: "Insistance déplacée."},
    {fr: "Alors je vous dis non tout de suite, pour vous montrer !", ok: false, why: "Une plaisanterie qui tombe à plat et casse la bonne impression."},
    {fr: "Merci, c'est une réponse précieuse. Au plaisir de vous revoir, je l'espère.", ok: true, why: "Remerciement sincère et clôture élégante, avec une touche d'enthousiasme mesuré."}
   ]}
  ]
 },
 {
  id: "diner_sous_entendus",
  title: "Dîner mondain : décoder les sous-entendus",
  cefr: "C1",
  place: "🕯️ Dîner chez des amis d'amis, appartement haussmannien",
  goal: "Make small talk with hosts and guests, and read what is left unsaid.",
  turns: [
   {npc: "(L'hôtesse) Ah, vous voilà ! Vous avez trouvé facilement ? Le code a changé la semaine dernière, on a oublié de prévenir tout le monde...", npc_en: "(The hostess) Ah, there you are! Did you find it easily? The door code changed last week, we forgot to tell everyone...", options: [
    {fr: "Non, j'ai attendu vingt minutes dehors sous la pluie, c'est n'importe quoi.", ok: false, why: "Reproche frontal à l'hôtesse dès l'arrivée : faute de savoir-vivre."},
    {fr: "Oui, un voisin m'a ouvert, j'ai eu de la chance ! Tenez, une petite bouteille de chez mon caviste, un saint-joseph.", ok: true, why: "Vous dédramatisez et offrez un vin choisi : le geste attendu d'un invité."},
    {fr: "Oui. Tenez, je vous ai apporté des chrysanthèmes.", ok: false, why: "En France, les chrysanthèmes sont associés aux cimetières et à la Toussaint : impair majeur."}
   ]},
   {npc: "(Un convive) Et vous, vous êtes dans quoi ? Laissez-moi deviner... la finance ? Vous avez une tête de banquier !", npc_en: "(A guest) And what line are you in? Let me guess... finance? You've got a banker's face!", options: [
    {fr: "Presque ! Je suis consultant. Mais rassurez-vous, je ne compte pas les petits fours.", ok: true, why: "Vous désamorcez la remarque un peu lourde par l'autodérision."},
    {fr: "Et vous, vous avez une tête de quoi, au juste ?", ok: false, why: "Riposte agressive qui transforme une maladresse en affrontement."},
    {fr: "Je ne parle jamais de mon travail en dehors du bureau.", ok: false, why: "Fermeture sèche qui jette un froid ; on peut rester vague avec légèreté."}
   ]},
   {npc: "(L'hôtesse, en servant) Je vous préviens, c'est la première fois que je fais cette recette, ça va être une catastrophe...", npc_en: "(The hostess, serving) I warn you, it's the first time I've made this recipe, it's going to be a disaster...", options: [
    {fr: "Ah, alors je vais en prendre très peu, au cas où.", ok: false, why: "Vous la prenez au mot, alors qu'elle attendait un encouragement."},
    {fr: "Si c'est aussi bon que ça sent, je ne suis pas inquiet ! (Après une bouchée) C'est délicieux, il faudra me donner la recette.", ok: true, why: "La fausse modestie de l'hôtesse appelle un compliment : vous jouez le jeu du rituel."},
    {fr: "C'est vrai que ça sent un peu le brûlé.", ok: false, why: "Confirmer ses craintes est d'une grande muflerie."}
   ]},
   {npc: "(Un convive, d'un ton pincé) Ah, vous habitez dans le 19e ? C'est... courageux.", npc_en: "(A guest, in a pinched tone) Oh, you live in the 19th? That's... brave.", options: [
    {fr: "Courageux ? Merci, oui, je suis quelqu'un de très courageux.", ok: false, why: "Vous ne percevez pas l'ironie méprisante et prenez le mot au premier degré."},
    {fr: "Pardon, mais vous êtes un sale snob.", ok: false, why: "Insulte : vous perdez la face devant tous les convives."},
    {fr: "Courageux, je ne sais pas, mais très agréable ! Les Buttes-Chaumont à deux pas, des loyers encore raisonnables... Vous devriez venir y faire un tour.", ok: true, why: "Vous relevez le sous-entendu condescendant sans agressivité et retournez le cliché avec bonne humeur."}
   ]},
   {npc: "(Vers minuit, l'hôte s'étire et lance :) Bon... demain, c'est le marathon de la petite, on se lève à six heures !", npc_en: "(Around midnight, the host stretches and says:) Well... tomorrow's our daughter's marathon, we're getting up at six!", options: [
    {fr: "Ah, super ! Bon courage. Sinon, quelqu'un veut reprendre un digestif ?", ok: false, why: "Vous ignorez un signal pourtant transparent : il est temps de partir."},
    {fr: "Six heures ? Vous êtes fous ! Moi, le dimanche, je dors jusqu'à midi.", ok: false, why: "Vous commentez au lieu de comprendre le message implicite."},
    {fr: "Oh, mais il est déjà minuit ! On va vous laisser. Merci infiniment pour cette délicieuse soirée.", ok: true, why: "Vous décodez l'allusion et prenez congé avec élégance, sans que l'hôte ait à le demander."}
   ]},
   {npc: "(L'hôtesse, sur le pas de la porte) Merci d'être venu ! Il faudra remettre ça !", npc_en: "(The hostess, at the door) Thanks for coming! We must do it again!", options: [
    {fr: "Avec grand plaisir. Et la prochaine fois, c'est chez moi... dans le 19e !", ok: true, why: "Vous rendez l'invitation, avec un clin d'œil au convive pincé."},
    {fr: "Oui, chez vous la semaine prochaine, même heure ?", ok: false, why: "Vous vous réinvitez, alors que la politesse veut qu'on rende l'invitation."},
    {fr: "Remettre quoi ?", ok: false, why: "« Remettre ça » signifie « recommencer » : une expression courante à connaître."}
   ]}
  ]
 },
 {
  id: "recadrer_collaborateur",
  title: "Recadrer un collaborateur",
  cefr: "C1",
  place: "🗂️ Bureau fermé, entretien individuel",
  goal: "Give critical feedback to a junior colleague: clear, factual and respectful.",
  turns: [
   {npc: "Tu voulais me voir ? Il y a un problème ?", npc_en: "You wanted to see me? Is there a problem?", options: [
    {fr: "Oui, il y a un gros problème : toi.", ok: false, why: "Attaque personnelle d'emblée : votre collaborateur va se braquer."},
    {fr: "Non, non, rien de grave, on va juste parler de la pluie et du beau temps.", ok: false, why: "Vous noyez le poisson : le message ne passera pas."},
    {fr: "Assieds-toi. Je voulais faire le point avec toi sur les dernières semaines, notamment sur les délais. Et j'aimerais avoir ton regard.", ok: true, why: "Vous posez un cadre calme, nommez le sujet et ouvrez le dialogue."}
   ]},
   {npc: "Les délais ? Bon, j'ai eu un peu de retard sur la note sectorielle, mais tout le monde est débordé...", npc_en: "The deadlines? OK, I was a bit late with the sector memo, but everyone's swamped...", options: [
    {fr: "Je sais que la charge est lourde. Mais concrètement, trois livrables sur quatre ont été rendus en retard ce mois-ci, dont un la veille d'un comité client. Ça nous a mis en difficulté.", ok: true, why: "Les faits, rien que les faits, et leur impact : la base d'un feedback efficace."},
    {fr: "Tout le monde est débordé, mais tout le monde rend son travail à l'heure. Sauf toi.", ok: false, why: "Comparaison humiliante qui transforme le feedback en reproche."},
    {fr: "Ce n'est pas grave, ne t'en fais pas.", ok: false, why: "Vous annulez vous-même le message que vous vouliez faire passer."}
   ]},
   {npc: "(Un silence.) Je ne savais pas que ça se voyait autant... En fait, je n'ose pas dire quand je suis sous l'eau.", npc_en: "(Silence.) I didn't know it was so obvious... Actually, I don't dare say when I'm snowed under.", options: [
    {fr: "Il faut apprendre à oser, dans la vie, sinon tu n'iras pas loin.", ok: false, why: "Leçon de morale condescendante, au moment précis où il se confie."},
    {fr: "Merci de me le dire, c'est important. Si tu m'alertes en amont, je peux revoir les priorités. Ce qui est compliqué, c'est de le découvrir au dernier moment.", ok: true, why: "Vous accueillez la confidence et transformez le problème en règle de fonctionnement."},
    {fr: "Sous l'eau ? Tu fais de la plongée ?", ok: false, why: "Plaisanterie déplacée : « être sous l'eau » signifie être débordé."}
   ]},
   {npc: "D'accord. Mais je ne veux pas passer pour quelqu'un qui n'assure pas.", npc_en: "OK. But I don't want to come across as someone who can't cope.", options: [
    {fr: "C'est déjà un peu le cas, pour être honnête.", ok: false, why: "Une franchise brutale qui démotive sans rien apporter."},
    {fr: "Ne t'inquiète pas, de toute façon, personne ne fait attention à toi.", ok: false, why: "Tentative de réassurance maladroite qui sonne comme du mépris."},
    {fr: "Au contraire : savoir signaler une surcharge, c'est une marque de professionnalisme. On fait un point rapide chaque lundi pour caler tes priorités ?", ok: true, why: "Vous recadrez la perception et proposez un dispositif concret."}
   ]},
   {npc: "Ça me va. Merci de m'en avoir parlé directement, plutôt que d'en parler aux autres.", npc_en: "That works for me. Thanks for talking to me directly rather than to the others.", options: [
    {fr: "C'est la moindre des choses. Je compte sur toi, et je suis sûr que les prochaines semaines se passeront bien.", ok: true, why: "Vous terminez sur la confiance et une perspective positive : il repart motivé."},
    {fr: "De rien, mais la prochaine fois, ce sera un avertissement écrit.", ok: false, why: "Menace inutile, alors que l'entretien s'est bien passé."},
    {fr: "Je n'allais quand même pas te faire de la publicité.", ok: false, why: "Réponse sarcastique qui gâche la conclusion."}
   ]}
  ]
 },
 {
  id: "ag_copropriete",
  title: "Assemblée générale de copropriété",
  cefr: "C1",
  place: "🏢 Salle polyvalente, AG annuelle",
  goal: "Defend a proposal (a bike room) at a co-owners' meeting against reluctant neighbours.",
  turns: [
   {npc: "(Le président du conseil syndical) Point 7 de l'ordre du jour : la proposition de M. Silva d'aménager un local à vélos dans l'ancienne loge. Vous avez la parole, cinq minutes.", npc_en: "(The council chair) Item 7 on the agenda: Mr Silva's proposal to turn the old caretaker's lodge into a bike room. You have the floor, five minutes.", options: [
    {fr: "Moi, j'ai un vélo, et j'en ai marre de le monter au cinquième, donc voilà.", ok: false, why: "Argument purement personnel et registre familier : peu convaincant face à une assemblée."},
    {fr: "Merci, monsieur le président. Aujourd'hui, une quinzaine de vélos encombrent les couloirs, ce qui pose un problème de sécurité incendie. La loge est vide depuis trois ans : je propose de lui redonner une utilité.", ok: true, why: "Vous partez d'un problème commun (la sécurité) plutôt que de votre intérêt personnel."},
    {fr: "Je vous préviens : si vous votez contre, je laisse mon vélo dans le hall.", ok: false, why: "Une menace qui braque d'emblée l'assemblée."}
   ]},
   {npc: "(Mme Morel, 4e étage) Encore des dépenses ! On vient de payer le ravalement, je vous signale. Ce n'est pas à ceux qui n'ont pas de vélo de financer vos lubies.", npc_en: "(Mrs Morel, 4th floor) More spending! We've just paid for the façade renovation, I'll have you know. It's not up to people without bikes to fund your whims.", options: [
    {fr: "Je comprends tout à fait, le ravalement a pesé lourd. C'est pourquoi j'ai demandé trois devis : le moins cher revient à 18 euros par lot. Et un local à vélos valorise aussi les appartements à la revente.", ok: true, why: "Vous reconnaissez son objection et répondez par un chiffre modeste et un argument qui profite à tous."},
    {fr: "Mes lubies ? Vous êtes bien placée pour parler, avec vos quatorze plantes sur le palier !", ok: false, why: "Attaque personnelle qui transforme l'AG en règlement de comptes."},
    {fr: "Ce n'est pas une lubie, madame, c'est l'avenir. Il faut vivre avec son temps.", ok: false, why: "Ton condescendant qui sous-entend qu'elle est dépassée."}
   ]},
   {npc: "(M. Benali) Et qui aura les clés ? Je n'ai pas envie que n'importe qui entre dans l'immeuble.", npc_en: "(Mr Benali) And who will have the keys? I don't want just anyone getting into the building.", options: [
    {fr: "Personne : on laissera la porte ouverte, ce sera plus simple.", ok: false, why: "Réponse irréfléchie qui confirme ses craintes."},
    {fr: "C'est une vraie question. Je propose un accès par badge, réservé aux résidents, comme pour la porte principale.", ok: true, why: "Vous validez l'inquiétude et y apportez une solution concrète."},
    {fr: "Vous êtes un peu parano, non ?", ok: false, why: "Disqualifier une inquiétude légitime est contre-productif."}
   ]},
   {npc: "(Mme Morel) Mouais. Et la loge, on pourrait plutôt la louer. Ça rapporterait de l'argent à la copropriété.", npc_en: "(Mrs Morel) Hmm. And we could rent out the lodge instead. That would bring money into the co-ownership.", options: [
    {fr: "Louer un placard sans fenêtre ? C'est complètement idiot.", ok: false, why: "Mépris affiché : vous perdez les indécis."},
    {fr: "Bonne idée, laissons tomber mon projet, alors.", ok: false, why: "Vous abandonnez sans défendre une proposition pourtant solide."},
    {fr: "C'est une piste qui mérite d'être étudiée. Mais une loge sans fenêtre ni point d'eau n'est pas louable en l'état, à moins d'engager des travaux bien plus lourds.", ok: true, why: "Vous ne balayez pas sa proposition, puis vous en montrez les limites avec un argument factuel."}
   ]},
   {npc: "(Le président) Bien. Je propose de passer au vote. Qui est pour ?", npc_en: "(The chair) Right. I suggest we move to a vote. Who is in favour?", options: [
    {fr: "Attendez, je n'ai pas fini, j'ai encore dix arguments !", ok: false, why: "Prolonger le débat après l'appel au vote exaspère l'assemblée."},
    {fr: "Ceux qui votent contre, je saurai qui vous êtes.", ok: false, why: "De l'intimidation : inacceptable."},
    {fr: "Merci à tous pour ce débat. J'ajoute simplement que je suis prêt à suivre les travaux bénévolement.", ok: true, why: "Un dernier mot bref, et un engagement personnel qui rassure les hésitants."}
   ]}
  ]
 }
]);

// ───────────── SCENES C2 ─────────────
G.scenes = G.scenes.concat([
 {
  id: "cafe_philo_sincerite",
  title: "Café philo : la sincérité est-elle une vertu ?",
  cefr: "C2",
  place: "☕ Café philo, place de la Bastille, dimanche matin",
  goal: "Take part in a philosophical debate: build an argument, use references with care and handle irony.",
  turns: [
   {npc: "(L'animateur) Le sujet de ce matin : « La sincérité est-elle toujours une vertu ? » Qui veut lancer le débat ? Vous, là-bas, vous avez l'air d'avoir un avis.", npc_en: "(The moderator) This morning's topic: 'Is sincerity always a virtue?' Who wants to kick off? You over there, you look like you have an opinion.", options: [
    {fr: "Oui, toujours, parce que mentir, c'est mal. Voilà.", ok: false, why: "Affirmation péremptoire et simpliste qui clôt le débat au lieu de l'ouvrir."},
    {fr: "Absolument. Comme disait Kant, la sincérité est le petit-déjeuner des champions.", ok: false, why: "Citation fantaisiste attribuée à un philosophe : discrédit assuré."},
    {fr: "Je me lance. Il me semble qu'il faut distinguer la sincérité, qui consiste à ne pas mentir sur ce que l'on pense, de la transparence totale, qui consisterait à tout dire. La première est une vertu ; la seconde peut devenir une forme de violence.", ok: true, why: "Vous ouvrez par une distinction conceptuelle : la démarche attendue dans un café philo."}
   ]},
   {npc: "(Un participant) Une forme de violence ? Vous allez un peu vite en besogne. Avec ce raisonnement, on finit par justifier l'hypocrisie mondaine, le règne des faux-semblants.", npc_en: "(A participant) A form of violence? You're jumping the gun a bit. With that reasoning, you end up justifying social hypocrisy, the reign of pretence.", options: [
    {fr: "L'objection est sérieuse. Mais entre l'hypocrisie et la franchise brutale, il y a place pour le tact : se taire n'est pas mentir. L'Alceste de Molière n'est-il pas le portrait d'un homme que sa sincérité intransigeante rend insupportable ?", ok: true, why: "Vous prenez l'objection au sérieux, introduisez une nuance (le tact) et l'illustrez par une référence juste."},
    {fr: "Pas du tout, vous n'avez rien compris à ce que j'ai dit.", ok: false, why: "Vous disqualifiez l'interlocuteur au lieu de répondre à l'objection."},
    {fr: "Vous avez raison, je retire tout ce que j'ai dit.", ok: false, why: "Capitulation immédiate : un café philo attend qu'on défende et qu'on affine sa position."}
   ]},
   {npc: "(Une participante, malicieuse) Alceste ? Mais justement, Molière se moque autant de Philinte et de ses courbettes que d'Alceste et de son intransigeance, non ? Vous ne retenez que la moitié de la pièce qui vous arrange.", npc_en: "(A participant, mischievously) Alceste? But Molière mocks Philinte and his bowing and scraping just as much as Alceste and his rigidity, doesn't he? You're only keeping the half of the play that suits you.", options: [
    {fr: "Je ne me souviens plus très bien de la pièce, à vrai dire.", ok: false, why: "Vous vous décrédibilisez après avoir vous-même invoqué la référence."},
    {fr: "Touché. Molière renvoie en effet dos à dos les deux excès. C'est peut-être là sa leçon : la vertu n'est ni dans la sincérité absolue ni dans la complaisance, mais dans un juste milieu, très aristotélicien au fond.", ok: true, why: "Vous concédez avec élégance et intégrez l'objection pour enrichir votre thèse."},
    {fr: "Philinte ? Connais pas.", ok: false, why: "Désinvolture qui trahit une référence de seconde main."}
   ]},
   {npc: "(L'animateur) Joli retournement. Mais alors, qui décide où se situe ce « juste milieu » ? N'est-ce pas la porte ouverte au relativisme le plus complet ?", npc_en: "(The moderator) Nice turnaround. But then who decides where this 'golden mean' lies? Isn't that opening the door to total relativism?", options: [
    {fr: "Chacun décide pour soi : il n'y a pas de vérité, tout se vaut.", ok: false, why: "Vous tombez précisément dans le relativisme qu'on vous objectait."},
    {fr: "C'est moi qui décide, évidemment.", ok: false, why: "Boutade qui esquive la question, sans assez d'esprit pour la sauver."},
    {fr: "C'est toute la difficulté. Aristote répondait : l'homme prudent, celui qui a l'expérience des situations. Ce n'est pas une règle qu'on applique, c'est un jugement qui se forme. Cela relève moins du relativisme que de la sagesse pratique.", ok: true, why: "Vous répondez à l'objection du relativisme par la notion de prudence aristotélicienne, sans esquiver la difficulté."}
   ]},
   {npc: "(Le participant du début, souriant) Bon, je dois avouer que vous m'avez à moitié convaincu. Ce qui, venant de moi, est un compliment rare, croyez-moi.", npc_en: "(The first participant, smiling) Well, I must admit you've half convinced me. Which, coming from me, is a rare compliment, believe me.", options: [
    {fr: "Venant de vous, j'en mesure le prix ! Et je vous accorde l'autre moitié : la frontière entre tact et hypocrisie reste bien floue.", ok: true, why: "Vous recevez le compliment avec humour et rendez la pareille en reconnaissant la part de vérité de son objection."},
    {fr: "À moitié seulement ? Dommage, je pensais avoir été brillant.", ok: false, why: "La pointe de vanité gâche l'échange, même sur le ton de la plaisanterie."},
    {fr: "Vous auriez dû l'être entièrement : mes arguments étaient imparables.", ok: false, why: "Arrogance qui contredit l'esprit même du débat."}
   ]},
   {npc: "(L'animateur) Voilà qui illustre parfaitement notre sujet : un désaccord sincère, mais plein de tact. On fait une pause café ?", npc_en: "(The moderator) That perfectly illustrates our topic: a sincere disagreement, but full of tact. Shall we have a coffee break?", options: [
    {fr: "Non, continuons, je n'ai pas encore parlé de Kant.", ok: false, why: "Vous ignorez le rythme du groupe."},
    {fr: "Une pause ? Mais on n'a même pas conclu, c'est n'importe quoi.", ok: false, why: "Reproche déplacé : un café philo ne cherche pas à trancher."},
    {fr: "Avec plaisir : en toute sincérité, j'en ai bien besoin !", ok: true, why: "Clin d'œil spirituel au sujet, qui clôt le débat sur une note légère."}
   ]}
  ]
 },
 {
  id: "negociation_partenariat",
  title: "Négociation serrée avec un grand patron",
  cefr: "C2",
  place: "🤝 Salon d'un grand hôtel, avenue George-V",
  goal: "Negotiate a partnership with a seasoned CEO: decode veiled threats and hold your ground with elegance.",
  turns: [
   {npc: "Je vais être franc avec vous, puisque nous sommes entre gens de bonne compagnie : votre offre est intéressante, mais d'autres frappent à notre porte, et certains avec des arguments, disons... plus sonnants et trébuchants.", npc_en: "I'll be frank with you, since we're among civilised people: your offer is interesting, but others are knocking at our door, and some with arguments that are, shall we say... rather more hard cash.", options: [
    {fr: "Qui ça ? Donnez-moi leurs noms et le montant de leurs offres.", ok: false, why: "Exigence naïve : il ne dévoilera évidemment pas son jeu."},
    {fr: "Dans ce cas, je relève immédiatement notre offre de 20 %.", ok: false, why: "Vous cédez au premier bluff, sans même vérifier qu'il est fondé."},
    {fr: "Je n'en doute pas, et c'est bien naturel pour une entreprise de votre qualité. Mais je crois que vous cherchez autre chose qu'un chèque : un partenaire qui connaisse votre marché. C'est là que nous faisons la différence.", ok: true, why: "Vous ne mordez pas à l'hameçon du chantage implicite et déplacez la négociation du prix vers la valeur."}
   ]},
   {npc: "Joliment dit. Mais vous savez ce qu'on dit : les promesses n'engagent que ceux qui les croient. Mon conseil d'administration, lui, ne lit que la dernière ligne.", npc_en: "Nicely put. But you know what they say: promises only bind those who believe them. My board only reads the bottom line.", options: [
    {fr: "Raison de plus pour inscrire nos engagements dans le contrat : des objectifs de chiffre d'affaires chiffrés, avec une clause de sortie à votre avantage si nous ne les tenons pas.", ok: true, why: "Vous répondez à son ironie par des garanties concrètes : la crédibilité change de camp."},
    {fr: "Votre conseil d'administration est bien terre à terre.", ok: false, why: "Pique condescendante envers son conseil : il ne peut que se braquer."},
    {fr: "Je vous jure qu'on tiendra nos promesses, faites-moi confiance.", ok: false, why: "Plaidoyer affectif sans garantie : exactement ce qu'il vient de railler."}
   ]},
   {npc: "Une clause de sortie... Vous êtes bien sûr de vous. Ou alors, vous avez un talent certain pour le bluff.", npc_en: "An exit clause... You're very sure of yourself. Or else you have a real talent for bluffing.", options: [
    {fr: "Je ne bluffe jamais, moi. Contrairement à certains.", ok: false, why: "L'allusion à son propre bluff est trop frontale à ce stade."},
    {fr: "Disons que je préfère prendre un risque mesuré plutôt que de vous demander une confiance aveugle. Vous seriez d'ailleurs le premier à vous en méfier.", ok: true, why: "Réponse fine qui transforme le soupçon de bluff en preuve de sérieux, avec une pointe de complicité."},
    {fr: "Oui, c'est du bluff, mais ça marche souvent.", ok: false, why: "Aveu absurde qui ruine votre position."}
   ]},
   {npc: "(Il sourit.) Vous me rappelez moi-même il y a trente ans. Bon. Reste la question de l'exclusivité. Nous ne pouvons pas nous lier les mains sur toute l'Europe.", npc_en: "(He smiles.) You remind me of myself thirty years ago. Right. That leaves the question of exclusivity. We can't tie our hands across the whole of Europe.", options: [
    {fr: "Sans exclusivité européenne, il n'y aura pas d'accord. Point.", ok: false, why: "Ligne rouge posée trop tôt et trop sèchement : vous vous fermez des portes."},
    {fr: "Pas de problème, oublions l'exclusivité.", ok: false, why: "Concession gratuite sur un point stratégique, sans contrepartie."},
    {fr: "Je l'entends. Que diriez-vous d'une exclusivité limitée à la France et au Benelux pendant trois ans, renouvelable en fonction des résultats ?", ok: true, why: "Vous accueillez la réserve et proposez un compromis circonscrit dans l'espace et dans le temps."}
   ]},
   {npc: "Trois ans, c'est long. Deux, et nous tenons peut-être un accord. Mais je ne vous cache pas qu'il faudra que je le vende en interne, et je ne suis pas seul à décider.", npc_en: "Three years is long. Two, and we may have a deal. But I won't hide from you that I'll have to sell it internally, and I'm not the only one deciding.", options: [
    {fr: "Vous dites ça pour gagner du temps, je le sais bien.", ok: false, why: "Procès d'intention qui ruine la confiance au moment de conclure."},
    {fr: "Deux ans, avec reconduction tacite si les objectifs sont atteints. Et si cela peut vous aider à convaincre vos administrateurs, je me tiens à leur disposition pour une présentation.", ok: true, why: "Vous acceptez sa contre-offre en sécurisant la suite, et vous lui fournissez des munitions pour sa négociation interne."},
    {fr: "Si vous n'êtes pas seul à décider, pourquoi est-ce que je perds mon temps avec vous ?", ok: false, why: "Insolence qui humilie votre interlocuteur."}
   ]},
   {npc: "Marché conclu, sur le principe. Mes juristes appelleront les vôtres. Et la prochaine fois, c'est vous qui m'invitez à déjeuner : vous m'avez coûté cher, aujourd'hui.", npc_en: "Deal, in principle. My lawyers will call yours. And next time, you're buying lunch: you've cost me dearly today.", options: [
    {fr: "Je ne vous ai rien coûté du tout, c'est un accord parfaitement équilibré.", ok: false, why: "Vous prenez au premier degré une boutade qui est en réalité un compliment."},
    {fr: "D'accord, mais on partagera l'addition.", ok: false, why: "Mesquinerie qui gâche un moment de connivence."},
    {fr: "Avec grand plaisir. Je connais une table où l'addition est presque aussi raisonnable que nos conditions.", ok: true, why: "Vous saisissez l'humour et y répondez avec la même ironie complice."}
   ]}
  ]
 },
 {
  id: "pot_depart_ironie",
  title: "Le pot de départ d'un collègue",
  cefr: "C2",
  place: "🍾 Open space, pot de départ un vendredi à 18 h",
  goal: "Navigate farewell drinks full of veiled irony and office politics, with an improvised speech.",
  turns: [
   {npc: "(Le directeur, verre à la main) Bien, puisque Bertrand nous quitte pour, je cite, « de nouvelles aventures », je laisse à ses proches collaborateurs le soin de dire quelques mots. Vous, peut-être ?", npc_en: "(The director, glass in hand) Well, since Bertrand is leaving us for, I quote, 'new adventures', I'll let his close colleagues say a few words. You, perhaps?", options: [
    {fr: "De nouvelles aventures ? On sait tous qu'il part chez le concurrent.", ok: false, why: "Vous révélez publiquement ce que les guillemets du directeur sous-entendaient : maladresse politique majeure."},
    {fr: "Avec plaisir. Bertrand, ces quatre années à tes côtés ont été une école : de rigueur, d'humour et, il faut bien le dire, de patience face à nos tableurs.", ok: true, why: "Vous ignorez élégamment la pique du directeur et centrez le discours sur la relation, avec une touche d'humour."},
    {fr: "Non merci, je ne suis pas doué pour les discours.", ok: false, why: "Un refus qui peut passer pour un désaveu de Bertrand devant tout le service."}
   ]},
   {npc: "(Bertrand, ému) Arrête, tu vas me faire pleurer... Et puis, entre nous, la patience, c'était surtout la tienne !", npc_en: "(Bertrand, moved) Stop it, you'll make me cry... And anyway, between us, the patience was mostly yours!", options: [
    {fr: "C'est vrai que tu as été très difficile à supporter.", ok: false, why: "Vous prenez au pied de la lettre son autodérision : ça tombe à plat."},
    {fr: "Ne pleure pas, ce n'est pas un enterrement.", ok: false, why: "Remarque sèche qui casse l'émotion."},
    {fr: "Disons que c'était réciproque. Et sache que ta machine à café personnelle, dissimulée derrière le classeur des archives, restera dans les annales.", ok: true, why: "Vous rendez le compliment et ajoutez une anecdote complice qui fait sourire sans gêner."}
   ]},
   {npc: "(Une collègue, à voix basse, après le discours) Joli discours... Tu sais qu'on dit que c'est toi qui vas récupérer ses dossiers ? Il paraît que certains ne sont pas ravis.", npc_en: "(A colleague, quietly, after the speech) Nice speech... You know people are saying you're the one taking over his accounts? Apparently some aren't thrilled.", options: [
    {fr: "Rien n'est décidé, à ma connaissance. Et si c'est le cas, j'aurai à cœur de travailler avec tout le monde.", ok: true, why: "Réponse prudente et diplomatique : vous ne confirmez rien et désamorcez la rumeur."},
    {fr: "Qui ça ? Dis-moi qui, je veux savoir.", ok: false, why: "Vous entrez dans le jeu des rumeurs, ce qui vous expose."},
    {fr: "Tant pis pour eux, je suis le meilleur, c'est tout.", ok: false, why: "Une arrogance qui confirmerait les réticences."}
   ]},
   {npc: "(Le directeur s'approche) Belle intervention. Vous avez le sens de la formule. Nous aurons l'occasion d'en reparler, d'ailleurs... de vos perspectives, j'entends.", npc_en: "(The director comes over) Nice speech. You have a way with words. We'll have the chance to talk about it again, by the way... about your prospects, I mean.", options: [
    {fr: "Mes perspectives ? Vous voulez dire que je vais être promu ? Quand ?", ok: false, why: "Empressement maladroit : vous forcez un sujet qu'il a seulement effleuré."},
    {fr: "Merci, j'en serais ravi. Je reste à votre disposition quand vous le souhaitez.", ok: true, why: "Vous saisissez la perche sans empressement ni fausse modestie."},
    {fr: "Oh, vous savez, la formule, c'était juste pour meubler.", ok: false, why: "Fausse modestie qui dévalorise votre propre discours."}
   ]},
   {npc: "(Bertrand, en partant, vous glisse :) Et méfie-toi : ici, quand on te dit que ta porte est toujours ouverte, c'est souvent pour mieux te montrer la sortie.", npc_en: "(Bertrand, on his way out, whispers:) And watch out: around here, when they tell you their door is always open, it's often the better to show you the exit.", options: [
    {fr: "Tu es aigri parce que tu pars, c'est tout.", ok: false, why: "Remarque blessante au moment des adieux."},
    {fr: "Je ne comprends pas, de quelle porte tu parles ?", ok: false, why: "Vous passez à côté du trait d'esprit et de la mise en garde qu'il contient."},
    {fr: "J'en prends bonne note... Et toi, ne fais pas trop d'étincelles chez la concurrence. Bonne route, Bertrand !", ok: true, why: "Vous accueillez sa mise en garde ironique avec la même légèreté complice ; en aparté, l'allusion à la concurrence passe très bien."}
   ]}
  ]
 },
 {
  id: "joute_verbale_diner",
  title: "Joute verbale avec un esprit caustique",
  cefr: "C2",
  place: "🍷 Dîner en ville, rive gauche",
  goal: "Hold your own against a sardonic writer: repartee, understatement and reading irony.",
  turns: [
   {npc: "(Un écrivain, en vous toisant) Consultant en stratégie... Fascinant. Vous êtes donc payé pour expliquer aux entreprises ce qu'elles savent déjà, mais avec des graphiques.", npc_en: "(A writer, eyeing you up) Strategy consultant... Fascinating. So you're paid to tell companies what they already know, but with charts.", options: [
    {fr: "C'est à peu près ça. À ceci près que les graphiques sont en couleur : c'est ce qui justifie nos honoraires.", ok: true, why: "Vous désarmez la pique par l'autodérision et la surenchère ironique : tout l'art de la repartie."},
    {fr: "Pas du tout, notre travail est très utile et très complexe.", ok: false, why: "Une défense au premier degré qui montre que la pique a porté."},
    {fr: "Et vous, vous êtes payé pour écrire des livres que personne ne lit.", ok: false, why: "Riposte agressive et sans finesse : vous perdez la joute."}
   ]},
   {npc: "(Il rit.) Bien répondu. Et que pensez-vous de mon dernier roman ? Ah, pardon, je suppose que vous n'avez guère le temps de lire, entre deux tableaux croisés.", npc_en: "(He laughs.) Well answered. And what do you think of my latest novel? Oh, sorry, I suppose you hardly have time to read, between two pivot tables.", options: [
    {fr: "Non, je ne lis pas de romans, ça ne sert à rien.", ok: false, why: "Vous confirmez le cliché et vexez l'auteur."},
    {fr: "Détrompez-vous, je l'ai lu dans le TGV. J'avoue que votre narrateur m'a beaucoup rappelé certains de mes clients : brillant, désabusé et persuadé d'avoir raison contre tous.", ok: true, why: "Vous prouvez votre lecture et retournez subtilement le portrait vers l'auteur, sans agressivité."},
    {fr: "Je l'ai adoré, c'est un chef-d'œuvre absolu, le plus grand livre du siècle !", ok: false, why: "Flagornerie si excessive qu'elle sonne faux, voire ironique."}
   ]},
   {npc: "Persuadé d'avoir raison contre tous... Vous insinuez que je me suis peint moi-même ? Quelle audace.", npc_en: "Convinced he's right against everyone... Are you implying I painted myself? What audacity.", options: [
    {fr: "Pardon, je ne voulais pas vous offenser, je retire ce que j'ai dit.", ok: false, why: "Vous battez en retraite alors qu'il joue : il attendait que vous teniez la position."},
    {fr: "Oui, c'est évident, vous êtes exactement comme lui.", ok: false, why: "Trop direct : toute la finesse de l'allusion disparaît."},
    {fr: "Je n'insinue rien : je constate que les meilleurs portraits sont rarement innocents. Flaubert n'a-t-il pas dit « Madame Bovary, c'est moi » ?", ok: true, why: "Vous maintenez la pointe avec élégance et l'adossez à une référence littéraire célèbre."}
   ]},
   {npc: "Formule apocryphe, mon cher, mais je vous l'accorde. (À la maîtresse de maison) Il est redoutable, votre invité. Où l'avez-vous déniché ?", npc_en: "An apocryphal quote, my dear fellow, but I'll grant you that. (To the hostess) He's formidable, your guest. Where did you dig him up?", options: [
    {fr: "Je vous retourne le compliment : il est rare de trouver un adversaire qui connaisse si bien ses classiques... et leurs apocryphes.", ok: true, why: "Vous recevez le compliment implicite et le rendez avec esprit, en reprenant son propre mot."},
    {fr: "Sur une application de rencontre.", ok: false, why: "Plaisanterie déplacée qui met l'hôtesse dans l'embarras."},
    {fr: "Personne ne m'a déniché, je suis venu tout seul, en métro.", ok: false, why: "Vous prenez au pied de la lettre ce qui est un compliment détourné."}
   ]},
   {npc: "Adversaire ? Allons, interlocuteur suffira. Je déteste perdre, voyez-vous, alors je préfère ne jamais combattre.", npc_en: "Opponent? Come now, 'interlocutor' will do. I hate losing, you see, so I prefer never to fight.", options: [
    {fr: "Vous avez perdu, de toute façon.", ok: false, why: "Un triomphalisme qui détruit la connivence installée."},
    {fr: "Interlocuteur ? Ce n'est pas la même chose ?", ok: false, why: "Vous ne saisissez pas la nuance : par coquetterie, il refuse le cadre du combat."},
    {fr: "Sage stratégie. C'est d'ailleurs ce que je conseille à mes clients : ne livrer que les batailles qu'on est sûr de gagner. Vous voyez, nous faisons le même métier.", ok: true, why: "Chute ironique qui boucle la conversation sur sa pique initiale : élégance et complicité."}
   ]}
  ]
 }
]);

// ───────────── READINGS A2 ─────────────
G.readings = G.readings.concat([
 {
  id: "email-reunion-deplacee",
  title: "Réunion déplacée",
  cefr: "A2",
  genre: "e-mail professionnel",
  text: "Objet : Réunion d'équipe déplacée à jeudi\n\nBonjour à tous,\n\nJe vous informe que la réunion d'équipe de mardi est déplacée à jeudi, à 10 h. Notre directrice, Mme Duval, est malade et ne peut pas venir mardi.\n\nLa réunion aura lieu dans la grande salle, au troisième étage, et non dans la salle habituelle. Elle durera environ une heure. Nous allons parler du nouveau client et des vacances d'été.\n\nMerci de m'envoyer vos dates de congés avant mercredi soir. Si vous ne pouvez pas venir jeudi, prévenez-moi par e-mail. N'oubliez pas d'apporter vos ordinateurs portables.\n\nIl y aura du café et des croissants pour tout le monde !\n\nBonne journée,\n\nKarim Benali\nAssistant de direction",
  glossary: [
   {fr: "déplacée", en: "moved, rescheduled"},
   {fr: "avoir lieu", en: "to take place"},
   {fr: "habituelle", en: "usual"},
   {fr: "durer", en: "to last"},
   {fr: "les congés", en: "time off, leave"},
   {fr: "prévenez-moi", en: "let me know"},
   {fr: "assistant de direction", en: "executive assistant"}
  ],
  questions: [
   {q: "Quand a lieu la réunion maintenant ?", choices: ["Mardi à 10 h", "Jeudi à 10 h", "Mercredi soir"], answer: "Jeudi à 10 h", why: "Karim écrit : « la réunion d'équipe de mardi est déplacée à jeudi, à 10 h »."},
   {q: "Pourquoi la réunion est-elle déplacée ?", choices: ["La salle est fermée", "Karim est en vacances", "La directrice est malade"], answer: "La directrice est malade", why: "« Mme Duval est malade et ne peut pas venir mardi. »"},
   {q: "Où est la réunion ?", choices: ["Dans la grande salle, au troisième étage", "Dans la salle habituelle", "Au café"], answer: "Dans la grande salle, au troisième étage", why: "« La réunion aura lieu dans la grande salle, au troisième étage, et non dans la salle habituelle. »"},
   {q: "Qu'est-ce qu'il faut envoyer avant mercredi soir ?", choices: ["Le nom du nouveau client", "Ses dates de congés", "Un croissant"], answer: "Ses dates de congés", why: "« Merci de m'envoyer vos dates de congés avant mercredi soir. »"},
   {q: "Qu'est-ce qu'il y aura à la réunion ?", choices: ["Un repas complet", "Du champagne", "Du café et des croissants"], answer: "Du café et des croissants", why: "« Il y aura du café et des croissants pour tout le monde ! »"}
  ]
 },
 {
  id: "reglement-residence-tilleuls",
  title: "Le règlement de l'immeuble",
  cefr: "A2",
  genre: "règlement intérieur",
  text: "RÉSIDENCE LES TILLEULS – RÈGLEMENT INTÉRIEUR\n\nChers résidents,\n\nPour bien vivre ensemble, merci de respecter ces quelques règles :\n\n1. Le bruit : après 22 h, on baisse la musique et on ne fait pas de travaux. Le dimanche, les travaux sont interdits toute la journée.\n\n2. Les poubelles : les poubelles jaunes sont pour le papier, le carton et le plastique. Les poubelles vertes sont pour le verre. On les sort le mardi et le vendredi soir.\n\n3. Les vélos et les poussettes : ils vont dans le local au rez-de-chaussée, pas dans le hall.\n\n4. Les animaux : les chiens sont acceptés, mais toujours en laisse dans les parties communes.\n\n5. Le code de la porte change le 1er de chaque mois. Le nouveau code est affiché dans l'ascenseur.\n\nEn cas de problème, contactez la gardienne, Mme Lopes, au 06 12 34 56 78.\n\nMerci !\nLe syndic",
  glossary: [
   {fr: "le bruit", en: "noise"},
   {fr: "les travaux", en: "building or DIY work"},
   {fr: "interdit", en: "forbidden"},
   {fr: "le verre", en: "glass"},
   {fr: "une poussette", en: "a pushchair, a stroller"},
   {fr: "le rez-de-chaussée", en: "the ground floor"},
   {fr: "en laisse", en: "on a lead"},
   {fr: "les parties communes", en: "the shared areas of a building"},
   {fr: "la gardienne", en: "the caretaker"},
   {fr: "le syndic", en: "the building management company"}
  ],
  questions: [
   {q: "Après quelle heure faut-il baisser la musique ?", choices: ["20 h", "22 h", "Minuit"], answer: "22 h", why: "« Après 22 h, on baisse la musique. »"},
   {q: "Où va une bouteille de vin vide ?", choices: ["Dans la poubelle jaune", "Dans le hall", "Dans la poubelle verte"], answer: "Dans la poubelle verte", why: "« Les poubelles vertes sont pour le verre. »"},
   {q: "Où faut-il laisser les vélos ?", choices: ["Dans le local au rez-de-chaussée", "Dans le hall", "Dans l'ascenseur"], answer: "Dans le local au rez-de-chaussée", why: "« Ils vont dans le local au rez-de-chaussée, pas dans le hall. »"},
   {q: "Les chiens sont-ils acceptés ?", choices: ["Non, jamais", "Oui, seulement le dimanche", "Oui, mais en laisse dans les parties communes"], answer: "Oui, mais en laisse dans les parties communes", why: "« Les chiens sont acceptés, mais toujours en laisse dans les parties communes. »"},
   {q: "Où trouve-t-on le nouveau code de la porte ?", choices: ["Chez le syndic", "Dans l'ascenseur", "Sur internet"], answer: "Dans l'ascenseur", why: "« Le nouveau code est affiché dans l'ascenseur. »"}
  ]
 },
 {
  id: "annonce-coloc-belleville",
  title: "Chambre libre à Belleville",
  cefr: "A2",
  genre: "petite annonce",
  text: "Chambre libre dans une coloc sympa – Belleville (20e)\n\nSalut ! Nous sommes trois colocataires : Inès (28 ans, infirmière), Hugo (31 ans, développeur) et Mei (26 ans, étudiante en master). Nous cherchons une quatrième personne à partir du 1er octobre.\n\nL'appartement fait 95 m². Il y a une grande cuisine, deux salles de bains et un petit balcon avec vue sur Paris. Ta chambre fait 12 m². Elle est meublée : un lit, un bureau et une armoire.\n\nLe loyer est de 690 € par mois, charges comprises (eau, électricité, internet). Le métro Pyrénées est à cinq minutes à pied.\n\nNous aimons cuisiner ensemble le dimanche soir, mais chacun est libre ! Nous ne fumons pas à l'intérieur.\n\nTu es intéressé(e) ? Envoie-nous un petit message pour te présenter. Visites ce week-end !",
  glossary: [
   {fr: "une coloc", en: "a flatshare (short for colocation)"},
   {fr: "libre", en: "available, free"},
   {fr: "à partir du", en: "from, starting on"},
   {fr: "meublée", en: "furnished"},
   {fr: "une armoire", en: "a wardrobe"},
   {fr: "charges comprises", en: "bills included"},
   {fr: "à pied", en: "on foot"},
   {fr: "à l'intérieur", en: "indoors"}
  ],
  questions: [
   {q: "Combien de personnes habitent dans l'appartement maintenant ?", choices: ["Deux", "Trois", "Quatre"], answer: "Trois", why: "« Nous sommes trois colocataires » : ils cherchent une quatrième personne."},
   {q: "Que fait Hugo ?", choices: ["Il est infirmier", "Il est étudiant", "Il est développeur"], answer: "Il est développeur", why: "« Hugo (31 ans, développeur). »"},
   {q: "Qu'est-ce qui est compris dans le loyer ?", choices: ["L'eau, l'électricité et internet", "Seulement l'eau", "Les repas du dimanche"], answer: "L'eau, l'électricité et internet", why: "« 690 € par mois, charges comprises (eau, électricité, internet). »"},
   {q: "Qu'est-ce qui est interdit dans l'appartement ?", choices: ["Cuisiner", "Recevoir des amis", "Fumer à l'intérieur"], answer: "Fumer à l'intérieur", why: "« Nous ne fumons pas à l'intérieur. »"},
   {q: "Quand peut-on visiter ?", choices: ["Le 1er octobre", "Ce week-end", "Le dimanche soir seulement"], answer: "Ce week-end", why: "L'annonce se termine par : « Visites ce week-end ! »"}
  ]
 },
 {
  id: "avis-bistrot-petit-zinc",
  title: "Un avis sur un bistrot",
  cefr: "A2",
  genre: "avis client en ligne",
  text: "★★★★☆ « Très bon, mais un peu bruyant »\npar Julie M., le 14 mars\n\nJe suis allée au Petit Zinc samedi soir avec mon copain. Nous avions réservé une table pour 20 h, mais nous avons attendu quinze minutes au bar. Heureusement, le serveur nous a offert un verre de vin pour s'excuser. Très gentil !\n\nComme entrée, j'ai pris une soupe à l'oignon, délicieuse. Mon copain a choisi des escargots ; il a adoré. Ensuite, nous avons pris le plat du jour : un bœuf bourguignon avec des pommes de terre. C'était parfait. Le dessert, une tarte au citron, était un peu trop sucré pour moi.\n\nLe seul problème : la salle est petite et très bruyante. On ne s'entend pas bien.\n\nPrix : 38 € par personne avec le vin. Je reviendrai, mais un soir de semaine !",
  glossary: [
   {fr: "bruyant", en: "noisy"},
   {fr: "mon copain", en: "my boyfriend"},
   {fr: "nous avions réservé", en: "we had booked"},
   {fr: "heureusement", en: "fortunately"},
   {fr: "s'excuser", en: "to apologise"},
   {fr: "l'entrée", en: "the starter"},
   {fr: "le plat du jour", en: "the dish of the day"},
   {fr: "sucré", en: "sweet, sugary"},
   {fr: "on ne s'entend pas", en: "you can't hear each other"}
  ],
  questions: [
   {q: "Combien de temps Julie a-t-elle attendu au bar ?", choices: ["Cinq minutes", "Une heure", "Quinze minutes"], answer: "Quinze minutes", why: "« Nous avons attendu quinze minutes au bar. »"},
   {q: "Qu'est-ce que le serveur a offert ?", choices: ["Un verre de vin", "Un dessert", "Le repas"], answer: "Un verre de vin", why: "« Le serveur nous a offert un verre de vin pour s'excuser. »"},
   {q: "Qu'est-ce que Julie n'a pas beaucoup aimé ?", choices: ["La soupe à l'oignon", "Le bœuf bourguignon", "La tarte au citron"], answer: "La tarte au citron", why: "« Le dessert, une tarte au citron, était un peu trop sucré pour moi. »"},
   {q: "Quel est le problème principal du restaurant ?", choices: ["Il est trop cher", "La salle est petite et bruyante", "Le serveur est désagréable"], answer: "La salle est petite et bruyante", why: "« Le seul problème : la salle est petite et très bruyante. »"},
   {q: "Quand Julie veut-elle revenir ?", choices: ["Un samedi soir", "Jamais", "Un soir de semaine"], answer: "Un soir de semaine", why: "« Je reviendrai, mais un soir de semaine ! » : il y a sans doute moins de monde."}
  ]
 }
]);

// ───────────── READINGS B1 ─────────────
G.readings = G.readings.concat([
 {
  id: "linkedin-nouveau-poste",
  title: "Nouvelle étape",
  cefr: "B1",
  genre: "post LinkedIn",
  text: "🎉 Nouvelle étape !\n\nAprès trois belles années chez Arcadia Conseil, j'ai le plaisir de vous annoncer que je rejoins l'équipe RSE de Biomarché, à Lyon, en tant que cheffe de projet.\n\nCe choix n'a pas été facile. Chez Arcadia, j'ai énormément appris : gérer des clients exigeants, travailler dans l'urgence, présenter devant des comités de direction... Mais depuis quelque temps, j'avais envie de passer « de l'autre côté » : ne plus seulement conseiller, mais mettre en œuvre les projets moi-même, et voir leurs résultats sur le long terme.\n\nChez Biomarché, je vais piloter la réduction des emballages plastiques dans nos 200 magasins. Un vrai défi, mais un sujet qui me tient à cœur depuis mes études.\n\nJe tiens à remercier Thomas, mon manager, qui m'a fait confiance dès mon stage, et toute l'équipe pour les fous rires, les pizzas à minuit et les présentations de dernière minute. Vous allez me manquer ! Je pars avec un pincement au cœur, mais aussi avec beaucoup d'enthousiasme.\n\nEt si vous passez par Lyon, mon agenda est ouvert pour un café. ☕\n\n#nouveauposte #RSE #transition",
  glossary: [
   {fr: "une étape", en: "a step, a milestone"},
   {fr: "rejoindre", en: "to join"},
   {fr: "la RSE", en: "CSR (corporate social responsibility)"},
   {fr: "cheffe de projet", en: "project manager (female)"},
   {fr: "mettre en œuvre", en: "to implement"},
   {fr: "piloter", en: "to lead, to steer"},
   {fr: "un emballage", en: "packaging"},
   {fr: "qui me tient à cœur", en: "that is close to my heart"},
   {fr: "les fous rires", en: "fits of laughter"}
  ],
  questions: [
   {q: "Pourquoi l'autrice quitte-t-elle Arcadia Conseil ?", choices: ["Elle n'aimait pas ses collègues", "Elle veut mettre en œuvre les projets elle-même", "Elle a été licenciée"], answer: "Elle veut mettre en œuvre les projets elle-même", why: "Elle voulait « ne plus seulement conseiller, mais mettre en œuvre les projets [elle]-même »."},
   {q: "Quelle sera sa mission principale chez Biomarché ?", choices: ["Ouvrir 200 nouveaux magasins", "Recruter des consultants", "Réduire les emballages plastiques"], answer: "Réduire les emballages plastiques", why: "« Je vais piloter la réduction des emballages plastiques dans nos 200 magasins. »"},
   {q: "Qui est Thomas ?", choices: ["Son ancien manager chez Arcadia", "Son nouveau directeur", "Un client de Biomarché"], answer: "Son ancien manager chez Arcadia", why: "Elle remercie « Thomas, mon manager, qui m'a fait confiance dès mon stage » chez Arcadia."},
   {q: "Quel souvenir de l'équipe d'Arcadia évoque-t-elle ?", choices: ["Les voyages à l'étranger", "Les pizzas à minuit", "Les séminaires à la montagne"], answer: "Les pizzas à minuit", why: "Elle cite « les fous rires, les pizzas à minuit et les présentations de dernière minute »."},
   {q: "Quel est le ton général du post ?", choices: ["Amer et critique", "Neutre et administratif", "Reconnaissant et enthousiaste"], answer: "Reconnaissant et enthousiaste", why: "Elle remercie son équipe, se dit heureuse de son nouveau défi et propose un café : le ton est positif."}
  ]
 },
 {
  id: "article-velo-paris",
  title: "Paris : le vélo dépasse la voiture",
  cefr: "B1",
  genre: "article de presse",
  text: "Paris : le vélo dépasse désormais la voiture\n\nC'est une petite révolution. Selon une étude publiée cette semaine, les Parisiens se déplacent aujourd'hui davantage à vélo qu'en voiture à l'intérieur de la capitale. Le vélo représente 11 % des trajets, contre 4 % pour la voiture.\n\nComment expliquer ce changement ? D'abord, la ville a construit des centaines de kilomètres de pistes cyclables ces dix dernières années. Ensuite, la crise sanitaire de 2020 a poussé de nombreux habitants à éviter les transports en commun. Enfin, la hausse du prix de l'essence a convaincu les derniers hésitants.\n\nTout le monde n'est pas ravi pour autant. Les commerçants de certains quartiers se plaignent de la baisse du nombre de places de stationnement. « Mes clients de banlieue ne viennent plus », regrette Paul, fleuriste dans le 11e arrondissement. Les piétons, eux, critiquent parfois le comportement des cyclistes qui ne respectent pas les feux rouges.\n\nLa marche reste cependant de loin le premier mode de déplacement des Parisiens : plus de la moitié des trajets se font à pied. Une tendance que la mairie compte bien encourager dans les années à venir.",
  glossary: [
   {fr: "dépasser", en: "to overtake"},
   {fr: "désormais", en: "now, from now on"},
   {fr: "se déplacer", en: "to get around"},
   {fr: "un trajet", en: "a journey, a trip"},
   {fr: "une piste cyclable", en: "a cycle lane"},
   {fr: "la hausse", en: "the rise"},
   {fr: "pour autant", en: "for all that, even so"},
   {fr: "le stationnement", en: "parking"},
   {fr: "un piéton", en: "a pedestrian"},
   {fr: "de loin", en: "by far"}
  ],
  questions: [
   {q: "Quelle part des trajets se fait à vélo à Paris ?", choices: ["4 %", "11 %", "Plus de la moitié"], answer: "11 %", why: "« Le vélo représente 11 % des trajets, contre 4 % pour la voiture. »"},
   {q: "Laquelle de ces raisons n'est PAS citée dans l'article ?", choices: ["Les nouvelles pistes cyclables", "La gratuité des vélos en libre-service", "La hausse du prix de l'essence"], answer: "La gratuité des vélos en libre-service", why: "L'article cite les pistes cyclables, la crise sanitaire et le prix de l'essence, mais jamais la gratuité des vélos."},
   {q: "Pourquoi Paul, le fleuriste, n'est-il pas content ?", choices: ["Ses clients de banlieue ne viennent plus", "Les cyclistes abîment ses fleurs", "Il doit venir travailler à vélo"], answer: "Ses clients de banlieue ne viennent plus", why: "Il y a moins de places de stationnement, donc « mes clients de banlieue ne viennent plus »."},
   {q: "Que reprochent certains piétons aux cyclistes ?", choices: ["De rouler trop lentement", "De prendre les transports en commun", "De ne pas respecter les feux rouges"], answer: "De ne pas respecter les feux rouges", why: "Les piétons « critiquent parfois le comportement des cyclistes qui ne respectent pas les feux rouges »."},
   {q: "Quel est le premier mode de déplacement des Parisiens ?", choices: ["Le vélo", "La marche", "La voiture"], answer: "La marche", why: "« La marche reste cependant de loin le premier mode de déplacement des Parisiens. »"}
  ]
 },
 {
  id: "compte-rendu-equipe-marketing",
  title: "Compte rendu de la réunion marketing",
  cefr: "B1",
  genre: "compte rendu de réunion",
  text: "COMPTE RENDU – Réunion de l'équipe Marketing\nDate : lundi 3 février, 9 h 30 – 10 h 30\nPrésents : Claire (responsable), Malik, Sophie, Antoine\nAbsente excusée : Léa (en congé)\n\n1. Lancement du nouveau produit\nLe lancement de la gamme « Bio Fresh » est confirmé pour le 15 mars. Malik présente les premiers visuels de la campagne. L'équipe les trouve réussis, mais demande des couleurs plus vives. Malik enverra une nouvelle version d'ici vendredi. Le slogan reste à trouver.\n\n2. Budget\nLa direction réduit de 10 % le budget de la campagne. Claire propose de diminuer la publicité dans la presse papier et de miser davantage sur les réseaux sociaux. Proposition adoptée à l'unanimité.\n\n3. Salon professionnel de Lyon\nSophie et Antoine représenteront l'entreprise au salon, du 20 au 22 février. Sophie s'occupe de réserver l'hôtel et les billets de train. Le stand sera partagé avec notre partenaire lyonnais, comme l'année dernière.\n\n4. Divers\nAntoine rappelle que la machine à café du deuxième étage est en panne depuis une semaine. Claire contactera les services généraux.\n\nProchaine réunion : lundi 10 février, même heure.",
  glossary: [
   {fr: "un compte rendu", en: "minutes, a report"},
   {fr: "absente excusée", en: "absent with apologies"},
   {fr: "le lancement", en: "the launch"},
   {fr: "une gamme", en: "a product range"},
   {fr: "vif, vive", en: "bright (colour)"},
   {fr: "miser sur", en: "to bet on, to focus on"},
   {fr: "à l'unanimité", en: "unanimously"},
   {fr: "un salon professionnel", en: "a trade fair"},
   {fr: "divers", en: "any other business"},
   {fr: "en panne", en: "out of order"}
  ],
  questions: [
   {q: "Pourquoi Léa n'était-elle pas à la réunion ?", choices: ["Elle était malade", "Elle était en congé", "Elle était au salon de Lyon"], answer: "Elle était en congé", why: "« Absente excusée : Léa (en congé). »"},
   {q: "Que doit faire Malik d'ici vendredi ?", choices: ["Envoyer une nouvelle version des visuels", "Réserver l'hôtel", "Contacter les services généraux"], answer: "Envoyer une nouvelle version des visuels", why: "L'équipe veut des couleurs plus vives : « Malik enverra une nouvelle version d'ici vendredi. »"},
   {q: "Comment l'équipe va-t-elle s'adapter à la baisse du budget ?", choices: ["En annulant le lancement", "En supprimant le salon de Lyon", "En misant davantage sur les réseaux sociaux"], answer: "En misant davantage sur les réseaux sociaux", why: "Claire propose « de diminuer la publicité dans la presse papier et de miser davantage sur les réseaux sociaux »."},
   {q: "Que signifie « Proposition adoptée à l'unanimité » ?", choices: ["Une seule personne était d'accord", "Tout le monde était d'accord", "Personne n'a voté"], answer: "Tout le monde était d'accord", why: "« À l'unanimité » signifie que tous les participants ont voté pour."},
   {q: "Quel problème pratique Antoine signale-t-il ?", choices: ["Le train pour Lyon est complet", "La salle de réunion est trop petite", "La machine à café est en panne"], answer: "La machine à café est en panne", why: "« La machine à café du deuxième étage est en panne depuis une semaine. »"}
  ]
 },
 {
  id: "lettre-motivation-stage",
  title: "Candidature pour un stage",
  cefr: "B1",
  genre: "lettre de motivation",
  text: "Objet : Candidature au poste de stagiaire en marketing digital\n\nMadame, Monsieur,\n\nActuellement étudiant en deuxième année de master dans une école de commerce parisienne, je me permets de vous adresser ma candidature pour le stage de six mois en marketing digital que vous proposez à partir de janvier.\n\nVotre entreprise a attiré mon attention par son engagement en faveur d'une mode plus responsable. Votre récente campagne « Portez-le plus longtemps » m'a particulièrement marqué, car elle montre qu'une marque peut à la fois vendre et sensibiliser ses clients.\n\nAu cours de mon précédent stage dans une start-up de cosmétiques, j'ai géré les comptes Instagram et TikTok de la marque. En six mois, le nombre d'abonnés a augmenté de 40 %. J'ai également appris à analyser les performances des campagnes.\n\nRigoureux et créatif, je parle couramment anglais et espagnol, ce qui pourrait être utile pour votre développement à l'international.\n\nJe serais ravi de vous rencontrer afin de vous exposer plus en détail mes motivations. Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\nLucas Ferreira",
  glossary: [
   {fr: "une candidature", en: "an application"},
   {fr: "je me permets de", en: "I take the liberty of"},
   {fr: "l'engagement", en: "commitment"},
   {fr: "sensibiliser", en: "to raise awareness"},
   {fr: "un abonné", en: "a follower, a subscriber"},
   {fr: "couramment", en: "fluently"},
   {fr: "exposer", en: "to set out, to explain"},
   {fr: "agréer", en: "to accept (formal letter closing)"}
  ],
  questions: [
   {q: "Quelle est la situation actuelle de Lucas ?", choices: ["Il travaille dans une start-up", "Il est au chômage", "Il est étudiant en master"], answer: "Il est étudiant en master", why: "« Actuellement étudiant en deuxième année de master... »"},
   {q: "Pourquoi Lucas s'intéresse-t-il à cette entreprise ?", choices: ["Pour son engagement en faveur d'une mode responsable", "Parce qu'elle paie bien ses stagiaires", "Parce qu'elle est près de chez lui"], answer: "Pour son engagement en faveur d'une mode responsable", why: "« Votre entreprise a attiré mon attention par son engagement en faveur d'une mode plus responsable. »"},
   {q: "Quel résultat Lucas a-t-il obtenu lors de son précédent stage ?", choices: ["Il a augmenté les ventes de 40 %", "Il a fait progresser le nombre d'abonnés de 40 %", "Il a créé une nouvelle marque"], answer: "Il a fait progresser le nombre d'abonnés de 40 %", why: "« En six mois, le nombre d'abonnés a augmenté de 40 %. » Il ne parle pas des ventes."},
   {q: "Pourquoi Lucas mentionne-t-il les langues qu'il parle ?", choices: ["Parce qu'il veut partir vivre à l'étranger", "Pour le développement international de l'entreprise", "Pour traduire la lettre"], answer: "Pour le développement international de l'entreprise", why: "« ...ce qui pourrait être utile pour votre développement à l'international. »"},
   {q: "Comment se termine la lettre ?", choices: ["Par une formule familière", "Par une question au recruteur", "Par une formule de politesse formelle"], answer: "Par une formule de politesse formelle", why: "« Je vous prie d'agréer... l'expression de mes salutations distinguées » est la formule classique d'une lettre formelle."}
  ]
 },
 {
  id: "critique-voisins-du-dessus",
  title: "« Les Voisins du dessus » : une comédie sympathique",
  cefr: "B1",
  genre: "critique de film",
  text: "★★★☆☆ Les Voisins du dessus, de Claire Morin\n\nDepuis son premier film, Claire Morin est devenue une spécialiste de la comédie sociale. Avec Les Voisins du dessus, elle s'attaque à un sujet que tous les Parisiens connaissent : les conflits de voisinage.\n\nL'histoire est simple. Bernard, professeur de piano à la retraite, vit tranquillement au quatrième étage d'un immeuble du 15e arrondissement. Un jour, une jeune famille bruyante s'installe juste au-dessus de chez lui. Très vite, la guerre commence : musique, réclamations, petites vengeances...\n\nLe grand point fort du film, ce sont les acteurs. Daniel Leroux est parfait en vieux grincheux au cœur tendre, et la jeune Sarah Diallo, qui joue la mère de famille, apporte beaucoup d'énergie. Certaines scènes, comme la réunion de copropriété, sont vraiment hilarantes.\n\nMalheureusement, la deuxième partie est moins réussie. Le scénario devient prévisible et la fin, un peu trop sentimentale, manque d'originalité. On devine dès le début que les ennemis vont devenir amis.\n\nMalgré ces défauts, Les Voisins du dessus reste un film agréable, idéal pour une soirée détente.",
  glossary: [
   {fr: "s'attaquer à", en: "to tackle"},
   {fr: "à la retraite", en: "retired"},
   {fr: "s'installer", en: "to move in"},
   {fr: "une réclamation", en: "a complaint"},
   {fr: "un grincheux", en: "a grump"},
   {fr: "hilarant", en: "hilarious"},
   {fr: "prévisible", en: "predictable"},
   {fr: "deviner", en: "to guess"},
   {fr: "une soirée détente", en: "a relaxing evening"}
  ],
  questions: [
   {q: "Quel est le sujet du film ?", choices: ["La vie d'un pianiste célèbre", "Les conflits de voisinage", "Une histoire d'amour à Paris"], answer: "Les conflits de voisinage", why: "La réalisatrice « s'attaque à un sujet que tous les Parisiens connaissent : les conflits de voisinage »."},
   {q: "Qui est Bernard ?", choices: ["Un professeur de piano à la retraite", "Un jeune père de famille", "Le propriétaire de l'immeuble"], answer: "Un professeur de piano à la retraite", why: "« Bernard, professeur de piano à la retraite, vit tranquillement au quatrième étage. »"},
   {q: "Selon le critique, quel est le grand point fort du film ?", choices: ["Le scénario", "La musique", "Les acteurs"], answer: "Les acteurs", why: "« Le grand point fort du film, ce sont les acteurs. »"},
   {q: "Que reproche le critique à la fin du film ?", choices: ["Elle est trop triste", "Elle est trop sentimentale et prévisible", "Elle est incompréhensible"], answer: "Elle est trop sentimentale et prévisible", why: "« La fin, un peu trop sentimentale, manque d'originalité. On devine dès le début que les ennemis vont devenir amis. »"},
   {q: "Quelle est l'opinion générale du critique ?", choices: ["C'est un chef-d'œuvre", "C'est un film à éviter", "C'est un film agréable malgré ses défauts"], answer: "C'est un film agréable malgré ses défauts", why: "« Malgré ces défauts, Les Voisins du dessus reste un film agréable » ; il lui donne trois étoiles sur cinq."}
  ]
 }
]);

// ───────────── READINGS B2 ─────────────
G.readings = G.readings.concat([
 {
  id: "tribune-teletravail-privilege",
  title: "Le télétravail ne doit pas devenir un privilège",
  cefr: "B2",
  genre: "tribune",
  text: "Le télétravail ne doit pas devenir un privilège\n\nIl y a quelques années, le télétravail était encore perçu comme une faveur accordée du bout des lèvres à quelques salariés « de confiance ». La crise sanitaire a tout bouleversé : du jour au lendemain, des millions de Français ont découvert qu'ils pouvaient travailler efficacement depuis leur salon. Aujourd'hui, pourtant, de nombreuses entreprises font machine arrière et exigent un retour au bureau quatre, voire cinq jours par semaine.\n\nLes arguments des directions sont connus : la créativité naîtrait des échanges informels autour de la machine à café, et les jeunes recrues auraient besoin de leurs aînés pour apprendre le métier. Ces arguments ne sont pas absurdes. Mais ils masquent souvent une réalité moins avouable : la difficulté de certains managers à faire confiance à des équipes qu'ils ne voient pas.\n\nSurtout, ce débat oublie une inégalité criante. Le télétravail concerne essentiellement les cadres, qui vivent souvent en centre-ville. Pour l'infirmière, le caissier ou l'ouvrier, il n'a jamais été une option. Et pour ceux qui habitent à une heure et demie de leur lieu de travail, faute de pouvoir se loger près de Paris, chaque jour de télétravail représente trois heures de vie retrouvées.\n\nPlutôt que d'opposer bureau et domicile, il faudrait repenser l'organisation du travail dans son ensemble : des horaires plus souples pour ceux qui ne peuvent pas télétravailler, des règles claires négociées avec les salariés, et des bureaux pensés comme des lieux de rencontre plutôt que comme des espaces de contrôle.\n\nLe télétravail n'est ni une lubie ni une menace. C'est un outil. À nous de faire en sorte qu'il ne profite pas qu'aux mieux lotis.\n\nNadia Kerrouche, sociologue du travail",
  glossary: [
   {fr: "du bout des lèvres", en: "reluctantly, half-heartedly"},
   {fr: "bouleverser", en: "to turn upside down"},
   {fr: "faire machine arrière", en: "to backtrack"},
   {fr: "une recrue", en: "a recruit"},
   {fr: "avouable", en: "that can be admitted"},
   {fr: "criant", en: "glaring, blatant"},
   {fr: "faute de", en: "for lack of"},
   {fr: "souple", en: "flexible"},
   {fr: "une lubie", en: "a whim, a fad"},
   {fr: "les mieux lotis", en: "the best-off"}
  ],
  questions: [
   {q: "Quelle tendance l'autrice constate-t-elle aujourd'hui ?", choices: ["Les entreprises généralisent le télétravail", "De nombreuses entreprises exigent un retour au bureau", "Les salariés refusent de télétravailler"], answer: "De nombreuses entreprises exigent un retour au bureau", why: "« De nombreuses entreprises font machine arrière et exigent un retour au bureau quatre, voire cinq jours par semaine. »"},
   {q: "Selon l'autrice, que cachent souvent les arguments des directions ?", choices: ["Des problèmes financiers", "Un manque de confiance de certains managers", "Un manque de bureaux"], answer: "Un manque de confiance de certains managers", why: "Ils masquent « la difficulté de certains managers à faire confiance à des équipes qu'ils ne voient pas »."},
   {q: "Quelle inégalité l'autrice met-elle en avant ?", choices: ["Entre les hommes et les femmes", "Entre Paris et la province", "Entre les cadres et ceux dont le métier ne permet pas de télétravailler"], answer: "Entre les cadres et ceux dont le métier ne permet pas de télétravailler", why: "Le télétravail « concerne essentiellement les cadres » ; pour l'infirmière, le caissier ou l'ouvrier, « il n'a jamais été une option »."},
   {q: "Que propose l'autrice ?", choices: ["Repenser l'organisation du travail dans son ensemble", "Supprimer les bureaux", "Interdire le télétravail aux jeunes recrues"], answer: "Repenser l'organisation du travail dans son ensemble", why: "Elle propose des horaires souples, des règles négociées et des bureaux conçus comme des lieux de rencontre."},
   {q: "Quelle est sa position sur les arguments des directions ?", choices: ["Elle les juge totalement absurdes", "Elle les approuve sans réserve", "Elle les juge en partie fondés, mais incomplets"], answer: "Elle les juge en partie fondés, mais incomplets", why: "« Ces arguments ne sont pas absurdes. Mais ils masquent souvent... » : elle concède avant de nuancer."}
  ]
 },
 {
  id: "chronique-reunion-email",
  title: "Cette réunion aurait pu être un e-mail",
  cefr: "B2",
  genre: "chronique humoristique",
  text: "Cette réunion aurait pu être un e-mail\n\nLundi, 9 h 02. La réunion devait commencer à 9 h, mais en France, l'heure indiquée est une simple suggestion. Autour de la table, huit personnes, deux croissants et un écran qui refuse obstinément de reconnaître l'ordinateur de Jean-Marc. « Attendez, ça marchait tout à l'heure », affirme Jean-Marc, comme chaque lundi depuis 2019.\n\n9 h 14. On démarre enfin par un tour de table. Chacun est censé résumer sa semaine en une minute. Personne ne le fait. Patricia, de la comptabilité, nous raconte en détail la panne de sa chaudière, ce qui n'a aucun rapport avec l'ordre du jour, mais suscite une vraie émotion collective.\n\n9 h 37. Arrive le moment fatidique où quelqu'un prononce la phrase : « Je me fais l'avocat du diable. » Il s'agit en général de défendre une idée que personne n'avait attaquée. Le débat s'enflamme. On ne sait plus très bien de quoi on parle, mais on en parle avec passion.\n\n10 h 05. Le manager, qui n'a rien dit depuis une heure, propose de « prendre un peu de hauteur ». Tout le monde hoche gravement la tête. Personne ne sait ce que cela signifie concrètement, mais c'est rassurant.\n\n10 h 28. Conclusion : il faut organiser une autre réunion pour préparer la prochaine réunion. Un « point rapide » est calé pour jeudi. Il durera deux heures.\n\n10 h 30. En sortant, je jette un œil à l'ordre du jour, imprimé avec soin. Il comportait un seul point : « Valider la date du séminaire ». La date n'a pas été validée.\n\nMais on a eu des croissants.",
  glossary: [
   {fr: "obstinément", en: "stubbornly"},
   {fr: "être censé", en: "to be supposed to"},
   {fr: "une chaudière", en: "a boiler"},
   {fr: "l'ordre du jour", en: "the agenda"},
   {fr: "fatidique", en: "fateful"},
   {fr: "se faire l'avocat du diable", en: "to play devil's advocate"},
   {fr: "s'enflammer", en: "to flare up"},
   {fr: "prendre de la hauteur", en: "to step back and see the big picture"},
   {fr: "hocher la tête", en: "to nod"},
   {fr: "caler (un rendez-vous)", en: "to schedule (informal)"}
  ],
  questions: [
   {q: "Que suggère l'auteur avec la phrase « l'heure indiquée est une simple suggestion » ?", choices: ["Que les horloges de la salle sont en panne", "Que les réunions commencent rarement à l'heure en France", "Que la réunion a été annulée"], answer: "Que les réunions commencent rarement à l'heure en France", why: "C'est une exagération humoristique sur le retard habituel des réunions."},
   {q: "Pourquoi l'histoire de Patricia est-elle drôle ?", choices: ["Elle n'a aucun rapport avec l'ordre du jour, mais passionne tout le monde", "Patricia travaille à la comptabilité", "La chaudière explose pendant la réunion"], answer: "Elle n'a aucun rapport avec l'ordre du jour, mais passionne tout le monde", why: "Le décalage entre le hors-sujet total et l'« émotion collective » qu'il suscite crée le comique."},
   {q: "Selon l'auteur, que fait en général celui qui « se fait l'avocat du diable » ?", choices: ["Il propose une solution concrète", "Il quitte la réunion", "Il défend une idée que personne n'avait attaquée"], answer: "Il défend une idée que personne n'avait attaquée", why: "« Il s'agit en général de défendre une idée que personne n'avait attaquée. »"},
   {q: "Quelle est l'ironie de la conclusion de la réunion ?", choices: ["On décide d'organiser une réunion pour préparer la suivante", "On décide de supprimer toutes les réunions", "On valide enfin la date du séminaire"], answer: "On décide d'organiser une réunion pour préparer la suivante", why: "Une réunion inutile débouche sur d'autres réunions, dont un « point rapide » de deux heures."},
   {q: "Quel est le ton de cette chronique ?", choices: ["Triste et nostalgique", "Ironique et moqueur", "Neutre et informatif"], answer: "Ironique et moqueur", why: "L'auteur se moque gentiment des rituels de bureau, jusqu'à la chute : « Mais on a eu des croissants. »"}
  ]
 },
 {
  id: "roman-premier-jour",
  title: "Le premier jour",
  cefr: "B2",
  genre: "extrait de roman",
  text: "L'immeuble de verre se dressait au bout de l'esplanade comme un reproche. Yasmine leva les yeux vers le vingt-huitième étage, là où, à partir d'aujourd'hui, elle était censée devenir quelqu'un. Elle ajusta une dernière fois la veste achetée la veille, trop chère pour son salaire de débutante, et poussa la porte tournante.\n\nÀ l'accueil, un jeune homme aux cheveux impeccablement plaqués lui tendit un badge sans lever les yeux de son écran.\n— Vous êtes attendue en salle Monceau. Ascenseur C.\n\nDans l'ascenseur, elle croisa son propre reflet et eut du mal à se reconnaître. Trois ans plus tôt, elle servait encore des cafés dans une brasserie de Belleville pour payer ses cours du soir. Ce matin, sa mère lui avait dit en la serrant dans ses bras : « Ne laisse personne te faire sentir que tu n'es pas à ta place. » Sur le moment, la phrase l'avait fait sourire. Maintenant, elle lui pesait.\n\nLa salle Monceau était déjà pleine. Une dizaine de jeunes recrues, toutes vêtues de bleu marine, échangeaient des noms d'écoles comme on échange des cartes de visite. HEC, Polytechnique, Sciences Po. Quand vint son tour, Yasmine hésita une seconde de trop.\n— Et toi, tu sors d'où ? demanda un grand blond, avec un sourire poli.\n— De loin, répondit-elle.\n\nIl rit, croyant à une plaisanterie. Elle ne le détrompa pas. Au fond de la salle, une femme d'une cinquantaine d'années, qui n'avait rien dit jusque-là, la regardait avec une attention nouvelle. Yasmine apprendrait plus tard que c'était l'associée qui avait insisté pour la recruter.",
  glossary: [
   {fr: "se dresser", en: "to stand tall, to rise up"},
   {fr: "un reproche", en: "a reproach"},
   {fr: "être censé", en: "to be supposed to"},
   {fr: "la porte tournante", en: "the revolving door"},
   {fr: "plaqué", en: "slicked down (hair)"},
   {fr: "peser", en: "to weigh (on someone)"},
   {fr: "une recrue", en: "a recruit"},
   {fr: "bleu marine", en: "navy blue"},
   {fr: "détromper", en: "to set someone straight"}
  ],
  questions: [
   {q: "Que suggère la comparaison de l'immeuble à « un reproche » ?", choices: ["L'immeuble est mal construit", "Yasmine se sent intimidée et pas tout à fait légitime", "Yasmine est en retard"], answer: "Yasmine se sent intimidée et pas tout à fait légitime", why: "Le bâtiment semble la juger : c'est le reflet de son propre sentiment de ne pas être à sa place."},
   {q: "Que faisait Yasmine trois ans plus tôt ?", choices: ["Elle servait des cafés dans une brasserie", "Elle étudiait à HEC", "Elle travaillait à l'accueil d'une entreprise"], answer: "Elle servait des cafés dans une brasserie", why: "« Elle servait encore des cafés dans une brasserie de Belleville pour payer ses cours du soir. »"},
   {q: "Pourquoi la phrase de sa mère « lui pesait » maintenant ?", choices: ["Parce qu'elle avait oublié la phrase", "Parce que sa mère l'avait vexée", "Parce qu'elle ressentait justement la peur de ne pas être à sa place"], answer: "Parce qu'elle ressentait justement la peur de ne pas être à sa place", why: "Face aux autres recrues, la mise en garde de sa mère devient soudain très concrète."},
   {q: "Que signifie la réponse « De loin » ?", choices: ["Elle habite en lointaine banlieue", "Elle évoque à la fois son origine sociale et le chemin parcouru", "Elle refuse de parler aux autres"], answer: "Elle évoque à la fois son origine sociale et le chemin parcouru", why: "Au lieu de citer une grande école, elle répond par une formule à double sens que le jeune homme prend pour une blague."},
   {q: "Qui est la femme au fond de la salle ?", choices: ["Une autre recrue", "La mère de Yasmine", "L'associée qui a insisté pour recruter Yasmine"], answer: "L'associée qui a insisté pour recruter Yasmine", why: "« Yasmine apprendrait plus tard que c'était l'associée qui avait insisté pour la recruter. »"}
  ]
 },
 {
  id: "article-colocation-intergenerationnelle",
  title: "Quand les seniors hébergent les étudiants",
  cefr: "B2",
  genre: "article de presse",
  text: "Colocation intergénérationnelle : quand les seniors hébergent les étudiants\n\nDans son grand appartement du 16e arrondissement, Jacqueline, 82 ans, vivait seule depuis la mort de son mari. « Les soirées étaient longues, et mes enfants s'inquiétaient », confie-t-elle. Depuis septembre, elle partage son logement avec Amadou, 23 ans, étudiant en école d'ingénieurs. Il paie un loyer symbolique de 150 euros par mois ; en échange, il s'engage à dîner avec elle trois soirs par semaine et à dormir sur place.\n\nCe type d'arrangement, appelé colocation intergénérationnelle, connaît un succès croissant. Plusieurs associations mettent en relation des personnes âgées disposant d'une chambre libre et des jeunes à la recherche d'un logement abordable. À Paris, où une chambre de bonne de neuf mètres carrés se loue facilement 600 euros, l'offre a de quoi séduire.\n\nLes avantages sont évidents des deux côtés : les jeunes se logent à moindre coût, les seniors rompent leur isolement et se sentent en sécurité. Mais tout n'est pas toujours rose. « Il faut bien définir les règles dès le départ », prévient la responsable d'une association. « Certains seniors attendent une présence permanente, alors que les étudiants ont aussi besoin de liberté. » Les associations organisent donc des entretiens préalables et font signer une convention qui précise les engagements de chacun.\n\nPour Amadou, l'expérience dépasse largement la question financière. « Jacqueline m'apprend à cuisiner, et moi, je lui montre comment faire des appels vidéo avec ses petits-enfants. » Et Jacqueline d'ajouter, en souriant : « Il m'a même convaincue de m'inscrire sur Instagram. Je ne suis pas sûre que ce soit une bonne idée. »",
  glossary: [
   {fr: "héberger", en: "to house, to put up"},
   {fr: "confier", en: "to confide"},
   {fr: "s'engager à", en: "to commit to"},
   {fr: "croissant", en: "growing"},
   {fr: "mettre en relation", en: "to put in touch"},
   {fr: "abordable", en: "affordable"},
   {fr: "une chambre de bonne", en: "a tiny attic room (former maid's room)"},
   {fr: "à moindre coût", en: "at lower cost"},
   {fr: "rompre l'isolement", en: "to break out of isolation"},
   {fr: "préalable", en: "preliminary"}
  ],
  questions: [
   {q: "Quelle est la contrepartie du loyer symbolique payé par Amadou ?", choices: ["Il fait le ménage tous les jours", "Il paie les courses", "Il dîne avec Jacqueline trois soirs par semaine et dort sur place"], answer: "Il dîne avec Jacqueline trois soirs par semaine et dort sur place", why: "« En échange, il s'engage à dîner avec elle trois soirs par semaine et à dormir sur place. »"},
   {q: "Pourquoi ce type de colocation séduit-il particulièrement à Paris ?", choices: ["Parce que les logements y sont très chers", "Parce que les seniors y sont plus nombreux", "Parce que les étudiants y sont plus riches"], answer: "Parce que les logements y sont très chers", why: "« Une chambre de bonne de neuf mètres carrés se loue facilement 600 euros. »"},
   {q: "Quelle difficulté la responsable d'association évoque-t-elle ?", choices: ["Les jeunes ne paient pas leur loyer", "Les attentes des seniors et le besoin de liberté des étudiants peuvent s'opposer", "Les appartements sont trop petits"], answer: "Les attentes des seniors et le besoin de liberté des étudiants peuvent s'opposer", why: "« Certains seniors attendent une présence permanente, alors que les étudiants ont aussi besoin de liberté. »"},
   {q: "Que montre l'exemple d'Amadou et de Jacqueline à la fin de l'article ?", choices: ["Un conflit entre générations", "Un échange réciproque qui va au-delà de l'argent", "Que la colocation est un échec"], answer: "Un échange réciproque qui va au-delà de l'argent", why: "Elle lui apprend à cuisiner, il lui apprend les appels vidéo : « l'expérience dépasse largement la question financière »."},
   {q: "Quel est le ton de la dernière phrase de Jacqueline ?", choices: ["Inquiet et triste", "Agressif", "Humoristique et légèrement ironique"], answer: "Humoristique et légèrement ironique", why: "Elle doute avec humour de sa nouvelle vie sur Instagram, ce qui conclut l'article sur un sourire."}
  ]
 },
 {
  id: "email-relance-facture",
  title: "Relance pour une facture impayée",
  cefr: "B2",
  genre: "e-mail professionnel",
  text: "De : Sandrine Vasseur\nÀ : Olivier Garnier\nObjet : Re : Retard de paiement – facture n° 2024-118\n\nBonjour Monsieur Garnier,\n\nJe me permets de revenir vers vous au sujet de notre facture n° 2024-118, d'un montant de 12 400 euros, émise le 15 janvier pour la mission de conseil réalisée auprès de vos équipes.\n\nSauf erreur de notre part, ce règlement, prévu à trente jours, n'a toujours pas été effectué, malgré notre première relance du 20 février. Je comprends parfaitement que les circuits de validation puissent être longs dans une structure comme la vôtre. Néanmoins, ce retard de près de deux mois commence à peser sur notre trésorerie, comme vous pouvez l'imaginer pour un cabinet de notre taille.\n\nVotre service comptable nous a indiqué oralement que la facture était « bloquée » en raison d'un bon de commande manquant. Or, ce document vous a été transmis le 10 janvier ; je vous le joins à nouveau, par précaution. Je tiens par ailleurs à souligner que notre équipe a livré l'ensemble des travaux dans les délais convenus, et que vos interlocuteurs opérationnels nous ont fait part de leur entière satisfaction.\n\nJe vous serais donc reconnaissante de bien vouloir faire le nécessaire pour que le paiement intervienne dans les meilleurs délais, et au plus tard le 31 mars. À défaut, nous serions contraints d'appliquer les pénalités de retard prévues dans nos conditions générales, ce que nous souhaiterions naturellement éviter, compte tenu de la qualité de notre collaboration.\n\nJe reste bien entendu à votre disposition pour en discuter de vive voix si nécessaire.\n\nBien cordialement,\n\nSandrine Vasseur\nAssociée, Vasseur & Partners",
  glossary: [
   {fr: "revenir vers quelqu'un", en: "to get back to someone (business jargon)"},
   {fr: "émis(e)", en: "issued"},
   {fr: "sauf erreur de notre part", en: "unless we are mistaken"},
   {fr: "une relance", en: "a reminder, a follow-up"},
   {fr: "la trésorerie", en: "cash flow"},
   {fr: "un bon de commande", en: "a purchase order"},
   {fr: "or", en: "yet, however (in an argument)"},
   {fr: "dans les meilleurs délais", en: "as soon as possible"},
   {fr: "à défaut", en: "failing that"},
   {fr: "de vive voix", en: "in person, by phone"}
  ],
  questions: [
   {q: "Quel est l'objet principal de cet e-mail ?", choices: ["Proposer une nouvelle mission", "Réclamer le paiement d'une facture en retard", "Mettre fin à la collaboration"], answer: "Réclamer le paiement d'une facture en retard", why: "Il s'agit d'une deuxième relance pour la facture n° 2024-118, impayée depuis près de deux mois."},
   {q: "Quelle raison le service comptable du client a-t-il donnée ?", choices: ["Une erreur dans le montant", "Un désaccord sur la qualité de la mission", "Un bon de commande manquant"], answer: "Un bon de commande manquant", why: "La facture serait « bloquée » en raison d'un bon de commande manquant."},
   {q: "Pourquoi Sandrine joint-elle à nouveau le bon de commande ?", choices: ["Pour montrer qu'il a déjà été envoyé et ôter tout prétexte au retard", "Parce qu'elle avait oublié de l'envoyer", "Parce que le client l'a demandé par écrit"], answer: "Pour montrer qu'il a déjà été envoyé et ôter tout prétexte au retard", why: "« Or, ce document vous a été transmis le 10 janvier » : le « or » souligne que l'excuse ne tient pas."},
   {q: "Que se passera-t-il si le paiement n'arrive pas avant le 31 mars ?", choices: ["Le cabinet appliquera des pénalités de retard", "Le cabinet portera plainte immédiatement", "Le cabinet accordera une réduction"], answer: "Le cabinet appliquera des pénalités de retard", why: "« À défaut, nous serions contraints d'appliquer les pénalités de retard prévues dans nos conditions générales. »"},
   {q: "Comment qualifier le ton de cet e-mail ?", choices: ["Agressif et menaçant", "Familier et amical", "Ferme mais courtois"], answer: "Ferme mais courtois", why: "Elle reste polie (« je comprends parfaitement », « qualité de notre collaboration ») tout en fixant une date limite et des conséquences."}
  ]
 }
]);

// ───────────── READINGS C1 ─────────────
G.readings = G.readings.concat([
 {
  id: "tribune-franglais-entreprise",
  title: "Faut-il « challenger » le franglais ?",
  cefr: "C1",
  genre: "tribune",
  text: "Faut-il « challenger » le franglais ?\n\nIl suffit de passer une journée dans un open space parisien pour s'en convaincre : la langue de Molière y est devenue une langue étrangère parmi d'autres. On ne fixe plus un objectif, on « set une target » ; on ne fait plus le point, on « fait un call » pour « s'aligner » ; et lorsqu'un projet échoue, on se garde bien de le dire : on « pivote ». À l'heure du déjeuner, un collègue vous confie qu'il est « overbooké », avant de filer à un « meeting » dont il vous fera un « debrief ASAP ».\n\nLoin de moi l'idée de jouer les gardiens du temple. Les langues vivent, empruntent, digèrent : le français a toujours puisé chez ses voisins, et l'anglais lui-même doit à notre langue une bonne part de son vocabulaire. Personne ne songe sérieusement à interdire le mot « week-end ». Le problème n'est donc pas l'emprunt en soi.\n\nLe problème, c'est ce que cet anglais d'entreprise dit de nous. Car il ne s'agit pas de l'anglais de Shakespeare, ni même de celui des Américains, qui souvent n'y comprennent rien. Il s'agit d'un sabir appauvri, fait de formules creuses, qui donne à peu de frais l'illusion de la modernité et de l'efficacité. Dire « on va challenger ce process » sonne plus dynamique que « on va remettre en question cette méthode » ; cela n'engage pourtant à rien de plus.\n\nPlus grave, ce jargon exclut. Il trace une frontière invisible entre ceux qui maîtrisent les codes et les autres : le stagiaire fraîchement débarqué, le technicien de maintenance, le client qui n'a pas fait d'école de commerce. Sous couvert d'ouverture internationale, il fonctionne comme un signe de reconnaissance tribal.\n\nAlors, que faire ? Certainement pas multiplier les circulaires ministérielles, dont l'effet sur les open spaces est à peu près nul. Simplement, peut-être, s'imposer une petite discipline : chaque fois qu'un mot anglais nous vient, se demander s'il dit quelque chose que le français ne dirait pas. Souvent, la réponse est non. Et parfois, on découvre que, derrière le mot à la mode, il n'y avait pas grand-chose à dire.\n\nBref, avant de « challenger » nos collègues, challengeons-nous nous-mêmes. Pardon : mettons-nous au défi.",
  glossary: [
   {fr: "s'en convaincre", en: "to be convinced of it"},
   {fr: "se garder bien de", en: "to take good care not to"},
   {fr: "filer", en: "to dash off"},
   {fr: "jouer les gardiens du temple", en: "to act as a guardian of orthodoxy"},
   {fr: "puiser", en: "to draw (from)"},
   {fr: "un sabir", en: "a jargon, a pidgin"},
   {fr: "creux", en: "hollow, empty"},
   {fr: "à peu de frais", en: "cheaply, with little effort"},
   {fr: "sous couvert de", en: "under the guise of"},
   {fr: "une circulaire", en: "an official memo"}
  ],
  questions: [
   {q: "Quelle est la position de l'auteur sur les emprunts à l'anglais en général ?", choices: ["Il souhaite les interdire tous", "Il pense qu'ils enrichissent toujours le français", "Il les accepte, car les langues ont toujours emprunté"], answer: "Il les accepte, car les langues ont toujours emprunté", why: "« Le problème n'est donc pas l'emprunt en soi » : il refuse de « jouer les gardiens du temple »."},
   {q: "Que reproche-t-il précisément à l'anglais d'entreprise ?", choices: ["De donner une illusion de modernité tout en étant creux et excluant", "D'être trop difficile à prononcer", "D'être réservé aux Américains"], answer: "De donner une illusion de modernité tout en étant creux et excluant", why: "Il parle d'un « sabir appauvri, fait de formules creuses » qui « exclut »."},
   {q: "Que suggère la remarque sur les Américains, « qui souvent n'y comprennent rien » ?", choices: ["Que les Américains parlent mal leur propre langue", "Que ce jargon n'a guère à voir avec un anglais authentique", "Que les Français parlent mieux anglais que les Américains"], answer: "Que ce jargon n'a guère à voir avec un anglais authentique", why: "Si même des anglophones natifs ne le comprennent pas, c'est que ce franglais est un code interne, pas de l'anglais."},
   {q: "Quel effet produit la dernière phrase (« Pardon : mettons-nous au défi ») ?", choices: ["L'auteur avoue sa préférence pour l'anglais", "L'auteur s'excuse sincèrement auprès de ses lecteurs", "L'auteur se reprend avec autodérision, appliquant sa propre recommandation"], answer: "L'auteur se reprend avec autodérision, appliquant sa propre recommandation", why: "Il « tombe » lui-même dans le travers dénoncé, puis se corrige : la chute illustre sa thèse avec humour."},
   {q: "Quelle solution l'auteur privilégie-t-il ?", choices: ["Une loi plus contraignante", "Une discipline personnelle : se demander si le mot anglais apporte vraiment quelque chose", "Des cours d'anglais obligatoires en entreprise"], answer: "Une discipline personnelle : se demander si le mot anglais apporte vraiment quelque chose", why: "Il écarte les circulaires et propose de « se demander s'il dit quelque chose que le français ne dirait pas »."}
  ]
 },
 {
  id: "critique-ete-immobile",
  title: "« L'Été immobile » : la contemplation jusqu'à l'épuisement",
  cefr: "C1",
  genre: "critique de film",
  text: "L'Été immobile, d'Étienne Vauclair ★★☆☆☆\n\nIl y a des films qui vous emportent, et d'autres qui vous demandent de faire tout le chemin à pied. L'Été immobile, présenté en compétition à Cannes et déjà salué par une partie de la critique comme « un chef-d'œuvre de l'épure », appartient résolument à la seconde catégorie.\n\nL'argument tient en une ligne : un homme d'une cinquantaine d'années revient dans la maison de son enfance, dans le Lot, après la mort de son père. Pendant deux heures et quarante minutes, il va ranger des cartons, regarder la rivière et, à deux reprises, parler à sa voisine. Il serait injuste de prétendre qu'il ne se passe rien : à la quatre-vingt-dixième minute, une chaise tombe.\n\nSoyons honnêtes : Vauclair est un véritable cinéaste. Chaque plan est composé avec un soin d'orfèvre, la lumière dorée des fins d'après-midi est filmée comme rarement, et Pierre Aubertin, dans le rôle principal, réussit l'exploit de rendre bouleversant un visage qui ne bouge presque pas. Certaines séquences, comme celle où il retrouve dans un tiroir les lettres que son père ne lui a jamais envoyées, touchent à quelque chose de profond sur le deuil et le non-dit familial. La musique, réduite à quelques notes de violoncelle, accompagne ces moments avec une pudeur remarquable.\n\nMais à force de vouloir laisser respirer chaque scène, le réalisateur finit par les asphyxier. Les silences, d'abord éloquents, deviennent pesants, puis franchement complaisants. On a parfois le sentiment que le film se regarde filmer, ravi de sa propre lenteur, comme si l'ennui du spectateur était la preuve de sa profondeur.\n\nLors de la projection de presse, plusieurs confrères ont quitté la salle avant la fin ; d'autres, plus courageux, ont tenu jusqu'au générique, accueilli par des applaudissements dont on ne saurait dire s'ils saluaient le film ou leur propre endurance.\n\nReste un objet singulier, qui trouvera sans doute son public parmi les amateurs de cinéma contemplatif. Les autres seraient bien avisés de prévoir un café. Double.",
  glossary: [
   {fr: "emporter", en: "to carry away, to sweep along"},
   {fr: "l'épure", en: "pared-back, minimalist style"},
   {fr: "l'argument (d'un film)", en: "the plot outline"},
   {fr: "à deux reprises", en: "twice"},
   {fr: "un soin d'orfèvre", en: "meticulous craftsmanship"},
   {fr: "bouleversant", en: "deeply moving"},
   {fr: "le deuil", en: "grief, mourning"},
   {fr: "le non-dit", en: "what is left unsaid"},
   {fr: "complaisant", en: "self-indulgent"},
   {fr: "un confrère", en: "a fellow professional (here, critic)"}
  ],
  questions: [
   {q: "Que sous-entend la phrase « à la quatre-vingt-dixième minute, une chaise tombe » ?", choices: ["Que le film contient une scène d'action spectaculaire", "Que ce détail est l'événement le plus marquant d'un film où il ne se passe presque rien", "Que le critique s'est endormi à ce moment-là"], answer: "Que ce détail est l'événement le plus marquant d'un film où il ne se passe presque rien", why: "Feignant de corriger l'idée qu'il « ne se passe rien », le critique souligne ironiquement l'absence d'action."},
   {q: "Le critique reconnaît-il des qualités au film ?", choices: ["Oui : la mise en scène, la lumière et le jeu de l'acteur principal", "Non, aucune", "Oui, mais uniquement le scénario"], answer: "Oui : la mise en scène, la lumière et le jeu de l'acteur principal", why: "« Soyons honnêtes : Vauclair est un véritable cinéaste » ; il salue la composition des plans, la lumière et Pierre Aubertin."},
   {q: "Que reproche principalement le critique au réalisateur ?", choices: ["Un rythme trop rapide", "Des dialogues trop nombreux", "Une lenteur complaisante, comme si l'ennui prouvait la profondeur"], answer: "Une lenteur complaisante, comme si l'ennui prouvait la profondeur", why: "Le film semble « ravi de sa propre lenteur, comme si l'ennui du spectateur était la preuve de sa profondeur »."},
   {q: "Quelle ironie contient la remarque sur les applaudissements ?", choices: ["Les spectateurs saluent peut-être surtout leur propre endurance", "Les spectateurs applaudissent pour réveiller leurs voisins", "Les applaudissements étaient enregistrés"], answer: "Les spectateurs saluent peut-être surtout leur propre endurance", why: "Le critique laisse entendre que tenir jusqu'au bout est en soi un exploit."},
   {q: "Quelle est l'intention du critique dans le dernier mot (« Double. ») ?", choices: ["Indiquer qu'il a vu le film deux fois", "Recommander un bar près du cinéma", "Conclure par une pointe d'humour sur l'ennui que provoque le film"], answer: "Conclure par une pointe d'humour sur l'ennui que provoque le film", why: "Un café ne suffira pas : il en faudra un double pour rester éveillé. La chute résume son avis."}
  ]
 },
 {
  id: "roman-diner-lambert",
  title: "Le dîner des Lambert",
  cefr: "C1",
  genre: "extrait de roman",
  text: "Chez les Lambert, on ne se disputait jamais. C'était même la fierté de la famille, que la mère rappelait volontiers aux invités, entre le fromage et le dessert : « Chez nous, voyez-vous, on se parle. » Ce qui était vrai, à condition de ne pas exiger que l'on se dise quoi que ce soit.\n\nCe dimanche-là, Claire avait décidé d'annoncer qu'elle quittait son poste à la banque pour ouvrir une librairie à Arles. Elle avait répété sa phrase dans le TGV, puis dans le taxi, puis dans l'escalier. Elle tenait en douze mots, et elle était parfaite. Elle n'avait simplement pas prévu de devoir la prononcer devant sa famille.\n\nElle attendit l'arrivée du gigot. Son père découpait la viande avec la solennité d'un chirurgien, et personne n'aurait osé parler pendant l'opération. Quand il eut posé le couteau, elle prit son souffle.\n— J'ai quelque chose à vous dire.\n— Ah ! s'exclama sa mère. Tu as rencontré quelqu'un !\n— Non, maman. Je...\n— Laisse-la parler, Hélène, intervint son père sans lever les yeux de son assiette, ce qui était sa façon de prendre parti.\n\nClaire prononça ses douze mots. Il y eut un silence, de ceux qui, dans cette famille, tenaient lieu de tempête.\n— Une librairie, répéta enfin sa mère, comme on répète le nom d'une maladie dont on n'a jamais entendu parler.\n— À Arles, précisa son frère, qui trouvait visiblement la situation délicieuse.\n— C'est très courageux, dit son père.\n\nClaire connaissait suffisamment la langue de sa famille pour savoir que « courageux » signifiait « inconscient », et que « très » aggravait considérablement la chose. Sa mère, elle, s'était levée pour aller chercher la sauce, qu'elle avait pourtant déjà apportée.\n\nLe reste du repas fut consacré aux travaux de la cuisine des voisins, à la météo du week-end et aux mérites comparés des deux pharmacies du quartier. Personne ne reparla de la librairie. Au moment du départ, pourtant, sa mère lui glissa une enveloppe dans la main. À l'intérieur, il y avait un chèque, et un mot de quatre lettres : « Vas-y. »",
  glossary: [
   {fr: "volontiers", en: "readily, willingly"},
   {fr: "le gigot", en: "leg of lamb"},
   {fr: "la solennité", en: "solemnity"},
   {fr: "prendre son souffle", en: "to take a deep breath"},
   {fr: "prendre parti", en: "to take sides"},
   {fr: "tenir lieu de", en: "to serve as, to stand in for"},
   {fr: "inconscient", en: "reckless, foolhardy"},
   {fr: "aggraver", en: "to make worse"},
   {fr: "glisser", en: "to slip (something to someone)"}
  ],
  questions: [
   {q: "Que révèle l'ironie de la phrase « à condition de ne pas exiger que l'on se dise quoi que ce soit » ?", choices: ["Que la famille est bavarde et très sincère", "Que dans cette famille, on parle beaucoup mais on évite les vrais sujets", "Que personne ne parle pendant les repas"], answer: "Que dans cette famille, on parle beaucoup mais on évite les vrais sujets", why: "La narratrice oppose « se parler » (bavarder) et « se dire quelque chose » (communiquer vraiment)."},
   {q: "Comment le père manifeste-t-il son soutien à Claire ?", choices: ["En se levant pour l'embrasser", "En contredisant son fils", "En imposant le silence à sa femme, sans lever les yeux de son assiette"], answer: "En imposant le silence à sa femme, sans lever les yeux de son assiette", why: "« Laisse-la parler, Hélène » : c'était « sa façon de prendre parti », discrète et indirecte."},
   {q: "D'après Claire, que signifie vraiment « courageux » dans la bouche de son père ?", choices: ["Inconscient", "Admirable", "Intelligent"], answer: "Inconscient", why: "« Claire connaissait suffisamment la langue de sa famille pour savoir que « courageux » signifiait « inconscient ». »"},
   {q: "Que traduit le geste de la mère qui va chercher la sauce déjà apportée ?", choices: ["Son souci de bien servir ses invités", "Son trouble et son besoin d'échapper à la conversation", "Une simple distraction due à l'âge"], answer: "Son trouble et son besoin d'échapper à la conversation", why: "Le geste inutile trahit une émotion qu'elle ne sait pas exprimer par des mots."},
   {q: "Quel est l'effet de la fin de l'extrait ?", choices: ["Elle renverse l'impression donnée jusque-là : la mère soutient en réalité sa fille", "Elle confirme l'opposition de la mère au projet", "Elle montre que Claire renonce à son projet"], answer: "Elle renverse l'impression donnée jusque-là : la mère soutient en réalité sa fille", why: "Le chèque et le « Vas-y » disent par écrit ce que la famille ne sait pas dire à voix haute."}
  ]
 }
]);

// ───────────── READINGS C2 ─────────────
G.readings = G.readings.concat([
 {
  id: "chronique-eloge-disruption",
  title: "Éloge de la disruption",
  cefr: "C2",
  genre: "chronique satirique",
  text: "Éloge de la disruption\n\nJ'ai longtemps cru que je menais une vie ordinaire. Je me levais, je prenais le métro, je travaillais, je rentrais. Grave erreur : je vivais, sans le savoir, dans un monde qui ne demandait qu'à être « disrupté ». Il a fallu qu'un jeune homme en sweat à capuche me l'explique, lors d'une soirée où je n'aurais jamais dû mettre les pieds.\n\nThibault — appelons-le ainsi, puisque c'est son nom — a vingt-six ans et une mission : « réinventer l'expérience du petit-déjeuner ». Son application, dont je tairai le nom par charité, permet de se faire livrer une tartine beurrée en moins de douze minutes. La tartine coûte sept euros ; le coursier, payé à la tâche, traverse Paris à vélo sous la pluie pour l'apporter. Thibault appelle cela « libérer du temps pour l'essentiel ». Je n'ai pas osé lui demander ce qu'était l'essentiel, de peur qu'il ne me réponde : la tartine.\n\nCe qui frappe, chez Thibault et ses semblables, c'est moins l'ambition que le vocabulaire. On ne vend plus, on « crée de la valeur » ; on ne licencie plus, on « optimise les ressources » ; on n'échoue jamais, on « apprend vite ». Sa précédente entreprise, qui proposait de louer des plantes vertes à la semaine, a englouti quatre millions d'euros avant de fermer : il en parle comme d'une « aventure incroyablement formatrice ». Les investisseurs, apparemment, partagent son enthousiasme pédagogique, puisqu'ils viennent de lui confier dix millions supplémentaires.\n\nIl serait facile de se moquer. Je m'y emploie d'ailleurs avec un certain plaisir. Mais je dois reconnaître à Thibault une qualité rare : une foi absolue, presque touchante, dans l'idée que chaque désagrément humain — attendre, marcher, se lever pour aller chercher du pain — est un problème qu'une application peut résoudre. Mon boulanger, qui se lève à quatre heures depuis trente ans, n'avait pas été informé qu'il constituait un problème. Je n'ai pas eu le cœur de le lui apprendre.\n\nEn partant, Thibault m'a tendu sa carte, sur laquelle figurait le titre de « Chief Happiness Visionary ». J'ai demandé ce que cela signifiait. Il m'a regardé avec la bienveillance qu'on réserve aux personnes âgées et aux animaux de compagnie : « C'est un état d'esprit. »\n\nJe suis rentré à pied. Cela m'a pris vingt-cinq minutes, pendant lesquelles je n'ai strictement rien optimisé. C'était, je crois, assez agréable. Mais je n'en dirai rien à Thibault : il serait capable d'en faire une application.",
  glossary: [
   {fr: "disrupter", en: "to disrupt (start-up jargon)"},
   {fr: "un sweat à capuche", en: "a hoodie"},
   {fr: "taire", en: "to keep quiet about"},
   {fr: "payé à la tâche", en: "paid per job, gig work"},
   {fr: "ses semblables", en: "people like him"},
   {fr: "engloutir", en: "to swallow up"},
   {fr: "formateur", en: "formative, educational"},
   {fr: "s'y employer", en: "to set about doing it"},
   {fr: "un désagrément", en: "an inconvenience"},
   {fr: "la bienveillance", en: "kindliness (here, condescending)"}
  ],
  questions: [
   {q: "Quel procédé l'auteur emploie-t-il dans « Thibault — appelons-le ainsi, puisque c'est son nom » ?", choices: ["Il protège réellement l'identité de Thibault", "Il détourne avec ironie la formule habituelle de l'anonymat", "Il se trompe de prénom"], answer: "Il détourne avec ironie la formule habituelle de l'anonymat", why: "La formule sert d'ordinaire à introduire un pseudonyme ; ici, elle annonce le vrai nom, ce qui crée un effet comique."},
   {q: "Que vise la remarque « de peur qu'il ne me réponde : la tartine » ?", choices: ["L'avarice de Thibault", "Le goût de l'auteur pour le petit-déjeuner", "L'absurdité d'un service futile présenté comme essentiel"], answer: "L'absurdité d'un service futile présenté comme essentiel", why: "L'auteur pousse la logique de Thibault jusqu'à l'absurde : l'« essentiel » libéré par l'application, ce serait... l'application elle-même."},
   {q: "Que dénonce l'auteur à travers le vocabulaire de Thibault (« apprendre vite », « optimiser les ressources ») ?", choices: ["Un jargon qui maquille échecs et réalités sociales en termes flatteurs", "Un manque de vocabulaire technique", "Le seul abus d'anglicismes"], answer: "Un jargon qui maquille échecs et réalités sociales en termes flatteurs", why: "Licencier devient « optimiser », échouer devient « apprendre » : l'euphémisme masque la réalité."},
   {q: "Quelle est la fonction de l'évocation du boulanger ?", choices: ["Montrer que les boulangers utilisent aussi des applications", "Opposer un travail réel et ancien à la prétention de « résoudre » ce qui ne pose pas problème", "Faire de la publicité pour une boulangerie"], answer: "Opposer un travail réel et ancien à la prétention de « résoudre » ce qui ne pose pas problème", why: "Le boulanger, levé à quatre heures depuis trente ans, incarne une réalité concrète que la start-up traite comme un « problème »."},
   {q: "Quelle est l'intention globale de l'auteur ?", choices: ["Inciter les lecteurs à investir dans les start-up", "Raconter objectivement une soirée professionnelle", "Faire la satire de la culture start-up, tout en reconnaissant à Thibault une certaine sincérité"], answer: "Faire la satire de la culture start-up, tout en reconnaissant à Thibault une certaine sincérité", why: "Il se moque ouvertement, mais concède « une foi absolue, presque touchante » : la satire reste nuancée."}
  ]
 },
 {
  id: "essai-droit-ennui",
  title: "Pour un droit à l'ennui",
  cefr: "C2",
  genre: "essai",
  text: "Pour un droit à l'ennui\n\nIl fut un temps, pas si lointain, où l'on s'ennuyait. Dans les salles d'attente, on regardait le mur ; dans le train, on regardait le paysage, ou son voisin, ce qui revenait souvent au même. L'été, les enfants traînaient leur désœuvrement d'une pièce à l'autre jusqu'à ce que, faute de mieux, ils inventent un jeu, une cabane, un royaume. L'ennui n'était pas un plaisir ; c'était un passage.\n\nCe passage, nous l'avons supprimé. Le moindre interstice de nos journées est désormais colonisé par l'écran : trente secondes devant le micro-ondes suffisent pour consulter ses messages, une minute dans l'ascenseur pour faire défiler les malheurs du monde entre deux vidéos de chats. Nous ne nous ennuyons plus jamais, et nous ne nous sommes jamais sentis aussi vides. Le paradoxe n'est qu'apparent.\n\nCar l'ennui, loin d'être le néant qu'on imagine, est une forme d'attente féconde. Pascal voyait dans l'incapacité de l'homme à « demeurer en repos dans une chambre » la source de tous ses malheurs ; il n'avait pas prévu que nous trouverions le moyen de n'être jamais seuls, même enfermés. En nous privant de ces moments creux, nous nous privons aussi de ce qui naissait en eux : la rêverie, l'idée inattendue, le dialogue silencieux avec soi-même. On n'a jamais vu une bonne idée surgir entre deux notifications.\n\nOn objectera, non sans raison, qu'il y a quelque chose de suspect dans cette nostalgie. L'éloge de l'ennui est un luxe de privilégié : l'ouvrier à la chaîne ou la caissière du samedi n'ont que faire qu'on leur vante les vertus du temps vide, eux dont le temps est saturé de contraintes. Et chaque génération a dénoncé les distractions de la suivante : le roman, puis la radio, puis la télévision furent tour à tour accusés de corrompre les esprits.\n\nSoit. Mais il y a une différence de nature entre un livre qu'on ouvre et un flux qui ne se referme jamais, conçu par des ingénieurs dont le métier consiste précisément à capter notre attention. Il ne s'agit pas de diaboliser la technique, mais de reconquérir le droit de ne rien faire, sans culpabilité ni sollicitation.\n\nJe propose donc, modestement, un exercice : la prochaine fois que vous attendrez un train, laissez votre téléphone dans votre poche. Regardez le quai, les pigeons, l'horloge qui hésite. Vous vous ennuierez. C'est précisément le but.",
  glossary: [
   {fr: "le désœuvrement", en: "idleness"},
   {fr: "faute de mieux", en: "for want of anything better"},
   {fr: "un interstice", en: "a gap, a sliver (of time)"},
   {fr: "faire défiler", en: "to scroll"},
   {fr: "fécond", en: "fruitful, fertile"},
   {fr: "demeurer en repos", en: "to remain at rest"},
   {fr: "n'avoir que faire de", en: "to have no use for"},
   {fr: "vanter", en: "to praise, to extol"},
   {fr: "tour à tour", en: "in turn"},
   {fr: "un flux", en: "a feed, a stream"},
   {fr: "capter", en: "to capture"}
  ],
  questions: [
   {q: "Que signifie l'affirmation « L'ennui n'était pas un plaisir ; c'était un passage » ?", choices: ["L'ennui était une étape vers le sommeil", "L'ennui conduisait vers l'invention et l'imaginaire", "L'ennui ne durait jamais longtemps"], answer: "L'ennui conduisait vers l'invention et l'imaginaire", why: "Les enfants, « faute de mieux », finissaient par inventer « un jeu, une cabane, un royaume »."},
   {q: "Comment l'auteur résout-il le paradoxe « nous ne nous ennuyons plus jamais, et nous ne nous sommes jamais sentis aussi vides » ?", choices: ["En supprimant l'ennui, nous avons perdu ce qu'il faisait naître : rêverie, idées, dialogue intérieur", "Les écrans nous rendent en réalité plus heureux", "Le vide vient d'un manque de divertissements"], answer: "En supprimant l'ennui, nous avons perdu ce qu'il faisait naître : rêverie, idées, dialogue intérieur", why: "« En nous privant de ces moments creux, nous nous privons aussi de ce qui naissait en eux. »"},
   {q: "Dans quel but l'auteur cite-t-il Pascal ?", choices: ["Pour réfuter entièrement la pensée de Pascal", "Pour prouver que Pascal connaissait déjà les écrans", "Pour s'appuyer sur une autorité tout en montrant que notre situation dépasse ce qu'il imaginait"], answer: "Pour s'appuyer sur une autorité tout en montrant que notre situation dépasse ce qu'il imaginait", why: "Pascal redoutait l'incapacité à rester seul ; nous avons trouvé le moyen de « n'être jamais seuls, même enfermés »."},
   {q: "Quelle est la fonction du quatrième paragraphe (« On objectera... ») ?", choices: ["Abandonner la thèse principale", "Anticiper et reconnaître des objections avant d'y répondre", "Changer complètement de sujet"], answer: "Anticiper et reconnaître des objections avant d'y répondre", why: "L'auteur concède (« non sans raison ») avant de répliquer par « Soit. Mais... » : c'est la structure classique de la concession."},
   {q: "Quel est le ton de la conclusion (« C'est précisément le but ») ?", choices: ["Ironique et faussement modeste, mais sincère sur le fond", "Agressif et moralisateur", "Désespéré et résigné"], answer: "Ironique et faussement modeste, mais sincère sur le fond", why: "Le « modestement » et la chute paradoxale font sourire, mais l'invitation à s'ennuyer est réelle."}
  ]
 },
 {
  id: "lettre-demission-ironique",
  title: "Lettre de démission",
  cefr: "C2",
  genre: "lettre de démission",
  text: "Objet : Démission\n\nMadame la Directrice générale,\n\nC'est avec une émotion que vous me pardonnerez de ne pas dissimuler que je vous adresse aujourd'hui ma démission, après sept années passées au sein de notre belle maison.\n\nJe tiens d'abord à vous remercier. Grâce à vous, j'ai énormément appris. J'ai appris, par exemple, qu'une « réorganisation ambitieuse » pouvait désigner le départ de quarante collègues, et qu'un « séminaire de cohésion » à Deauville était parfaitement compatible avec le gel des salaires annoncé la semaine précédente. J'ai appris que la porte de votre bureau était « toujours ouverte », ce que j'ai pu vérifier à de nombreuses reprises : elle l'était en effet, sur un bureau vide.\n\nJ'ai appris aussi la valeur des mots. Lorsque, il y a deux ans, j'ai sollicité une évolution de poste, vous m'avez répondu que j'étais « indispensable là où j'étais ». J'y ai d'abord vu un compliment. J'ai mis un certain temps à comprendre qu'il s'agissait d'une condamnation.\n\nJ'ai appris, enfin, l'art de la réunion. Je sais désormais qu'une décision prise en comité restreint le lundi peut être soumise « à la concertation » le mardi, puis présentée comme « co-construite avec les équipes » le mercredi. Ce talent pour réécrire le passé en temps réel force, je l'avoue, une certaine admiration.\n\nQue l'on ne s'y trompe pas : je ne pars pas fâché. Je pars, comme on dit dans nos présentations, « aligné avec mes valeurs ». Il se trouve simplement que celles-ci ont fini par diverger des nôtres — pardon, des vôtres ; sept ans de communication interne laissent des traces.\n\nJe rejoins une structure plus modeste, où l'on m'a promis moins de moyens, moins de prestige et moins de petits-déjeuners d'équipe. On m'y a promis, en revanche, que les décisions seraient expliquées avant d'être annoncées dans la presse. C'est une originalité à laquelle j'ai décidé de laisser sa chance.\n\nConformément à mon contrat, j'effectuerai un préavis de trois mois, durant lequel je m'attacherai à transmettre mes dossiers dans les meilleures conditions. Mon successeur trouvera sur le serveur partagé l'ensemble de mes notes, classées avec un soin que personne, je le crains, ne remarquera. Je les ai même datées, par un ultime excès de zèle.\n\nJe vous prie d'agréer, Madame la Directrice générale, l'expression de ma considération distinguée, que sept années n'ont pas tout à fait réussi à entamer.\n\nAntoine Delorme\nResponsable des études, pour encore quatre-vingt-dix jours",
  glossary: [
   {fr: "dissimuler", en: "to hide, to conceal"},
   {fr: "au sein de", en: "within"},
   {fr: "le gel des salaires", en: "a pay freeze"},
   {fr: "à de nombreuses reprises", en: "on many occasions"},
   {fr: "solliciter", en: "to request"},
   {fr: "que l'on ne s'y trompe pas", en: "make no mistake"},
   {fr: "diverger", en: "to diverge"},
   {fr: "le préavis", en: "the notice period"},
   {fr: "s'attacher à", en: "to make a point of"},
   {fr: "entamer", en: "to erode, to dent"}
  ],
  questions: [
   {q: "Quel procédé domine dans les remerciements du deuxième paragraphe ?", choices: ["Une gratitude sincère et sans arrière-pensée", "L'antiphrase : l'auteur feint la gratitude pour mieux dénoncer", "Une description neutre de l'entreprise"], answer: "L'antiphrase : l'auteur feint la gratitude pour mieux dénoncer", why: "Chaque « j'ai appris » introduit en réalité une critique : licenciements maquillés, séminaire indécent, directrice absente."},
   {q: "Que révèle l'anecdote de la porte « toujours ouverte » ?", choices: ["Que le bureau de la directrice n'avait pas de porte", "Que la directrice était très disponible", "Que la directrice n'était en réalité jamais là"], answer: "Que la directrice n'était en réalité jamais là", why: "La porte était bien ouverte... « sur un bureau vide » : la formule managériale est prise au pied de la lettre."},
   {q: "Pourquoi l'auteur voit-il finalement une condamnation dans « indispensable là où j'étais » ?", choices: ["Parce que la formule servait à lui refuser toute évolution", "Parce qu'il allait être licencié", "Parce qu'on lui reprochait la qualité de son travail"], answer: "Parce que la formule servait à lui refuser toute évolution", why: "Être « indispensable là où l'on est », c'est être condamné à y rester : le compliment apparent bloquait sa progression."},
   {q: "Quel est l'effet du lapsus « des nôtres — pardon, des vôtres » ?", choices: ["Il trahit une hésitation sur sa décision de partir", "Il montre avec ironie combien le discours d'entreprise l'a imprégné, tout en marquant la rupture", "C'est une simple faute de frappe"], answer: "Il montre avec ironie combien le discours d'entreprise l'a imprégné, tout en marquant la rupture", why: "Il explique lui-même : « sept ans de communication interne laissent des traces » ; la correction souligne qu'il ne s'identifie plus à l'entreprise."},
   {q: "Que suggère la signature « pour encore quatre-vingt-dix jours » ?", choices: ["Qu'il espère être réembauché", "Qu'il prendra quatre-vingt-dix jours de vacances", "Une impatience ironique de voir s'achever son préavis"], answer: "Une impatience ironique de voir s'achever son préavis", why: "Il compte les jours : la précision, faussement administrative, est une dernière pique."}
  ]
 }
]);

// ───────────── DEFINITIONS ─────────────
G.definitions = G.definitions.concat([
 // A2
 {word: "le bouquin", def: "Mot familier pour désigner un livre.", en: "book (informal)", cefr: "A2"},
 {word: "la rentrée", def: "Moment de septembre où les élèves retournent à l'école et où chacun reprend le travail après les vacances d'été.", en: "back to school, return after the summer break", cefr: "A2"},
 {word: "le boulot", def: "Mot familier pour parler du travail ou de l'emploi.", en: "job, work (informal)", cefr: "A2"},
 {word: "le goûter", def: "Petit repas, souvent sucré, que l'on prend vers 16 heures, surtout les enfants.", en: "afternoon snack", cefr: "A2"},
 {word: "la bise", def: "Petit baiser sur la joue qu'on se fait pour se dire bonjour ou au revoir.", en: "peck on the cheek (greeting)", cefr: "A2"},
 {word: "le ticket de caisse", def: "Petit papier que le magasin donne après un achat, avec la liste des articles et le prix payé.", en: "receipt", cefr: "A2"},
 {word: "le colis", def: "Paquet que l'on envoie ou que l'on reçoit par la poste.", en: "parcel", cefr: "A2"},
 {word: "le quartier", def: "Partie d'une ville où l'on habite, avec ses rues, ses commerces et ses habitants.", en: "neighbourhood", cefr: "A2"},
 {word: "la poubelle", def: "Récipient dans lequel on jette les déchets.", en: "bin, trash can", cefr: "A2"},
 {word: "la facture", def: "Document qui indique la somme à payer pour un service ou un achat.", en: "bill, invoice", cefr: "A2"},
 {word: "l'ascenseur", def: "Appareil qui transporte les personnes d'un étage à l'autre dans un immeuble.", en: "lift, elevator", cefr: "A2"},
 {word: "les soldes", def: "Période de l'année où les magasins vendent leurs articles moins cher.", en: "the sales", cefr: "A2"},
 {word: "le pressing", def: "Magasin où l'on fait nettoyer les vêtements délicats, comme les costumes ou les manteaux.", en: "dry cleaner's", cefr: "A2"},
 {word: "le jour férié", def: "Jour de fête officielle où la plupart des gens ne travaillent pas, comme le 14 Juillet.", en: "public holiday", cefr: "A2"},
 {word: "le pote", def: "Mot familier pour désigner un ami, un copain.", en: "mate, buddy", cefr: "A2"},
 // B1
 {word: "le devis", def: "Document qui détaille à l'avance le prix d'un travail, avant qu'on accepte de le faire réaliser.", en: "quote, estimate", cefr: "B1"},
 {word: "le préavis", def: "Délai obligatoire entre l'annonce d'un départ (d'un logement, d'un emploi) et le départ réel.", en: "notice period", cefr: "B1"},
 {word: "la mutuelle", def: "Assurance santé complémentaire qui rembourse ce que la Sécurité sociale ne prend pas en charge.", en: "top-up health insurance", cefr: "B1"},
 {word: "le pot de départ", def: "Petite fête organisée au travail, avec des boissons et des gâteaux, quand un collègue quitte l'entreprise.", en: "leaving drinks", cefr: "B1"},
 {word: "la carte Vitale", def: "Carte verte à puce qui permet d'être remboursé de ses frais médicaux en France.", en: "French health insurance card", cefr: "B1"},
 {word: "l'ordonnance", def: "Papier sur lequel le médecin écrit les médicaments à acheter à la pharmacie.", en: "prescription", cefr: "B1"},
 {word: "le RIB", def: "Document qui indique les coordonnées d'un compte bancaire, demandé pour recevoir un salaire ou un virement.", en: "bank details slip", cefr: "B1"},
 {word: "la caution", def: "Somme versée au propriétaire à l'entrée dans un logement et rendue au départ si tout est en bon état.", en: "deposit", cefr: "B1"},
 {word: "le covoiturage", def: "Fait de partager une voiture avec d'autres personnes qui font le même trajet, pour diviser les frais.", en: "carpooling", cefr: "B1"},
 {word: "le stagiaire", def: "Étudiant qui travaille quelque temps dans une entreprise pour apprendre un métier.", en: "intern, trainee", cefr: "B1"},
 {word: "la canicule", def: "Période de très forte chaleur qui dure plusieurs jours.", en: "heatwave", cefr: "B1"},
 {word: "faire le pont", def: "Ne pas travailler le jour situé entre un jour férié et le week-end, pour profiter d'un long congé.", en: "to take a long weekend (bridging a holiday)", cefr: "B1"},
 {word: "bosser", def: "Verbe familier qui signifie travailler.", en: "to work (informal)", cefr: "B1"},
 {word: "la cantine", def: "Restaurant d'une école ou d'une entreprise où l'on déjeune à petit prix.", en: "canteen", cefr: "B1"},
 {word: "se débrouiller", def: "Réussir à se sortir seul d'une situation, avec les moyens dont on dispose.", en: "to manage, to get by", cefr: "B1"},
 {word: "le découvert", def: "Situation d'un compte bancaire sur lequel on a dépensé plus d'argent qu'il n'en contenait.", en: "overdraft", cefr: "B1"},
 {word: "les RTT", def: "Jours de congé supplémentaires accordés aux salariés qui travaillent plus de 35 heures par semaine.", en: "extra days off (reduced working time)", cefr: "B1"},
 {word: "l'arrêt maladie", def: "Période pendant laquelle un médecin autorise un salarié malade à ne pas travailler.", en: "sick leave", cefr: "B1"},
 {word: "la fiche de paie", def: "Document remis chaque mois par l'employeur, qui détaille le salaire brut, les cotisations et le salaire net.", en: "payslip", cefr: "B1"},
 {word: "le CDI", def: "Contrat de travail sans date de fin, considéré comme le plus stable en France.", en: "permanent contract", cefr: "B1"},
 // B2
 {word: "le syndic", def: "Professionnel chargé de gérer un immeuble en copropriété : entretien, charges, assemblées générales.", en: "building manager (co-owned property)", cefr: "B2"},
 {word: "l'état des lieux", def: "Document qui décrit l'état d'un logement à l'arrivée puis au départ d'un locataire.", en: "check-in / check-out inventory", cefr: "B2"},
 {word: "la rupture conventionnelle", def: "Fin d'un contrat de travail décidée d'un commun accord entre le salarié et l'employeur.", en: "mutually agreed termination", cefr: "B2"},
 {word: "le télétravail", def: "Fait de travailler depuis chez soi, à distance, grâce aux outils numériques.", en: "remote work", cefr: "B2"},
 {word: "la prime", def: "Somme d'argent versée en plus du salaire, par exemple pour récompenser de bons résultats.", en: "bonus", cefr: "B2"},
 {word: "le chiffre d'affaires", def: "Montant total des ventes réalisées par une entreprise sur une période donnée.", en: "turnover, revenue", cefr: "B2"},
 {word: "galérer", def: "Familier : avoir beaucoup de mal à faire quelque chose, enchaîner les difficultés.", en: "to struggle (informal)", cefr: "B2"},
 {word: "se faire avoir", def: "Familier : être trompé, se laisser duper, souvent en payant trop cher.", en: "to be had, to get ripped off", cefr: "B2"},
 {word: "le bouche-à-oreille", def: "Transmission orale d'une information ou d'une recommandation, de personne à personne.", en: "word of mouth", cefr: "B2"},
 {word: "le réseautage", def: "Fait de développer ses contacts professionnels pour se créer des opportunités.", en: "networking", cefr: "B2"},
 {word: "la charge mentale", def: "Poids psychologique lié au fait de devoir penser en permanence à l'organisation des tâches, notamment domestiques.", en: "mental load", cefr: "B2"},
 {word: "le prélèvement à la source", def: "Système dans lequel l'impôt sur le revenu est retenu directement chaque mois sur le salaire.", en: "pay-as-you-earn tax withholding", cefr: "B2"},
 {word: "relancer", def: "Contacter de nouveau quelqu'un qui n'a pas répondu, pour lui rappeler une demande.", en: "to follow up, to chase", cefr: "B2"},
 {word: "le livrable", def: "Dans un projet, document ou produit fini que l'on doit remettre au client à une date fixée.", en: "deliverable", cefr: "B2"},
 {word: "prendre du recul", def: "S'éloigner mentalement d'une situation pour la juger plus calmement et plus objectivement.", en: "to step back", cefr: "B2"},
 {word: "se planter", def: "Familier : se tromper, échouer.", en: "to mess up, to fail (informal)", cefr: "B2"},
 {word: "la boîte", def: "Familier : l'entreprise où l'on travaille.", en: "company, firm (informal)", cefr: "B2"},
 {word: "le coup de main", def: "Aide rapide et ponctuelle qu'on apporte à quelqu'un.", en: "a helping hand", cefr: "B2"},
 {word: "la visio", def: "Abréviation courante de visioconférence : réunion à distance, par écrans interposés.", en: "video call", cefr: "B2"},
 {word: "l'imprévu", def: "Événement inattendu qui oblige à modifier ses projets.", en: "something unexpected, a hitch", cefr: "B2"},
 // C1
 {word: "le non-dit", def: "Ce qu'on ne dit pas ouvertement mais que chacun sent ou devine, souvent source de tensions.", en: "the unspoken", cefr: "C1"},
 {word: "ménager la chèvre et le chou", def: "Chercher à ne mécontenter aucune de deux parties opposées, quitte à ne jamais trancher.", en: "to sit on the fence, to keep both sides happy", cefr: "C1"},
 {word: "le copinage", def: "Fait de favoriser ses amis, par exemple pour un poste, au détriment du mérite.", en: "cronyism", cefr: "C1"},
 {word: "la frilosité", def: "Prudence excessive, peur de prendre des risques ou d'innover.", en: "excessive caution", cefr: "C1"},
 {word: "botter en touche", def: "Esquiver une question embarrassante en répondant à côté.", en: "to dodge the question", cefr: "C1"},
 {word: "l'aplomb", def: "Assurance, voire audace, avec laquelle on parle ou agit, même dans une situation délicate.", en: "nerve, self-assurance", cefr: "C1"},
 {word: "le tollé", def: "Vague de protestations indignées et collectives.", en: "outcry", cefr: "C1"},
 {word: "se dédouaner", def: "Se décharger d'une responsabilité, se présenter comme non coupable.", en: "to clear oneself, to shift the blame", cefr: "C1"},
 {word: "l'engouement", def: "Enthousiasme soudain et souvent passager pour une personne, une mode ou une idée.", en: "craze, infatuation", cefr: "C1"},
 {word: "la mainmise", def: "Contrôle total, souvent abusif, exercé sur quelque chose ou sur quelqu'un.", en: "stranglehold, grip", cefr: "C1"},
 {word: "le coup de gueule", def: "Familier : explosion de colère ou protestation exprimée avec force.", en: "rant, angry outburst", cefr: "C1"},
 {word: "être à la ramasse", def: "Familier : être en retard, dépassé ou peu efficace par rapport aux autres.", en: "to be lagging behind, out of it", cefr: "C1"},
 {word: "la poudre aux yeux", def: "Ce qui sert à impressionner ou à tromper par une apparence flatteuse mais sans substance.", en: "window dressing, smoke and mirrors", cefr: "C1"},
 {word: "se défiler", def: "Se dérober au dernier moment à une obligation ou à une responsabilité.", en: "to wriggle out of something", cefr: "C1"},
 {word: "la surenchère", def: "Fait d'aller toujours plus loin que l'autre, dans les promesses, les propos ou les prix.", en: "one-upmanship, escalation", cefr: "C1"},
 // C2
 {word: "la gabegie", def: "Gaspillage désordonné de l'argent ou des ressources, dû à une mauvaise gestion.", en: "waste, mismanagement", cefr: "C2"},
 {word: "l'atermoiement", def: "Fait de remettre sans cesse une décision à plus tard, par hésitation ou par calcul.", en: "dithering, procrastination", cefr: "C2"},
 {word: "l'outrecuidance", def: "Confiance en soi excessive qui conduit à l'impertinence et à l'arrogance.", en: "presumptuousness, arrogance", cefr: "C2"},
 {word: "la componction", def: "Gravité affectée, air de sérieux exagéré et quelque peu hypocrite.", en: "affected solemnity", cefr: "C2"},
 {word: "la palinodie", def: "Changement d'opinion complet et souvent opportuniste ; revirement.", en: "about-turn, recantation", cefr: "C2"},
 {word: "l'entregent", def: "Habileté à se faire des relations utiles et à savoir en tirer parti.", en: "social savvy, knack for connections", cefr: "C2"},
 {word: "la forfanterie", def: "Vantardise ; tendance à exagérer ses mérites ou ses exploits.", en: "bragging, boastfulness", cefr: "C2"},
 {word: "la goujaterie", def: "Manque grossier de délicatesse ou de politesse, en particulier envers les femmes.", en: "boorishness, caddishness", cefr: "C2"},
 {word: "se gausser", def: "Se moquer ouvertement de quelqu'un ou de quelque chose.", en: "to mock, to scoff at", cefr: "C2"},
 {word: "l'antienne", def: "Discours ou argument répété sans cesse, au point de lasser.", en: "the same old refrain", cefr: "C2"}
]);

})();
