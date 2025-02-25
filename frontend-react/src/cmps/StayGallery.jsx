import { Link , useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Loading } from '../cmps/Loading.jsx'
import { loadStay, addStayMsg } from '../store/actions/stay.actions'


export function StayGallery() {
     const { stayId } = useParams()
     const stay = useSelector(storeState => storeState.stayModule.stay)
     const shareLink = window.location.href

      useEffect(() => {
        window.scrollTo(0, 0)
        loadStay(stayId)
      }, [stayId])

      function handleShare() {
        if (navigator.share) {
          try {
            navigator.share({
              title: 'Website Title',
              text: 'Short description of the website',
              url: shareLink,
            }).then(() => {
              console.log('Share successful');
            }).catch((error) => {
              console.error('Share failed:', error);
            });
          } catch (error) {
            console.error('Share failed:', error);
          }
        } else {
          alert('Your browser does not support sharing');
        }
      }
    
      if (!stay) return < Loading />

    return (
        <article className="gallery-page">
          <div className="stay-header-gallery">
            <div className="header-content">
              <div className="back-btn">
                <Link to={`/stay/${stay._id}`}>
                  <img src="/img/stays/left.svg" alt="Back" />
                </Link>
              </div>

              <div className="action-btns">
                <button className="action-btn"  onClick={handleShare}>
                  <img src="/img/stays/share.svg" alt="Share" />
                  <span>Share</span>
                </button>
                <button className="action-btn">
                  <img src="/img/stays/heart.svg" alt="Save" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>

          <ul className="gallery-imgs">
            {stay.imgUrls.map((imgUrl, index) => (
              <li key={imgUrl} className={index % 3 === 0 ? 'big' : 'small'}>
                <img src={imgUrl} alt="house image" />
              </li>
            ))}
          </ul>
        </article>
    )
}
    
    
    
    
    
    
//     <article className="gallery">
//         <header>
//             <Link to={`/stay/${stay._id}`}>{'<'}</Link>
//         </header>
//         <ul className="gallery-imgs">
//             {stay.imgUrls.map(imgUrl =>
//                 <li key={imgUrl}>
//                         <img src={imgUrl} alt="house image" />
//                 </li>)
//             }
//         </ul>
//     </article>
// }