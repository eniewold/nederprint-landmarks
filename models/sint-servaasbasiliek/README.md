# Sint-Servaasbasiliek (Maastricht)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `sint-servaasbasiliek.glb` | Catalogusbron in meters: node `building:sint-servaasbasiliek` met het westwerk en de westtorens, schip, zijbeuken met kapellen en luchtbogen, Bergportaal, transept, koor, apsis, oosttorens, aanbouwen en de kloostergang rond de pandhof |
| `sint-servaasbasiliek-1-1000.stl` | De basiliek in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld aan het Vrijthof) op het printbed (91 × 111 × 57 mm) |
| `sint-servaasbasiliek.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (176166,22, 317708,25), in het
hart van de apsis, op het maaiveld aan het Vrijthof (NAP +52,3 m) en de
glTF-conventie Y omhoog. +X loopt langs de as van het westwerk naar de apsis
(RD-richting 13,8 graden, ten noorden van oost), +Y naar het
noordnoordwesten; het westwerk staat aan de -X-kant aan de Sint
Servaasklooster, de apsis met de oosttorens aan het Vrijthof en de pandhof
aan de noordkant. Het maaiveld loopt van het Vrijthof naar het westwerk 3,3 m
op (NAP +55,6 m); het wordt daarom alleen aan het Vrijthof bemonsterd
(`groundSamplePoints`, NAP +52,2 tot +52,6 m: oostelijk van de apsis en
naast beide oosttorens), en de vlakke onderkant loopt in het westen door het
hogere maaiveld heen. Het catalogusitem vervangt BAG-pand
`NL.IMBAG.Pand.0935100000017126`: de kerk met de kloostergang en de panden
ten noorden van de pandhof; de pandhof zelf is een gat in het pand en in het
model (genus 1).

Onderdelen in het model (hoogtes in NAP, uit het AHN-DSM als raster per
0,5 m in een stelsel langs de as, vormen gecontroleerd op foto's van alle
kanten):

- Daken per deel: het middenschip en het koor onder één zadeldak (nok +82 m,
  goot +74,6 m op 6,6 m uit de as, het koor 6,3 m breed met de goot op
  +75,8 m en een topgevel boven de apsis), het transept onder een even hoog
  dwars zadeldak (goot +73,6 m) met topgevels, de zijbeuken onder een
  lessenaarsdak (+68,6 naar +65,2 m aan de zuidkant, +68 naar +64,9 m aan de
  noordkant) en daarbuiten de gotische kapellen, elk onder een eigen dwars
  zadeldak met de topgevel naar buiten: zes aan de zuidkant (nok +68,7 m,
  kilgoten +65,4 m) en zeven aan de noordkant naar de pandhof (+67,5 m,
  kilgoten +64,3 m), om de 5 m zoals het AHN de nokken toont. Het
  Bergportaal en de kapel ernaast hebben een eigen dwars zadeldak (nok +70
  en +68,6 m).
- Luchtbogen: per kant vier steunberen van 1 m dik over het lessenaarsdak
  van de lichtbeuk (+72,6 m) naar een pinakel boven de kapellen (+70,6 tot
  +72,6 m), op de plaatsen waar het AHN de bogen toont; in het model dicht
  tot op het dak, niet als open boog.
- Westwerk: het blok van 35 m breed onder een laag schilddak (goot +74,6 m,
  bovenvlak +76,6 m), aan de westkant een kort zadeldak tot +80 m met een
  roosvenster en tussen de torens een dwars zadeldak tot +83,8 m. De
  westtorens van 10 × 7,4 m (het noordelijke hart op 9,45 m, het zuidelijke
  op 8,7 m van de as) met drie geledingen tussen hoeklisenen van 1,1 m
  (+77 tot +91,6 m) met gekoppelde nissen, een kroonlijst op een kraag die
  0,3 m uitkraagt (+92,1 tot +93 m), een steil tentdak naar de lantaarn van
  4,8 m met twee galmgaten per zijde, vier topgevels (+101,8 m) met elk een
  nis en een vierzijdige ruitspits met de graten boven de topgevels tot
  +108 m (56 m boven het Vrijthof).
- Oostpartij: de apsis als halve cirkel met een straal van 6,54 m (BAG) met
  twee rijen van zeven blinde bogen tussen lisenen (+54 tot +62,4 en +63,2
  tot +68,4 m, met drie vensters in de bovenste rij), de dwerggalerij als
  band van tien nissen van 0,45 m diep (+68,9 tot +70,4 m) en een kegeldak
  van +70,8 tot +77,3 m. De oosttorens van 3,8 × 3,6 m met drie geledingen
  tussen hoeklisenen (één venster, dan twee gekoppelde nissen, bovenin de
  galerij), een dakvoet op een kraag (+88,3 m, 0,25 m uit) en een
  vierzijdige piramidespits tot +92,6 m.
- Kloostergang: de dubbele westvleugel (de hoge vleugel aan de straat, nok
  +67 m, en de galerij aan de pandhof, nok +64,2 m, beide 6,7 graden gedraaid
  langs de westgevel), de noordvleugel (nok +66,1 m), de oostgalerij (nok
  +64,1 m, goot +60 m) en de zuidgalerij langs de noordelijke kapellen onder
  een lessenaarsdak. Verder het pand ten noorden van het transept (nok
  +65,8 m, naar het noorden aflopend tot +59,3 m), het smalle pand ten
  noorden van de noordvleugel (+61,5 naar +66,3 m) en de aanbouwen ten
  oosten van het transept (lessenaarsdaken +66,6 naar +64,6 m, plat
  +69,2 m). De rest van de contour staat op +60 m.
- Gevelreliëf: vensters, blinde bogen en galmgaten als nissen van 0,35 m
  diep met een spitse bovenkant van 60 graden (de brede bogen 50 graden);
  velden tussen lisenen en steunberen 0,3 m verdiept met een schuine
  bovenkant van 55 graden. De westgevel heeft een plint, zeven traveeën met
  in het midden de toegang (1,2 m diep) onder een groot roosvenster en
  vensters ernaast, een rij blinde bogen en zeven rondvensters; de zuidgevel
  van het westwerk vier blinde bogen en drie vensters. Het Bergportaal heeft
  een spitse poortopening van 6 m breed en 1,5 m diep (top +62 m) met drie
  vensters erboven. De zuidelijke kapellen hebben velden tussen steunberen
  met een spits venster per kapel, een borstwering tot +66,6 m en pinakels
  tot +69,6 m; de lichtbeuk acht vensters per kant, de transeptgevels drie
  vensters, en de kruisgang spitse vensters naar de pandhof en twee rijen
  vensters in de straatgevels van de west- en noordvleugel.

Binnen de voetafdruk ligt 87 % van de DSM-cellen binnen 2 m van het model
(76 % binnen 1 m, mediaan +0,13 m; de vorige versie 80 %, 60 % en +0,47 m);
per deel 91 % bij het transept en bij de kloostergang met de panden ten
noorden ervan, 86 % bij het schip met de zijbeuken en kapellen, 85 % bij het
westwerk en 80 % bij het koor met de apsis, de oosttorens en de aanbouwen.
Boven +85 m komt het model tot op 2 m bij 55 % van de cellen (vooral de
randen van de torens; mediaan +1,4 m), boven +100 m bij 98 %; het hoogste
AHN-punt ligt op +108,5 m. De PDOK-buurpanden rond het model zijn per pand
vergeleken met de AHN-mediaan binnen hun contour: geen pand dat het model
raakt steekt meer dan 0,3 m boven het AHN uit, ook de Sint-Janskerk ten
zuiden ervan niet (minstens 9 m van de contour; die blijft PDOK zolang er
geen eigen landmark is). Alleen pand 0935100000103137, 18 m ten westen van
het westwerk aan de overkant van de straat, ligt in PDOK 4,2 m hoger dan in
het AHN; dat raakt het model niet en is niet aangepast.

Printbaar op 1:1000 zonder steun: alles staat recht op of loopt schuin
omhoog, de spitsen staan op een brede voet, nissen, bogen en poorten hebben
een spitse bovenkant van 50 tot 60 graden en de kroonlijsten, de dakvoeten
en de bovenkanten van de velden een schuine onderkant van 53 tot 55 graden.
Het script controleert dat geen vlak boven de onderkant vlakker dan 45
graden naar beneden wijst (de vorige versie had de vlakke onderkant van de
kroonlijsten, circa 21 m², nu 0 m²) en dat alles op dezelfde onderkant
begint. In de export gaat de basiliek als gesloten solid met
overhangopvulling door: een uitsnede van 160 m op 1:1000 met het hele
complex duurt circa 5,6 seconden inclusief het laden van de PDOK-tegels
(101,0 naar 104,6 cm³, vooral de voet tot de onderplaat). De voet staat aan
het Vrijthof 1,3 tot 1,5 m in het PDOK-maaiveld, aan de zuidkant 2 tot 3 m
en bij het westwerk en de westvleugel van de kloostergang 4,4 tot 5,4 m.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Sint-Servaasbasiliek_(Maastricht))
(romaanse kruisbasiliek uit de 11e en 12e eeuw, 85 × 42,5 m, westwerk met
twee torens van 56 m, apsis met dwerggalerij tussen twee koortorens,
Bergportaal, gotische kruisgang uit de 15e eeuw),
[Rijksmonumentenregister 27168](https://monumentenregister.cultureelerfgoed.nl/monumenten/27168),
PDOK BAG (contour met de pandhof), PDOK AHN (dsm en dtm 0,5 m via WCS, als
raster per 0,5 m in het stelsel langs de as), de PDOK luchtfoto en foto's
op Wikimedia Commons van alle kanten (het overzicht vanaf de toren van de
Sint-Janskerk, de westtorens en de oosttorens van bovenaf, de oostpartij met
de apsis aan het Vrijthof, het westwerk aan de Sint Servaasklooster, het
Bergportaal, de zuidelijke en noordelijke zijkapellen en de kruisgang).
Gemeten in het AHN zijn de nokken, goten en kilgoten van alle daken, de
plaats van de luchtbogen en kapelnokken, de hoogtes van de torendaken en de
maten van de oosttorens; geschat uit foto's zijn het aantal en de plaats van
de vensters, nissen en blinde bogen, de geledingen van de torens, de
dwerggalerij, de poortopening van het Bergportaal, de toegang en het
roosvenster in de westgevel en de vorm van de ruitspitsen. Weggelaten zijn
de kleine dakkapellen op het schip (kleiner dan 0,9 m), de beelden en
kruisen, de open bogen onder de luchtbogen en de luchtbogen over de Sint
Servaasklooster (buiten het pand); de lagere galerijen van de kruisgang
zitten in de kloostervleugels.

Licentie van het model: eigen werk op basis van open bronnen.
