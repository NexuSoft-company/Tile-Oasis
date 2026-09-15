export type AppLanguage = 'en' | 'ur' | 'ar' | 'fa' | 'tr' | 'es' | 'fr' | 'zh' | 'ru' | 'hi';

export interface FAQ {
  id: string;
  q: Record<AppLanguage, string>;
  a: Record<AppLanguage, string>;
}

export const SUPPORT_LANGUAGES: { code: AppLanguage; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ur', label: 'Urdu', native: 'اردو' },
  { code: 'ar', label: 'Arabic', native: 'العربية' },
  { code: 'fa', label: 'Persian', native: 'فارسی' },
  { code: 'tr', label: 'Turkish', native: 'Türkçe' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'zh', label: 'Chinese', native: '中文' },
  { code: 'ru', label: 'Russian', native: 'Русский' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
];

export const FAQ_DATABASE: FAQ[] = [
  {
    id: 'faq_1',
    q: {
      en: 'How do I play the game?',
      ur: 'میں گیم کیسے کھیلوں؟',
      ar: 'كيف ألعب اللعبة؟',
      fa: 'چگونه بازی کنم؟',
      tr: 'Oyunu nasıl oynarım?',
      es: '¿Cómo juego el juego?',
      fr: 'Comment jouer au jeu ?',
      zh: '我该如何玩这个游戏？',
      ru: 'Как мне играть в игру?',
      hi: 'मैं गेम कैसे खेलूँ?'
    },
    a: {
      en: 'Tap on 3 identical tiles to match and clear them from the board.',
      ur: 'بورڈ سے ہٹانے کے لیے 3 ایک جیسی ٹائلوں پر کلک کریں۔',
      ar: 'انقر على 3 بلاطات متطابقة لمطابقتها ومسحها من اللوحة.',
      fa: 'روی ۳ کاشی مشابه ضربه بزنید تا مطابقت پیدا کنند و پاک شوند.',
      tr: 'Tahtadan temizlemek için 3 aynı karoya dokunun ve eşleştirin.',
      es: 'Toca 3 fichas idénticas para emparejarlas y eliminarlas del tablero.',
      fr: 'Appuyez sur 3 tuiles identiques pour les associer et les effacer du plateau.',
      zh: '点击 3 个相同的方块以进行匹配并将其从面板上清除。',
      ru: 'Нажмите на 3 одинаковые плитки, чтобы сопоставить и убрать их с доски.',
      hi: 'बोर्ड से हटाने के लिए 3 एक जैसी टाइलों पर टैप करें।'
    }
  },
  {
    id: 'faq_2',
    q: {
      en: 'How do levels increase?',
      ur: 'لیولز کیسے بڑھتے ہیں؟',
      ar: 'كيف تزيد المستويات؟',
      fa: 'مراحل چگونه افزایش می‌یابند؟',
      tr: 'Seviyeler nasıl artar?',
      es: '¿Cómo aumentan los niveles?',
      fr: 'Comment les niveaux augmentent-ils ?',
      zh: '等级如何提升？',
      ru: 'Как повышаются уровни?',
      hi: 'लेवल कैसे बढ़ते हैं?'
    },
    a: {
      en: 'Clear all tiles on the board to automatically advance to the next level.',
      ur: 'اگلے لیول پر جانے کے لیے بورڈ کی تمام ٹائلیں صاف کریں۔',
      ar: 'امسح جميع البلاط على اللوحة للتقدم تلقائيًا إلى المستوى التالي.',
      fa: 'تمام کاشی‌های روی تخته را پاک کنید تا به طور خودکار به مرحله بعدی بروید.',
      tr: 'Bir sonraki seviyeye geçmek için tahtadaki tüm karoları temizleyin.',
      es: 'Elimina todas las fichas del tablero para avanzar automáticamente al siguiente nivel.',
      fr: 'Effacez toutes les tuiles du plateau pour passer automatiquement au niveau suivant.',
      zh: '清除面板上的所有方块即可自动进入下一级。',
      ru: 'Очистите все плитки на доске, чтобы автоматически перейти на следующий уровень.',
      hi: 'अगले लेवल पर जाने के लिए बोर्ड की सभी टाइलें साफ करें।'
    }
  },
  {
    id: 'faq_3',
    q: {
      en: 'How many levels are there?',
      ur: 'گیم میں کل کتنے لیولز ہیں؟',
      ar: 'كم عدد المستويات هناك؟',
      fa: 'چند مرحله وجود دارد؟',
      tr: 'Kaç seviye var?',
      es: '¿Cuántos niveles hay?',
      fr: 'Combien y a-t-il de niveaux ?',
      zh: '有多少个级别？',
      ru: 'Сколько всего уровней?',
      hi: 'कितने लेवल हैं?'
    },
    a: {
      en: 'There are thousands of levels, with new ones added every week!',
      ur: 'اس میں ہزاروں لیولز ہیں، اور ہر ہفتے نئے لیولز شامل کیے جاتے ہیں!',
      ar: 'هناك الآلاف من المستويات، مع إضافة مستويات جديدة كل أسبوع!',
      fa: 'هزاران مرحله وجود دارد و هر هفته مراحل جدیدی اضافه می‌شود!',
      tr: 'Her hafta yenileri eklenen binlerce seviye var!',
      es: '¡Hay miles de niveles, con otros nuevos añadidos cada semana!',
      fr: 'Il y a des milliers de niveaux, avec de nouveaux ajoutés chaque semaine !',
      zh: '有成千上万个关卡，每周都会添加新关卡！',
      ru: 'Есть тысячи уровней, и каждую неделю добавляются новые!',
      hi: 'हजारों लेवल हैं, और हर हफ्ते नए जोड़े जाते हैं!'
    }
  },
  {
    id: 'faq_4',
    q: {
      en: 'How do I get rewards?',
      ur: 'مجھے انعامات کیسے ملیں گے؟',
      ar: 'كيف أحصل على المكافآت؟',
      fa: 'چگونه پاداش بگیرم؟',
      tr: 'Nasıl ödül alırım?',
      es: '¿Cómo obtengo recompensas?',
      fr: 'Comment obtenir des récompenses ?',
      zh: '如何获得奖励？',
      ru: 'Как мне получить награды?',
      hi: 'मुझे इनाम कैसे मिलेंगे?'
    },
    a: {
      en: 'Complete levels, missions, and achievements to earn free rewards.',
      ur: 'مفت انعامات حاصل کرنے کے لیے لیولز، مشنز اور اچیومنٹس مکمل کریں۔',
      ar: 'أكمل المستويات والمهام والإنجازات لكسب مكافآت مجانية.',
      fa: 'برای کسب جوایز رایگان، مراحل، ماموریت‌ها و دستاوردها را کامل کنید.',
      tr: 'Ücretsiz ödüller kazanmak için seviyeleri, görevleri ve başarıları tamamlayın.',
      es: 'Completa niveles, misiones y logros para ganar recompensas gratuitas.',
      fr: 'Terminez des niveaux, des missions et des succès pour gagner des récompenses gratuites.',
      zh: '完成关卡、任务和成就即可获得免费奖励。',
      ru: 'Проходите уровни, миссии и достижения, чтобы получать бесплатные награды.',
      hi: 'मुफ्त इनाम पाने के लिए लेवल, मिशन और उपलब्धियां पूरी करें।'
    }
  },
  {
    id: 'faq_5',
    q: {
      en: 'What are Daily Rewards?',
      ur: 'ڈیلی ریوارڈز کیا ہیں؟',
      ar: 'ما هي المكافآت اليومية؟',
      fa: 'جوایز روزانه چیست؟',
      tr: 'Günlük Ödüller nelerdir?',
      es: '¿Qué son las recompensas diarias?',
      fr: 'Que sont les récompenses quotidiennes ?',
      zh: '什么是每日奖励？',
      ru: 'Что такое Ежедневные Награды?',
      hi: 'दैनिक इनाम (Daily Rewards) क्या हैं?'
    },
    a: {
      en: 'Gifts you receive for logging into the game every day.',
      ur: 'وہ تحائف جو آپ کو ہر روز گیم اوپن کرنے پر ملتے ہیں۔',
      ar: 'الهدايا التي تتلقاها لتسجيل الدخول إلى اللعبة كل يوم.',
      fa: 'هدایایی که هر روز با ورود به بازی دریافت می‌کنید.',
      tr: 'Her gün oyuna giriş yaptığınız için aldığınız hediyelerdir.',
      es: 'Regalos que recibes por iniciar sesión en el juego todos los días.',
      fr: 'Cadeaux que vous recevez en vous connectant au jeu tous les jours.',
      zh: '您每天登录游戏时收到的礼物。',
      ru: 'Подарки, которые вы получаете за вход в игру каждый день.',
      hi: 'रोज़ गेम खोलने पर मिलने वाले मुफ़्त तोहफ़े।'
    }
  },
  {
    id: 'faq_6',
    q: {
      en: 'What are Coins used for?',
      ur: 'کوائنز کا کیا استعمال ہے؟',
      ar: 'ما هي استخدامات العملات؟',
      fa: 'سکه‌ها برای چه استفاده می‌شوند؟',
      tr: 'Bozuk paralar ne için kullanılır?',
      es: '¿Para qué se usan las monedas?',
      fr: 'A quoi servent les pièces ?',
      zh: '金币有什么用？',
      ru: 'Для чего нужны монеты?',
      hi: 'सिक्के (Coins) किस काम आते हैं?'
    },
    a: {
      en: 'Coins are used to buy boosters and extra lives.',
      ur: 'کوائنز بوسٹرز اور اضافی زندگیاں خریدنے کے کام آتے ہیں۔',
      ar: 'تستخدم العملات المعدنية لشراء المعززات والأرواح الإضافية.',
      fa: 'سکه‌ها برای خرید تقویت‌کننده‌ها و جان‌های اضافی استفاده می‌شوند.',
      tr: 'Paralar güçlendiriciler ve ekstra can satın almak için kullanılır.',
      es: 'Las monedas se usan para comprar potenciadores y vidas extra.',
      fr: 'Les pièces sont utilisées pour acheter des boosters et des vies supplémentaires.',
      zh: '金币用于购买道具和额外的生命。',
      ru: 'Монеты используются для покупки бустеров и дополнительных жизней.',
      hi: 'सिक्कों का उपयोग बूस्टर और अतिरिक्त जीवन खरीदने के लिए किया जाता है।'
    }
  },
  {
    id: 'faq_7',
    q: {
      en: 'What are Gems used for?',
      ur: 'جیمز کا کیا استعمال ہے؟',
      ar: 'ما هي استخدامات الجواهر؟',
      fa: 'جواهرات برای چه استفاده می‌شوند؟',
      tr: 'Mücevherler ne için kullanılır?',
      es: '¿Para qué se usan las gemas?',
      fr: 'A quoi servent les gemmes ?',
      zh: '宝石有什么用？',
      ru: 'Для чего нужны драгоценные камни?',
      hi: 'रत्न (Gems) किस काम आते हैं?'
    },
    a: {
      en: 'Gems are premium currency to buy rare items and special tiles.',
      ur: 'جیمز پریمیم کرنسی ہیں جن سے خاص آئٹمز خریدی جاتی ہیں۔',
      ar: 'الجواهر هي عملة مميزة لشراء عناصر نادرة وبلاط خاص.',
      fa: 'جواهرات ارز ممتاز برای خرید اقلام کمیاب و کاشی‌های ویژه هستند.',
      tr: 'Mücevherler nadir eşyalar ve özel karolar satın almak için premium para birimidir.',
      es: 'Las gemas son moneda premium para comprar artículos raros.',
      fr: 'Les gemmes sont la monnaie premium pour acheter des objets rares.',
      zh: '宝石是用来购买稀有物品和特殊方块的高级货币。',
      ru: 'Самоцветы — это премиальная валюта для покупки редких предметов.',
      hi: 'रत्न प्रीमियम मुद्रा हैं जिससे विशेष चीजें खरीदी जाती हैं।'
    }
  },
  {
    id: 'faq_8',
    q: {
      en: 'How do Boosters work?',
      ur: 'بوسٹرز کیسے کام کرتے ہیں؟',
      ar: 'كيف تعمل المعززات؟',
      fa: 'تقویت‌کننده‌ها چگونه کار می‌کنند؟',
      tr: 'Güçlendiriciler nasıl çalışır?',
      es: '¿Cómo funcionan los potenciadores?',
      fr: 'Comment fonctionnent les boosters ?',
      zh: '道具是如何工作的？',
      ru: 'Как работают бустеры?',
      hi: 'बूस्टर कैसे काम करते हैं?'
    },
    a: {
      en: 'Boosters give you special advantages to pass hard levels.',
      ur: 'بوسٹرز مشکل لیولز پاس کرنے میں آپ کی مدد کرتے ہیں۔',
      ar: 'تمنحك المعززات مزايا خاصة لاجتياز المستويات الصعبة.',
      fa: 'تقویت‌کننده‌ها مزایای ویژه‌ای برای عبور از مراحل سخت به شما می‌دهند.',
      tr: 'Güçlendiriciler zor seviyeleri geçmeniz için size özel avantajlar sağlar.',
      es: 'Los potenciadores te dan ventajas especiales para superar niveles difíciles.',
      fr: 'Les boosters vous donnent des avantages spéciaux pour passer les niveaux difficiles.',
      zh: '道具为您提供特殊优势，帮助您通过困难的关卡。',
      ru: 'Бустеры дают вам особые преимущества для прохождения сложных уровней.',
      hi: 'बूस्टर आपको कठिन लेवल पार करने में मदद करते हैं।'
    }
  },
  {
    id: 'faq_9',
    q: {
      en: 'Can I play offline?',
      ur: 'کیا میں آف لائن کھیل سکتا ہوں؟',
      ar: 'هل يمكنني اللعب بدون إنترنت؟',
      fa: 'آیا می‌توانم آفلاین بازی کنم؟',
      tr: 'Çevrimdışı oynayabilir miyim?',
      es: '¿Puedo jugar sin conexión?',
      fr: 'Puis-je jouer hors ligne ?',
      zh: '我可以离线玩吗？',
      ru: 'Могу ли я играть оффлайн?',
      hi: 'क्या मैं ऑफ़लाइन खेल सकता हूँ?'
    },
    a: {
      en: 'Yes, you can play most levels offline without internet.',
      ur: 'جی ہاں، آپ انٹرنیٹ کے بغیر بھی کھیل سکتے ہیں۔',
      ar: 'نعم، يمكنك لعب معظم المستويات بدون إنترنت.',
      fa: 'بله، می‌توانید بیشتر مراحل را بدون اینترنت بازی کنید.',
      tr: 'Evet, çoğu seviyeyi internet olmadan oynayabilirsiniz.',
      es: 'Sí, puedes jugar la mayoría de los niveles sin conexión.',
      fr: 'Oui, vous pouvez jouer à la plupart des niveaux sans internet.',
      zh: '是的，您可以在没有互联网的情况下离线游玩大部分关卡。',
      ru: 'Да, вы можете играть в большинство уровней без интернета.',
      hi: 'हां, आप बिना इंटरनेट के भी खेल सकते हैं।'
    }
  },
  {
    id: 'faq_10',
    q: {
      en: 'How to reset my progress?',
      ur: 'میں گیم ری سیٹ کیسے کروں؟',
      ar: 'كيف أعيد ضبط تقدمي؟',
      fa: 'چگونه پیشرفت خود را بازنشانی کنم؟',
      tr: 'İlerlememi nasıl sıfırlarım?',
      es: '¿Cómo restablecer mi progreso?',
      fr: 'Comment réinitialiser ma progression ?',
      zh: '如何重置我的进度？',
      ru: 'Как сбросить мой прогресс?',
      hi: 'गेम को रीसेट कैसे करें?'
    },
    a: {
      en: 'You must reinstall the game to reset all progress.',
      ur: 'پروگریس ری سیٹ کرنے کے لیے آپ کو گیم دوبارہ انسٹال کرنی ہوگی۔',
      ar: 'يجب عليك إعادة تثبيت اللعبة لإعادة تعيين كل التقدم.',
      fa: 'برای بازنشانی تمام پیشرفت‌ها باید بازی را دوباره نصب کنید.',
      tr: 'Tüm ilerlemeyi sıfırlamak için oyunu yeniden yüklemelisiniz.',
      es: 'Debes reinstalar el juego para restablecer todo el progreso.',
      fr: 'Vous devez réinstaller le jeu pour réinitialiser votre progression.',
      zh: '您必须重新安装游戏才能重置所有进度。',
      ru: 'Вы должны переустановить игру, чтобы сбросить весь прогресс.',
      hi: 'प्रोग्रेस रीसेट करने के लिए गेम को फिर से इंस्टॉल करें।'
    }
  },
  {
    id: 'faq_11',
    q: {
      en: 'Why did I lose a life?',
      ur: 'میری زندگی (Life) کیوں کم ہوئی؟',
      ar: 'لماذا فقدت حياة؟',
      fa: 'چرا یک جان از دست دادم؟',
      tr: 'Neden bir can kaybettim?',
      es: '¿Por qué perdí una vida?',
      fr: 'Pourquoi ai-je perdu une vie ?',
      zh: '我为什么失去了一条生命？',
      ru: 'Почему я потерял жизнь?',
      hi: 'मैंने अपनी लाइफ क्यों खो दी?'
    },
    a: {
      en: 'You lose a life if your tray gets completely full of tiles.',
      ur: 'اگر آپ کی ٹرے ٹائلوں سے بھر جائے تو آپ ہار جاتے ہیں اور ایک لائف کم ہو جاتی ہے۔',
      ar: 'تفقد حياة إذا أصبح الدرج الخاص بك ممتلئًا تمامًا بالبلاط.',
      fa: 'اگر سینی شما کاملاً از کاشی‌ها پر شود، یک جان از دست می‌دهید.',
      tr: 'Tepsiniz tamamen karolarla dolarsa bir can kaybedersiniz.',
      es: 'Pierdes una vida si tu bandeja se llena completamente de fichas.',
      fr: 'Vous perdez une vie si votre plateau est complètement rempli de tuiles.',
      zh: '如果您的托盘里装满了方块，您将失去一条生命。',
      ru: 'Вы теряете жизнь, если ваш лоток полностью заполняется плитками.',
      hi: 'यदि आपकी ट्रे टाइलों से भर जाती है तो आप हार जाते हैं।'
    }
  },
  {
    id: 'faq_12',
    q: {
      en: 'How to get more lives?',
      ur: 'زیادہ زندگیاں کیسے حاصل کروں؟',
      ar: 'كيف أحصل على المزيد من الأرواح؟',
      fa: 'چگونه جان‌های بیشتری بگیرم؟',
      tr: 'Nasıl daha fazla can alırım?',
      es: '¿Cómo conseguir más vidas?',
      fr: 'Comment obtenir plus de vies ?',
      zh: '如何获得更多生命？',
      ru: 'Как получить больше жизней?',
      hi: 'अधिक लाइफ कैसे प्राप्त करें?'
    },
    a: {
      en: 'Lives refill over time automatically, or you can buy them with coins.',
      ur: 'زندگیاں خود بخود واپس آ جاتی ہیں، یا آپ کوائنز دے کر بھی خرید سکتے ہیں۔',
      ar: 'يتم إعادة تعبئة الأرواح بمرور الوقت تلقائيًا، أو يمكنك شراؤها بالعملات المعدنية.',
      fa: 'جان‌ها با گذشت زمان به طور خودکار پر می‌شوند یا می‌توانید با سکه آن‌ها را بخرید.',
      tr: 'Canlar zamanla otomatik olarak dolar veya bozuk parayla satın alabilirsiniz.',
      es: 'Las vidas se reponen con el tiempo o puedes comprarlas con monedas.',
      fr: 'Les vies se rechargent avec le temps, ou vous pouvez les acheter avec des pièces.',
      zh: '生命会随时间自动恢复，您也可以用金币购买。',
      ru: 'Жизни восстанавливаются со временем, или вы можете купить их за монеты.',
      hi: 'लाइफ समय के साथ वापस आ जाती है, या आप सिक्कों से खरीद सकते हैं।'
    }
  },
  {
    id: 'faq_13',
    q: {
      en: 'What is the Undo booster?',
      ur: 'انڈو (Undo) بوسٹر کیا ہے؟',
      ar: 'ما هو معزز التراجع؟',
      fa: 'تقویت‌کننده لغو (Undo) چیست؟',
      tr: 'Geri Al güçlendiricisi nedir?',
      es: '¿Qué es el potenciador Deshacer?',
      fr: 'Qu\'est-ce que le booster Annuler ?',
      zh: '什么是撤销道具？',
      ru: 'Что такое бустер Отмены?',
      hi: 'अनडू (Undo) बूस्टर क्या है?'
    },
    a: {
      en: 'It cancels your last move and puts the tile back on the board.',
      ur: 'یہ آپ کی آخری چال واپس لیتا ہے اور ٹائل واپس بورڈ پر رکھ دیتا ہے۔',
      ar: 'يلغي حركتك الأخيرة ويعيد البلاط إلى اللوحة.',
      fa: 'حرکت آخر شما را لغو می‌کند و کاشی را به تخته برمی‌گرداند.',
      tr: 'Son hamlenizi iptal eder ve karoyu tahtaya geri koyar.',
      es: 'Cancela tu último movimiento y vuelve a poner la ficha en el tablero.',
      fr: 'Il annule votre dernier coup et remet la tuile sur le plateau.',
      zh: '它取消您的最后一步并将方块放回原处。',
      ru: 'Он отменяет ваш последний ход и возвращает плитку на доску.',
      hi: 'यह आपकी आखिरी चाल को वापस लेता है।'
    }
  },
  {
    id: 'faq_14',
    q: {
      en: 'What is the Shuffle booster?',
      ur: 'شفل (Shuffle) بوسٹر کیا ہے؟',
      ar: 'ما هو معزز الخلط؟',
      fa: 'تقویت‌کننده بر زدن (Shuffle) چیست؟',
      tr: 'Karıştırma güçlendiricisi nedir?',
      es: '¿Qué es el potenciador Mezclar?',
      fr: 'Qu\'est-ce que le booster Mélanger ?',
      zh: '什么是洗牌道具？',
      ru: 'Что такое бустер Перемешивания?',
      hi: 'शफल (Shuffle) बूस्टर क्या है?'
    },
    a: {
      en: 'It completely rearranges all the tiles left on the board.',
      ur: 'یہ بورڈ پر موجود تمام ٹائلوں کی جگہ بدل دیتا ہے۔',
      ar: 'يعيد ترتيب جميع البلاط المتبقي على اللوحة.',
      fa: 'کاشی‌های باقی‌مانده روی تخته را کاملاً جابه‌جا می‌کند.',
      tr: 'Tahtada kalan tüm karoları tamamen yeniden düzenler.',
      es: 'Reorganiza completamente todas las fichas que quedan en el tablero.',
      fr: 'Il réorganise complètement toutes les tuiles restantes sur le plateau.',
      zh: '它会完全重新排列面板上剩余的所有方块。',
      ru: 'Он полностью переставляет все оставшиеся плитки на доске.',
      hi: 'यह बोर्ड पर मौजूद सभी टाइलों को मिला देता है।'
    }
  },
  {
    id: 'faq_15',
    q: {
      en: 'What is the Magnet booster?',
      ur: 'میگنیٹ (Magnet) بوسٹر کیا ہے؟',
      ar: 'ما هو معزز المغناطيس؟',
      fa: 'تقویت‌کننده آهنربا (Magnet) چیست؟',
      tr: 'Mıknatıs güçlendiricisi nedir?',
      es: '¿Qué es el potenciador Imán?',
      fr: 'Qu\'est-ce que le booster Aimant ?',
      zh: '什么是磁铁道具？',
      ru: 'Что такое бустер Магнит?',
      hi: 'मैग्नेट (Magnet) बूस्टर क्या है?'
    },
    a: {
      en: 'It automatically finds and collects a matching set of 3 tiles.',
      ur: 'یہ خود بخود 3 ایک جیسی ٹائلیں ڈھونڈ کر ٹرے میں رکھ دیتا ہے۔',
      ar: 'يجد تلقائياً ويجمع مجموعة مطابقة من 3 بلاطات.',
      fa: 'به طور خودکار مجموعه‌ای از ۳ کاشی مشابه را پیدا کرده و جمع‌آوری می‌کند.',
      tr: 'Otomatik olarak 3 eşleşen karoyu bulur ve toplar.',
      es: 'Encuentra y recoge automáticamente un conjunto coincidente de 3 fichas.',
      fr: 'Il trouve et collecte automatiquement un ensemble de 3 tuiles correspondantes.',
      zh: '它会自动找到并收集一组匹配的 3 个方块。',
      ru: 'Он автоматически находит и собирает совпадающий набор из 3 плиток.',
      hi: 'यह स्वचालित रूप से 3 समान टाइलों को ढूंढता है।'
    }
  },
  {
    id: 'faq_16',
    q: {
      en: 'Is this game free?',
      ur: 'کیا یہ گیم فری ہے؟',
      ar: 'هل هذه اللعبة مجانية؟',
      fa: 'آیا این بازی رایگان است؟',
      tr: 'Bu oyun ücretsiz mi?',
      es: '¿Este juego es gratis?',
      fr: 'Ce jeu est-il gratuit ?',
      zh: '这个游戏是免费的吗？',
      ru: 'Эта игра бесплатная?',
      hi: 'क्या यह गेम फ्री है?'
    },
    a: {
      en: 'Yes, the game is 100% free to play with optional in-game purchases.',
      ur: 'جی ہاں، یہ گیم بالکل فری ہے۔ آپ چاہیں تو کچھ چیزیں خرید سکتے ہیں۔',
      ar: 'نعم، اللعبة مجانية للعب بنسبة 100٪ مع عمليات شراء اختيارية.',
      fa: 'بله، بازی کاملاً رایگان است و خریدهای درون‌برنامه‌ای اختیاری دارد.',
      tr: 'Evet, oyun tamamen ücretsizdir ancak isteğe bağlı satın alımlar içerir.',
      es: 'Sí, el juego es 100% gratuito con compras opcionales dentro del juego.',
      fr: 'Oui, le jeu est 100 % gratuit avec des achats optionnels.',
      zh: '是的，游戏完全免费，附带可选的应用内购买。',
      ru: 'Да, игра 100% бесплатная с необязательными покупками в приложении.',
      hi: 'हाँ, यह गेम खेलने के लिए पूरी तरह से मुफ़्त है।'
    }
  },
  {
    id: 'faq_17',
    q: {
      en: 'How do I save my progress?',
      ur: 'میں گیم کا ڈیٹا کیسے سیو کروں؟',
      ar: 'كيف أحفظ تقدمي؟',
      fa: 'چگونه پیشرفت خود را ذخیره کنم؟',
      tr: 'İlerlememi nasıl kaydederim?',
      es: '¿Cómo guardo mi progreso?',
      fr: 'Comment sauvegarder ma progression ?',
      zh: '我该如何保存我的进度？',
      ru: 'Как сохранить свой прогресс?',
      hi: 'गेम प्रोग्रेस को कैसे सेव करें?'
    },
    a: {
      en: 'Your progress is automatically saved to your device.',
      ur: 'آپ کی گیم خود بخود آپ کے موبائل میں سیو ہو جاتی ہے۔',
      ar: 'يتم حفظ تقدمك تلقائيًا على جهازك.',
      fa: 'پیشرفت شما به صورت خودکار در دستگاه ذخیره می‌شود.',
      tr: 'İlerlemeniz otomatik olarak cihazınıza kaydedilir.',
      es: 'Tu progreso se guarda automáticamente en tu dispositivo.',
      fr: 'Votre progression est automatiquement sauvegardée sur votre appareil.',
      zh: '您的进度会自动保存到设备中。',
      ru: 'Ваш прогресс автоматически сохраняется на вашем устройстве.',
      hi: 'आपकी प्रोग्रेस आपके डिवाइस में अपने आप सेव हो जाती है।'
    }
  },
  {
    id: 'faq_18',
    q: {
      en: 'What are Worlds?',
      ur: 'ورلڈز (Worlds) کیا ہیں؟',
      ar: 'ما هي العوالم؟',
      fa: 'جهان‌ها (Worlds) چه هستند؟',
      tr: 'Dünyalar nedir?',
      es: '¿Qué son los Mundos?',
      fr: 'Que sont les Mondes ?',
      zh: '什么是世界？',
      ru: 'Что такое Миры?',
      hi: 'वर्ल्ड्स (Worlds) क्या हैं?'
    },
    a: {
      en: 'Different background themes and locations you unlock over time.',
      ur: 'یہ گیم کے مختلف خوبصورت مناظر ہیں جو آپ لیولز پاس کر کے کھولتے ہیں۔',
      ar: 'سمات ومواقع خلفية مختلفة تفتحها بمرور الوقت.',
      fa: 'تم‌ها و مکان‌های مختلفی که با گذشت زمان باز می‌کنید.',
      tr: 'Zamanla kilidini açtığınız farklı arka plan temaları ve konumlar.',
      es: 'Diferentes temas de fondo y ubicaciones que desbloqueas.',
      fr: 'Différents thèmes de fond et lieux que vous débloquez.',
      zh: '您会随着时间的推移解锁不同的背景主题和场景。',
      ru: 'Различные фоновые темы и локации, которые вы открываете.',
      hi: 'विभिन्न थीम जो आप समय के साथ अनलॉक करते हैं।'
    }
  },
  {
    id: 'faq_19',
    q: {
      en: 'How to unlock a new World?',
      ur: 'نئی دنیا (World) کیسے ان لاک کریں؟',
      ar: 'كيف أفتح عالماً جديداً؟',
      fa: 'چگونه یک جهان جدید باز کنم؟',
      tr: 'Yeni bir Dünya nasıl açılır?',
      es: '¿Cómo desbloquear un Mundo nuevo?',
      fr: 'Comment débloquer un nouveau Monde ?',
      zh: '如何解锁新世界？',
      ru: 'Как разблокировать новый Мир?',
      hi: 'नया वर्ल्ड कैसे अनलॉक करें?'
    },
    a: {
      en: 'Complete the required number of levels to travel to a new World.',
      ur: 'نئی جگہ پر جانے کے لیے درکار لیولز کو مکمل کریں۔',
      ar: 'أكمل عدد المستويات المطلوب للسفر إلى عالم جديد.',
      fa: 'برای سفر به یک جهان جدید، تعداد مراحل مورد نیاز را کامل کنید.',
      tr: 'Yeni bir Dünyaya seyahat etmek için gerekli seviyeleri tamamlayın.',
      es: 'Completa el número de niveles requerido para viajar a un Mundo nuevo.',
      fr: 'Terminez le nombre de niveaux requis pour voyager vers un nouveau Monde.',
      zh: '完成所需数量的关卡即可前往新世界。',
      ru: 'Пройдите необходимое количество уровней, чтобы отправиться в новый Мир.',
      hi: 'नए वर्ल्ड में जाने के लिए जरूरी लेवल पूरे करें।'
    }
  },
  {
    id: 'faq_20',
    q: {
      en: 'Can I play with friends?',
      ur: 'کیا میں دوستوں کے ساتھ کھیل سکتا ہوں؟',
      ar: 'هل يمكنني اللعب مع الأصدقاء؟',
      fa: 'آیا می‌توانم با دوستانم بازی کنم؟',
      tr: 'Arkadaşlarımla oynayabilir miyim?',
      es: '¿Puedo jugar con amigos?',
      fr: 'Puis-je jouer avec des amis ?',
      zh: '我可以和朋友一起玩吗？',
      ru: 'Могу ли я играть с друзьями?',
      hi: 'क्या मैं दोस्तों के साथ खेल सकता हूँ?'
    },
    a: {
      en: 'Currently it is a solo game, but you can compete on leaderboards!',
      ur: 'یہ اکیلے کھیلنے والی گیم ہے، لیکن آپ رینکنگ میں مقابلہ کر سکتے ہیں!',
      ar: 'حاليًا هي لعبة فردية، ولكن يمكنك المنافسة في لوحات المتصدرين!',
      fa: 'در حال حاضر این یک بازی تک‌نفره است، اما می‌توانید در جدول امتیازات رقابت کنید!',
      tr: 'Şu an için tek kişilik bir oyun, ancak skor tablolarında yarışabilirsiniz!',
      es: 'Actualmente es para un jugador, ¡pero puedes competir en las clasificaciones!',
      fr: 'C\'est actuellement un jeu solo, mais vous pouvez rivaliser dans les classements !',
      zh: '目前这是一个单人游戏，但您可以在排行榜上竞争！',
      ru: 'В настоящее время это одиночная игра, но вы можете соревноваться в таблицах лидеров!',
      hi: 'अभी यह सिंगल प्लेयर गेम है, पर आप रैंकिंग में मुकाबला कर सकते हैं!'
    }
  },
  {
    id: 'faq_21',
    q: {
      en: 'Are there leaderboards?',
      ur: 'کیا گیم میں رینکنگ/لیڈر بورڈ ہے؟',
      ar: 'هل توجد لوحات متصدرين؟',
      fa: 'آیا جدول امتیازات وجود دارد؟',
      tr: 'Skor tabloları var mı?',
      es: '¿Hay tablas de clasificación?',
      fr: 'Y a-t-il des classements ?',
      zh: '有排行榜吗？',
      ru: 'Есть ли таблицы лидеров?',
      hi: 'क्या लीडरबोर्ड हैं?'
    },
    a: {
      en: 'Yes! Collect stars to rank up globally against other players.',
      ur: 'جی ہاں! ستارے جمع کریں اور پوری دنیا کے کھلاڑیوں کا مقابلہ کریں۔',
      ar: 'نعم! اجمع النجوم للارتقاء عالميًا ضد اللاعبين الآخرين.',
      fa: 'بله! ستاره‌ها را جمع کنید تا در سطح جهانی رتبه بگیرید.',
      tr: 'Evet! Diğer oyunculara karşı küresel sıralamada yükselmek için yıldız toplayın.',
      es: '¡Sí! Recoge estrellas para subir de rango a nivel mundial.',
      fr: 'Oui ! Collectez des étoiles pour grimper dans le classement mondial.',
      zh: '是的！收集星星即可在全球排行榜上提升名次。',
      ru: 'Да! Собирайте звезды, чтобы повысить свой глобальный рейтинг.',
      hi: 'हाँ! अन्य खिलाड़ियों के खिलाफ ग्लोबल रैंक बढ़ाने के लिए स्टार्स इकट्ठा करें।'
    }
  },
  {
    id: 'faq_22',
    q: {
      en: 'How to turn off sound/music?',
      ur: 'میں آواز اور میوزک کیسے بند کروں؟',
      ar: 'كيف أوقف تشغيل الصوت / الموسيقى؟',
      fa: 'چگونه صدا/موسیقی را خاموش کنم؟',
      tr: 'Ses/Müzik nasıl kapatılır?',
      es: '¿Cómo apagar el sonido/música?',
      fr: 'Comment désactiver le son / la musique ?',
      zh: '如何关闭声音/音乐？',
      ru: 'Как отключить звук/музыку?',
      hi: 'साउंड/म्यूजिक कैसे बंद करें?'
    },
    a: {
      en: 'Tap the gear icon on the main screen to open Settings and adjust audio.',
      ur: 'مین سکرین پر گیئر ⚙️ آئیکن دبائیں اور سیٹنگز میں جا کر آواز بند کریں۔',
      ar: 'اضغط على أيقونة الترس على الشاشة الرئيسية لفتح الإعدادات وضبط الصوت.',
      fa: 'روی نماد چرخ‌دنده در صفحه اصلی ضربه بزنید تا تنظیمات باز شود.',
      tr: 'Ayarları açmak ve sesi ayarlamak için ana ekrandaki dişli simgesine dokunun.',
      es: 'Toca el ícono de engranaje en la pantalla principal para abrir Configuración.',
      fr: 'Appuyez sur l\'icône d\'engrenage sur l\'écran principal pour ouvrir les paramètres.',
      zh: '点击主屏幕上的齿轮图标以打开设置并调整音频。',
      ru: 'Нажмите на значок шестеренки на главном экране, чтобы открыть Настройки.',
      hi: 'सेटिंग्स खोलने के लिए मुख्य स्क्रीन पर गियर आइकन टैप करें।'
    }
  },
  {
    id: 'faq_23',
    q: {
      en: 'How do I change the language?',
      ur: 'میں گیم کی زبان (Language) کیسے بدلوں؟',
      ar: 'كيف أغير اللغة؟',
      fa: 'چگونه زبان را تغییر دهم؟',
      tr: 'Dili nasıl değiştiririm?',
      es: '¿Cómo cambio el idioma?',
      fr: 'Comment changer la langue ?',
      zh: '如何更改语言？',
      ru: 'Как изменить язык?',
      hi: 'भाषा कैसे बदलें?'
    },
    a: {
      en: 'You can change the language directly from this Help & Support menu.',
      ur: 'آپ زبان اسی "Help & Support" مینو کے سب سے اوپر سے بدل سکتے ہیں۔',
      ar: 'يمكنك تغيير اللغة مباشرة من قائمة المساعدة والدعم هذه.',
      fa: 'شما می‌توانید زبان را مستقیماً از این منوی پشتیبانی تغییر دهید.',
      tr: 'Dili doğrudan bu Yardım ve Destek menüsünden değiştirebilirsiniz.',
      es: 'Puedes cambiar el idioma directamente desde este menú de Ayuda y Soporte.',
      fr: 'Vous pouvez changer la langue directement depuis ce menu d\'aide.',
      zh: '您可以直接从此帮助与支持菜单中更改语言。',
      ru: 'Вы можете изменить язык прямо из этого меню Справки и Поддержки.',
      hi: 'आप इसी हेल्प मेनू से भाषा बदल सकते हैं।'
    }
  },
  {
    id: 'faq_24',
    q: {
      en: 'What are Stars used for?',
      ur: 'ستارے (Stars) کیا کام آتے ہیں؟',
      ar: 'ما هي النجوم المستخدمة ل؟',
      fa: 'ستاره‌ها برای چه استفاده می‌شوند؟',
      tr: 'Yıldızlar ne için kullanılır?',
      es: '¿Para qué sirven las estrellas?',
      fr: 'A quoi servent les étoiles ?',
      zh: '星星有什么用？',
      ru: 'Для чего нужны Звезды?',
      hi: 'स्टार्स (Stars) किस काम आते हैं?'
    },
    a: {
      en: 'Stars define your rank and tier in the global leaderboards.',
      ur: 'ستارے پوری دنیا کے لیڈر بورڈ میں آپ کا رینک اور درجہ بڑھاتے ہیں۔',
      ar: 'تحدد النجوم ترتيبك ومستواك في لوحات المتصدرين العالمية.',
      fa: 'ستاره‌ها رتبه شما را در جدول امتیازات جهانی تعیین می‌کنند.',
      tr: 'Yıldızlar, küresel sıralamalardaki rütbenizi belirler.',
      es: 'Las estrellas definen tu rango en las clasificaciones mundiales.',
      fr: 'Les étoiles définissent votre rang dans les classements mondiaux.',
      zh: '星星决定了您在全球排行榜中的等级和排名。',
      ru: 'Звезды определяют ваш ранг в глобальных списках лидеров.',
      hi: 'स्टार्स लीडरबोर्ड में आपकी रैंक तय करते हैं।'
    }
  },
  {
    id: 'faq_25',
    q: {
      en: 'I found a bug, what should I do?',
      ur: 'گیم میں کوئی خرابی/بگ ہے، میں کیا کروں؟',
      ar: 'لقد وجدت خطأ، ماذا أفعل؟',
      fa: 'من یک باگ پیدا کردم، چه کار کنم؟',
      tr: 'Bir hata buldum, ne yapmalıyım?',
      es: 'Encontré un error, ¿qué debo hacer?',
      fr: 'J\'ai trouvé un bug, que dois-je faire ?',
      zh: '我发现了一个错误，该怎么办？',
      ru: 'Я нашел ошибку, что мне делать?',
      hi: 'गेम में कोई दिक्कत है, क्या करूँ?'
    },
    a: {
      en: 'Tap "Contact Our Team" below and select the Bug category to report it.',
      ur: 'نیچے "Contact Our Team" پر کلک کریں اور ہمیں اس مسئلے کے بارے میں بتائیں۔',
      ar: 'اضغط على "اتصل بفريقنا" أدناه للإبلاغ عنه.',
      fa: 'روی «تماس با تیم ما» در زیر کلیک کنید تا آن را گزارش دهید.',
      tr: 'Bunu bildirmek için aşağıdaki "Ekibimizle İletişime Geçin"e dokunun.',
      es: 'Toca "Contacta a nuestro equipo" a continuación para informarlo.',
      fr: 'Appuyez sur "Contacter notre équipe" ci-dessous pour le signaler.',
      zh: '点击下方的“联系我们的团队”并选择错误类别进行报告。',
      ru: 'Нажмите «Связаться с нашей командой» ниже, чтобы сообщить об этом.',
      hi: 'रिपोर्ट करने के लिए "हमसे संपर्क करें" बटन दबाएं।'
    }
  },
  {
    id: 'faq_26',
    q: {
      en: 'Transfer progress to a new phone?',
      ur: 'میں نیا موبائل لوں تو گیم کا ڈیٹا کیسے لاؤں؟',
      ar: 'نقل التقدم إلى هاتف جديد؟',
      fa: 'انتقال پیشرفت به یک گوشی جدید؟',
      tr: 'İlerlemeyi yeni bir telefona mı aktarmak?',
      es: '¿Transferir progreso a un nuevo teléfono?',
      fr: 'Transférer la progression sur un nouveau téléphone ?',
      zh: '如何将进度转移到新手机？',
      ru: 'Как перенести прогресс на новый телефон?',
      hi: 'नए फोन में प्रोग्रेस कैसे ट्रांसफर करें?'
    },
    a: {
      en: 'Cloud save is coming soon! Keep an eye on the settings menu for updates.',
      ur: 'کلاؤڈ سیو کا فیچر جلد آ رہا ہے! مزید اپڈیٹس کے لیے ہمارے ساتھ رہیں۔',
      ar: 'الحفظ السحابي قادم قريباً! ترقبوا التحديثات.',
      fa: 'ذخیره ابری به زودی اضافه می‌شود! منتظر به‌روزرسانی‌ها باشید.',
      tr: 'Bulut kaydı çok yakında! Güncellemeler için takipte kalın.',
      es: '¡El guardado en la nube llegará pronto! Mantente atento a las actualizaciones.',
      fr: 'La sauvegarde dans le cloud arrive bientôt ! Restez à l\'écoute.',
      zh: '云保存功能即将推出！请留意设置菜单中的更新。',
      ru: 'Облачное сохранение скоро появится! Следите за обновлениями.',
      hi: 'क्लाउड सेव जल्द ही आ रहा है! सेटिंग्स मेनू देखते रहें।'
    }
  },
  {
    id: 'faq_27',
    q: {
      en: 'How to remove Ads?',
      ur: 'میں گیم سے اشتہارات (Ads) کیسے ختم کروں؟',
      ar: 'كيف أزيل الإعلانات؟',
      fa: 'چگونه تبلیغات را حذف کنم؟',
      tr: 'Reklamlar nasıl kaldırılır?',
      es: '¿Cómo eliminar los anuncios?',
      fr: 'Comment supprimer les publicités ?',
      zh: '如何去除广告？',
      ru: 'Как убрать рекламу?',
      hi: 'विज्ञापन (Ads) कैसे हटाएं?'
    },
    a: {
      en: 'You can purchase the "No Ads" pack from the in-game Shop.',
      ur: 'آپ شاپ (Shop) میں جا کر "No Ads" کا پیک خرید سکتے ہیں۔',
      ar: 'يمكنك شراء حزمة "بدون إعلانات" من المتجر داخل اللعبة.',
      fa: 'می‌توانید بسته "بدون تبلیغات" را از فروشگاه داخل بازی خریداری کنید.',
      tr: 'Oyun içi mağazadan "Reklamsız" paketini satın alabilirsiniz.',
      es: 'Puedes comprar el paquete "Sin anuncios" en la Tienda del juego.',
      fr: 'Vous pouvez acheter le pack "Sans pub" dans la boutique du jeu.',
      zh: '您可以在游戏内商店购买“去广告”礼包。',
      ru: 'Вы можете купить пакет «Без рекламы» во внутриигровом магазине.',
      hi: 'आप शॉप से "नो एड्स" पैक खरीद सकते हैं।'
    }
  },
  {
    id: 'faq_28',
    q: {
      en: 'How to earn free gems?',
      ur: 'مفت جیمز کیسے کماؤں؟',
      ar: 'كيف تكسب جواهر مجانية؟',
      fa: 'چگونه جواهرات رایگان به دست آورم؟',
      tr: 'Ücretsiz mücevher nasıl kazanılır?',
      es: '¿Cómo ganar gemas gratis?',
      fr: 'Comment gagner des gemmes gratuites ?',
      zh: '如何免费获得宝石？',
      ru: 'Как заработать бесплатные самоцветы?',
      hi: 'मुफ्त रत्न कैसे कमाएं?'
    },
    a: {
      en: 'Complete your daily missions and claim achievement milestones for free gems.',
      ur: 'مفت جیمز کے لیے روزانہ کے مشنز اور اچیومنٹس مکمل کریں۔',
      ar: 'أكمل مهامك اليومية واحصل على إنجازاتك للحصول على جواهر مجانية.',
      fa: 'ماموریت‌های روزانه را کامل کنید تا جواهرات رایگان دریافت کنید.',
      tr: 'Ücretsiz mücevherler için günlük görevleri ve başarıları tamamlayın.',
      es: 'Completa misiones diarias y logros para obtener gemas gratis.',
      fr: 'Terminez des missions pour obtenir des gemmes gratuites.',
      zh: '完成您的日常任务即可获得免费宝石。',
      ru: 'Выполняйте ежедневные миссии, чтобы получить бесплатные самоцветы.',
      hi: 'मुफ़्त रत्नों के लिए रोज़ाना मिशन पूरे करें।'
    }
  },
  {
    id: 'faq_29',
    q: {
      en: 'Are there special events?',
      ur: 'کیا گیم میں خاص ایونٹس ہوتے ہیں؟',
      ar: 'هل توجد أحداث خاصة؟',
      fa: 'آیا رویدادهای ویژه‌ای وجود دارد؟',
      tr: 'Özel etkinlikler var mı?',
      es: '¿Hay eventos especiales?',
      fr: 'Y a-t-il des événements spéciaux ?',
      zh: '有特别活动吗？',
      ru: 'Есть ли специальные события?',
      hi: 'क्या कोई विशेष इवेंट (Events) हैं?'
    },
    a: {
      en: 'Yes! We host weekend tournaments and holiday specials with big prizes.',
      ur: 'جی ہاں! ہم ویک اینڈ ٹورنامنٹ اور تہواروں پر خاص ایونٹ کرواتے ہیں۔',
      ar: 'نعم! نحن نستضيف بطولات في عطلة نهاية الأسبوع وجوائز كبرى.',
      fa: 'بله! ما مسابقات آخر هفته را با جوایز بزرگ برگزار می‌کنیم.',
      tr: 'Evet! Büyük ödüllü hafta sonu turnuvaları düzenliyoruz.',
      es: '¡Sí! Organizamos torneos de fin de semana con grandes premios.',
      fr: 'Oui ! Nous organisons des tournois avec de gros prix.',
      zh: '是的！我们会举办带有大奖的周末锦标赛和节日特别活动。',
      ru: 'Да! Мы проводим турниры выходного дня с большими призами.',
      hi: 'हाँ! हम बड़े इनाम वाले वीकेंड टूर्नामेंट आयोजित करते हैं।'
    }
  },
  {
    id: 'faq_30',
    q: {
      en: 'How to contact the developer?',
      ur: 'گیم بنانے والوں سے رابطہ کیسے کریں؟',
      ar: 'كيف اتصل بالمطور؟',
      fa: 'چگونه با توسعه‌دهنده تماس بگیرم؟',
      tr: 'Geliştiriciyle nasıl iletişime geçilir?',
      es: '¿Cómo contactar al desarrollador?',
      fr: 'Comment contacter le développeur ?',
      zh: '如何联系开发者？',
      ru: 'Как связаться с разработчиком?',
      hi: 'डेवलपर से संपर्क कैसे करें?'
    },
    a: {
      en: 'Use the "Contact Our Team" button at the bottom of this page.',
      ur: 'اس پیج کے سب سے نیچے موجود "Contact Our Team" والے بٹن کا استعمال کریں۔',
      ar: 'استخدم زر "اتصل بفريقنا" الموجود أسفل هذه الصفحة.',
      fa: 'از دکمه «تماس با تیم ما» در پایین این صفحه استفاده کنید.',
      tr: 'Bu sayfanın altındaki "Ekibimizle İletişime Geçin" düğmesini kullanın.',
      es: 'Usa el botón "Contacta a nuestro equipo" al final de esta página.',
      fr: 'Utilisez le bouton "Contacter notre équipe" au bas de cette page.',
      zh: '请使用本页底部的“联系我们的团队”按钮。',
      ru: 'Используйте кнопку «Связаться с нашей командой» внизу этой страницы.',
      hi: 'इस पेज के नीचे "हमसे संपर्क करें" बटन का उपयोग करें।'
    }
  }
];
