import { loadStays, addStay, updateStay, removeStay, addStayMsg } from '../store/actions/stay.actions'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Loading } from '../cmps/Loading'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { stayService } from '../services/stay/'
import { userService } from '../services/user'

import { StayList } from '../cmps/StayList'
import { StayFilter } from '../cmps/StayFilter'
// import { stays } from '../data/stay.js'

export function StayIndex() {
    const dispatch = useDispatch();
    const stays = useSelector(storeState => storeState.stayModule.stays); // ✅ Get stays from Redux

    // ✅ Load stays when the component mounts
    useEffect(() => {
        dispatch(loadStays()); // ✅ Fetch stays on mount
    }, [dispatch]);

    if (!stays) return < Loading />

    return (
        <section className="stay-index">
            {/* <StayFilter filterBy={filterBy} setFilterBy={setFilterBy} /> */}
            <br />
            <StayList stays={stays} />
        </section>
    )
}

//     async function onRemoveStay(stayId) {
//         try {
//             await removeStay(stayId)
//             showSuccessMsg('Stay removed')            
//         } catch (err) {
//             showErrorMsg('Cannot remove stay')
//         }
//     }

//     async function onAddStay() {
//         const stay = stayService.getEmptyStay()
//         stay.name = prompt('Name your apartment')
//         try {
//             const savedStay = await addStay(stay)
//             showSuccessMsg(`Stay added (id: ${savedStay._id})`)
//         } catch (err) {
//             showErrorMsg('Cannot add stay')
//         }        
//     }

//     async function onUpdateStay(stay) {
//         const price = +prompt('New price?', stay.price)
//         if(price === 0 || price === stay.price) return

//         const stayToSave = { ...stay, price }
//         try {
//             const savedStay = await updateStay(stayToSave)
//             showSuccessMsg(`Stay updated, new price: ${savedStay.price}`)
//         } catch (err) {
//             showErrorMsg('Cannot update stay')
//         }        
//     }
