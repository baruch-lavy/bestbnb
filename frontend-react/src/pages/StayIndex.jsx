import { useState } from 'react'
import { StayList } from '../cmps/StayList.jsx'
import { stays } from '../data/stay.js'

export function StayIndex() {
    const [filterBy, setFilterBy] = useState({
        txt: '',
        minSpeed: ''
    })

    return (
        <section className="stay-index">
            <h1>Stays</h1>
            <StayList stays={stays} />
        </section>
    )
}