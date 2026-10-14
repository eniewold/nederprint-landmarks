# Hotel Okura (Amsterdam)

## Bestanden en plaatsing

`hotel-okura-amsterdam.glb` in meters met Y omhoog, `hotel-okura-amsterdam.json` voor de catalogus en `hotel-okura-amsterdam-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-hotel-okura-amsterdam.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [121368, 484637], X-as [0.9970552410613919, -0.07668667597444614], Z=0 op NAP 0.5084 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 43.525357875451135 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012150422.

## Bouwdelen, gemeten maten en aannames

Hotel Okura met volledige verbonden hotelvleugels, doorlopende kamertoren, open dakluifel op vier hoekstijlen en eigen dakmachines. BAG/3DBAG meten de gevelas en luifel-/vleugelcontouren, AHN meet fysieke dakhoogtes en maaiveld. De brede luifel krijgt een enkele schuine printkraag van NAP 70.1 naar 75.95 m; het centrale dakputje blijft open en de gevelnissen blijven in de print zichtbaar. De PDOK-reconstructie trekt de uitkragende luifel ten onrechte door als massieve gevel; de terugliggende torenvoet, hoekstijlen, luifelonderkant en het kamerraamritme zijn daarom uit schuine eigen Commons-fotos geschat. Alle glasvelden zijn blinde nissen met vaste achterwand. Nabijgelegen woonblokken en sportcentrum blijven behouden. Gevelas -4,398141 graden uit de lange gemeten dakrand. Maaiveld NAP 0,5084 m en ellipsoide 43,525358 m, punt RD 121390,484598. Daken NAP: hoofdtoren 72,691 m, luifel 76,663 m, machines 79,401/79,930/80,266/79,999 m, westvleugel 15,584 m, oostvleugel 11,991 m, grote verbindingsplint 10,310 m. Uit schuine fotos geschat: terugliggende torenvoet (31,6 bij 26,75 m), raamritme 2,92 m (20 rijen), 0,35 m blind raamreliëf, minimaal 0,95 m blijvende stijlen, balkonreeks met 0,85 m blind reliëf en hoekstijlen van 1,1 m. De bronfoto heeft een open ruimte onder de dakluifel; om zonder steun te printen krijgt die een enkele schuine kraag van NAP 70,1 naar 75,95 m. Het centrale dakputje blijft open. Die printkraag voorkomt dat de automatische correctie de hele westgevel opvult: extra printvolume daalt van 3,77 naar 0,093 procent. 15.772 driehoeken, 928 blinde gevelsneden, gesloten verbonden bron en print. De lage hotelvleugels en toegangszone zijn opgenomen.

## Weggelaten

Opschriften, interieur, tuinbomen, vlaggenmast, zonnepaneelroosters en zeer dunne kozijn-/lichtstaven; de open ruimte direct onder de luifel is voor printbaarheid deels vervangen door een schuine kraag.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 15,772 driehoeken. Printcontrole per node: NoError, 0.09% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: Terugliggende kamertoren met blinde raamvelden en uitkragende dakluifel.; 55 graden: Volledige lage hotelvleugels met eigen dakhoogtes en entreevelden.; 145 graden: Verticale blinde balkonreeks en echt open dakputje naast de dakmachines.; 235 graden: Gesloten gevelreliëf, blijvende raamstijlen en lage hotelvleugels..

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 260 bij 260 mm, 639 objecten, 201,300 driehoeken, 81.7 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG 0363100012150422: eigen verbonden hotelcomplex; overige panden behouden
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012150422 (LoD2.2 afzonderlijke dakvlakken, open luifelring en gevelas -4.398141 graden)
- AHN DSM/DTM 0.5 m en actuele orthoHR: hoofddak 72.691 m, luifel 76.663 m, machines 79.401/79.930/80.266/79.999 m NAP; maaiveld RD 121390,484598 NAP .5084 m, PDOK ellipsoide 43.525358 m
- https://www.okura.nl/nl/colouring-the-skyline (hoteleigenaar: dakluifel met LED-barometer, 78 m boven de stad)
- https://www.okura.nl/history (hoteleigenaar: opening september 1971)
- https://commons.wikimedia.org/wiki/File:Hotel_Okura_Amsterdam_-_Amstel_Canal.jpg (eigen schuine foto, kanaalgevel, ramen en dakluifel)
- https://commons.wikimedia.org/wiki/File:Okura_Hotel_Amsterdam_in_2016.jpg (Choinowski eigen foto CC BY-SA 4.0: terugliggende kamertoren, open kroonstijlen en uitkragende luifel)
- https://www.skyscrapercenter.com/building/okura-hotel/6529 (CVU: 78 m, 22 verdiepingen, architect Kanko Kikaku Sekkeisha)
