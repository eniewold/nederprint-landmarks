# Spoorbrug Venlo (Venlo)

Tweesporige Maasbrug met twee doorgaande plaatliggers, een noordelijk fietsdek, drie ovale rivierpijlers en gemetselde landhoofden. De zuidelijk gelegen verkeersbrug is een afzonderlijk object en blijft behouden.

## Bestanden en plaatsing

- `spoorbrug-venlo.glb`: meters, Y omhoog; acht `road:spoorbaan`-nodes, vier `road:fietspad`-nodes met hun eigen BGT-attributen en één gesloten constructienode.
- `spoorbrug-venlo.json`: RD-oorsprong `[208940.581, 375835.571]`, +X `[0.82897545, -0.559285]` naar oostzuidoost; +Y naar noordnoordoost. Vier actuele BGT-dekvlakken worden vervangen.
- `spoorbrug-venlo-1-1000.stl`: één verbonden printvolume met geïntegreerde voet en blinde boognissen in beide landhoofden als printvorm, circa 271,42 × 20,77 × 12,58 mm.
- `scripts/generate-spoorbrug-venlo.mjs`: contouren en meetprofiel als vaste invoer, opgebouwd uit dekvlakken, plaatprofielen en afzonderlijke pijlers; `--out` verwijst naar de catalogusmap.

De plaatsingsbasis is PDOK-water +57,35683 m ellipsoïdisch, met vier meetpunten op het water naast de rivieroverspanning. NAP +13,21 m is een geschatte omzetbasis, gekalibreerd op het oostelijke spoor: dit is geen gemeten actuele waterstand. De enkele AHN-water-/oeverpatches rond +11,6 m zijn onvolledig en horen bij een andere opname. De westelijke AHN-spooraansluiting blijft ongeveer 0,8 m hoger dan PDOK. Het fietsdek eindigt ongeveer 0,5 m lager dan PDOK in het westen en 1,3 m hoger in het oosten; deze verschillen blijven expliciete kaartreviewpunten.

## Maten en bouwdelen

De actuele BGT-hoofdoverspanning is 226,39 m; met beide landhoofden is de volledige contour 270,44 m lang. De afgeronde historische maat van 225 m is niet gebruikt om de contour te schalen. Het spoorbrugdek is circa 12,02 m breed en het fietsdek circa 3,60 m. De fietspad-weglaag zelf is circa 3,2 m breed. Het fietsdek ligt aan de noordzijde, geen extra pad aan de zuidzijde.

De drie rivierpijlerharten liggen op x=-59,11, -0,47 en +58,51 m. Alle pijler- en landhoofdcontouren komen uit actuele BGT-polygonen; naast elkaar geregistreerde eindopleggingen zijn in het totale volume verenigd. De ovale contouren blijven behouden. De opstand is vereenvoudigd tot prisma's met afzonderlijke oplegblokken onder de twee platen.

Het AHN-spoorprofiel loopt van NAP +23,33 naar maximaal +24,09 en terug naar +23,76 m. Voertuigen rond +28 m en gaten vooral in het westelijke veld zijn verwijderd; het dek is daar geïnterpoleerd tussen betrouwbare spoorpunten en het doorlopend meetbare fietsdek. Het fietsdek volgt ongeveer 0,14 m boven het spoorvlak; deze kleine dwarsaanpassing is afgerond uit de metingen. Twee 1,0 m dikke plaatliggers liggen op y=-4,5 en +4,7 m. Hun bovenrand ligt ongeveer 1,7 m boven het spoorvlak, bevestigd door AHN-banden rond +25,8 m en de foto's. De onderrand heeft geschatte haunches: 2,1 m diep tussen de pijlers, 4,1 m bij de rivierpijlers. Dekplaat 1,5 m, oplegblokken, metselwerkhoogte en nismaten zijn vereenvoudigd uit foto's, niet afzonderlijk ingemeten.

