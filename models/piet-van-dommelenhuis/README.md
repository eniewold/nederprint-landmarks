# Piet van Dommelenhuis (Nova) (Utrecht)

## Bestanden en plaatsing

`piet-van-dommelenhuis.glb` in meters met Y omhoog, `piet-van-dommelenhuis.json` voor de catalogus en `piet-van-dommelenhuis-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-piet-van-dommelenhuis.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [135013, 454045], X-as [0.48633538042349067, -0.8737722230354651], Z=0 op NAP 1.7036999464035034 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 45.1490824937911 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0344100000057810.

## Bouwdelen, gemeten maten en aannames

De witte kantoortoren Piet van Dommelenhuis/Nova aan Churchilllaan 11 staat op hetzelfde BAG-pand 0344100000057810 als een deel van winkelcentrum Nova en de lagere westelijke kantoorvolumes. Het model neemt de gehele eigen voet over; de andere BAG-panden van het winkelcentrum blijven behouden. BAG-bouwjaar 1970, oplevering doorgaans 1971 genoemd. Hoofdtorendak circa NAP 71.729 m met verhoogde kroon circa 72.096 m, centrale opbouw 76.496 m en technische machines circa 78.36–78.76 m, uit 3D BAG en AHN. De rechthoekige kantoorvloer is uit de gemeten buitenranden geregulariseerd met een minimum gedraaide rechthoek: kleine scaninkepingen rond dakapparatuur mogen niet naar de benedenverdiepingen doorlopen. De kroon begint pas op NAP 71.4 m, zodat de dakrand geen extra verticale gevelwand wordt. De winkelvleugels bestaan uit benoemde werkelijke dakvlakken: circa 10.221 m centrale winkelzaal, doorlopende hellende galerijdaken circa 8.15–12.73 m, laag ontvangstdeel circa 10.179 en 11.793 m, westelijke kantoren 19.708/21.135 m en machinekamer 23.963/27.522 m. Dit zijn geometrische bouwvlakken, geen gestapelde AHN-lagen. Hoofdas -60.9 graden volgt de lange torengevel. Vier geldige straatpunten buiten BAG geven NAP 1.7037–1.8623 m en gekoppeld PDOK 45.149082–45.244117 m; twee ongeldige punten zijn uitgesloten. Gevels volgen de daadwerkelijk vernieuwde witte aluminium bekleding op Commons 2019/2020, niet de bruine historische foto. Geschat zijn bandritme 3.4 m, blinde glasdiepte 0.35–0.40 m, bandhoogte circa 1.35 m, stevige penanten, entreevelden en blinde kroonventilatievelden met schuine plafonds. Alleen uitsparingen die de gesloten verbonden bouwschil behouden worden uitgevoerd.

## Weggelaten

Dunne antennes, hekwerken, reclameteksten, winkelborden en losse dakleidingen zijn niet afzonderlijk geprint. De glazen plint is gesloten met blind reliëf in plaats van volledig vrijstaande kolommen onder een vlakke overkraging. Onbetrouwbare smalle steile glasranden 332/333 zijn niet als enorme schuine daken overgenomen. Historische foto’s zijn alleen gebruikt om de bouwdelen te begrijpen; de huidige gevel is wit. De aangekondigde nieuwe woontorens bij Nova zijn plannen en niet toegevoegd.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 11,484 driehoeken. Printcontrole per node: NoError, 0.28% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: horizontale witte torenbanden en hoge dakopbouw; 55 graden: geregulariseerde rechthoekige torenschacht en lage ontvangstvleugel; 145 graden: hele eigen winkelgalerij met doorlopende hellende dakvlakken; 235 graden: westelijke kantoorvolumes, dakmachines en gesloten winkelvelden.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 260 bij 260 mm, 396 objecten, 113,952 driehoeken, 83.4 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG 0344100000057810 (1970), AHN DSM/DTM 0.5 m en actuele orthoHR: eigen volledige voet en straat
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000057810
- https://commons.wikimedia.org/wiki/File:Piet_van_Dommelenhuis_Utrecht_2019.jpg
- https://commons.wikimedia.org/wiki/File:Piet_van_Dommelenhuis2.jpg
- https://commons.wikimedia.org/wiki/File:Winkelcentrum_Kanaleneiland.JPG (historische opname voor bouwdelen, gevelkleur inmiddels vernieuwd)
- https://www.urbaninterest.nl/portefeuille/winkelcentrum-nova/ (eigenaar winkelcomplex en gerenoveerde Nova Office Building)
- https://www.hetiseentrane.nl/?p=752 (installatieleverancier: vernieuwde buitenste schil en drie warmtepompen op het dak)
