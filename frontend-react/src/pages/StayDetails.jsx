import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStay, addStayMsg } from '../store/actions/stay.actions'
import { StayGallery } from '../cmps/StayGallery'
import { StayAmenities } from '../cmps/StayAmenities.jsx'
import { ReviewList } from '../cmps/ReviewList.jsx'

import { Calendar } from '../cmps/Calendar.jsx'
import { SummaryModal } from '../cmps/SummaryModal.jsx'
import { StayReserve } from '../cmps/StayReserve.jsx'




export function StayDetails() {

  const { stayId } = useParams()
  const stay = useSelector(storeState => storeState.stayModule.stay)
  const [isImgLoading, setImgLoading] = useState(true)
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false)
  
  useEffect(() => {
    document.body.classList.add('details-page')

    return () => {
        document.body.classList.remove('details-page')
    }
}, [])

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
          <h1 className="stay-name"> {stay.name}</h1>
          <div className="stay-header-btns">
            <button className="show-more-summary"
            // onClick={() => setIsSummaryModalOpen(true)}
            >
              <img src="/img/stays/share.svg" alt="" /><span>Share</span>
            </button>
            <button className="show-more-summary"
            // onClick={() => setIsSummaryModalOpen(true)}
            >
              <img src="/img/stays/heart.svg" alt="" /><span>Save</span>
            </button>
            {/* 📩<span> share</span>❤<span>  save</span> */}
          </div>
        </div>
        <Link to="/stay/gallery/:id">
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
        </Link>
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
        {/* <div className="reserve-companent"> */}
          <StayReserve stay={stay} />
        {/* </div> */}
      </main>

      <div className="reviw-and-map">
        <ReviewList reviews={stay.reviews} />
        {/* <Map/> */}
      </div>
      {/* // } */}
      {/* <button onClick={() => { onAddStayMsg(stay._id) }}>Add stay msg</button> */}

      <footer className="details-footer">
        <div className="support-content">
          <div className="support-links">
            <h3>Support</h3>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">AirCover</a></li>
              <li><a href="#">Anti-discrimination</a></li>
              <li><a href="#">Disability support</a></li>
              <li><a href="#">Cancellation options</a></li>
              <li><a href="#">Report neighborhood concern</a></li>
            </ul>
          </div>

          <div className="support-links">
            <h3>Hosting</h3>
            <ul>
              <li><a href="#">Bestbnb your home</a></li>
              <li><a href="#">AirCover for Hosts</a></li>
              <li><a href="#">Hosting resources</a></li>
              <li><a href="#">Community forum</a></li>
              <li><a href="#">Hosting responsibly</a></li>
              <li><a href="#">Bestbnb-friendly apartments</a></li>
              <li><a href="#">Join a free Hosting class</a></li>
              <li><a href="#">Find a co-host</a></li>
            </ul>
          </div>

          <div className="support-links">
            <h3>Bestbnb</h3>
            <ul>
              <li><a href="#">Newsroom</a></li>
              <li><a href="#">New features</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Investors</a></li>
              <li><a href="#">Gift cards</a></li>
              <li><a href="#">Bestbnb.org emergency stays</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </section>
  )
}