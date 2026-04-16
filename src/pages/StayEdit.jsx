import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { addStay, updateStay, loadStay } from '../store/actions/stay.actions'
import { stayService } from '../services/stay'
import { gAmenities } from '../services/amenities.service'
import { categories } from '../services/categories.service'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { uploadService } from '../services/upload.service'

const PROPERTY_TYPES = [
    'Entire home/apt',
    'Private room',
    'Shared room',
    'Hotel room',
    'National parks',
    'House',
    'Cabin',
    'Apartment',
    'Villa',
]

// TODO: Replace PRESET_IMAGES with real Cloudinary upload once upload preset is configured.
// Use uploadService.uploadImg(ev) and collect secure_url into imgUrls[].
const PRESET_IMAGES = [
    'http://res.cloudinary.com/dmtlr2viw/image/upload/v1663436948/vgfxpvmcpd2q40qxtuv3.jpg',
    'http://res.cloudinary.com/dmtlr2viw/image/upload/v1663436952/aef9ajipinpjhkley1e3.jpg',
    'http://res.cloudinary.com/dmtlr2viw/image/upload/v1663436496/ihozxprafjzuhil9qhh4.jpg',
    'http://res.cloudinary.com/dmtlr2viw/image/upload/v1663436975/hx9ravtjop3uqv4giupt.jpg',
    'http://res.cloudinary.com/dmtlr2viw/image/upload/v1663436294/mvhb3iazpiar6duvy9we.jpg',
]

// TODO: Replace with real geocoding (e.g. Nominatim API: https://nominatim.openstreetmap.org/search)
// Current coords are sample values from an existing stay (Tel Aviv area)
const DEFAULT_COORDS = { lat: 32.0853, lan: 34.7818 }

function getInitialStay() {
    return {
        name: '',
        type: PROPERTY_TYPES[0],
        summary: '',
        price: '',
        capacity: 1,
        bedrooms: 1,
        bathrooms: 1,
        amenities: [],
        labels: [],
        imgUrls: [],
        reviews: [],
        likedByUsers: [],
        host: {
            _id: '',
            id: '',
            fullname: '',
            about: '',
            loc: '',
            responseTime: '',
            imgUrl: '',
            thumbnailUrl: '',
            isSuperhost: true,
        },
        loc: {
            country: '',
            countryCode: '',
            city: '',
            address: '',
            // TODO: Replace with actual geocoding based on address input
            lat: DEFAULT_COORDS.lat,
            lan: DEFAULT_COORDS.lan,
        },
    }
}

