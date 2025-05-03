TRUNCATE TABLE "Images" CASCADE;
TRUNCATE TABLE "UserProgress" CASCADE;
TRUNCATE TABLE "Missions" CASCADE;
TRUNCATE TABLE "Levels" CASCADE;
TRUNCATE TABLE "Cars" CASCADE;
TRUNCATE TABLE "Users" CASCADE;

-- Users
INSERT INTO "Users" (username, password, email) VALUES
    ('a', 'a', 'a'),
    ('b', 'b', 'b'),
    ('c', 'c', 'c');

-- Cars
INSERT INTO "Cars" (model, year, liscense_plate, owner_name, color) VALUES
    ('Tavascan', 2023, '1234ABC', 'a', 'red'),
    ('Tavascan', 2025, '1234DEF', 'a', 'blue'),
    ('Tavascan', 2023, '1234GHI', 'c', 'green');

-- Levels
INSERT INTO "Levels" (title, description) VALUES
    ('Level 1: First steps', 'Let''s start the adventure, but first... we need to start the car, unleash all its power, and let it take off!'),
    ('Level 2: Create profile', 'Now that we have the car, let''s create a profile to start the adventure!'),
    ('Level 3: Info panel', 'Now we have everything ready, but let''s improve our experience.'),
    ('Level 4: Stearing wheel', 'Wow, so much functionality! Let''s learn how to use the steering wheel!');

-- Missions
INSERT INTO "Missions" (mission_id, level_id, title, description) VALUES
    (1, 1, 'Start the car', 'Let''s start the car and unleash all its power!'),
    (2, 1, 'Move the car', 'Ok! All ready, the engine is running, but... we need to move the car!'),
    (3, 1, 'Charghing', 'We need to charge the car, we don''t want to run out of battery!'),
    (1, 2, 'Look arround', 'Let''s set our mirrors and look around!'),
    (2, 2, 'Seat settings', 'Let''s set the seat settings for our confort!'),
    (3, 2, 'Drive profile', 'Which type of driving fits you best?, let''s set it up!'),
    (1, 3, 'Info panel', 'Which are the principal functions of the info panel? How can we use it?'),
    (2, 3, 'Navigation', 'Let''s set the navigation system!'),
    (3, 3, 'Music', 'Let''s set the music system!'),
    (4, 3, 'Climate', 'Let''s set the climate system!'),
    (5, 3, 'Vehicle status', 'Let''s check the vehicle status!'),
    (1, 4, 'Steering wheel', 'Let''s learn how to use the steering wheel!'),
    (2, 4, 'Driving modes', 'Let''s learn how to use the driving modes!'),
    (3, 4, 'Driving assistance', 'Let''s learn how to use the driving assistance!'),
    (4, 4, 'Parking assistance', 'Let''s learn how to use the parking assistance!'),
    (5, 4, 'Cruise control', 'Let''s learn how to use the cruise control!'),
    (6, 4, 'Lane assist', 'Let''s learn how to use the lane assist!');
-- UserProgress


--Images
INSERT INTO "Images" (url_image) VALUES
    ('https://xlelknonfenpcsdiyglf.supabase.co/storage/v1/object/public/images//Captura%20de%20pantalla%20de%202025-03-21%2010-11-05.png');