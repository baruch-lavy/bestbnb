import { stayService } from '../../services/stay'
import { store } from '../store'
import { ADD_STAY, REMOVE_STAY, SET_STAYS, SET_STAY, UPDATE_STAY, ADD_STAY_MSG } from '../reducers/stay.reducer'

export const SET_SEARCH_DATA = "SET_SEARCH_DATA";

export const setSearchData = (data) => ({
  type: SET_SEARCH_DATA,
  payload: data,
});

export function loadStays(filterBy = {}) {
    console.log("🚀 ~ file: stay.actions.js ~ line 33 ~ loadStays ~ filterBy", filterBy)
    return async (dispatch) => {
      try {
        const allStays = await stayService.query();
        console.log("🚀 ~ file: stay.actions.js ~ line 33 ~ loadStays ~ allStays:", allStays);
  
        if (!allStays || allStays.length === 0) {
          console.log("🚀 No stays found in database!");
          dispatch({ type: SET_STAYS, stays: [] });
          return;
        }
  
        // ✅ If no filter applied, return all stays
        if (!filterBy.destination && !filterBy.guests && !filterBy.startDate && !filterBy.endDate) {
          dispatch({ type: SET_STAYS, stays: allStays });
          return;
        }
  
        const filteredStays = allStays.filter((stay) => {
          // ✅ Destination Filtering (Already Working Correctly)
          if (filterBy.destination && filterBy.destination !== "Anywhere") {
            if (!stay.loc?.country?.toLowerCase().includes(filterBy.destination.toLowerCase())) {
              return false;
            }
          }
  
          // ✅ FIXED: Guest Filtering
          if (filterBy.guests) {
            const maxGuests = stay.capacity || stay.maxGuests || 0; // ✅ Ensure guests field exists
            if (maxGuests < filterBy.guests) {
              return false;
            }
          }
  
          // ✅ FIXED: Date Filtering (Now Works Correctly)
          if (filterBy.startDate && filterBy.endDate) {
            const searchStart = new Date(filterBy.startDate).getTime();
            const searchEnd = new Date(filterBy.endDate).getTime();
  
            if (stay.availableFrom && stay.availableTo) {
              const stayStart = new Date(stay.availableFrom).getTime();
              const stayEnd = new Date(stay.availableTo).getTime();
  
              // ✅ FIX: Only return stays that are available within the search dates
              if (searchStart < stayStart || searchEnd > stayEnd) {
                return false;
              }
            } else {
              return false; // ✅ If the stay has no available dates, exclude it
            }
          }
  
          return true;
        });
  
        console.log("🚀 ~ file: stay.actions.js ~ Filtered stays:", filteredStays);
  
        dispatch({ type: SET_STAYS, stays: filteredStays.length ? filteredStays : [] });
      } catch (err) {
        console.error("Cannot load stays", err);
      }
    };
  }
  
  

export async function loadStay(stayId) {
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
