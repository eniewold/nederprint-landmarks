# Noordervermaning (Westzaan)

Een printbaar model van de Noordervermaning aan de J.J. Allanstraat 463 in Westzaan: een houten doopsgezinde zaalkerk zonder toren uit 1695, sinds 1964 in gebruik bij de Gereformeerde Gemeente. Rond 1850–1860 kreeg de kerk aan de straatkant een bakstenen voorgevel in neogotische trant, met witte hoekpilasters en pinakels, spitsboogvensters en een roosvenster. Rijksmonument 39982.

## Bestanden

- `noordervermaning-westzaan.glb`: gesloten model in meters, Y omhoog, één node `building:kerk`.
- `noordervermaning-westzaan.json`: catalogusitem; vervangt BAG-pand 0479100000002310.
- `noordervermaning-westzaan-1-100.stl` en `noordervermaning-westzaan-1-1000.stl`: printmodellen in millimeters, Z omhoog.
- Generator: `scripts/generate-noordervermaning-westzaan.mjs`.

## Oorsprong en oriëntatie

Oorsprong RD (113205,6; 497261,0) midden in de zaal, op maaiveld (NAP −0,70 m, het laagste maaiveld rond de kerk). De lokale X-as (0,97887; 0,2045) loopt langs de nok naar de voorgevel aan de straat (oost, 11,8 graden linksom van RD-oost, gemeten aan de muren in de BAG en de nok in de 3D BAG); Y wijst naar het noorden. De onderkant ligt vlak op −0,5 m; `groundOffsetMetres` is 0, omdat de export op de negen bboxpunten het laagste maaiveld (NAP −0,76 m, achter de kerk) kiest en de voorgevel aan de straat (NAP −0,2 tot −0,5 m) dan nog in het maaiveld staat.

## Onderdelen

- Zaal van 20,8 × 10,1 m: muren tot de goot op NAP +6,68 m, zadeldak van 44 graden tot de nok op NAP +11,63 m, schild van 50 graden aan de achterkant (west); de nok loopt door tot de voorgevel.
- Stenen voorbouw (oostelijke 6,5 m) met een 0,25 m dikkere zuidmuur onder hetzelfde dakvlak.
- Voorgevel als topgevel die 0,3 m boven het dak uitsteekt (de witte gevelrand), hoekpilasters van 0,9 m met achtzijdige pinakels tot +9,9 m boven maaiveld, en een topstuk met pinakel tot NAP +14,0 m.
- Aanbouw aan de noordzijde (5,8 × 4,0 m) met zadeldak oost-west (goten NAP +1,9 en +2,4 m, nok NAP +4,6 m), via een smalle verbinding van 1,5 m aan de zaal vast.
- Blinde nissen van 0,3 m: in de voorgevel drie hoge spitsboogvensters boven, twee spitsboogvensters en de deur beneden en het roosvenster; twee smalle spitsboogvensters per zijde in de gestuukte voorbouw; vier hoge rechthoekige vensters per zijde in de houten zijmuren; twee vensters en de hoge deur in de achtergevel.

## Geschat en weggelaten

Gemeten: voetafdruk, pilasterposities en de aanbouw uit de BAG; goot, nok en dakhellingen uit de 3D BAG (LoD2.2) en het AHN5-DSM (het dakmodel wijkt daar op vrijwel elk punt minder dan 0,3 m van af). Geschat uit foto's: de hoogte van de pinakels en het topstuk, alle venster-, deur- en roosmaten en de plaatsen van de vensters in de houten muren. De verbinding met de aanbouw is in de BAG een strook van 1,5 m; het AHN ziet daar alleen iets van ongeveer 1,3 m hoog, dus haar platte dak op 2,45 m is geschat. De pilasters zijn 0,9 m breed in plaats van ongeveer 0,55 m, zodat ze op 1:1000 te printen zijn. Weggelaten (kleiner dan 0,9 m of plat): de ijzeren traceringen, de witte borstweringspanelen onder de bovenvensters, gootlijsten, regenpijpen, de ventilatiekap op het dak en de stenen plint onder de houten wanden. De houten kosterswoning naast de kerk is een eigen BAG-pand en hoort niet bij het model.

## Controle

De generator levert één gesloten component met genus 0. De catalogus- en printtest (`Noordervermaning Westzaan catalogue and print test` in de webshop) slaagt: plaatsing via de catalogus, één solid en minder dan 0,1 % extra volume bij 45 graden printbare overhang. Een plaatsing op het AHN-maaiveld met de exportbemonstering zet de voet op NAP −0,76 m en de nok op NAP +11,57 m. Renders van vier kanten zijn naast de 3D BAG-reconstructie en de foto's van RCE, Commons en Reliwiki gelegd. Op de kaart nakijken: de plaats en hoogte van de aanbouw aan de noordkant en of de voorgevel met pinakels aan de straatkant (oost) staat.

## Bronnen

- [BAG / 3D BAG pand 0479100000002310](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0479100000002310)
- [Rijksmonumentenregister 39982](https://monumentenregister.cultureelerfgoed.nl/monumenten/39982)
- [Wikipedia, Noordervermaning (Westzaan)](https://nl.wikipedia.org/wiki/Noordervermaning_(Westzaan))
- [Reliwiki, Westzaan J.J. Allanstraat 463](https://reliwiki.nl/index.php/Westzaan,_J.J._Allanstraat_463_-_Noordervermaning)
- [Wikimedia Commons, Noordervermaning (Westzaan)](https://commons.wikimedia.org/wiki/Category:Noordervermaning_(Westzaan))
- [OpenStreetMap way 285093882](https://www.openstreetmap.org/way/285093882)
- [AHN hoogtegegevens](https://www.ahn.nl/dataroom) (DSM als controle van nok, goten en schild, DTM voor het maaiveld)
- [PDOK luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0)
