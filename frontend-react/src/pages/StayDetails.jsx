import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStay, addStayMsg } from '../store/actions/stay.actions'
import { StayGallery } from '../cmps/StayGallery'
// import { stays } from '../data/stay.js'
import { StayAmenities } from '../cmps/StayAmenities.jsx'
import { ReviewList } from '../cmps/ReviewList.jsx'
import { StayOrder } from '../cmps/StayOrder.jsx'



export function StayDetails() {

  const { stayId } = useParams()
  const stay = useSelector(storeState => storeState.stayModule.stay)
  // const stay = stays[0]


  useEffect(() => {
    loadStay(stayId)
  }, [stayId])


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
      <head>
        <div className="stay-header">
          <br />
          <br />
          <br />
          {/* <Link to="/stay">Back to list</Link> */}
          <h1 className="stay-name"> {stay.name}</h1>
          <p><span>📩 share</span><span> ❤ save</span></p>
        </div>


        {/* <StayGallery stay={stay} /> */}
        <article className="mini-gallery">
          <div className="main-image">
            <img src={stay.imgUrls[0]} alt="Main house image" />
          </div>
          <div className="other-images">
            {stay.imgUrls.slice(1, 5).map((imgUrl, index) => (
              <img key={index} src={imgUrl} alt={`house image ${index + 1}`} />
            ))}
          </div>
        </article>
      </head>

      <main>
        <section>
        {/* {stay && */}
        <div className="stay-short-info">
          <h3>{stay.type} in {stay.loc.city}, {stay.loc.country}</h3>
          <h5>{stay.capacity} guests * {stay.bedrooms} bedrooms * {stay.beds} beds * {stay.baths} bath</h5>
          <h4>★ {stay.reviews[0].rate} * {stay.reviews.length} {(stay.reviews.length > 1) ? 'reviews' : 'review'}</h4>
        </div>

        <div className="host-short-info">
          <img src={stay.host.imgUrl} alt="Host" className="host-avatar" style={{ borderRadius: '50%', width: '2rem', height: '2rem', objectFit: 'cover' }} />
          <div className="host-short-details">
            <h4>Hosted by {stay.host.fullname}</h4>
            <span className="superhost">Superhost * {stay.host.yearsHosting} years hosting</span>
          </div>
        </div>
        <br />
        <article className="stay-summary">{stay.summary}</article>
        <br />
        <StayAmenities amenities={stay.amenities} />
        </section>
        <StayOrder />
      </main>

      <div className="reviw-and-map">
        <ReviewList reviews={stay.reviews} />
        {/* <Map/> */}

        <h4>${stay.price}</h4>
        {/* <pre> {JSON.stringify(stay, null, 2)} </pre> */}
      </div>
      {/* // } */}
      {/* <button onClick={() => { onAddStayMsg(stay._id) }}>Add stay msg</button> */}

      <footer>
        this is footer
      </footer>
    </section>
  )
}