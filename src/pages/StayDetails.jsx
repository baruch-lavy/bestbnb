import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStay, clearStay } from '../store/actions/stay.actions'
import { StayAmenities } from '../cmps/StayAmenities.jsx'
import { ReviewList } from '../cmps/ReviewList.jsx'
import { Map } from '../cmps/Map.jsx'
import { Calendar } from '../cmps/Calendar.jsx'
import { SummaryModal } from '../cmps/SummaryModal.jsx'
import { StayOrder } from '../cmps/StayOrder.jsx'
import { Loading } from '../cmps/Loading.jsx'
import { StayMiniGallery } from '../cmps/StayMiniGallery.jsx'


export function StayDetails() {

  const { stayId } = useParams()
  const stay = useSelector(storeState => storeState.stayModule.stay)
  const user = useSelector(storeState => storeState.userModule.user)
  const navigate = useNavigate()
  const [isImgLoading, setImgLoading] = useState(true)
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false)
  const searchData = useSelector((state) => state.search)
  const stayRateRef = useRef()
  const yearsOnBestbnbRef = useRef()
  const shareLink = window.location.href

  useEffect(() => {
    document.body.classList.add('details-page')

    return () => {
      document.body.classList.remove('details-page')
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    clearStay()
    loadStay(stayId)
  }, [stayId])



  function handleImageLoad() {
    setImgLoading(false)
  }

  async function handleShare() {
    if (!navigator.share) {
      showErrorMsg('Your browser does not support sharing')
      return
    }

    try {
      await navigator.share({
        title: stay.name,
        text: stay.summary.substring(0, 100) + '...',
        url: shareLink,
      })
      console.log('Share successful')
    } catch (error) {
      console.error('Share failed:', error)
    }
  }

  if (!stayRateRef.current) {
    stayRateRef.current = parseFloat((Math.random() * (5 - 4) + 4).toFixed(2))
  }

  if (!yearsOnBestbnbRef.current) {
    yearsOnBestbnbRef.current = parseInt(Math.random() * 12) + 2
  }

  if (!stay) return < Loading />

  return (
    <section className="stay-details">
      <header>
        <div className="stay-header">
          <h1 className="stay-name"> {stay.name}</h1>
          <div className="stay-header-btns">
            <button className="share-like-btn"
              onClick={handleShare}>
              <img src="/img/stays/share.svg" alt="" />
              Share
            </button>
            <button className="share-like-btn">
              <img src="/img/stays/heart.svg" alt="" />
              Save
            </button>
            {user && stay.host && user._id === stay.host._id && (
              <button className="share-like-btn edit-listing-btn" onClick={() => navigate(`/stay/edit/${stay._id}`)}>
                ✏️ Edit listing
              </button>
            )}
          </div>
        </div>

        <Link to={`/stay/gallery/${stay._id}`}>
          <StayMiniGallery 
          stay={stay}
          handleImageLoad={handleImageLoad}
          isImgLoading={isImgLoading}
          />
        </Link>
      </header>

      <main>
        <section>
          <div className="stay-short-info">
            <h3 className="info-header">{stay.type} in {stay.loc.city}, {stay.loc.country}</h3>
            <h5 className="info">{stay.capacity} guests · {stay.bedrooms} bedrooms · {stay.capacity} beds · {stay.bathrooms} baths</h5>
            <h4 className="rate">★ {stayRateRef.current} · {stay.reviews.length} {(stay.reviews.length > 1) ? 'reviews' : 'review'}</h4>
          </div>

          <Link to={`/reviewer/${stay.host._id}`} className="host-short-info">
            <img src={stay.host.pictureUrl || stay.host.imgUrl} alt="Host" className="host-avatar" style={{ borderRadius: '50%', width: '2rem', height: '2rem', objectFit: 'cover' }} />
            <div className="host-short-details">
              <h4>Hosted by {stay.host.fullname}</h4>
              <span className="superhost">{stay.host.isSuperhost && 'Superhost ·'}  {yearsOnBestbnbRef.current} years hosting</span>
            </div>
          </Link>

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

          <Calendar stay={stay} />
        </section>
        <StayOrder stay={stay} />
      </main>

      <div className="reviw-and-map">
        <ReviewList reviews={stay.reviews} />
        <Map loc={stay.loc} />
      </div>

    </section>
  )
}