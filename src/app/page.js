"use client"
import Image from "next/image";
import {useState, useEffect} from 'react'
import { firestore } from "@/firebase"
import { Box, Typography, Modal, Stack, TextField, Button, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, CssBaseline } from "@mui/material";
import { query, collection, getDocs} from "firebase/firestore";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";


export default function Home() {
  // Inventory Management Helper Functions
  const [inventory, setInventory] = useState([]); // default value is empty array
  const [open, setOpen] = useState(false); // default value is false
  const [itemName, setItemName] = useState(''); // default value is empty string
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

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      {/* Navigation Bar */}
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Inventory Management System</Typography>
      </Toolbar>
    </AppBar>

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button 
              variant="outlined" 
              onClick={()=>{
                addItem(itemName)
                setItemName('')
                handleClose()
              }} 
            >Add</Button>
          </Stack>
        </Box>
      </Modal>

      <Button 
        variant = "contained"
        onClick={() => {
          handleOpen()
        }} > 
        Add New Item 
      </Button>

      <Box border="1px solid #333">
        <Box width="800px" height="100px" bgcolor="#ADD8E6" display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h2" color="#333"> Inventory Items </Typography>
        </Box>
      
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {
            inventory.map(({name, quantity}) => {
              return (
              <Box 
                key={name} 
                width="100%" 
                minHeight="150px" 
                display="flex" 
                justifyContent="space-between" 
                alignItems="center" 
                bg="#f0f0f0" 
                padding={5}
              >
                <Typography variant="h3" color="#333" textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h3" color="#333" textAlign="center">
                  {quantity}
                </Typography>

                <Stack direction="row" spacing={2}>
                  <Button 
                    variant="contained"
                    onClick={() => {
                      addItem(name)
                    }}>
                    Add
                  </Button>
                  
                  <Button 
                    variant="contained"
                    onClick={() => {
                      removeItem(name)
                    }}>
                    Remove
                  </Button>
                  
                </Stack>
                
              </Box> )
            })
          }
        </Stack>
      </Box>

    </Box>
  );
}