# Breitnertoren (Amsterdam)

Breitner Center, 2001; Peter Ellis van SOM met ZZDP. Het model omvat
de drie torenvolumes, middenschijf, dakframes, trappenhuis, entree,
glazen erker en de gehele lage noordvleugel met gebogen kop.

## Bestanden

- `breitnertoren.glb`: meters, Y omhoog, één gesloten `building:`-node.
- `breitnertoren.json`: catalogus, RD-positie, vervanging en bronmaten.
- `breitnertoren-1-1000.stl`: millimeters, Z omhoog, één verbonden volume.
- Generator: `scripts/generate-breitnertoren.mjs`, reproduceerbaar met
  `node scripts/generate-breitnertoren.mjs`, zonder netwerkinvoer.

## Positie en gemeten maten

Oorsprong **RD (122927, 484158)**, in het hart van de torenvolumes.
Lokale X staat op **20,1 graden in RD**, Y haaks naar het noordnoordwesten.
Z=0 is **NAP +1,2228 m**, gemeten straatniveau; onderkant z=-1 m.
Vier maaiveldpunten buiten de gebouwen kiezen het laagste PDOK-straatniveau:
**44,3471287 m ellipsoïdisch**, ook als vaste terugval ingesteld.
`groundOffsetMetres` is 0. Het model vervangt
**NL.IMBAG.Pand.0363100012070861**.

| Bouwdeel | Hoogte in m NAP |
| --- | ---: |
| Westelijke glasvleugel | 61,132 |
| Westelijke kern en lager dakframe | 64,876 |
| Afgeronde oostvleugel met ronde trap | 82,780 |
| Hoofdglasvolume | 92,022 |
| Middenschijf, alleen het zuidelijke dakdeel | 94,528 |
| Bovenste dakframe | 94,693 |
| Dakinstallaties | 96,271 |
| Lage noordvleugel en gebogen kop | 16,782 |
| Glazen erker aan lage vleugel | 15,696 |
| Verbindingshal | 14,420 |

Deze hoogtes zijn uit 3D BAG LoD2.2 gelezen en tegen AHN gecontroleerd.
De torendaken zijn vlak op verschillende niveaus; de scheve dakrand uit
de backloghint is geen bewijs voor een hellend hoofddak. De volledige
voetafdruk is circa **28,93 × 111,60 m** in het gebouwstelsel.

## Opbouw en print

Doorlopende prisma's vormen de schacht en vleugels, met aparte daken per
bouwdeel. De afgeronde oosthoek en bladkop volgen de BAG; het ronde
trappenhuis is een cilinder met horizontale glasvoegen. Gevelglas en
vensters zijn blinde nissen van **0,35 m**. De grotendeels dichte
Amstelzijde heeft weinig vensters en een roosterband, in tegenstelling
tot de glazen gevels daaronder en aan de andere zijden.

De entree heeft twee ronde kolommen, een dikke luifel en een terugliggende
pui. De lage erker heeft een 45 graden ondersnede. Beide dakframes hebben
ronde pilaren van **1,1 m**, balken van circa **1 m** en blinde velden
met een permanente ondersnede, zodat er geen vrije platte overspanning
in de losse STL zit. Er zijn geen DSM-hoogtelagen.

## Geschat en weggelaten

Geschat uit foto's: vensterverdeling, 3,85 m vloersteek, 3,45 m travees,
nisdiepte, roosterbanden, frameprofielen, entree- en erkeronderkant.
De donkere glazen tussenhal in de lage vleugel laat het AHN door het dak
heen kijken. Het dak is daarom geïnterpoleerd tussen de gemeten
aansluitranden op NAP +16,782 m, met blinde glasvelden.

Weggelaten: dunne glasleuningen, kozijnen, kabels, bordeshekken en
onderhoudsladders, met diktes onder 0,9 m. De open velden van de dakframes
en het penthouse zijn blinde nissen voor 1:1000. Het historische Philips-logo
is weggelaten: het is een dun gevelreliëf, en Philips verhuisde in 2025.
De omringende woningen en naburige torens hebben eigen BAG-panden en
blijven PDOK; er staat geen dubbel plein of talud in de GLB.

## Controle

- Eén verbonden gesloten volume, `NoError`, 31.482 driehoeken.
- Permanente plaatsingstest controleert alle daken, het verzonken hoge
  dak met een straal, de ronde trap, de noordelijke kop en de verschillende
  glas- en steenritmes van de Amstelzijde.
- Vier GLTFLoader-aanzichten en vier schuine renders naast de daadwerkelijke
  PDOK-reconstructie en Commons-foto's gecontroleerd.
- Printbare overhang op **1:1000 bij 45 graden**: **0,1374%** extra volume,
  resultaat `NoError`; kolommen en dragende frames minstens 0,9 mm breed.
- Kaart met landmarkschakelaar aan en uit gecontroleerd. Het hele complex
  geëxporteerd in **160 × 160 m op 160 × 160 mm**, hoogteversterking 1,
  1 mm grondplaat, zonder gegenereerde bruggen. Ook de schuine preview
  gecontroleerd op aansluiting aan het maaiveld.

## Bronnen

- PDOK BAG, AHN DSM/DTM 0,5 m (**CC0**) en Actueel_orthoHR, 12 oktober 2026.
- [3D BAG-feature](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012070861),
  **TU Delft/3DGI, CC BY 4.0**, dakomtrekken en hoogtes.
- [ZZDP over De Omval](https://www.zzdp.nl/nl/artikel/Ongeevenaard-ensemble):
  architect en ensemble.
- [Breitnertoren in 2019 (1)](https://commons.wikimedia.org/wiki/File:Breitnertoren_in_2019_(1).jpg),
  [(2)](https://commons.wikimedia.org/wiki/File:Breitnertoren_in_2019_(2).jpg),
  [(3)](https://commons.wikimedia.org/wiki/File:Breitnertoren_in_2019_(3).jpg),
  [(4)](https://commons.wikimedia.org/wiki/File:Breitnertoren_in_2019_(4).jpg):
  **Ceescamel, CC BY-SA 4.0**, lage vleugel, toren, entree en noordkant.
- [HeadPhilips](https://commons.wikimedia.org/wiki/File:HeadPhilips.jpg):
  **Migdejong, publiek domein**, Amstelzijde met dichte bovenwand en lager
  dakframe. Foto's dienen als referentie en zitten niet in de repository.
