import { stayService } from '../../services/stay'
import { store } from '../store'
import { ADD_STAY, REMOVE_STAY, SET_STAYS, SET_STAY, UPDATE_STAY, ADD_STAY_MSG } from '../reducers/stay.reducer'

export const SET_SEARCH_DATA = "SET_SEARCH_DATA";

export const setSearchData = (data) => ({
  type: SET_SEARCH_DATA,
  payload: data,
});


import { getDefaultFilter } from "../../services/stay/index"; // ✅ Import the default filter

export function loadStays(filterBy) {
  return async (dispatch) => {
    const fullFilter = { ...getDefaultFilter(), ...filterBy };
    try {
      const stays = await stayService.query(fullFilter);
      
      // Dispatch the action after the async operation is complete
      dispatch(getCmdSetStays(stays));
    } catch (err) {
      console.log('Cannot load stays', err);
      // Optionally, dispatch an error action here if you want to handle it in your reducers
    }
  };
}

// export function loadStays(filterBy = {}) {
//   return async (dispatch) => {
//     try {
//       // ✅ Merge `filterBy` with `getDefaultFilter()` to ensure all fields exist
//       const fullFilter = { ...getDefaultFilter(), ...filterBy };

//       // ✅ Fetch all stays
//       const allStays = await stayService.query();

//       if (!allStays || allStays.length === 0) {
//         dispatch({ type: SET_STAYS, stays: [] });
//         return;
//       }

//       // ✅ If no filter is applied, return all stays
//       if (!fullFilter.destination && !fullFilter.guests && !fullFilter.startDate && !fullFilter.endDate) {
//         dispatch({ type: SET_STAYS, stays: allStays });
//         return;
//       }

//       // ✅ Filter stays based on the applied filters
//       const filteredStays = allStays.filter((stay) => {

//         // ✅ Destination Filtering
//         if (fullFilter.destination && fullFilter.destination !== "Anywhere") {
//           if (!stay.loc?.country?.toLowerCase().includes(fullFilter.destination.toLowerCase())) {
//             // console.log(`❌ Skipping ${stay.name} (Destination doesn't match)`);
//             return false;
//           }
//         }

//         // ✅ Guests Filtering
//         if (fullFilter.guests) {
//           const maxGuests = stay.capacity || stay.maxGuests || 0; 
//           if (maxGuests < fullFilter.guests) {
//             // console.log(`❌ Skipping ${stay.name} (Not enough guest capacity)`);
//             return false;
//           }
//         }

//         // ✅ Date Filtering
//         if (fullFilter.startDate && fullFilter.endDate) {
//           const searchStart = new Date(fullFilter.startDate).getTime();
//           const searchEnd = new Date(fullFilter.endDate).getTime();

//           if (stay.availableFrom && stay.availableTo) {
//             const stayStart = new Date(stay.availableFrom).getTime();
//             const stayEnd = new Date(stay.availableTo).getTime();

//             if (searchStart < stayStart || searchEnd > stayEnd) {
//               // console.log(`❌ Skipping ${stay.name} (Not available in selected dates)`);
//               return false;
//             }
//           } else {
//             // console.log(`2❌ Skipping ${stay.name} (No available dates info)`);
//             return false; 
//           }
//         }

//         // console.log(`✅ Keeping ${stay.name}`);
//         return true;
//       });

//       // console.log("🚀 ~ Filtered stays:", filteredStays);

//       // ✅ Dispatch filtered stays or empty array if none found
//       dispatch({ type: SET_STAYS, stays: filteredStays.length ? filteredStays : [] });
//     } catch (err) {
//       console.error("❌ Cannot load stays:", err);
//     }
//   };
// }


export async function loadStay(stayId) {
  console.log('stayId', stayId)
  try {
    const stay = await stayService.getById(stayId)
    store.dispatch(getCmdSetStay(stay))
  } catch (err) {
    console.log('Cannot load stay', err)
    throw err
  }
}


export async function removeStay(stayId) {
  try {
    await stayService.remove(stayId)
    store.dispatch(getCmdRemoveStay(stayId))
  } catch (err) {
    console.log('Cannot remove stay', err)
    throw err
  }
}

export async function addStay(stay) {
  try {
    const savedStay = await stayService.save(stay)
    store.dispatch(getCmdAddStay(savedStay))
    return savedStay
  } catch (err) {
    console.log('Cannot add stay', err)
    throw err
  }
}

export async function updateStay(stay) {
  try {
    const savedStay = await stayService.save(stay)
    store.dispatch(getCmdUpdateStay(savedStay))
    return savedStay
  } catch (err) {
    console.log('Cannot save stay', err)
    throw err
  }
}

export async function addStayMsg(stayId, txt) {
  try {
    const msg = await stayService.addStayMsg(stayId, txt)
    store.dispatch(getCmdAddStayMsg(msg))
    return msg
  } catch (err) {
    console.log('Cannot add stay msg', err)
    throw err
  }
}

// Command Creators:
function getCmdSetStays(stays) {
  return {
    type: SET_STAYS,
    stays
  }
}
function getCmdSetStay(stay) {
  return {
    type: SET_STAY,
    stay
  }
}
function getCmdRemoveStay(stayId) {
  return {
    type: REMOVE_STAY,
    stayId
  }
}
function getCmdAddStay(stay) {
  return {
    type: ADD_STAY,
    stay
  }
}
function getCmdUpdateStay(stay) {
  return {
    type: UPDATE_STAY,
    stay
  }
}
function getCmdAddStayMsg(msg) {
  return {
    type: ADD_STAY_MSG,
    msg
  }
}

// unitTestActions()
async function unitTestActions() {
  await loadStays()
  await addStay(stayService.getEmptyStay())
  await updateStay({
    _id: 'm1oC7',
    title: 'Stay-Good',
  })
  await removeStay('m1oC7')
  // TODO unit test addStayMsg
}
