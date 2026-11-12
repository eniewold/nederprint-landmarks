# Heilige Willibrorduskerk, Coevorden

Vereenvoudigd landmarkmodel van de driebeukige neogotische kerk aan de Wilhelminasingel, met een driezijdig gesloten koor, een asymmetrisch ingebouwde toren met ingesnoerde piramidespits, een traptorentje, de lage polygonale kapel linksvoor en de lagere sacristie. De huidige kerk is gebouwd in 1913–1914 en heeft rijksmonumentnummer 468607; het jaartal 1640 uit de oorspronkelijke werklijst hoort niet bij dit gebouw.

## Bronnen en plaatsing

- [Monumenten.nl 468607](https://www.monumenten.nl/monument/468607) en [parochie](https://www.immanuelparochie.nl/beheer/uploads/file/2023/rapport_publicatie_06-02-2023_compressed-website.pdf) voor geschiedenis, naam en monumentstatus.
- [3D BAG, pand 0109100000022834](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0109100000022834) voor de voetafdruk en dakvlakken; dit BAG-pand wordt vervangen.
- PDOK AHN5-DSM 0,5 m voor de hoogtematen; maaiveld rond NAP +11,1 m, hoofdnok rond +26,4 m en hoogste meting in de torenspits +41,9 m.
- [Commons-foto van de voorgevel](https://commons.wikimedia.org/wiki/File:Coevorden_Wilhelminastraat_2b_Sint-Willibrordeuskerk.jpg) voor de toren, gevel en entree.
- Oorsprong RD (246378, 520173,5), +X langs het schip naar het koor en +Y links daarvan. De onderkant ligt 0,5 m onder het maaiveld.

## Schattingen en print

Van de 2.916 DSM-cellen binnen de BAG-contour ontbreken er 74, verspreid over vooral de dakvlakken; de grootste aaneengesloten groep telt tien cellen. De langsdaken en nok konden worden bepaald uit aangrenzende metingen en de 3D BAG; de torenomhulling is grotendeels gemeten. Venster- en deuropeningen zijn vereenvoudigd als blinde nissen. De kapel ligt binnen dezelfde BAG-contour; de noordelijk aangrenzende panden 0109100000015027 en 0109100000015028 vallen buiten het model. De kapelvorm en het dak zijn benaderd uit de foto, BAG-dakvlakken en AHN; posities en maten van traptorentje, torennissen, steunberen en de kap van de sacristie zijn eveneens benaderd. Smal maaswerk en kruisen zijn weggelaten. De dakramen van de spits zijn weggelaten: uit de frontale foto geschat zijn ze smaller dan circa 0,9 m en daarom op 1:1000 niet afzonderlijk printbaar. Alle maten zijn meters op ware grootte; STL op 1:1000 en 1:100 in millimeters.

`node scripts/generate-heilige-willibrorduskerk-coevorden.mjs --components` schrijft GLB, catalogus-JSON en STL en controleert manifoldstatus, overhang en Float32-rondgang.

## Bestanden en controle

- `heilige-willibrorduskerk-coevorden.glb` en `.json`: catalogusmodel en plaatsing.
- `heilige-willibrorduskerk-coevorden-1-1000.stl` en `heilige-willibrorduskerk-coevorden-1-100.stl`: losse printmodellen op 1:1000 en 1:100.
- De gerichte test controleert plaatsing, de kapel, geslotenheid en 45-gradenondersteuning. Vier zijden zijn met de PDOK-reconstructie vergeleken; van twee hoeken zijn foto's beschikbaar.
