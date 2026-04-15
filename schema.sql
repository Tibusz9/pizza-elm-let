CREATE TABLE IF NOT EXISTS pizzas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nev VARCHAR(120) NOT NULL,
  kategorianev VARCHAR(60) NOT NULL,
  vegetarianus TINYINT(1) NOT NULL DEFAULT 0
) CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;

INSERT INTO pizzas (nev, kategorianev, vegetarianus) VALUES
('Áfonyás', 'király', 0),
('Babos', 'lovag', 0),
('Barbecue chicken', 'lovag', 0),
('Csupa sajt', 'lovag', 1),
('Gombás', 'apród', 1),
('Kívánság', 'lovag', 1),
('Sajtos', 'apród', 1),
('Son-go-ku', 'főnemes', 1),
('Vega', 'lovag', 1),
('Zöldike', 'főnemes', 1);
