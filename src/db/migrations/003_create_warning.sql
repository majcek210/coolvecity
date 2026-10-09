CREATE TABLE warnings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guild_id VARCHAR(20) NOT NULL,
    user_id VARCHAR(20) NOT NULL,
    moderator_id VARCHAR(20) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (guild_id) REFERENCES guilds(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (moderator_id) REFERENCES users(id)
);