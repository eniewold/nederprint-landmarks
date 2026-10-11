# Vuurtoren J.C.J. van Speijk — Egmond aan Zee

Neoclassicistische tombe met leeuw, hoekornamenten, gedenkstenen en ingang; taps toelopende ronde schacht met zeezijdige patrijspoorten; uitkragend veelhoekig kustwachtlokaal, lantaarn en bolkap. De platformmuur en entreestappen zijn een eigen `road:`-node. Vier gesloten nodes, opgebouwd uit prisma's, omhullingen en omwentelingsprofielen, zonder gestapelde AHN-lagen.

## Meting en schattingen

RD-oorsprong `[103158.24, 514884.4]`, +X `[0.97066064, -0.24045358]` langs de BAG-gevel naar de landzijdige ingang; −X wijst naar zee. Het oorspronkelijke backlogmiddelpunt lag circa 15 m zuidelijker en is voor de controlekaart gecorrigeerd. BAG `0373100000016150` wordt vervangen. De tombe meet circa 10,3 × 10,3 m op de BAG-contour; de platformrand circa 17 × 17 m op de ortho.

De Nederlandse Vuurtoren Vereniging noemt **28 m objecthoogte**. Het AHN meet echter een top NAP **+44,598 m**, boven een lokaal duin van circa **+12,75 m**. Het model volgt die gemeten totale omhullende: **31,85 m inclusief tombe en makelaar**. De definitie achter het verschil met 28 m is niet vastgesteld; die bronmaat is afzonderlijk in de JSON bewaard. Dunne antennes zijn niet gebruikt om het hoofdvolume op te trekken.

De voetdiameter van de schacht is 6,1 m en loopt naar circa 3,8 m bovenaan. De belangrijkste hoogtes zijn geschat binnen de AHN-omhullende en gecontroleerd op recente en historische schuine foto's: tombe 4,5 m, schacht 24,15 m, kustwachtkamer 24,95–27,15 m, lantaarn 29,7 m en koepel 31,1 m. Kamerbreedte 5,4–6,9 m. Patrijspoorten, ornamenten, leeuwvorm, deur- en plaatmaten zijn fotogrammetrische benaderingen, geen bouwtekeningmaten. De bron bevestigt dat de kustwachtkamer uit 1967 bij het huidige silhouet hoort.

De kaart bemonstert het oorspronkelijke terrein op vier punten binnen het omringende platform. Laagste PDOK-hoogte **55,424322 m ellipsoïdisch**, offset −0,10 m; modelvoet −0,25 m. Het bestaande duin blijft behouden.

## Print en controles

`node scripts/generate-vuurtoren-egmond.mjs` schrijft GLB, JSON en een STL op 1:1000 van circa **17,1 × 17,0 × 32,1 mm**. De drie gebouw-nodes zijn elk verbonden en `NoError`; de platformmuur en stappen verbinden via het terrein. Nisdieptes zijn circa 0,35 m; makelaar, leeuwpoten en platformmuur minstens 0,9 m. De kustwachtkamer staat op een schuine kraag. De automatisch toegevoegde 45° opvulling is minder dan **1%** van het verenigde volume, en verandert de kamerdoorsnede op 25 m minder dan 1%.

Vier schuine renders zijn naast PDOK en de referentiefoto's bekeken. −35° toont leeuw, deur, sierstenen en echte kustwachtkamer; 55° voegt tombeplaten en landzijdig reliëf toe; 145° toont de drie zeezijdige patrijspoorten en ronde schacht; 235° toont de zijplaten en de gelede top in plaats van het automatische dakblok. Elke zijde bevat meer herkenbare onderdelen. De **80 × 80 m** volledige preview en 3MF zijn met `createModelBundle` op **1:1000 / 45°** geëxporteerd en bekeken, inclusief duin, platform en hele toren. Kaartplaatsing en de permanente modeltest zijn gecontroleerd. Geen fysieke proefprint.

Weggelaten: antennes, losse camerabeugels, railingstaven, kozijnroeden en de zeemeermin als dunne windvaan; ze zijn te dun voor 1:1000. De makelaar is verdikt tot 0,9 m. Tekst wordt een gegroepeerd laag reliëf. De platformrand is als dichte muur weergegeven; het buitenhek blijft uit PDOK. De historische wachterswoningen in andere straten vallen buiten dit torenmodel; naburige woongebouwen blijven in PDOK.

Controle-URL: http://localhost:3000/kaart/52.61902/4.62168/220/1x1/0?size=80

## Bronnen

- [Nederlandse Vuurtoren Vereniging](https://www.vuurtorens.org/vuurtoren/egmond-aan-zee/) en [historische waardebepaling juni 2023](https://www.vuurtorens.org/wp-content/uploads/2023/08/De-vuurtoren-van-Egmond-aan-Zee-juni-2023.pdf).
- [RCE 14590](https://monumentenregister.cultureelerfgoed.nl/monumenten/14590).
- PDOK BAG, AHN DSM/DTM 0,5 m, BGT en Actueel_orthoHR, 11 oktober 2026.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:J.C.J._van_Speijk_lighthouse): `Leuchtturm Egmond aan Zee (02).jpg`, `Onderbouw - Egmond aan Zee - 20068213 - RCE.jpg`, `Egmond aan Zee - lighthouse 03.jpg` en `Egmond aan Zee - lighthouse 08.jpg`; alleen referentie, geen foto's in de repo.