Onder het westelijke landhoofd loopt de ronde doorgang dwars door het metselwerk: 8 m breed, vloer 1,8 m en aanzet 2,4 m boven het water, rondboog met de kruin op 6,4 m (maten uit foto's). Onder het oostelijke landhoofd blijft de doorgang een 0,3 m diepe blinde boognis met een spitse top: het landhoofd eindigt daar schuin binnen de breedte van de boog (x = 120,9 tot 122,6 m tegen 117 tot 125 m), zodat een doorgaande boog de kopse kant zou openleggen, en de ligging van de echte doorgang is daar niet bekend. Bovenleiding, leuningen, flenzen, klinknagels en schoren onder 0,9 m zijn weggelaten. Geen eigen rivierbodem of talud in de GLB.

## Wegdek, print en controle

Alle twaalf actuele wegdelen op relatieve hoogte 1 hebben hun oorspronkelijke contour, functie en verhardingsattributen. De vier fietspaden omvatten gesloten verharding/asfalt en een oostelijk open-verhard tegelstuk; de spoorlagen omvatten gesloten verharding en half verhard. Elke laag is de bovenste 0,5 m van het dek. Girders blijven constructie en hebben 2 cm vrijhouding bij de kleurpartitie. De constructie wordt vóór de wegpartitie vrijgesneden en vervolgens van de exacte wegvolumes ontdaan.

Alle brononderdelen en de zelfstandige STL zijn gesloten `NoError`; de STL heeft één verbonden component. Twee doorlopende printwanden met 35° schouders en verbrede eindankers dragen het dek zonder losse steun. De STL, die zonder export wordt geprint, heeft ook onder het westelijke landhoofd de blinde spitse nis als printvorm en is ongewijzigd. De vrije-overhangcheck vindt alleen een numerieke snijsliver van circa 0,0000011 mm. De bronvolumepartitie wijkt circa 0,00000025 m³ af. 15.952 dekstralen vinden nul coplanaire constructiehits en nul wegdelen dunner dan 0,49 m.

Het gebogen plafond van de westelijke doorgang print op 1:1000 niet zonder steun; dat laat het model aan de export over. De doorgang is te laag voor schoren, dus zowel "Ondersteuning v1.0" als "v2.0" vult hem onder het plafond op; aan beide gevels blijft de boog onder een wig van 45 graden open. In de meettest van de webshop (`scripts/overhang-lab`, het model op 1:1000) gaat het volume met "Ondersteuning v2.0" van 13,40 naar 26,98 cm³ (v1.0: 26,98 cm³), zonder ongedragen lagen waar een printlijn in past, in 1,4 s; het vorige model met de nissen kwam op 27,13 cm³. Het meeste daarvan is de opvulling onder het dek, die gelijk is gebleven.

De directe `shareModelSupport`-/`supportedSolid`-test op 1:1000 slaagt: de wegdelen krijgen geen eigen steun en doorsneden tussen de rivierpijlers op 0,5, 2 en 4 mm tonen doorlopende wanden van minstens 0,8 mm. De float32-steunboolean heeft circa 0,05% volumetolerantie nodig; de toegestane grens is 0,1%, los van de vrijwel exacte bronpartitie. De volledige 450 × 450 m uitsnede is met `createModelBundle` op 1:1000 geëxporteerd als preview en 3MF en bekeken. De model- en API-tests controleren twaalf wegdelen, oorspronkelijke attributen, dwarspositie, hoogte, vrije constructie en plaatsing.

Renders vanuit west, zuid, oost en noord zijn met identieke camera's naast de PDOK-reconstructie en schuine bronfoto's bekeken. West en oost tonen de brede landhoofden, verhoogde platen en de spoorhelling; zuid toont haunches en drie ovale pijlers; noord toont het afzonderlijke fietsdek. De kaart met `?rules=r.f.fietspad.10200` en de volledige preview kleuren het noordelijke fietspad rood. De vier vlakke PDOK-dekken verdwijnen zonder gat in de Maas; de verkeersbrug blijft staan. Controlebeelden en bronfoto's staan buiten de repository.

## Bronnen

- [BGT OGC API](https://api.pdok.nl/lv/bgt/ogc/v1/): actuele overbruggingsdelen en wegdelen, geraadpleegd 11 oktober 2026.
- [AHN DSM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0) en [PDOK actuele luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [Spoorbrug Venlo](https://nl.wikipedia.org/wiki/Spoorbrug_Venlo): brugtype, historische lengte en noordelijk fietspad.
- [Eisenbahnbruecke Maas Venlo.jpg](https://commons.wikimedia.org/wiki/File:Eisenbahnbruecke_Maas_Venlo.jpg), Matthias Nonnenmacher, CC BY-SA 4.0: schuine blik op platen, haunches en pijlers.
- [HUA-153625](https://commons.wikimedia.org/wiki/File:HUA-153625-Gezicht_op_de_nieuwe_spoorbrug_over_de_Maas_bij_Venlo.jpg) en [HUA-168680](https://commons.wikimedia.org/wiki/File:HUA-168680-Gezicht_op_de_spoorbrug_over_de_Maas_tussen_Venlo_en_Blerick.jpg), Nederlandse Spoorwegen/Het Utrechts Archief, CC0: nieuwe plaatliggerbrug in 1964.
- [Venlo hoogwater juli 2021 3.jpg](https://commons.wikimedia.org/wiki/File:Venlo_hoogwater_juli_2021_3.jpg), [4.jpg](https://commons.wikimedia.org/wiki/File:Venlo_hoogwater_juli_2021_4.jpg) en [6.jpg](https://commons.wikimedia.org/wiki/File:Venlo_hoogwater_juli_2021_6.jpg), Smiley.toerist, CC BY-SA 4.0: landhoofden en totale opstand; de hoogwaterstand is niet als maat gebruikt.
