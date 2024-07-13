-- Import data into table title_akas from file 'truncated_title_akas.tsv'
LOAD DATA INFILE 'C:/xampp/mysql/data/softeng/truncated_data/truncated_title.akas.tsv'
INTO TABLE `softeng`.`title_akas`
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;