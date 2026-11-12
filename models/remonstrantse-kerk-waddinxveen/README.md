# Remonstrantse Kerk Waddinxveen

Torenloze neoclassicistische zaalkerk aan de Zuidkade, gebouwd in 1835–1836. De zaal heeft een schilddak, vensters en lage aanbouwen. Het model vervangt BAG-pand 0627100000008601.

## Bronnen en maatvoering

- [Rijksmonumentenregister 38203](https://monumentenregister.cultureelerfgoed.nl/monumenten/38203) en [Monumenten in Nederland](https://www.dbnl.org/tekst/sten009monu10_01/sten009monu10_01_0180.php): identiteit en gebouwtype.
- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0627100000008601): contour, oriëntatie, dakvlakken en grondhoogte; [AHN DSM 0,5 m](https://www.pdok.nl/introductie/-/article/actueel-hoogtebestand-nederland-ahn4) voor controle van de nok. In het onderzochte dakgebied ontbreken geen AHN-cellen.
- [Commons: gevel- en luchtfoto's](https://commons.wikimedia.org/wiki/Category:Remonstrantse_Kerk,_Waddinxveen): schilddak, raamverdeling en de lagere aanbouwen.

De hoofdmassa meet circa 15,6 × 9,7 m. De nok is circa 10,45 m boven het gebruikte maaiveld (NAP −0,277 m); in de 3DBAG ligt de nok op NAP +10,19 m. Modeloorsprong RD (104980,15, 450337,8), lokale X-as (−0,013, 0,9999155), langs de zaal. Er is geen grondplaat; de onderkant ligt op −0,5 m voor aansluiting op het terrein.

## Interpretatie en print

De precieze raamafmetingen, de dakhelling en de details van de lage aanbouwen zijn benaderd op basis van foto's en hoogtedata. De rondbogen zijn vereenvoudigd tot drukbare ondiepe nissen met schuine bovenzijde; roeden en dunne nokornamenten zijn weggelaten. Het model bestaat uit bouwdelen met dakvlakken en vormt één gesloten volume. Op 1:1000 meet het circa 17,2 × 11,4 × 11,0 mm; de generator controleert geslotenheid na Float32-conversie en onondersteunde vlakken onder 45 graden.

## Genereren

Vanuit de landmarkrepository:

```sh
node scripts/generate-remonstrantse-kerk-waddinxveen.mjs --scale 1000 --components
node scripts/generate-remonstrantse-kerk-waddinxveen.mjs --scale 100
```

## Bestanden en controle

De map bevat de GLB voor kaart en export, de catalogus-JSON en STL-bestanden op 1:100 en 1:1000. De vier modelaanzichten zijn vergeleken met de PDOK-gebouwreconstructie en beschikbare gevel- en luchtfoto’s. De modeltest controleert de catalogusplaatsing, één gesloten component, genus nul en overhangondersteuning. De kaartcontrole beoordeelt positie, oriëntatie, vervanging van het BAG-pand en aansluiting op het maaiveld.
