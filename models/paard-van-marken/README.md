# Paard van Marken — Marken

Ronde lichttoren met vensternissen, gevelsteen, twee sierbanden, omgang, lantaarn, rode koepel en makelaar; wachterswoning en machinekamer hebben afzonderlijke zadeldaken, schoorstenen en raamreliëf. Beide noordaanbouwen en het losse schuurtje zijn meegenomen. De GLB heeft vier gesloten `building:`-nodes; het terrein en de dijk blijven uit PDOK komen.

## Maten en plaatsing

- RD-oorsprong `[138139.2, 496921.05]` in het torenhart; +X `[0.999860414, -0.016707835]` langs de daknokken naar het oosten. BAG-pand `0852100000003061` wordt vervangen. De voetstraal 3,05 m volgt de ronde BAG-contour.
- De Nederlandse Vuurtoren Vereniging noemt een objecthoogte van **15,5 m**. Dit model gebruikt die maat voor de koepeltop; de makelaar is geschat tot **17,1 m**, passend bij de AHN-top NAP +18,73 m en maaiveld circa +1,6 m. Welke onderdelen de gepubliceerde objecthoogte precies omvat, is niet vastgesteld.
- AHN-dwarsprofielen leveren voor de twee daken nokken NAP +10,27 / +10,86 m en goten circa +7,96 / +8,40 m: lokaal 8,67 / 9,26 en 6,36 / 6,80 m. Rechte dakvlakken, geen hoogtelagen. De twee schoorstenen reiken lokaal tot 10,05 en 11,28 m; de oostelijke piek is in het DSM zichtbaar.
- Omgang 12,25 m, lantaarn 14,30 m, vensterindeling, bandhoogtes, koepelprofiel en portaal zijn uit schuine foto's geschat. De platte noordaanbouwen liggen op de BGT/BAG-contour en zijn circa 2,3 / 2,47 m hoog.
- De grondhoogte is de laagste van vier PDOK-monsters: ellipsoïdisch 44,364642 m, offset −0,10 m en voet −0,20 m. Het losse schuurtje staat 1,49 m lager op zijn eigen terrein. Het ontbreekt in het oudere AHN; de huidige ortho geeft de BGT-contour, het zadeldak is geschat op 2,45 m boven zijn voet.

## Print en controle

Genereer reproduceerbaar met `node scripts/generate-paard-van-marken.mjs` (standaard 1:1000). STL circa **18,5 × 18,1 × 18,8 mm**, zonder kunstmatige grondplaat; het losse schuurtje verbindt in de kaart via het terrein. Alle vier nodes zijn `NoError` en afzonderlijk aaneengesloten.

Vier schuine vergelijkingen naast de echte PDOK-reconstructie zijn bekeken: −35° voegt omgang, lantaarn, torennissen en noordaanbouwen toe; 55° voegt zuidvensters en schuurtje toe; 145° geeft westgevelvensters, de afzonderlijke nokken en schoorstenen; 235° toont beide noordaanbouwen en de terugliggende gevelvelden. Schuine Commons-beelden vanaf land en water bevestigen de opbouw.

De complete **80 × 80 m** uitsnede is met `createModelBundle`, **1:1000 en 45° printbare overhang**, naar preview en 3MF geëxporteerd en visueel bekeken. Gedeelde steunopvulling vergroot het verenigde volume slechts **0,239%**; doorsneden op 7 / 12,5 / 14,5 m blijven gelijk. De automatische export vult de kleine uitstekende dak- en portaalranden permanent op. De kaart is gecontroleerd en de permanente modeltest bewaakt plaatsing, aparte daken, verbonden nodes, het lagere schuurtje en de printopvulling. Er is geen fysieke proefprint gedaan.

De omgangsleuning is als dichte ring van 0,9 m dik weergegeven. De makelaar is tot 0,9 m verdikt. De lantaarnruitjes zijn vier gegroepeerde blinde nissen; individuele roeden, hekwerk, antennestokken, kabels, letters en dakgoten zijn te dun voor 1:1000. Steigerpalen en tuinhekwerk zijn eveneens te dun; de bestaande steiger/dijk blijven in PDOK. Losse meubels, boten en tijdelijke werkzaamheden vormen geen onderdeel van het monumentmodel.

Controle-URL: http://localhost:3000/kaart/52.45972/5.13889/220/1x1/0?size=80

## Bronnen

- [Nederlandse Vuurtoren Vereniging](https://www.vuurtorens.org/vuurtoren/marken/), hoogte en bouwgeschiedenis.
- [RCE 28274](https://monumentenregister.cultureelerfgoed.nl/monumenten/28274).
- PDOK BAG, BGT `L0002.5dd23c32044344b299e3f7e06ef5fdbf` en `L0002.69529f4b4a00448abf30fcd5a0d064aa`, AHN DSM/DTM 0,5 m en Actueel_orthoHR, geraadpleegd 11 oktober 2026.
- [Wikimedia Commons: Marken lighthouse](https://commons.wikimedia.org/wiki/Category:Marken_lighthouse), vooral `Leuchtturm Marken.jpg`, `Het Paard van Marken Part II (7433885074).jpg` en `Marken Lighthouse 2018-11-30-1.jpg`. Foto's alleen als referentie, buiten de repo.
