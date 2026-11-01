# Watertoren Noorderbinnensingel (Groningen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-groningen-noorderbinnensingel.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: mantel, goot, daken, lantaarn en spits zijn omhulsels van twaalfhoeken, de bodem en de schachtbanden omwentelingsprofielen, poten en kruisverbanden `hull`-balken; vensters zijn nissen.

De watertoren aan de Noorderbinnensingel ("Duiventil") is in 1908 gebouwd, vermoedelijk naar ontwerp van Carl Francke uit Bremen, 45,3 m hoog met een reservoir van 1000 m³ van het type Barkhausen (zoals in Delfzijl, `watertoren-delfzijl`) op een ijzeren draagskelet. Hij leverde water aan het Academisch Ziekenhuis, stond daarna lang leeg, is rijksmonument 485963 en is sinds de restauratie van 2013-2014 een evenementenlocatie. Bij die restauratie kwamen er een zinken entreepaviljoen tussen de poten en een lift met een zwart-witte peilschaal aan de westkant bij.

## Bestanden

- `watertoren-groningen-noorderbinnensingel.glb`: één node van klasse `building`, op het maaiveld (vakwerk, schacht, paviljoen, liftkoker, reservoir en daken samen). De export vult elke node apart op; een los reservoir of dak zou een voet tot de grondplaat krijgen.
- `watertoren-groningen-noorderbinnensingel.json`: catalogusitem met RD-oorsprong, `xAxis`, maaiveldpunten, `groundHeight` 44,7 (ellipsoïdisch maaiveld: NAP +3,95 plus circa 40,75 m geoïdehoogte, zoals bij de andere Groningse modellen) en het vervangen BAG-pand.
- `watertoren-groningen-noorderbinnensingel-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [233339.1, 582742.65], het hart van het dak in het AHN (zwaartepunt van de DSM-contouren van 34 tot 41 m boven maaiveld, binnen 0,1 m gelijk), op maaiveld (NAP +3,95 m, het plein rond de toren). Assen in RD-richting (`xAxis` [1, 0]). De hoeken van de twaalfhoek liggen op -5 + k·30 graden: de dakrand op de luchtfoto (8 cm, hoeken op -95, -123 en 84 graden), de voeten van twee poten op de luchtfoto (-125 en -65 graden) en de afgeschuinde hoeken van de BAG-contour. De twaalf poten staan op de hoeken; op de foto van 2016 staan zichtbare poten en vensters precies waar deze stand ze voorspelt. Vervangt alleen het BAG-pand van de toren (0014100022186464, 228 m², de dakrand); de buurpanden staan in de 3D BAG op hun AHN-hoogte (noordbuur 11 m, tegen de goot aan).

## Onderdeel `building:vakwerk-schacht-reservoir-en-tentdak`

- Vakwerk: twaalf poten van 0,9 × 0,9 m op betonnen voeten van 1,4 m (tot 0,4 m), licht schuin van 7,85 m uit het hart op de grond naar 7,55 m onder de ringbalk. In elk vlak vier kruisverbanden boven elkaar (5,25 m per kruis, van 0,4 tot 21,4 m), banden van 0,9 m breed en dik onder 53 graden, zodat ruitvormige en driehoekige openingen een spitse bovenkant hebben. Op elke poot een console die van 0,9 naar 1,6 m verbreedt tot de ringbalk.
- Ringbalk onder de gevel van 22,83 tot 23,18 m (apothema 7,55) met een schuine onderkant onder 56 graden tot op de bodem.
- Barkhausenbodem: bolkap van r 7,3 op 22,85 m tot 20,45 m op de schacht (bolstraal 12,3 m).
- Ronde bakstenen trapschacht van 3,5 m, met een dubbele band van 9,45 tot 11,1 m, een omloop van 5,1 m met de vloer op 16,45 m op een gemetselde kraag (56 graden) en drie vensters boven elkaar naar het zuiden (6,35, 11,45 en 17,1 m).
- Twaalfzijdige bakstenen mantel: onderste verdieping (apothema 7,45, 14,9 m over de vlakken) van 23,18 tot 26,35 m, een overkraging (72 graden) naar de bovenste verdieping (apothema 7,75) vanaf 27,28 m. In elk vlak één venster per verdieping (1,0 m breed; 23,95 tot 25,7 en 29,1 tot 31,35 m).
- Goot van 16,8 m over de vlakken op 32,65 tot 33,0 m met een schuine onderkant (56 graden) vanaf 31,6 m op de gevel; twaalfzijdig tentdak met een knik boven de gevellijn (33,35 m) en 38 graden tot de lantaarn op 36,78 m.
- Twaalfzijdige lantaarn van 6,8 m over de vlakken tot 37,86 m met vier vensters, een goot van 7,6 m (38,37 tot 38,6 m, onderkant 52 graden), de opgelichte voet van de spits en een twaalfzijdige spits onder 50 graden tot 43,05 m.
- Entreepaviljoen van 2014 als twaalfhoek van 14,4 m over de vlakken tussen de poten, 4,0 m hoog.
- Liftkoker met peilschaal aan de westhoek (1,4 × 1,4 m) tot 33,1 m, net boven de goot.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Groningen_Noorderbinnensingel)): bouwjaar, ontwerper (vermoedelijk), 45,3 m, 1000 m³, Barkhausenreservoir, ijzeren draagskelet, restauratie 2013.
- [Rijksmonumentenregister 485963](https://monumentenregister.cultureelerfgoed.nl/monumenten/485963).
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +3,95 rond de toren, hoogste punt NAP +47,49 (43,5 m boven maaiveld, de voet van de makelaar), goot op circa 33 m met apothema 8,3 tot 8,4, radiaalprofiel van het tentdak (0,8 m per m), de stap van de lantaarngoot tussen 4,0 en 4,5 m uit het hart en de spits (1,2 m per m).
- BAG-pand 0014100022186464 en luchtfoto (PDOK): twaalfhoekige dakrand met de hoekstand, de voeten van de poten, het paviljoendak tussen de poten en de peilschaal aan de westkant.
- 3D BAG (LoD2.2): het torenpand als blok tot NAP +46, de buurpanden op hun AHN-hoogte.
- Foto [Watertoren vanaf Nieuwe Kerk (1)](https://commons.wikimedia.org/wiki/File:Watertoren_vanaf_Nieuwe_Kerk_(1).jpg) (2016, telelens): de peilschaal (een meter per vak, oneven meters aangegeven) geeft 44,9 px/m. Daaruit de onderkant van het metselwerk (23,18 m), de ringbalk (22,83 m), de bodem (20,55 m), de vensters, de overkraging (26,35 tot 27,28 m), de goot (32,9 m), de silhouetbreedtes van tentdak, lantaarn (6,8 m), lantaarngoot (7,6 m) en spits (50 graden, top 43,05 m), en de stand van zichtbare poten en vensters.
- Foto [de Bovenkamer van Groningen, 2015](https://commons.wikimedia.org/wiki/File:Groningen,_de_watertoren_aan_de_Noorderbinnensingel-de_Bovenkamer_van_Groningen_RM485963_foto4_2015-03-22_14.16.jpg): dezelfde peilschaal, met een projectieve fit (restfout 0,07 m) voor de hoogtes van de schacht, de banden, de omloop, de schachtvensters en het paviljoen; de breedte van de schacht (3,5 m).
- Foto's van de RCE uit 2010 ([vanuit het zuidwesten](https://commons.wikimedia.org/wiki/File:Overzicht_vanuit_het_zuidwesten_-_Groningen_-_20533281_-_RCE.jpg), [pomphuis](https://commons.wikimedia.org/wiki/File:Overzicht_onderzijde_watertoren_met_pomphuis_-_Groningen_-_20533278_-_RCE.jpg)): vakwerk met kruisverbanden, consoles en boogjes onder de ringbalk, de bolle bodem, de potvoeten en de schacht, nog zonder paviljoen en lift.
- Telefoto [Watertoren Groningen Noorderbinnensingel](https://commons.wikimedia.org/wiki/File:Watertoren_Groningen_Noorderbinnensingel.jpg) (2016): twaalf vlakken, lantaarn en liftkoker.

## Geschat en weggelaten

Geschat: de stand van de twaalfhoek (±2 graden), het verschil tussen onderste en bovenste verdieping (0,3 m, uit het silhouet op de foto van 2015), de goot en de lantaarngoot als schuine kraag in plaats van een dunne plaat, de bolkap van de bodem (alleen het laagste punt en de rand zijn gemeten), de hoogte van het paviljoen (4,0 m) en zijn twaalfhoekige plattegrond tot tegen de poten (op de foto's alleen van het zuiden te zien), de plaats en maat van de liftkoker (foto's van het zuiden en zuidwesten; het AHN ziet hem onder de goot niet goed), de richting van de schachtvensters, de vier lantaarnvensters. Verdikt en geschematiseerd: de poten (circa 0,5 m) en verbanden (circa 0,2 m) zijn 0,9 m, het printminimum op 1:1000; het echte vakwerk heeft per verdieping ook horizontale ringen en radiale stempels naar de schacht, maar elke horizontale balk boven een opening wordt in de export dichtgezet, dus het model heeft alleen de kruisverbanden, onder 53 graden en zonder ringen. Het model heeft daardoor genus 144 (de openingen in het vakwerk), wel één gesloten deel.

Weggelaten (kleiner dan 0,9 m of open staal): de horizontale ringen en radiale stempels van het vakwerk, de gietijzeren boogjes tussen de consoles, de open stalen wenteltrap aan de westkant van de schacht, het hekwerk van de omloop, de glazen liftcabines en de portaaltjes tussen lift en mantel, de makelaar op de spits (circa 0,2 m dik, tot circa 44,8 m), het dakluik in de spits, de witte hoekblokken en lichte metselbanden (kleur), de ankergaten onder de goot, en de deuren en het glas van het paviljoen.

## Controle

Eén gesloten NoError-node (genus 144 door het vakwerk, één deel), de onderkant op -0,3 m. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 6,1 % (circa 258 m³): alleen de kegel onder de Barkhausenbodem, die overal vlakker dan 45 graden is, van de ringbalk tot op de omloop rond 16,7 m. De doorsneden op 1, 3,5, 7, 12, 15,8, 23,5, 24,8, 28, 30, 32, 34, 37,3 en 40 m (paviljoen, vakwerk, schacht, beide verdiepingen, goot, dak, lantaarn en spits) blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komt alleen een kegel steun onder de bolle Barkhausenbodem; het vakwerk blijft open. Op de kaart staat de toren op het verborgen PDOK-blok met de voet 0,07–0,12 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/53.22552/6.56025/200/1x1/0
