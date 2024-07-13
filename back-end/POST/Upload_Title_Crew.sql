-- Import data into table crew from file 'truncated_title_crew.tsv'
LOAD DATA INFILE 'C:/xampp/mysql/data/softeng/truncated_data/truncated_title.crew.tsv'
INTO TABLE `softeng`.`crew`
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;