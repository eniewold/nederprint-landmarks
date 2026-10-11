# Helpoort (Maastricht)

Vereenvoudiging op 1:1000 van de poort, de korte westelijke weermuur, de oostelijke weermuur, de Jekertoren en de noordwaartse muurstomp. Deze delen horen samen bij BAG-pand `0935100000106387`; de verder westelijk aangesloten gebouwen en de Pater Vincktoren blijven PDOK-geometrie.

## Bestanden en positie

- `helpoort.glb`: meters, Y omhoog, één gesloten `building:helpoort-weermuur-en-jekertoren`-node; poort, daken en torens zijn eerst afzonderlijke bouwdelen en vervolgens verenigd, zodat de stadsprintexport het dak niet onafhankelijk door de tunnel heen opvult.
- `helpoort.json`: RD-oorsprong `[176641.15, 317347.25]`, xAxis `[0.99849735898, 0.05479985505]`. +X loopt oostwaarts langs de muur, +Y naar Sint Bernardusstraat/stadszijde. Veldzijde is -Y.
- `helpoort-1-1000.stl`: 34,8 × 11,0 × 21,3 mm; één verbonden volume, zonder losse grondplaat nodig.
- Generator: `scripts/generate-helpoort.mjs`, vanuit de repository draaien met `node scripts/generate-helpoort.mjs`.

Vier expliciete grondpunten op de straten aan weerszijden geven PDOK-hoogten 93,555–93,676 m; het laagste punt en offset +0,03 m vormen de datum. De modelvoet ligt op -0,25 m. AHN-maaiveld ligt rond NAP 48,0 m. Terrein, rivier en park worden niet gedubbeld.

## Bouwvormen en maten

BAG/BGT bepalen de D-vormige halfronde veldtorens, de circa 7,2 × 8,5 m grote poortromp en de volledige aansluitende muur. Torendaken zijn convex opgebouwde kapvlakken boven een halfronde voorkant en vlakke achterkant; de Jekertoren heeft een ronde kegelkap. Het hoofdgebouw heeft twee ongelijke, rechte dakvlakken: korte veldhelling van 14,72 m naar de nok op 16,10 m (y=-2,6), lange stadshelling naar 10,28 m. Dat volgt AHN en de LoD2.2-dakvlakken, zonder hoogtelagen.

AHN-toppen van de poorttorens zijn NAP 69,000 en 68,719 m, circa 21,000 en 20,719 m boven de gekozen huidige grond. Het Vestingmuseum en Zicht op Maastricht noemen ongeveer 24 m. Dit verschil is onopgelost: het model volgt de gemeten hoogten, niet de gepubliceerde ronde maat. Ook de gemeten daknok ligt hoger dan de gepubliceerde 14 m aan de veldzijde; gevelhoogte en nok zijn geen uitwisselbare maten. De Jekertoren-top is NAP 63,707 m; de lagere muurkruin is rond NAP 51,10 m, exclusief vereenvoudigde kantelen.

De circa 4 m brede poortdoorgang uit de bronnen is doorgaand, intern met 55°-top: geschatte aanzet 1,10 m en top 3,957 m. Ronde monden blijven ondiepe nissen; de printexport vult hun vlakke/ronde overhang gedeeltelijk op. Dat is een bewuste vereenvoudiging van het werkelijke halfronde gewelf.

De houten mezekouw is circa 4,2 m breed, heeft drie vensternissen en een doorlopende schuine onderschoor. Drie veldvensters met driehoekige bovenkappen, drie bovenste schietnissen, het grote stadsvenster in vier stijlen/twee rijen, vier bovenvensters, dorpels/lijsten en de stadsdakkapel komen uit foto's. Op beide hoofdtorens en de Jekertoren staan vergrote blinde schiet-/wachtnissen. De weermuur heeft zeven gegroepeerde kantelen, met open tussenruimten van circa 1,1 m; de stadszijde bij de Jekertoren heeft een blinde boognis.

## Geschat en weggelaten

