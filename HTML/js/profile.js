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


