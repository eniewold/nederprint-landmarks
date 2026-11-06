# Sint-Petrusbasiliek (Boxtel)

Vereenvoudigd gesloten landmarkmodel van de laatgotische kruisbasiliek met toren, schip, zijbeuken, dwarsschip, kooromgang, straalkapellen en vieringdakruiter. De daken zijn afzonderlijke schuine vlakken en de onderdelen vormen één samenhangend volume.

- `sint-petrusbasiliek-boxtel.glb`: één catalogusnode `building:kerk`, in meters.
- `sint-petrusbasiliek-boxtel.json`: positie en vervanging van BAG-pand `0757100001442444`.
- `sint-petrusbasiliek-boxtel-1-1000.stl`: losse print, Z omhoog; circa 78 × 34,8 × 69,55 mm.
- Generator: `node scripts/generate-sint-petrusbasiliek-boxtel.mjs --components`.

De oorsprong ligt op RD (150776,25, 400112,25) op het hart van de toren. De X-as [0,9841, 0,1776] loopt langs het schip naar het oosten. Onderzijde −0,5 m, terrein-offset −0,3 m; het BAG-maaiveld is NAP +8,272 m. De dakvlakken volgen de 3D BAG: nok rond NAP +35,4 m, goot en zijbeuken lager; de AHN DSM-top meet NAP +77,32 m. De lantaarns en het bovenste uiteinde zijn vereenvoudigd omdat de dunne ornamenten niet printbaar zijn; de bron vermeldt 71,6 m inclusief windvaan, het model eindigt op circa 69,05 m boven maaiveld.

De precieze vormen van kooromgang, straalkapellen, dakruiter en steunberen en de maten en plaatsing van de blinde vensternissen zijn geschat naar 3D BAG en foto's. De open lantaarns zijn op deze schaal verdikt en uitgevoerd als gesloten kern met nissen. Fijn maaswerk, balustrades en windvaan zijn weggelaten.

De generator controleert overhang, Float32-rondgang en geslotenheid. Het resultaat is één volume met genus 0. Een steuncontrole bij 45 graden geeft vrijwel gelijke doorsneden en inhoud. Er is een volledige uitsnede van 150 × 150 m op 1:1000 met en zonder landmark geëxporteerd; voor de visuele vergelijking zijn de reconstructie en het model vanuit vier hoeken naast foto’s geplaatst.

Bronnen: [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0757100001442444), [AHN DSM, PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0), [Stichting Kerkconcerten Boxtel, torenhoogte](https://www.stichtingkerkconcertenboxtel.nl/beiaard/), [bouw en geschiedenis](https://www.odulphusvanbrabant.nl/petrus/cultuur-historie/bezichtiging-van-de-st-petruskerk/), [foto’s Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Petruskerk_(Boxtel)), [luchtfoto gemeente Boxtel](https://www.boxtel.nl/nieuws/samen-zorgen-we-voor-zichtbaar-en-beleefbaar-boxtels-erfgoed).
