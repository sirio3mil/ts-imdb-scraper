/* Replace with your SQL commands */
DROP INDEX [UK_tape_country_certification] ON [dbo].[TapeCertification];

CREATE UNIQUE NONCLUSTERED INDEX [UK_tape_country_certification] ON [dbo].[TapeCertification]
(
	[tapeId] ASC,
	[countryId] ASC
)
INCLUDE([tapeCertificationId],[certification]) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY];
