import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStay, addStayMsg } from '../store/actions/stay.actions'
import { StayGallery } from '../cmps/StayGallery'
import { StayAmenities } from '../cmps/StayAmenities.jsx'
import { ReviewList } from '../cmps/ReviewList.jsx'
import { Map } from '../cmps/Map.jsx'
import { Calendar } from '../cmps/Calendar.jsx'
import { SummaryModal } from '../cmps/SummaryModal.jsx'
import { StayOrder } from '../cmps/StayOrder.jsx'
import { Loading } from '../cmps/Loading.jsx'


export function StayDetails() {

  const { stayId } = useParams()
  const stay = useSelector(storeState => storeState.stayModule.stay)
  const [isImgLoading, setImgLoading] = useState(true)
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false)
  const searchData = useSelector((state) => state.search);

  useEffect(() => {
    document.body.classList.add('details-page')

    return () => {
      document.body.classList.remove('details-page')
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
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
  if (!stay) return < Loading />
  
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
            <h5 className="info">{stay.capacity} guests · {stay.bedrooms} bedrooms · {stay.capacity} beds · {stay.bathrooms} baths</h5>

            <h4 className="rate">★ {parseFloat((Math.random() * (5 - 4) + 4).toFixed(2))} · {stay.reviews.length} {(stay.reviews.length > 1) ? 'reviews' : 'review'}</h4>
          </div>

          <div className="host-short-info">
            <img src={stay.host.pictureUrl} alt="Host" className="host-avatar" style={{ borderRadius: '50%', width: '2rem', height: '2rem', objectFit: 'cover' }} />
            <div className="host-short-details">
              <h4>Hosted by {stay.host.fullname}</h4>
              <span className="superhost">{stay.host.isSuperhost && 'Superhost ·'}  {(parseInt(Math.random() * 12) + 2)} years hosting</span>
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

          <Calendar stay={stay}/>
        </section>
        <StayOrder stay={stay} />
      </main>

      <div className="reviw-and-map">
        <ReviewList reviews={stay.reviews} />
        <Map loc={stay.loc} />
      </div>
      {/* // } */}
      {/* <button onClick={() => { onAddStayMsg(stay._id) }}>Add stay msg</button> */}

    </section>
  )
}