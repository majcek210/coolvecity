CREATE TABLE guilds (
    id VARCHAR(20) PRIMARY KEY,
    log_channel_id VARCHAR(20),
    
    mod_role_id VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);