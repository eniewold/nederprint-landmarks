# Prinsenhof (Den Haag)

Het complete ensemble aan de Prinses Beatrixlaan en Schenkkade: kantoor- en
hotelbeuken van atelier PRO, drie woonvolumes en woon-werkplint van Rijnboutt,
en de dubbele hoge schijven met glazen middenstuk. Alle bovengrondse bouwdelen
van de drie vervangen panden zijn opgenomen, inclusief verbindingsgebouwen,
liftkernen, dakinstallaties en drie glazen atria. De open tuinen blijven open.

## Bestanden en plaatsing

`prinsenhof-den-haag.glb` bevat één gesloten building-node, meters, Y omhoog;
`prinsenhof-den-haag.json` de plaatsing; `prinsenhof-den-haag-1-1000.stl`
heeft een vlakke voet en is circa 85,0 × 175,4 × 118,5 mm op 1:1000.
Generator: `scripts/generate-prinsenhof-den-haag.mjs`.

Oorsprong RD (82965, 455108), +X op 34,4°, z = 0 op NAP +0,50 m,
voet z = -1,2 m. Drie gecontroleerde straatpunten geven ellipsoïdisch
+44,32711, +44,22174 en +43,97555 m; de laagste is terugvalhoogte.
Vervangen panden: `0518100000267537`, `0518100000352973` en
`0518100000207900`. Er is geen nieuwe terrein-, tuin- of garageplaat.

## Bouwvlakken en gemeten maten

De drie kantoorbeuken eindigen op NAP +56,604/+56,616/+56,586 m;
hotel +70,582 m met lagere vleugel +56,600 m. De drie woonvolumes eindigen
op +71,513/+71,518/+71,542 m, met liftkernen +76,203/+76,223/+76,193 m.
De volledige vijflaagse woon-werkplint ligt op +17,383 m. Verbindingsdaken
liggen op +23,580, +34,450, +43,033, +45,270 en +57,324 m; de gemeten
hellende glasdakrand loopt van +34,450 naar +36,247 m.

De hoge schijven hebben daken +95,555 en +95,539 m, het glazen middenstuk
+102,456 m. Mastvoeten liggen op +110,332 en +110,321 m; lokale AHN-metingen
geven tips rond +117,778 en +117,594 m. De maximumhoogte van een naburig
gebouw in de onderzoeksuitsnede is niet als Prinsenhofhoogte gebruikt.
Alle gemeten installatiekasten met betekenisvolle breedte zijn meegenomen.
Het model bestaat uit afzonderlijke bouwprisma's, profielen en doorlopende
dakschalen; er zijn geen gestapelde DSM-hoogtelagen.

## Geschat en weggelaten

Bouwplannen en dakcontouren zijn circa 0,5–1 m vereenvoudigd uit BAG,
3D BAG en luchtfoto. Regelmatige kantoorvensters (circa 1,35 × 2,2 m),
woonvensters (2,1 × 2,1 m), verdiepingsritme, puien, loggiavelden en
loggiadiepte van 1,7 m zijn uit schuine architectfoto's geschat.
Gewone vensters zijn circa 0,4 m diepe blinde nissen.

De atria hebben elk drie zadeldakbeuken: goten NAP +12,95 m, nokken
+14,35 m, schalen 1 m dik. Dit profiel, glaspuiverdeling en kolommenraster
zijn geschat rond de gemeten gemiddelde dakhoogte +12,85 m en de zichtbare
dakvorm op foto's; onzekerheid circa 1 m. Kolommen zijn voor printbaarheid
1 m dik en staan op circa 4,5 m afstand. Beide eindpuien hebben een
spitse open entree. De dakmasten zijn verdikt naar 1,4–1,0 m diameter.

Fijne glasroedes, lamellen, dakrelings, groen en masttuien smaller/dunner
dan 0,9 m zijn weggelaten. Smalle meetruisstroken van 0,6–0,7 m op enkele
daken zijn opgenomen in hun grotere dakvlak, zonder extra fictieve muren.

## Print- en beeldcontrole

Generator, STL en opnieuw ingelezen GLB: `NoError`, één verbonden volume,
97.436 driehoeken. De 45°-printcorrectie voegt 1,833% volume toe. Onder de
atriumdaken vormt deze correctie verbonden schuine onderschalen: op het
controlepunt in het zuidelijke atrium begint de onderschaal rond NAP
+5,58 m, ongeveer vijf meter boven straat. De hogere binnenruimte wordt
daardoor kleiner; ten minste vier meter vrije doorgang en de spitse entrees
blijven behouden. Er is geen afzonderlijk steunmateriaal. De drie open
buitenhoven blijven over hun volledige hoogte leeg.

De permanente test controleert de drie vervangen panden, één geplaatst
model, gesloten ruwe en gecorrigeerde volumes, tien gemeten dakhoogtes,
gevelnissen, vrije doorgang in het atrium en de drie open tuinen in zowel
ruw model als print. Vier renders zijn naast dezelfde vier richtingen van
de echte PDOK-reconstructie en schuine architectfoto's beoordeeld. De
gevelindeling, loggia's, verschillende torens, glaskappen, techniek en
dakmasten maken het ensemble herkenbaar.

GLTFLoader, controlekaart en volledige printpreview zijn gecontroleerd.
De exacte 1:1000-export omvat het hele complex op 240 × 240 mm:
395 objecten, 248.216 driehoeken en 122,3 mm hoogte inclusief ondergrond.
Onderzoek, foto's, renders en export blijven buiten de repo.

## Bronnen

- [atelier PRO](https://www.atelierpro.nl/projecten/prinsenhof), architect,
  bouwdelen en schuine buitenfoto's van onder anderen Peter de Ruig en
  René Souverijn; uitsluitend auteursrechtelijke referentie.
- [Rijnboutt](https://rijnboutt.nl/portfolio/prinsenhof/), architect,
  drie woonvolumes en woon-werkplint.
- [Huurdersvereniging](https://hvprinsenhof.nl/prinsenhof-historie/), historie.
- [BAG](https://service.pdok.nl/lv/bag/wfs/v2_0), CC0.
- [AHN DSM/DTM](https://service.pdok.nl/rws/ahn/wcs/v1_0), CC0.
- [Luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000267537),
  alle drie panden, TU Delft/3DGI, CC BY 4.0.
- PDOK 3D Tiles: passende reconstructie en straathoogtes.
