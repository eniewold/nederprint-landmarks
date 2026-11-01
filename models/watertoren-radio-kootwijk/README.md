# Watertoren Radio Kootwijk

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-radio-kootwijk.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is één verjongende achthoek, het dak een achtkante piramide en het baken een omwentelingsprofiel; portalen, lisenen en erkers zijn blokken en hulls per hoofdvlak, deuren en vensters nissen.

De watertoren van het zendstation Radio Kootwijk is in 1922 gebouwd naar ontwerp van Julius Maria Luthmann, de architect van gebouw A. Hij is 37,85 m hoog, had een reservoir van 110 m³ en droeg bovenin een lichtbaken voor het luchtverkeer langs de zendmasten, met een eigen toegang los van die van het reservoir. Rijksmonument; de installaties zijn nog bruikbaar als bluswatervoorziening.

## Bestanden

- `watertoren-radio-kootwijk.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een losse erker of een los baken zou een voet tot de grondplaat krijgen.
- `watertoren-radio-kootwijk.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-radio-kootwijk-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [184991.2, 465295.42], tussen het hart van de BAG-contour van pand 0200100000700606 (184991.37, 465295.41) en het hart van het dak in het AHN (circa 184991.0, 465295.45), op maaiveld (NAP +47,15 m buiten het lage muurtje; binnen het muurtje ligt een plantvak op +47,4). De BAG-vlakken staan op -78,4 + k·45 graden in RD. -Y wijst naar het voorportaal aan het pad (-78,4 graden, zuid-zuidoost), `xAxis` [0.9796, 0.2011]. De taakcoördinaat lag 31 m naar het zuidzuidoosten, bij de woningen. Vervangt alleen het BAG-pand van de toren; de dienstwoningen 0200100000000041 en -43 liggen 30 m verder en worden niet geraakt.

## Onderdeel `building:achtkante-schacht-met-portalen-erkers-en-lichtbaken`

- Betonnen achthoek van 7,2 m over de vlakken aan de voet (BAG), licht verjongend tot 6,9 m op de dakrand op +34,15 (AHN).
- Op elk van de vier hoofdvlakken (de vlakken op -Y, +X, +Y en -X) dezelfde gevel:
  - Portaal van 2,9 m breed en 1,1 m diep met afgeschuinde hoeken, iets taps tot de schouder op +4,4 en een schuine kap tot +4,85. Deur in een diepe omlijsting (1,1 × 2,5 m vanaf de trap), twee wangen van 0,85 m breed en 1,3 m hoog met 1,2 m ertussen, en drie treden tot 2,2 m uit het vlak.
  - Lisene van 1,0 m breed en 0,2 m dik van de kap tot de erker, met zes vensters (0,5 × 1,0 m) om de 4,1 m, van +5,5 tot +26,0.
  - Erker over de hele vlakbreedte (2,86 m), 0,6 m uit het vlak, van +27,3 tot de dakrand, met een V-vormige onderkant die op +26,8 in de lisene uitloopt en een hoge vensterstrook (0,6 m breed, +28,9 tot +33,3).
- Op elk van de vier schuine vlakken bovenin een hoge smalle vensterstrook (0,6 m breed, +28,6 tot +33,0).
- Achtkant tentdak van 37 graden van de dakrand tot +35,9, met daarop de achtkante voet van het baken (2,2 m over de vlakken) tot +36,2 en het ronde glazen lichtbaken van 1,0 m doorsnede tot +37,25 met een kegelvormige kap tot +37,7.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Radio_Kootwijk)): architect, bouwjaar, 37,85 m, 110 m³, lichtbaken met eigen toegang, rijksmonument.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +47,15, dakrand op 34,15 m, tentdak oplopend tot circa 36 m, baken van circa 1 m breed tot NAP +84,83 (37,7 m boven maaiveld), breedte van het dak (6,8 tot 6,9 m over de vlakken) en het hart van het dak.
- BAG-pand 0200100000700606 en luchtfoto (PDOK): achthoekige contour en de stand van de vlakken, het pad naar het voorportaal, zijportalen aan de oost- en westkant van de voet, het tentdak met het baken.
- Foto [20160926 Watertoren1 Radio Kootwijk](https://commons.wikimedia.org/wiki/File:20160926_Watertoren1_Radio_Kootwijk.jpg), van ver en frontaal: hoogtes van de vensters, de erker en de V-punt, de vensterstroken en de breedte van erker en lisene, geschaald op de dakrand in het AHN (20,8 px/m).
- Foto [Watertoren - Kootwijk - 20127027 - RCE](https://commons.wikimedia.org/wiki/File:Watertoren_-_Kootwijk_-_20127027_-_RCE.jpg), frontaal op het portaal: breedte, schouder en kap van het portaal, deur, wangen, treden en het onderste venster op 5,5 m (152 px/m op een deur van 0,95 m).
- Foto's [P1380186](https://commons.wikimedia.org/wiki/File:Watertoren_Radio_Kootwijk_P1380186.jpg), [westzijde](https://commons.wikimedia.org/wiki/File:Kootwijk_watertoren_westzijde.jpg) en [RCE 20127026](https://commons.wikimedia.org/wiki/File:Watertoren_-_Kootwijk_-_20127026_-_RCE.jpg): de west- en zuidgevel zijn gelijk, de zijportalen steken op de randen uit, de onderkant van de erker van onderen.

## Geschat en weggelaten

Geschat: dat de noord- en oostgevel gelijk zijn aan de zuid- en westgevel (de luchtfoto toont een vensterrij op het noordvlak en portalen aan de oost- en westkant), de uitsprong van de erker (0,6 m) en de V-vorm eronder (van de vlakbreedte naar de lisene over 0,5 m), de diepte van portaal, wangen en treden, de dikte van de lisene, de hoogte van de voet en de kap van het baken, en de lichte verjonging van de schacht (de foto's zijn te perspectivisch om die te meten). De oorsprong ligt tussen BAG en AHN, die 0,4 m verschillen; scheefstand is niet gemeten.

Weggelaten (kleiner dan 0,9 m of te dun): de vensterbanken onder de kleine vensters, de roeden in de vensterstroken, het hekwerk rond het baken, de antennes en bliksemafleiders, en het lage muurtje (0,6 m hoog, circa 0,35 m dik) rond het plantvak aan de voet; het plantvak zelf (0,25 m hoger dan het maaiveld) zit al in het terrein.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 0,04 %: alleen onder de V-vormige onderkant van de vier erkers, de echte vorm. De doorsneden op 1, 3, 5,5, 13,7, 26, 30, 33,5, 34,5 en 36,5 m (portalen, deuren, vensters, erkers, dak en baken) blijven gelijk. Vier renders (ZW, ZO, NO, NW) naast de 3D BAG: het PDOK-blok is een gladde achthoek met een spits dakje, het model heeft daarnaast de portalen met trappen, lisenen met vensters, erkers met vensterstroken, de vensterstroken op de schuine vlakken en het baken. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komen smalle wiggen onder de V-onderkant van de erkers en splinters in de vensternissen; op de kaart staat de toren op het verborgen PDOK-blok met de voet 0,06–0,17 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/52.17499/5.82565/200/1x1/0
