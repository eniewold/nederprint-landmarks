# De Blob (Eindhoven)

Doorlopende asymmetrische gebouwschil met twee afgeronde glazen koppen, driehoekige paneelnissen en blinde deurportalen. De schil bestaat uit verbonden vlakken tussen maatstations en gesloten eindvlakken; geen gestapelde hoogtelagen. Per-rij voorbeeld: `generate-evoluon.mjs`. Reproductie: `node scripts/generate-de-blob.mjs`.

## Bestanden en plaatsing

- `de-blob.glb`: meters, Y omhoog, één gesloten `building:`-node.
- `de-blob.json`: oorsprong RD `[161172.8,383525]`, +X 83° in RD naar de noordelijke kop, +Y naar Emmasingel.
- `de-blob-1-1000.stl`: millimeters, Z omhoog, vlakke voet; circa 59,77 × 21,58 × 25,38 mm.

Vervangt alleen BAG `0772100001003308`. Omringende gebouwen blijven staan. BAG levert contour en lengterichting; AHN DSM/DTM levert maaiveld NAP +16,4 m en de witte dakmantel tot circa NAP +41,3 m. Glas geeft gaten en binnenvloeren in het AHN; de glazen koppen zijn daarom tussen meetbare dakranden en fotoverhoudingen glad doorgezet. Drie expliciete maaiveldpunten liggen op het omliggende plein. De voet loopt 0,45 m onder dat niveau door, zonder extra plateau.

## Onderdelen, schattingen en vereenvoudiging

Negentien vaste maatstations bepalen de lange vorm, met continue interpolatie langs de as en een asymmetrisch elliptisch dwarsprofiel. De hoogste zone ligt zuidelijk van het hart; de noordelijke kop is lager en smaller. De gevel blijft tot onder de gekromde dakmantel verticaal. Glasvlakken krijgen circa 0,35 m diepe driehoekige nissen, witte panelen circa 0,10 m diepe naden; 766 glasdriehoeken en 644 witte panelen. Het raster volgt de vrije kromming en wisselt de diagonalen af.

Dwarskromming, glazen kophoogtes in AHN-gaten, grenzen van de glasvelden, paneelverdeling en deurmaten zijn uit schuine foto's geschat en regelmatig gemaakt. Het echte raster heeft unieke paneelvormen; dit printmodel vereenvoudigt die. Nissen blijven blind en een doorlopende massieve kern draagt de gehele schil. Kleine eindpanelen worden weggelaten; de resterende driehoeken hebben een minimale hoogte van 0,85 m. Deurportalen aan Emmasingel en Nieuwe Emmasingel en bij beide koppen zijn ingesneden. Interieur, transparantie, deurvleugels, los staalwerk, kleine beslagdelen en reclame zijn weggelaten.

## Controle (9 oktober 2026)

Generator: `NoError`, één verbonden deel, genus 0, 19.664 driehoeken, circa 17.545,9 m³. Gesloten voet en schil, geen interne holtes, vrije overspanningen of losse staven. Alle details steunen op de massieve kern.

Catalogus-, API- en echte-exportcontrole: 292 tests geslaagd na de laatste wijziging. De nieuwe test plaatst de volledige Blob in een uitsnede en controleert vervangpand, asymmetrische koppen, hoogste punt, deurportaal en het raster op meerdere doorsneden.

Vier volledige GLB-renders naast de werkelijke PDOK-reconstructie op −35°, 55°, 145° en 235° bekeken en vergeleken met schuine foto's vanaf Emmasingel, Nieuwe Emmasingel en het plein. Op −35° zijn de twee afgeronde koppen en doorlopende dakmantel zichtbaar; 55° toont het witte midden en het oostelijke portaal; 145° toont de hoge glaskop en versmalling; 235° toont de westelijke glasvelden en entree. PDOK mist de vrije kromming door glasgaten en heeft geen gevelraster; het model voegt die vorm, paneelnissen en portalen toe. De kaartcontrole bevestigt positie, richting, kleur en aansluiting op het maaiveld; bij uit/aan verschijnt en verdwijnt de PDOK-reconstructie.

Volledige `createModelBundle`-preview-export op 1:1000: RD `[161103,383455,161243,383595]`, 140 × 140 mm, grondplaat 1 mm, hoogteversterking 1; het hele model valt binnen de uitsnede. 188 objecten en 84.900 driehoeken, met terrein en buurpanden visueel bekeken in de 3MF-preview. Aanvullende Manifold-controle na exportvoorbereiding: zowel bij 89° als 45° `NoError` en 18.352,781 mm³, dus geen extra steunvolume bij 45°. Geometrisch gecontroleerd, geen fysieke proefprint. Bronrasters, renders en preview blijven buiten de repo's in de sessiescratchpad.

[Controlekaart](http://127.0.0.1:3037/kaart/51.44077/5.47599/350/1x1/0): controleer de ronding van beide koppen, het driehoekige glasraster en de deurportalen aan Emmasingel en Nieuwe Emmasingel.

## Bronnen

- PDOK BAG `0772100001003308`, BGT, AHN DSM/DTM 0,5 m en Actueel_orthoHR, opgehaald 9 oktober 2026.
- [Fuksas: Admirant Entrance Building](https://fuksas.com/admirant-entrance-building/): vorm, draagstructuur en glas/witte mantel.
- [Knippers Helbig: De Blob](https://www.knippershelbig.com/en/projects/de-blob/): foto's van westzijde en paneelconstructie; driehoekmaat circa 1,80 m, kleiner bovenaan.
- [Waagner Biro: Blob](https://www.wb-sg.com/projects/blob/): unieke driehoekige paneelprofielen.
- Commons: [The Blob in Eindhoven](https://commons.wikimedia.org/wiki/File:The_Blob_in_Eindhoven,_Netherlands.jpg), WikiSander; [Binnenstad, panoramio 16](https://commons.wikimedia.org/wiki/File:Binnenstad,_5611_Eindhoven,_Netherlands_-_panoramio_(16).jpg), Ben Bender; [13-06-30-eindhoven-03](https://commons.wikimedia.org/wiki/File:13-06-30-eindhoven-03.jpg), Ralf Roletschek; ['The Blob' Eindhoven](https://commons.wikimedia.org/wiki/File:%27The_Blob%27_Eindhoven_(6564785833).jpg), FaceMePLS. Alleen visuele referenties, geen fototexturen overgenomen.
