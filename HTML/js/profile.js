// // document.querySelectorAll('.dropdown-toggle').forEach(button => {
// //     button.addEventListener('click', () => {
// //         const parent = button.closest('.dropdown');
// //         parent.classList.toggle('open');
// //     });
// // });
// // document.querySelectorAll('.dropdown-toggle-settings').forEach(button => {
// //     button.addEventListener('click', () => {
// //         const parent = button.closest('.dropdown');
// //         parent.classList.toggle('open');
// //     });
// // });

// // document.querySelector('.dropdown-toggle-settings').addEventListener('click', function() {
// //   this.nextElementSibling.classList.toggle('open');
// // });

// // Toggle panel on click
// document.querySelectorAll('.dropdown-toggle').forEach(button => {
//     button.addEventListener('click', function(e) {
//         e.stopPropagation();
//         const dropdown = this.closest('.dropdown');
//         dropdown.classList.toggle('active');
        
//         // Close other open panels
//         document.querySelectorAll('.dropdown').forEach(otherDropdown => {
//             if (otherDropdown !== dropdown) {
//                 otherDropdown.classList.remove('active');
//             }
//         });
//     });
// });

// // Close panel when clicking close button
// document.querySelectorAll('.close-panel').forEach(button => {
//     button.addEventListener('click', function(e) {
//         e.stopPropagation();
//         this.closest('.dropdown').classList.remove('active');
//     });
// });

// // Close panel when clicking outside
// document.addEventListener('click', function() {
//     document.querySelectorAll('.dropdown').forEach(dropdown => {
//         dropdown.classList.remove('active');
//     });
// });









// Store panel toggle
document.querySelector('.dropdown-toggle-store')?.addEventListener('click', () => {
  document.getElementById('storePanel')?.classList.toggle('active');
});
document.querySelector('.close-panel.store')?.addEventListener('click', () => {
  document.getElementById('storePanel')?.classList.remove('active');
});

// Settings panel toggle
document.querySelector('.dropdown-toggle-settings')?.addEventListener('click', () => {
  document.getElementById('settingsPanel')?.classList.toggle('active');
});
document.querySelector('.close-panel.settings')?.addEventListener('click', () => {
  document.getElementById('settingsPanel')?.classList.remove('active');
});

// Player panel toggle
document.querySelector('.dropdown-toggle-player')?.addEventListener('click', () => {
  document.getElementById('playerPanel')?.classList.toggle('active');
});
document.querySelector('.close-panel.player')?.addEventListener('click', () => {
  document.getElementById('playerPanel')?.classList.remove('active');
});


import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', initializeAdminFeatures);

async function initializeAdminFeatures() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(db, "Accounts", user.uid));
      
      if (userDoc.exists() && userDoc.data().isAdmin) {
        // User is admin - show navigation
        showAdminNavigation();
        updateProfileDisplay(user, true);
        initializeDropdowns(); // Initialize dropdown functionality
      } else {
        // User is not admin
        updateProfileDisplay(user, false);
        removeAdminNavigation();
      }
    } else {
      // No user logged in
      updateProfileDisplay(null, false);
      removeAdminNavigation();
    }
  });
}

function updateProfileDisplay(user, isAdmin) {
  const accountName = document.getElementById('account-name');
  const accountType = document.getElementById('account-type');
  
  if (user) {
    accountName.textContent = `Welcome, ${user.displayName || 'User'}`;
    accountType.textContent = isAdmin ? 'Administrator' : 'Premium Member';
    accountType.style.color = isAdmin ? '#800000' : '#800000';
  } else {
    accountName.textContent = 'Welcome, Guest';
    accountType.textContent = 'Sign in for premium features';
    accountType.style.color = '#666';
  }
}

