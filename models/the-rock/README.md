# The Rock (Amsterdam)

## Bestanden en plaatsing

`the-rock.glb` in meters met Y omhoog, `the-rock.json` voor de catalogus en `the-rock-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-the-rock.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [119761, 483431], X-as [0.998440764181981, 0.0558215049931638], Z=0 op NAP 0.17 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 43.18035577 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012114135.

## Bouwdelen, gemeten maten en aannames

Het model omvat de hele eigen BAG-voetafdruk met glazen onderbouw, verschoven middendeel, zware natuursteenkroon en beide hoge entrees. Hoofdas3,2graden volgt de lange noordelijke dakrand. De westelijke lage dakzone ligt op NAP +30,177m, de zuidelijke schouder op +62,570m, kroon op +87,702m, dakglas op +89,173m en techniek op +90,247m. Gevelovergangen, vier schuine voorhangende steenfacetten en variërende raamvakken zijn uit schuine foto’s geschat; de gebouwbron bevestigt3,6m laagsteek. De backlog had glasbovenbouw/steenonderbouw omgekeerd. Schattingen zijn circa1–2m onzeker voor de facetten en circa0,5m voor het raamritme.

## Weggelaten

Afzonderlijke aluminiumprofielen, natuursteenlamellen, interieur, draaiende deurdetails, kleine technische dakdelen en zonnepanelen onder0,9m. Het hoge interne atrium blijft gesloten binnen het gebouwvolume.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 19,926 driehoeken. Printcontrole per node: NoError, 0.10% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: Gevelnissen, lage schouder en hoge zuidentree; 55 graden: Gearticuleerde natuursteenkroon boven glazen voet, noordentree; 145 graden: Raamritme en vier schuine uitstekende kroonstroken; 235 graden: Afzonderlijke glasdakzone, technische opbouw en volledige voet.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 140 bij 140 mm, 108 objecten, 103,470 driehoeken, 92.1 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://www.archdaily.com/183612/the-rock-erick-van-egeraat (tekst door architect)
- https://therock-zuidas.nl/ (gebouwbeheerder, renovatie2024,laagsteek3.6m)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012114135 (TU Delft/3DGI CC BY4.0)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0
- https://commons.wikimedia.org/wiki/File:Amsterdam-TheRock.jpg (Choinowski CC BY-SA4.0)
- https://commons.wikimedia.org/wiki/File:The_Rock_Amsterdam_2010.jpg (IKÃ¢â‚¬â„¢s World Trip CC BY2.0)
- https://commons.wikimedia.org/wiki/File:Zuidas_Mahler_39.jpg (MrAronymous CC BY-SA4.0)
