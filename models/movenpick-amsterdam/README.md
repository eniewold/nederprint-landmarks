# Mövenpick Hotel (Amsterdam)

## Bestanden en plaatsing

`movenpick-amsterdam.glb` in meters met Y omhoog, `movenpick-amsterdam.json` voor de catalogus en `movenpick-amsterdam-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-movenpick-amsterdam.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [122753.33449981491, 487918.5885706783], X-as [0.9602936856769431, -0.2789911060392293], Z=0 op NAP 1 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval None m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012118833, NL.IMBAG.Pand.0363100012571026.

## Bouwdelen, gemeten maten en aannames

Mövenpick Hotel van Claus en Kaan (2006), met de slanke hotelschijf, doorlopende horizontale glasbanden, glazen lobby en congresplint. De echte doorgaande dakvlakken komen uit 3D BAG, bevestigd in het AHN: hoofddak NAP circa 66.05 m en glazen dakmachine 71.17 m, lobby circa 19.70 m, lage plintdaken circa 12.54 en 11.67 m. De rechte hotelgevels zijn op de gemeten roofranden geregulariseerd (lokale X 41.65–58.20, Y -26.30–29.45), geen BAG-bounding-box-as. Het incorrecte steile RoofSurface 225 ziet AHN juist op 19.675 m en wordt als glasreconstructiefout uitgesloten. Het bestaande Muziekgebouw bevatte eerder hetzelfde hotel als ongedetailleerde dakmassa; zijn geometrie is bij lokale X=40.5 afgesneden. Het nieuwe hotelmodel sluit precies op die scheidingswand aan, zonder intersectievolume. Beide modellen gebruiken dezelfde oorsprong, as, terreinpunten en offset, zodat er geen maaiveldsprong ontstaat. Nieuw BAG-pand 0363100012571026 lag als extra PDOK-object binnen het hotel en wordt eveneens verborgen. Gevelbandritme 3.28 m, 0.35 m blinde diepte, hoekpenanten, lobbyrooster, entreenissen en plantrooster zijn schattingen uit Arcam-fotos. Alle dragende delen blijven minstens 0.9 m dik, buitengevels gesloten. De vergelijkingsrenders tonen hotel plus behouden Muziekgebouw, omdat PDOK ook het hele gedeelde BAG-pand toont.

## Weggelaten

Dunne dakletters, logo, glazen hekwerken, losse luifels en slanke lobbykolommen zijn niet afzonderlijk printbaar op 1:1000 en worden schematisch in blinde vlakken opgenomen. Het glazen lobbyvolume blijft dicht. Bestrating, kade en naastgelegen Passenger Terminal blijven bestaande PDOK-geometrie. De later verschenen 2025-BAG-indeling wordt alleen gebruikt om het extra overlappende PDOK-blok te verbergen; geen geschatte nieuwbouw toegevoegd.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 2,598 driehoeken. Printcontrole per node: NoError, 0.06% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: doorlopende horizontale hotelbanden, glaslobbyrooster en dakmachine boven een echte vlakke hotelschijf; 55 graden: smalle gesloten kopwand met horizontale banden, plintentree en behoud van het naastgelegen Muziekgebouw; 145 graden: gevelreliëf aan de IJ-zijde en rechte horizontale daken, met de oorspronkelijke muziekzaal en Bimhuis nog aanwezig; 235 graden: vier gesloten hotelhoeken, regelmatige glasvelden, gemeten dakmachine en geen dubbel hotelvolume of nieuw PDOK-restblok.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 210 bij 210 mm, 118 objecten, 54,666 driehoeken, 75.2 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG 0363100012118833 en nieuw pand 0363100012571026, 3D BAG LoD2.2 en AHN DSM/DTM 0.5 m, actuele orthoHR, 2026-10-14
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012118833
- https://arcam.nl/architectuur-gids/movenpick-hotel/ (Claus en Kaan 2006, circa 65 m; schuine Luuk Kramer- en Doriann Kransberg-fotos als referentie)
- https://www.iamsterdam.com/en/conventions/venue-finder/movenpick-hotel-amsterdam-city-centre
