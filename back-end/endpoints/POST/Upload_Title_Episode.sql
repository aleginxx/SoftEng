-- Import data into table episode from file 'truncated_title_episode.tsv'
LOAD DATA INFILE 'C:/xampp/mysql/data/softeng/truncated_data/truncated_title.episode.tsv'
INTO TABLE `softeng`.`episode`
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;