import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase-config';

async function uploadPlayerPhoto(playerId, file) {
  try {
    // 1. Define storage path
    const storageRef = ref(storage, `player_photos/${playerId}/${file.name}`);
    
    // 2. Upload file
    await uploadBytes(storageRef, file);
    
    // 3. Get public URL
    const photoURL = await getDownloadURL(storageRef);
    
    return {
      success: true,
      photoURL: photoURL,
      photoPath: file.name
    };
    
  } catch (error) {
    console.error("Upload failed:", error);
    return { success: false };
  }
}

import { initializeApp } from "firebase/app";
    import { getDatabase, ref, push, onValue, update, remove } from "firebase/database";

    // REPLACE these values with your Firebase project config
  const firebaseConfig = {
    apiKey: "AIzaSyDZVSQAwB1YnKv6Pr_5kbsjvUz074mDsQ0",
    authDomain: "football-club-management-3c136.firebaseapp.com",
    projectId: "football-club-management-3c136",
    storageBucket: "football-club-management-3c136.appspot.com",
    messagingSenderId: "388394869174",
    appId: "1:388394869174:web:ec8f93ab8fb685e9846117"
  };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const itemsRef = ref(db, 'items');

    const form = document.getElementById('itemForm');
    const table = document.getElementById('itemsTable');
    const tbody = table.querySelector('tbody');

    // Add new item to Firebase
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const description = form.description.value.trim();
      const price = parseFloat(form.price.value).toFixed(2);
      const stock = parseInt(form.stock.value);
      const files = form.image.files;

      if (!name || !description || isNaN(price) || isNaN(stock)) {
        alert("Please fill out all fields correctly.");
        return;
      }

      // Read all images as base64 strings
      const imagePromises = Array.from(files).map(file => {
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = e => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      });

      const images = await Promise.all(imagePromises);

      const newItem = { name, description, price, stock, images };
      push(itemsRef, newItem);

      form.reset();
    });

    // Render items from Firebase realtime
    onValue(itemsRef, (snapshot) => {
      const items = snapshot.val();
      tbody.innerHTML = '';
      if (!items) {
        table.style.display = 'none';
        return;
      }
      Object.entries(items).forEach(([key, item]) => {
        const row = document.createElement('tr');

        // Images cell - show all images
        const imageCell = document.createElement('td');
        if (item.images && item.images.length > 0) {
          item.images.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            imageCell.appendChild(img);
          });
        } else {
          imageCell.textContent = 'No image';
        }

        // Name cell
        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;

        // Description cell
        const descCell = document.createElement('td');
        descCell.textContent = item.description;

        // Price cell (editable)
        const priceCell = document.createElement('td');
        priceCell.innerHTML = `
          <span class="price-text">${item.price}</span>
          <input type="number" step="0.01" class="price-edit" value="${item.price}" style="display:none; width:60px;">
        `;

        // Stock cell (editable)
        const stockCell = document.createElement('td');
        stockCell.innerHTML = `
          <span class="stock-text">${item.stock}</span>
          <input type="number" class="stock-edit" value="${item.stock}" style="display:none; width:60px;">
        `;

        // Buy cell (quantity input + buy button)
        const buyCell = document.createElement('td');
        const qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.min = 1;
        qtyInput.value = 1;

        const buyBtn = document.createElement('button');
        buyBtn.textContent = 'Buy';
        buyBtn.className = 'buy-button';

        if (item.stock <= 0) {
          buyBtn.disabled = true;
          qtyInput.disabled = true;
        }

        buyBtn.addEventListener('click', () => {
          const qty = parseInt(qtyInput.value);
          if (isNaN(qty) || qty <= 0) {
            alert("Please enter a valid quantity.");
            return;
          }
          if (qty > item.stock) {
            alert(`Only ${item.stock} in stock.`);
            return;
          }
          update(ref(db, `items/${key}`), { stock: item.stock - qty });
        });

        const buySection = document.createElement('div');
        buySection.className = 'buy-section';
        buySection.appendChild(qtyInput);
        buySection.appendChild(buyBtn);
        buyCell.appendChild(buySection);

        // Actions cell (edit + delete)
        const actionCell = document.createElement('td');
        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'edit-btn';

        editBtn.addEventListener('click', () => {
          const editing = editBtn.textContent === 'Save';

          const priceText = priceCell.querySelector('.price-text');
          const priceInput = priceCell.querySelector('.price-edit');
          const stockText = stockCell.querySelector('.stock-text');
          const stockInput = stockCell.querySelector('.stock-edit');

          if (!editing) {
            // Switch to edit mode
            priceText.style.display = 'none';
            priceInput.style.display = 'inline-block';
            stockText.style.display = 'none';
            stockInput.style.display = 'inline-block';
            editBtn.textContent = 'Save';
            editBtn.className = 'save-btn';
          } else {
            // Save changes
            const newPrice = parseFloat(priceInput.value).toFixed(2);
            const newStock = parseInt(stockInput.value);
            if (isNaN(newPrice) || isNaN(newStock) || newPrice < 0 || newStock < 0) {
              alert("Please enter valid price and stock values.");
              return;
            }
            update(ref(db, `items/${key}`), { price: newPrice, stock: newStock });
            // Back to display mode handled by Firebase listener refresh
          }
        });

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => {
          if (confirm("Are you sure you want to delete this item?")) {
            remove(ref(db, `items/${key}`));
          }
        });

        actionButtons.appendChild(editBtn);
        actionButtons.appendChild(deleteBtn);
        actionCell.appendChild(actionButtons);

        // Append all cells to row
        row.appendChild(imageCell);
        row.appendChild(nameCell);
        row.appendChild(descCell);
        row.appendChild(priceCell);
        row.appendChild(stockCell);
        row.appendChild(buyCell);
        row.appendChild(actionCell);

        tbody.appendChild(row);
      });

      table.style.display = Object.keys(items).length > 0 ? 'table' : 'none';
    });