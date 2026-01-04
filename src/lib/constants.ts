
export const EXAM_TYPES = {
    TYT: 'TYT',
    AYT: 'AYT'
} as const

export const STUDY_FIELDS = {
    SAYISAL: 'SAYISAL',
    ESIT_AGIRLIK: 'ESIT_AGIRLIK',
    SOZEL: 'SOZEL',
    DIL: 'DIL'
} as const

export const SUBJECTS_BY_TYPE = {
    [EXAM_TYPES.TYT]: [
        { label: 'Matematik', value: 'Matematik' },
        { label: 'Türkçe', value: 'Türkçe' },
        { label: 'Fizik', value: 'Fizik' },
        { label: 'Kimya', value: 'Kimya' },
        { label: 'Biyoloji', value: 'Biyoloji' },
        { label: 'Tarih', value: 'Tarih' },
        { label: 'Coğrafya', value: 'Coğrafya' },
        { label: 'Felsefe', value: 'Felsefe' },
        { label: 'Din Kültürü', value: 'Din Kültürü' }
    ],
    [EXAM_TYPES.AYT]: [
        { label: 'Matematik', value: 'Matematik' },
        { label: 'Fizik', value: 'Fizik' },
        { label: 'Kimya', value: 'Kimya' },
        { label: 'Biyoloji', value: 'Biyoloji' },
        { label: 'Edebiyat', value: 'Edebiyat' },
        { label: 'Tarih-1', value: 'Tarih-1' },
        { label: 'Coğrafya-1', value: 'Coğrafya-1' },
        { label: 'Tarih-2', value: 'Tarih-2' },
        { label: 'Coğrafya-2', value: 'Coğrafya-2' },
        { label: 'Felsefe Grubu', value: 'Felsefe Grubu' },
        { label: 'Yabancı Dil', value: 'Yabancı Dil' }
    ]
}

export const SUBJECTS_BY_FIELD = {
    [STUDY_FIELDS.SAYISAL]: ['Matematik', 'Fizik', 'Kimya', 'Biyoloji'],
    [STUDY_FIELDS.ESIT_AGIRLIK]: ['Matematik', 'Edebiyat', 'Tarih-1', 'Coğrafya-1'],
    [STUDY_FIELDS.SOZEL]: ['Edebiyat', 'Tarih-1', 'Coğrafya-1', 'Tarih-2', 'Coğrafya-2', 'Felsefe Grubu'],
    [STUDY_FIELDS.DIL]: ['Yabancı Dil']
}

