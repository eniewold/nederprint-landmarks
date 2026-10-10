# Noorderbrug (Maastricht)

Vereenvoudigde betonnen kokerbrug met beide volledige huidige BGT-dekken, inclusief de westelijke aanbrug die sinds 2017 naar het nieuwe tracé buigt. Doorlopende dekvlakken, twee kokerlofts en afzonderlijke BGT-kolommen; geen gestapelde hoogtelagen.

## Bestanden en regenereren

- `noorderbrug-maastricht.glb`: meters, Y omhoog; 21 BGT-verkeersvlakken, dekranden en constructie, samen 23 nodes.
- `noorderbrug-maastricht.json`: RD-plaatsing, Maaswatermonsters, vervangen dek-id's, maten en bronnen.
- `noorderbrug-maastricht-1-1000.stl`: millimeters, Z omhoog; circa 995,5 × 75,6 × 14,2 mm. Geïntegreerde printvoet, geen losse slicersteun nodig.

```sh
node scripts/generate-noorderbrug-maastricht.mjs
node scripts/generate-noorderbrug-maastricht.mjs --out /absolute/lege/catalogusmap --scale 1000
```

Alle broncontouren staan in de generator. Hij werkt zonder netwerk; `--out` is de catalogusmap, waarna het script de eigen slugmap toevoegt.

## Oorsprong, richting en hoogte

RD-oorsprong `[176839.5, 318957.5]`, op de Maas tussen de rivierpijlers. +X loopt oostwaarts met `xAxis = [0.9975589671, 0.0698291277]`; +Y links daarvan noordwaarts. Z = 0 is de waterspiegel, NAP +44 m. Die NAP-basis volgt het plaatselijke Maasniveau, ook gebruikt bij de Kennedybrug, en blijft een schatting. PDOK-watervertices rond de hoofdoverspanning geven 89,786–89,827 m ellipsoïdisch, mediaan 89,809 m. De catalogus bemonstert vier punten op dat water; de gemeten mediaan is de terugvalhoogte.

## Onderdelen

De twee huidige BGT-dekcontouren zijn samen circa 995 m lang. De dekplaat is 1,5 m dik; de bovenste 0,5 m bestaat uit afzonderlijke `road:`-nodes met de oorspronkelijke functies `rijbaan lokale weg`, `fietspad` en `voetpad`, het fysieke voorkomen en waar aanwezig `plus_fysiekvoorkomen`. De resterende dekranden zijn voetpad. De contouren zijn binnen 2 cm vereenvoudigd tegen collineaire snijslivers.

Twee kokerliggers volgen de westelijke bocht. Zij hebben schuine flanken en een verdiepte onderrand bij de twee BGT-rivierpijlers op lokale x ≈ −52,3 en +69,7 m, een hoofdveld van circa 122 m. De huidige BGT-pijler- en landhoofdcontouren binnen het dek zijn als gesloten prisma's opgenomen. De onderkant loopt naar Z = 0; het bestaande PDOK-maaiveld verbergt de voet op land. Het wegprofiel volgt continu de AHN-metingen: westelijke aanbrug circa NAP +57,7 tot +58,2 m, rivier circa +57,2 tot +56,5 m en het oostelijke uiteinde circa +51,6 m.

De brononderdelen partitioneren het geheel zonder overlap: volumefout circa 5,9 × 10⁻⁸ m³. Bij 8.026 dekstralen blijft de constructietop minstens 0,499999 m onder het wegvlak. `replacesTerrain` bevat de twee BGT-dekken `G0935.138d37281e454b438a648fb5129ee536` en `G0935.59ccd1f3545f407381055424478e8741`, door het hulpscript volledig gedekt bevonden.

De STL heeft twee doorlopende printwanden van minstens 1 mm met 43°-schouders. De loftstations volgen ook elke BGT-knik, zodat verbredingen geen vrije ondervlakken krijgen. Dit is één verbonden gesloten volume. De printvoet ontbreekt in de GLB; de webshop verdeelt zijn eigen gezamenlijke overhangopvulling over de constructie.

## Gemeten, geschat en weggelaten

Gemeten: de huidige dekcontouren, bocht, BGT-pijlers en landhoofden, wegfuncties, dekhoogten uit AHN en PDOK-waterhoogte. Het AHN bevat op de westelijke aanbrug enkele sterk afwijkende dwarsmedianen en een voertuigpiek bij x ≈ +140 m; het profiel interpoleert tussen de ongestoorde aangrenzende metingen. Het wordt nergens in horizontale hoogtelagen afgerond.

Geschat uit schuine foto's: dekplaat 1,5 m, kokerdiepte 2,1 m op de aanbruggen en circa 2,4–5,9 m bij de rivier, schuine kokerflanken en de verdeling in twee buitenkokers. Het zijn vereenvoudigde buitenvormen, geen constructietekeningen. Ook de keuze van de hoofdas en de NAP-waterbasis zijn benaderingen.

