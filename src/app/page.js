"use client";

import { useState, useEffect } from 'react';
import { firestore } from "@/firebase";
import { query, collection, getDocs, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    let totalCount = 0;

    docs.forEach((doc) => {
      const itemData = doc.data();
      inventoryList.push({
        name: doc.id,
        ...itemData,
      });
      totalCount += itemData.quantity || 0;
    });

    setInventory(inventoryList);
    setTotalCount(totalCount);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const searchInventory = () => {
    const searchText = document.getElementById('search-box').value.trim().toLowerCase();
    if (searchText === "") {
      document.getElementById('search-results').innerHTML = "Please enter a search term.";
      return;
    }

    // Filter the inventory based on the search text
    const filteredInventory = inventory.filter(item =>
      item.name.toLowerCase().includes(searchText)
    );

    // Display the search results
    if (filteredInventory.length > 0) {
      const searchResults = filteredInventory.map(item => `
        <div class="p-2 border-b">
          <strong>${item.name}</strong>: ${item.quantity || 0}
        </div>
      `);
      document.getElementById('search-results').innerHTML = searchResults.join('');
    } else {
      document.getElementById('search-results').innerHTML = "No results found.";
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100" data-theme="mytheme">
      {/* DaisyUI Navigation Bar */}
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <button tabindex="0" role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </button>
            <ul tabindex="0" className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li><a>Item 1</a></li>
              <li>
                <a>Parent</a>
                <ul className="p-2">
                  <li><a>Submenu 1</a></li>
                  <li><a>Submenu 2</a></li>
                </ul>
              </li>
              <li><a>Item 3</a></li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">Inventory Manager</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><a>Home</a></li>
            <li>
              <details>
                <summary>Recipes</summary>
                <ul className="p-2">
                  <li><a>Submenu 1</a></li>
                  <li><a>Submenu 2</a></li>
                </ul>
              </details>
            </li>
            <li><a>About</a></li>
          </ul>
        </div>
        <div className="navbar-end">
          <input id="search-box" type="text" placeholder="Search..." className="input input-bordered w-full max-w-xs" />
          <button id="search-button" className="btn btn-primary ml-2" onClick={searchInventory}>
            Search
          </button>
        </div>
      </div>
      <div id="search-results" className="p-4"></div>

      {/* Modal for Adding Items */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-neutral p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-primary">Add Item</h2>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Item Name"
              />
              <button
                className="btn btn-primary"
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
              >
                Add
              </button>
            </div>
            <button className="btn btn-secondary w-full" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add New Item Button */}
      <button className="btn btn-accent my-4" onClick={handleOpen}>
        Add New Item
      </button>

      {/* Inventory List */}
      <div className="w-full max-w-4xl bg-base-100 rounded shadow">
        <div className="bg-primary text-white text-center py-2 rounded-t">
          <h2 className="text-2xl">Inventory Items</h2>
        </div>
        <div className="p-4 max-h-96 overflow-y-auto">
          {inventory.map(({ name, quantity }) => (
            <div key={name} className="flex justify-between items-center bg-neutral p-4 mb-2 rounded">
              <div className="text-lg font-semibold text-primary">{name.charAt(0).toUpperCase() + name.slice(1)}</div>
              <div className="text-lg text-secondary">{quantity}</div>
              <div className="flex gap-2">
                <button className="btn btn-success" onClick={() => addItem(name)}>
                  Add
                </button>
                <button className="btn btn-error" onClick={() => removeItem(name)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}