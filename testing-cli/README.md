# CLI-Testing

Η υλοποίηση του testing έγινε με χρήση της βιβλιοθήκης "pytest". Ελέγχει τις διάφορες λειτουργίες που εκτελεί το CLI. Πριν τρέξουμε τα test, βεβαιώνουμε ότι έχουμε εγκαταστήσει τις βιβλιοθήκες python τα οποία είναι dependecies/requirements για το CLI και για το testing του. (Οδηγίες αναφέρονται στον φάκελο CLI)

## Run Tests:

#### In Host
Ενώ βρισκόμαστε στον φάκελο test-cli:

```bash
python -m pytest -rx
```
Η επιλογή `-rx` είναι επιλογή `report all except xpassed` και προβάλλει στο terminal πληροφορίες για όλα τα test cases outcomes, εκτός από αυτά με τη σημείωση `xpassed`.

## Unit Testing:
Το CLI unit testing κρίθηκε περιττό, καθώς στο src του cli χρησιμοποιεί μία μόνο συνάρτηση main.