function showAdminNavigation() {
  const navContainer = document.getElementById('adminNavContainer');
  if (!navContainer) return;

  navContainer.innerHTML = `
    <nav class="profileNavigation">
      <ul class="pageTabs">
        <li class="pageTabs_Item">
          <button class="pageTabs_link dropdown-toggle-store">Store</button>
        </li>
        <li class="pageTabs_Item">
          <button class="pageTabs_link dropdown-toggle-player">Players</button>
        </li>
        <li class="pageTabs_Item">
          <button class="pageTabs_link dropdown-toggle-settings">Settings</button>
        </li>
      </ul>
      
      <div class="dropdown-panel" id="storePanel">
        <div class="panel-header">
          <h4>Store Panel</h4>
        </div>
        <div class="panel-content">
          <a href="itemcreator.html" class="panel-item"><i class="icon-create"></i><span>Item Creator</span></a>
          <a href="edit-item.html" class="panel-item"><i class="icon-edit"></i><span>Edit Item</span></a>
          <a href="manage-items.html" class="panel-item"><i class="icon-manage"></i><span>Manage Items</span></a>
        </div>
      </div>
      
      <div class="dropdown-panel" id="settingsPanel">
        <div class="panel-header">
          <h4>Settings Panel</h4>
        </div>
        <div class="panel-content">
          <a href="delete-account.html" class="panel-item"><i class="icon-password"></i><span>Account Settings</span></a>
        </div>
      </div>
      
      <div class="dropdown-panel" id="playerPanel">
        <div class="panel-header">
          <h4>Player Panel</h4>
        </div>
        <div class="panel-content">
          <a href="manage-player.html" class="panel-item"><i class="icon-password"></i><span>Manage Players</span></a>
        </div>
      </div>
    </nav>
  `;
}

function removeAdminNavigation() {
  const navContainer = document.getElementById('adminNavContainer');
  if (navContainer) {
    navContainer.innerHTML = '';
  }
}

function initializeDropdowns() {
  // Close all panels when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.pageTabs_link') && !e.target.closest('.dropdown-panel')) {
      document.querySelectorAll('.dropdown-panel').forEach(panel => {
        panel.classList.remove('active');
      });
    }
  });

  // Store dropdown
  document.querySelectorAll('.dropdown-toggle-store').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const panel = document.getElementById('storePanel');
      panel.classList.toggle('active');
      
      // Close other panels
      document.querySelectorAll('.dropdown-panel:not(#storePanel)').forEach(p => {
        p.classList.remove('active');
      });
    });
  });
  
  // Players dropdown
  document.querySelectorAll('.dropdown-toggle-player').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const panel = document.getElementById('playerPanel');
      panel.classList.toggle('active');
      
      // Close other panels
      document.querySelectorAll('.dropdown-panel:not(#playerPanel)').forEach(p => {
        p.classList.remove('active');
      });
    });
  });
  
  // Settings dropdown
  document.querySelectorAll('.dropdown-toggle-settings').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const panel = document.getElementById('settingsPanel');
      panel.classList.toggle('active');
      
      // Close other panels
      document.querySelectorAll('.dropdown-panel:not(#settingsPanel)').forEach(p => {
        p.classList.remove('active');
      });
    });
  });
}



//UNCOMMENT THIS IF YOU WANT TO USE FIREBASE AUTHENTICATION

// import { auth, db } from './firebase.js';
// import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// // Initialize admin navigation check
// document.addEventListener('DOMContentLoaded', () => {
//   checkAdminStatus();
// });

// async function checkAdminStatus() {
//   onAuthStateChanged(auth, async (user) => {
//     if (user) {
//       // Get user document from Firestore
//       const userDoc = await getDoc(doc(db, "Accounts", user.uid));
      
//       if (userDoc.exists() && userDoc.data().isAdmin) {
//         // User is admin - show navigation
//         showAdminNavigation();
//         updateProfileDisplay(user, true);
//       } else {
//         // User is not admin
//         updateProfileDisplay(user, false);
//       }
//     } else {
//       // No user logged in
//       updateProfileDisplay(null, false);
//     }
//   });
// }

// function updateProfileDisplay(user, isAdmin) {
//   const accountName = document.getElementById('account-name');
//   const accountType = document.getElementById('account-type');
  
