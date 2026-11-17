// =============================================================================
// LA VOIE DU NATIF — 6 extra worlds (47–52) of real, spoken, everyday French.
// The course teaches correct French; these worlds teach how French people
// actually talk, react, joke and think. Each world unlocks by level (not by
// finishing the whole campaign), and ▶ Continuer mixes its stages in.
// Format per stage: cards [fr, en, note], drills [prompt with ___, answer, [wrong options], explanation]
// =============================================================================
// Reusable world builder: turns compact world specs into full lessons/stages.
// Stage spec: { title, lesson?: [bullets], cards: [[fr,en,note]] or [{fr,en,note}],
//               drills: [[prompt, answer, [wrong], expl]] or [{prompt, clozeAnswer, choices, explanation}] }
window.ODYSSEE_BUILD_WORLDS = function (list) {
  const DATA = window.ALEXA_COURSE_DATA;
  if (!DATA || !Array.isArray(DATA.lessons) || !Array.isArray(list)) return;
  const allCards = [];
  list.forEach(w => {
    if (DATA.lessons.some(l => l.number === w.number)) return;
    const lessonId = `World_${w.number}`;
    const source = `World ${w.number}: ${w.title}`;
    const mkCard = (c) => {
      const [fr, en, note] = Array.isArray(c) ? c : [c.fr, c.en, c.note];
      return { fr, en, note: note || "", source, cefr: w.cefr, lessonId, native: true };
    };
    const mkDrill = (d) => {
      let prompt, answer, wrong, explanation;
      if (Array.isArray(d)) { [prompt, answer, wrong, explanation] = d; }
      else {
        prompt = d.prompt; answer = d.clozeAnswer || d.answer;
        wrong = (d.choices || []).filter(c => c !== answer); explanation = d.explanation;
      }
      const opts = [answer, ...(wrong || [])];
      const rot = (prompt.length + answer.length) % opts.length;
      return {
        type: "cloze",
        instruction: w.drillInstruction || "Complete like a native:",
        prompt,
        clozeAnswer: answer,
        answer: /_{2,}/.test(prompt) ? prompt.replace(/_{2,}/, answer) : answer,
        choices: opts.slice(rot).concat(opts.slice(0, rot)),
        explanation: explanation || "",
        source, cefr: w.cefr, lessonId
      };
    };
    const mkSections = (s) => {
      const out = [];
      if (s.goal) out.push({ title: "Objectifs de la leçon", body: s.goal });
      if (Array.isArray(s.lesson) && s.lesson.length) {
        // one bullet per line keeps bites short; examples become tappable French
        out.push({ title: "Le secret", body: s.lesson.map(x => `• ${x}`).join("\n") });
      }
      if (Array.isArray(s.lesson) && s.lesson.length && Array.isArray(s.cards) && s.cards.length) {
        out.push({ title: "Les exemples", body: s.cards.map(c => { const [fr, en] = Array.isArray(c) ? c : [c.fr, c.en]; return `• ${fr} - ${en}`; }).join("\n") });
      }
      return out;
    };
    const stages = w.stages.map((s, i) => ({
      stageId: `${w.number}-${i + 1}`,
      stageCode: `${w.number}-${i + 1}`,
      title: s.title,
      type: "core",
      cefr: s.cefr || w.cefr,
      audioUrl: "",
      sections: mkSections(s),
      cards: s.cards.map(mkCard),
      drills: s.drills.map(mkDrill)
    }));
    const bossCards = [];
    const bossDrills = [];
    stages.forEach(st => { bossCards.push(...st.cards.slice(0, 3)); bossDrills.push(st.drills[0]); });
    stages.push({
      stageId: `${w.number}-${stages.length + 1}`,
      stageCode: `${w.number}-BOSS`,
      title: `Guardian Boss: ${w.title}`,
      type: "boss",
      cefr: w.cefr,
      audioUrl: "",
      sections: [],
      cards: bossCards,
      drills: bossDrills
    });
    stages.forEach(st => allCards.push(...(st.type === "boss" ? [] : st.cards)));
    DATA.lessons.push({
      id: lessonId,
      number: w.number,
      title: w.title,
      cefr: w.cefr,
      audioUrl: "",
      sections: [],
      vocabCount: stages.reduce((n, st) => n + (st.type === "boss" ? 0 : st.cards.length), 0),
      drillCount: stages.reduce((n, st) => n + (st.type === "boss" ? 0 : st.drills.length), 0),
      drills: [],
      exercises: [],
      supplementary: [],
      stages,
      native: true,
      region: w.region || "native",
      unlockCefr: w.unlockCefr,
      blurb: w.blurb
    });
  });
  DATA.lessons.sort((x, y) => x.number - y.number);
  DATA.flashcards.push(...allCards);
};

