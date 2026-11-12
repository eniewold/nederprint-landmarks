# Hervormde kerk (Elim)

Vereenvoudigd landmarkmodel van de zaalkerk uit 1916 aan de Dorpsstraat, rijksmonument 507295. Het gebouw heeft een zaalkerk met zadeldak, een lagere achtervleugel met schildvormige beëindiging en platte aanbouw, twee zijportalen en een toren met vierkante voet, achtkantige bekroning en tentdak. De taaktekst vermeldde geen monumentstatus; het monumentenregister bevestigt die wel.

## Bestanden en plaatsing

- `hervormde-kerk-elim.glb` en `hervormde-kerk-elim.json`: catalogusmodel in meters en RD-plaatsing.
- `hervormde-kerk-elim-1-1000.stl` en `hervormde-kerk-elim-1-100.stl`: losse printmodellen in millimeters.
- `scripts/generate-hervormde-kerk-elim.mjs`: generator uit benoemde bouwdelen en vlakke daken; schrijft steeds beide printschalen en vermeldt ze in `printFiles`.
- Oorsprong RD `[235733, 522134.5]`, +X langs de nok naar het oosten en +Y links daarvan; vervangt BAG-pand `0118100000184677`. Maaiveld circa NAP +11,79 m, onderkant 0,3 m daarin.

## Onderzoek en schattingen

De BAG-contour, AHN-DSM en 3D BAG bepalen ligging, zaaldak en achteraanbouw. Het zaaldak heeft een nok rond NAP +25,45 m, de torentop rond NAP +36,63 m. In de BAG-contour ontbreken 28 van 1.727 AHN-rastercellen, waaronder een groep van 19 naast de torenvoet; torentop en aangrenzende vlakken zijn meetbaar en samen met 3D BAG en foto's beoordeeld. Voor deze locatie gebruikt 3D BAG AHN4 uit 2022.

De maatvoering van de torengeledingen, dakvorm en plaatsing van de nissen, ramen en zijportalen zijn op de beschikbare foto's en aangrenzende hoogtemetingen benaderd. De dakvlakken zijn vlakke bouwdelen, niet gestapelde hoogtelagen. De schoorsteen op de oude achtergevelbeelden is weggelaten omdat de breedte op basis van foto en AHN onder circa 0,9 m wordt geschat; dun raammaaswerk, uurwerkdetails en windvaan zijn eveneens te klein voor 1:1000. Blinde vensternissen hebben printbare spitse bovenzijden.

## Controle

De generator rapporteert één gesloten onderdeel, `NoError` en genus 0; de gerichte test controleert catalogusplaatsing, pandvervanging en ondersteuning op 45 graden. Vier aanzichten zijn met de PDOK-gebouwreconstructie en drie schuine RCE-foto's vergeleken: het model vult vensters en de torenbekroning aan en behoudt de lage achteraanbouw. De kaart is met en zonder landmarklaag en schuin bekeken; de volledige uitsnede is op 1:1000 zonder ondersteuning in de printpreview gecontroleerd.

## Bronnen

- [Rijksmonumentenregister 507295](https://monumentenregister.cultureelerfgoed.nl/monumenten/507295).
- [3D BAG, pand 0118100000184677](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0118100000184677) en [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0).
- RCE/Wikimedia Commons: [zuidwestgevel](https://commons.wikimedia.org/wiki/File:Exterieur_overzicht_toren_en_kerk,_zuidwestgevel,_toren_met_achtkantige_bekroning_met_tentdak._-_Elim_-_20322391_-_RCE.jpg), [noordgevel](https://commons.wikimedia.org/wiki/File:Exterieur_overzicht_noordgevel_-_Elim_-_20321186_-_RCE.jpg) en [zuidoostgevel](https://commons.wikimedia.org/wiki/File:Exterieur_overzicht_zuidoostgevel_-_Elim_-_20321187_-_RCE.jpg).