Weggelaten: dunne leuningstaven, geleiderails, lantaarnpalen en bebording, omdat hun dragende doorsneden kleiner dan 0,9 m zijn. De metalen zigzagtrap naast de westelijke oever is niet opgenomen: zijn dunne open trapconstructie zou op 1:1000 tot een massief steunblok dichtlopen. Het losstaande restant van de oude krul, nabije fiets-/onderdoorgangen en de spoorbrug zijn zelfstandige bouwwerken buiten de twee huidige Noorderbrug-dekken. Interne kokercellen en voegdetails zijn weggelaten om de volumes gesloten te houden.

## Controle

Alle GLB-nodes en de STL melden `NoError`. De STL heeft geen vrije overhang boven 45°; de grootste numerieke snijsliver is circa 0,000049 mm. De blijvende test controleert het volledige westelijke verloop, de 23 nodes en attributen, AHN-hoogten, de afzonderlijke weglaag en plaatsing op de PDOK-waterhoogte. Beide landmarktestsuites slaagden met 344 tests.

De tijdelijke `supportedSolid`-/`shareModelSupport`-controle op 1:1000 geeft steun aan de constructie en geen groei van de wegdelen. De Float32-intersecties verliezen bij enkele kleine wegdelen tot 4,23% volume; dat is in de controle begrensd tot 5%, terwijl uitbreiding naar een eigen steunvoet verboden blijft. De totale gepartitioneerde export wijkt minder dan 0,025% af van het ondersteunde geheel. Horizontale doorsneden tussen de rivierpijlers op 0,5, 2 en 4 m bevatten twee doorlopende wanden, minstens 0,8 mm op printschaal.

De volledige preview en 3MF zijn via `createModelBundle` op 1:1000 gemaakt: een gedraaide 650 × 1300 m uitsnede, acht tegels van 300 mm, met alle modeluiteinden binnen de uiteindelijke 600 × 1200 m matrix. Vier schuine aanzichten van GLB, PDOK, STL en preview zijn vergeleken met foto's uit 2018–2021. Vanuit alle vier de kanten voegt het model het verhoogde dek, de kokeronderzijde, rivierhaunches en kolommen toe aan de vlakke PDOK-dekreconstructie. De kaart is met rood fietspad gecontroleerd. De PDOK-weghoogten aan beide uiteinden sluiten op de dekplaat aan; de onderbouw staat in het terrein. Controlebeelden en exports blijven buiten de repo.

Controle-URL: `http://localhost:3000/kaart/50.85975/5.69440/1800/1x1/0?rules=r.f.fietspad.10200`. De browsercontrole gebruikte dezelfde lokale app tijdelijk op poort 3001 om de oude cataloguscache te vermijden.

## Bronnen

- [Noorderbrug, geschiedenis en huidig tracé](https://nl.wikipedia.org/wiki/Noorderbrug_(Maastricht)).
- [BGT-overbruggingsdelen](https://api.pdok.nl/lv/bgt/ogc/v1/collections/overbruggingsdeel/items) en [BGT-wegdelen](https://api.pdok.nl/lv/bgt/ogc/v1/collections/wegdeel/items), PDOK, actuele registraties, CC0.
- [AHN DSM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0), PDOK, CC0; continu geïnterpoleerde gemeten dekhoogten.
- [Actuele orthofoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0), PDOK.
- [2018-Maastricht, Noorderbrug](https://commons.wikimedia.org/wiki/File:2018-Maastricht,_Noorderbrug.jpg), Kleon3, CC BY-SA 4.0.
- [Maastricht-Noorderbrug (1)](https://commons.wikimedia.org/wiki/File:Maastricht-Noorderbrug_(1).jpg) en [(2)](https://commons.wikimedia.org/wiki/File:Maastricht-Noorderbrug_(2).jpg), Romaine, CC0.
- [2019 Maastricht, Bosscherweg, afrit Noorderbrug](https://commons.wikimedia.org/wiki/File:2019_Maastricht,_Bosscherweg,_afrit_Noorderbrug.jpg), Kleon3, CC BY-SA 4.0.
- [2021 Maastricht, Noorderbrugtracé (1)](https://commons.wikimedia.org/wiki/File:2021_Maastricht,_Noorderbrugtracé_(1).jpg), [(2)](https://commons.wikimedia.org/wiki/File:2021_Maastricht,_Noorderbrugtracé_(2).jpg) en [(3)](https://commons.wikimedia.org/wiki/File:2021_Maastricht,_Noorderbrugtracé_(3).jpg), Kleon3, CC BY-SA 4.0.
