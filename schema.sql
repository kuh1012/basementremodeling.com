CREATE TABLE `albums` (
  `albumID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userID` int(10) unsigned NOT NULL,
  `albumTitle` varchar(255) NOT NULL,
  `albumCover` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`albumID`),
  KEY `user` (`userID`),
  CONSTRAINT `user` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `albums_relation` (
  `relationID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userID` int(10) unsigned NOT NULL,
  `albumID` int(10) unsigned NOT NULL,
  `ideaID` int(10) unsigned NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`relationID`),
  KEY `user_relation` (`userID`),
  KEY `album_relation` (`albumID`),
  KEY `idea_relation` (`ideaID`),
  CONSTRAINT `album_relation` FOREIGN KEY (`albumID`) REFERENCES `albums` (`albumID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `idea_relation` FOREIGN KEY (`ideaID`) REFERENCES `ideas` (`ideaID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_relation` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `awards` (
  `awardID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `awardImage` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `awardTitle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`awardID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



CREATE TABLE `booking` (
  `bookingID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `firstName` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `town` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zipCode` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `service` mediumtext COLLATE utf8mb4_unicode_ci,
  `square` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `budget` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `referer` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spec` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`bookingID`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `calendars` (
  `calendarID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userID` int(10) unsigned NOT NULL,
  `zipCodes` mediumtext COLLATE utf8mb4_unicode_ci,
  `timeStart` int(11) NOT NULL,
  `timeEnd` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`calendarID`),
  KEY `userID => SPEC` (`userID`),
  CONSTRAINT `userID => SPEC` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `faq` (
  `faqID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ourTitle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ourText` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `otherTitle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `otherText` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `faqIcon` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`faqID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



CREATE TABLE `ideas` (
  `ideaID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userID` int(10) unsigned NOT NULL,
  `creatorID` int(10) unsigned DEFAULT NULL,
  `ideaTitle` varchar(255) NOT NULL,
  `ideaImage` varchar(255) DEFAULT NULL,
  `portfolioID` varchar(10) DEFAULT NULL,
  `similarID` varchar(10) DEFAULT NULL,
  `isModerated` tinyint(4) NOT NULL DEFAULT '0',
  `isHomeIdea` tinyint(4) NOT NULL DEFAULT '0',
  `isArchived` tinyint(3) NOT NULL DEFAULT '0',
  `position` int(10) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ideaID`),
  KEY `userToIdea` (`userID`),
  CONSTRAINT `userToIdea` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2000 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `ideas_categories` (
  `categoryID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `categoryLevel` tinyint(4) NOT NULL DEFAULT '0',
  `categoryParent` int(11) DEFAULT NULL,
  `categoryTitle` varchar(255) NOT NULL,
  `categoryLink` varchar(64) NOT NULL,
  `categoryImage` varchar(255) DEFAULT NULL,
  `position` int(10) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`categoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `ideas_creators` (
  `creatorID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `creatorName` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`creatorID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `ideas_filters` (
  `filterID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `filterTitle` varchar(255) NOT NULL,
  `filterColor` varchar(7) DEFAULT NULL,
  `parentID` int(10) unsigned DEFAULT NULL,
  `position` int(10) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`filterID`),
  KEY `filterRelations` (`parentID`),
  CONSTRAINT `filterRelations` FOREIGN KEY (`parentID`) REFERENCES `ideas_filters` (`filterID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `ideas_properties` (
  `relationID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ideaID` int(10) unsigned NOT NULL,
  `filterID` int(10) unsigned NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`relationID`),
  KEY `filter_idea2` (`ideaID`),
  KEY `rdtgdf` (`filterID`),
  CONSTRAINT `filter_idea2` FOREIGN KEY (`ideaID`) REFERENCES `ideas` (`ideaID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rdtgdf` FOREIGN KEY (`filterID`) REFERENCES `ideas_filters` (`filterID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6049 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `ideas_relation` (
  `relationID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ideaID` int(10) unsigned NOT NULL,
  `categoryID` int(10) unsigned NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`relationID`),
  KEY `category-relation` (`categoryID`),
  KEY `idea-relation` (`ideaID`),
  CONSTRAINT `category-relation` FOREIGN KEY (`categoryID`) REFERENCES `ideas_categories` (`categoryID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `idea-relation` FOREIGN KEY (`ideaID`) REFERENCES `ideas` (`ideaID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2159 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `landings` (
  `landingID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pageURL` varchar(255) NOT NULL,
  `pageTitle` varchar(255) DEFAULT NULL,
  `pageDescription` mediumtext NOT NULL,
  `pageKeywords` mediumtext NOT NULL,
  `headerTitle` varchar(255) NOT NULL,
  `headerText` text NOT NULL,
  `portfolioTitle` varchar(255) DEFAULT NULL,
  `portfolioText` text,
  `youtubeText` text,
  `reviewsText` text NOT NULL,
  `reviewsButtonText` text,
  `reviewsTitle` varchar(255) DEFAULT NULL,
  `licensesTitle` varchar(255) NOT NULL,
  `licensesText` text,
  `instagramText` text,
  `landingImage` varchar(255) DEFAULT NULL,
  `footerTitle` varchar(255) NOT NULL,
  `footerText` text NOT NULL,
  `lat` varchar(64) DEFAULT NULL,
  `lng` varchar(64) DEFAULT NULL,
  `zoom` varchar(64) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`landingID`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `licenses` (
  `licenseID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `licenseTitle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `licenseCover` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`licenseID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `location` (
  `locationID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `locationTitle` varchar(255) NOT NULL,
  `locationCounties` text,
  `categoryID` int(10) unsigned DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`locationID`),
  KEY `location_categoryID` (`categoryID`),
  CONSTRAINT `location_categoryID` FOREIGN KEY (`categoryID`) REFERENCES `location_categories` (`categoryID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `location_categories` (
  `categoryID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `categoryTitle` varchar(255) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`categoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `offices` (
  `officeID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `officeName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `officeTitle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `officeAddress` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lat` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lng` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zoom` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`officeID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `pages` (
  `pageID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pageTitle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pageDescription` mediumtext COLLATE utf8mb4_unicode_ci,
  `pageKeywords` mediumtext COLLATE utf8mb4_unicode_ci,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pageID`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `portfolio` (
  `portfolioID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pageTitle` varchar(255) NOT NULL,
  `pageDescription` mediumtext,
  `pageKeywords` mediumtext,
  `workLink` varchar(255) NOT NULL,
  `workTitle` varchar(255) NOT NULL,
  `workCity` varchar(255) NOT NULL,
  `workAddress` varchar(255) DEFAULT NULL,
  `lat` varchar(255) DEFAULT NULL,
  `lng` varchar(255) DEFAULT NULL,
  `creatorID` int(11) DEFAULT NULL,
  `workSquare` int(10) DEFAULT NULL,
  `workImage` int(10) unsigned DEFAULT NULL,
  `workText` text,
  `isHomeVisible` tinyint(4) NOT NULL DEFAULT '0',
  `position` int(5) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`portfolioID`),
  UNIQUE KEY `uniqueLink` (`workLink`)
) ENGINE=InnoDB AUTO_INCREMENT=274 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `portfolio_creators` (
  `creatorID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `creatorName` varchar(255) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`creatorID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `portfolio_filters` (
  `filterID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `filterTitle` varchar(255) NOT NULL,
  `filterColor` varchar(7) DEFAULT NULL,
  `parentID` int(10) unsigned DEFAULT NULL,
  `position` int(10) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`filterID`),
  KEY `relations` (`parentID`),
  CONSTRAINT `relations` FOREIGN KEY (`parentID`) REFERENCES `portfolio_filters` (`filterID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `portfolio_properties` (
  `relationID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `portfolioID` int(10) unsigned NOT NULL,
  `filterID` int(10) unsigned NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`relationID`),
  KEY `portfolio_relation` (`portfolioID`),
  KEY `filter_relation` (`filterID`),
  CONSTRAINT `filter_relation` FOREIGN KEY (`filterID`) REFERENCES `portfolio_filters` (`filterID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `portfolio_relation` FOREIGN KEY (`portfolioID`) REFERENCES `portfolio` (`portfolioID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2919 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `press` (
  `pressID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pageTitle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pageDescription` text COLLATE utf8mb4_unicode_ci,
  `pageKeywords` text COLLATE utf8mb4_unicode_ci,
  `pressLink` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pressTitle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pressImage` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pressAnnounce` mediumtext COLLATE utf8mb4_unicode_ci,
  `pressText` text COLLATE utf8mb4_unicode_ci,
  `pressMagazine` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pressSource` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` int(10) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pressID`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `price` (
  `priceID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `priceTitle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `priceValue` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `priceCover` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `priceFields` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`priceID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `quotes` (
  `quoteID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pageURL` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pageDescription` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `pageKeywords` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `pageTitle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quoteCover` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quoteText` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `quoteAnnotation` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quotePrice` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quoteMinPrice` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hasContactForm` tinyint(4) NOT NULL DEFAULT '0',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`quoteID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `quotes_requests` (
  `requestID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `firstName` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `square` int(11) NOT NULL,
  `zipCode` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bathroomExist` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `demolitionRequired` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kitchenExist` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isHeightOver` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `referer` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`requestID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `requests` (
  `requestID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `firstName` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `zipCode` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `service` text COLLATE utf8mb4_unicode_ci,
  `message` text COLLATE utf8mb4_unicode_ci,
  `consultationTime` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `developStart` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `budget` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referer` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`requestID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `reviews` (
  `reviewID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pageTitle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pageKeywords` text COLLATE utf8mb4_unicode_ci,
  `pageDescription` text COLLATE utf8mb4_unicode_ci,
  `pageLink` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reviewTitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reviewText` mediumtext COLLATE utf8mb4_unicode_ci,
  `linksText` mediumtext COLLATE utf8mb4_unicode_ci,
  `lat` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lng` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zoom` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facebookLink` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `houzzLink` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `angielListLink` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `porchLink` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `googleLink` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reviewID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `settings` (
  `settingID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `phoneMain` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phoneMD1` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phoneMD2` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phoneVA` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phoneDC` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sendEmail` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `workDays` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `workTime` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `closedTime` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkInstagram` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkFacebook` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkPinterest` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `angiesListLink` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `houzzLink` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `googleLink` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facebookLink` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `porchLink` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `homeAdvisorLink` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `copyrightText` mediumtext COLLATE utf8mb4_unicode_ci,
  `mailHost` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mailPort` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mailSecure` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `authUser` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `authPassword` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emailFrom` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emailSubject` text COLLATE utf8mb4_unicode_ci,
  `adminSubject` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`settingID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `slider` (
  `sliderID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `sliderImage` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` int(3) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`sliderID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `steps` (
  `stepID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `stepTitle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stepDay` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stepCover` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`stepID`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `testimonials` (
  `testimonialID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pageTitle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pageDescription` mediumtext COLLATE utf8mb4_unicode_ci,
  `pageKeywords` mediumtext COLLATE utf8mb4_unicode_ci,
  `testimonialLink` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `testimonialAuthor` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `testimonialImage` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `testimonialAnnounce` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `testimonialText` text COLLATE utf8mb4_unicode_ci,
  `testimonialState` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `testimonialRating` tinyint(4) DEFAULT NULL,
  `portfolioID` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` int(10) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`testimonialID`),
  UNIQUE KEY `Unique link` (`testimonialLink`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `text_content` (
  `fieldID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pageID` int(10) unsigned NOT NULL,
  `fieldTitle` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fieldContent` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`fieldID`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tips` (
  `tipID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pageTitle` varchar(255) NOT NULL,
  `pageDescription` mediumtext,
  `pageKeywords` mediumtext,
  `tipLink` varchar(255) NOT NULL,
  `tipTitle` varchar(255) NOT NULL,
  `tipImage` varchar(255) DEFAULT NULL,
  `tipAnnounce` varchar(255) DEFAULT NULL,
  `tipText` text,
  `categoryID` int(11) DEFAULT NULL,
  `portfolioID` varchar(10) DEFAULT NULL,
  `position` int(10) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`tipID`),
  UNIQUE KEY `Unique link` (`tipLink`)
) ENGINE=InnoDB AUTO_INCREMENT=166 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `tips_categories` (
  `categoryID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `categoryName` varchar(255) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`categoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `upload` (
  `uploadID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uploadImage` varchar(255) DEFAULT NULL,
  `imageWidth` varchar(4) DEFAULT NULL,
  `imageHeight` varchar(4) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`uploadID`)
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `users` (
  `userID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `googleID` varchar(64) DEFAULT NULL,
  `facebookID` varchar(64) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `surname` varchar(64) DEFAULT NULL,
  `mail` varchar(64) DEFAULT NULL,
  `username` varchar(64) DEFAULT NULL,
  `password` varchar(128) DEFAULT NULL,
  `salt` varchar(16) DEFAULT NULL,
  `avatarImage` varchar(255) DEFAULT NULL,
  `isAdmin` tinyint(2) DEFAULT '0',
  `isSpec` tinyint(2) DEFAULT '0',
  `membership` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `zip_codes` (
  `codeID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `link` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codes` mediumtext COLLATE utf8mb4_unicode_ci,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`codeID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;