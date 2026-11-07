# Doopsgezinde kerk (Berltsum)

Doopsgezinde kerk (vermaning) aan de Vermaningsstrjitte 3 in Berltsum (Berlikum), gemeente Waadhoeke, rijksmonument 28577. Zaalkerk onder een schilddak uit 1841 met een ingebouwde kosterswoning aan de voorzijde, een voorgevel met kroonlijst en klassiek fries, een ingang met een bekroonde omlijsting, rechts (zuid) een toegangspoort en achter de zaal een aanbouw (monumentenregister). Orgel van L. van Dam & Zonen uit 1916. De kerk heeft geen toren. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-panden 0083100000000052 (zaal en aanbouw achter, bouwjaar 1841) en 0083100000000062 (kosterswoning in het voorste deel en de lage aanbouw noord, bouwjaar 1841). Het schilddak loopt over beide panden heen; ook de PDOK-reconstructie van beide reikt tot de nok (ellipsoïdisch 57,0 en 56,8 m). De buurpanden 0083100000000045 en 0083100000000054 (noord, 1982 en 1992) en 0083100000000087 (zuid) blijven staan; hun PDOK-hoogtes kloppen binnen 1 m met het AHN.
- STL op 1:1000: circa 31,4 × 16,0 × 12,3 mm.
- Genereren: `node scripts/generate-doopsgezinde-kerk-berltsum.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (172622,26; 584228,02), lat/lon 53,244337 / 5,651182, op de nok boven de as van de voorgevel (in het midden van de zaal). +X loopt langs de nok van de voorgevel (west, aan de straat) naar achteren, onder 14,6 graden in RD (`xAxis` [0,96771; 0,25207]); +Y wijst naar het noorden. De lange BAG-gevels van beide panden liggen op deze hoek binnen 0,1 graad recht, en de nok in het AHN-DSM loopt er evenwijdig aan. z = 0 ligt op het laagste maaiveld rond de voet (achter de kerk, NAP +3,70 m); de straat voor de voorgevel ligt op NAP +3,85 m, dus deur en vensters van de voorgevel liggen 0,15 m hoger. `groundHeight` 44,94 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` (achter de aanbouw). `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld.

## Onderdelen

- **Zaal met kosterswoning**: 17,2 m recht (BAG u = −9,62 .. 7,6) en 9,53 m breed, met een driezijdige achterkant (twee afgeschuinde hoeken naar een achtergevel van 5,3 m). De BAG legt de achtergevel op 9,2 m achter de oorsprong, maar AHN en luchtfoto zien de dakrand tot 10,0 m; de achtergevel staat daarom op 9,55 m.
- **Schilddak**: nok +11,89 m (NAP +15,59) van −5,28 tot 5,33 m, zijschilden met helling 1,32 (52,9 graden; AHN-dwarsprofielen 1,32 zuid en 1,33 noord), voorschild 1,45 (55 graden), achterschilden 1,49 (56 graden), dakvoet op de gevellijn +5,6 m (NAP +9,3).
- **Kroonlijst** rondom vanaf +4,7 m, 0,4 m uitkragend (onderkant 48 graden), in het verlengde van de dakvlakken.
- **Voorgevel (west)**: hoeklisenen van 0,6 m, ingangspartij met pilasters (2,1 m breed, 0,16 m voor de gevel, tot +3,45 m) en een segmentboogvormige bekroning tot +4,45 m die 0,3 m uitkraagt, deur van 1,3 m, twee vensters van 1,9 m (+1,05 .. +3,05) op 2,65 m naast het midden en daarboven twee lunetten (straal 0,6 m).
- **Dakkapel** op het voorschild: 1,2 m breed tot +8,1 m met een achtkant koepeltje tot +8,7 m.
- **Zijgevels**: in de zaal drie rondboogvensters per kant (1,2 m breed, van +1,8 m tot de aanzet +4,0 m) op 2,15 m vóór, en 1,75 en 5,65 m achter de oorsprong; aan de noordkant zijn de twee voorste boven de lage aanbouw ingekort (vanaf +3,0 m). In de zuidgevel van de kosterswoning een venster boven (+3,4 .. +4,5 m).
- **Lage aanbouw noord**: 10,2 × 3,1 m (BAG), plat dak +2,7 m (AHN NAP +6,4), met een deur en een venster in de westgevel.
- **Aanbouw achter**: 12 × 7,4 m met een tussenlid naar de zaal (BAG), plat dak +4,3 m (AHN NAP +8,0), en aan de noordkant een lager deel van 5,3 × 2,8 m op +3,55 m (AHN NAP +7,25).
- **Toegangspoort** zuid van de voorgevel, tussen kerk en buurpand: muur van 0,9 m dik en 3,2 m breed tot +3,2 m met een puntige deklijst tot +3,85 m en een rondboog van 1,2 m als blinde nis aan beide kanten.
- **Plint** van 0,12 m rondom tot +0,6 m.

## Geschat

- Alle maten van de gevels (vensters, deur, ingangspartij, lunetten, hoeklisenen, kroonlijst) zijn geschat uit de frontale foto's (RCE 20033984, signatuur 54478/54479, Doopsgezinde_kerk.jpg), geschaald op de BAG-breedte van de voorgevel (9,53 m).
- Het aantal en de plaats van de rondboogvensters in de zijgevels: de foto's tonen drie vensters in de zuidgevel achter de poort, schuin gezien; ze zijn gelijk over de zaal verdeeld. De noordgevel staat op geen enkele foto; de vensters zijn gespiegeld en boven de lage aanbouw ingekort.
- De achtergevel op 9,55 m (BAG 9,2 m) en de afschuining van de achterhoeken komen uit AHN en luchtfoto.
- Dakkapel en koepeltje zijn van de foto's; de dakkapel valt in het AHN tussen de cellen van het voorschild.
- De toegangspoort staat niet in de BAG; plaats (1,1 m achter de voorgevel) en breedte komen van de luchtfoto, hoogte en vorm van de foto's.
- De aanbouw achter en de lage aanbouw noord staan op geen foto; hun hoogte komt uit het AHN, hun vorm uit de BAG. Vensters en deuren van de aanbouw achter zijn niet bekend en weggelaten.

## Weggelaten of vereenvoudigd

- Vensters, deuren en de poortboog zijn blinde nissen (rondbogen en lunetten met een plafond dat 1,1 : 1 naar binnen afloopt, rechte openingen met een schuin plafond); roeden, zonneschermen en de waaiervormige bovenlichten zijn weggelaten.
- Het fries met de kleine vierkante vakjes onder de kroonlijst (reliëf kleiner dan 0,3 m), het oculus in de dakkapel (kleiner dan 0,9 m), het kruis op het koepeltje, de windvaan op de achterkant van de nok, de schoorsteen (alleen op de oude foto van circa 1970), twee kleine dakramen, regenpijpen, de vaas op de poort en het hekwerk voor de kerk (kleiner dan 0,9 m).

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder de twee PDOK-panden en zonder opvulling (zelfde volume als zonder steun). Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Rijksmonumentenregister 28577](https://monumentenregister.cultureelerfgoed.nl/monumenten/28577)
- [Reliwiki: Berltsum, Vermaningsstrjitte 3 - Doopsgezinde Kerk](https://www.reliwiki.nl/index.php/Berltsum,_Vermaningsstrjitte_3_-_Doopsgezinde_Kerk)
- [OpenStreetMap way 302811841](https://www.openstreetmap.org/way/302811841)
- Foto's Wikimedia Commons: Doopsgezinde_kerk.jpg; Doopsgezinde kerk te Berlikum - Berlikum - 20033984 - RCE.jpg; Voormalige Doopsgezinde kerk in Berlikum, 30-11-1989, signatuur 54478; Religieus erfgoed in Berlikum Doopsgezinde kerk, 30-11-1989, signatuur 54479; Fermanje, Berltsum.jpg
- BAG panden 0083100000000052 en 0083100000000062 (voetafdruk)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
