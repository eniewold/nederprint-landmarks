# Chassé Theater, Breda

Landmarkmodel van het theater van Herman Hertzberger (1995), op basis van de BAG-voetafdruk, AHN5 en foto’s. Het golvende dak is opgebouwd uit doorlopende gemeten doorsneden, niet uit gestapelde hoogteplakken. Het model heeft één gesloten `building:theater`-node.

## Bestanden en genereren

- `chasse-theater.glb`: catalogusmodel in meters, Y omhoog.
- `chasse-theater.json`: plaatsing in RD en de te vervangen BAG-identificatie.
- `chasse-theater-1-1000.stl`: model op 1:1000.
- Generator: `node scripts/generate-chasse-theater.mjs` vanuit de landmarkrepo; met `--out <lege map>` kan een proef buiten de catalogus worden gemaakt.

## Maten en plaatsing

Het model staat op RD (113060, 399960); lokale +X is evenwijdig aan RD-vector (0,961, −0,276) en lokale +Y staat daar linksom haaks op. Maaiveld is NAP +3,035 m uit 3D BAG; de vlakke onderzijde ligt 0,5 m daaronder. De BAG-voetafdruk is 103,8 bij 121,8 m in het bouwstelsel; de hoogste daklijn is gemeten op circa NAP +34,46 m. Het model vervangt `NL.IMBAG.Pand.0758100000069483`.

De hoofdgolven zijn in het AHN-DSM op meerdere dwarsposities uitgelezen; bijvoorbeeld de hoge top bij NAP +34,25 m en de volgende top bij NAP +30,15 m. De verbindingsrand en de lage westelijke vleugel zijn vereenvoudigd tot gemeten profielen. Glasstijlen, posities en helling van de twee aangesloten schuine trapbanden en de binnenkant van de lage open bouwlaag zijn op foto’s geschat.

## Weggelaten en vereenvoudigd

- De open onderbouw is als blinde nissen weergegeven: de brede horizontale bovenbouw zou anders op 1:1000 niet steunloos printen. De kolommen blijven als ten minste 1 m brede stijlen zichtbaar.
- De uitkragende dunne dakrand en staalspanten zijn vereenvoudigd tot aangesloten dakvlakken voor steunloos printen. De exacte diagonaal van de geveltrappen is geschat; kleine kozijnen en letters zijn weggelaten.
- De aangrenzende Kloosterkazerne en het casino horen niet bij deze BAG-voetafdruk en blijven de PDOK-gebouwen.

## Bronnen

- [3D BAG, BAG-pand 0758100000069483](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0758100000069483), AHN5 (2024), LoD2.2 RMSE circa 0,39 m.
- [PDOK AHN DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0) en [luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0), bekeken 10 november 2026.
- [Wikimedia Commons: Chassé Theater](https://commons.wikimedia.org/wiki/Category:Chass%C3%A9_Theater): aanzichten van entree en plein.
- [Architecture History: Chassé Theater](https://architecture-history.org/architects/architects/HERTZBERGER/OBJ/1992-1995,%20Chass%C3%A9%20Theater,%20Breda,%20Netherlands.html): luchtfoto, situatie en doorsneden.
- [Herman Hertzberger — Chassé Theater](https://www.chasse.nl/herman-hertzberger-1trc): achtergrond en bedoeling van het golvende dak.
