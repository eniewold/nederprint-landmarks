# Arena Towers (Amsterdam)

## Bestanden en plaatsing

`arena-towers.glb` in meters met Y omhoog, `arena-towers.json` voor de catalogus en `arena-towers-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-arena-towers.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [124658, 480286], X-as [0.8754645270000179, 0.4832823832550024], Z=0 op NAP -3.5 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 39.562271 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012131669.

## Bouwdelen, gemeten maten en aannames

Twee parallelle afgeronde hotelvleugels op51,168/51,199NAP, hoge centrale westelijke machinekamer57,391NAP en lift61,687NAP; de oorspronkelijke70m-vermelding wordt niet als dakmaat overgenomen. AHN5 binnen de afzonderlijke dakpolygonen geeft medianen51,16/51,30/57,44/61,66NAP, overeenkomend met3DBAG en AHN4. De eigen volledige BAG0363100012131669-beganegrondplint verbindt de torens met de gebogen entree4,456NAP en lange lobby7,699NAP; dit dicht de.25m meetkier tussen twee dakvlakken binnen hetzelfde pand. De voormalige Praxis-laagbouw0363100012109598 en nieuwe Dreef/Live-torens zijn aparte panden en blijven behouden.

Doorlopende gevelglasbanden1.6m hoog,.35m blind,3.15m verdiepingsritme uit2014-2020schuinefoto geschat; hoofdvolumes zijn ononderbroken prisma’s
Eigen BAG-koppen met.45-.9m afronding vereenvoudigd, kleine dakruis verwijderd; geen minimumrechthoekhoofdas
Open galerij onder de ronde koppen voor1:1000 massief met.4m blinde glaspui uitgevoerd; terrein/parking niet in GLB
Dakhoofden51.168/51.199,57.391machinehuis en61.687lift volgen3DBAG/AHN4 en bevestigd door AHN5; oude70mpublicatie niet als dakmaat gebruikt
Plintglasbanden, machineventilatie en kleine dakserviceblokken uit fotos/ortho geschat circa.5-1m; de grote gebogen entree4.456 en gedeelde lobby7.699NAP gemeten

## Weggelaten

Geen letters, dunne glaspuiroedes, achter losse galerijpijlers zwevende plaat, open interieur of parkeerterrein in de GLB. De werkelijke open galerij onder de afgeronde koppen is als gesloten pui met blind glas vereenvoudigd, zonder steun nodig op1:1000.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 14,856 driehoeken. Printcontrole per node: NoError, 0.53% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: afgeronde hotelkoppen met continue terugliggende glasbanden; 55 graden: volledige lange lobby en gebogen lage entreekap; 145 graden: gemeten westelijke machinekroon en daklift, hoofdgevelassen correct; 235 graden: twee parallelle hotelvleugels en eigen aangesloten beganegrondplint.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 200 bij 200 mm, 236 objecten, 287,366 driehoeken, 79.1 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://www.zzdp.nl/history (architect,Bull1989/Arena-renovatie2014,schuinefoto)
- https://www.ihg.com/holidayinn/hotels/us/en/amsterdam/amsaa/hoteldetail (huidigeHolidayInn,Hoogoorddreef66a)
- https://www.ihg.com/holidayinnexpress/hotels/gb/en/amsterdam/amsea/hoteldetail (huidigeHolidayInnExpress,Hoogoorddreef66b)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012131669 (TU Delft/3DGI CC BY4.0)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (BAGCC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4DSM/DTM CC0)
- https://www.ahn.nl/ (AHN5DSM,hoogtekanaal0,CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actueleortho)
- https://commons.wikimedia.org/wiki/File:Amsterdam_-_Holiday_Inn_Express_Amsterdam-Arena_Towers_(29668602803).jpg (FredRomero CC BY2.0)
- https://commons.wikimedia.org/wiki/File:Holiday_Inn_Amsterdam_-_Arena_Towers.jpg (Choinowski CC BY-SA4.0)
