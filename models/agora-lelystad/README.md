# Agoratheater (Lelystad)

Vereenvoudigd landmarkmodel van het theater van UNStudio, geopend in 2007.
De gevouwen dak- en gevelvormen zijn opgebouwd uit vlakken en gesloten
bouwdelen; de oostelijke dienstaanbouw hoort bij hetzelfde volume.

## Bestanden

- `agora-lelystad.glb`: catalogusmodel in meters, glTF met Y omhoog.
- `agora-lelystad.json`: RD-plaatsing en het te vervangen BAG-pand.
- `agora-lelystad-1-1000.stl`: gesloten model, Z omhoog, in millimeters.
- `../../scripts/generate-agora-lelystad.mjs`: generator (manifold-3d).

## Positie en bouwdelen

De oorsprong ligt op RD (161050, 502590), bij NAP −3,25 m. De lokale X-as
wijst naar het oosten en de Y-as naar het noorden. Het model vervangt
`NL.IMBAG.Pand.0995100000739215`. De voet loopt 0,4 m onder het gekozen
maaiveld. De toneeltoren, de schuine midden- en zijvlakken, het foyerdak en de
lage dienstaanbouw zijn één verbonden volume. Het hoge dak ligt op circa
NAP +22,1 m en het noordelijke foyerdak op circa NAP +14,4 m.

## Geschat en weggelaten

De dakhoogten en hoofdcontour zijn afgeleid uit 3D BAG en gecontroleerd tegen
het AHN; de vorm en diepte van de glas- en entreenissen zijn geschat op basis
van foto's. De nissen zijn beperkt tot blinde uitsparingen voor de
printbaarheid; glasroeden, letters en fijne gevelbeplating zijn weggelaten.
De bestaande terreinbehandeling en het thema bepalen de uiteindelijke kleur
op de kaart; het losse GLB bevat een oranje materiaal.

## Bronnen

- [3D BAG: BAG-pand 0995100000739215](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0995100000739215)
- PDOK AHN5 DSM/DTM 0,5 m en actuele luchtfoto, geraadpleegd 10 november 2026.
- [UNStudio: Theatre Agora](https://www.unstudio.com/projects/further/theatre-agora/)
- [Wikimedia Commons: Agoratheater](https://commons.wikimedia.org/wiki/Category:Agoratheater)
- [Arch2O: ontwerptekeningen en oostgevel](https://www.arch2o.com/theatre-agora-unstudio/)
- [Aerostockphoto: schuine luchtfoto 2019](https://www.aerostockphoto.com/media/d1f48993-b811-4a92-984c-792971735928-lelystad-theather-agora-next-to-the-large-hall-with-approx-75)
- [Gemeente Lelystad: welstandsnota 2015](https://www.lelystad.nl/Docs/Welstandsnota%202015.pdf)

## Controle

De generator meldt een gesloten manifold; de catalogustest controleert
plaatsing, vervanging van het BAG-pand en de overhangopvulling op 1:1000.
Een volledige preview van 200 × 200 m op 1:1000 bevat geen afzonderlijk
ondersteuningsobject voor het theater. Het oostaanzicht is vergeleken met
de ontwerptekening en de gemeentelijke beschrijving van een blinde gevel;
de 2019-luchtfoto toont de driehoekige glazen dakinsnijding. De precieze
aansluiting van de smalle daknaad is geschat.
