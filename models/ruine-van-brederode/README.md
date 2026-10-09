# Ruïne van Brederode — Santpoort-Zuid

Huidige ruïne, met open hof en kamerresten, lage zuidwest- en ronde zuidoosttoren, open noordwestelijke kapeltoren, gekanteelde donjon met grijs piramidedak, ronde traptoren met spits, hoge poortzaal en houten binnenbrug. Geen reconstructie van verdwenen westvleugel of middeleeuwse daken.

## Bronnen en maatvoering

- [RCE 37110](https://monumentenregister.cultureelerfgoed.nl/monumenten/37110), [beheerder](https://www.ruinevanbrederode.nl/) en [Commons](https://commons.wikimedia.org/wiki/Category:Ru%C3%AFne_van_Brederode).
- PDOK Actueel_orthoHR, BAG 0453100000414917 en AHN DSM/DTM 0,5 m, geraadpleegd 9 oktober 2026. RD-oorsprong [102986, 493334], +X 25° in RD. Gebouwen op de voorburcht blijven PDOK.
- Vier schuine referenties: `37110 Ruine van Brederode te Santpoort Zuid 3.jpg`, `... 4.jpg`, `Ruïne van brederode- zicht op de Donjon en overblijfselen poort.jpg`, `Ruïne naar het westen - Santpoort - 20194196 - RCE.jpg`. Het historische beeld dient alleen voor de open kapeltoren; actuele daken volgen luchtfoto/AHN.
- Grachtreferentie NAP +4,10 m: actuele PDOK-waterspiegel 47,042–47,046 m ellipsoïdisch minus lokale hoogteomrekening 42,949 m, bepaald uitsluitend op het betrouwbare donjondak; de gehele PDOK-ruïne is te onvolledig voor zo'n omrekening. `groundHeight` 47,04 m is fallback, de laagste van de drie PDOK-terreinmonsters bepaalt de plaatsing.
- Donjon: borstwering 21,6 m, kantelen 23,3 m en dak 27,0 m NAP; traptorenspits 27,15 m; kapeltoren 16,1 m; lage torens ongeveer 7,8 m. Muren opgebouwd uit eigen planlijnen en langsprofielen.
- BGT-binnenbrug: voetpad/open verharding `G0453.40dd423ff9d05788e053cc1f0a0a3668`; bijbehorend volledige dek `G0453.40dd424045625788e053cc1f0a0a3668` vervangen. Alleen dit dek, niet de twee buitenbruggen, wordt verwijderd. Wegdek is overal de bovenste 0,50 m, afzonderlijk van de dragers.

## Model en print

Generator: `node scripts/generate-ruine-van-brederode.mjs --components`. Zelfstandig script met Manifold-prisma's, dakvlakken en muurprofielen; geen gestapelde hoogtelagen. GLB in meters, Y omhoog, scherpe normalensplitsing; `building:ruine`, `building:houten toegangsbrug`, `road:voetpad`. Voeten 0,80 m onder grachtreferentie. Vensters 0,35 m blind; doorlopende poort en zaalopeningen met steile spitsbogen. Wanden minimaal 1,0 m, meestal 1,3–1,7 m.

STL op 1:1000: 56,7 × 48,5 × 23,8 mm, 2024 driehoeken, 5,23 cm³, `NoError`, genus 6. Extra grondplaat-STL verbindt het losse brugdeel op een 1 mm basis; die plaat komt niet in de GLB. Float32-rondgang behoudt geslotenheid, genus en volume. Positieve volumes, geen verborgen holtes; open hof, torenringen en poort zijn bedoelde openingen.

De echte webshop-steuncontrole op 45° wijzigt het ruïnevolume 0,0232%, uitsluitend ondiepe vensterplafondjes; brug/dragers 0%. Geen externe steun nodig bij 1:1000. Brugbemonstering: 977 punten, dikte minimaal 0,50 m, geen dubbel bovenvlak.

## Controle en schattingen

Regressietest in webshop `tests/landmark-models.test.ts`: open hof, traptorenspits, verzonken voeten, alleen binnenbrug vervangen en apart voetpaddek. AHN-topcontrole: 1894 cellen, 77,2% binnen 1 m, 85,5% binnen 2 m, mediane afwijking 0,264 m.

Vier gelijke schuine camera's (-35°, 55°, 145°, 235°; hoogte 30°) naast PDOK en de vier foto's gecontroleerd. PDOK bevat hoofdzakelijk donjon/poortzaal en een platte ruïnevoet; het model voegt de open lage muurvakken toe. Kaart met landmarks aan én uit gecontroleerd; volledige 100 × 100 mm uitsnede geëxporteerd op 1:1000 naar preview en 3MF (hoogte 24,3 mm). Lokale bewijsbestanden `ruine-van-brederode/{vergelijking.jpg,kaart.jpg,preview.bin,export.3mf,print.json,ahn-check.json,bridge-check.json}` in de controlewerkmap, buiten de modelrepo.

[Controle-URL](http://localhost:3063/kaart/52.4253383/4.62250215/220/1x1/0). Kijk de hoogte van de lage ruïnemuren, beide daken en de aansluiting van de houten binnenbrug op de gracht na.

Geschat: vensterposities, eroderende muurkoppen en kantelen, dikten binnenmuren en lage funderingen; lage huidige glazen afdekking in poortzaal als gesloten bouwdeel. Houten brugdragers bewust grover en met steile draagvlakken in plaats van slanke horizontale balken; hekjes, vlaggenmast, voegwerk en metalen trappen vervallen. Geen verdwenen westelijke buitenmuur toegevoegd.
