"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ItemUpdateModal from '../../components/ItemUpdateModal.js';

import 
{ 
  collection, 
  doc, 
  query, 
  updateDoc,
  addDoc,
  deleteDoc,
  getDoc, 
  onSnapshot 
} 
from 'firebase/firestore';

import { db } from '../../firebase.js';
 
export default function Home() {
  const router = useRouter();
  const [items, setItems] = useState([{}]);
  // { string, string }
  const [newItem, setNewItem] = useState({ name: '', quantity: ''});
  const [updatedItem, setUpdatedItem] = useState({ name: '', quantity: ''});

  const [showModal, setShowModal] = useState(false);
  const [modalItemId, setModalItemId] = useState(null);
  const [modalItemName, setModalItemName] = useState(null);
  const [modalItemQuant, setModalItemQuant] = useState(null);

  const deleteItem = async(id) => {
    await deleteDoc(doc(db, 'pantry', id));
  }

  const crementItem = async (id, isIncrement) => {
    // retrieve database collection
    // retrieve reference to document based on id
    const docRef = doc(db, "pantry", id);
    // pull data from document reference by first pulling the
    // document itself and then its data
    const docData = (await getDoc(docRef)).data();
    // update document to increment the quantity

    // logic to decide whether to increment or decrement the item
    if (isIncrement) {
      await updateDoc(docRef, {
        quantity: docData.quantity + 1
      });
    } else {
      if (docData.quantity > 1) {
        await updateDoc(docRef, {
          quantity: docData.quantity - 1
        });
      }
      if (docData.quantity === 1) {
        await deleteDoc(docRef);
      }
    }
  }

  const addItem = async (e) => {
    // refactor to include lookups and updates
    e.preventDefault();
    if (newItem.name !== '' && newItem.quantity !== '') {
      let parsedInt = parseInt(newItem.quantity);
      if (!(isNaN(parsedInt)) && parsedInt > 0) {
        setItems([...items, newItem]);
        await addDoc(collection(db, "pantry"), {
          name: newItem.name.trim(),
          quantity: parsedInt
        });
      }
      setNewItem({name: '', quantity: ''});
    } 
  }
  
  const updateItem = async (e, itemId) => {
    e.preventDefault();
    if (updatedItem.name !== '' && updatedItem.quantity !== '') {
      let parsedInt = parseInt(updatedItem.quantity);
      if (!(isNaN(parsedInt)) && parsedInt > 0) {
        let docRef = doc(db, "pantry", itemId);
        await updateDoc(docRef, {
          name: updatedItem.name,
          quantity: parsedInt
        });
        setShowModal(false);
      }
    }
  }

  const navToItemAdd = (e) => {
    e.preventDefault();
    router.push("/item-add");
  }

  const accessModal = (id, itemName, itemQuant) => {
    let itemQuantS = itemQuant.toString();
    setModalItemId(id);
    setModalItemName(itemName);
    setModalItemQuant(itemQuant);
    setUpdatedItem({name: itemName, quantity: itemQuantS});
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
  }

  useEffect(() => {
    // create a query that fetches 'pantry' collection from database
    const q = query(collection(db, 'pantry'));
    // listen for changes to collection
    // when there is a change to collection, create an array of the
    // new items, copy everything over, and set that to the state variable
    // that we will use to display items
    const unsub = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];
      querySnapshot.forEach((doc) => {
        itemsArr.push({...doc.data(), id: doc.id});
      });
      setItems(itemsArr);
    });

  }, []);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4 bg-white">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
          <h1 className="text-4xl text-purple-800 p-4 text-center">Pantry Inventory Manager</h1>
          <div className="bg-purple-900 mt-4 p-4 h-screen no-scrollbar overflow-auto rounded-lg">
            <form className="grid grid-cols-6 items-center text-black">
  `            <input 
                  className="col-start-1 col-span-3 sm:col-span-2 xs:col-span-2 p-3 border shadow-lg" 
                  type="text" 
                  placeholder="Enter Item"
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  value={newItem.name} 
              />
              <input 
                  className="col-span-1 p-3 border mx-3 shadow-lg"
                  type="text"
                  placeholder="Enter Quantity"
                  onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                  value={newItem.quantity} 
              />
              <button
                  className="text-white h-12 bg-purple-700 hover:bg-purple-800 p-3 mr-3 text-lg sm:text-md xs:text-md shadow-lg"
                  onClick={addItem} 
                  type="submit" 
              >
                  +
              </button>
              <button
                  className="text-white h-12 bg-purple-700 hover:bg-purple-800 p-3 text-lg sm:text-md xs:text-md shadow-lg"
                  onClick={navToItemAdd}
                >
                Photo
                </button>
            </form>
            <ul>
              {items.map((item, index) => (
                  <li 
                    className="my-4 w-full flex justify-between bg-purple-700 shadow-lg"
                    key={index}
                  >
                  <button
                    className="p-4 border-r-2 border-purple-800 hover:bg-purple-800 w-16"
                    onClick={() => deleteItem(item.id)}
                  >
                    X
                  </button>
                  <div 
                    className="p-4 w-full flex justify-between hover:bg-purple-800"
                    onClick={() => accessModal(item.id, item.name, item.quantity)}
                  >
                    <span className="capitalize">{item.name}</span>
                    <span>{item.quantity}</span>
                  </div>
                  <button
                    className="p-4 border-l-2 border-purple-800 hover:bg-purple-800 w-16"
                    onClick={() => crementItem(item.id, true)}
                  >
                    +
                  </button>
                  <button
                    className="p-4 border-l-2 border-purple-800 hover:bg-purple-800 w-16"
                    onClick={() => crementItem(item.id, false)}
                  >
                    -
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <ItemUpdateModal isVisible={showModal} onClose={closeModal}>
          <div className="bg-purple-800 mt-4 p-4 rounded-lg shadow-lg">
              <form className="grid grid-cols-4 gap-4 items-center text-black">
                  <input 
                      className="col-span-2 p-3 border rounded shadow-lg" 
                      type="text" 
                      onChange={(e) => setUpdatedItem({...updatedItem, name: e.target.value})}
                      value={updatedItem.name} 
                  />
                  <input 
                      className="col-span-1 p-3 border rounded shadow-lg" 
                      type="text"
                      onChange={(e) => setUpdatedItem({...updatedItem, quantity: e.target.value})}
                      value={updatedItem.quantity} 
                  />
                  <button
                      className="col-span-1 text-white h-12 bg-purple-600 hover:bg-purple-700 p-3 text-lg sm:text-md xs:text-md rounded shadow-lg"
                      onClick={(e) => updateItem(e, modalItemId)} 
                      type="submit"
                  >
                      Update
                  </button>
              </form>
          </div>
      </ItemUpdateModal>
    </>
  );
}