(function () {
  const DATA = window.ALEXA_COURSE_DATA;
  if (!DATA || !Array.isArray(DATA.lessons)) return;

  // Small data fix: World 14 had no real title.
  const w14 = DATA.lessons.find(l => l.number === 14);
  if (w14 && /^World 14$/.test(w14.title)) {
    w14.title = "Possessive & demonstrative adjectives";
    (w14.stages || []).forEach(s => {
      if (s.title === "World 14 (Core Foundation)") s.title = "Mon, ton, son & ce, cette (Core Foundation)";
      if (s.title === "Guardian Boss: Master of World 14") s.title = "Guardian Boss: Master of Possessives";
    });
  }

  if (DATA.lessons.some(l => l.number === 47)) return; // already added

  const NATIVE_LESSONS = {
    "Les petits mots : du coup, en fait, bref": ["Fillers make you sound native and buy you thinking time: euh, ben, bah, bon, alors.", "du coup = so / as a result (very frequent, even overused). en fait = actually. bref = anyway, to cut a long story short.", "quoi at the end of a sentence adds emphasis: C'était nul, quoi. genre = like (young, casual)."],
    "Les questions de la rue": ["Spoken French asks questions by intonation alone: Tu viens ? (voice goes up).", "The question word often goes at the end: Tu fais quoi ? Il est où ? C'est qui ? Ça coûte combien ?", "Inversion (Où vas-tu ?) is written or formal. Est-ce que is the neutral middle ground."],
    "Surprise & intérêt": ["Show you are listening: Ah bon ? Sérieux ? C'est vrai ? Non !", "Strong surprise: C'est pas vrai ! J'y crois pas ! Incroyable !", "Keep the conversation going with: Et alors ? Et après ? Raconte !"],
    "D'accord, pas d'accord": ["Agree: Carrément ! Grave ! (young) Tout à fait. (neutral/formal) Exactement.", "Disagree softly: Pas vraiment… Je suis pas sûr. Bof. Ça dépend.", "Disagree firmly but politely: Je ne suis pas du tout d'accord. Là, je ne te suis pas."],
    "Rassurer & encourager": ["Reassure: T'inquiète (pas). C'est pas grave. Ça va aller.", "Encourage: Courage ! Vas-y ! Tu vas y arriver ! Bon courage pour demain !", "'Bon courage' is said to anyone facing work or a hard task, not just in a crisis."],
    "Politesse & excuses naturelles": ["Natural apologies: Pardon (bumping into someone, getting attention), Désolé(e) (real regret), Excusez-moi (formal attention).", "Answer thanks with: De rien, Avec plaisir, Je t'en prie / Je vous en prie.", "Always say Bonjour when you walk into a shop. Not saying it is genuinely rude in France."],
    "Les émotions du quotidien": ["J'en ai marre = I'm fed up. Je suis crevé(e) = I'm exhausted. Ça m'énerve = it annoys me.", "Positive: Je suis trop content(e) ! Ça me fait plaisir. Je kiffe (casual).", "Use avoir for physical states: avoir faim, soif, chaud, froid, peur, la flemme (can't be bothered)."],
    "La bise & les salutations": ["La bise = cheek kisses between friends and family. Usually 2 in Paris, 3 or 4 in some regions. Follow the other person.", "At work: handshake at first, la bise later among close colleagues (less common since 2020).", "Salut = hi AND bye (casual). Bonne journée / Bonne soirée when leaving. À plus (tard), À tout à l'heure, À demain."],
    "À table": ["Wait for 'Bon appétit !' before eating. Keep both hands visible on the table, not on your lap.", "Bread goes on the table, not on the plate. Saying 'Je suis plein(e)' sounds odd: say 'J'ai bien mangé' or 'Je n'ai plus faim'.", "L'apéro before dinner is sacred: drinks and nibbles, Santé ! while looking people in the eyes."],
    "Le travail & la paperasse": ["La paperasse = paperwork (France loves it). Un dossier = a file/application. Une attestation = a certificate.", "Work talk: un CDI (permanent contract), un CDD (fixed-term), les RTT (extra days off), la pause déj.", "Email formulas: Bonjour Madame X, … Cordialement. Never just 'Salut' to someone you don't know."],
    "Les références de tout le monde": ["Shared references show you belong: Astérix, Le Petit Prince, Les Bronzés, Intouchables, Kaamelott.", "Quotes people drop: « On n'est pas bien là ? » (Les Bronzés), « C'est pas faux » (Kaamelott).", "Learn a few songs everyone knows: La Vie en rose, Ne me quitte pas, Alors on danse."],
    "Tu ou vous ?": ["Vous: strangers, shopkeepers, elders, your boss (at first), any formal situation.", "Tu: friends, family, children, colleagues of your age (often fast), anyone who says 'On se tutoie ?'.", "When in doubt use vous. Switching to tu too early can feel disrespectful; staying on vous too long can feel cold."],
    "L'argot de tous les jours": ["Everyday slang (argot) used by almost everyone: un mec (guy), une meuf (girl, young), le boulot (job), la bouffe (food), le fric/la thune (money).", "Bosser = to work, bouffer = to eat, se casser = to leave, piger = to get it.", "Fine with friends, avoid it in interviews, emails and with strangers."],
    "Le verlan (l'envers)": ["Verlan reverses syllables: l'envers → vers-l'en → verlan. Fou → ouf, louche → chelou, lourd → relou.", "Some verlan words are now mainstream: ouf (C'est ouf !), chelou, relou, une meuf (femme), un keum (mec).", "Recognising verlan matters more than producing it; using it wrongly sounds forced."],
    "Kiffer, galérer & co": ["kiffer = to love/enjoy (Je kiffe ce son). galérer = to struggle (J'ai galéré pour trouver).", "C'est la galère = it's a nightmare/hassle. Avoir la flemme = can't be bothered.", "Grave = totally (casual): Je suis grave d'accord. Trop = so/very: C'est trop bien."],
    "Les intensifs": ["Very: très (neutral), trop (casual, positive or negative), vachement (casual), super (casual).", "Strong: complètement, carrément, hyper, méga (young), de ouf (very young): un film de ouf.", "Formal writing prefers: particulièrement, extrêmement, fort (literary: fort intéressant)."],
    "Registres : quand ne pas le dire": ["Three registers: familier (friends), courant (everyday standard), soutenu (formal/literary).", "Same idea, three levels: bouffer / manger / se restaurer; bagnole / voiture / véhicule; se barrer / partir / s'en aller.", "Swear words like putain or merde are very common but strong. Know them to understand; use them only with close friends."],
    "Le corps": ["Body idioms: avoir le cœur sur la main (be generous), coûter les yeux de la tête (cost a fortune).", "Casser les pieds à quelqu'un = to annoy. Avoir un poil dans la main = to be lazy.", "Mettre les pieds dans le plat = to put your foot in it. Se mettre le doigt dans l'œil = to be totally wrong."],
    "La nourriture": ["Food idioms are everywhere: C'est la fin des haricots (all is lost), raconter des salades (to tell lies).", "Avoir la pêche / la banane = to be full of energy / smiling. Tomber dans les pommes = to faint.", "Ce n'est pas ma tasse de thé (borrowed from English), mettre du beurre dans les épinards (to earn some extra money)."],
    "Les animaux": ["Avoir un chat dans la gorge = to have a frog in your throat. Poser un lapin = to stand someone up.", "Il fait un froid de canard = it's freezing. Avoir une faim de loup = to be starving.", "Quand les poules auront des dents = when pigs fly. Myope comme une taupe = blind as a bat."],
    "La vie quotidienne": ["Daily-life idioms: Ce n'est pas la mer à boire (it's not that hard), il pleut des cordes (it's pouring).", "Faire la grasse matinée = to sleep in. Passer une nuit blanche = to pull an all-nighter.", "Avoir du pain sur la planche = to have a lot of work to do. Ça ne casse pas trois pattes à un canard = nothing special."],
    "Argumenter avec des images": ["Imagery makes arguments vivid: C'est l'arbre qui cache la forêt (missing the big picture).", "Mettre la charrue avant les bœufs = to put the cart before the horse. Jeter le bébé avec l'eau du bain.", "Use them sparingly in speech; in a DALF essay, one well-placed image is impressive, five is too many."],
    "Le monologue intérieur": ["Thinking in French starts with narrating your own day: Bon, qu'est-ce que je fais maintenant ?", "Use short inner phrases: Allez ! Mince, j'ai oublié… Bon, on verra. Voyons voir…", "Every time you catch an English thought, say it again in simple French, even imperfectly."],
    "Raconter ce qu'on fait, en direct": ["Describe actions as you do them: Je me lève, je prends un café, je sors.", "Être en train de + infinitive = to be in the middle of: Je suis en train de cuisiner.", "Aller + infinitive for the next step: Je vais appeler ma mère. Venir de + infinitive for what just happened: Je viens de finir."],
    "Nuancer sa pensée": ["Natives soften opinions: Il me semble que… J'ai l'impression que… Disons que…", "Concede before disagreeing: Certes…, mais… / Je comprends, cela dit… / Tu n'as pas tort, mais…", "Precise hedges: plutôt (rather), pas forcément (not necessarily), dans une certaine mesure (to some extent)."],
    "Les connecteurs du natif": ["Spoken connectors: d'ailleurs (by the way/besides), par contre (on the other hand), sinon (otherwise/changing topic).", "en gros (basically), autrement dit (in other words), au fait (by the way, new topic), ceci dit (that said).", "quand même adds insistence: C'est quand même cher ! = It's really rather expensive!"],
    "Penser sans traduire : expliquer en français": ["When you lack a word, explain it in French: c'est un truc qui sert à…, c'est quelqu'un qui…, c'est le contraire de…", "This 'circumlocution' is a real exam skill and keeps you thinking in French.", "Ask for the word: Comment on dit… ? Ça s'appelle comment, déjà ? C'est quoi le mot pour… ?"],
    "Le « ne » qui disparaît": ["In everyday speech the 'ne' of a negation almost always disappears: Je sais pas, C'est pas grave.", "Writing, exams and formal speech keep it: Je ne sais pas.", "Rule of thumb: drop it with friends, keep it in emails, interviews and essays."],
    "Les mots qui fondent (t'as, t'es, y a)": ["Short words melt together at speed: tu as → t'as, tu es → t'es, il y a → y a, il faut → faut.", "Je suis sounds like 'chuis', je sais pas like 'chais pas'.", "Hearing these is essential for films and real conversations; writing them is only for texts and dialogue."],
    "« On » à la place de « nous »": ["In speech, French people use 'on' instead of 'nous' about 90% of the time: On y va ? = Shall we go?", "'On' takes the il/elle verb form: on est, on a, on fait.", "Adjectives can still agree with the real group: On est contents."]
  };

  const NATIVE = [
    {
      number: 47, cefr: "A2", unlockCefr: "A2", title: "Le français parlé : comme on le dit vraiment",
      blurb: "Spoken French drops 'ne', squashes words together and uses 'on'. Learn to hear and say it.",
      stages: [
        { title: "Le « ne » qui disparaît", cards: [
          ["Je sais pas.", "I don't know.", "Spoken: 'ne' is dropped. Written: Je ne sais pas."],
          ["C'est pas grave.", "It's no big deal.", "Written: Ce n'est pas grave."],
          ["J'ai pas le temps.", "I don't have time.", ""],
          ["T'inquiète pas.", "Don't worry.", "Often just « T'inquiète ! »"],
          ["Y a pas de souci.", "No problem.", "From « Il n'y a pas de souci »."],
          ["Je peux pas ce soir.", "I can't tonight.", ""],
          ["On sait jamais.", "You never know.", ""],
          ["Ça marche pas.", "It doesn't work.", ""]
        ], drills: [
          ["C'est ___ grave.", "pas", ["ne", "rien"], "Spoken French keeps only 'pas'."],
          ["Y a ___ de souci.", "pas", ["ne", "non"], "« Y a pas de souci » = no problem."],
          ["On sait ___.", "jamais", ["rien", "personne"], "« On sait jamais » = you never know."],
          ["Je ___ pas ce soir, désolé.", "peux", ["peut", "pouvons"], "je peux → je peux pas (spoken)."]
        ] },
        { title: "Les mots qui fondent (t'as, t'es, y a)", cards: [
          ["T'as faim ?", "Are you hungry?", "tu as → t'as"],
          ["T'es où ?", "Where are you?", "tu es → t'es"],
          ["Chais pas.", "Dunno.", "Fast 'je sais pas' sounds like 'chais pas'."],
          ["Y a du monde.", "It's busy. / There are lots of people.", "il y a → y a"],
          ["Faut y aller.", "We've got to go.", "il faut → faut"],
          ["J'suis crevé.", "I'm exhausted.", "je suis → j'suis (sounds like 'chuis')"],
          ["T'as vu ça ?", "Did you see that?", ""],
          ["Qu'est-ce que t'en penses ?", "What do you think of it?", ""]
        ], drills: [
          ["___ où ? Je t'attends !", "T'es", ["T'as", "Tu"], "t'es = tu es."],
          ["___ du monde ce soir.", "Y a", ["Il", "Ça"], "y a = il y a."],
          ["___ y aller, on est en retard.", "Faut", ["Fait", "Font"], "faut = il faut."],
          ["___ faim ? On mange ?", "T'as", ["T'es", "Tu es"], "avoir faim → t'as faim."]
        ] },
        { title: "« On » à la place de « nous »", cards: [
          ["On y va ?", "Shall we go?", ""],
          ["On se voit demain.", "See you tomorrow.", ""],
          ["On a mangé chez Paul.", "We ate at Paul's.", "Spoken 'on' replaces 'nous'. Verb is singular."],
          ["On est fatigués.", "We're tired.", "The adjective agrees with the real people (plural)."],
          ["Nous, on préfère la mer.", "We prefer the seaside.", "« Nous, on… » adds emphasis. Very natural."],
          ["On fait quoi ce soir ?", "What are we doing tonight?", ""],
          ["On m'a dit que c'était fermé.", "I was told it was closed.", "'on' can also mean 'someone / people'."],
          ["On s'appelle ?", "Shall we call each other?", ""]
        ], drills: [
          ["Ce soir, on ___ au cinéma.", "va", ["allons", "vont"], "on + 3rd person singular."],
          ["Nous, ___ préfère rester ici.", "on", ["nous", "ils"], "« Nous, on… »"],
          ["On ___ fatigués après le match.", "est", ["sommes", "sont"], "on est (singular verb)."],
          ["On fait ___ ce week-end ?", "quoi", ["que", "qui"], "Spoken: « On fait quoi ? »"]
        ] },
        { title: "Les petits mots : du coup, en fait, bref", cards: [
          ["Du coup, on fait quoi ?", "So, what do we do?", "'du coup' = so / as a result. Used everywhere."],
          ["En fait, c'est simple.", "Actually, it's simple.", ""],
          ["Bah oui !", "Well, yes! (obviously)", ""],
          ["Ben, je sais pas…", "Well, I don't know…", ""],
          ["Il est sympa, quoi.", "He's nice, you know.", "'quoi' at the end = 'you know / that's it'."],
          ["Genre, il est parti comme ça !", "Like, he just left like that!", "Young, informal."],
          ["Bref, c'était génial.", "Anyway, it was great.", "'Bref' wraps up a story."],
          ["Euh… attends.", "Um… wait.", "French hesitation sound: 'euh', not 'um'."]
        ], drills: [
          ["Il pleut. ___, on reste à la maison.", "Du coup", ["Pourtant", "Par contre"], "Du coup = so / as a result."],
          ["Je croyais que c'était dur, mais ___, c'est simple.", "en fait", ["donc", "ensuite"], "en fait = actually."],
          ["Bon, ___, c'était une super soirée.", "bref", ["genre", "pourtant"], "Bref closes a story."],
          ["Il est gentil, ___.", "quoi", ["que", "qui"], "Final 'quoi' = you know."]
        ] },
        { title: "Les questions de la rue", cards: [
          ["Tu viens ?", "Are you coming?", "Rising intonation: the most common spoken question."],
          ["Tu fais quoi ?", "What are you doing?", ""],
          ["Tu pars quand ?", "When are you leaving?", ""],
          ["C'est combien ?", "How much is it?", ""],
          ["Ça te dit ?", "Do you fancy it?", ""],
          ["Tu habites où ?", "Where do you live?", ""],
          ["C'est qui ?", "Who is it?", ""],
          ["On se retrouve où ?", "Where shall we meet?", ""]
        ], drills: [
          ["Tu fais ___ ce soir ?", "quoi", ["que", "qu'est-ce"], "Spoken: question word at the end."],
          ["Tu habites ___ ?", "où", ["ou", "qui"], "où (with accent) = where."],
          ["Un ciné ce soir, ça te ___ ?", "dit", ["fait", "va"], "Ça te dit ? = Do you fancy it?"],
          ["C'est ___, ce croissant ?", "combien", ["comment", "quand"], ""]
        ] }
      ]
    },
    {
      number: 48, cefr: "A2", unlockCefr: "A2", title: "Réagir comme un natif",
      blurb: "Natives react all the time: surprise, agreement, comfort, emotions. This is what makes you sound alive.",
      stages: [
        { title: "Surprise & intérêt", cards: [
          ["Ah bon ?", "Really?", ""],
          ["Sans blague !", "No kidding!", ""],
          ["C'est pas vrai !", "No way!", ""],
          ["Sérieux ?", "Seriously?", ""],
          ["Tu rigoles ?", "Are you joking?", ""],
          ["Ah oui ? Raconte !", "Oh yeah? Tell me!", ""],
          ["Incroyable !", "Incredible!", ""],
          ["Oh là là !", "Oh dear! / Wow!", "Surprise or worry. Not romantic!"]
        ], drills: [
          ["— Je pars vivre au Japon. — ___ ? Depuis quand ?", "Sérieux", ["Merci", "Pardon"], ""],
          ["Ah ___ ? Je ne savais pas.", "bon", ["bien", "beau"], "Ah bon ? = Really?"],
          ["Sans ___ ! Tu as gagné ?", "blague", ["rire", "joke"], ""],
          ["Tu ___ ? C'est impossible !", "rigoles", ["rigole", "rigolez"], "tu rigoles (with -s)."]
        ] },
        { title: "D'accord, pas d'accord", cards: [
          ["Carrément !", "Totally!", ""],
          ["Grave !", "Totally! (young slang)", "« C'est grave bien » = it's really good."],
          ["Tout à fait.", "Exactly.", "Neutral and polite."],
          ["C'est clair.", "For sure.", ""],
          ["Bof…", "Meh…", ""],
          ["N'importe quoi !", "Nonsense!", ""],
          ["Pas du tout.", "Not at all.", ""],
          ["Je suis pas d'accord.", "I don't agree.", ""]
        ], drills: [
          ["— Tu aimes ce plat ? — ___… pas trop.", "Bof", ["Carrément", "Grave"], "Bof = meh."],
          ["— On va à la plage ? — Oui, ___ !", "carrément", ["bof", "pas du tout"], ""],
          ["— La Terre est plate. — N'importe ___ !", "quoi", ["qui", "où"], ""],
          ["Je suis pas ___ avec toi.", "d'accord", ["accord", "daccord"], ""]
        ] },
        { title: "Rassurer & encourager", cards: [
          ["T'inquiète !", "Don't worry!", ""],
          ["C'est rien.", "It's nothing.", ""],
          ["Ça arrive.", "It happens.", ""],
          ["Courage !", "Hang in there!", ""],
          ["Vas-y, tu peux le faire !", "Go on, you can do it!", ""],
          ["Ça va aller.", "It's going to be OK.", ""],
          ["Pas de panique.", "Don't panic.", ""],
          ["Bon courage pour demain !", "Good luck for tomorrow!", "Said before work, exams, hard tasks."]
        ], drills: [
          ["J'ai raté mon train… — Oh, ça ___ !", "arrive", ["arrivé", "va"], "Ça arrive = it happens."],
          ["Ça va ___, ne t'inquiète pas.", "aller", ["être", "faire"], ""],
          ["Bon ___ pour ton examen !", "courage", ["chance", "travail"], "« Bonne chance » is feminine; « Bon courage »."],
          ["Pas de ___, on a le temps.", "panique", ["paniquer", "paniqué"], ""]
        ] },
        { title: "Politesse & excuses naturelles", cards: [
          ["Excuse-moi, j'ai pas fait exprès.", "Sorry, I didn't do it on purpose.", ""],
          ["Désolé pour le retard.", "Sorry I'm late.", ""],
          ["Je vous en prie.", "You're welcome. / Please, go ahead.", "Formal."],
          ["De rien !", "You're welcome!", ""],
          ["Avec plaisir !", "With pleasure!", ""],
          ["Ça me ferait plaisir.", "I'd love that.", ""],
          ["Merci, c'est gentil.", "Thanks, that's kind.", ""],
          ["Pardon, je peux passer ?", "Excuse me, can I get past?", ""]
        ], drills: [
          ["Merci, c'est ___ !", "gentil", ["gentille", "gentils"], "c'est + masculine singular."],
          ["Désolé ___ le retard.", "pour", ["de", "à"], ""],
          ["Pardon, je peux ___ ?", "passer", ["passé", "passe"], "pouvoir + infinitive."],
          ["Je ___ en prie, Madame.", "vous", ["te", "me"], ""]
        ] },
        { title: "Les émotions du quotidien", cards: [
          ["J'en ai marre !", "I'm fed up!", ""],
          ["Ça m'énerve !", "That annoys me!", ""],
          ["J'ai la flemme.", "I can't be bothered.", ""],
          ["Je suis trop content !", "I'm so happy!", "Spoken 'trop' often means 'very'."],
          ["Ça fait peur.", "That's scary.", ""],
          ["J'ai hâte !", "I can't wait!", ""],
          ["Paris me manque.", "I miss Paris.", "Inverted: the thing you miss is the subject."],
          ["Je suis dégoûté.", "I'm gutted.", "Informal: very disappointed."]
        ], drills: [
          ["Paris ___ manque beaucoup.", "me", ["je", "moi"], "X me manque = I miss X."],
          ["J'en ai ___ de ce bruit !", "marre", ["mal", "peur"], ""],
          ["J'ai la ___ de faire la vaisselle.", "flemme", ["femme", "flamme"], ""],
          ["Je suis ___ content de te voir !", "trop", ["beaucoup", "plein"], ""]
        ] }
      ]
    },
    {
      number: 49, cefr: "B1", unlockCefr: "B1", title: "Codes & culture : vivre comme un Français",
      blurb: "La bise, l'apéro, le pont, tu ou vous: the unwritten rules every French person knows.",
      stages: [
        { title: "La bise & les salutations", cards: [
          ["On se fait la bise ?", "Shall we greet with a kiss on the cheek?", ""],
          ["Ça fait combien de bises ici ?", "How many kisses is it here?", "2 in Paris, 3 or 4 in some regions."],
          ["Bonjour, Madame.", "Hello, Madam.", "Always greet when you walk into a shop."],
          ["Coucou !", "Hi! (friends)", ""],
          ["Bonne journée !", "Have a nice day!", ""],
          ["Bonne soirée !", "Have a nice evening!", ""],
          ["À tout à l'heure !", "See you later (today)!", ""],
          ["À plus !", "See ya!", "Written in texts as « À+ »."]
        ], drills: [
          ["En partant le matin : « Bonne ___ ! »", "journée", ["jour", "soir"], ""],
          ["« À tout à l'___ ! »", "heure", ["heures", "horaire"], ""],
          ["On se fait la ___ ?", "bise", ["baiser", "bouche"], ""],
          ["« À ___ ! » (informel, = see ya)", "plus", ["plutôt", "plusieurs"], "Written in texts as À+."]
        ] },
        { title: "À table", cards: [
          ["Bon appétit !", "Enjoy your meal!", ""],
          ["Tu peux me passer le sel ?", "Can you pass me the salt?", ""],
          ["C'est délicieux !", "It's delicious!", ""],
          ["Je suis calé, merci.", "I'm full, thanks.", "Informal. Never say « je suis plein »!"],
          ["On prend l'apéro ?", "Shall we have drinks and nibbles?", "L'apéro: a social ritual before dinner."],
          ["L'addition, s'il vous plaît.", "The bill, please.", ""],
          ["Une carafe d'eau, s'il vous plaît.", "A jug of tap water, please.", "Free in restaurants."],
          ["Santé !", "Cheers!", "Look people in the eye when you clink glasses."]
        ], drills: [
          ["L'___, s'il vous plaît.", "addition", ["édition", "audition"], ""],
          ["Une ___ d'eau, s'il vous plaît.", "carafe", ["carton", "casserole"], ""],
          ["Non merci, je suis ___.", "calé", ["plein", "chaud"], "« Je suis plein » is a classic learner mistake."],
          ["On prend l'___ avant de dîner ?", "apéro", ["appel", "apport"], ""]
        ] },
        { title: "Le travail & la paperasse", cards: [
          ["Je suis en RTT vendredi.", "I've got Friday off (RTT).", "RTT = extra days off for working over 35 h."],
          ["On fait le pont ?", "Shall we take the bridge day off?", "The day between a public holiday and the weekend."],
          ["C'est la pause déj.", "It's lunch break.", ""],
          ["Il faut prendre rendez-vous.", "You need to make an appointment.", ""],
          ["Il me faut un justificatif de domicile.", "I need proof of address.", ""],
          ["La Sécu rembourse.", "Social security pays you back.", "la Sécu = la Sécurité sociale."],
          ["Il faut remplir un formulaire.", "You need to fill in a form.", ""],
          ["C'est la rentrée.", "It's back-to-school / back-to-work time.", "September feels like a national new year."]
        ], drills: [
          ["Jeudi c'est férié, on fait le ___ vendredi ?", "pont", ["port", "pain"], ""],
          ["Il faut prendre ___ chez le médecin.", "rendez-vous", ["rendu", "rentrée"], ""],
          ["En septembre, c'est la ___.", "rentrée", ["rentre", "entrée"], ""],
          ["Pour la banque, il me faut un justificatif de ___.", "domicile", ["domestique", "dommage"], ""]
        ] },
        { title: "Les références de tout le monde", cards: [
          ["Métro, boulot, dodo.", "Commute, work, sleep (the daily grind).", ""],
          ["Les grandes vacances.", "The summer holidays.", "July–August. Paris empties in August."],
          ["Le 14 Juillet.", "Bastille Day.", ""],
          ["La galette des rois.", "King cake (January).", "Whoever finds the fève is king for the day."],
          ["Il a eu son bac.", "He passed his baccalauréat.", "End-of-school exam."],
          ["Il faut faire la queue.", "You have to queue.", ""],
          ["Les Français adorent râler.", "French people love to grumble.", "Râler is almost a social sport."],
          ["Le système D.", "Resourcefulness, making do.", "D = débrouille."]
        ], drills: [
          ["Métro, boulot, ___.", "dodo", ["dîner", "dormir"], ""],
          ["En août, Paris se vide : ce sont les grandes ___.", "vacances", ["fêtes", "vagues"], ""],
          ["Les Français adorent ___ : c'est presque un sport !", "râler", ["ranger", "rater"], ""],
          ["Pas de solution ? On utilise le système ___ !", "D", ["B", "A"], "D = débrouille."]
        ] },
        { title: "Tu ou vous ?", cards: [
          ["On peut se tutoyer ?", "Can we say 'tu' to each other?", ""],
          ["Tutoie-moi, voyons !", "Call me 'tu', come on!", ""],
          ["Vous désirez ?", "What would you like? (in a shop)", ""],
          ["Excusez-moi de vous déranger.", "Sorry to bother you.", ""],
          ["Tu veux un café ?", "Want a coffee?", ""],
          ["Auriez-vous un instant ?", "Would you have a moment?", "Very polite."],
          ["Entre collègues, on se tutoie souvent.", "Colleagues often say 'tu'.", ""],
          ["Au patron, on dit vous, sauf s'il propose le tu.", "Say 'vous' to the boss, unless they suggest 'tu'.", ""]
        ], drills: [
          ["À une inconnue : « Excusez-moi, ___ avez l'heure ? »", "vous", ["tu", "te"], ""],
          ["À un ami : « ___ veux un café ? »", "Tu", ["Vous", "Te"], ""],
          ["On peut se ___ ?", "tutoyer", ["tutoie", "tutoyé"], "se + infinitive."],
          ["Excusez-moi de vous ___.", "déranger", ["dérangé", "dérange"], ""]
        ] }
      ]
    },
    {
      number: 50, cefr: "B1", unlockCefr: "B1", title: "Argot & verlan : le français de la rue",
      blurb: "Films, friends and the street use slang and verlan. Understand it all, and know when NOT to use it.",
      stages: [
        { title: "L'argot de tous les jours", cards: [
          ["la bouffe", "food (slang)", ""],
          ["bosser", "to work (slang)", ""],
          ["le boulot", "job, work (informal)", ""],
          ["une bagnole", "a car (slang)", ""],
          ["le fric / la thune", "money (slang)", ""],
          ["un mec", "a guy", ""],
          ["une nana", "a girl, a woman (informal)", ""],
          ["les fringues", "clothes (slang)", ""]
        ], drills: [
          ["Je dois ___ ce week-end, j'ai trop de travail.", "bosser", ["bouffer", "kiffer"], ""],
          ["J'ai plus de ___, je peux pas sortir.", "thune", ["fringues", "bagnole"], ""],
          ["Il a acheté une nouvelle ___ : une Peugeot.", "bagnole", ["fringue", "nana"], ""],
          ["C'est qui, ce ___ avec Julie ?", "mec", ["nana", "boulot"], ""]
        ] },
        { title: "Le verlan (l'envers)", cards: [
          ["C'est ouf !", "That's crazy!", "ouf = verlan of 'fou'."],
          ["Il est relou.", "He's annoying.", "relou = verlan of 'lourd'."],
          ["C'est chelou.", "It's weird / shady.", "chelou = verlan of 'louche'."],
          ["Elle est vénère.", "She's angry.", "vénère = verlan of 'énervé(e)'."],
          ["une meuf", "a girl, a woman", "meuf = verlan of 'femme'."],
          ["Laisse béton.", "Forget it.", "Verlan of 'laisse tomber'. A bit dated, but you'll hear it."],
          ["C'est zarbi.", "It's weird.", "zarbi = verlan of 'bizarre'."],
          ["Téma ça !", "Look at that!", "téma = verlan of 'mate' (look)."]
        ], drills: [
          ["Verlan de « fou » : ___", "ouf", ["fou", "uof"], ""],
          ["Verlan de « louche » : ___", "chelou", ["relou", "zarbi"], ""],
          ["Verlan de « lourd » : ___", "relou", ["chelou", "vénère"], ""],
          ["Verlan de « femme » : une ___", "meuf", ["nana", "feum"], ""]
        ] },
        { title: "Kiffer, galérer & co", cards: [
          ["Je kiffe cette chanson.", "I love this song.", ""],
          ["J'ai galéré pour trouver un appart.", "I really struggled to find a flat.", ""],
          ["Je me suis cassé.", "I got out of there.", "se casser = partir (a bit rude)."],
          ["Il a pigé.", "He got it (understood).", ""],
          ["On se capte plus tard ?", "Catch you later?", "Young."],
          ["Arrête de flipper !", "Stop freaking out!", ""],
          ["J'ai bouffé une pizza.", "I scoffed a pizza.", ""],
          ["Ça me saoule.", "That's getting on my nerves.", ""]
        ], drills: [
          ["Tu as ___ l'exercice ? — Oui, c'est facile.", "pigé", ["kiffé", "galéré"], ""],
          ["J'ai ___ trois heures dans les bouchons.", "galéré", ["kiffé", "pigé"], ""],
          ["Je ___ trop ce film !", "kiffe", ["galère", "flippe"], ""],
          ["Arrête de ___, tout va bien.", "flipper", ["kiffer", "bosser"], ""]
        ] },
        { title: "Les intensifs", cards: [
          ["C'est trop bien !", "It's so good!", ""],
          ["C'est grave bien.", "It's really good.", "Young."],
          ["Il fait super chaud.", "It's super hot.", ""],
          ["Je suis hyper fatigué.", "I'm really tired.", ""],
          ["C'est vachement cher.", "It's really expensive.", "vachement = très (informal)."],
          ["Un truc de fou !", "Something crazy / amazing!", ""],
          ["C'est nul.", "It's rubbish.", ""],
          ["C'est top !", "It's great!", ""]
        ], drills: [
          ["Ce resto est ___ cher, mais délicieux.", "vachement", ["vache", "vachée"], ""],
          ["C'est un truc de ___ !", "fou", ["fous", "foule"], ""],
          ["Ce film est ___, je me suis endormi.", "nul", ["top", "trop bien"], ""],
          ["Il fait ___ chaud aujourd'hui !", "super", ["beaucoup", "plein"], ""]
        ] },
        { title: "Registres : quand ne pas le dire", cards: [
          ["Je me casse. → Je m'en vais.", "I'm off. (slang → standard)", ""],
          ["C'est relou. → C'est pénible.", "It's annoying. (slang → standard)", ""],
          ["Je suis fauché. → Je n'ai pas d'argent.", "I'm broke. (slang → standard)", ""],
          ["un mec → un homme → un monsieur", "a guy → a man → a gentleman", ""],
          ["bosser → travailler", "to work (slang → standard)", ""],
          ["Ça me saoule. → Cela m'agace.", "It annoys me. (slang → formal)", ""],
          ["Il est vénère. → Il est en colère.", "He's angry. (slang → standard)", ""],
          ["une bagnole → une voiture → un véhicule", "a car (slang → standard → formal)", ""]
        ], drills: [
          ["Registre standard de « bosser » : ___", "travailler", ["bouffer", "kiffer"], ""],
          ["Standard de « une bagnole » : une ___", "voiture", ["vélo", "nana"], ""],
          ["Standard de « je suis vénère » : je suis en ___", "colère", ["forme", "retard"], ""],
          ["En entretien d'embauche : « Je ___ dans la finance. »", "travaille", ["bosse", "galère"], "Slang is for friends, not interviews."]
        ] }
      ]
    },
    {
      number: 51, cefr: "B2", unlockCefr: "B2", title: "Expressions imagées",
      blurb: "Natives speak in pictures: poser un lapin, avoir le cafard, coûter les yeux de la tête.",
      stages: [
        { title: "Le corps", cards: [
          ["Ça coûte les yeux de la tête.", "It costs an arm and a leg.", ""],
          ["Il a le bras long.", "He has connections / influence.", ""],
          ["Tu me casses les pieds !", "You're getting on my nerves!", ""],
          ["Il a mis les pieds dans le plat.", "He put his foot in it.", ""],
          ["Il a un poil dans la main.", "He's lazy.", ""],
          ["Elle m'a tenu la jambe pendant une heure.", "She talked my ear off for an hour.", ""],
          ["Tu te mets le doigt dans l'œil.", "You're completely wrong.", ""],
          ["Elle n'a pas froid aux yeux.", "She's fearless.", ""]
        ], drills: [
          ["Cet appartement coûte les yeux de la ___ !", "tête", ["main", "jambe"], ""],
          ["Il ne fait rien, il a un poil dans la ___.", "main", ["tête", "bouche"], ""],
          ["Tu te mets le doigt dans l'___ si tu crois ça.", "œil", ["oreille", "nez"], ""],
          ["Arrête de me casser les ___ !", "pieds", ["bras", "yeux"], ""]
        ] },
        { title: "La nourriture", cards: [
          ["J'ai la pêche !", "I'm full of energy!", ""],
          ["Arrête de raconter des salades.", "Stop telling stories (lies).", ""],
          ["Elle est tombée dans les pommes.", "She fainted.", ""],
          ["C'est la fin des haricots.", "It's all over / all is lost.", ""],
          ["Il est haut comme trois pommes.", "He's knee-high (tiny).", ""],
          ["J'ai du pain sur la planche.", "I've got a lot on my plate.", ""],
          ["Ça met du beurre dans les épinards.", "It makes life a bit easier (money).", ""],
          ["C'est pas mes oignons.", "It's none of my business.", ""]
        ], drills: [
          ["Il fait 40 degrés, elle est tombée dans les ___.", "pommes", ["poires", "prunes"], ""],
          ["J'ai du pain sur la ___ cette semaine.", "planche", ["table", "plage"], ""],
          ["Ne me raconte pas de ___ !", "salades", ["soupes", "tartes"], ""],
          ["Ce soir j'ai la ___, on sort ?", "pêche", ["fraise", "carotte"], ""]
        ] },
        { title: "Les animaux", cards: [
          ["Il m'a posé un lapin.", "He stood me up.", ""],
          ["J'ai un chat dans la gorge.", "I've got a frog in my throat.", ""],
          ["Il fait un froid de canard.", "It's freezing.", ""],
          ["C'est une poule mouillée.", "He's a chicken (coward).", ""],
          ["J'ai le cafard.", "I'm feeling down.", ""],
          ["Quand les poules auront des dents !", "When pigs fly!", ""],
          ["Je donne ma langue au chat.", "I give up (guessing).", ""],
          ["Revenons à nos moutons.", "Let's get back to the point.", ""]
        ], drills: [
          ["Il devait venir à 20 h… il m'a posé un ___ !", "lapin", ["chat", "canard"], ""],
          ["Je donne ma langue au ___ : c'est quoi la réponse ?", "chat", ["chien", "lapin"], ""],
          ["Bon, revenons à nos ___.", "moutons", ["moules", "poules"], ""],
          ["Il fait un froid de ___ ce matin.", "canard", ["loup", "chat"], ""]
        ] },
        { title: "La vie quotidienne", cards: [
          ["C'est pas la mer à boire.", "It's not that hard.", ""],
          ["Dimanche, je fais la grasse matinée.", "On Sunday, I sleep in.", ""],
          ["Il est dans la lune.", "He's daydreaming.", ""],
          ["Ça a été le coup de foudre.", "It was love at first sight.", ""],
          ["Il pleut des cordes.", "It's pouring.", ""],
          ["Ça tombe bien !", "Good timing!", ""],
          ["Je lui ai tiré les vers du nez.", "I got it out of him.", ""],
          ["J'ai fait d'une pierre deux coups.", "I killed two birds with one stone.", ""]
        ], drills: [
          ["Dimanche, je fais la grasse ___.", "matinée", ["journée", "soirée"], ""],
          ["Il pleut des ___, prends un parapluie.", "cordes", ["cordons", "cartes"], ""],
          ["Ce n'est pas la mer à ___ : tu vas y arriver.", "boire", ["voir", "faire"], ""],
          ["J'ai fait d'une pierre deux ___.", "coups", ["cous", "côtés"], ""]
        ] },
        { title: "Argumenter avec des images", cards: [
          ["Ça ne tient pas la route.", "That doesn't hold water.", ""],
          ["Coupons la poire en deux.", "Let's meet halfway.", ""],
          ["Je ne vais pas y aller par quatre chemins.", "I won't beat around the bush.", ""],
          ["Arrête de tourner autour du pot.", "Stop beating around the bush.", ""],
          ["Tu enfonces une porte ouverte.", "You're stating the obvious.", ""],
          ["Il veut toujours avoir le dernier mot.", "He always wants the last word.", ""],
          ["C'est l'arbre qui cache la forêt.", "It's a detail hiding the bigger problem.", ""],
          ["Il faut mettre de l'eau dans son vin.", "You have to tone it down / compromise.", ""]
        ], drills: [
          ["Arrête de tourner autour du ___ : dis-moi la vérité !", "pot", ["pont", "port"], ""],
          ["Ton argument ne tient pas la ___.", "route", ["porte", "rue"], ""],
          ["Coupons la poire en ___ : 50 euros chacun.", "deux", ["quatre", "trois"], ""],
          ["Il faut mettre de l'eau dans son ___.", "vin", ["vase", "verre"], ""]
        ] }
      ]
    },
    {
      number: 52, cefr: "C1", unlockCefr: "C1", title: "Penser en français",
      blurb: "Stop translating. Talk to yourself in French, describe what you do, nuance, and explain words in French.",
      stages: [
        { title: "Le monologue intérieur", cards: [
          ["Bon, alors… par où commencer ?", "Right, so… where do I start?", ""],
          ["Voyons voir…", "Let's see…", ""],
          ["Attends, j'ai oublié mes clés !", "Wait, I forgot my keys!", ""],
          ["Qu'est-ce que je fais maintenant ?", "What do I do now?", ""],
          ["Il faut que je pense à appeler maman.", "I need to remember to call mum.", ""],
          ["Allez, au boulot !", "Come on, back to work!", ""],
          ["Mince, je suis en retard !", "Darn, I'm late!", "'Mince' = polite version of a swear word."],
          ["Tant pis, je le ferai demain.", "Oh well, I'll do it tomorrow.", ""]
        ], drills: [
          ["___, je suis en retard !", "Mince", ["Tant pis", "Voyons"], ""],
          ["___ pis, je le ferai demain.", "Tant", ["Très", "Trop"], ""],
          ["Il faut que je ___ à appeler maman.", "pense", ["pensé", "penses"], "il faut que + subjunctive."],
          ["Allez, au ___ !", "boulot", ["bouleau", "bulot"], ""]
        ] },
        { title: "Raconter ce qu'on fait, en direct", cards: [
          ["Je suis en train de cuisiner.", "I'm (busy) cooking.", ""],
          ["Je viens de rentrer.", "I've just got home.", ""],
          ["Je vais prendre une douche.", "I'm going to take a shower.", ""],
          ["Je n'arrête pas de penser à ça.", "I can't stop thinking about it.", ""],
          ["Je suis sur le point de partir.", "I'm about to leave.", ""],
          ["Ça fait une heure que j'attends.", "I've been waiting for an hour.", ""],
          ["Je me demande si c'est une bonne idée.", "I wonder if it's a good idea.", ""],
          ["J'ai l'impression qu'il va pleuvoir.", "I get the feeling it's going to rain.", ""]
        ], drills: [
          ["Je suis en ___ de cuisiner.", "train", ["trains", "cours de"], ""],
          ["Je ___ de rentrer, je suis crevé.", "viens", ["vais", "suis"], "venir de = just did."],
          ["Ça fait une heure ___ j'attends.", "que", ["qui", "dont"], ""],
          ["Je suis sur le ___ de partir.", "point", ["pont", "poing"], ""]
        ] },
        { title: "Nuancer sa pensée", cards: [
          ["À vrai dire, je n'en sais rien.", "To tell the truth, I have no idea.", ""],
          ["Si je ne m'abuse, c'est mardi.", "If I'm not mistaken, it's Tuesday.", ""],
          ["Toujours est-il qu'on a perdu.", "The fact remains that we lost.", ""],
          ["N'empêche que c'était une bonne idée.", "All the same, it was a good idea.", ""],
          ["Encore faut-il qu'il soit d'accord.", "He still has to agree, though.", "+ subjonctif."],
          ["Quitte à partir, autant partir tôt.", "If we're leaving anyway, may as well leave early.", ""],
          ["Il n'en reste pas moins que c'est risqué.", "Nonetheless, it's risky.", ""],
          ["Ce n'est pas tant le prix que la qualité.", "It's not so much the price as the quality.", ""]
        ], drills: [
          ["N'___ que c'était une bonne idée.", "empêche", ["empêcher", "empêché"], ""],
          ["Si je ne m'___, la réunion est à 10 h.", "abuse", ["amuse", "accuse"], ""],
          ["Encore faut-il qu'il ___ d'accord.", "soit", ["est", "sera"], "Subjunctive after « encore faut-il que »."],
          ["Ce n'est pas ___ le prix que la qualité qui me gêne.", "tant", ["temps", "tante"], ""]
        ] },
        { title: "Les connecteurs du natif", cards: [
          ["D'ailleurs, je l'ai vu hier.", "Actually / by the way, I saw him yesterday.", ""],
          ["C'est bon. Par contre, c'est cher.", "It's good. On the other hand, it's expensive.", "Spoken. Written: « en revanche »."],
          ["Sinon, ça va ?", "Other than that, how are you?", "'Sinon' changes the topic."],
          ["En gros, il faut tout refaire.", "Basically, we have to redo everything.", ""],
          ["Autrement dit, c'est non.", "In other words, it's a no.", ""],
          ["C'est quand même cher !", "It's really quite expensive!", "'quand même' adds emphasis or 'still'."],
          ["Au fait, tu as vu Marie ?", "By the way, have you seen Marie?", ""],
          ["Ceci dit, il a raison.", "That said, he's right.", ""]
        ], drills: [
          ["C'est bon. ___, c'est un peu cher.", "Par contre", ["Au fait", "En gros"], ""],
          ["___, tu as vu Marie hier ?", "Au fait", ["Par contre", "Autrement dit"], ""],
          ["C'est ___ même incroyable !", "quand", ["tout", "comme"], ""],
          ["___ gros, il faut tout refaire.", "En", ["Au", "De"], ""]
        ] },
        { title: "Penser sans traduire : expliquer en français", cards: [
          ["Un parapluie, c'est ce qu'on utilise quand il pleut.", "An umbrella is what you use when it rains.", ""],
          ["Un boulanger, c'est la personne qui fait le pain.", "A baker is the person who makes bread.", ""],
          ["C'est un truc qui sert à ouvrir les bouteilles.", "It's a thing for opening bottles.", "Forgot a word? « un truc qui sert à… »"],
          ["C'est le contraire de « facile ».", "It's the opposite of 'easy'.", ""],
          ["C'est comme… comment dire ?", "It's like… how can I put it?", ""],
          ["Ça s'appelle comment, déjà ?", "What's it called again?", ""],
          ["Je ne trouve pas le mot.", "I can't find the word.", ""],
          ["C'est quelqu'un qui répare les voitures.", "It's someone who fixes cars.", ""]
        ], drills: [
          ["Un boulanger, c'est la personne ___ fait le pain.", "qui", ["que", "où"], ""],
          ["C'est un truc qui ___ à ouvrir les bouteilles.", "sert", ["sort", "sent"], ""],
          ["Ça s'appelle comment, ___ ?", "déjà", ["encore", "alors"], ""],
          ["C'est le ___ de « facile » : difficile.", "contraire", ["contrat", "comptoir"], ""]
        ] }
      ]
    }
  ];

  NATIVE.forEach(w => (w.stages || []).forEach(st => { if (NATIVE_LESSONS[st.title]) st.lesson = NATIVE_LESSONS[st.title]; }));
  window.ODYSSEE_BUILD_WORLDS(NATIVE);
  window.NATIVE_WORLD_NUMBERS = NATIVE.map(w => w.number);
})();

