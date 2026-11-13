import { SITE_NAME } from '@/utilities/seo'

/**
 * Legal identity of the publication.
 *
 * Replace every value in square brackets with the real information before
 * launch. Keeping the placeholders in one file makes that a single edit.
 */
export const LEGAL_INFO = {
  siteName: SITE_NAME,
  publisher: '[Naziv izdavača / pravno lice]',
  address: '[Ulica i broj], [Poštanski broj] [Grad], Srbija',
  email: 'redakcija@infotaktik.rs',
  phone: '[Telefon redakcije]',
  editorInChief: '[Ime i prezime glavnog i odgovornog urednika]',
  registrationNumber: '[Matični broj]',
  taxId: '[PIB]',
  registrationAuthority: '[Naziv registra / APR]',
  hosting: '[Naziv i adresa hosting provajdera]',
  lastUpdated: '13. novembar 2026.',
} as const

export { LEGAL_LINKS } from './legalLinks'
export type { LegalLinkKey } from './legalLinks'

export type LegalSection = {
  id: string
  title: string
  paragraphs?: string[]
  list?: string[]
  note?: string
}

export const IMPRESSUM_SECTIONS: LegalSection[] = [
  {
    id: 'izdavac',
    title: 'Izdavač',
    paragraphs: [
      `${LEGAL_INFO.siteName} je elektronski medij koji izdaje ${LEGAL_INFO.publisher}.`,
    ],
    list: [
      `Izdavač: ${LEGAL_INFO.publisher}`,
      `Sedište: ${LEGAL_INFO.address}`,
      `Matični broj: ${LEGAL_INFO.registrationNumber}`,
      `PIB: ${LEGAL_INFO.taxId}`,
      `Registracija: ${LEGAL_INFO.registrationAuthority}`,
    ],
  },
  {
    id: 'redakcija',
    title: 'Redakcija',
    paragraphs: [
      'Redakcija odgovara za sadržaj objavljen na sajtu i za poštovanje uređivačkih i etičkih standarda.',
    ],
    list: [
      `Glavni i odgovorni urednik: ${LEGAL_INFO.editorInChief}`,
      `Email: ${LEGAL_INFO.email}`,
      `Telefon: ${LEGAL_INFO.phone}`,
      'Radno vreme redakcije: radnim danima od 09.00 do 17.00 časova.',
    ],
  },
  {
    id: 'priroda-publikacije',
    title: 'Priroda publikacije',
    paragraphs: [
      `${LEGAL_INFO.siteName} je nezavisni internet magazin posvećen analizama, pričama i praktičnim savetima iz oblasti tehnologije, biznisa, kulture i savremenog života.`,
      'Sadržaj je informativnog karaktera i ne predstavlja pravni, finansijski ili drugi profesionalni savet. Za odluke donete na osnovu objavljenih informacija odgovornost snosi čitalac.',
    ],
  },
  {
    id: 'autorska-prava',
    title: 'Autorska prava',
    paragraphs: [
      `Svi tekstovi, fotografije, ilustracije, grafički elementi, logotipi i drugi materijali objavljeni na sajtu ${LEGAL_INFO.siteName} vlasništvo su izdavača ili se koriste uz dozvolu nosilaca prava.`,
      'Zabranjeno je kopiranje, reprodukovanje, distribucija, objavljivanje ili bilo kakvo drugo korišćenje sadržaja bez prethodne pismene dozvole izdavača, osim u slučajevima dozvoljenim zakonom.',
    ],
    note: 'Kratki citati uz jasno naveden izvor i link ka originalnom članku su dozvoljeni.',
  },
  {
    id: 'hosting',
    title: 'Hosting i tehnički podaci',
    paragraphs: [`Sajt je hostovan kod pružaoca usluga: ${LEGAL_INFO.hosting}.`],
  },
  {
    id: 'odgovornost',
    title: 'Ograničenje odgovornosti',
    paragraphs: [
      'Redakcija se trudi da objavljene informacije budu tačne i ažurne, ali ne garantuje njihovu potpunost niti odgovornost za eventualnu štetu nastalu korišćenjem sadržaja sajta.',
      'Sajt može sadržati linkove ka spoljnim internet stranicama. Redakcija ne kontroliše njihov sadržaj i ne odgovara za sadržaj, dostupnost ili politiku privatnosti tih stranica.',
    ],
  },
  {
    id: 'izmene',
    title: 'Izmene impresuma',
    paragraphs: [
      'Impresum se može povremeno menjati u skladu sa promenama u poslovanju, zakonskim obavezama ili organizaciji redakcije. Važeća verzija je uvek objavljena na ovoj stranici.',
    ],
  },
]

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: 'rukovalac',
    title: 'Ko upravlja vašim podacima',
    paragraphs: [
      `Rukovalac podacima o ličnosti je ${LEGAL_INFO.publisher}, sa sedištem na adresi ${LEGAL_INFO.address}.`,
      `Za sva pitanja u vezi sa obradom podataka možete nam se obratiti na ${LEGAL_INFO.email}.`,
    ],
  },
  {
    id: 'podaci',
    title: 'Koje podatke prikupljamo',
    paragraphs: [
      'Prikupljamo samo podatke koji su potrebni za funkcionisanje sajta i komunikaciju sa čitaocima.',
    ],
    list: [
      'Podaci koje nam sami pošaljete putem kontakt forme: ime, email adresa, telefon (ako ga unesete) i sadržaj poruke.',
      'Podaci iz komentara: ime, email adresa i sadržaj komentara.',
      'Tehnički podaci: IP adresa, tip uređaja i pregledača, vreme pristupa i posećene stranice.',
      'Neophodni kolačići: podešavanje svetle ili tamne teme i tehnički podaci potrebni za rad sajta.',
    ],
  },
  {
    id: 'svrha',
    title: 'Zašto obrađujemo podatke i po kom osnovu',
    paragraphs: ['Podatke obrađujemo na osnovu zakona, vaše saglasnosti ili legitimnog interesa.'],
    list: [
      'Odgovaranje na poruke i pitanja čitalaca — legitimni interes i izvršenje vašeg zahteva.',
      'Objavljivanje i moderisanje komentara — legitimni interes za vođenje javne diskusije.',
      'Obezbeđivanje bezbednosti sajta i sprečavanje zloupotreba — legitimni interes.',
      'Ispunjavanje zakonskih obaveza — pravna obaveza.',
      'Analitika i poboljšanje sadržaja — samo uz vašu prethodnu saglasnost, ako je analitika aktivna.',
    ],
  },
  {
    id: 'kolacici',
    title: 'Kolačići i analitika',
    paragraphs: [
      'Sajt koristi neophodne kolačiće koji omogućavaju osnovne funkcije, kao što je pamćenje izabrane teme. Ovi kolačići ne služe za praćenje korisnika.',
      'Ako u budućnosti budemo koristili alate za analitiku ili oglašavanje, biće aktivirani samo uz vašu prethodnu saglasnost, koju ćete moći da povučete u svakom trenutku.',
      'Kolačiće možete obrisati ili blokirati u podešavanjima svog pregledača. Blokiranje neophodnih kolačića može uticati na rad sajta.',
    ],
  },
  {
    id: 'deljenje',
    title: 'Kome možemo otkriti podatke',
    paragraphs: [
      'Vaše podatke ne prodajemo i ne iznajmljujemo trećim licima. Podaci mogu biti dostupni samo pružaocima usluga koji nam pomažu u radu sajta, i to u meri neophodnoj za pružanje usluge:',
    ],
    list: [
      'Pružalac hostinga i infrastrukture.',
      'Pružalac usluge za slanje email poruka.',
      'Pružalac analitike, ako je analitika aktivna uz vašu saglasnost.',
      'Nadležni državni organi, kada postoji zakonska obaveza.',
    ],
  },
  {
    id: 'cuvanje',
    title: 'Koliko dugo čuvamo podatke',
    list: [
      'Poruke poslate putem kontakt forme čuvamo do 12 meseci od poslednje komunikacije.',
      'Komentare čuvamo dok su objavljeni ili dok ih ne uklonimo na vaš zahtev.',
      'Tehničke logove čuvamo do 30 dana, osim kada su potrebni za istragu bezbednosnog incidenta.',
      'Podatke čije čuvanje zahteva zakon čuvamo u zakonom propisanom roku.',
    ],
  },
  {
    id: 'prava',
    title: 'Vaša prava',
    paragraphs: [
      'U skladu sa Zakonom o zaštiti podataka o ličnosti imate pravo da od nas zatražite pristup, ispravku, brisanje ili ograničenje obrade svojih podataka, kao i pravo na prenosivost i prigovor.',
      'Zahtev možete poslati na email adresu iz odeljka „Kontakt“. Odgovorićemo u zakonskom roku. Ako smatrate da vaša prava nisu poštovana, možete se obratiti Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti Republike Srbije.',
    ],
  },
  {
    id: 'bezbednost',
    title: 'Bezbednost podataka',
    paragraphs: [
      'Primenjujemo razumne tehničke i organizacione mere zaštite podataka, uključujući šifrovanu komunikaciju (HTTPS), kontrolu pristupa i ograničenje čuvanja podataka na neophodni period.',
      'Nijedan prenos podataka preko interneta nije potpuno bezbedan, ali se trudimo da primenimo mere srazmerne riziku.',
    ],
  },
  {
    id: 'deca',
    title: 'Podaci dece',
    paragraphs: [
      'Sajt nije namenjen deci mlađoj od 16 godina i ne prikupljamo svesno njihove podatke. Ako saznamo da smo prikupili podatke deteta bez odgovarajuće saglasnosti, uklonićemo ih u najkraćem roku.',
    ],
  },
  {
    id: 'izmene',
    title: 'Izmene politike privatnosti',
    paragraphs: [
      'Politiku privatnosti možemo povremeno ažurirati. Nova verzija stupa na snagu danom objavljivanja na ovoj stranici, a datum poslednje izmene je naveden na vrhu stranice.',
    ],
  },
]

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: 'prihvatanje',
    title: 'Prihvatanje uslova',
    paragraphs: [
      `Korišćenjem sajta ${LEGAL_INFO.siteName} potvrđujete da ste pročitali, razumeli i prihvatili ove Uslove korišćenja. Ako se ne slažete sa uslovima, molimo vas da ne koristite sajt.`,
    ],
  },
  {
    id: 'sadrzaj',
    title: 'Sadržaj i intelektualna svojina',
    paragraphs: [
      `Svi tekstovi, fotografije, ilustracije, video materijali, grafički elementi, logotipi, dizajn sajta i drugi materijali objavljeni na sajtu ${LEGAL_INFO.siteName} isključivo su vlasništvo izdavača ili se koriste uz dozvolu nosilaca prava.`,
      'Zabranjeno je kopiranje, reprodukovanje, distribucija, javno saopštavanje, izmena ili komercijalno korišćenje bilo kog dela sadržaja bez prethodne pismene dozvole izdavača.',
      'Dozvoljeno je deljenje linkova ka člancima i kratko citiranje uz obavezno navođenje izvora i linka ka originalnom sadržaju. Automatsko prikupljanje sadržaja (scraping) i korišćenje sadržaja za obuku veštačke inteligencije bez dozvole nisu dozvoljeni.',
    ],
  },
  {
    id: 'koriscenje',
    title: 'Dozvoljeno korišćenje',
    list: [
      'Čitanje i pregledanje sadržaja u lične, nekomercijalne svrhe.',
      'Deljenje linkova ka sadržaju na društvenim mrežama i drugim platformama.',
      'Kratko citiranje uz jasno naveden izvor i link.',
      'Komentarisanje u skladu sa pravilima iz ovih uslova.',
    ],
  },
  {
    id: 'zabranjeno',
    title: 'Zabranjeno ponašanje',
    list: [
      'Neovlašćeno kopiranje ili objavljivanje celih članaka ili većih delova sadržaja.',
      'Automatsko prikupljanje podataka i sadržaja bez dozvole.',
      'Objavljivanje uvredljivog, diskriminatornog, nasilnog ili nezakonitog sadržaja u komentarima.',
      'Lažno predstavljanje, spam, reklamiranje i narušavanje rada sajta.',
      'Pokušaj neovlašćenog pristupa administraciji, serverima ili podacima drugih korisnika.',
    ],
  },
  {
    id: 'komentari',
    title: 'Komentari i korisnički sadržaj',
    paragraphs: [
      'Komentari su dobrodošli kao deo javne diskusije. Zadržavamo pravo da uklonimo ili ne objavimo komentar koji krši ove uslove, sadrži uvrede, govor mržnje, spam ili nezakonit sadržaj.',
      'Objavljivanjem komentara dajete nam neekskluzivno pravo da ga prikažemo na sajtu i u povezanim kanalima. Odgovornost za sadržaj komentara snosi autor komentara.',
    ],
  },
  {
    id: 'tacnost',
    title: 'Tačnost informacija',
    paragraphs: [
      'Sadržaj sajta je informativnog karaktera. Trudimo se da informacije budu tačne i ažurne, ali ne garantujemo njihovu potpunost, tačnost ni primenljivost u konkretnoj situaciji.',
      'Sadržaj ne predstavlja pravni, finansijski, medicinski ili drugi profesionalni savet. Za odluke donete na osnovu objavljenih informacija odgovornost snosi čitalac.',
    ],
  },
  {
    id: 'linkovi',
    title: 'Spoljni linkovi',
    paragraphs: [
      'Sajt može sadržati linkove ka internet stranicama trećih lica. Ne kontrolišemo njihov sadržaj i ne odgovaramo za njihovu dostupnost, tačnost ni politiku privatnosti.',
    ],
  },
  {
    id: 'odgovornost',
    title: 'Ograničenje odgovornosti',
    paragraphs: [
      `Izdavač ne odgovara za direktnu ili indirektnu štetu nastalu korišćenjem ili nemogućnošću korišćenja sajta, uključujući gubitak podataka, prihoda ili poslovne mogućnosti, u meri dozvoljenoj zakonom.`,
    ],
  },
  {
    id: 'izmene',
    title: 'Izmene uslova',
    paragraphs: [
      'Zadržavamo pravo da povremeno izmenimo ove Uslove korišćenja. Izmene stupaju na snagu danom objavljivanja na ovoj stranici. Nastavak korišćenja sajta nakon izmene znači prihvatanje novih uslova.',
    ],
  },
  {
    id: 'pravo',
    title: 'Merodavno pravo',
    paragraphs: [
      'Na ove Uslove korišćenja primenjuje se pravo Republike Srbije. Za sporove je nadležan sud u sedištu izdavača, osim ako zakon propisuje drugačije.',
    ],
  },
]
