Was ich implementiert habe:

1. Sortierfunktion:
   Die Tabelle kann durch Klicken auf das Pfeil-Icon nach Spalten sortiert werden.

2. Dropdown-Menü:
   Ein Dropdown-Feld ermöglicht die Auswahl des Suchfeldes (z.B. Name, E-Mail, etc.).

3. Suchfeld:
   Ein separates Texteingabefeld erlaubt die Eingabe eines Suchbegriffs.

4. Checkbox "Exact Match":
   Über eine Checkbox kann gewählt werden, ob die Suche eine exakte Übereinstimmung oder eine Teilübereinstimmung berücksichtigen soll.

5. Suche mit Debounce:
   Die Suche wird mit einer Verzögerung von 300 Millisekunden (Debounce) ausgelöst, um unnötige API-Anfragen bei jedem Tastendruck zu vermeiden.

6. Dynamische Aktualisierung:
   Die Suchergebnisse werden direkt in der Tabelle aktualisiert, ohne die Seite neu zu laden.

7. Feedback bei keiner Übereinstimmung:
   Wird kein passender Kontakt gefunden, erscheint eine Hinweismeldung:
   "No contacts found. Try a different search term."

8. Responsives Design:

   Die Tabelle und das Suchfeld passen sich flexibel an verschiedene Bildschirmgrößen an (z.B. kleinere Schriftgrößen auf Mobilgeräten).
   Auf Smartphones wird horizontales Scrollen für die Tabelle ermöglicht, um die Lesbarkeit zu gewährleisten.


Meine aktuellen Probleme:

Ursprünglich habe ich zu Testzwecken Beispiel-Daten (z.B. „Anna“, „Bnaa“ etc.) in die Tabelle eingefügt, um die Funktionalität zu prüfen. Diese wollte ich später wieder entfernen.

Nachdem ich die Testdaten nun auskommentiert habe, tritt folgendes Problem auf:
Wenn ein Benutzer beispielsweise „Berlin“ in das Suchfeld eingibt und keine passenden Ergebnisse vorhanden sind, wird die Meldung
"No contacts found. Try a different search term."
nicht mehr angezeigt.

Leider konnte ich dieses Problem bisher nicht lösen, auch nicht mit Unterstützung durch KI.

Deshalb habe ich mich entschieden, die Beispiel-Daten drinnen zu lassen.