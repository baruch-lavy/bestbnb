import { useEffect, useState } from 'react'
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
import { Calendar } from '../cmps/Calendar.jsx'
import { SummaryModal } from '../cmps/SummaryModal.jsx'



export function StayDetails() {

  const { stayId } = useParams()
  const stay = useSelector(storeState => storeState.stayModule.stay)
  const [isImgLoading, setImgLoading] = useState(true)
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false)


  useEffect(() => {
    loadStay(stayId)
  }, [stayId])


  function handleImageLoad() {
    setImgLoading(false)
  }
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
      <header>
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

          {isImgLoading && <div className="skeleton-loader"></div>}
          <div className="main-image"
            onLoad={handleImageLoad}
            style={{ display: isImgLoading ? 'none' : 'block' }}>
            <img src={stay.imgUrls[0]} alt="Main house image" />
          </div>
          <div className="other-images">
            {stay.imgUrls.slice(1, 5).map((imgUrl, index) => (
              <img key={index} src={imgUrl} alt={`house image ${index + 1}`} />
            ))}
          </div>
        </article>
      </header>

      <main>
        <section>
          {/* {stay && */}
          <div className="stay-short-info">
            <h3 className="info-header">{stay.type} in {stay.loc.city}, {stay.loc.country}</h3>
            <h5 className="info">{stay.capacity} guests * {stay.bedrooms} bedrooms * {stay.beds} beds * {stay.baths} bath</h5>
            <h4 className="rate">★ {stay.reviews[0].rate} * {stay.reviews.length} {(stay.reviews.length > 1) ? 'reviews' : 'review'}</h4>
          </div>

          <div className="host-short-info">
            <img src={stay.host.imgUrl} alt="Host" className="host-avatar" style={{ borderRadius: '50%', width: '2rem', height: '2rem', objectFit: 'cover' }} />
            <div className="host-short-details">
              <h4>Hosted by {stay.host.fullname}</h4>
              <span className="superhost">Superhost * {stay.host.yearsHosting} years hosting</span>
            </div>
          </div>
          <article className="stay-summary">
            <p>{stay.summary}</p>
            <button className="show-more-summary"
              onClick={() => setIsSummaryModalOpen(true)}>
              Show more  <img src="/img/stays/asset23.svg" alt="" />
            </button>
            <SummaryModal
              isOpen={isSummaryModalOpen}
              onClose={() => setIsSummaryModalOpen(false)}
              summary={stay.summary}
            />
          </article>
          <StayAmenities amenities={stay.amenities} />
          <Calendar />
        </section>
        <StayOrder stay={stay} />
      </main>

      <div className="reviw-and-map">
        <ReviewList reviews={stay.reviews} />
        {/* <Map/> */}
      </div>
      {/* // } */}
      {/* <button onClick={() => { onAddStayMsg(stay._id) }}>Add stay msg</button> */}

      <footer>
        this is footer
      </footer>
    </section>
  )
}