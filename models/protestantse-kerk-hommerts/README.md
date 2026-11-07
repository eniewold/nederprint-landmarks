# Protestantse Kerk Hommerts — Johannes de Doperkerk

De Johannes de Doperkerk aan de Jeltewei 3 is een eenbeukige zaalkerk met een driezijdig gesloten koor en een half ingebouwde toren met galmgaten, vier frontons en naaldspits. Het model vervangt BAG-pand 0683100000291825. De BAG en de taak noemen 1741 als bouwjaar; het [Rijksmonumentenregister](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/39787) vermeldt voor de huidige kerk 1876.

## Bronnen en maten

- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0683100000291825): omtrek, nokrichting en dakvlakken; maaiveld NAP +0,341 m en nok circa NAP +17,1 m.
- [AHN DSM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0): maximum ter plaatse van de toren NAP +43,027 m; modeltop NAP +43,041 m. In een 10,5 × 10,5 m raster rondom de spits ontbreken 58 van de 441 cellen, waaronder een strook langs één zijde van de spits. De top en andere zijden zijn gemeten en de symmetrische dakvlakken ertussen geïnterpoleerd.
- [Rijksmonument 39787](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/39787), [Tsjerkepaad](https://www.tsjerkepaad.nl/overzicht-kerken/hommerts-johannes-de-dooper-tsjereke) en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Johannes_de_Doperkerk,_Hommerts): identiteit, bouwjaar, gevelbeeld en toren.

Oorsprong RD (172659; 555218,9) op de torenas; +X (0,99; 0,141) richting koor. De onderkant ligt 0,5 m onder maaiveld. De galmgaten, uurwerk, torenfrontons en vensterverdeling zijn uit foto's geschat en vereenvoudigd; het uurwerk en vensters zijn blinde nissen. Dunne windvaan, wijzers en glasroeden zijn weggelaten.

## Genereren en controle

`node scripts/generate-protestantse-kerk-hommerts.mjs` maakt GLB, JSON en STL op 1:1000. Het resultaat is één gesloten component, genus 0. De steuncontrole op 45 graden gaf volumeverhouding 1,0 en identieke doorsneden. Volledige 150 × 150 m-uitsneden met en zonder landmark zijn geëxporteerd en vier aanzichten met PDOK en referentiefoto's vergeleken.
