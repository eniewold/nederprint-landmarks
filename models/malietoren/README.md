# Malietoren (Den Haag)

Kantoor van Benthem Crouwel (1996) boven de verdiepte Utrechtsebaan. De
glazen kopgevels vouwen naar binnen; vijf parkeerlagen krijgen lamellen,
de bovenbouw glasbanden en zichtbare stalen gevelstijlen en diagonalen.

## Bestanden en plaatsing

`malietoren.glb` bevat één gesloten building-node, meters, Y omhoog.
`malietoren.json` beschrijft de plaatsing; `malietoren-1-1000.stl` heeft
een vlakke voet en is circa 32,3 × 40,8 × 80,2 mm, inclusief de voet onder
de verdiepte rijbaan. Generator: `scripts/generate-malietoren.mjs`.

Oorsprong RD (82287, 455635), +X op 34,35°, z = 0 op NAP +1,0 m. De voet
z = -5,5 loopt onder de weg (AHN circa NAP -4 m) door. Vier straatpunten
geven ellipsoïdisch +44,11795 tot +44,35272 m, met de laagste als terugval.
Alleen BAG-pand `0518100000224954` wordt vervangen; openbare weg en terrein
blijven behouden, er is geen plaat over de Utrechtsebaan.

## Bouwdelen en maten

De doorlopende bovenbouw eindigt op circa NAP +71,55 m. Twee overstekende
dakplaten staan op korte dakstijlen en eindigen op gemeten +74,545 m.
De centrale techniekstrook is open rond de kern (+75,713), twee grote
technische kasten (+73,907 en +73,897) en lagere ventilatievelden
(+72,665 en +72,660). Alle onderdelen zijn vaste prisma’s, dakvlakken
en draagdelen; er zijn geen gestapelde DSM-hoogtelagen.

De poort heeft een geschatte opening van 15 m, onderkant van de bovenbouw
op geschatte NAP +9,2 m en verbonden 45°-printkragen. Die kragen beperken
de vrije doorgang boven de verdiepte weg tot een spits rond +3,1 m;
ze zijn een printvereenvoudiging en geen nauwkeurige reconstructie van
de echte draagconstructie. De zijentree is als glasnis met kleine luifel
opgenomen.

## Geschat en weggelaten

De circa 3 m terugliggende kopgevels, glasbanden, parkeerlamellen, entree,
gevelstaal, draagpoten, poortbreedte en onderzijde zijn uit architectfoto’s
geschat en circa 1–2 m onzeker. Het kantoorritme is 3,6 m, gewone glasnissen
0,45 m diep. Dakplannen, dakstijlen en apparaten zijn op de gemeten hoogtes
vereenvoudigd, circa 0,5–1 m onzeker. Losse aluminiumlamellen, ronde
glasblokken, roedes en leuningen smaller dan 0,9 m zijn weggelaten; de
parkeerlagen krijgen samenhangend lamellenreliëf.

## Controle

Generator, STL en opnieuw ingelezen GLB: `NoError`, één verbonden volume.
Permanente test controleert plaatsing, pand-id, drie dakhoogtes, gevelnis
en de vrije rijbaandoorgang in zowel het ruwe als het op 45° gecorrigeerde
printmodel. De printcorrectie voegt 1,620% volume toe onder gevelnissen en
dakoverstekken, zonder afzonderlijk steunmateriaal. Vier renders zijn naast identieke hoeken van de echte PDOK-
reconstructie en schuine architectfoto’s beoordeeld. Alle gevels krijgen
glas-/lamellenreliëf, de kopgevels staal en de dakvelden afzonderlijke platen
en installaties. GLTFLoader, kaart en volledige printpreview zijn gecontroleerd.
De exacte 1:1000-export omvat het hele model op 150 × 150 mm: 215 objecten,
64.016 driehoeken, 81,2 mm hoogte met ondergrond. Controlebeelden en
bronfoto’s blijven buiten de repo.

## Bronnen

- [Benthem Crouwel](https://www.benthemcrouwel.com/projects/malietoren),
  architect: gevouwen glasgevels, parkeerlamellen en staalconstructie,
  oplevering 1996; schuine foto’s uitsluitend auteursrechtelijke referentie,
  auteur niet vermeld op de projectpagina.
- [BAG](https://service.pdok.nl/lv/bag/wfs/v2_0), CC0.
- [AHN DSM/DTM](https://service.pdok.nl/rws/ahn/wcs/v1_0), CC0.
- [Luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000224954),
  TU Delft/3DGI, CC BY 4.0.
