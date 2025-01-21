# Het live brengen van website verslag
## Deploying

We kunnen onze 'verkiezingsproject' niet allemaal deployen, vandaar dit verslag.

## Het maken van een project 
### Backend:
We beginnen met het maken van een springboot project. <br>
Daarbij gebruiken we als dependency: <br>
* Spring Web
* Spring Data JPA
* MySQL Driver
* Spring Boot DevTools
* Spring Security

Dit hebben we ook in ons verkiezingsproject.<br>
Daarna maken we een application.properties, zodat we een connectie kunnen maken met de database. Zie hieronder de schermafbeelding.
Ik heb het wachtwoord even verborgen, zodat niet iedereen meteen weet wat mijn root wachtwoord is.

[//]: # (![Application Properties]&#40;../deploying-pictures/applicationProperties.png&#41;)

### Frontend:
Vervolgens hebben we heel simpel vue geïnstalleerd, maar daar wil ik niet te veel over vertellen, want dat is niet erg
relevant voor het deployen.

## Vue.js Frontend draaien in Docker
1. Docker-image gebouwd
    Ik begon met het maken van een Docker-image voor mijn Vue.js frontend. Hiervoor gebruikte ik het commando:<br>
    ```<b>docker build -t vue-frontend:latest .</b>``` <br>
    Door het gebruik van de optie -t vue-frontend:latest gaf ik de image een naam en tag. Dit maakte het later eenvoudiger om de image aan te roepen.
2. Controle van Docker-images
   Na het bouwen van de image heb ik gecontroleerd of de image correct was gemaakt met:<br>
   ```docker images```<br>
   Hier zag ik dat er enkele images geen naam of tag hadden. Om dit op te lossen, heb ik de juiste image getagd:<br>
   ```docker tag <image-id> vue-frontend:latest```<br>
   Hiermee gaf ik de image alsnog een duidelijke naam en tag.
3. Container gestart
   Vervolgens probeerde ik de container te starten met:<br>
   ```docker run -d -p 8080:80 vue-frontend:latest```<br>
   Tijdens deze poging kreeg ik een foutmelding: address already in use. Dit gaf aan dat poort 8080 al in gebruik was door een ander proces.
4. Poort 8080 vrijgemaakt
   Ik heb onderzocht welk proces poort 8080 gebruikte met:<br>
   ```lsof -i :8080```<br>
   Dit toonde aan dat een Java-toepassing (PID 24109) de poort bezet hield. Ik heb dit proces beëindigd met:<br>
   ```kill -9 24109```<br>
5. Container opnieuw gestart
   Nadat ik poort 8080 had vrijgemaakt, heb ik de container opnieuw gestart:<br>
   ```docker run -d -p 8080:80 vue-frontend:latest```<br>
   Deze keer werkte het zonder problemen en de container draaide zoals ik wilde.
6. Controle van de draaiende container
   Ik heb gecontroleerd of de container actief was met:<br>
   ```docker ps```<br>
