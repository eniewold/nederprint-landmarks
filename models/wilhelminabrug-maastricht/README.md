# Wilhelminabrug (Maastricht)

De volledige Maasoverspanning en de gesplitste westelijke vorkoprit, opgebouwd uit doorlopende vlakken en bouwdelen. De losstaande viaducten verderop aan de Wilhelminasingel blijven PDOK.

## Bestanden

- `wilhelminabrug-maastricht.glb`: één constructienode en twaalf BGT-wegnodes, meters, Y omhoog.
- `wilhelminabrug-maastricht.json`: catalogus met RD-plaatsing, waterbemonstering en beide vervangen BGT-dekken.
- `wilhelminabrug-maastricht-1-1000.stl`: één gesloten volume van circa 206 × 66 × 11,3 mm, Z omhoog.
- Generator: `node scripts/generate-wilhelminabrug-maastricht.mjs`; vaste brondata, geen netwerk nodig.

## Metingen en onderdelen

De actuele BGT-dekken bepalen de circa 164 m lange Maasoverspanning en de westelijke vork. De BGT geeft de twee westelijke pijler-/landhoofdcontouren en twaalf verhoogde wegdelen: vier fietspaden, vijf voetpaden en drie lokale rijbanen. Hun functies, gesloten verharding en plus-fysiekvoorkomen staan op de GLB-nodes. De bovenste 0,5 m van het dek is uitgesneden; opgaande koppen en muren behouden 2 cm beschermstrook.

De AHN-DSM van 0,5 m geeft het doorgaande lengteprofiel: van circa NAP +50,1 m aan de westelijke oprit via +53,48 m middenin naar +54,12 m aan de Wyckse kant. Het profiel gebruikt rechte vlakken tussen gemeten stations; voertuigen en uitschieters zijn uitgesloten. De natuurstenen koppen liggen rond NAP +54,25 en +55,35 m. De oorsprong is RD [176740.71801135165, 318047.61199252214]; +X loopt naar Wyck, langs [0.9977497, 0.06704878], +Y naar het noorden.

Vier PDOK-waterpunten buiten het dek bepalen de kaart- en exportplaatsing, minimaal 89,82558 m ellipsoïdisch. De referentie NAP +44,05 m is het benaderde stuwpeil, geen actuele waterstand. Het oudere PDOK-dek bij de oostkant ligt circa 7,5 m onder het eigen AHN-dek; de nieuwe absolute dekhoogte komt voort uit waterdatum plus gemeten AHN-profiel. Dat verschil staat open voor visuele review.

## Geschat en weggelaten

Geschat uit de schuine foto's: dek-/liggerdikte 2,1 m als vereenvoudigd doorgaand profiel, pijlerhoogte 3,9 m boven de waterreferentie, ovale natuurstenen koppen van 6 × 34 en 5,2 × 24 m, en één meter dikke vleugelmuren. De breedte en het verloop van de vleugelmuren en het ontbreken van hun fijne steenvoegen zijn vereenvoudigingen. Metalen leuningen, lichtmasten, plaquettes, losse liggerverstijvingen en afzonderlijke traptreden zijn weggelaten vanwege hun dikte onder 0,9 m op 1:1000.

Onder de Maasoverspanning ligt een geïntegreerde doorlopende printvoet met draagvlakken van 47° boven horizontaal. De westelijke vork heeft een gesloten onderbouw. Daardoor vervalt het vrije doorzicht onder het dek; de gemeten pijlers en de natuurstenen koppen blijven zichtbaar. De voet is in horizontale doorsneden doorlopend, geen lamellenkam.

## Controle

De generator toetst één gesloten volume, NoError, geen overlap tussen de wegdelen en constructie en geen vrije ondervlakken. De STL wordt uit het oorspronkelijke hele model geschreven. De webshoptest controleert de volledige plaatsing, de twaalf BGT-attributensets, duizenden verticale stralen zonder samenvallende bovenvlakken en gedeelde printopvulling. De extra opvulling bij 45° is numeriek nul; ook de wegdelen krijgen geen eigen opvulling. Doorsneden op 1, 3, 5, 7 en 9 m veranderen niet.

Een volledige createModelBundle-export op 1:1000 is gemaakt met een uitsnede van 420 × 420 m en een matrix van 2 × 2 tegels van 200 mm. De preview bevat de gehele vork en beide landhoofden, met rode fietspaden. Vier schuine aanzichten op −35°, 55°, 145° en 235°, elevatie 30°, zijn naast de echte PDOK-reconstructie en schuine bronfoto's beoordeeld. Controlebeelden en 3MF staan buiten de repo.

[Controlekaart met rode fietspaden](http://127.0.0.1:5188/kaart/50.85178/5.69587/600/1x1/0?rules=r.f.fietspad.10200). De tijdelijke controleproxy gebruikt de gewone webshop op poort 3000 met een verse catalogus en GLB's; dezelfde route werkt na herstart op poort 3000.

Nakijken: de westelijke vork, de natuurstenen koppen en vleugelmuren, en de aansluiting bij Wyck waar het eigen AHN-dek hoger ligt dan PDOK.

## Bronnen

- [BGT-overbruggingsdeel, PDOK](https://api.pdok.nl/lv/bgt/ogc/v1/collections/overbruggingsdeel/items), CC0, 11 oktober 2026.
- [BGT-wegdeel, PDOK](https://api.pdok.nl/lv/bgt/ogc/v1/collections/wegdeel/items), CC0.
- [AHN DSM 0,5 m, PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0).
- [Schuine foto's, Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Wilhelminabrug_(Maastricht)): 20140525 Maastricht Wilhelminabrug.JPG; 20150312 Maastricht; Wilhelminabrug seen from jetty between Sint-servaasbrug and Wilhelminabrug 02.jpg; 20140525 Maastricht; bridge support of Wilhelminabrug.JPG. Foto's dienen uitsluitend als visuele bron, geen pixels in het model.
- [Stuwpeil Maastricht, gemeente Maastricht](https://www.gemeentemaastricht.nl/sites/default/files/2019-10/hoogwater%20zuidelijk%20Maasdal%20ontwikkelvisie%202050_0.pdf).
- [Geschiedenis en constructietype](https://nl.wikipedia.org/wiki/Wilhelminabrug_(Maastricht)).
