# Atrium (Amsterdam)

## Bestanden en plaatsing

`atrium-zuidas.glb` in meters met Y omhoog, `atrium-zuidas.json` voor de catalogus en `atrium-zuidas-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-atrium-zuidas.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [119736, 483700], X-as [0.9985366703262117, 0.05407881298477529], Z=0 op NAP 0.65 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 43.897341 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012074056, NL.IMBAG.Pand.0363100012246549, NL.IMBAG.Pand.0363100012246583, NL.IMBAG.Pand.0363100012246582, NL.IMBAG.Pand.0363100012244160.

## Bouwdelen, gemeten maten en aannames

Het hele Atrium: drie oudere kantoorblokken op48,915/37,222/25,517NAP en de centrale steenkern61,409NAP, plus de nieuwe noordtoren42,813NAP met dikke dakrand43,461 en machines46,806NAP en nieuwe zuidtoren66,672NAP met machines68,693NAP. De oorspronkelijke vijf-volumeopzet blijft herkenbaar. De lage eigen meanderlobby9,268NAP, glazen westatrium9,297NAP, zuidglasverbinding14,029NAP en noordelijke glasbruggen/shuttles25,518/14,017/21,63/14,047/13,517NAP zijn opgenomen. De grote buitenhof blijft open; twee sub-metre meetkieren in de eigen lobby zijn gedicht, niet de hof.

De vijf eigen BAG-panden zijn gecontroleerd in echtePDOK-gebouwtegels: de garage0363100012244160 reconstrueert ook twee torens en lobbies dubbel, en wordt samen met vier bovengrondse panden vervangen. Alleen zijn echte bovengrondse luifels, puien en shuttles zijn gebouwd; geen openbare tuin of volledige garageplaat. Naastgelegen TwoAmsterdam, Strawinskyhuis en WTC behouden hun panden. Het lage zuidelijke maaiveld is circa.65NAP; noordelijke Strawinskylaan ligt circa2,4m hoger.

Nieuwe torengevels met2.4m ronde hoeken volgens constructeur/MVSA; bronzen vinnen.8m uitkragend/.95m uiterste plaatdikte/45graden ondersnijding,3.9m ritme geschat uit fotos
Wintertuinhoek in de zuidtoren op42-54NAP geschat ±2m, vloerbanden daar onderbroken; open glaspartijen blind gemaakt
Drie oude glaskappen als parabolische dwarsprofielen tussen gemeten goot/nok geëxtrudeerd, geen hoogtelagen; exacte boogkromming en kapvoet ca.5-1m onzeker
Oud glasraster2.9m/3.55m,1.05m piers en.3m blind; lage glaspuien.4m blind en doorlopende plint vanaflaagste straatmaaiveld .65NAP geschat
Oudere kantoorplannen op eigen BAG geclipt, dakrand/klimaatruis vereenvoudigd tot benoemde rechte vlakken; hoofddaken en grote machinekoppen gemeten met3DBAG/AHN4
Eigen garageID0363100012244160 bevat dubbele hoge dakreconstructies: volledig vervangen, maar alleen echte bovengrondse lobbies/meanderluifel en shuttlebouwdelen meegenomen; geen plein/tuinplaat inGLB

De eerste zuidvin op9,6NAP en noordvinnen9,6/13,5NAP lopen bij de glasatria over in de gemeenschappelijke massieve plint en zijn daar vereenvoudigd, zodat geen fijne lussen ontstaan. De echte buitenhof is de enige doorgaande opening (genus1).

## Weggelaten

Geen dunne vrijstaande glasframes, zonnepanelenroedes, antennes, labels of buitenplein/tuin in de GLB. Glasatria zijn gesloten massa met blinde puien; de colonnade onder de meanderluifel is voor1:1000 een dikke gesloten pui. De volledige ondergrondse garage is niet bovengronds gemodelleerd.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 60,912 driehoeken. Printcontrole per node: NoError, 0.50% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: vijf kantoorvolumes, drie gebogen glaskappen en centrale steenkern; 55 graden: afgeronde nieuwe torens met ondersteunde bronzen banden en wintertuinhoek; 145 graden: gemeten dakmachines en hele lage meanderlobby met open buitenhof; 235 graden: glasverbindingen en shuttles, geen dubbele garage- of buurgeometrie.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 240 bij 240 mm, 331 objecten, 323,506 driehoeken, 80.6 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://mvsa-architects.com/en/projects/atrium-zuidas/ (architect,5volumes,rondehoeken/wintertuinen/bronzenbanden)
- https://zuidas.nl/construction-project/atrium/ (gemeente,nieuw/oud2018,schuinefoto)
- https://vandenbergbouwkundigen.nl/projecten/the-new-atrium-amsterdam (constructeur,hoekstraal2.40m)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012074056 (TU Delft/3DGI CC BY4.0; andere4eigenBAG-panden zelfdebron)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (BAGCC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4DSM/DTM CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actueleortho)
- https://commons.wikimedia.org/wiki/File:Atrium_zuidtoren_Amsterdam-Zuid.jpg (Choinowski CC BY-SA4.0)
- GemeenteZuidas/MVSA,SiebeSwart,JanVonk,MarcelSteinbach,OssipvanDuivenbode:schuinefotos alleenvisuele referentie buitenrepo
