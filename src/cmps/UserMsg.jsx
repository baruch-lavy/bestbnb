import { eventBus, showSuccessMsg } from '../services/event-bus.service'
import { useState, useEffect, useRef } from 'react'
import { socketService, SOCKET_EVENT_NEW_ORDER_MSG } from '../services/socket.service'
import { OrderStatusModal } from './OrderStatusModal'

export function UserMsg() {
	const [statusModal, setStatusModal] = useState(null)
	const [msg, setMsg] = useState(null)
	const timeoutIdRef = useRef()

	useEffect(() => {
		const unsubscribe = eventBus.on('show-msg', msg => {
			setMsg(msg)
			if (timeoutIdRef.current) {
				timeoutIdRef.current = null
				clearTimeout(timeoutIdRef.current)
			}
			timeoutIdRef.current = setTimeout(closeMsg, 3000)
		})

		socketService.on(SOCKET_EVENT_NEW_ORDER_MSG, order => {
			setStatusModal(order)
		})

		return () => {
			unsubscribe()
			socketService.off(SOCKET_EVENT_NEW_ORDER_MSG)
		}
	}, [])

	function closeMsg() {
		setMsg(null)
	}

	function msgClass() {
		return msg ? 'visible' : ''
	}
	return (
		<>
			{statusModal ? (
				<OrderStatusModal
					order={statusModal}
					onClose={() => setStatusModal(null)}
				/>
			) : (
				<section className={`user-msg ${msg?.type} ${msgClass()}`}>
					<button onClick={closeMsg}>x</button>
					{msg?.txt}
				</section>
			)}
		</>)
}
