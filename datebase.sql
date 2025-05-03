DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

CREATE TABLE "Users" (
    UID SERIAL PRIMARY KEY,
    username VARCHAR(16) UNIQUE NOT NULL,
    password VARCHAR(64) NOT NULL,
    email VARCHAR(64) UNIQUE NOT NULL,
    racha_actual INT DEFAULT 0,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Cars" (
    car_id SERIAL PRIMARY KEY,
    model VARCHAR(64) NOT NULL,
    year INT NOT NULL,
    liscense_plate VARCHAR(16) UNIQUE NOT NULL,
    owner_name VARCHAR REFERENCES "Users" (username) ON DELETE CASCADE,
    color VARCHAR(16) NOT NULL
);

--CREATE TABLE Car_Characteristics ();

CREATE TABLE "Levels" (
    level_id SERIAL PRIMARY KEY,
    title VARCHAR(64) NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE "Missions" (
    mission_id INT,
    level_id INT REFERENCES "Levels" (level_id) ON DELETE CASCADE,
    title VARCHAR(128) NOT NULL, --Que fa la missio
    description TEXT NOT NULL, -- Descripcio / storytelling
    is_unlocked BOOLEAN DEFAULT FALSE, -- Si la missio esta desbloquejada
    PRIMARY KEY (level_id, mission_id)
);

CREATE TABLE "UserProgress" (
    PID SERIAL PRIMARY KEY,
    UID INT REFERENCES "Users" (UID) ON DELETE CASCADE,
    mission_id INT,
    level_id INT,
    FOREIGN KEY (mission_id, level_id) REFERENCES "Missions" (level_id, mission_id),
    FOREIGN KEY (level_id) REFERENCES "Levels" (level_id)
);

CREATE TABLE "Images" (
    image_id SERIAL PRIMARY KEY,
    url_image TEXT NOT NULL
);




--Taula amb totes les caracteristiques del cotxe (nom, descripcio, imatge)