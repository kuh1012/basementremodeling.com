CREATE TABLE IF NOT EXISTS redirect_rules (
    ruleId int(10) unsigned NOT NULL AUTO_INCREMENT,
    fromPath varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    toUrl varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (ruleId)
);