DROP TABLE IF EXISTS votes;

CREATE TABLE votes (
	breed VARCHAR(255) PRIMARY KEY,
  	example_image VARCHAR(255),
  	vote_count INT
);