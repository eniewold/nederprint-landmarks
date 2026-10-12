# ABN AMRO-hoofdkantoor (Amsterdam)

Vereenvoudigd landmarkmodel van het complex aan Gustav Mahlerlaan 10,
ontworpen door Pei Cobb Freed & Partners en voltooid in 1999. Het model volgt
de oorspronkelijke gebouwvorm, het AHN en de 3D BAG uit 2023; de lopende
verbouwing en bouwsteigers worden niet als permanente architectuur opgenomen.

## Bestanden

- `abn-amro-hoofdkantoor.glb`: meters, Y omhoog, gesloten node `building:abn-amro`.
- `abn-amro-hoofdkantoor.json`: catalogusitem met plaatsing en bronnen.
- `abn-amro-hoofdkantoor-1-1000.stl`: millimeters, Z omhoog, 181,8 × 118,1 × 106,7 mm.
- Generator: `scripts/generate-abn-amro-hoofdkantoor.mjs`.

## Plaatsing en bouwdelen

Oorsprong RD (120100, 483400), +X oost en +Y noord. Modelhoogte nul is
NAP -0,46 m. De voet ligt op NAP -1,20 m en sluit daarmee in het terrein aan.
De laagste bruikbare PDOK-bemonstering op de zuidoostelijke straat is
ellipsoïdisch +42,47959 m; het AHN-DTM geeft daar circa NAP -0,455 m.
Die PDOK-hoogte is ook de terugval voor een uitsnede zonder bemonsteringspunt.
Alleen BAG-pand `0363100012146659` wordt vervangen. De losse westelijke
straatvleugel, het verwijderde Circl-paviljoen en naburige panden horen niet
bij dit model. De oorspronkelijke backlog-URL lag westelijk van dit complex.

Het model bestaat uit benoemde prisma's en dakvlakken: de hoge granieten
torenschijf (NAP +104,04 m), gebogen noordelijke en rechte zuidelijke
glasvleugel (+92,61 m), lagere torenschijf (+69,86 m) en achterste glasvleugel
(+62,18 m), noord- en zuidvleugels (+28,86 m), gebogen zijvleugels, centrale
dealingroom/daktuin (+8,42 m), vier glazen lichtkappen, lagere noordhal,
ontvangstpaviljoen, verbindingsgang, zuidportaal en gemeten dakinstallaties.
De kappen zijn vlakken tussen goot en top, geen gestapelde AHN-plakken.

## Geschat en vereenvoudigd

Gevelraster (kantoorlagen circa 3,9 m), vensterbreedtes, glasbanden en nisdikte
van 0,35 m zijn afgeleid van schuine Commons-foto's. Vlakke dakhoogtes,
torencontouren, lichtkaptoppen en installaties komen uit AHN en 3D BAG.
Gebogen gevels zijn polygonale benaderingen; kleine contourruis is verwijderd.
De vrije topsleuf in de hoge toren heeft intern een spitse bovenzijde van
circa 50 graden in plaats van een vlak plafond. Dit is een printaanpassing.
Verbindingsvolumes onder daken zijn vereenvoudigd; nissen die door een
aangrenzende vleugel worden afgedekt, zijn dichtgemaakt.

## Weggelaten

Letters en logo's, glasroedes, leuningen, onderhoudsgieken en smalle
gevelonderdelen zijn dunner dan 0,9 m en niet vrijstaand op 1:1000 opgenomen.
Zonnepanelen en lage dakroosters zijn dunner dan 0,9 m; grotere
installatiekasten zijn wel opgenomen. Tuin, bomen, bassin en straatbestrating
blijven PDOK-terrein. Bouwsteigers en tijdelijke installaties vallen buiten
het model van de permanente bouwvorm.

## Controle

Generator: `NoError`, één verbonden buitenvolume; GLB en STL worden uitsluitend
door het script geschreven. De STL heeft een vlakke voet. Vensters zijn
ondiepe nissen; de topsleuf is spits. De tijdelijke 1:1000-controle met
`supportedSolid` en 45 graden voegt circa 0,7% volume toe onder nissen en
kleine uitkragingen; er is geen afzonderlijk steunmateriaal nodig.

De webshoptest controleert de plaatsing, vervangen pand-id, beide toren- en
glashoogtes, alle vier lichtkappen, geometrische vensternissen en geslotenheid.
De landmark- en API-suites zijn uitgevoerd. Vier schuine renders zijn
vergeleken met de daadwerkelijke PDOK-gebouwtegels en Commons-foto's:
de nieuwe versie heeft per zijde gevelreliëf, regelmatige glasbanden en
herkenbare torenschijven; dakvlakken en lichtkappen zijn regelmatiger dan
de reconstructieruis. Kaart en volledige preview-export zijn gecontroleerd;
de exacte uitsnede van 250 × 250 m op 250 × 250 mm bevat het hele model.
Controlebeelden en previewbestanden blijven buiten deze repo.

## Bronnen

- [Pei Cobb Freed & Partners: ABN AMRO Bank Head Office](https://www.pcf-p.com/projects/abn-amro-bank-head-office/).
- [PDOK BAG-WFS](https://service.pdok.nl/lv/bag/wfs/v2_0), pand `0363100012146659` (CC0).
- [PDOK AHN-WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), DSM/DTM 0,5 m (CC0).
- [PDOK actuele luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0) voor de gehele plattegrond.
- [3D BAG, TU Delft/3DGI](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012146659), AHN5 2023, CC BY 4.0.
- Wikimedia Commons: [ABN AMRO1](https://commons.wikimedia.org/wiki/File:ABN_AMRO1.jpg), [ABN AMRO2](https://commons.wikimedia.org/wiki/File:ABN_AMRO2.jpg), [ABN AMRO4](https://commons.wikimedia.org/wiki/File:ABN_AMRO4.jpg), Migdejong; foto's uitsluitend als visuele referentie.
- [ABN AMRO Headquarters Amsterdam](https://commons.wikimedia.org/wiki/File:ABN_AMRO_Headquarters_Amsterdam.jpg), Steven Lek, CC BY-SA 4.0, 19 december 2017.
