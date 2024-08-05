"use client";

import { useState, useEffect } from 'react';
import { firestore } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import OpenAI from "openai";

// Initialize the OpenAI API
 //const openai = new OpenAI({
 // apiKey: process.env.OPENAI_API_KEY,
 //});   Commented out for purposes

export default function Inventory() {
  const [inventoryString, setInventoryString] = useState("");
  const [output, setOutput] = useState("");

  // Fetching inventory data from Firebase
  const fetchInventory = async () => {
    const snapshot = await getDocs(collection(firestore, 'inventory'));
    const inventoryList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Convert inventory list to a string for API call
    const inventoryDataString = inventoryList.map(item => `${item.id}: ${item.quantity}`).join(', ');
    setInventoryString(inventoryDataString);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleButtonClick = async () => {
    try {
      // Make the OpenAI API call with the inventory data
      const stream = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `Based on the following inventory, suggest a recipe I can make with these ingredients: ${inventoryString}`,
          },
        ],
        stream: true,
      });

      let result = '';
      for await (const chunk of stream) {
        result += chunk.choices[0]?.delta?.content || "";
      }

      // Set the API output to the output state
      setOutput(result);

    } catch (error) {
      console.error("Error fetching OpenAI API response:", error);
      setOutput("Error fetching OpenAI API response.");
    }
  };

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
    <li><a href="/">Home</a></li>
      <li><a href="/inventory">Inventory</a></li>
      <li><a href = "/about" >About</a></li>

    </ul>
  </div>
  <div className="navbar-end">
  </div>
</div>
     
     
      {/* Button to Generate Output */}
      <div className="mt-6 flex flex-col items-center">
        <button className="btn btn-accent" onClick={handleButtonClick}>
         
          Generate Recipe
        </button>
        <div className="mt-4 flex flex-col items-center">
          <h3 className="text-lg font-semibold">Suggested Recipe</h3>
          <textarea
            className="textarea textarea-bordered mt-2 w-full max-w-lg flex flex-col items-center"
            value={output}
            readOnly
          ></textarea>
        </div>
      </div>
    </div>
  );
}
