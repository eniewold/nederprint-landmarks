# Stadhuis (Middelburg)

GLB `stadhuis-middelburg.glb` in meters/Y omhoog; catalogus
`stadhuis-middelburg.json`; één verbonden STL `stadhuis-middelburg-1-1000.stl`
in millimeters met vlakke voet. Generator:
`node scripts/generate-stadhuis-middelburg.mjs`.

RD-oorsprong **31675,391496**, X-as **.929,.37** langs de Marktgevel,
Y naar de achterzijde. De straatmonsters liggen buiten bordes en muren.
AHN-straatniveau circa NAP +4.33 m; onderkant .8 m lager. Alleen BAG-pand
**0687100000029116** wordt vervangen; aangrenzende panden blijven behouden.

Het model bevat de Vleeshal, Marktzaal met dwarskap, lagere achtervleugel,
kleine binnenplaats, kloktoren met vierkante onderbouw en achtkante
lantaarn, kloknissen, vier pinakels, bol/spitsbekroning, koertoren op de
Markthoek, Vleeshal-topgevels, kapelletjes, gootbalustrade, vensters en
bordes. De dakvlakken zijn doorlopend, zonder DSM-hoogtelagen.

BAG levert de hoofdcontour. OrthoHR en AHN-DSM/DTM .5 m bepalen de nokrichting,
dakvormen en hoofdmaten: Vleeshalnok 23.55 m, Marktzaalnok 22.47 m,
achtervleugelnok 18.12 m boven straat; torenbekroning 52.05 m zonder de
metalen windvaan. Bbox onderzoek 31590,391400,31760,391610, 9 oktober 2026.
Topgevels, koertoren, pinakels, kleine kapelletjes, venster- en nismaten
zijn uit schuine foto's vereenvoudigd en dus geschat. De achterbouw en
kleine binnenplaats volgen een vereenvoudiging van AHN en ortho binnen
de BAG-contour. Historische galerijen en maaswerk zijn blinde nissen;
het bordes heeft een volle draagkern. Windvaan/zeeridder, roeden, goten,
fijn beeldhouwwerk en ornamenten smaller dan .9 m zijn weggelaten voor
1:1000. Kleine afgesloten binnenholtes achter aansluitende nissen zijn
gevuld; geen losse geometrie.

Controle: Manifold `NoError`, één solid, genus 5, **5622** driehoeken,
25445.1 m³; STL **35.24 × 57.98 × 52.85 mm** op 1:1000. Werkelijke
printvoorbereiding: `NoError`, 26062 → 26072 mm³, afgerond 0.0% extra.
Core catalogus-/API-tests: 276; met de laatste print- en previewcheck
278 tests groen. Volledige preview en 3MF van 110 × 110 m: 179 objecten,
64968 driehoeken, 110 × 110 × 54.6 mm. GLB bekeken met three.js
`GLTFLoader`; vier schuine zijderenders bekeken naast PDOK en foto's,
inclusief de verbeterde achtergevels en kapelletjes. Controlekaart:
[Middelburg](http://localhost:3017/kaart/51.49896440/3.61103924/220/1x1/0).

Bronnen: [Rijksmonument 29284](https://monumentenregister.cultureelerfgoed.nl/monumenten/29284),
[Open Monumentendag informatieblad](https://www.openmonumentendag.nl/wp-content/uploads/2019/01/Stadhuis-van-Middelburg-informatieblad.pdf),
[Marktgevel 2023, 1](https://commons.wikimedia.org/wiki/File:2023_Stadhuis_Middelburg_(1).jpg),
[Marktgevel 2023, 2](https://commons.wikimedia.org/wiki/File:2023_Stadhuis_Middelburg_(2).jpg),
[achter/Noordstraat RCE](https://commons.wikimedia.org/wiki/File:Achtergevel_en_gevel_Noordstraat_-_Middelburg_-_20154835_-_RCE.jpg),
[Bodenplaats RCE](https://commons.wikimedia.org/wiki/File:Overzicht_Bodenplaats_in_de_richting_van_het_Stadhuis_-_Middelburg_-_20154212_-_RCE.jpg).
Foto's zijn alleen visuele referenties; de geometrie is zelf opgebouwd.
