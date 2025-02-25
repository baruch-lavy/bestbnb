import { Link , useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Loading } from '../cmps/Loading.jsx'
import { loadStay, addStayMsg } from '../store/actions/stay.actions'


export function StayGallery() {
     const { stayId } = useParams()
     const stay = useSelector(storeState => storeState.stayModule.stay)
    
      useEffect(() => {
        window.scrollTo(0, 0)
        loadStay(stayId)
      }, [stayId])

      if (!stay) return < Loading />

    return (
        <article className="gallery-page">
          <div className="back-icon-gallery">
            <Link to={`/stay/${stay._id}`}>
                  <img src="/img/stays/left.svg" alt="" />
            </Link>
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