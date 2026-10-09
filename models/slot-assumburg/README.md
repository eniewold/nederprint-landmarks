# Slot Assumburg — Heemskerk

Vier vleugels met afzonderlijke zadeldaken rond de open BAG-binnenplaats; twee vierkante hoektorens met hoge borstwering en kleiner piramidedak, een achtzijdige hoektoren, twee kleine traptorens, kapelgevel, hofgalerij, klassieke entree, dakkapellen en schoorstenen. Stenen voorbrug met drie bogen en lage aflopende tuinbrug/ramp achter het slot. Voorplein, dienstgebouw, tuin en gracht blijven PDOK.

## Bronnen en plaatsing

[RCE 21210](https://monumentenregister.cultureelerfgoed.nl/monumenten/21210) beschrijft vier vleugels, twee vierkante en één achtzijdige hoektoren, hofgalerij en boogbruggen. [Commons](https://commons.wikimedia.org/wiki/Category:Slot_Assumburg): recente `Frontal view ... 2022.jpg` en `Garden view ... 2022.jpg`, RCE zijgevels 20104358/20104360, daarnaast oude voor-/achtergevels 20104357/20104359 voor de brugbogen. De luchtfoto en AHN bepalen de huidige geometrie.

PDOK BAG 0396100000091556 (inclusief hofgat), Actueel_orthoHR, AHN DSM/DTM 0,5 m en BGT op 9 oktober 2026. RD-oorsprong [107334,502168]; +X 36,6° in RD. Gracht NAP -0,95 m, uit PDOK-water 41,894–41,897 m ellipsoïdaal minus lokale LoD2/AHN-omrekening 42,840 m. `groundHeight` 41,895 m als terugval; drie grachtpunten bepalen in de lader de laagste hoogte. Voeten 0,80 m onder die referentie.

AHN-nokken west 16,9 m, noord/oost 14,5 m, zuid 12,6 m NAP; vierkante torens 21,1 en 24,4 m; achtzijdige toren 21,35 m; traptorens 23,9 en 22,8 m. Spitsen volgen foto's na uitsluiten van windvanen. De tuinbrug/ramp daalt van circa 1,9 m bij het slot naar -0,6 m NAP bij het laagliggende landhoofd; dit langsprofiel is een benadering van de smalle, onvolledig gemeten AHN-strook.

## Brugdekken

Geen actuele BGT-wegdelen met hoogte ≥1 en geen aparte overbruggingsdelen op deze twee bruggen. Het aanwezige BGT-dek `G0396.2181055e5290e99de050020a6b000e5e` ligt op een andere brug naar het voorplein en blijft behouden. `replaces-terrain.mjs --write`: nul dekvlakken; de terreindelen worden niet willekeurig verwijderd.

Zoals voorgeschreven bij ontbrekende dekclassificatie, zijn de functies van aansluitende landhoofden gebruikt:

- Voorbrug: `G0396.2181055e5602e99de050020a6b000e5e`, `rijbaan lokale weg` / `open verharding` → `road:toegangsbrug`.
- Achterbrug: `G0396.2181055e5603e99de050020a6b000e5e`, `voetpad` / `half verhard` → `road:tuinbrug`.

Elk wegdek is de bovenste 0,50 m van zijn eigen brugprofiel; beide afgesneden van `building:brugdragers`. BGT-onbegroeid erf op het achterste landhoofd `G0396.2181055fd6b5e99de050020a6b000e5e` wordt niet over de hele brug uitgebreid. Plancontouren van de bruggen volgen de luchtfoto, omdat afzonderlijke actuele BGT-brugcontouren ontbreken.

## Print en controle

Herbouw: `node scripts/generate-slot-assumburg.mjs --components`. Manifold-prisma's, eigen dakvlakken, borstweringringen en torenlofts, geen gestapelde hoogtelagen. GLB meters/Y omhoog, scherpe normalen; vier klasse-nodes. Vensters 0,35 m blind, arcade/poort als puntnissen, steile brugopeningen in plaats van oorspronkelijke rondbogen. Dragende wanden/dragers ≥0,9 m; geen fijne ijzeren leuningen of windvanen.

STL 1:1000: 36,2 × 56,7 × 26,1 mm, 3078 driehoeken, 10,92 cm³, `NoError`, één verbonden print, genus 5 (hof, torenranden en brugopeningen). Float32-rondgang behoudt geslotenheid/genus/volume; geen negatieve verborgen volumecomponenten. Echte webshop-steuncontrole op 45°: slot +0,0080% volume door kleine vensternisplafonds; dragers en beide dekken 0% extra. Zonder externe steun printbaar op 1:1000.

Brugcontrole: 3744 voor- en 1232 achterdekpunten, overal 0,50 m dik, nul samenvallende bovenvlakken. AHN: 2778 cellen; 61,1% binnen 1 m, 77,4% binnen 2 m, mediane afwijking 0,564 m. Regressie in webshop `tests/landmark-models.test.ts` controleert hofgat, torens, planbereik, functies en dekprofielen.

Vier gelijke schuine renderhoeken (-35°, 55°, 145°, 235°; hoogte 30°), naast PDOK en vier referentiefoto's gecontroleerd. Kaart met landmarks aan/uit en daadwerkelijke preview/3MF van 110 × 110 m op 1:1000 gecontroleerd: hele slot inclusief beide bruggen, modelhoogte 26,6 mm. Lokale controlebestanden `slot-assumburg/{vergelijking.jpg,kaart.jpg,preview.bin,export.3mf,print.json,ahn-check.json,bridge-check.json}` staan buiten de modelrepo in de controlewerkmap.

[Controlekaart](http://localhost:3063/kaart/52.5051233/4.68516204/220/1x1/0): kijk de twee vierkante torenkappen, het hof en de aansluiting van voorbrug en aflopende tuinbrug na.

Geschat: borstweringfries, vensterverdeling, vijf schoorstenen en kleine kapellen; klok-/schoorsteengevel en twee traptorenspitsen; galerij als gedragen gesloten blok met blinde bogen; brugcontouren en aflopende achterbrug uit luchtfoto/AHN. Balustrade, beelden, fijne steenbanden en verdwenen bouwdelen zijn niet toegevoegd.