//   if (user) {
//     accountName.textContent = `Welcome, ${user.displayName || 'User'}`;
//     accountType.textContent = isAdmin ? 'Administrator' : 'Premium Member';
//     accountType.style.color = isAdmin ? '#800000' : '#800000';
//   } else {
//     accountName.textContent = 'Welcome, Guest';
//     accountType.textContent = 'Sign in for premium features';
//     accountType.style.color = '#666';
//   }
// }

// function showAdminNavigation() {
//   const navContainer = document.getElementById('adminNavContainer');
//   if (navContainer) {
//     navContainer.innerHTML = `
//       <nav class="profileNavigation">
//         <ul class="pageTabs">
//           <li class="pageTabs_Item">
//             <button class="pageTabs_link dropdown-toggle-store">Store</button>
//           </li>
//           <li class="pageTabs_Item">
//             <button class="pageTabs_link dropdown-toggle-player">Players</button>
//           </li>
//           <li class="pageTabs_Item">
//             <button class="pageTabs_link dropdown-toggle-settings">Settings</button>
//           </li>
//         </ul>
        
//         <div class="dropdown-panel" id="storePanel">
//           <div class="panel-header">
//             <h4>Store Panel</h4>
//           </div>
//           <div class="panel-content">
//             <a href="itemcreator.html" class="panel-item"><i class="icon-create"></i><span>Item Creator</span></a>
//             <a href="edit-item.html" class="panel-item"><i class="icon-edit"></i><span>Edit Item</span></a>
//             <a href="manage-items.html" class="panel-item"><i class="icon-manage"></i><span>Manage Items</span></a>
//           </div>
//         </div>
        
//         <div class="dropdown-panel" id="settingsPanel">
//           <div class="panel-header">
//             <h4>Settings Panel</h4>
//           </div>
//           <div class="panel-content">
//             <a href="#" class="panel-item"><i class="icon-password"></i><span>Change Password</span></a>
//             <a href="edit-item.html" class="panel-item"><i class="icon-edit"></i><span>Edit Item</span></a>
//             <a href="manage-items.html" class="panel-item"><i class="icon-manage"></i><span>Manage Items</span></a>
//           </div>
//         </div>
        
//         <div class="dropdown-panel" id="playerPanel">
//           <div class="panel-header">
//             <h4>Player Panel</h4>
//           </div>
//           <div class="panel-content">
//             <a href="#" class="panel-item"><i class="icon-password"></i><span>Manage Players</span></a>
//             <a href="edit-item.html" class="panel-item"><i class="icon-edit"></i><span>Edit Player Page</span></a>
//           </div>
//         </div>
//       </nav>
//     `;
    
//     // Initialize dropdown functionality
//     initializeDropdowns();
//   }
// }

// function initializeDropdowns() {
//   // Store dropdown
//   document.querySelectorAll('.dropdown-toggle-store').forEach(button => {
//     button.addEventListener('click', () => {
//       document.getElementById('storePanel').classList.toggle('active');
//     });
//   });
  
//   // Players dropdown
//   document.querySelectorAll('.dropdown-toggle-player').forEach(button => {
//     button.addEventListener('click', () => {
//       document.getElementById('playerPanel').classList.toggle('active');
//     });
//   });
  
//   // Settings dropdown
//   document.querySelectorAll('.dropdown-toggle-settings').forEach(button => {
//     button.addEventListener('click', () => {
//       document.getElementById('settingsPanel').classList.toggle('active');
//     });
//   });
// }


// document.querySelector('.dropdown-toggle-store')?.addEventListener('click', () => {
//   document.getElementById('storePanel')?.classList.toggle('active');
// });
// document.querySelector('.close-panel')?.addEventListener('click', () => {
//   document.getElementById('storePanel')?.classList.remove('active');
// });

// document.querySelector('.dropdown-toggle-settings')?.addEventListener('click', () => {
//   document.getElementById('settingsPanel')?.classList.toggle('active');
// });

// document.querySelector('.close-panel')?.addEventListener('click', () => {
//   document.getElementById('settingsPanel')?.classList.remove('active');
// });


