ALTER TABLE warnings ADD COLUMN number INT NULL;

UPDATE warnings w
JOIN (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY guild_id ORDER BY id) AS rn
    FROM warnings
) ranked ON ranked.id = w.id
SET w.number = ranked.rn;

ALTER TABLE warnings
    MODIFY COLUMN number INT NOT NULL,
    ADD UNIQUE KEY uq_warnings_guild_number (guild_id, number);