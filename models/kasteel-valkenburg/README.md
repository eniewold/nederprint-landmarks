# Kasteelruïne Valkenburg (Valkenburg)

Bewaarde muren van kapel en hoofdvleugel, zuidelijke zaal-/donjonresten en lagere dwingel; geen reconstructie van het verdwenen complete kasteel.

## Bestanden en plaatsing

- `kasteel-valkenburg.glb`: meters, Y omhoog, één bouwklasse met vijf afzonderlijke positieve muurvolumes.
- `kasteel-valkenburg.json`: RD-plaatsing en plateaupunten; de ruïne heeft in actuele BAG geen pandcontour, dus geen verzonnen BAG-vervanging.
- `kasteel-valkenburg-1-1000.stl`: millimeters, Z omhoog, ruïnemuren met vlakke diepe voeten.
- `kasteel-valkenburg-grondplaat-1-1000.stl`: verbonden variant met 1 mm grondplaat; alleen STL, geen extra terrein in de GLB.
- Herbouw: `node scripts/generate-kasteel-valkenburg.mjs --components`.

RD `[186235,319219]`, X oost en Y noord. AHN-referentie NAP +100,30 m; de hogere zuidelijke kamers liggen tot circa +104 m. PDOK is op het westelijke plateau grover/hoger: meetpunten `[-15,10]`, `[-17,3]`, `[-18,-8]` geven 146,320, 145,803 en 145,759 m ellipsoïdaal. De lader gebruikt het laagste punt, terugval 145,76 m. Met nul extra inzinking levert dit circa 2 m plaatsingsmarge boven AHN; noodzakelijk om de lage muren boven het grovere PDOK-terrein te houden. Voeten lopen 15 m onder de referentie door. De omringende straat ligt veel lager en wordt niet als plaatsingshoogte gebruikt. De heuvel blijft volledig PDOK-terrein.

## Model en schattingen

Afzonderlijke muurvakken volgen luchtfoto-afgeleide planlijnen. Elk vak heeft een verticaal langsprofiel: de op vaste plaatsen gemeten AHN-muurtoppen zijn met rechte segmenten verbonden. Dit zijn muurvlakken van voet tot erosietop, geen gestapelde DSM-hoogtelagen. Hoogste gemeten muur circa NAP +112,75 m. De kapel en grote zaal hebben hoge ongelijkmatige westmuren; aan de oostzijde zijn gedeelten veel lager of vrijwel verdwenen. Lage zuidelijke vakken, ronde donjonfundering en halfronde noordelijke rest zijn als open muurstructuren opgebouwd.

Planlijnen en dikten, erosiecontouren tussen AHN-metingen, zes openingposities, steunberen, ronde fundamenten en het dwingelprofiel zijn benaderingen op basis van luchtfoto/RCE-foto's; lokale planfouten van circa 1–2 m blijven mogelijk. De monumentale windvaan, losse leuningen, loopbruggen, kleine puinstenen, moderne bezoekersvoorzieningen en begroeiing vervallen. Het historische kasteel krijgt geen daken of ontbrekende hoge torens.

Openingen krijgen steile puntige bovenzijden van circa 58°; oorspronkelijke rondbogen vereenvoudigd. Muren/steunberen minimaal 1,3 m, rondfundament 1,5 m. Voor de losse STL zijn de vijf muurcomplexen afzonderlijk gesloten; de grondplaatvariant verbindt ze voor één print. In een tegel/3MF verbindt het PDOK-heuvelterrein de complexen. Geen verborgen interne holten, geen grondplaat of eigen heuvel in de kaart-GLB.

## Controle

- Generator en Float32-rondgang `NoError`, vijf positieve volumes; genus 8 totaal door open kamers en doorgangen. Grondplaatvariant eveneens `NoError`.
- STL: 2.068 driehoeken, 17,33 cm³, 63,8 × 101,6 × 27,5 mm; veel van de diepe muurvoet verdwijnt in de PDOK-heuvel.
- Printsteuncontrole 0% toegevoegde inhoud; alle bovenzijden van openingen steiler dan 45°.
- AHN: 1.484 hogere muurcellen, 75,5% binnen 1 m en 87,9% binnen 2 m; mediane afwijking 0,27 m vóór de beschreven plaatsingsmarge.
- Vier gelijke schuine aanzichten van de volledige PDOK-export en export met landmark, naast vier RCE-foto's beoordeeld. PDOK heeft hier alleen terreinresten, geen BAG-kasteelreconstructie. Muren hebben onregelmatige toppen, doorgangen, open kamers en ronde resten.
- Werkelijke preview/3MF van 150 × 150 m op 1:1000, 150 × 150 mm en 43,2 mm hoog, omvat de gehele ruïne/heuvel en beide uiteinden van de dwingel. Muurvoeten sluiten overal op het terrein aan.
- 304 landmarktests groen. Permanente test controleert het bovenplateau, ontbrekende BAG-vervanging, diepe voeten, hoge muur en open westelijke binnenplaats.
- [Controlekaart](http://localhost:3063/kaart/50.86194/5.83083/300/1x1/0): controleer de kapel-/zaalmuren en lage zuidelijke ruïnevakken op het heuvelplateau; `landmarks=0` toont PDOK.

## Bronnen

- [RCE 36769](https://monumentenregister.cultureelerfgoed.nl/monumenten/36769): ruïne op steile helling, bewaarde muurvakken en oostelijke dwingel.
- [Stichting Kasteel Valkenburg](https://www.kasteelvalkenburg.nl/ontdek-onze-locaties/kasteelruine/): kapel, grote zaal, donjon en overige ruïneonderdelen.
- [Commons Valkenburg Castle](https://commons.wikimedia.org/wiki/Category:Valkenburg_Castle): RCE 20536086 noordwest-buitengevel, 20536084 zuidwest-buitengevel, 20534992 binnenzijde uit het noorden en 20355681 overzicht; oorspronkelijke bestandlicenties.
- PDOK BAG/BGT, AHN DSM/DTM 0,5 m, Actueel_orthoHR en 3D Basisvoorziening, 9 oktober 2026.
