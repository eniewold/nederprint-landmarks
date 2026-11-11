# Sint-Martinuskerk (Westwoud)

Rooms-katholieke waterstaatskerk van Theo Molkenboer (eerste steen 1849, ingewijd
1851), rijksmonument 14065: een driebeukige kruiskerk onder één zadeldak met
rondboogvensters tussen lisenen, een koor met driezijdige sluiting en een
westtoren met houten klokkengeleding en ingesnoerde spits.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `sint-martinuskerk-westwoud.glb` | Model in meters, Y omhoog, één node `building:kerk` |
| `sint-martinuskerk-westwoud.json` | Catalogusitem |
| `sint-martinuskerk-westwoud-1-100.stl` | Printbestand 1:100 in mm, Z omhoog |
| `sint-martinuskerk-westwoud-1-1000.stl` | Printbestand 1:1000 in mm, Z omhoog |

Gegenereerd met `node scripts/generate-sint-martinuskerk-westwoud.mjs`.

## Oorsprong en oriëntatie

- Oorsprong RD (138610, 522198): het snijpunt van de nok van schip en koor met
  de nok van het dwarsschip, op maaiveldniveau (NAP +0,10 m).
- X langs de nok van schip en koor naar het oosten (`xAxis` [0,8937, 0,4487],
  26,7 graden noord van RD-oost), gemeten op de nok- en gootlijnen in de 3D BAG
  en het AHN; Y naar het noorden. De toren staat aan de westkant (-X).
- `groundOffsetMetres` 0: de lader neemt het laagste van negen punten op de bbox,
  en de zuidoosthoek ligt in een sloot (circa NAP -0,15 m).
- Vervangt BAG-pand 0498100000006516 (kerk en toren zijn één pand). De pastorie
  (0498100000014370) tegen het koor en het pand van 1836 ten zuiden blijven PDOK.

## Onderdelen

- **Schip met zijbeuken** onder één zadeldak: muren tot goot NAP +10,5 m, nok
  NAP +17,1 m, helling 39 graden, breedte 16,4 m; vier rondboogvensters per zijde
  tussen lisenen, kroonlijst op een kraag van 45 graden, plint.
- **Dwarsschip**: armen 0,7 m buiten het schip, topgevels met hoog venster en
  oculus, nok NAP +17,35 m (helling 57 graden), kroonlijst rond.
- **Koor** met driezijdige sluiting (op de luchtfoto en in de 3D BAG; binnen is
  de apsis halfrond): nok NAP +17,0 m, goot NAP +10,8 m, drie dakschilden.
- **Westfront**: verhoogde frontmuur met kroonlijst op NAP +11,6 m en schuin
  oplopende borstwering tot NAP +17,3 m, beeldnissen (Petrus en Paulus) met
  daaronder een dichtgezet venster.
- **Toren**: onderbouw 5,7 x 6,2 m tot de kroonlijst van het front met ingang,
  groot rondboogvenster en beeldnissen op de zijkanten; bakstenen schacht
  5,5 m met terugsprong op NAP +19,4 m, oculi en kroonlijst op NAP +24,5 m;
  houten klokkengeleding 4,4 m met hoekpijlers, galmgaten en kroonlijst tot
  NAP +30,2 m; ingesnoerde spits (vierkante voet die op NAP +31,6 m achtkant
  wordt) tot NAP +42,45 m.
- **Aanbouwen**: sacristieën naast het koor (NAP +4,25 en +4,15 m), lage aanbouw
  tegen de zuidbeuk (NAP +3,45 m) en een portaaltje met lessenaarsdak aan de
  noordarm.

## Geschat en weggelaten

- Geschat uit foto's: de hoogtes van de torengeledingen, de terugsprong van de
  schacht, de maten van de nissen en vensters (rondbogen als spitse top van
  circa 54 graden, zodat ze zonder steun printen) en de oculi (achthoekig).
- De spitstop is de AHN-piek (NAP +42,45 m), dat is ongeveer de knop; het kruis
  erboven (dunner dan 0,9 m) is weggelaten.
- Weggelaten: wijzerplaten, de lichtkoepels in het dak, de kozijnen en de
  versiering van de ingang (alle dunner dan 0,9 m of vlak in de gevel). Het
  koor heeft geen nissen gekregen: er is geen foto van de oostzijde.

## Controle

- `status` NoError, genus 0, één samenhangend volume, 1614 driehoeken.
- `tests/landmark-models.test.ts` (Sint-Martinuskerk Westwoud): catalogus,
  oorsprong, `replacesBuildings`, plaatsing en printbaarheid op 1:1000 zonder
  extra steun (volume en doorsneden binnen 3 %).
- Renders van vier kanten naast de 3D BAG-reconstructie (LoD2.2) en
  plaatsingscontrole met het AHN-maaiveld; foto's van Commons en het RCE.

## Bronnen

- 3D BAG: <https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0498100000006516>
- Rijksmonumentenregister: <https://monumentenregister.cultureelerfgoed.nl/monumenten/14065>
- Wikipedia: <https://nl.wikipedia.org/wiki/Sint-Martinuskerk_(Westwoud)>
- Wikimedia Commons: <https://commons.wikimedia.org/wiki/Category:Sint-Martinuskerk,_Westwoud>
- OpenStreetMap: <https://www.openstreetmap.org/way/275130540>
- AHN5 DSM/DTM en PDOK-luchtfoto (PDOK)
