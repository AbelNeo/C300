const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const bodyParser = require('body-parser');
const app = express();



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'C300'
// });
// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to MySQL:', err);
//         return;
//     }
//     console.log('Connected to MySQL database');
// });

import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";

async function getPosts() {
  const querySnapshot = await getDocs(collection(db, "posts"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
}

getPosts();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });



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


app.set('view engine', 'ejs');


app.use(express.static('public'));


app.use('/images/', express.static('images'));


app.use(express.urlencoded({
    extended: false
}));

// Routes for cart
app.get('/cart/:id', (req, res) => {
    const Order_ItemID = req.params.id
    const sql = 'SELECT * FROM cart_table WHERE Order_ItemID = ?';

    connection.query(sql, (error, results) => {
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


// Routes
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


app.get('/product/:id', function (req, res) {
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

app.get('/addProduct', (req, res) => {
    res.render('addProduct');
});

app.get('/product', (req, res) => {
    res.redirect('/addProduct');
});

app.post('/addProduct', upload.single('image'), (req, res) => {

    const { name, Description, Category, Price, Stock } = req.body;
    let image;
    if (req.file) {
        image = req.file.filename;
    } else {
        image = null;
    }

    const sql = 'INSERT INTO product_table (name, Description,Category, Price,Stock, image) VALUES (?,?,?,?,?,?)';

    connection.query(sql, [name, Description, Category, Price, Stock, image], (error, results) => {
        if (error) {

            console.error('Error adding product:', error);
            res.status(500).send('Error adding product');
        } else {
            res.redirect('/');
        }
    });
});


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

app.post('/editProduct/:id', upload.single('image'), (req, res) => {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



