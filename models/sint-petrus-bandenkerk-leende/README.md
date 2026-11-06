# Sint-Petrus'-Bandenkerk (Leende)

Printbaar model van de laatgotische kruisbasiliek met middenschip, lage zijbeuken, dwarsarmen, koor en gotische westtoren. De ingesnoerde spits wordt bekroond door de karakteristieke bol, de Lindse Blaos. De schuin geplaatste zuidwestelijke steunbeer bevat de traptoren.

- `sint-petrus-bandenkerk-leende.glb`: één gesloten node `building:kerk` in meters.
- `sint-petrus-bandenkerk-leende.json`: ligging en vervanging van BAG-pand 1658100000034117.
- `sint-petrus-bandenkerk-leende-1-1000.stl`: print in millimeters, Z omhoog, 52,4 × 37,4 × 65,35 mm.
- Genereer met `node scripts/generate-sint-petrus-bandenkerk-leende.mjs --components`.

De oorsprong ligt op RD (166467,0, 373388,2) bij de toren; de X-as [0,9925, 0,1222] volgt de nok richting oost. De onderkant ligt 0,5 m onder maaiveld. 3D BAG geeft maaiveld NAP +27,358 m en de hoofdnok circa NAP +47,9 m. AHN DSM meet tot NAP +92,205 m bij de toren, 64,85 m boven dat maaiveld. De dunne windvaan is niet als afzonderlijk onderdeel opgenomen; OSM noemt 70 m, vermoedelijk inclusief het hogere, niet betrouwbaar gemeten uiteinde.

De grootte en vorm van de bol, de torenspits en traptoren, de steunberen, vensternissen en lage aanbouwen zijn geschat en vereenvoudigd op basis van foto's en meetgegevens. De bol is met hellingen gemaakt die zonder steun kunnen worden geprint. Maaskwerk, leuningen en de windvaan zijn te dun en weggelaten.

De generator controleert de geslotenheid, Float32-rondgang en overhang; het model is één component met genus 0. De 45°-test van de steunopvulling gaf geen relevante volumetoename en gelijke doorsneden. Een volledige 150 × 150 m uitsnede is met en zonder landmark geëxporteerd en vier aanzichten zijn naast PDOK en foto's gelegd.

Bronnen: [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1658100000034117), [PDOK AHN DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0), [Erfgoed Brabant over de toren](https://erfgoedbrabantverhalen.nl/verhalen/artikel/de-toren-van-de-sint-petrus-bandenkerk-te-leende/), [parochiegeschiedenis](https://www.parochienicasius.nl/index.php/kerkgebouw-leende/geschiedenis-leende), [Commons](https://commons.wikimedia.org/wiki/Category:Sint-Petrus%27-Bandenkerk_(Leende)).
