# Note varie

## Struttura del progetto

La cosa più difficile è strutturare il progetto in modo che sia facilmente
espandibile con le seguenti caratteristiche:

* Che possa essere aggiunta un AI per simulare un giocatore.
* Che si sia un server da interrogare con i socket per gestire
le partite con più giocatori
* Che sia possibile implementare un sistema che riproduca la partita per
mostrarla dopo.

## Comportamento del giocatore

Quando il giocatore muove il mouse spra le carte viene evidenziata la carta sulla
quale si trova il mouse. Se la carta viene cliccata viene evidenziata con un colore diverso.

```
const obj = {a:1,b:2,c:3};

const clone = {...obj};

console.log(clone); // {a:1,b:2,c:3};

```

## Funzioni particolari

``` findSum ``` Una funzione molto importante è quella per cercare tutte le possibili somme di carte
che si possono prendere sul tavolo.
Cercando ho trovato questa interessante discussione [link](https://stackoverflow.com/questions/4632322/finding-all-possible-combinations-of-numbers-to-reach-a-given-sum) 

``` heightTackableCards ``` Questa funzione è molto interessante perchè deve avidenziare
in modo diverso le diverse combinazioni di carte che un giocatore può prendere.
All'interno di questa funzione sono presenti varie variabili:
+ ``` list ``` un array che contiene tanti array quante le possibili combinazioni. Ogni array
nella lista contiene i valori delle carte della combinazione.
+ ``` positions ``` Un arrey che contiene tanti array quante le possibili combinazioni. Questa
volta ogni arrei contiene tutti i punti di inserimento delle carte che fanno parte delle combinazioni.

