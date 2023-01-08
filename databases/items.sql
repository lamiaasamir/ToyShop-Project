--- create dummy database
CREATE DATABASE IF NOT EXISTS `shop`;

--- use dummy database
USE `shop`;

--- create table
CREATE TABLE IF NOT EXISTS `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` decimal(6,2) NOT NULL,
  `sale_price` decimal(6,2) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

--- insert dummy toy items (e.g. for a toy shop)
INSERT INTO `items` (`name`, `brand`, `description`, `price`, `sale_price`,`image`) VALUES
('Teddy Bear', 'LotFancy', 'A cute teddy bear', 14.99, 14.00, 'teddy-bear.png'),
('Doll', 'Barbie', 'A sweet doll', 9.48, 6.00, 'doll.png'),
('Toy Car 1', 'Hot Wheels', 'A cute datsun toy car', 57.14, 50.00, 'toy-car-1.png'),
('Toy Car 2', 'Hot Wheels', 'A cute ford toy truck', 39.99, 34.00, 'toy-car-2.png'),
('Toy Car 3', 'Hot Wheels', 'A cute mercedes toy racecar', 54.74,50.00, 'toy-car-3.png'),
('Lego Classics', 'Lego', 'A cute lego monsters set', 9.97, NULL,  'lego-monsters.png'),
('Lego Dots', 'Lego', 'A cute lego dots set', 17.94, 15.00, 'lego-dots.png'),
('Sweet Jumperoo', 'Fisher-Price', 'A sweet ride jumperoo', 124.99,110.00, 'ride-jumperoo.png'),
('Musical Keyboard', 'CoComelon', 'A sweet musical keyboard', 26.99, 20.00, 'musical-keyboard.png'),
('T-Shirt & Shorts Set 1', 'CoComelon', 'A sweet t-shirt & shorts set', 18.99, 14.99, 'tshirt-shorts-1.png'),
('T-Shirt & Shorts Set 2', 'CoComelon', 'A sweet t-shirt & shorts set', 18.99,NULL, 'tshirt-shorts-2.png'),
('T-Shirt & Shorts Set 3', 'CoComelon', 'A sweet t-shirt & shorts set', 18.99, NULL, 'tshirt-shorts-3.png'),
('N-Strike Blaster', 'Nerf', 'A powerful blaster gun', 34.99, NULL ,'strike-blaster.png'),
('Baby Mickey Mouse', 'Disney', 'A sweet baby Mickey plush', 18.88, NULL, 'baby-mickey.png'),
('Baby Minnie Mouse', 'Disney', 'A sweet baby Minnie plush', 51.23,47.00, 'baby-minnie.png'),
('3D Toddler Scooter', 'Bluey', 'A fantastic 3-wheel scooter', 29.00, NULL,'toddler-scooter.png'),
('Cottage Playhouse', 'Litte Tikes', 'A fancy blue playhouse', 139.99,NULL, 'cottage-playhouse.png'),
('2-in-1 Motor/Wood Shop', 'Little Tikes', 'A realistic motor/wood shop', 99.00, NULL,'2x1-motor-shop.png'),
('UNO Collector Tin', 'UNO', 'A premium quality uno set', 49.39,NULL, 'uno-phase10-snappy.png'),
('Razor MX350 Bike', 'Razor', 'A powerful electric bike', 328.00, NULL,'mx350-bike.png');


-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE  IF NOT EXISTS `cart` (
  `product_id` int(11) NOT NULL PRIMARY KEY,
  `quantity` int(11) NOT NULL DEFAULT 1
  FOREIGN KEY (`product_id`) REFERENCES `items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) 

