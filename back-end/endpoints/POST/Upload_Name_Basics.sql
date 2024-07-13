LOAD DATA INFILE 'C:/xampp/mysql/data/softeng/truncated_data/truncated_name.basics.tsv'
INTO TABLE `softeng`.`name`
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(n_const, primary_name, birth_year, death_year, primary_prof, known_for_titles, img_url_asset_name);
