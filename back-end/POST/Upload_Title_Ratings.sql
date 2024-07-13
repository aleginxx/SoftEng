-- Import data into table ratings from file 'truncated_title_ratings.tsv'
LOAD DATA INFILE 'C:/xampp/mysql/data/softeng/truncated_data/truncated_title.ratings.tsv'
INTO TABLE `softeng`.`ratings`
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;