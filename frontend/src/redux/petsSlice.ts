import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  petsList: [],
  pet:null,
  newPet: null,
  updatePet: null,
  deletePet: null
};

const petsSlice = createSlice({
  name: "pets",
  initialState,
  reducers: {
    setPets: (state, action) => {
      state.petsList= action.payload;
      localStorage.setItem("petsList", JSON.stringify(state.petsList)); // Save to local storage
    },
    setSinglePet: (state, action) => {
      state.pet = action.payload;
      localStorage.setItem("pet", JSON.stringify(state.pet)); // Save to local storage
    },
    addPet: (state, action) => {
      state.newPet = action.payload;
      // Add the new pet to the petsList array
      (state.petsList as any[]).push(action.payload);
      localStorage.setItem("petsList", JSON.stringify(state.petsList)); // Update local storage
    },
    editPet: (state, action) => {
      state.updatePet = action.payload;
      // Update the pet in the petsList array
      const updatedPet = action.payload;
      const index = state.petsList.findIndex((pet: any) => pet._id === updatedPet._id);
      if (index !== -1) {
        (state.petsList as any)[index] = updatedPet;
        localStorage.setItem("petsList", JSON.stringify(state.petsList)); // Update local storage
      }
    },
    removePet: (state, action) => {
      state.deletePet = action.payload;
      // Remove the pet from the petsList array
      const petId = action.payload;
      (state as any).petsList = (state.petsList as any[]).filter((pet: any) => pet._id !== petId);
      localStorage.setItem("petsList", JSON.stringify(state.petsList)); // Update local storage
    }
  },
});

export const { setPets, setSinglePet, addPet, editPet, removePet } = petsSlice.actions;
export default petsSlice.reducer;