# Watertoren De Reus van Schimmert (Schimmert)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-schimmert-de-reus-van-schimmert.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een zestienhoekig prisma met lisenen, reservoir, borstwering, torenkamer en kegeldak zijn één omwentelingsprofiel, de trappenhuizen omgewentelde cilinders en de aanbouw blokken met platte daken; vensters zijn nissen.

De watertoren van Schimmert, bijgenaamd de Reus van Schimmert, is in 1926–1927 gebouwd naar een ontwerp van Jos Wielders in de stijl van de Amsterdamse School. Hij is 38 m hoog (hoogste punt NAP +178 m) en heeft een betonnen vlakbodemreservoir van 1150 m³ (13,5 m binnenwerks, 7,9 m diep). Boven in de toren zat tot de Tweede Wereldoorlog een restaurant; sinds 2021 zijn er een winkel, een restaurant, een brouwerij en een uitzichtpunt. Rijksmonument 507197.

## Bestanden

- `watertoren-schimmert-de-reus-van-schimmert.glb`: één node van klasse `building`, op het maaiveld. De export vult elke node apart op; een los reservoir zou een eigen voet tot de grondplaat krijgen. De aanbouw hoort bij hetzelfde BAG-pand en staat tegen schacht en trappenhuizen, en zit daarom in dezelfde node.
- `watertoren-schimmert-de-reus-van-schimmert.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight`, `groundSamplePoints` en het vervangen BAG-pand.
- `watertoren-schimmert-de-reus-van-schimmert-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [185741.33, 323226.15], de as van het reservoir: de top van het kegeldak in het AHN4-DSM, 0,1–0,2 m naast het hart van de BAG-cirkel van pand 0951100000003112 (r 7,05 m). Het modelstelsel staat 12,5 graden linksom van RD-oost (`xAxis` [0.9763, 0.2164]); -Y wijst naar het zuidzuidoosten, de symmetrielijn tussen de twee trappenhuizen. In dit stelsel loopt de zuidgevel van de aanbouw (de grens met BAG-pand 0951100000003113, het aangebouwde woonhuis) precies langs X.

De toren staat op een heuvel midden in het dorp. Het plateau rond de voet ligt op NAP +140,0 m (AHN-DTM, +140,3 tot +140,5 aan de noordkant, 0,3–0,45 m lager naast de aanbouw en tot +139,55 in een greppel ten westen ervan); op 10 tot 12 m van het hart valt het talud 1,5 tot 2,5 m af naar de straten. `groundSamplePoints` liggen op het plateau net buiten de plint en naast de trappenhuizen (AHN NAP +139,95 tot +140,30); de laagste, naast het oostelijke trappenhuis, bepaalt de hoogte. De onderkant ligt op -0,6 m in plaats van -0,3, zodat ook de voet van de aanbouw aan de lage zuidkant onder het terrein blijft. `groundHeight` 185,64 = NAP 140,0 + 45,64 (NLGEO2018-geoïde op de oorsprong).

## Onderdeel `building:schacht-reservoir-trappenhuizen-en-aanbouw`

- Bakstenen schacht als zestienhoek (14,3 m over de vlakken), met op elke hoek een lisene van 1,0 m breed die 0,2 m buiten de hoek uitsteekt, op een plint tot 1,0 m met een schuine bovenkant tot 1,6 m.
- Twee rijen vensternissen in de elf vlakken die vrij liggen: vierkante vensters van 1,1 × 1,2 m van 3,2 tot 4,4 m en smalle hoge vensters van 0,9 × 2,0 m van 18,4 tot 20,4 m, net onder het reservoir.
- Rond reservoir van 16,9 m doorsnede vanaf 21,0 m, met een afgeronde onderrand tot 21,7 m; het kraagt 1,3 m over de vlakken van de schacht uit.
- Twee vensterbanden (vanaf 23,5 en 28,9 m): een uitstekende lijst (0,25 m), een terugliggende band van 0,6 m (0,2 m diep) en een bovenlijst, met onderkanten en plafonds onder 56 graden.
- Borstwering tot 31,9 m, daarbinnen een omloop op 30,9 m (3D BAG NAP +170,7 tot +171,1), een terugliggende glazen torenkamer (r 6,2 m) en een vlak kegeldak met een overstek tot r 7,8 m: dakrand op 33,35 m (3D BAG +173,3 tot +173,7), top op 36,4 m (AHN4 +176,4, 3D BAG +176,7).
- Aan de zuidzuidoostkant twee ronde trappenhuizen van 3,1 m (BAG-cirkel r 1,55 m), deels in de schacht en het reservoir, het westelijke tot 38,6 m (NAP +178,6) en het oostelijke tot 37,4 m (+177,4), elk met een ring vensters in de kop (0,3 m diep, van 2,6 tot 0,9 m onder de top). Een verbindingsmuur sluit ze op de schacht aan, zoals de BAG-contour.
- Tussen de trappenhuizen boven het dak een kopwand van 1,2 m dik tot 38,1 m (3D BAG +178,6, AHN4 +177,5 tot +178,5); ten zuiden ervan ligt de omloop open als terras.
- Tussen de voeten van de trappenhuizen de lage aanbouw uit hetzelfde BAG-pand, tot de grens met het woonhuis: platte daken op 3,3, 6,5, 3,9 en 3,4 m (de vier dakvlakken van de 3D BAG, van west naar oost).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Schimmert)): bouwjaar, architect, 38 m, hoogste punt NAP +178 m, 1150 m³, reservoir 13,5 m binnenwerks en 7,9 m diep.
- BAG-pand 0951100000003112 (PDOK, ‘Pand in gebruik’, bouwjaar 1927, 220 m²): cirkel van de schacht (r 7,05 m), het oostelijke trappenhuis (r 1,55 m), de westgevel langs het westelijke trappenhuis en de zuidgevel van de aanbouw. BAG-pand 0951100000003113 (het aangebouwde woonhuis, 1927) blijft PDOK; zijn 3D BAG-reconstructie past op het AHN (rmse 0,19 m, nok NAP +150,1) en het model hangt er niet boven.
- 3D BAG (AHN5, 2024): kegeldak, omloop, trappenhuizen, kopwand en de dakvlakken van de aanbouw (hoogtes hierboven).
- AHN4 DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): top en helling van het kegeldak (0,38), de as van het reservoir, het maaiveld rond de voet en het talud. De wanden zelf zijn in het DSM uitgesmeerd (de rand loopt van r 6,6 op 33 m tot r 8,4 op 10 m); de diameters komen daarom uit de foto's.
- Foto [Schimmert-Watertoren (1)](https://commons.wikimedia.org/wiki/File:Schimmert-Watertoren_(1).JPG) (telefoto van het noorden, vrijwel horizontaal; 50,9 px/m in de uitsnede, geschaald op de reservoirdiameter, en met het AHN-kegeldak als ijkpunt): onderkant van het reservoir, de twee vensterbanden, borstwering, glazen torenkamer, dakrand van 15,6 m, kegeldak, de kopwand met vlakke bovenkant en de hoogteverhouding van de trappenhuizen.
- Foto [Overzicht - Schimmert - 20197530 - RCE](https://commons.wikimedia.org/wiki/File:Overzicht_-_Schimmert_-_20197530_-_RCE.jpg) (van het noordoosten; 19,8 px/m, geschaald op het trappenhuis uit de BAG en gelijk aan de schaal uit de hoogte): reservoir 16,9 m, schacht 15,2 m over de lisenen (model 15,0 m), de zestien vlakken met lisenen en de vensters onder het reservoir.
- Foto's [Overzicht - Schimmert - 20197529 - RCE](https://commons.wikimedia.org/wiki/File:Overzicht_-_Schimmert_-_20197529_-_RCE.jpg) en [Exterieur OVERZICHT - Schimmert - 20312482 - RCE](https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_Schimmert_-_20312482_-_RCE.jpg) (zuidzijde): trappenhuizen met vensterkoppen, kopwand, de aanbouw en het woonhuis.
- Foto [Schimmert - Watertoren De Reus 1](https://commons.wikimedia.org/wiki/File:Schimmert_-_Watertoren_De_Reus_1.jpg) (huidige toestand): schacht met lisenen, vierkante vensters boven de plint, glazen balustrade op de borstwering.
- NLGEO2018 (geoïde 45,64 m op de oorsprong).

## Geschat en weggelaten

Geschat: de diameters van reservoir en schacht (uit twee foto's met dezelfde schaal; de BAG-cirkel van 14,1 m is kleiner dan de foto's en het DTM-gat van 14,6 m laten zien), de dikte en de uitsprong van de lisenen, de hoogte en de vorm van de afgeronde onderrand, de maten van de lijsten en vensterbanden (in het echt slanker; zo blijven ze op 1:1000 zichtbaar), de straal van de glazen torenkamer, de dikte en de plaats van de kopwand, de hoogte van de vensterring in de koppen van de trappenhuizen, de verbindingsmuur tussen trappenhuis en schacht en de maat en hoogte van de vensters in de schacht (in het echt de hoge vensters 0,6 m breed; als nis 0,9 m). De plint is gelijkgetrokken; de onderkant van de schacht ligt op het hele plateau op dezelfde hoogte.

Weggelaten (kleiner dan 0,9 m of te dun): de glazen balustrade op de borstwering, de antennes en hun beugels, de vensters in de vensterbanden (0,6 m hoog; de band zelf is als terugliggende strook gemodelleerd), de paarsgewijze kleine vensters in de trappenhuizen, de gebogen overgang van de vensterkoppen naar de kopwand (vereenvoudigd tot een rechte wand tussen de cilinders), de kleine vensters in de plint, de regenpijp in de kopwand en de dakopbouwen van de aanbouw. Het woonhuis (pand 0951100000003113) en de trap en het talud rond de toren horen bij PDOK en het terrein en staan niet in het model.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met een factor 1,0086: dat is de wig onder de reservoirbodem (1,0 tot 1,3 m uitkraging over schacht en lisenen, tussen 19,7 en 21,0 m) en die onder het overstek van het kegeldak boven de omloop (tussen 31,4 en 33,0 m). Lijsten, vensterbanden, de vensterring in de koppen van de trappenhuizen en de vensters in de schacht hebben onderkanten en plafonds onder 56 graden; de doorsneden op 0,5, 1,2, 4, 10, 19,5, 22, 24,1, 26, 29,4, 30,6, 33,2, 35, 36 en 37,8 m blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komt een ring steun onder de reservoirbodem en het dakoverstek en dunne schoren in de groeven tussen de lisenen. Op de kaart staat de toren op het verborgen PDOK-blok; het maaiveld ligt 0–0,6 m boven de onderkant van de voet (BASE −0,6), ook aan de lage zuidkant.

Controle-URL: http://localhost:3000/kaart/50.89789/5.82419/200/1x1/0
