import { useState } from 'react'
import { SupportModal } from './SupportModal'

export function AppFooter() {
	const [isSupportModalOpen, setIsSupportModalOpen] = useState(false)

	return (
		<>
			<footer className="app-footer full">
				<div className="footer-left">
					<p>© 2025 Bestbnb, Inc.</p>
					<span className="dot-separator">·</span>
					<a href="#">Terms</a>
					<span className="dot-separator">·</span>
					<a href="#">Sitemap</a>
					<span className="dot-separator">·</span>
					<a href="#">Privacy</a>
					<span className="dot-separator">·</span>
					<a href="#">Your Privacy Choices</a>
					<img src="/img/stays/footer/footer 3.svg"/>
				</div>

				<div className="footer-right">
					<button className="language-btn">
						<img src="/img/stays/footer/footer 1.svg" className="globe-icon"/>
						<span>English (US)</span>
					</button>
					<button className="currency-btn">
						<span className="dollar-icon">$</span>
						<span>USD</span>
					</button>
					<button 
						className="support-btn"
						onClick={() => setIsSupportModalOpen(true)}>
						Support & resources
						<img src="/img/stays/footer/footer 2.svg" className="chevron-icon"/>
					</button>
				</div>
			</footer>

			<SupportModal 
				isOpen={isSupportModalOpen}
				onClose={() => setIsSupportModalOpen(false)}
			/>
		</>
	)
}