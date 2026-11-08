# Nederlands Hervormde Kerk (Meteren)

Landmark voor de hervormde dorpskerk aan de Kerkstraat in Meteren (gemeente West Betuwe), rijksmonument 16509, BAG-pand `0236100000008970`. De kerk is middeleeuws van oorsprong; schip en driezijdig gesloten koor zijn in 1837 en rond 1875 ingrijpend verbouwd. De ongepleisterde toren heeft twee geledingen (onderbouw mogelijk 14e, bovenbouw late 15e eeuw) en een tentdak.

## Bestanden

- `nederlands-hervormde-kerk-meteren.glb`: één node `building:kerk`, meters, Y omhoog.
- `nederlands-hervormde-kerk-meteren.json`: catalogusitem.
- `nederlands-hervormde-kerk-meteren-1-1000.stl`: los printbestand op 1:1000, millimeters, Z omhoog.

Generator: `scripts/generate-nederlands-hervormde-kerk-meteren.mjs`.

## Oorsprong en oriëntatie

Oorsprong RD (147800,44; 430615,01) op de as van het schip, maaiveld NAP +4,42 m (3DBAG). De X-as loopt langs de nok van het schip van de toren naar het koor (ONO, 23,9 graden boven RD-oost, gemeten op de zuidgevel van het BAG-pand); Y wijst naar het NNW. Het model vervangt het enige PDOK-pand op deze plek, `NL.IMBAG.Pand.0236100000008970` (kerk, toren en noordelijke aanbouw).

## Onderdelen

- Schip 18,3 × 9,0 m, zadeldak met nok op 12,6 m en goot op 6,3 m, vier spitsboogvensters en een ingang aan de zuidzijde als blinde nissen.
- Oostgevel van het schip met opstaande gevelrand, hoeklisenen, topblokje en oculus, boven het koordak uit.
- Koor 8,5 × 6,5 m, driezijdig gesloten, schilddak met gelijke helling (nok 8,75 m), schoorsteen op het schildpunt, dakkapel in het oostvlak, grote spitsboogvensters in de sluiting en de noordgevel, deur met venster in de zuidgevel.
- Aanbouw ten noorden van het schip (14 × 7,3 m, zelfde BAG-pand), zadeldak met nok op 7,25 m en twee dakkapellen aan de noordzijde.
- Toren 4,4 × 5,3 m: onderbouw tot 7,5 m, bovenbouw iets ingesprongen met drie blindnissen per gevel, twee galmgaten per gevel, uurwerken op de zuid- en oostzijde, tentdak van 16,35 tot 25,3 m met een dakkapel per dakvlak; ingang aan de westzijde.

## Geschat en weggelaten

Plattegrond uit BAG, nok- en goothoogtes en dakhellingen uit AHN-DSM (0,5 m) en 3DBAG; de torenhoogte volgt de hoogste AHN-pixel (NAP +28,8 m, 24,4 m boven maaiveld) plus een geschat stuk naaldtop. Geleding van de toren, vensterposities en -maten, de dakkapellen en de schoorsteen zijn geschat van foto's; schoorsteen en dakkapellen zijn verbreed tot 0,9 m. Weggelaten: windhaan en kruis, dakgoten, de grijze plint, de smalle verbindingsgang tussen aanbouw en koor (alleen als laag blok) en vensters in de aanbouw, waarvan geen bruikbare foto was.

## Controle

De generator maakt één gesloten volume (genus 0) met vlakke voet. De test plaatst het model op een uitsnede van 200 × 200 m, controleert `replacesBuildings`, de mesh en de printbaarheid zonder extra steun op 1:1000 (steunvolume +0,003 %). Het model is van vier kanten vergeleken met de PDOK-reconstructie en met schuine foto's van Wikimedia Commons.

## Bronnen

- [3DBAG-pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0236100000008970) en [BAG WFS](https://service.pdok.nl/lv/bag/wfs/v2_0)
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0) en [PDOK-luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0)
- [Rijksmonumentenregister 16509](https://monumentenregister.cultureelerfgoed.nl/monumenten/16509), [Kunstreisboek Gelderland (DBNL)](https://www.dbnl.org/tekst/sten009monu05_01/sten009monu05_01_0148.php), [Wikidata Q17374086](https://www.wikidata.org/wiki/Q17374086), [OSM way 274830706](https://www.openstreetmap.org/way/274830706)
- [Foto's op Wikimedia Commons](https://commons.wikimedia.org/w/index.php?search=Meteren+kerk&title=Special:MediaSearch&type=image)
