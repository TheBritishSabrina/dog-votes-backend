DROP TABLE IF EXISTS votes;

CREATE TABLE votes (
	breed VARCHAR(255) PRIMARY KEY,
  	example_image VARCHAR(255),
  	vote_count INT
);

INSERT INTO votes (breed, example_image, vote_count) 
VALUES ('puggle', 'https://images.dog.ceo/breeds/puggle/IMG_070809.jpg', 1);

INSERT INTO votes (breed, example_image, vote_count) 
VALUES ('terrier-lakeland', 'https://images.dog.ceo/breeds/terrier-lakeland/n02095570_3323.jpg', 2);