// Simplified topic lists for demonstration
export const TOPICS_BY_SUBJECT: Record<string, string[]> = {
    'Matematik': ['Temel Kavramlar', 'Sayı Basamakları', 'Bölme Bölünebilme', 'EBOB-EKOK', 'Rasyonel Sayılar', 'Basit Eşitsizlikler', 'Mutlak Değer', 'Üslü Sayılar', 'Köklü Sayılar', 'Çarpanlara Ayırma', 'Oran Orantı', 'Denklem Çözme', 'Problemler', 'Kümeler', 'Fonksiyonlar', 'Polinomlar', '2. Dereceden Denklemler', 'Parabol', 'Trigonometri', 'Logaritma', 'Diziler', 'Limit', 'Türev', 'İntegral'],
    'Türkçe': ['Sözcükte Anlam', 'Cümlede Anlam', 'Paragraf', 'Ses Bilgisi', 'Yazım Kuralları', 'Noktalama İşaretleri', 'Sözcükte Yapı', 'İsimler', 'Sıfatlar', 'Zamirler', 'Zarflar', 'Edat-Bağlaç-Ünlem', 'Fiiller', 'Fiilimsiler', 'Cümlenin Ögeleri', 'Cümle Türleri', 'Anlatım Bozuklukları'],
    'Fizik': ['Fizik Bilimine Giriş', 'Madde ve Özellikleri', 'Kuvvet ve Hareket', 'İş, Güç, Enerji', 'Isı ve Sıcaklık', 'Basınç', 'Kaldırma Kuvveti', 'Elektrik', 'Manyetisma', 'Optik', 'Dalgalar', 'Çembersel Hareket', 'Basit Harmonik Hareket'],
    'Kimya': ['Kimya Bilimi', 'Atom ve Periyodik Sistem', 'Kimyasal Türler Arası Etkileşimler', 'Maddenin Halleri', 'Doğa ve Kimya', 'Kimya Kanunları', 'Karışımlar', 'Asitler, Bazlar ve Tuzlar', 'Kimya Her Yerde', 'Modern Atom Teorisi', 'Gazlar', 'Sıvı Çözeltiler', 'Kimyasal Tepkimelerde Enerji', 'Kimyasal Tepkimelerde Hız', 'Kimyasal Denge', 'Elektrokimya', 'Organik Kimya'],
    'Biyoloji': ['Yaşam Bilimi Biyoloji', 'Hücre', 'Canlılar Dünyası', 'Hücre Bölünmeleri', 'Kalıtım', 'Ekosistem Ekolojisi', 'İnsan Fizyolojisi', 'Bitki Biyolojisi', 'Canlılar ve Çevre'],
    'Edebiyat': ['Giriş', 'Hikaye', 'Şiir', 'Makale', 'Sohbet', 'Fıkra', 'Eleştiri', 'Mülakat', 'Röportaj', 'Tiyatro', 'Roman', 'Masal/Fabl', 'Mektup/Günlük', 'Gezi Yazısı', 'Biyografi/Otobiyografi', 'Halk Edebiyatı', 'Divan Edebiyatı', 'Tanzimat Edebiyatı', 'Servet-i Fünun', 'Milli Edebiyat', 'Cumhuriyet Dönemi'],
    'Tarih': ['Tarih ve Zaman', 'İnsanlığın İlk Dönemleri', 'Orta Çağda Dünya', 'İlk ve Orta Çağlarda Türk Dünyası', 'İslam Medeniyetinin Doğuşu', 'Türklerin İslamiyeti Kabulü'],
    'Tarih-1': ['Tarih Bilimine Giriş', 'İlk Uygarlıklar', 'İlk Türk Devletleri', 'İslam Tarihi', 'Türk İslam Tarihi', 'Osmanlı Kuruluş', 'Osmanlı Yükselme'],
    'Coğrafya': ['Doğa ve İnsan', 'Dünyanın Şekli ve Hareketleri', 'Coğrafi Konum', 'Harita Bilgisi', 'Atmosfer ve İklim', 'İç Kuvvetler', 'Dış Kuvvetler'],
    'Coğrafya-1': ['Ekosistem', 'Biyoçeşitlilik', 'Nüfus Politikaları', 'Yerleşme', 'Ekonomik Faaliyetler', 'Doğal Kaynaklar'],
    // Add default topics for others to prevent errors
    'Felsefe': ['Felsefenin Alanı', 'Bilgi Felsefesi', 'Bilim Felsefesi', 'Varlık Felsefesi', 'Ahlak Felsefesi', 'Siyaset Felsefesi', 'Sanat Felsefesi', 'Din Felsefesi'],
    'Din Kültürü': ['Bilgi ve İnanç', 'Din ve İslam', 'İslam ve İbadet', 'Gençlik ve Değerler', 'Gönül Coğrafyamız'],
    'Tarih-2': ['Beylikten Devlete', 'Dünya Gücü Osmanlı', 'Arayış Yılları', 'Değişim ve Diplomasi', 'En Uzun Yüzyıl'],
    'Coğrafya-2': ['Türkiye Coğrafyası', 'Ulaşım', 'Ticaret', 'Turizm', 'Bölgeler'],
    'Felsefe Grubu': ['Psikoloji', 'Sosyoloji', 'Mantık'],
    'Yabancı Dil': ['Grammar', 'Vocabulary', 'Reading Skills', 'Translation']
}

export const getSubjects = (examType: string, field?: string) => {
    let subjects = SUBJECTS_BY_TYPE[examType as keyof typeof SUBJECTS_BY_TYPE] || []
    
    if (examType === EXAM_TYPES.AYT && field && field in SUBJECTS_BY_FIELD) {
        const allowedSubjects = SUBJECTS_BY_FIELD[field as keyof typeof SUBJECTS_BY_FIELD]
        subjects = subjects.filter(s => allowedSubjects.includes(s.value))
    }
    
    return subjects
}
