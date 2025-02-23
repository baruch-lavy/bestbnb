import { useState } from 'react'
import { SupportModal } from './SupportModal'
import { useLocation } from 'react-router-dom'

export function AppFooter() {
	const [isSupportModalOpen, setIsSupportModalOpen] = useState(false)
	const location = useLocation()
	const isDetailsPage = location.pathname.includes('/stay/')
	const isDashboardPage = location.pathname === '/dashboard'

	if (isDashboardPage) {
		return (
			<footer className="app-footer dashboard-footer">
				<div className="footer-bottom">
					<div className="footer-bottom-left">
						<p className="footer-copyright">© 2025 Bestbnb, Inc.</p>
						<span className="dot-separator">·</span>
						<a href="#">Terms</a>
						<span className="dot-separator">·</span>
						<a href="#">Sitemap</a>
						<span className="dot-separator">·</span>
						<a href="#">Privacy</a>
						<span className="dot-separator">·</span>
						<a href="#">Your Privacy Choices</a>
					</div>

					<div className="footer-bottom-right">
						<button className="language-btn">
							<img src="/img/stays/footer/footer 1.svg" className="globe-icon"/>
							<span>English (US)</span>
						</button>
						<button className="currency-btn">
							<span className="dollar-icon">$</span>
							<span>USD</span>
						</button>
						<a href="#"><img src="/img/stays/icons/Facebook.svg" alt="Facebook"/></a>
						<a href="#"><img src="/img/stays/icons/Twitter.svg" alt="Twitter"/></a>
						<a href="#"><img src="/img/stays/icons/Instagram.svg" alt="Instagram"/></a>
					</div>
				</div>
			</footer>
		)
	}

	if (isDetailsPage) {
		return (
			<footer className={`app-footer full details-footer`}>
				<div className="footer-content">
					<div className="footer-section">
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

					<div className="footer-section">
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

					<div className="footer-section">
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

				<div className="footer-bottom">
					<div className="footer-bottom-left">
						<p className="footer-copyright">© 2025 Bestbnb, Inc.</p>
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

					<div className="footer-bottom-right">
						<button className="language-btn">
							<img src="/img/stays/footer/footer 1.svg" className="globe-icon"/>
							<span>English (US)</span>
						</button>
						<button className="currency-btn">
							<span className="dollar-icon">$</span>
							<span>USD</span>
						</button>
						<a href="#"><img src="/img/stays/icons/Facebook.svg" alt="Facebook"/></a>
						<a href="#"><img src="/img/stays/icons/Twitter.svg" alt="Twitter"/></a>
						<a href="#"><img src="/img/stays/icons/Instagram.svg" alt="Instagram"/></a>
					</div>
				</div>
			</footer>
		)
	}

	return (
		<footer className="app-footer">
			<div className="footer-left">
				<p className="footer-copyright">© 2025 Bestbnb, Inc.</p>
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

			<SupportModal 
				isOpen={isSupportModalOpen}
				onClose={() => setIsSupportModalOpen(false)}
			/>
		</footer>
	)
}