-- Import data into table principals from file 'truncated_title_principals.tsv'
LOAD DATA INFILE 'C:/xampp/mysql/data/softeng/truncated_data/truncated_title.principals.tsv'
INTO TABLE `softeng`.`principals`
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(t_const_principals, ordering_principals, n_const_principals, category, job, characters, img_url_asset_principals);

INSERT INTO `softeng`.`Title_Basics_has_Principals` (
    `Title_Basics_T_const`,
    `Principals_t_const_principals`,
    `Principals_ordering`,
    `Principals_n_const`
)
SELECT
    tb.`T_const` AS `Title_Basics_T_const`,
    p.`t_const_principals` AS `Principals_t_const_principals`,
    p.`ordering_principals` AS `Principals_ordering`,
    p.`n_const_principals` AS `Principals_n_const`
FROM
    `softeng`.`Title_Basics` tb
JOIN
    `softeng`.`Principals` p
ON
    tb.`T_const` = p.`t_const_principals`;