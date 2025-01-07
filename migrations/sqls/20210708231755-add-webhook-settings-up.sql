ALTER TABLE settings
ADD getOnlineQuoteWebhook varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
ADD contactUsWebhook varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL; 