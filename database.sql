CREATE DATABASE IF NOT EXISTS flower_shop_db;
USE flower_shop_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user','admin') DEFAULT 'user',
  address TEXT,
  phone VARCHAR(20),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  category_id INT,
  image_url VARCHAR(500),
  featured TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  shipping_address TEXT NOT NULL,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Admin user (password will be fixed on startup)
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@flowershop.com', '$2b$10$placeholder', 'admin');

INSERT INTO categories (name, description) VALUES
('Bouquets', 'Hand-crafted flower bouquets'),
('Single Flowers', 'Individual fresh flowers'),
('Arrangements', 'Decorative flower arrangements'),
('Plants', 'Indoor and outdoor plants'),
('Gift Sets', 'Flower and gift combinations');

INSERT INTO products (name, description, price, stock, category_id, image_url, featured) VALUES
('Red Rose Bouquet', 'A stunning bouquet of 12 fresh red roses perfect for romance', 850.00, 25, 1, 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=400', 1),
('Sunflower Delight', 'Bright and cheerful sunflower bouquet with 6 stems', 650.00, 30, 1, 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400', 1),
('Pink Lily Arrangement', 'Elegant pink lily arrangement in a ceramic vase', 1200.00, 15, 3, 'https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=400', 1),
('White Tulips', 'Fresh white tulips bouquet with 10 stems', 750.00, 20, 1, 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400', 0),
('Single Red Rose', 'One perfect fresh red rose', 150.00, 50, 2, 'https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=400', 0),
('Orchid Plant', 'Beautiful purple orchid plant in decorative pot', 1500.00, 10, 4, 'https://images.unsplash.com/photo-1566907225472-514215c9e6a4?w=400', 1),
('Mixed Wildflower Bouquet', 'Colorful mix of seasonal wildflowers', 550.00, 35, 1, 'https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=400', 0),
('Lavender Bundle', 'Fragrant dried lavender bundle', 350.00, 40, 2, 'https://images.unsplash.com/photo-1499125562588-29fb8a56b5d5?w=400', 0),
('Flower Gift Box', 'Assorted flowers in a beautiful gift box with ribbon', 1800.00, 12, 5, 'https://images.unsplash.com/photo-1487530811015-780be76e2d3b?w=400', 1),
('Succulent Collection', 'Set of 3 mini succulents in cute pots', 950.00, 20, 4, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400', 0);