Erkermaten, vensterhoogten, dakkapel, schietnissen, torengoot 17,35 m, kraagprofielen en kantelensteek zijn geschat uit schuine foto's, AHN-dwarsprofielen en de bekende poortbreedte. Dragende en vrijstaande details zijn minstens 0,9 m; vensternissen zijn circa 0,3–0,4 m diep. Smalle schietgaten zijn verbreed of gegroepeerd. De erker heeft een massieve 45°-onderschoor in plaats van de dunne echte houten consoles. Aangehechte lijsten/reliëfs mogen dunner zijn.

Windvaantjes, vlaggen/masten, dakhaakjes, metselvoegen, glasroeden, hekwerken, de valhek-sleuf en teksten zijn onder de printschaal weggelaten. De lange schoorsteen op de historische RCE-binnenfrontfoto ontbreekt in de actuele AHN/ortho; daarom is deze niet teruggebracht. De doorlopende muur buiten dit BAG-pand blijft PDOK. Geen stadswal/talud in de GLB.

## Controle

- Generator en GLB: `NoError`, één verbonden volume, genus 4; STL identiek aan GLB op schaal.
- Permanente test in `tests/landmark-models.test.ts`: volledige vervangingsvoetafdruk, beide torentoppen, ongelijke dakhoogten, aansluiting Jekertoren, grondplaatsing en open doorgang vóór/na 45°-opvulling.
- Gedeelde 45°-analyse: 1511,829 naar 1515,715 m³ (+0,2571%). Doorsneden op 7 en 12 m gelijk; de ronde monden voegen beperkt oppervlak toe op 1 en 3 m. Centrale 1 × 8 × 1 m controlebox blijft leeg.
- Werkelijke `createModelBundle`-export op 1:1000, 80 × 80 m uitsnede, 45°, onderplaat 1 mm, zonder bomen: volledige poort en muur in de export; doorgang van dichtbij open gecontroleerd. Hoogte complete uitsnede 25,6 mm. Geen fysieke proefprint uitgevoerd.
- Vier GLB-renders naast dezelfde PDOK-reconstructie en schuine Commons-foto's, 30° boven de horizon: -35°/235° voegen stadsvensters, lijsten, dakkapel, ronde Jekertoren en kantelen toe; 55°/145° voegen mezekouw, veldvensterkappen, poortmond en torennissen toe. Geen zijde verliest een groot bouwdeel ten opzichte van PDOK.
- Kaart: [controle](http://localhost:3000/kaart/50.84553/5.69445/220/1x1/0?size=80). Positie, oriëntatie, grondaansluiting en volledige BAG-vervanging visueel gecontroleerd. Controlefoto's en exports blijven buiten de repo.

## Bronnen

- [RCE 27997](https://monumentenregister.cultureelerfgoed.nl/monumenten/27997), poort en aansluitende ommuring tot de herbouwde hoektoren.
- [Vestingmuseum Maastricht](https://www.vestingmuseummaastricht.nl/index.php/museum/vestingmuseum), halve torens, gewelf, orgelhuisje/erker, gepubliceerde hoogten.
- [Zicht op Maastricht](https://www.zichtopmaastricht.nl/locaties/helpoort), poortbreedte en historische bouwvorm.
- [Commons Helpoort](https://commons.wikimedia.org/wiki/Category:Helpoort): `Helpoort Maastricht (2).JPG`, `Helpoort stadsmuur en hoektoren.JPG`, `Maastricht2015, Helpoort3.jpg`, `Maastricht2015, wal tussen Helpoort en Jekertoren.jpg`, `Maastricht2015, stadsmuur en Jekertoren1.jpg`, `Binnenfront - Maastricht - 20145456 - RCE.jpg` en veld-detailfoto's. Alleen bekeken als bron; geen pixels in de distributiebestanden.
- PDOK BAG/BGT, AHN DSM/DTM 0,5 m, Actueel_orthoHR, geraadpleegd 2026-10-11; [3D BAG pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0935100000106387) voor dakvlakken. Getallen zijn handmatig vereenvoudigde maten; geen mesh overgenomen.
