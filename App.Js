const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Your Firebase key

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'your-project-id.appspot.com' // Replace with your bucket
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));
app.use('/images/', express.static('images'));
app.use(express.urlencoded({ extended: false }));

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'c237_snackzillaapp'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Multer Configuration for Local Uploads (used for product images)
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const productUpload = multer({ storage: productStorage });

// Multer Configuration for Firebase Uploads (used for media uploads)
const firebaseUpload = multer({ storage: multer.memoryStorage() });

// ==================== MySQL Routes (Products/Cart) ====================

// Home page - show products
app.get('/', (req, res) => {
  const sql = 'SELECT * FROM product_table';

  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.status(500).send('Error Retrieving products');
    }
    res.render('index', { products: results });
  });
});

// Upload page
app.get('/upload-media', (req, res) => {
  res.render('upload-media');
});

// Product details
app.get('/product/:id', (req, res) => {
  const productID = req.params.id;
  const sql = 'SELECT * FROM product_table WHERE productId = ?';
  connection.query(sql, [productID], (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.status(500).send('Error Retrieving product by ID');
    }
    if (results.length > 0) {
      res.render('product', { product: results[0] });
    } else {
      res.status(404).send('Product not found');
    }
  });
});

// Add product form
app.get('/addProduct', (req, res) => {
  res.render('addProduct');
});

// Handle product creation
app.post('/addProduct', productUpload.single('image'), (req, res) => {
  const { name, Description, Category, Price, Stock } = req.body;
  let image;
  if (req.file) {
    image = req.file.filename;
  } else {
    image = null;
  }

  const sql = 'INSERT INTO product_table (name, Description, Category, Price, Stock, image) VALUES (?,?,?,?,?,?)';
  connection.query(sql, [name, Description, Category, Price, Stock, image], (error, results) => {
    if (error) {
      console.error('Error adding product:', error);
      res.status(500).send('Error adding product');
    } else {
      res.redirect('/');
    }
  });
});

// Edit product form
app.get('/editProduct/:id', (req, res) => {
  const productID = req.params.id;
  const sql = 'SELECT * FROM product_table WHERE productId = ?';
  connection.query(sql, [productID], (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.status(500).send('Error retrieving product by ID');
    }
    if (results.length > 0) {
      res.render('editProduct', { product: results[0] });
    } else {
      res.status(404).send('Product not found');
    }
  });
});

// Handle product update
app.post('/editProduct/:id', productUpload.single('image'), (req, res) => {
  const productID = req.params.id;
  const { name, Description, Category, Price, Stock } = req.body;
  let image = req.body.currentImage;
  if (req.file) {
    image = req.file.filename;
  }
  const sql = 'UPDATE product_table SET name = ?, Description = ?, Category = ?, Price = ?, Stock = ?, image =? WHERE productID = ?';
  connection.query(sql, [name, Description, Category, Price, Stock, image, productID], (error, results) => {
    if (error) {
      console.error('Error updating product:', error);
      return res.status(500).send('Error updating product');
    } else {
      res.redirect('/');
    }
  });
});

// Delete product
app.get('/deleteProduct/:id', (req, res) => {
  const productID = req.params.id;
  const sql = 'DELETE FROM product_table WHERE productID = ?';
  connection.query(sql, [productID], (error, results) => {
    if (error) {
      console.error('Error deleting product:', error);
      return res.status(500).send('Error deleting product');
    } else {
      res.redirect('/');
    }
  });
});

// Cart routes
app.get('/cart/:id', (req, res) => {
  const Order_ItemID = req.params.id;
  const sql = 'SELECT * FROM cart_table WHERE Order_ItemID = ?';
  connection.query(sql, [Order_ItemID], (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.status(500).send('Error Retrieving items from cart');
    }
    res.render('index_cart', { products: results });
  });
});

app.post('/cart/:id', (req, res) => {
  const productId = req.params.id;
  const { Order_ItemID, OrderID, productID, Quantity, Price } = req.body;
  const sql = 'SELECT * FROM cart_table WHERE Order_ItemID = ?';
  connection.query(sql, [productID], (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.status(500).send('Error Retrieving item by ID');
    }
    if (results.length > 0) {
      res.render('index_cart', { products: results });
      const sql = 'INSERT INTO cart_table (Order_ItemID, OrderID, productID, Quantity,Price) VALUES (?,?,?,?,?)';
      connection.query(sql, [Order_ItemID, OrderID, productID, Quantity, Price], (error, results) => {
        if (error) {
          console.error('Error adding item to cart:', error);
          res.status(500).send('Error adding item to cart');
        }
        res.redirect('/cart');
      });
    } else {
      res.status(404).send('Product not found');
    }
  });
});

// User registration
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const { UserID, Username, Email, Password, Address, Full_Name } = req.body;
  const sql = 'INSERT INTO registration_table (UserID, Username, Email, Password, Address, Full_Name) VALUES (?,?,?,?,?,?)';
  connection.query(sql, [UserID, Username, Email, Password, Address, Full_Name], (error, results) => {
    if (error) {
      console.error('Error registering user:', error);
      res.status(500).send('Error registering user');
    } else {
      res.redirect('/');
    }
  });
});

// ==================== Firebase File Upload Routes ====================

// Upload single file to Firebase
app.post('/upload-media', firebaseUpload.single('media'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Generate a unique filename
    const fileName = `${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(fileName);

    // Upload to Firebase Storage
    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    // Get the public URL
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    // Save metadata to Firestore
    const fileRef = await db.collection('files').add({
      originalName: req.file.originalname,
      fileName: fileName,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: url,
      uploadDate: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.redirect('/upload-success');
  } catch (error) {
    console.error(error);
    res.status(500).render('upload-error', { error: error.message });
  }
});

// Upload success page
app.get('/upload-success', (req, res) => {
  res.render('upload-success');
});

// Get all files from Firestore
app.get('/files', async (req, res) => {
  try {
    const snapshot = await db.collection('files').get();
    const files = [];
    snapshot.forEach(doc => {
      files.push({ id: doc.id, ...doc.data() });
    });
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// Delete a file from Storage & Firestore
app.delete('/files/:id', async (req, res) => {
  try {
    const doc = await db.collection('files').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileData = doc.data();
    const file = bucket.file(fileData.fileName);

    // Delete from Firebase Storage
    await file.delete();

    // Delete from Firestore
    await db.collection('files').doc(req.params.id).delete();

    res.json({ message: 'File deleted successfully', deletedFile: fileData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// ==================== Start Server ====================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MySQL Product Management: http://localhost:${PORT}`);
  console.log(`Firebase File Upload: POST http://localhost:${PORT}/upload-media`);
});