# Die Hydra von Lerna

Eine Visual Novel im Browser, die den Hydra-Mythos neu erzählt: Kallis, eine Frau aus dem Dorf, muss die Hydra besiegen, weil Herakles nicht kommt. Am Ende glaubt ihr niemand, es sei denn, angesehene Männer bezeugen es und legen die Beweise vor (Bropropriating, Zeugnisungerechtigkeit). Es gibt sieben Enden.

Entstanden als Seminarfach-Projekt zur Mythen-Rezeption. Mythos-Vorlage: Gustav Schwab, *Die schönsten Sagen des klassischen Altertums* (1838–1840).

## Spielen

Die Datei `index.html` im Browser öffnen (Doppelklick). Es ist keine Installation nötig. Die Schriften werden von Google Fonts geladen, ohne Internet erscheint eine Ersatzschrift.

Bedienung: Tippen, Klicken oder Leertaste zum Weiterlesen, Antworten per Klick.

## Auf GitHub veröffentlichen (GitHub Pages)

1. Auf github.com ein neues Repository anlegen (z. B. `hydra-von-lerna`).
2. Alle Dateien und Ordner dieses Projekts hochladen (*Add file → Upload files*), `index.html` muss im Hauptordner liegen.
3. Im Repository *Settings → Pages* öffnen, bei *Source* den Zweig `main` und den Ordner `/ (root)` wählen und speichern.
4. Nach etwa einer Minute ist das Spiel unter `https://DEIN-NAME.github.io/hydra-von-lerna/` spielbar.

## Aufbau

| Datei | Inhalt |
|---|---|
| `index.html` | Seitengerüst, Titel- und Abspannbildschirm |
| `css/style.css` | Aussehen der Oberfläche (Farben ganz oben in `:root`) |
| `js/figuren-daten.js` | **Aussehen der Figuren:** Farben, Frisuren, Bärte, leicht änderbar |
| `js/figuren.js` | Zeichnet die Figuren aus diesen Angaben |
| `js/hintergruende.js` | Hintergründe (Dorf, Sumpf, Rat, Nacht …) und die Hydra |
| `js/geschichte.js` | Alle Szenen und Dialoge, Zeugen-Gewichtung, Enden |
| `js/engine.js` | Anzeige, Textmaschine, Auswahl, Abspann |

Alle Grafiken sind SVG-Code, der im Browser erzeugt wird. Es gibt keine Bilddateien.

## Grafik ändern

- **Farben und Frisuren einer Figur:** `js/figuren-daten.js` öffnen. Dort steht pro Figur eine Zeile, z. B. `robe` (Kleidung), `hair` (Haar), `skin` (Haut), `beard` (Bart). Farbwerte wie `#b8553a` ändern, speichern, Seite neu laden.
- **Neue Figur:** eine Zeile ergänzen und in `js/geschichte.js` in den Szenen unter `chars` verwenden, z. B. `chars:{c:'neuefigur:neutral'}`.
- **Hintergründe und Hydra:** in `js/hintergruende.js`, Funktion `bgSVG(name)` und `hydra(...)`. Farben stehen als Hex-Werte direkt im SVG-Code.
- **Farben der Oberfläche:** `css/style.css`, die Variablen in `:root`.
- **Eigene Bilder statt SVG:** Bild in einen Ordner `bilder/` legen und in `bgSVG` bzw. `fig` statt des SVG-Codes ein `<img src="bilder/name.png">` zurückgeben.

## Geschichte ändern

In `js/geschichte.js` steht jede Szene als Eintrag in `ST`, z. B. `a1:P('n',`Text`,'a2',{...})`: Sprecher, Text, nächste Szene. Den Text in den Backticks kann man einfach ändern. Szenennamen und Verknüpfungen nur ändern, wenn man weiß, welche Szenen darauf verweisen.