export function StayEdit() {
    const { stayId } = useParams()
    const isEditMode = Boolean(stayId)

    const navigate = useNavigate()
    const user = useSelector(state => state.userModule.user)

    const [stay, setStay] = useState(getInitialStay())
    const [isLoading, setIsLoading] = useState(false)
    const [isHostImgUploading, setIsHostImgUploading] = useState(false)

    // Pre-fill host identity fields from logged-in user
    useEffect(() => {
        if (!user) return
        setStay(prev => ({
            ...prev,
            host: {
                ...prev.host,
                _id: user._id || '',
                id: user._id || '',
                fullname: user.fullname || '',
                imgUrl: prev.host.imgUrl || user.imgUrl || '',
                thumbnailUrl: prev.host.thumbnailUrl || user.imgUrl || '',
            }
        }))
    }, [user])

    // Auth guard — show message and redirect only on direct URL access
    useEffect(() => {
        if (!user) {
            showErrorMsg('Please login to list your home')
            navigate(-1)
        }
    }, [user])

    // Load existing stay for edit mode
    useEffect(() => {
        if (!isEditMode) return
        setIsLoading(true)
        stayService.getById(stayId)
            .then(existingStay => {
                setStay({
                    ...existingStay,
                    loc: existingStay.loc || { ...getInitialStay().loc },
                    amenities: existingStay.amenities || [],
                    labels: existingStay.labels || [],
                    imgUrls: existingStay.imgUrls || [],
                })
            })
            .catch(() => showErrorMsg('Could not load stay'))
            .finally(() => setIsLoading(false))
    }, [stayId])

    // ── Field change handlers ─────────────────────────────────────────────
    function handleChange(ev) {
        const { name, value } = ev.target
        setStay(prev => ({ ...prev, [name]: value }))
    }

    function handleNumberChange(ev) {
        const { name, value } = ev.target
        setStay(prev => ({ ...prev, [name]: +value }))
    }

    function handleLocChange(ev) {
        const { name, value } = ev.target
        setStay(prev => ({
            ...prev,
            loc: { ...prev.loc, [name]: value },
        }))
    }

    function handleHostChange(ev) {
        const { name, value } = ev.target
        setStay(prev => ({
            ...prev,
            host: { ...prev.host, [name]: value },
        }))
    }

    async function handleHostImgUpload(ev) {
        if (!ev.target.files[0]) return
        setIsHostImgUploading(true)
        try {
            const { secure_url } = await uploadService.uploadImg(ev)
            setStay(prev => ({
                ...prev,
                host: { ...prev.host, imgUrl: secure_url, thumbnailUrl: secure_url },
            }))
        } catch {
            showErrorMsg('Profile image upload failed')
        } finally {
            setIsHostImgUploading(false)
        }
    }

    // ── Labels (categories) ────────────────────────────────────────────────
    function toggleLabel(label) {
        setStay(prev => {
            const has = prev.labels.includes(label)
            return {
                ...prev,
                labels: has
                    ? prev.labels.filter(l => l !== label)
                    : [...prev.labels, label],
            }
        })
    }

    // ── Amenities ─────────────────────────────────────────────────────────
    function toggleAmenity(label) {
        setStay(prev => {
            const has = prev.amenities.includes(label)
            return {
                ...prev,
                amenities: has
                    ? prev.amenities.filter(a => a !== label)
                    : [...prev.amenities, label],
            }
        })
    }

    // ── Image preset picker ────────────────────────────────────────────────
    function togglePresetImg(url) {
        setStay(prev => {
            const has = prev.imgUrls.includes(url)
            return {
                ...prev,
                imgUrls: has
                    ? prev.imgUrls.filter(u => u !== url)
                    : [...prev.imgUrls, url],
            }
        })
    }

    function removeImg(idx) {
        setStay(prev => ({
            ...prev,
            imgUrls: prev.imgUrls.filter((_, i) => i !== idx),
        }))
    }

    // ── Submit ─────────────────────────────────────────────────────────────
    async function handleSubmit(ev) {
        ev.preventDefault()

        if (!stay.name.trim()) return showErrorMsg('Please add a title')
        if (!stay.price || stay.price <= 0) return showErrorMsg('Please set a valid price')
        if (!stay.summary.trim()) return showErrorMsg('Please add a description')
        if (stay.imgUrls.length === 0) return showErrorMsg('Please upload at least one photo')
        if (!stay.loc.country.trim() || !stay.loc.city.trim()) return showErrorMsg('Please fill in location details')

        setIsLoading(true)
        try {
            if (isEditMode) {
                await updateStay(stay)
                showSuccessMsg('Listing updated!')
            } else {
                const saved = await addStay(stay)
                showSuccessMsg('Your home is now listed!')
                navigate(`/stay/${saved._id}`)
                return
            }
            navigate(`/stay/${stay._id}`)
        } catch {
            showErrorMsg('Could not save listing')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) return <div className="stay-edit loading">Loading...</div>

    return (
        <div className="stay-edit">
            <div className="stay-edit-header">
                <h1>{isEditMode ? 'Edit your listing' : 'List your home on Bestbnb'}</h1>
                <p className="sub-title">Tell guests about your space so they can decide if it's right for them.</p>
            </div>

            <form className="stay-edit-form" onSubmit={handleSubmit}>

                {/* ── BASICS ───────────────────────────────────────────── */}
                <section className="form-section">
                    <h2>The basics</h2>

                    <div className="form-group">
                        <label htmlFor="name">Listing title <span className="req">*</span></label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={stay.name}
                            onChange={handleChange}
                            placeholder="e.g. Cozy apartment in the heart of Tel Aviv"
                            maxLength={100}
                        />
                        <span className="char-count">{stay.name.length}/100</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="summary">Description <span className="req">*</span></label>
                        <textarea
                            id="summary"
                            name="summary"
                            value={stay.summary}
                            onChange={handleChange}
                            placeholder="Describe your space, the neighbourhood, and what guests can expect..."
                            rows={5}
                            maxLength={1000}
                        />
                        <span className="char-count">{stay.summary.length}/1000</span>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="price">Price per night ($) <span className="req">*</span></label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                min={1}
                                value={stay.price}
                                onChange={handleNumberChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="capacity">Max guests</label>
                            <input
                                id="capacity"
                                name="capacity"
                                type="number"
                                min={1}
                                max={50}
                                value={stay.capacity}
                                onChange={handleNumberChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bedrooms">Bedrooms</label>
                            <input
                                id="bedrooms"
                                name="bedrooms"
                                type="number"
                                min={0}
                                max={50}
                                value={stay.bedrooms}
                                onChange={handleNumberChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bathrooms">Bathrooms</label>
                            <input
                                id="bathrooms"
                                name="bathrooms"
                                type="number"
                                min={0}
                                max={50}
                                value={stay.bathrooms}
                                onChange={handleNumberChange}
                            />
                        </div>
                    </div>
                </section>

                {/* ── PROPERTY TYPE ────────────────────────────────────── */}
                <section className="form-section">
                    <h2>Property type</h2>
                    <div className="type-grid">
                        {PROPERTY_TYPES.map(type => (
                            <button
                                key={type}
                                type="button"
                                className={`type-btn ${stay.type === type ? 'selected' : ''}`}
                                onClick={() => setStay(prev => ({ ...prev, type }))}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </section>

                {/* ── CATEGORIES / LABELS ──────────────────────────────── */}
                <section className="form-section">
                    <h2>Categories</h2>
                    <p className="section-hint">Select all that apply to your listing.</p>
                    <div className="label-grid">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                type="button"
                                className={`label-btn ${stay.labels.includes(cat.label) ? 'selected' : ''}`}
                                onClick={() => toggleLabel(cat.label)}
                            >
                                <img src={cat.icon} alt={cat.label} />
                                <span>{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* ── AMENITIES ────────────────────────────────────────── */}
                <section className="form-section">
                    <h2>Amenities</h2>
                    <p className="section-hint">What do you offer guests?</p>
                    <div className="amenity-grid">
                        {gAmenities.map(amenity => (
                            <label
                                key={amenity.id}
                                className={`amenity-item ${stay.amenities.includes(amenity.label) ? 'selected' : ''}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={stay.amenities.includes(amenity.label)}
                                    onChange={() => toggleAmenity(amenity.label)}
                                />
                                <img src={amenity.icon} alt={amenity.label} />
                                <span>{amenity.label}</span>
                            </label>
                        ))}
                    </div>
                </section>

                {/* ── PHOTOS ───────────────────────────────────────────── */}
                <section className="form-section">
                    <h2>Photos <span className="req">*</span></h2>
                    {/* TODO: Replace preset picker with real Cloudinary upload once upload preset is configured */}
                    <p className="section-hint">Select the photos that best represent your space.</p>

                    <div className="preset-img-grid">
                        {PRESET_IMAGES.map((url, idx) => {
                            const selected = stay.imgUrls.includes(url)
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    className={`preset-img-btn ${selected ? 'selected' : ''}`}
                                    onClick={() => togglePresetImg(url)}
                                    aria-label={`Select photo ${idx + 1}`}
                                >
                                    <img src={url} alt={`preset ${idx + 1}`} />
                                    {selected && <span className="preset-check">✓</span>}
                                    {selected && stay.imgUrls.indexOf(url) === 0 && (
                                        <span className="img-badge">Cover</span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </section>

                {/* ── LOCATION ─────────────────────────────────────────── */}
                <section className="form-section">
                    <h2>Location</h2>
                    {/* TODO: Multi-step upgrade — add interactive map with click-to-pin for lat/lan instead of fixed DEFAULT_COORDS */}
                    {/* TODO: Add geocoding (Nominatim / Google Maps API) to auto-fill lat/lan from address */}
                    <p className="section-hint todo-note">
                        📍 Coordinates are currently set to a default value. A map picker will be added in the future.
                    </p>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="country">Country <span className="req">*</span></label>
                            <input
                                id="country"
                                name="country"
                                type="text"
                                value={stay.loc.country}
                                onChange={handleLocChange}
                                placeholder="e.g. Israel"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="countryCode">Country code</label>
                            <input
                                id="countryCode"
                                name="countryCode"
                                type="text"
                                value={stay.loc.countryCode}
                                onChange={handleLocChange}
                                placeholder="e.g. IL"
                                maxLength={3}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="city">City <span className="req">*</span></label>
                            <input
                                id="city"
                                name="city"
                                type="text"
                                value={stay.loc.city}
                                onChange={handleLocChange}
                                placeholder="e.g. Tel Aviv"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                value={stay.loc.address}
                                onChange={handleLocChange}
                                placeholder="e.g. 123 Dizengoff St"
                            />
                        </div>
                    </div>
                </section>

                {/* ── HOST ─────────────────────────────────────────────── */}
                <section className="form-section">
                    <h2>About you as a host</h2>
                    <p className="section-hint">Your name and ID are filled automatically. The rest is optional.</p>

                    <div className="form-group">
                        <label>Your name (from account)</label>
                        <input
                            type="text"
                            value={stay.host.fullname}
                            readOnly
                            className="readonly"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="host-about">About you <span className="optional">(optional)</span></label>
                        <textarea
                            id="host-about"
                            name="about"
                            value={stay.host.about}
                            onChange={handleHostChange}
                            placeholder="Tell guests a bit about yourself..."
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="host-loc">Your location <span className="optional">(optional)</span></label>
                            <input
                                id="host-loc"
                                name="loc"
                                type="text"
                                value={stay.host.loc}
                                onChange={handleHostChange}
                                placeholder="e.g. Tel Aviv, Israel"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="host-responseTime">Response time <span className="optional">(optional)</span></label>
                            <input
                                id="host-responseTime"
                                name="responseTime"
                                type="text"
                                value={stay.host.responseTime}
                                onChange={handleHostChange}
                                placeholder="e.g. within an hour"
                            />
                        </div>
                    </div>

                    {/* TODO: Add host profile photo upload (Cloudinary) */}
                </section>

                {/* ── SUBMIT ───────────────────────────────────────────── */}
                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : isEditMode ? 'Save changes' : 'Publish listing'}
                    </button>
                </div>

            </form>
        </div>
    )
}
