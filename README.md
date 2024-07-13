# NTUAflix

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![PHP](https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Apache](https://img.shields.io/badge/apache-%23D42029.svg?style=for-the-badge&logo=apache&logoColor=white)


Github repository of NTUAflix software.

## Μέλη της ομάδας softeng23-16:
- Georgia Alexopoulou | el20164
- Georgios Gratsonis | el20900
- Antonis Kountouris | el20178
- Stylianos Mpouliaris Malatestas | el19214
- Antonia Mpalta | el20873
- Markella Mpournaka | el20030

# Εγκατάσταση

## Manual Installation
Για περισσότερες διευκρινίσεις, διαβάστε όλα τα README της εφαρμογής
#### Database:

Ανοίγουμε πρόγραμμα ή server που μπορεί να κάνει host βάση MariaDB/MySQL. Δημιουργούμε μια βάση με το όνομα `softeng`.

```bash
CREATE SCHEMA IF NOT EXISTS `softeng` DEFAULT CHARACTER SET utf8 ;
```

Κάνουμε import το DB dump στην βάση (είτε μέσω PHPMyAdmin ή απευθείας από το MariaDB)
```bash
mariadb -u root -p softeng23-16 < back-end/NTUAflix_database.sql
```

#### API:

Πηγαίνουμε στον φάκελο `api` και τρέχουμε σε terminal `npm install`. Όταν τελείωσει το install τρέχουμε `npm start`.

#### Web:
Κάνουμε host ολόκληρο τον φάκελο `frontend` με έναν server που μπορεί να τρέξει PHP. Καλή επιλογή είναι το Nginx ή το Apache.

#### CLI:
Βεβαιωνόμαστε ότι έχουμε όλα τα requirements για να τρέξουμε το CLI:
```bash
pip install -r requirements.txt
```
Τρέχουμε το CLI απευθείας από το home directory:
```bash
python3 cli/src/se2316.py [scope] [parameters]
```

## Docker
Ολόκληρη η εφαρμογή έχει γίνει "Dockerized" και μπορεί να γίνει installed πολύ εύκολα εάν έχετε διαθέσιμη την εφαρμογή `Docker`. Η εφαρμογή τρέχει βέλτιστα με την χρήση Docker.

## Εγκατάσταση με Docker:

1. Ανοίγετε terminal στο home directory του repository
2. Εκτελείτε την παρακάτω εντολή (βεβαιωθείτε ότι έχετε το Docker Compose πρώτα, αλλιώς κατεβάστε το από το επίσημο site ή με την χρήση του αγαπημένου σας packet manager):
```bash
docker-compose up
```
3. Παρακολουθήστε την εγκατάσταση των images και την δημιουργία των containers. Με το που τελειώσει η εγκατάσταση κάντε χρήση της παρακάτω εντολής για να δείτε εάν ενεργοποιήθηκαν ορθά τα containers
```bash
docker ps
```
Πρέπει να δείτε 4 containers να τρέχουν:
  - MariaDB
  - API
  - PHP-Apache
  - CLI

Πλέον μπορείτε να χρησιμοποιήσετε την υπηρεσία κανονικά στο μηχάνημά σας. Το url που χρησιμοποιούμε είναι το `localhost`. Παρακάτω υπάρχει ο πίνακας με τα ports που ακούνε οι υπηρεσίες στο `HOST` μηχάνημα:

  | SERVICE | PORT |
  | ------- | ---- |
  | MariaDB | 3306 |
  | API | 9876 |
  | Frontend - Apache | 8000 |
  | CLI | *NO PORT NEEDED* |

  Για να χρησιμοποιήσουμε το CLI, κάνουμε σύνδεση απευθείας με το Container του είτε μέσω του Docker Desktop ή εκτελώντας την εντολή

  ```bash
  docker exec -it cli /bin/bash
  ```
