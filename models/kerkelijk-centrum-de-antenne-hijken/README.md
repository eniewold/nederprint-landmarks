# Kerkelijk Centrum De Antenne (Hijken)

Vereenvoudigd landmarkmodel van de gereformeerde zaalkerk uit 1906 en het aangebouwde ontmoetingscentrum uit 1982–1983. De kerk heeft een zadeldak, toegang met twee vensternissen en een rond bovenlicht; het ontmoetingscentrum heeft een lager dwars zadeldak en verbindingsbouw. In 2006 kregen beide samen de naam Kerkelijk Centrum De Antenne.

## Bestanden en ligging

- `kerkelijk-centrum-de-antenne-hijken.glb` en `.json`: catalogusmodel en plaatsing in meters.
- `kerkelijk-centrum-de-antenne-hijken-1-1000.stl` en `kerkelijk-centrum-de-antenne-hijken-1-100.stl`: losse printmodellen in millimeters.
- `scripts/generate-kerkelijk-centrum-de-antenne-hijken.mjs`: generator uit bouwdelen en dakvlakken; maakt beide printschalen bij elke aanroep en vermeldt ze in `printFiles`.
- Oorsprong RD `[229806, 545859]`, +X vanaf de voorgevel naar de achterbouw en +Y links daarvan. Vervangt BAG-pand `1731100000030444`. Maaiveld circa NAP +14,06 m, onderkant 0,3 m daarin.

## Onderzoek en aannames

BAG en PDOK-gebouwreconstructie bepalen contour en positie. AHN-DSM geeft de kerknok rond NAP +23,05 m en de nok van de achterbouw rond NAP +20,5 m. Van 1.271 rastercellen binnen de kerkcontour ontbreken er vier, in groepjes van maximaal twee; nabijgelegen meetwaarden en 3D BAG geven de dakvlakken voldoende weer. 3D BAG gebruikt hier AHN4 uit 2022.

De maten en plaatsing van de blinde nissen en de lage zijuitbouw zijn uit voorgevel- en schuine foto's benaderd. Vensters hebben spitse bovenzijden; het ronde bovenlicht is een blinde nis. Raamroeden, de schoorsteen en het kruis zijn vanwege hun geschatte dikte onder 0,9 m weggelaten. De houten klokkenstoel uit 2016 staat op de Brink tegenover het kerkgebouw en is een afzonderlijk object; die is daarom niet in het kerkmodel opgenomen.

## Controle

De generator rapporteert één gesloten onderdeel, `NoError` en genus 0. De gerichte test controleert catalogus, BAG-vervanging en ondersteuning bij 45 graden. Vier modelaanzichten zijn naast de PDOK-gebouwreconstructie en beschikbare schuine foto's gelegd; de foto's tonen vooral voor- en zijgevel. De kaart is met en zonder landmarklaag en schuin bekeken; de volledige uitsnede is op 1:1000 zonder ondersteuning in de printpreview gecontroleerd.

## Bronnen

- [Protestantse Gemeente Beilen: De Antenne](https://www.pgbeilen.nl/kerkgebouwen/antenne/): bouwjaar, achterbouw en actuele foto's.
- [Historie gereformeerde kerk Hijken](https://gereformeerdekerken.info/2019/10/24/de-eerste-100-jaar-gereformeerde-kerk-in-hijken-2/): plaats van de vrijstaande klokkenstoel en bouwgeschiedenis.
- [3D BAG, pand 1731100000030444](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1731100000030444) en [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0).
- [Historisch gevelbeeld op Reliwiki via Gereformeerdekerken.info](https://gereformeerdekerken.info/2021/11/02/de-antenne-te-hijken-is-pkn-kerk-in-wijkgemeente-hijken-hooghalen/).
