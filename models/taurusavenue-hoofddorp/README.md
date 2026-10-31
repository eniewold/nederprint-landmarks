# Zuidtoren (Hoofddorp)

Vereenvoudigd, printbaar model van de Zuidtoren aan de Taurusavenue 1-41 bij station Hoofddorp (BAG-bouwjaar 2006), een kantoortoren van 20 lagen aan een vijver. De plattegrond is een schild. De bolle west- en zuidkant heeft een gevel van horizontale aluminium ribben met raambanden. Die gevel staat boven de begane grond buiten de lobby op een rij witte kolommen en steekt boven het dak uit. Aan de Taurusavenue ligt een holle glazen oostgevel met de draaideur, en in het zuiden en noorden zit een smalle rechte kop. Achter het schild ligt in het zuidwesten een verdiepte installatiezone met een lamellenband in de gevel.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `taurusavenue-hoofddorp.glb` | Model in meters, Y omhoog, twee nodes: `building:taurusavenue-hoofddorp-toren` en `building:taurusavenue-hoofddorp-entree` |
| `taurusavenue-hoofddorp.json` | Catalogusitem |
| `taurusavenue-hoofddorp-1-1000.stl` | Los te printen op 1:1000 (32 × 47 × 82 mm), Z omhoog |

## Oorsprong en oriëntatie

De RD-oorsprong is `[108055.0, 478410.0]`, midden in de BAG-contour. De lokale assen vallen samen met de RD-assen (X naar het oosten, Y naar het noorden), omdat het gebouw geen rechte hoofdas heeft. Lokaal z = 0 is NAP −4,72 m, het maaiveld op het plein aan de Taurusavenue (AHN-DTM −4,75 tot −4,60; 3D BAG −4,77). `groundHeight` is 38,43 m: NAP plus de geoïde ter plekke (NLGEO2018 43,148, gelijk aan de 43,15 van Pharos aan het Mercuriusplein). `groundOffsetMetres` is −0,15. De `groundSamplePoints` liggen op het plein en de stoep aan de oost- en noordkant, niet in de vijver tegen de west- en zuidgevel.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren (pand `0394100000242103`) | BAG-contour, circa 30 × 44 m | +73,55 m | BAG, 3D BAG (dakvlak 721 m² op 73,54–73,58), AHN-DSM |
| Schild boven de begane grond | 1,6 m (noordwest) tot 2,4 m (west, zuid) buiten de BAG-contour | onderkant +1,0 m | AHN-DSM (dakrand 1,4–2,9 m buiten de contour), foto |
| Schildrand boven het dak | 1,5 m dik | +76,6 m (zuid en west), via een helling naar +74,2 m (noordwest) | AHN-DSM (76,5–76,9 en 73,7–74,3) |
| Kolommen onder het schild | 10 × Ø 0,9 m, om de circa 6,9 m | tot +1,0 m | foto (geschat) |
| Installatiezone achter het schild | circa 7 × 18 m | vloer +68,7 m, bordessen +71,3 m, trede +72,4 m | 3D BAG dakvlakken 93, 94, 96 en 91 |
| Installatiekast op het hoofddak | 3,7 × 1,8 m | +75,0 m | AHN-DSM (74,8–75,1) |
| Entree: draaideur met de witte ‘1’ | cilinder r 1,7 m (BAG-uitbouw), vin 1,0 × 1,1 m | trommel 3,2 m boven maaiveld (NAP −1,5), vin tot 5,4 m (NAP +0,7) | BAG, foto (hoogtes geschat) |

**Gevelreliëf:** de lobby is 5,7 m hoog, daarboven liggen 20 lagen van 3,48 m. Het schild heeft per laag een doorlopende raamband van 1,75 m hoog en 0,35 m diep, met een plafond onder 45° (19 lagen). Op de bovenste laag zit aan de zuid- en westkant een lamellenband voor de installatiezone. De holle oostgevel en de koppen hebben per laag glasvakken als blinde nissen: 2,0 m breed op 2,9 m in het oosten, twee vakken per laag op de zuidkop en drie op de noordkop. Ook de lobby heeft glasvakken, achter de kolommen en aan de oostkant. De onderkant van het schild loopt vanaf de lobbygevel onder 48° naar de buitenkant: dat is de kraag waardoor het schild zonder steun te printen is.

## Geschat en weggelaten

- Naam: de taak noemde het gebouw ‘Kantoortoren Taurusavenue’. Op de gevel staat ZUIDTOREN, en Skyscraper Center en de verhuurders gebruiken dezelfde naam.
- De verdiepingshoogte (3,48 m) en de lobbyhoogte (onderkant schild +1,0 m) zijn geteld en gemeten op een frontale foto. Skyscraper Center noemt 19 lagen, 75 m en 2003; de BAG noemt 2006.
- Het aantal, de plaats en de dikte van de kolommen zijn geschat (Ø 0,9 m voor 1:1000).
- De schildrand stijgt tussen de noordwestkant en de westpunt van +74,2 naar +76,6 m. Dat verloop is geschat: het DSM is daar onrustig.
- Het schild loopt 0,7 m voorbij de BAG-hoek voor de zuidkop langs. Het DSM meet op dakhoogte tot 2,5 m, maar op foto's is de zuidkop breder. Wat daar verder uitsteekt is waarschijnlijk de puntige top van het schild.
- Het vensterraster op de oostgevel is grover dan in het echt: 2,0 m glas op 2,9 m in plaats van stijlen op circa 1,5 m.
- Weggelaten:
  - de dunne puntige bladen van het schild en de zuidkop boven het dak (dunner dan 0,9 m);
  - de aluminium ribben tussen de raambanden en de gevelonderhoudsinstallatie op het dak (kleiner dan 0,9 m);
  - het terras aan de vijver (maaiveld);
  - de letters ZUIDTOREN.

## Controle

`node scripts/generate-taurusavenue-hoofddorp.mjs` geeft per node `NoError`, genus 0 en één gesloten deel. In de webshop controleert `tests/landmark-models.test.ts` het volgende:

- het hoofddak, de schildrand in het zuiden en noordwesten, de installatiezone, de trede en de installatiekast;
- dat de lobby onder het schild na de printcorrectie op 45° teruggelegen blijft en dat een raamband een nis is;
- de volumegroei door de printcorrectie (onder 1 %), één component per node en de plaatsing op het maaiveld.

Vier schuine aanzichten zijn naast de 3D BAG-reconstructie gelegd. Pharos (`mercuriusplein-hoofddorp`) staat circa 200 m noordwestelijk aan de andere kant van het spoor en overlapt niet.

## Bronnen

- PDOK BAG, pand `0394100000242103` (bouwjaar 2006, Taurusavenue 1-41); actuele orthoHR; AHN-DSM en -DTM 0,5 m (AHN4); 3D BAG LoD2.2 (AHN5, 2023); geoïde NLGEO2018.
- [BAG-viewer](https://bagviewer.kadaster.nl/lvbag/bag-viewer/?objectId=0394100000242103) en [Skyscraper Center: Zuidtoren](https://www.skyscrapercenter.com/building/zuidtoren/6661).
- Foto's op Wikimedia Commons (niet meegeleverd): [Zuidtoren Hoofddorp](https://commons.wikimedia.org/wiki/File:Zuidtoren_Hoofddorp.jpg), [Zuidtoren pic2](https://commons.wikimedia.org/wiki/File:Zuidtoren,_Hoofddorp_pic2.jpg), [Pharos toren en Zuidtoren pic2](https://commons.wikimedia.org/wiki/File:Pharos_toren_en_Zuidtoren_pic2.jpg).
