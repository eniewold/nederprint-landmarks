# Koninklijk Theater Carré — Amsterdam

Volledig theaterpand op 1:1000: historische zaal met doorlopende gebogen schildkap, middenrisaliet met fronton, centrale dakruiter, toneelgebouw, grachtvleugels en ronde zuidelijke aanbouw. Opgebouwd uit gevelvolumes, gekromde dakprofielen en afzonderlijke bouwdelen; geen gestapelde hoogtelagen.

## Bronnen en maatvoering

BAG `0363100012165489`, actuele BGT, PDOK-orthofoto en AHN DSM/DTM 0,5 m, geraadpleegd 9 oktober 2026. [3D BAG CC BY 4.0](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012165489) bevestigt voet, dakruiter en achterbouw. Maaiveld NAP 1 m, historische goot 20,35 m, gebogen dak 29,3 m, dakruiter 32,87 m, toneelgebouw 29,15 m en lagere achtervleugel 22,82 m. Het volledige BAG-pand wordt vervangen; afzonderlijke aangrenzende huizen blijven behouden.

[RCE 185](https://monumentenregister.cultureelerfgoed.nl/monumenten/185) beschrijft het circusgebouw uit 1887 en het sterk gebogen dak. Schuine foto's: [Jvhertum, voorgevel 2010](https://commons.wikimedia.org/wiki/File:Carre_amsterdam_facade.jpg), [C messier, dak en gevel 2016](https://commons.wikimedia.org/wiki/File:Carre_Theatre_2038.jpg), [grachtzijde met gevelvinnen](https://commons.wikimedia.org/wiki/File:Onbekendegracht_carre.jpg).

RD-oorsprong `[122103,486160]`, x-as 16,5°, onderkant 0,4 m onder maaiveld. Modelmaat 60,87 × 51,92 × 32,27 m, dus mm op 1:1000. De kap ontstaat door twee glad geïnterpoleerde, elkaar snijdende AHN-profielen; dit zijn doorlopende dakvlakken.

## Geschat en vereenvoudigd

Interpolatie tussen gemeten dakprofielen, frontonvorm, vensters, pilasters, balkon, glasstroken en vier hoge toneelgevelvinnen zijn uit foto's geschat. De noordelijke glasgevel is een dichte wand van 1,02 m met blinde nissen; de ruimte achter de vinnen heeft een gesloten lagere bodem. Balkon/kroonlijst hebben een steile onderrand en circa 1,5 m plaatdikte. Vensters blijven blind. Dunne dakroeven, letters, gevelbeelden, balkonhek, vlaggen en dakinstallaties ontbreken. Gevelrelief is schematisch; de omvang, gebogen kap en achterbouw volgen de metingen.

## Controle voor rapportage

- Generator: `NoError`, één verbonden onderdeel, genus 0, 3.520 driehoeken, volume 62.898,2 m³.
- Vier renders −35°, 55°, 145° en 235° naast de echte PDOK-reconstructie, vergeleken met de schuine foto's: ronde kap, fronton, dakruiter, gevelvinnen, glaswand en lage aanbouwen gecontroleerd.
- [Controle-URL](http://127.0.0.1:3037/kaart/52.36239/4.90403/350/1x1/0): rotatie, Amstelgevel, aansluiting op de gracht en behoud van buurhuizen gecontroleerd.
- Echte webshop-export RD `[122020,486110,122170,486260]`, 150 × 150 mm op 1:1000, basis 1 mm, z-factor 1 en 45° overhanginstelling: 348 objecten, 88.100 driehoeken, drie printonderdelen, totale hoogte 33,5 mm. Hele complex binnen de uitsnede; export visueel bekeken.
- Voorbereiding met/zonder 45° overhanginvulling: beide `NoError`, identiek volume 65.057,7185 mm³. Geen aanvullende steunen nodig. Geometrische controle; geen fysieke proefprint gemaakt.
- 297 catalogus-/API-tests en één lokale echte exportcontrole geslaagd. Nieuwe test controleert vervanging, complete voet, doorlopend gekromd dak, dakruiter, fronton en beide achterbouwhoogten.

Vier renders, brongegevens, kaartbeeld en `preview.3mf` staan in de afzonderlijke werkomgeving onder `carre/`.

## Genereren

`node scripts/generate-carre.mjs` of `--scale 1000 --out models`. Controleer op de kaart de gebogen kap, middenrisaliet en de vereenvoudigde glaswand/gevelvinnen aan de Onbekendegracht.
