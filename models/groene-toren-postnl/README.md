# Hoofdkantoor PostNL (De Groene Toren) (Den Haag)

## Bestanden en plaatsing

`groene-toren-postnl.glb` in meters met Y omhoog, `groene-toren-postnl.json` voor de catalogus en `groene-toren-postnl-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-groene-toren-postnl.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [82912, 454990], X-as [0.8132710126027053, 0.5818850918009245], Z=0 op NAP 0.49 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 44.00886393551513 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0518100000207723.

## Bouwdelen, gemeten maten en aannames

De lange kantoorvleugel, kortere kantoorvleugel en verbindende dienstenschijf zijn afzonderlijke doorlopende volumes op de gemeten asymmetrische H-voetafdruk; de eigen glazen entreehal vult alleen de lage delen van het BAG-pand. Gevelas 35,583239 graden uit de lange 3DBAG-dakrand. AHN: hoofddak NAP 75,196 m, glasentree 8,943 m, smalle verbinding 12,523 m, blind dakputje 71,647 m en hoogste dakmachine 77,753 m. Maaiveld NAP 0,49 m op RD 82965,454995, PDOK ellipsoide 44,008864 m; grondpunten in de catalogus exact naar dit punt omgerekend. Het raamraster (twintig rijen, circa 3,48 m verdiepingritme), 0,45 m blinde diepte, versterkte stijlen en glasentreevelden zijn uit schuine fotos van het Rijksvastgoedbedrijf en Bart van Hoek geschat. De dienstenschijf heeft een dunner raamritme dan de twee hoofdvleugels. Elke nis blijft blind en de hele bron en gecorrigeerde print vormen een gesloten verbonden materiaalvolume. De huidige naam in de backlog blijft behouden hoewel PostNL sinds 2021 elders zit; gemeente en eigenaar melden nog planvorming voor de toekomstige transformatie. De smalle toekomstige uitbreiding is daarom niet gemodelleerd.

## Weggelaten

Toekomstige renovatie/uitbreiding, logoletters, antennes, zeer kleine installaties, aangrenzende Zilveren Toren en losstaande kleine dienstgebouwtjes; hun BAG-objecten blijven op de kaart behouden.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 23,008 driehoeken. Printcontrole per node: NoError, 0.69% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: Lange gevel: blind glasraster en aangehechte dakmachines toegevoegd.; 55 graden: Open H-zijde: korte vleugel en lage glashal behouden; dienstenschijf met eigen vensterritme.; 145 graden: Straatzijde: raamvelden op beide vleugels en aansluiting op de eigen entreehal.; 235 graden: Utrechtsebaanzijde: ongelijke vleugellengtes, open hof en blind dakputje met aangehechte apparatuur..

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 220 bij 220 mm, 316 objecten, 198,792 driehoeken, 101.8 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG 0518100000207723: eigen hoofdgebouw met glazen hal; Zilveren Toren 0518100000246102 behouden
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000207723 (LoD2.2 dakcontouren en gemeten gevelas 35.583239 graden)
- AHN DSM/DTM 0.5 m en actuele orthoHR: gemeten daken, machines, blind dakputje en maaiveld; punt RD 82965,454995 NAP 0.49 m, PDOK ellipsoide 44.008864 m
- https://projecten.rijksvastgoedbedrijf.nl/groups/18-rvb-in-het-beatrixkwartier (eigenaar: aankoop 2024 en voorbereiding transformatie; eigen schuine foto via widgets/1827/header)
- https://www.denhaag.nl/nl/projecten-in-den-haag/herontwikkeling-de-groene-toren/ (gemeente: huidig leeg kantoor, planvorming 2024-2026 en uitvoering 2026-2029)
- https://www.architectuur.org/bouwwerk/1008/Kantoor_Nationale_Nederlanden.html (eigen fotos Bart van Hoek, gool04_2 en gool04_3: lange/korte schijf en gevelraster; gool04_1 toont de aangrenzende Zilveren Toren en wordt niet als modelbron gebruikt)
