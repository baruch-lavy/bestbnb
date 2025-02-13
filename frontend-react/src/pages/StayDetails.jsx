import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStay, addStayMsg } from '../store/actions/stay.actions'
import { StayGallery } from '../cmps/StayGallery'
import { stays } from '../data/stay.js'
import { StayAmenities } from '../cmps/StayAmenities.jsx'
import { ReviewList } from '../cmps/ReviewList.jsx'



export function StayDetails() {

  const { stayId } = useParams()
  // const stay = useSelector(storeState => storeState.stayModule.stay)
  const stay = stays[0]


  useEffect(() => {
    loadStay(stayId)
  }, [stayId])

  console.log('stay for ditaeil', stay)

  async function onAddStayMsg(stayId) {
    try {
      await addStayMsg(stayId, 'bla bla ' + parseInt(Math.random() * 10))
      showSuccessMsg(`Stay msg added`)
    } catch (err) {
      showErrorMsg('Cannot add stay msg')
    }

  }

  if (!stay) return <p>loading</p>
  return (
    <section className="stay-details">
      <br />
      <br />
      <br />
      <Link to="/stay">Back to list</Link>
      <h1> {stay.name}</h1>
      <StayGallery stay={stay} />
      {stay && <div>
        <h3>{stay.type} in {stay.loc.city}, {stay.loc.country}</h3>
        <h5>{stay.capacity} guests * 2 bedrooms * 3 beds * 1 bath</h5>
        <h4>★ {stay.reviews[0].rate} * {stay.reviews.length} {(stay.reviews.length > 1) ? 'reviews' : 'review'}</h4>
        
        <div>
        <img src={stay.host.imgUrl} alt="Host" style={{ borderRadius: '50%', width: '2rem', height: '2rem', objectFit: 'cover' }}/>
        <h4>Hosted by {stay.host.fullname}</h4>
        <h6>Superhost * 4 years hosting</h6>
        </div>
        <br />
        <article>{stay.summary}</article>
        <br />
        <StayAmenities amenities = {stay.amenities}/>
        <ReviewList  reviews={stay.reviews} />
        {/* <Map/> */}
        
        <h4>${stay.price}</h4>
        {/* <pre> {JSON.stringify(stay, null, 2)} </pre> */}
      </div>
      }
      <button onClick={() => { onAddStayMsg(stay._id) }}>Add stay msg</button>

    </section>
  )
}