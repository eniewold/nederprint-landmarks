# Five55 (Rotterdam)

## Bestanden en plaatsing

`five55.glb` in meters met Y omhoog, `five55.json` voor de catalogus en `five55-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-five55.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [92774, 437081], X-as [0.9998742061222221, -0.015861019243923906], Z=0 op NAP 3.4 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 46.94254542 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0599100000701103.

## Bouwdelen, gemeten maten en aannames

Five55 staat aan de Blaak 555 en is geen Weenapoint-toren: de backloghint is gecorrigeerd. De hoofdas -0.908807569 graden volgt de gemeten rechte gevel-/dakrand; alle vlakken worden daarna in dat gebouwstelsel geplaatst. De oostelijke boog is op 0.0006 m nauwkeurig gefit met centrum RD 92765.7775/437079.1407 en straal 24.482953 m; de zuidelijke aansluiting heeft een kleine afwijking van deze boog. Gebogen hoofdtoren NAP 104.945 m, noordvleugel 94.351 m, elflaagse westvleugel 57.746 m, machine 105.903 m, zuidelijke kroon 106.993 m en doorgaande stenen kroonrand 107.025 m. De terrassen op de westzijde liggen apart op 37.495, 50.777, 64.067, 77.367 en 90.716 m. De echte grote opening boven het noorddak blijft open in de bron en in de print na 45-graden correctie. De westvleugel staat boven een open voorhof op verbonden kolommen en V-schoren; de fotogeschatte onderkant ligt op NAP 16.0 m. Een smal foutief 3D BAG-dakvlak dat tot NAP 89.386 m loopt boven deze westvleugel is met de foto van Frans Blok verworpen. Lange horizontale venstervelden zijn blinde nissen met circa 0.4 m diepte, met doorlopende witte verticale ribben op de gekromde gevel. Dubbelhoge glazen plint en een gebogen dakluifel met schuine verbonden kraag zijn vereenvoudigd. Vensterritme, kolom- en schoorbreedtes, luifelprofiel en onderkant westvleugel zijn geschat uit schuine fotos; de kleine krommingsafwijking aan de zuidhoek is vereenvoudigd. Het aangrenzende Schielandshuis blijft volledig PDOK. De rechte bovenrand van de fotografische kroonopening is aan de binnenhoeken met 51-graden schoren vereenvoudigd voor een steunvrije print; de open onderhelft wordt apart in de bron en de gecorrigeerde print getest.

## Weggelaten

Drie ondergrondse parkeerlagen, logo en letters, kleur, interieur en fijne roostergaatjes van de dakluifel; die laatste zijn blinde geometrische paneelnissen voor stevigheid op 1:1000.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 22,484 driehoeken. Printcontrole per node: NoError, 2.03% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: Gebogen glasgevel met horizontale velden, doorlopende witte ribben en aparte luifel.; 55 graden: Lagere noordvleugel en echte grote opening in de hoge stenen kroonrand.; 145 graden: Afzonderlijke terrassprongen op de westgevel, van lage noordhoek tot hoge schouder.; 235 graden: Elflagen-westvleugel op verbonden kolommen en V-schoren, met open zicht langs het Schielandshuis..

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 220 bij 220 mm, 397 objecten, 213,106 driehoeken, 111.6 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG 0599100000701103, AHN DSM/DTM 0.5 m en orthoHR: voetafdruk, gebogen gevel en gevelas -0.908808 graden
- 3D BAG LoD2.2: afzonderlijke dakvlakken en terrasdaken; vals smal hellend dakvlak naar 89.386 m boven westvleugel verworpen op schuine fotos
- https://edge.tech/articles/edge-acquires-landmark-five55-asset-in-rotterdam (eigenaar 2024: 107 m, Murphy Jahn, gerenoveerd 2020; schuine gevelbeelden)
- https://edge.tech/articles/edge-sells-landmark-five55-asset-to-anchor-tenant-msc (eigenaar 2025: Blaak 555, MSC)
- https://www.mecanoo.nl/Projects/project/269/Blaak555 (architect renovatie: dubbelhoge transparante plint, 26 kantoorlagen)
- https://www.architectuur.org/bouwwerk/282/Hoofdkantoor_Fortis_Bank.html (schuine fotos Bart van Hoek: gebogen gevel, kolommen en gevelstroken)
- https://www.3develop.nl/blog/erasmushuis-dak-rotterdam-zomeravond/ (eigen schuine foto Frans Blok: grote kroonopening, westkolommen en terrassprongen)
