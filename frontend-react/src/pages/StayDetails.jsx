import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStay, addStayMsg } from '../store/actions/stay.actions'
import { StayGallery } from '../cmps/StayGallery'


export function StayDetails() {

  const {stayId} = useParams()
  const stay = useSelector(storeState => storeState.stayModule.stay)

  useEffect(() => {
    loadStay(stayId)
  }, [stayId])

  console.log('stay for ditaeil', stay)

  async function onAddStayMsg(stayId) {
    try {
        await addStayMsg(stayId, 'bla bla ' + parseInt(Math.random()*10))
        showSuccessMsg(`Stay msg added`)
    } catch (err) {
        showErrorMsg('Cannot add stay msg')
    }        

}

if (!stay) return <p>loading</p> 
  return (
    <section className="stay-details">
      <Link to="/stay">Back to list</Link>
      <h1> {stay.name}</h1>
       <StayGallery stay={stay}/>
      {stay && <div>
        <h3>{stay.name}</h3>
        <h4>${stay.price}</h4>
        <pre> {JSON.stringify(stay, null, 2)} </pre>
      </div>
      }
      <button onClick={() => { onAddStayMsg(stay._id) }}>Add stay msg</button>

    </section>
  )
}