(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./modules/templates');

require('./modules/pointerEvents');
},{"./modules/pointerEvents":2,"./modules/templates":3}],2:[function(require,module,exports){
// Трансформ - движение
// scale - pinch
let scaleValue = 1

const hoover = document.querySelector('#hoover')

const pointerStatus = {}

var evCache = new Array()
var prevDiff = -1

function init() {
	// Install event handlers for the pointer target
	var el = document.getElementById('hoover')
	el.onpointerdown = pointerdown_handler
	el.onpointermove = pointermovehandler

	// Use same handler for pointer{up,cancel,out,leave} events since
	// the semantics for these events - in this app - are the same.
	el.onpointerup = pointerupHandler
	el.onpointercancel = pointerupHandler
	el.onpointerout = pointerupHandler
	el.onpointerleave = pointerupHandler
}

function pointerdown_handler(ev) {
	// The pointerdown event signals the start of a touch interaction.
	// This event is cached to support 2-finger gestures
	evCache.push(ev)
	log('pointerDown', ev)
}

function pointermovehandler(ev) {
	// This function implements a 2-pointer horizontal pinch/zoom gesture.
	//
	// If the distance between the two pointers has increased (zoom in),
	// the taget element's background is changed to "pink" and if the
	// distance is decreasing (zoom out), the color is changed to "lightblue".
	//
	// This function sets the target element's border to "dashed" to visually
	// indicate the pointer's target received a move event.
	log('pointerMove', ev)
	// ev.target.style.border = 'dashed'

	// Find this event in the cache and update its record with this event
	for (var i = 0; i < evCache.length; i++) {
		if (ev.pointerId == evCache[i].pointerId) {
			evCache[i] = ev
			break
		}
	}

	// If two pointers are down, check for pinch gestures
	if (evCache.length == 2) {
		// Calculate the distance between the two pointers
		var curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX)

		if (prevDiff > 0) {
			if (curDiff > prevDiff) {
				// The distance between the two pointers has increased

				if (scaleValue >= 1) scaleValue += 0.05
				// alert(value)
				log('Pinch moving OUT -> Zoom in', ev)
				ev.target.style.transform = `scale(${scaleValue})`
			}
			if (curDiff < prevDiff) {
				// The distance between the two pointers has decreased
				if (scaleValue >= 1) scaleValue -= 0.05
				if (scaleValue < 1) scaleValue = 1

				log('Pinch moving IN -> Zoom out', ev)
				ev.target.style.transform = `scale(${scaleValue})`
			}
		}

		// Cache the distance for the next move event
		prevDiff = curDiff
	}
}

function pointerupHandler(ev) {
	log(ev.type, ev)
	// Remove this pointer from the cache and reset the target's
	// background and border
	remove_event(ev)
	ev.target.style.background = 'white'
	// ev.target.style.border = '1px solid black'

	// If the number of pointers down is less than two then reset diff tracker
	if (evCache.length < 2) prevDiff = -1
}

// hoover.addEventListener('pointerdown', (event) => {
// 	pointerStatus[event.pointerId] = event
// 	console.log('da')

// 	hoover.addEventListener('pointerup', () => {
// 		delete pointerStatus[event.pointerId]
// 		console.log('deletes')
// 		console.log(pointerStatus)
// 	})

// 	// if (pointerStatus.pointerId[2]) {
// 	// }
// })

function remove_event(ev) {
	// Remove this event from the target's cache
	for (var i = 0; i < evCache.length; i++) {
		if (evCache[i].pointerId == ev.pointerId) {
			evCache.splice(i, 1)
			break
		}
	}
}

// Log events flag
var logEvents = false

// Logging/debugging functions
function enableLog(ev) {
	logEvents = logEvents ? false : true
}

function log(prefix, ev) {
	if (!logEvents) return
	var o = document.getElementsByTagName('output')[0]
	var s = prefix + ': pointerID = ' + ev.pointerId + ' ; pointerType = ' + ev.pointerType + ' ; isPrimary = ' + ev.isPrimary
	o.innerHTML += s + ' '
}

function clearLog(event) {
	var o = document.getElementsByTagName('output')[0]
	o.innerHTML = ''
}

document.body.onload = init()

},{}],3:[function(require,module,exports){
const eventsObject = {
	events: [
		{
			type: 'info',
			title: 'Еженедельный отчет по расходам ресурсов',
			source: 'Сенсоры потребления',
			time: '19:00, Сегодня',
			description: 'Так держать! За последнюю неделю вы потратили на 10% меньше ресурсов, чем неделей ранее.',
			icon: 'stats',
			data: {
				type: 'graph',
				values: [
					{
						electricity: [
							['1536883200', 115],
							['1536969600', 117],
							['1537056000', 117.2],
							['1537142400', 118],
							['1537228800', 120],
							['1537315200', 123],
							['1537401600', 129]
						]
					},
					{
						water: [
							['1536883200', 40],
							['1536969600', 40.2],
							['1537056000', 40.5],
							['1537142400', 41],
							['1537228800', 41.4],
							['1537315200', 41.9],
							['1537401600', 42.6]
						]
					},
					{
						gas: [
							['1536883200', 13],
							['1536969600', 13.2],
							['1537056000', 13.5],
							['1537142400', 13.7],
							['1537228800', 14],
							['1537315200', 14.2],
							['1537401600', 14.5]
						]
					}
				]
			},
			size: 'l'
		},
		{
			type: 'info',
			title: 'Дверь открыта',
			source: 'Сенсор входной двери',
			time: '18:50, Сегодня',
			description: null,
			icon: 'key',
			size: 's'
		},
		{
			type: 'info',
			title: 'Уборка закончена',
			source: 'Пылесос',
			time: '18:45, Сегодня',
			description: null,
			icon: 'robot-cleaner',
			size: 's'
		},
		{
			type: 'info',
			title: 'Новый пользователь',
			source: 'Роутер',
			time: '18:45, Сегодня',
			description: null,
			icon: 'router',
			size: 's'
		},
		{
			type: 'info',
			title: 'Изменен климатический режим',
			source: 'Сенсор микроклимата',
			time: '18:30, Сегодня',
			description: 'Установлен климатический режим «Фиджи»',
			icon: 'thermal',
			size: 'm',
			data: {
				temperature: 24,
				humidity: 80
			}
		},
		{
			type: 'critical',
			title: 'Невозможно включить кондиционер',
			source: 'Кондиционер',
			time: '18:21, Сегодня',
			description: 'В комнате открыто окно, закройте его и повторите попытку',
			icon: 'ac',
			size: 'm'
		},
		{
			type: 'info',
			title: 'Музыка включена',
			source: 'Яндекс.Станция',
			time: '18:16, Сегодня',
			description: 'Сейчас проигрывается:',
			icon: 'music',
			size: 'm',
			data: {
				albumcover: 'https://avatars.yandex.net/get-music-content/193823/1820a43e.a.5517056-1/m1000x1000',
				artist: 'Florence & The Machine',
				track: {
					name: 'Big God',
					length: '4:31'
				},
				volume: 80
			}
		},
		{
			type: 'info',
			title: 'Заканчивается молоко',
			source: 'Холодильник',
			time: '17:23, Сегодня',
			description: 'Кажется, в холодильнике заканчивается молоко. Вы хотите добавить его в список покупок?',
			icon: 'fridge',
			size: 'm',
			data: {
				buttons: ['Да', 'Нет']
			}
		},
		{
			type: 'info',
			title: 'Зарядка завершена',
			source: 'Оконный сенсор',
			time: '16:22, Сегодня',
			description: 'Ура! Устройство «Оконный сенсор» снова в строю!',
			icon: 'battery',
			size: 's'
		},
		{
			type: 'critical',
			title: 'Пылесос застрял',
			source: 'Сенсор движения',
			time: '16:17, Сегодня',
			description: 'Робопылесос не смог сменить свое местоположение в течение последних 3 минут. Похоже, ему нужна помощь.',
			icon: 'cam',
			data: {
				image: 'get_it_from_mocks_:3.jpg'
			},
			size: 'l'
		},
		{
			type: 'info',
			title: 'Вода вскипела',
			source: 'Чайник',
			time: '16:20, Сегодня',
			description: null,
			icon: 'kettle',
			size: 's'
		}
	]
}

const smallTemplate = document.querySelector('.card-template--small')
const mediumTemplate = document.querySelector('.card-template--medium')
const largeTemplate = document.querySelector('.card-template--large')

const contentWrap = document.querySelector('.content-wrap')

for (let i = 0; i < eventsObject.events.length; i++) {
	const thisItem = eventsObject.events[i]

	// Заполнение карточек содержимым
	switch (thisItem.size) {
		case 's':
			const smallClone = document.importNode(smallTemplate.content, true)
			smallClone.querySelector('.card__logo').src = `./assets/${thisItem.icon}.svg`
			smallClone.querySelector('.card__title').innerHTML = thisItem.title
			smallClone.querySelector('.card__source').innerHTML = thisItem.source
			smallClone.querySelector('.card__time').innerHTML = thisItem.time

			//Добавление карточки предупреждения
			if (thisItem.type === 'critical') {
				smallClone.querySelector('.card__header-wrap').classList.add('critical')
			}

			// Добавление описания
			if (thisItem.description) {
				smallClone.querySelector('.card__header-wrap').classList.add('have-description')
				const smallDescriptionContainer = document.createElement('div')
				const smallDescriptionParagraph = document.createElement('p')
				smallDescriptionContainer.appendChild(smallDescriptionParagraph)
				smallDescriptionParagraph.classList.add('card__description-paragraph', 'card__description-paragraph--small')
				smallDescriptionContainer.classList.add('card__description', 'card__description--small')
				smallDescriptionParagraph.innerHTML = thisItem.description
				smallClone.querySelector('.card').appendChild(smallDescriptionContainer)
			}
			contentWrap.appendChild(smallClone)
			break
		case 'm':
			const mediumClone = document.importNode(mediumTemplate.content, true)
			mediumClone.querySelector('.card__logo').src = `./assets/${thisItem.icon}.svg`
			mediumClone.querySelector('.card__title').innerHTML = thisItem.title
			mediumClone.querySelector('.card__source').innerHTML = thisItem.source
			mediumClone.querySelector('.card__time').innerHTML = thisItem.time

			//Добавление карточки предупреждения
			if (thisItem.type === 'critical') {
				mediumClone.querySelector('.card__header-wrap').classList.add('critical')
			}

			// Добавление описания
			if (thisItem.description) {
				mediumClone.querySelector('.card__header-wrap').classList.add('have-description')
				const mediumDescriptionContainer = document.createElement('div')
				const mediumDescriptionParagraph = document.createElement('p')
				mediumDescriptionContainer.appendChild(mediumDescriptionParagraph)
				mediumDescriptionParagraph.classList.add('card__description-paragraph', 'card__description-paragraph--medium')
				mediumDescriptionContainer.classList.add('card__description', 'card__description--medium')
				mediumDescriptionParagraph.innerHTML = thisItem.description
				mediumClone.querySelector('.card').appendChild(mediumDescriptionContainer)
			}

			if (thisItem.data) {
				if (thisItem.data.temperature && thisItem.data.humidity) {
					const mediumDataAir = document.createElement('div')
					mediumDataAir.classList.add('card__data', 'card__data--air')
					const mediumDataTemperature = document.createElement('p')
					mediumDataTemperature.innerHTML = `Температура: <b>${thisItem.data.temperature} С<b>`
					const mediumDataHumidity = document.createElement('p')
					mediumDataHumidity.innerHTML = `Влажность: <b>${thisItem.data.humidity} %<b>`
					mediumDataAir.appendChild(mediumDataTemperature)
					mediumDataAir.appendChild(mediumDataHumidity)
					mediumClone.querySelector('.card__description').appendChild(mediumDataAir)
				}

				if (thisItem.data.buttons) {
					const buttonsContainer = document.createElement('div')
					buttonsContainer.classList.add('card__data-buttons-container')
					const buttonYes = document.createElement('div')
					buttonYes.classList.add('card__data-button', 'card__data--button-yes')
					buttonYes.innerHTML = 'Да'
					const buttonNo = document.createElement('div')
					buttonNo.classList.add('card__data-button', 'card__data--button-no')
					buttonNo.innerHTML = 'Нет'
					buttonsContainer.appendChild(buttonYes)
					buttonsContainer.appendChild(buttonNo)
					mediumClone.querySelector('.card__description').appendChild(buttonsContainer)
				}

				if (thisItem.data.artist) {
					const musicPlayer = document.createElement('div')
					musicPlayer.classList.add('card__data-music-player')
					musicPlayer.innerHTML = `
								<div class="card__player">
									<div class="player">
										<div class="player__header">
											<div class="player__logo-container">
												<img src="${thisItem.data.albumcover}" alt="" class="player__logo">
											</div>
											<div class="player__trackinfo">
												<p class="player__name">${thisItem.data.artist} - ${thisItem.data.track.name}</p>
												<div class="player__track">
													<div class="player__trackline"></div>
													<p class="player__time">${thisItem.data.track.length}</p>
												</div>
											</div>
										</div>
										<div class="player__controls">
											<img src="./assets/prev.svg" alt="" class="player__control player__control--left">
											<img src="./assets/prev.svg" alt="" class="player__control player__control--right">
											<div class="player__volume"></div>
											<p class="player__volume-percent">${thisItem.data.volume} %</p>
										</div>
									</div>
								</div>`
					mediumClone.querySelector('.card__description').appendChild(musicPlayer)
				}
			}
			contentWrap.appendChild(mediumClone)
			break
		case 'l':
			const largeClone = document.importNode(largeTemplate.content, true)
			largeClone.querySelector('.card__logo').src = `./assets/${thisItem.icon}.svg`
			largeClone.querySelector('.card__title').innerHTML = thisItem.title
			largeClone.querySelector('.card__source').innerHTML = thisItem.source
			largeClone.querySelector('.card__time').innerHTML = thisItem.time

			//Добавление карточки предупреждения
			if (thisItem.type === 'critical') {
				largeClone.querySelector('.card__header-wrap').classList.add('critical')
			}

			// Добавление описания
			if (thisItem.description) {
				largeClone.querySelector('.card__header-wrap').classList.add('have-description')
				const largeDescriptionContainer = document.createElement('div')
				const largeDescriptionParagraph = document.createElement('p')
				largeDescriptionContainer.appendChild(largeDescriptionParagraph)
				largeDescriptionParagraph.classList.add('card__description-paragraph', 'card__description-paragraph--large')
				largeDescriptionContainer.classList.add('card__description', 'card__description--large')
				largeDescriptionParagraph.innerHTML = thisItem.description
				largeClone.querySelector('.card').appendChild(largeDescriptionContainer)
			}

			// Добавление картинки
			let largeDataImage
			if (thisItem.data.type === 'graph') {
				largeDataImage = document.createElement('div')
				largeDataImage.classList.add('card__image-container')
				largeDataImage.innerHTML = `<img
				src="./assets/richdata.svg"
				class="card__image">`
			}

			if (thisItem.data.image) {
				largeDataImage = document.createElement('div')
				largeDataImage.classList.add('card__image-container')
				largeDataImage.innerHTML = `<img
						class="card__image"
						id="hoover"
						srcset="./assets/bitmap.png 768w,
						./assets/bitmap2x.png 1366w,
						./assets/bitmap3x.png 1920w"
						src="./assets/bitmap2x.png">`
			}

			largeClone.querySelector('.card__description').appendChild(largeDataImage)
			contentWrap.appendChild(largeClone)
			break
	}
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3l1cnkvcHJvamVjdHMvc2hyaS0yMDE4LzAxLXJlc3BvbnNpdmUtbWFya3VwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS95dXJ5L3Byb2plY3RzL3NocmktMjAxOC8wMS1yZXNwb25zaXZlLW1hcmt1cC9zcmMvanMvZmFrZV9kYTEwYmQyZi5qcyIsIi9ob21lL3l1cnkvcHJvamVjdHMvc2hyaS0yMDE4LzAxLXJlc3BvbnNpdmUtbWFya3VwL3NyYy9qcy9tb2R1bGVzL3BvaW50ZXJFdmVudHMuanMiLCIvaG9tZS95dXJ5L3Byb2plY3RzL3NocmktMjAxOC8wMS1yZXNwb25zaXZlLW1hcmt1cC9zcmMvanMvbW9kdWxlcy90ZW1wbGF0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4vbW9kdWxlcy90ZW1wbGF0ZXMnKTtcblxucmVxdWlyZSgnLi9tb2R1bGVzL3BvaW50ZXJFdmVudHMnKTsiLCIvLyDQotGA0LDQvdGB0YTQvtGA0LwgLSDQtNCy0LjQttC10L3QuNC1XG4vLyBzY2FsZSAtIHBpbmNoXG5sZXQgc2NhbGVWYWx1ZSA9IDFcblxuY29uc3QgaG9vdmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2hvb3ZlcicpXG5cbmNvbnN0IHBvaW50ZXJTdGF0dXMgPSB7fVxuXG52YXIgZXZDYWNoZSA9IG5ldyBBcnJheSgpXG52YXIgcHJldkRpZmYgPSAtMVxuXG5mdW5jdGlvbiBpbml0KCkge1xuXHQvLyBJbnN0YWxsIGV2ZW50IGhhbmRsZXJzIGZvciB0aGUgcG9pbnRlciB0YXJnZXRcblx0dmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hvb3ZlcicpXG5cdGVsLm9ucG9pbnRlcmRvd24gPSBwb2ludGVyZG93bl9oYW5kbGVyXG5cdGVsLm9ucG9pbnRlcm1vdmUgPSBwb2ludGVybW92ZWhhbmRsZXJcblxuXHQvLyBVc2Ugc2FtZSBoYW5kbGVyIGZvciBwb2ludGVye3VwLGNhbmNlbCxvdXQsbGVhdmV9IGV2ZW50cyBzaW5jZVxuXHQvLyB0aGUgc2VtYW50aWNzIGZvciB0aGVzZSBldmVudHMgLSBpbiB0aGlzIGFwcCAtIGFyZSB0aGUgc2FtZS5cblx0ZWwub25wb2ludGVydXAgPSBwb2ludGVydXBIYW5kbGVyXG5cdGVsLm9ucG9pbnRlcmNhbmNlbCA9IHBvaW50ZXJ1cEhhbmRsZXJcblx0ZWwub25wb2ludGVyb3V0ID0gcG9pbnRlcnVwSGFuZGxlclxuXHRlbC5vbnBvaW50ZXJsZWF2ZSA9IHBvaW50ZXJ1cEhhbmRsZXJcbn1cblxuZnVuY3Rpb24gcG9pbnRlcmRvd25faGFuZGxlcihldikge1xuXHQvLyBUaGUgcG9pbnRlcmRvd24gZXZlbnQgc2lnbmFscyB0aGUgc3RhcnQgb2YgYSB0b3VjaCBpbnRlcmFjdGlvbi5cblx0Ly8gVGhpcyBldmVudCBpcyBjYWNoZWQgdG8gc3VwcG9ydCAyLWZpbmdlciBnZXN0dXJlc1xuXHRldkNhY2hlLnB1c2goZXYpXG5cdGxvZygncG9pbnRlckRvd24nLCBldilcbn1cblxuZnVuY3Rpb24gcG9pbnRlcm1vdmVoYW5kbGVyKGV2KSB7XG5cdC8vIFRoaXMgZnVuY3Rpb24gaW1wbGVtZW50cyBhIDItcG9pbnRlciBob3Jpem9udGFsIHBpbmNoL3pvb20gZ2VzdHVyZS5cblx0Ly9cblx0Ly8gSWYgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHR3byBwb2ludGVycyBoYXMgaW5jcmVhc2VkICh6b29tIGluKSxcblx0Ly8gdGhlIHRhZ2V0IGVsZW1lbnQncyBiYWNrZ3JvdW5kIGlzIGNoYW5nZWQgdG8gXCJwaW5rXCIgYW5kIGlmIHRoZVxuXHQvLyBkaXN0YW5jZSBpcyBkZWNyZWFzaW5nICh6b29tIG91dCksIHRoZSBjb2xvciBpcyBjaGFuZ2VkIHRvIFwibGlnaHRibHVlXCIuXG5cdC8vXG5cdC8vIFRoaXMgZnVuY3Rpb24gc2V0cyB0aGUgdGFyZ2V0IGVsZW1lbnQncyBib3JkZXIgdG8gXCJkYXNoZWRcIiB0byB2aXN1YWxseVxuXHQvLyBpbmRpY2F0ZSB0aGUgcG9pbnRlcidzIHRhcmdldCByZWNlaXZlZCBhIG1vdmUgZXZlbnQuXG5cdGxvZygncG9pbnRlck1vdmUnLCBldilcblx0Ly8gZXYudGFyZ2V0LnN0eWxlLmJvcmRlciA9ICdkYXNoZWQnXG5cblx0Ly8gRmluZCB0aGlzIGV2ZW50IGluIHRoZSBjYWNoZSBhbmQgdXBkYXRlIGl0cyByZWNvcmQgd2l0aCB0aGlzIGV2ZW50XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZXZDYWNoZS5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChldi5wb2ludGVySWQgPT0gZXZDYWNoZVtpXS5wb2ludGVySWQpIHtcblx0XHRcdGV2Q2FjaGVbaV0gPSBldlxuXHRcdFx0YnJlYWtcblx0XHR9XG5cdH1cblxuXHQvLyBJZiB0d28gcG9pbnRlcnMgYXJlIGRvd24sIGNoZWNrIGZvciBwaW5jaCBnZXN0dXJlc1xuXHRpZiAoZXZDYWNoZS5sZW5ndGggPT0gMikge1xuXHRcdC8vIENhbGN1bGF0ZSB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgdHdvIHBvaW50ZXJzXG5cdFx0dmFyIGN1ckRpZmYgPSBNYXRoLmFicyhldkNhY2hlWzBdLmNsaWVudFggLSBldkNhY2hlWzFdLmNsaWVudFgpXG5cblx0XHRpZiAocHJldkRpZmYgPiAwKSB7XG5cdFx0XHRpZiAoY3VyRGlmZiA+IHByZXZEaWZmKSB7XG5cdFx0XHRcdC8vIFRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSB0d28gcG9pbnRlcnMgaGFzIGluY3JlYXNlZFxuXG5cdFx0XHRcdGlmIChzY2FsZVZhbHVlID49IDEpIHNjYWxlVmFsdWUgKz0gMC4wNVxuXHRcdFx0XHQvLyBhbGVydCh2YWx1ZSlcblx0XHRcdFx0bG9nKCdQaW5jaCBtb3ZpbmcgT1VUIC0+IFpvb20gaW4nLCBldilcblx0XHRcdFx0ZXYudGFyZ2V0LnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgke3NjYWxlVmFsdWV9KWBcblx0XHRcdH1cblx0XHRcdGlmIChjdXJEaWZmIDwgcHJldkRpZmYpIHtcblx0XHRcdFx0Ly8gVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHR3byBwb2ludGVycyBoYXMgZGVjcmVhc2VkXG5cdFx0XHRcdGlmIChzY2FsZVZhbHVlID49IDEpIHNjYWxlVmFsdWUgLT0gMC4wNVxuXHRcdFx0XHRpZiAoc2NhbGVWYWx1ZSA8IDEpIHNjYWxlVmFsdWUgPSAxXG5cblx0XHRcdFx0bG9nKCdQaW5jaCBtb3ZpbmcgSU4gLT4gWm9vbSBvdXQnLCBldilcblx0XHRcdFx0ZXYudGFyZ2V0LnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgke3NjYWxlVmFsdWV9KWBcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBDYWNoZSB0aGUgZGlzdGFuY2UgZm9yIHRoZSBuZXh0IG1vdmUgZXZlbnRcblx0XHRwcmV2RGlmZiA9IGN1ckRpZmZcblx0fVxufVxuXG5mdW5jdGlvbiBwb2ludGVydXBIYW5kbGVyKGV2KSB7XG5cdGxvZyhldi50eXBlLCBldilcblx0Ly8gUmVtb3ZlIHRoaXMgcG9pbnRlciBmcm9tIHRoZSBjYWNoZSBhbmQgcmVzZXQgdGhlIHRhcmdldCdzXG5cdC8vIGJhY2tncm91bmQgYW5kIGJvcmRlclxuXHRyZW1vdmVfZXZlbnQoZXYpXG5cdGV2LnRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gJ3doaXRlJ1xuXHQvLyBldi50YXJnZXQuc3R5bGUuYm9yZGVyID0gJzFweCBzb2xpZCBibGFjaydcblxuXHQvLyBJZiB0aGUgbnVtYmVyIG9mIHBvaW50ZXJzIGRvd24gaXMgbGVzcyB0aGFuIHR3byB0aGVuIHJlc2V0IGRpZmYgdHJhY2tlclxuXHRpZiAoZXZDYWNoZS5sZW5ndGggPCAyKSBwcmV2RGlmZiA9IC0xXG59XG5cbi8vIGhvb3Zlci5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIChldmVudCkgPT4ge1xuLy8gXHRwb2ludGVyU3RhdHVzW2V2ZW50LnBvaW50ZXJJZF0gPSBldmVudFxuLy8gXHRjb25zb2xlLmxvZygnZGEnKVxuXG4vLyBcdGhvb3Zlci5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCAoKSA9PiB7XG4vLyBcdFx0ZGVsZXRlIHBvaW50ZXJTdGF0dXNbZXZlbnQucG9pbnRlcklkXVxuLy8gXHRcdGNvbnNvbGUubG9nKCdkZWxldGVzJylcbi8vIFx0XHRjb25zb2xlLmxvZyhwb2ludGVyU3RhdHVzKVxuLy8gXHR9KVxuXG4vLyBcdC8vIGlmIChwb2ludGVyU3RhdHVzLnBvaW50ZXJJZFsyXSkge1xuLy8gXHQvLyB9XG4vLyB9KVxuXG5mdW5jdGlvbiByZW1vdmVfZXZlbnQoZXYpIHtcblx0Ly8gUmVtb3ZlIHRoaXMgZXZlbnQgZnJvbSB0aGUgdGFyZ2V0J3MgY2FjaGVcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBldkNhY2hlLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKGV2Q2FjaGVbaV0ucG9pbnRlcklkID09IGV2LnBvaW50ZXJJZCkge1xuXHRcdFx0ZXZDYWNoZS5zcGxpY2UoaSwgMSlcblx0XHRcdGJyZWFrXG5cdFx0fVxuXHR9XG59XG5cbi8vIExvZyBldmVudHMgZmxhZ1xudmFyIGxvZ0V2ZW50cyA9IGZhbHNlXG5cbi8vIExvZ2dpbmcvZGVidWdnaW5nIGZ1bmN0aW9uc1xuZnVuY3Rpb24gZW5hYmxlTG9nKGV2KSB7XG5cdGxvZ0V2ZW50cyA9IGxvZ0V2ZW50cyA/IGZhbHNlIDogdHJ1ZVxufVxuXG5mdW5jdGlvbiBsb2cocHJlZml4LCBldikge1xuXHRpZiAoIWxvZ0V2ZW50cykgcmV0dXJuXG5cdHZhciBvID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ291dHB1dCcpWzBdXG5cdHZhciBzID0gcHJlZml4ICsgJzogcG9pbnRlcklEID0gJyArIGV2LnBvaW50ZXJJZCArICcgOyBwb2ludGVyVHlwZSA9ICcgKyBldi5wb2ludGVyVHlwZSArICcgOyBpc1ByaW1hcnkgPSAnICsgZXYuaXNQcmltYXJ5XG5cdG8uaW5uZXJIVE1MICs9IHMgKyAnICdcbn1cblxuZnVuY3Rpb24gY2xlYXJMb2coZXZlbnQpIHtcblx0dmFyIG8gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnb3V0cHV0JylbMF1cblx0by5pbm5lckhUTUwgPSAnJ1xufVxuXG5kb2N1bWVudC5ib2R5Lm9ubG9hZCA9IGluaXQoKVxuIiwiY29uc3QgZXZlbnRzT2JqZWN0ID0ge1xuXHRldmVudHM6IFtcblx0XHR7XG5cdFx0XHR0eXBlOiAnaW5mbycsXG5cdFx0XHR0aXRsZTogJ9CV0LbQtdC90LXQtNC10LvRjNC90YvQuSDQvtGC0YfQtdGCINC/0L4g0YDQsNGB0YXQvtC00LDQvCDRgNC10YHRg9GA0YHQvtCyJyxcblx0XHRcdHNvdXJjZTogJ9Ch0LXQvdGB0L7RgNGLINC/0L7RgtGA0LXQsdC70LXQvdC40Y8nLFxuXHRcdFx0dGltZTogJzE5OjAwLCDQodC10LPQvtC00L3RjycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ9Ci0LDQuiDQtNC10YDQttCw0YLRjCEg0JfQsCDQv9C+0YHQu9C10LTQvdGO0Y4g0L3QtdC00LXQu9GOINCy0Ysg0L/QvtGC0YDQsNGC0LjQu9C4INC90LAgMTAlINC80LXQvdGM0YjQtSDRgNC10YHRg9GA0YHQvtCyLCDRh9C10Lwg0L3QtdC00LXQu9C10Lkg0YDQsNC90LXQtS4nLFxuXHRcdFx0aWNvbjogJ3N0YXRzJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0dHlwZTogJ2dyYXBoJyxcblx0XHRcdFx0dmFsdWVzOiBbXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0ZWxlY3RyaWNpdHk6IFtcblx0XHRcdFx0XHRcdFx0WycxNTM2ODgzMjAwJywgMTE1XSxcblx0XHRcdFx0XHRcdFx0WycxNTM2OTY5NjAwJywgMTE3XSxcblx0XHRcdFx0XHRcdFx0WycxNTM3MDU2MDAwJywgMTE3LjJdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzcxNDI0MDAnLCAxMThdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzcyMjg4MDAnLCAxMjBdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzczMTUyMDAnLCAxMjNdLFxuXHRcdFx0XHRcdFx0XHRbJzE1Mzc0MDE2MDAnLCAxMjldXG5cdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR3YXRlcjogW1xuXHRcdFx0XHRcdFx0XHRbJzE1MzY4ODMyMDAnLCA0MF0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNjk2OTYwMCcsIDQwLjJdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzcwNTYwMDAnLCA0MC41XSxcblx0XHRcdFx0XHRcdFx0WycxNTM3MTQyNDAwJywgNDFdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzcyMjg4MDAnLCA0MS40XSxcblx0XHRcdFx0XHRcdFx0WycxNTM3MzE1MjAwJywgNDEuOV0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzQwMTYwMCcsIDQyLjZdXG5cdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRnYXM6IFtcblx0XHRcdFx0XHRcdFx0WycxNTM2ODgzMjAwJywgMTNdLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzY5Njk2MDAnLCAxMy4yXSxcblx0XHRcdFx0XHRcdFx0WycxNTM3MDU2MDAwJywgMTMuNV0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzE0MjQwMCcsIDEzLjddLFxuXHRcdFx0XHRcdFx0XHRbJzE1MzcyMjg4MDAnLCAxNF0sXG5cdFx0XHRcdFx0XHRcdFsnMTUzNzMxNTIwMCcsIDE0LjJdLFxuXHRcdFx0XHRcdFx0XHRbJzE1Mzc0MDE2MDAnLCAxNC41XVxuXHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XVxuXHRcdFx0fSxcblx0XHRcdHNpemU6ICdsJ1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0dHlwZTogJ2luZm8nLFxuXHRcdFx0dGl0bGU6ICfQlNCy0LXRgNGMINC+0YLQutGA0YvRgtCwJyxcblx0XHRcdHNvdXJjZTogJ9Ch0LXQvdGB0L7RgCDQstGF0L7QtNC90L7QuSDQtNCy0LXRgNC4Jyxcblx0XHRcdHRpbWU6ICcxODo1MCwg0KHQtdCz0L7QtNC90Y8nLFxuXHRcdFx0ZGVzY3JpcHRpb246IG51bGwsXG5cdFx0XHRpY29uOiAna2V5Jyxcblx0XHRcdHNpemU6ICdzJ1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0dHlwZTogJ2luZm8nLFxuXHRcdFx0dGl0bGU6ICfQo9Cx0L7RgNC60LAg0LfQsNC60L7QvdGH0LXQvdCwJyxcblx0XHRcdHNvdXJjZTogJ9Cf0YvQu9C10YHQvtGBJyxcblx0XHRcdHRpbWU6ICcxODo0NSwg0KHQtdCz0L7QtNC90Y8nLFxuXHRcdFx0ZGVzY3JpcHRpb246IG51bGwsXG5cdFx0XHRpY29uOiAncm9ib3QtY2xlYW5lcicsXG5cdFx0XHRzaXplOiAncydcblx0XHR9LFxuXHRcdHtcblx0XHRcdHR5cGU6ICdpbmZvJyxcblx0XHRcdHRpdGxlOiAn0J3QvtCy0YvQuSDQv9C+0LvRjNC30L7QstCw0YLQtdC70YwnLFxuXHRcdFx0c291cmNlOiAn0KDQvtGD0YLQtdGAJyxcblx0XHRcdHRpbWU6ICcxODo0NSwg0KHQtdCz0L7QtNC90Y8nLFxuXHRcdFx0ZGVzY3JpcHRpb246IG51bGwsXG5cdFx0XHRpY29uOiAncm91dGVyJyxcblx0XHRcdHNpemU6ICdzJ1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0dHlwZTogJ2luZm8nLFxuXHRcdFx0dGl0bGU6ICfQmNC30LzQtdC90LXQvSDQutC70LjQvNCw0YLQuNGH0LXRgdC60LjQuSDRgNC10LbQuNC8Jyxcblx0XHRcdHNvdXJjZTogJ9Ch0LXQvdGB0L7RgCDQvNC40LrRgNC+0LrQu9C40LzQsNGC0LAnLFxuXHRcdFx0dGltZTogJzE4OjMwLCDQodC10LPQvtC00L3RjycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ9Cj0YHRgtCw0L3QvtCy0LvQtdC9INC60LvQuNC80LDRgtC40YfQtdGB0LrQuNC5INGA0LXQttC40LwgwqvQpNC40LTQttC4wrsnLFxuXHRcdFx0aWNvbjogJ3RoZXJtYWwnLFxuXHRcdFx0c2l6ZTogJ20nLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHR0ZW1wZXJhdHVyZTogMjQsXG5cdFx0XHRcdGh1bWlkaXR5OiA4MFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0dHlwZTogJ2NyaXRpY2FsJyxcblx0XHRcdHRpdGxlOiAn0J3QtdCy0L7Qt9C80L7QttC90L4g0LLQutC70Y7Rh9C40YLRjCDQutC+0L3QtNC40YbQuNC+0L3QtdGAJyxcblx0XHRcdHNvdXJjZTogJ9Ca0L7QvdC00LjRhtC40L7QvdC10YAnLFxuXHRcdFx0dGltZTogJzE4OjIxLCDQodC10LPQvtC00L3RjycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ9CSINC60L7QvNC90LDRgtC1INC+0YLQutGA0YvRgtC+INC+0LrQvdC+LCDQt9Cw0LrRgNC+0LnRgtC1INC10LPQviDQuCDQv9C+0LLRgtC+0YDQuNGC0LUg0L/QvtC/0YvRgtC60YMnLFxuXHRcdFx0aWNvbjogJ2FjJyxcblx0XHRcdHNpemU6ICdtJ1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0dHlwZTogJ2luZm8nLFxuXHRcdFx0dGl0bGU6ICfQnNGD0LfRi9C60LAg0LLQutC70Y7Rh9C10L3QsCcsXG5cdFx0XHRzb3VyY2U6ICfQr9C90LTQtdC60YEu0KHRgtCw0L3RhtC40Y8nLFxuXHRcdFx0dGltZTogJzE4OjE2LCDQodC10LPQvtC00L3RjycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ9Ch0LXQudGH0LDRgSDQv9GA0L7QuNCz0YDRi9Cy0LDQtdGC0YHRjzonLFxuXHRcdFx0aWNvbjogJ211c2ljJyxcblx0XHRcdHNpemU6ICdtJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0YWxidW1jb3ZlcjogJ2h0dHBzOi8vYXZhdGFycy55YW5kZXgubmV0L2dldC1tdXNpYy1jb250ZW50LzE5MzgyMy8xODIwYTQzZS5hLjU1MTcwNTYtMS9tMTAwMHgxMDAwJyxcblx0XHRcdFx0YXJ0aXN0OiAnRmxvcmVuY2UgJiBUaGUgTWFjaGluZScsXG5cdFx0XHRcdHRyYWNrOiB7XG5cdFx0XHRcdFx0bmFtZTogJ0JpZyBHb2QnLFxuXHRcdFx0XHRcdGxlbmd0aDogJzQ6MzEnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZvbHVtZTogODBcblx0XHRcdH1cblx0XHR9LFxuXHRcdHtcblx0XHRcdHR5cGU6ICdpbmZvJyxcblx0XHRcdHRpdGxlOiAn0JfQsNC60LDQvdGH0LjQstCw0LXRgtGB0Y8g0LzQvtC70L7QutC+Jyxcblx0XHRcdHNvdXJjZTogJ9Cl0L7Qu9C+0LTQuNC70YzQvdC40LonLFxuXHRcdFx0dGltZTogJzE3OjIzLCDQodC10LPQvtC00L3RjycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ9Ca0LDQttC10YLRgdGPLCDQsiDRhdC+0LvQvtC00LjQu9GM0L3QuNC60LUg0LfQsNC60LDQvdGH0LjQstCw0LXRgtGB0Y8g0LzQvtC70L7QutC+LiDQktGLINGF0L7RgtC40YLQtSDQtNC+0LHQsNCy0LjRgtGMINC10LPQviDQsiDRgdC/0LjRgdC+0Log0L/QvtC60YPQv9C+0Lo/Jyxcblx0XHRcdGljb246ICdmcmlkZ2UnLFxuXHRcdFx0c2l6ZTogJ20nLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRidXR0b25zOiBbJ9CU0LAnLCAn0J3QtdGCJ11cblx0XHRcdH1cblx0XHR9LFxuXHRcdHtcblx0XHRcdHR5cGU6ICdpbmZvJyxcblx0XHRcdHRpdGxlOiAn0JfQsNGA0Y/QtNC60LAg0LfQsNCy0LXRgNGI0LXQvdCwJyxcblx0XHRcdHNvdXJjZTogJ9Ce0LrQvtC90L3Ri9C5INGB0LXQvdGB0L7RgCcsXG5cdFx0XHR0aW1lOiAnMTY6MjIsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAn0KPRgNCwISDQo9GB0YLRgNC+0LnRgdGC0LLQviDCq9Ce0LrQvtC90L3Ri9C5INGB0LXQvdGB0L7RgMK7INGB0L3QvtCy0LAg0LIg0YHRgtGA0L7RjiEnLFxuXHRcdFx0aWNvbjogJ2JhdHRlcnknLFxuXHRcdFx0c2l6ZTogJ3MnXG5cdFx0fSxcblx0XHR7XG5cdFx0XHR0eXBlOiAnY3JpdGljYWwnLFxuXHRcdFx0dGl0bGU6ICfQn9GL0LvQtdGB0L7RgSDQt9Cw0YHRgtGA0Y/QuycsXG5cdFx0XHRzb3VyY2U6ICfQodC10L3RgdC+0YAg0LTQstC40LbQtdC90LjRjycsXG5cdFx0XHR0aW1lOiAnMTY6MTcsINCh0LXQs9C+0LTQvdGPJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAn0KDQvtCx0L7Qv9GL0LvQtdGB0L7RgSDQvdC1INGB0LzQvtCzINGB0LzQtdC90LjRgtGMINGB0LLQvtC1INC80LXRgdGC0L7Qv9C+0LvQvtC20LXQvdC40LUg0LIg0YLQtdGH0LXQvdC40LUg0L/QvtGB0LvQtdC00L3QuNGFIDMg0LzQuNC90YPRgi4g0J/QvtGF0L7QttC1LCDQtdC80YMg0L3Rg9C20L3QsCDQv9C+0LzQvtGJ0YwuJyxcblx0XHRcdGljb246ICdjYW0nLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRpbWFnZTogJ2dldF9pdF9mcm9tX21vY2tzXzozLmpwZydcblx0XHRcdH0sXG5cdFx0XHRzaXplOiAnbCdcblx0XHR9LFxuXHRcdHtcblx0XHRcdHR5cGU6ICdpbmZvJyxcblx0XHRcdHRpdGxlOiAn0JLQvtC00LAg0LLRgdC60LjQv9C10LvQsCcsXG5cdFx0XHRzb3VyY2U6ICfQp9Cw0LnQvdC40LonLFxuXHRcdFx0dGltZTogJzE2OjIwLCDQodC10LPQvtC00L3RjycsXG5cdFx0XHRkZXNjcmlwdGlvbjogbnVsbCxcblx0XHRcdGljb246ICdrZXR0bGUnLFxuXHRcdFx0c2l6ZTogJ3MnXG5cdFx0fVxuXHRdXG59XG5cbmNvbnN0IHNtYWxsVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FyZC10ZW1wbGF0ZS0tc21hbGwnKVxuY29uc3QgbWVkaXVtVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FyZC10ZW1wbGF0ZS0tbWVkaXVtJylcbmNvbnN0IGxhcmdlVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FyZC10ZW1wbGF0ZS0tbGFyZ2UnKVxuXG5jb25zdCBjb250ZW50V3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50LXdyYXAnKVxuXG5mb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50c09iamVjdC5ldmVudHMubGVuZ3RoOyBpKyspIHtcblx0Y29uc3QgdGhpc0l0ZW0gPSBldmVudHNPYmplY3QuZXZlbnRzW2ldXG5cblx0Ly8g0JfQsNC/0L7Qu9C90LXQvdC40LUg0LrQsNGA0YLQvtGH0LXQuiDRgdC+0LTQtdGA0LbQuNC80YvQvFxuXHRzd2l0Y2ggKHRoaXNJdGVtLnNpemUpIHtcblx0XHRjYXNlICdzJzpcblx0XHRcdGNvbnN0IHNtYWxsQ2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHNtYWxsVGVtcGxhdGUuY29udGVudCwgdHJ1ZSlcblx0XHRcdHNtYWxsQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX2xvZ28nKS5zcmMgPSBgLi9hc3NldHMvJHt0aGlzSXRlbS5pY29ufS5zdmdgXG5cdFx0XHRzbWFsbENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX190aXRsZScpLmlubmVySFRNTCA9IHRoaXNJdGVtLnRpdGxlXG5cdFx0XHRzbWFsbENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19zb3VyY2UnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS5zb3VyY2Vcblx0XHRcdHNtYWxsQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX3RpbWUnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS50aW1lXG5cblx0XHRcdC8v0JTQvtCx0LDQstC70LXQvdC40LUg0LrQsNGA0YLQvtGH0LrQuCDQv9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNGPXG5cdFx0XHRpZiAodGhpc0l0ZW0udHlwZSA9PT0gJ2NyaXRpY2FsJykge1xuXHRcdFx0XHRzbWFsbENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19oZWFkZXItd3JhcCcpLmNsYXNzTGlzdC5hZGQoJ2NyaXRpY2FsJylcblx0XHRcdH1cblxuXHRcdFx0Ly8g0JTQvtCx0LDQstC70LXQvdC40LUg0L7Qv9C40YHQsNC90LjRj1xuXHRcdFx0aWYgKHRoaXNJdGVtLmRlc2NyaXB0aW9uKSB7XG5cdFx0XHRcdHNtYWxsQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX2hlYWRlci13cmFwJykuY2xhc3NMaXN0LmFkZCgnaGF2ZS1kZXNjcmlwdGlvbicpXG5cdFx0XHRcdGNvbnN0IHNtYWxsRGVzY3JpcHRpb25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRjb25zdCBzbWFsbERlc2NyaXB0aW9uUGFyYWdyYXBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG5cdFx0XHRcdHNtYWxsRGVzY3JpcHRpb25Db250YWluZXIuYXBwZW5kQ2hpbGQoc21hbGxEZXNjcmlwdGlvblBhcmFncmFwaClcblx0XHRcdFx0c21hbGxEZXNjcmlwdGlvblBhcmFncmFwaC5jbGFzc0xpc3QuYWRkKCdjYXJkX19kZXNjcmlwdGlvbi1wYXJhZ3JhcGgnLCAnY2FyZF9fZGVzY3JpcHRpb24tcGFyYWdyYXBoLS1zbWFsbCcpXG5cdFx0XHRcdHNtYWxsRGVzY3JpcHRpb25Db250YWluZXIuY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGVzY3JpcHRpb24nLCAnY2FyZF9fZGVzY3JpcHRpb24tLXNtYWxsJylcblx0XHRcdFx0c21hbGxEZXNjcmlwdGlvblBhcmFncmFwaC5pbm5lckhUTUwgPSB0aGlzSXRlbS5kZXNjcmlwdGlvblxuXHRcdFx0XHRzbWFsbENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkJykuYXBwZW5kQ2hpbGQoc21hbGxEZXNjcmlwdGlvbkNvbnRhaW5lcilcblx0XHRcdH1cblx0XHRcdGNvbnRlbnRXcmFwLmFwcGVuZENoaWxkKHNtYWxsQ2xvbmUpXG5cdFx0XHRicmVha1xuXHRcdGNhc2UgJ20nOlxuXHRcdFx0Y29uc3QgbWVkaXVtQ2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKG1lZGl1bVRlbXBsYXRlLmNvbnRlbnQsIHRydWUpXG5cdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fbG9nbycpLnNyYyA9IGAuL2Fzc2V0cy8ke3RoaXNJdGVtLmljb259LnN2Z2Bcblx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX190aXRsZScpLmlubmVySFRNTCA9IHRoaXNJdGVtLnRpdGxlXG5cdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fc291cmNlJykuaW5uZXJIVE1MID0gdGhpc0l0ZW0uc291cmNlXG5cdFx0XHRtZWRpdW1DbG9uZS5xdWVyeVNlbGVjdG9yKCcuY2FyZF9fdGltZScpLmlubmVySFRNTCA9IHRoaXNJdGVtLnRpbWVcblxuXHRcdFx0Ly/QlNC+0LHQsNCy0LvQtdC90LjQtSDQutCw0YDRgtC+0YfQutC4INC/0YDQtdC00YPQv9GA0LXQttC00LXQvdC40Y9cblx0XHRcdGlmICh0aGlzSXRlbS50eXBlID09PSAnY3JpdGljYWwnKSB7XG5cdFx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19oZWFkZXItd3JhcCcpLmNsYXNzTGlzdC5hZGQoJ2NyaXRpY2FsJylcblx0XHRcdH1cblxuXHRcdFx0Ly8g0JTQvtCx0LDQstC70LXQvdC40LUg0L7Qv9C40YHQsNC90LjRj1xuXHRcdFx0aWYgKHRoaXNJdGVtLmRlc2NyaXB0aW9uKSB7XG5cdFx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19oZWFkZXItd3JhcCcpLmNsYXNzTGlzdC5hZGQoJ2hhdmUtZGVzY3JpcHRpb24nKVxuXHRcdFx0XHRjb25zdCBtZWRpdW1EZXNjcmlwdGlvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdFx0XHRcdGNvbnN0IG1lZGl1bURlc2NyaXB0aW9uUGFyYWdyYXBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG5cdFx0XHRcdG1lZGl1bURlc2NyaXB0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKG1lZGl1bURlc2NyaXB0aW9uUGFyYWdyYXBoKVxuXHRcdFx0XHRtZWRpdW1EZXNjcmlwdGlvblBhcmFncmFwaC5jbGFzc0xpc3QuYWRkKCdjYXJkX19kZXNjcmlwdGlvbi1wYXJhZ3JhcGgnLCAnY2FyZF9fZGVzY3JpcHRpb24tcGFyYWdyYXBoLS1tZWRpdW0nKVxuXHRcdFx0XHRtZWRpdW1EZXNjcmlwdGlvbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjYXJkX19kZXNjcmlwdGlvbicsICdjYXJkX19kZXNjcmlwdGlvbi0tbWVkaXVtJylcblx0XHRcdFx0bWVkaXVtRGVzY3JpcHRpb25QYXJhZ3JhcGguaW5uZXJIVE1MID0gdGhpc0l0ZW0uZGVzY3JpcHRpb25cblx0XHRcdFx0bWVkaXVtQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmQnKS5hcHBlbmRDaGlsZChtZWRpdW1EZXNjcmlwdGlvbkNvbnRhaW5lcilcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXNJdGVtLmRhdGEpIHtcblx0XHRcdFx0aWYgKHRoaXNJdGVtLmRhdGEudGVtcGVyYXR1cmUgJiYgdGhpc0l0ZW0uZGF0YS5odW1pZGl0eSkge1xuXHRcdFx0XHRcdGNvbnN0IG1lZGl1bURhdGFBaXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRcdG1lZGl1bURhdGFBaXIuY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGF0YScsICdjYXJkX19kYXRhLS1haXInKVxuXHRcdFx0XHRcdGNvbnN0IG1lZGl1bURhdGFUZW1wZXJhdHVyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuXHRcdFx0XHRcdG1lZGl1bURhdGFUZW1wZXJhdHVyZS5pbm5lckhUTUwgPSBg0KLQtdC80L/QtdGA0LDRgtGD0YDQsDogPGI+JHt0aGlzSXRlbS5kYXRhLnRlbXBlcmF0dXJlfSDQoTxiPmBcblx0XHRcdFx0XHRjb25zdCBtZWRpdW1EYXRhSHVtaWRpdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcblx0XHRcdFx0XHRtZWRpdW1EYXRhSHVtaWRpdHkuaW5uZXJIVE1MID0gYNCS0LvQsNC20L3QvtGB0YLRjDogPGI+JHt0aGlzSXRlbS5kYXRhLmh1bWlkaXR5fSAlPGI+YFxuXHRcdFx0XHRcdG1lZGl1bURhdGFBaXIuYXBwZW5kQ2hpbGQobWVkaXVtRGF0YVRlbXBlcmF0dXJlKVxuXHRcdFx0XHRcdG1lZGl1bURhdGFBaXIuYXBwZW5kQ2hpbGQobWVkaXVtRGF0YUh1bWlkaXR5KVxuXHRcdFx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19kZXNjcmlwdGlvbicpLmFwcGVuZENoaWxkKG1lZGl1bURhdGFBaXIpXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodGhpc0l0ZW0uZGF0YS5idXR0b25zKSB7XG5cdFx0XHRcdFx0Y29uc3QgYnV0dG9uc0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdFx0XHRcdFx0YnV0dG9uc0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjYXJkX19kYXRhLWJ1dHRvbnMtY29udGFpbmVyJylcblx0XHRcdFx0XHRjb25zdCBidXR0b25ZZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRcdGJ1dHRvblllcy5jbGFzc0xpc3QuYWRkKCdjYXJkX19kYXRhLWJ1dHRvbicsICdjYXJkX19kYXRhLS1idXR0b24teWVzJylcblx0XHRcdFx0XHRidXR0b25ZZXMuaW5uZXJIVE1MID0gJ9CU0LAnXG5cdFx0XHRcdFx0Y29uc3QgYnV0dG9uTm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRcdGJ1dHRvbk5vLmNsYXNzTGlzdC5hZGQoJ2NhcmRfX2RhdGEtYnV0dG9uJywgJ2NhcmRfX2RhdGEtLWJ1dHRvbi1ubycpXG5cdFx0XHRcdFx0YnV0dG9uTm8uaW5uZXJIVE1MID0gJ9Cd0LXRgidcblx0XHRcdFx0XHRidXR0b25zQ29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvblllcylcblx0XHRcdFx0XHRidXR0b25zQ29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvbk5vKVxuXHRcdFx0XHRcdG1lZGl1bUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19kZXNjcmlwdGlvbicpLmFwcGVuZENoaWxkKGJ1dHRvbnNDb250YWluZXIpXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodGhpc0l0ZW0uZGF0YS5hcnRpc3QpIHtcblx0XHRcdFx0XHRjb25zdCBtdXNpY1BsYXllciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdFx0XHRcdFx0bXVzaWNQbGF5ZXIuY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGF0YS1tdXNpYy1wbGF5ZXInKVxuXHRcdFx0XHRcdG11c2ljUGxheWVyLmlubmVySFRNTCA9IGBcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZF9fcGxheWVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGxheWVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX2hlYWRlclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX2xvZ28tY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIiR7dGhpc0l0ZW0uZGF0YS5hbGJ1bWNvdmVyfVwiIGFsdD1cIlwiIGNsYXNzPVwicGxheWVyX19sb2dvXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBsYXllcl9fdHJhY2tpbmZvXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8cCBjbGFzcz1cInBsYXllcl9fbmFtZVwiPiR7dGhpc0l0ZW0uZGF0YS5hcnRpc3R9IC0gJHt0aGlzSXRlbS5kYXRhLnRyYWNrLm5hbWV9PC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBsYXllcl9fdHJhY2tcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBsYXllcl9fdHJhY2tsaW5lXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxwIGNsYXNzPVwicGxheWVyX190aW1lXCI+JHt0aGlzSXRlbS5kYXRhLnRyYWNrLmxlbmd0aH08L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfX2NvbnRyb2xzXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuL2Fzc2V0cy9wcmV2LnN2Z1wiIGFsdD1cIlwiIGNsYXNzPVwicGxheWVyX19jb250cm9sIHBsYXllcl9fY29udHJvbC0tbGVmdFwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi9hc3NldHMvcHJldi5zdmdcIiBhbHQ9XCJcIiBjbGFzcz1cInBsYXllcl9fY29udHJvbCBwbGF5ZXJfX2NvbnRyb2wtLXJpZ2h0XCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBsYXllcl9fdm9sdW1lXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJwbGF5ZXJfX3ZvbHVtZS1wZXJjZW50XCI+JHt0aGlzSXRlbS5kYXRhLnZvbHVtZX0gJTwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5gXG5cdFx0XHRcdFx0bWVkaXVtQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX2Rlc2NyaXB0aW9uJykuYXBwZW5kQ2hpbGQobXVzaWNQbGF5ZXIpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGNvbnRlbnRXcmFwLmFwcGVuZENoaWxkKG1lZGl1bUNsb25lKVxuXHRcdFx0YnJlYWtcblx0XHRjYXNlICdsJzpcblx0XHRcdGNvbnN0IGxhcmdlQ2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKGxhcmdlVGVtcGxhdGUuY29udGVudCwgdHJ1ZSlcblx0XHRcdGxhcmdlQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX2xvZ28nKS5zcmMgPSBgLi9hc3NldHMvJHt0aGlzSXRlbS5pY29ufS5zdmdgXG5cdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX190aXRsZScpLmlubmVySFRNTCA9IHRoaXNJdGVtLnRpdGxlXG5cdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19zb3VyY2UnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS5zb3VyY2Vcblx0XHRcdGxhcmdlQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX3RpbWUnKS5pbm5lckhUTUwgPSB0aGlzSXRlbS50aW1lXG5cblx0XHRcdC8v0JTQvtCx0LDQstC70LXQvdC40LUg0LrQsNGA0YLQvtGH0LrQuCDQv9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNGPXG5cdFx0XHRpZiAodGhpc0l0ZW0udHlwZSA9PT0gJ2NyaXRpY2FsJykge1xuXHRcdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19oZWFkZXItd3JhcCcpLmNsYXNzTGlzdC5hZGQoJ2NyaXRpY2FsJylcblx0XHRcdH1cblxuXHRcdFx0Ly8g0JTQvtCx0LDQstC70LXQvdC40LUg0L7Qv9C40YHQsNC90LjRj1xuXHRcdFx0aWYgKHRoaXNJdGVtLmRlc2NyaXB0aW9uKSB7XG5cdFx0XHRcdGxhcmdlQ2xvbmUucXVlcnlTZWxlY3RvcignLmNhcmRfX2hlYWRlci13cmFwJykuY2xhc3NMaXN0LmFkZCgnaGF2ZS1kZXNjcmlwdGlvbicpXG5cdFx0XHRcdGNvbnN0IGxhcmdlRGVzY3JpcHRpb25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRjb25zdCBsYXJnZURlc2NyaXB0aW9uUGFyYWdyYXBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG5cdFx0XHRcdGxhcmdlRGVzY3JpcHRpb25Db250YWluZXIuYXBwZW5kQ2hpbGQobGFyZ2VEZXNjcmlwdGlvblBhcmFncmFwaClcblx0XHRcdFx0bGFyZ2VEZXNjcmlwdGlvblBhcmFncmFwaC5jbGFzc0xpc3QuYWRkKCdjYXJkX19kZXNjcmlwdGlvbi1wYXJhZ3JhcGgnLCAnY2FyZF9fZGVzY3JpcHRpb24tcGFyYWdyYXBoLS1sYXJnZScpXG5cdFx0XHRcdGxhcmdlRGVzY3JpcHRpb25Db250YWluZXIuY2xhc3NMaXN0LmFkZCgnY2FyZF9fZGVzY3JpcHRpb24nLCAnY2FyZF9fZGVzY3JpcHRpb24tLWxhcmdlJylcblx0XHRcdFx0bGFyZ2VEZXNjcmlwdGlvblBhcmFncmFwaC5pbm5lckhUTUwgPSB0aGlzSXRlbS5kZXNjcmlwdGlvblxuXHRcdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkJykuYXBwZW5kQ2hpbGQobGFyZ2VEZXNjcmlwdGlvbkNvbnRhaW5lcilcblx0XHRcdH1cblxuXHRcdFx0Ly8g0JTQvtCx0LDQstC70LXQvdC40LUg0LrQsNGA0YLQuNC90LrQuFxuXHRcdFx0bGV0IGxhcmdlRGF0YUltYWdlXG5cdFx0XHRpZiAodGhpc0l0ZW0uZGF0YS50eXBlID09PSAnZ3JhcGgnKSB7XG5cdFx0XHRcdGxhcmdlRGF0YUltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0bGFyZ2VEYXRhSW1hZ2UuY2xhc3NMaXN0LmFkZCgnY2FyZF9faW1hZ2UtY29udGFpbmVyJylcblx0XHRcdFx0bGFyZ2VEYXRhSW1hZ2UuaW5uZXJIVE1MID0gYDxpbWdcblx0XHRcdFx0c3JjPVwiLi9hc3NldHMvcmljaGRhdGEuc3ZnXCJcblx0XHRcdFx0Y2xhc3M9XCJjYXJkX19pbWFnZVwiPmBcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXNJdGVtLmRhdGEuaW1hZ2UpIHtcblx0XHRcdFx0bGFyZ2VEYXRhSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRsYXJnZURhdGFJbWFnZS5jbGFzc0xpc3QuYWRkKCdjYXJkX19pbWFnZS1jb250YWluZXInKVxuXHRcdFx0XHRsYXJnZURhdGFJbWFnZS5pbm5lckhUTUwgPSBgPGltZ1xuXHRcdFx0XHRcdFx0Y2xhc3M9XCJjYXJkX19pbWFnZVwiXG5cdFx0XHRcdFx0XHRpZD1cImhvb3ZlclwiXG5cdFx0XHRcdFx0XHRzcmNzZXQ9XCIuL2Fzc2V0cy9iaXRtYXAucG5nIDc2OHcsXG5cdFx0XHRcdFx0XHQuL2Fzc2V0cy9iaXRtYXAyeC5wbmcgMTM2NncsXG5cdFx0XHRcdFx0XHQuL2Fzc2V0cy9iaXRtYXAzeC5wbmcgMTkyMHdcIlxuXHRcdFx0XHRcdFx0c3JjPVwiLi9hc3NldHMvYml0bWFwMngucG5nXCI+YFxuXHRcdFx0fVxuXG5cdFx0XHRsYXJnZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkX19kZXNjcmlwdGlvbicpLmFwcGVuZENoaWxkKGxhcmdlRGF0YUltYWdlKVxuXHRcdFx0Y29udGVudFdyYXAuYXBwZW5kQ2hpbGQobGFyZ2VDbG9uZSlcblx0XHRcdGJyZWFrXG5cdH1cbn1cbiJdfQ==
