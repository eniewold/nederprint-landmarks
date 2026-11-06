# Grote Kerk of Sint Maartenskerk (Epe)

Het model bevat het pseudobasilicale schip met zijn doorlopende zadeldak, het afzonderlijke driezijdig gesloten koor, de westtoren met geknikte spits, het zuidportaal, steunberen en blinde raam- en deurnissen. De bouwdelen zijn opgebouwd uit prisma's en vlakke dakvlakken; de torenspits bestaat uit vier vlakken.

- `grote-kerk-of-sint-maartenskerk-epe.glb`: één gesloten node `building:kerk`, in meters.
- `grote-kerk-of-sint-maartenskerk-epe.json`: catalogusgegevens en vervanging van BAG-pand `0232100000010469`.
- `grote-kerk-of-sint-maartenskerk-epe-1-100.stl` en `grote-kerk-of-sint-maartenskerk-epe-1-1000.stl`: losse printmodellen.

De oorsprong ligt op RD [195628, 484649], met de lokale X-as [0,99978, -0,02093] langs de nok naar het oosten. Het maaiveld in 3D BAG is circa NAP +13,586 m; het model loopt 0,5 m onder het maaiveld door.

De grondvorm en nokrichting zijn afgeleid van BAG en 3D BAG; de nok van schip en koor ligt circa 19,75 m boven het maaiveld. Het AHN-DSM registreert de torenspits tot circa 47,4 m boven het maaiveld; het smalle uiteinde ontbreekt daar. Een kerkelijke bron noemt 52,5 m voor de toren; het model eindigt op 50,8 m en laat de zeer dunne windvaan weg. De torenbreedte, spitsknik en plaats en maten van de nissen, steunberen en het portaal zijn met foto's en de reconstructie geschat en vereenvoudigd. Traceringen, leien, klokwijzers, smalle lijsten en windvanen zijn weggelaten omdat zij op 1:1000 te fijn zijn.

De generator controleert de gesloten geometrie, Float32-mesh en de overhang op 1:1000; de STL meet ongeveer 40,95 × 21 × 51,3 mm. De afzonderlijke bouwdelen zijn tot één printbaar geheel verenigd.

Bronnen: [monumentenbeschrijving](https://www.monumenten.nl/monument/15328), [kerkgebouw](https://grotekerkepe.nl/kerkgebouw/), [profiel met torenhoogte](https://grotekerkepe.nl/images/ProfielGKEpe-April2016.pdf), [Wikimedia Commons, foto's](https://commons.wikimedia.org/wiki/Category:Grote_kerk,_Epe), BAG, 3D BAG en PDOK AHN DSM 0,5 m.

## Controle en generator

Genereer met `node scripts/generate-grote-kerk-of-sint-maartenskerk-epe.mjs`. Catalogusplaatsing, 45-gradensteuntest en volledige 1:1000-exports met en zonder landmark zijn geslaagd. Vier gelijke exporthoeken zijn met PDOK en historische foto's vergeleken; de fotohoeken zijn benaderend. De positie en de volledige printpreview zijn op de kaart bekeken.
