-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema softeng
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema softeng
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `softeng` DEFAULT CHARACTER SET utf8 ;
-- -----------------------------------------------------
-- Schema softeng
-- -----------------------------------------------------
USE `softeng` ;

-- -----------------------------------------------------
-- Table `softeng`.`Genres`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `softeng`.`Genres`;
CREATE TABLE IF NOT EXISTS `softeng`.`Genres` (
  `GenreID` INT NOT NULL AUTO_INCREMENT,
  `GenreName` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`GenreID`),
  UNIQUE INDEX `GenreID_UNIQUE` (`GenreID`) ,
  UNIQUE INDEX `GenreName_UNIQUE` (`GenreName`) )
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `softeng`.`Title_Basics`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `softeng`.`Title_Basics`;
CREATE TABLE `softeng`.`Title_Basics` (
  `T_const` VARCHAR(45) NOT NULL,
  `Title_type` VARCHAR(45) NOT NULL,
  `Primary_title` MEDIUMTEXT NOT NULL,
  `Original_title` MEDIUMTEXT NOT NULL,
  `Is_adult` BINARY(1) NOT NULL,
  `Start_year` INT NOT NULL,
  `End_year` INT NULL,
  `Runtime` INT NULL,
  `img_url_asset_basics` TEXT NULL,
  PRIMARY KEY (`T_const`),
  UNIQUE INDEX `T_const_UNIQUE` (`T_const` ASC) )
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `softeng`.`Genres`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `softeng`.`Title_Basics_Has_Genres`;
CREATE TABLE IF NOT EXISTS `softeng`.`Title_Basics_has_Genres` (
  `Title_Basics_T_const` VARCHAR(45) NOT NULL,
  `Genres_GenreID` INT NOT NULL,
  PRIMARY KEY (`Title_Basics_T_const`, `Genres_GenreID`),
  INDEX `fk_Title_Basics_has_Genres_Genres1_idx` (`Genres_GenreID`),
  INDEX `fk_Title_Basics_has_Genres_Title_Basics1_idx` (`Title_Basics_T_const`),
  CONSTRAINT `fk_Title_Basics_has_Genres_Title_Basics1`
    FOREIGN KEY (`Title_Basics_T_const`)
    REFERENCES `softeng`.`Title_Basics` (`T_const`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Title_Basics_has_Genres_Genres1`
    FOREIGN KEY (`Genres_GenreID`)
    REFERENCES `softeng`.`Genres` (`GenreID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `softeng`.`Title_akas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `softeng`.`Title_akas`;
CREATE TABLE `softeng`.`Title_akas` (
  `Title_Id` VARCHAR(45) NOT NULL,
  `ordering` INT NOT NULL,
  `title` MEDIUMTEXT NOT NULL,
  `Region` TEXT(10) NULL,
  `Language` VARCHAR(45) NULL,
  `types` VARCHAR(45) NULL,
  `attributes` MEDIUMTEXT NULL,
  `is_original_title` BINARY(1) NOT NULL,
  PRIMARY KEY (`Title_Id`, `ordering`),
  CONSTRAINT `Title_Id`
    FOREIGN KEY (`Title_Id`)
    REFERENCES `softeng`.`Title_Basics` (`T_const`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `softeng`.`Episode`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `softeng`.`Episode`;
CREATE TABLE `softeng`.`Episode` (
  `t_const_episode` VARCHAR(45) NOT NULL,
  `parent_t_const` VARCHAR(45) NOT NULL,
  `season_number` INT NULL,
  `episode_number` INT NULL,
  PRIMARY KEY (`t_const_episode`),
  UNIQUE INDEX `t_const_UNIQUE` (`t_const_episode` ASC) ,
  INDEX `parent_t_const_idx` (`parent_t_const` ASC) ,
  CONSTRAINT `t_const`
    FOREIGN KEY (`t_const_episode`)
    REFERENCES `softeng`.`Title_Basics` (`T_const`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `softeng`.`Ratings`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `softeng`.`Ratings`;
CREATE TABLE `softeng`.`Ratings` (
  `t_const_ratings` VARCHAR(45) NOT NULL,
  `average_rating` DOUBLE NOT NULL,
  `num_votes` INT NOT NULL,
  PRIMARY KEY (`t_const_ratings`),
  UNIQUE INDEX `t_const_UNIQUE` (`t_const_ratings` ASC) ,
  CONSTRAINT `t_const_ratings`
    FOREIGN KEY (`t_const_ratings`)
    REFERENCES `softeng`.`Title_Basics` (`T_const`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `softeng`.`Crew`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `softeng`.`Crew`;
CREATE TABLE `softeng`.`Crew` (
  `t_const_crew` VARCHAR(45) NOT NULL,
  `directors` MEDIUMTEXT NULL,
  `writters` MEDIUMTEXT NULL,
  PRIMARY KEY (`t_const_crew`),
  UNIQUE INDEX `t_const_crew_UNIQUE` (`t_const_crew` ASC) ,
  CONSTRAINT `t_const_crew`
    FOREIGN KEY (`t_const_crew`)
    REFERENCES `softeng`.`Title_Basics` (`T_const`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `softeng`.`Name`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `softeng`.`Name`;
CREATE TABLE `softeng`.`Name` (
  `n_const` VARCHAR(45) NOT NULL,
  `primary_name` VARCHAR(100) NOT NULL,
  `birth_year` INT NULL,
  `death_year` INT NULL,
  `primary_prof` MEDIUMTEXT NOT NULL,
  `known_for_titles` MEDIUMTEXT NULL,
  `img_url_asset_name` LONGTEXT NULL,
  PRIMARY KEY (`n_const`),
  UNIQUE INDEX `n_const_UNIQUE` (`n_const` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `softeng`.`Principals`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `softeng`.`Principals`;
CREATE TABLE `softeng`.`Principals` (
  `t_const_principals` VARCHAR(45) NOT NULL,
  `ordering_principals` INT NOT NULL,
  `n_const_principals` VARCHAR(45) NOT NULL,
  `category` MEDIUMTEXT NULL,
  `job` VARCHAR(200) NULL,
  `characters` MEDIUMTEXT NULL,
  `img_url_asset_principals` LONGTEXT NULL,
  PRIMARY KEY (`t_const_principals`, `ordering_principals`, `n_const_principals`),
  INDEX `n_const_idx` (`n_const_principals` ASC) ,
  CONSTRAINT `n_const`
    FOREIGN KEY (`n_const_principals`)
    REFERENCES `softeng`.`Name` (`n_const`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `softeng`.`Title_Basics_has_Principals`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `softeng`.`Title_Basics_has_Principals`;
CREATE TABLE `softeng`.`Title_Basics_has_Principals` (
  `Title_Basics_T_const` VARCHAR(45) NOT NULL,
  `Principals_t_const_principals` VARCHAR(45) NOT NULL,
  `Principals_ordering` INT NOT NULL,
  `Principals_n_const` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Title_Basics_T_const`, `Principals_t_const_principals`, `Principals_ordering`, `Principals_n_const`),
  INDEX `fk_Title_Basics_has_Principals_Principals1_idx` (`Principals_t_const_principals` ASC, `Principals_ordering` ASC, `Principals_n_const` ASC) ,
  INDEX `fk_Title_Basics_has_Principals_Title_Basics1_idx` (`Title_Basics_T_const` ASC) ,
  CONSTRAINT `fk_Title_Basics_has_Principals_Title_Basics1`
    FOREIGN KEY (`Title_Basics_T_const`)
    REFERENCES `softeng`.`Title_Basics` (`T_const`)
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Title_Basics_has_Principals_Principals1`
    FOREIGN KEY (`Principals_t_const_principals` , `Principals_ordering` , `Principals_n_const`)
    REFERENCES `softeng`.`Principals` (`t_const_principals` , `ordering_principals` , `n_const_principals`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `softeng`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `softeng`.`user`;
CREATE TABLE `softeng`.`user` (
  `user_id` VARCHAR(45) NOT NULL,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `age` INT NOT NULL,
  `is_verified` BINARY(1) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC) ,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) ,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `softeng`.`user_has_seen_title`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `softeng`.`user_has_seen_title`;
CREATE TABLE `softeng`.`user_has_seen_title` (
  `user_user_id` VARCHAR(45) NOT NULL,
  `Title_Basics_T_const` VARCHAR(45) NOT NULL,
  `favourite` INT NOT NULL,
  PRIMARY KEY (`user_user_id`, `Title_Basics_T_const`),
  INDEX `fk_user_has_Title_Basics_Title_Basics1_idx` (`Title_Basics_T_const` ASC) ,
  INDEX `fk_user_has_Title_Basics_user1_idx` (`user_user_id` ASC) ,
  CONSTRAINT `fk_user_has_Title_Basics_user1`
    FOREIGN KEY (`user_user_id`)
    REFERENCES `softeng`.`user` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_Title_Basics_Title_Basics1`
    FOREIGN KEY (`Title_Basics_T_const`)
    REFERENCES `softeng`.`Title_Basics` (`T_const`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
