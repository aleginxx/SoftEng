# CLI

Περιεχόμενα:

 Το CLI είναι υλοποιημένο σε python. Πριν ξεκινήσουμε την χρήση του, βεβαιώνουμε ότι έχουμε όλα τα dependencies/requirements. Αυτό το καταφέρνουμε τρέχοντας την παρακάτω εντολή στο home(~) του repository.

## Install Requirements:

```bash
pip install -r requirements.txt
```

## Usage:

#### In host
Ενώ βρισκόμαστε στο home(~) του repository:

```bash
python3 /cli/src/se2316.py -h
python3 /cli/src/se2316.py healthcheck
python /cli/src/se2316.py [scope] [parameters]
```

#### In Docker:
```bash
se2316 -h
se2316 healthcheck
se2316 [scope] [parameters]
```
