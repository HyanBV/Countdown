const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeEl = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = Date;
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

//Set Date Input Min With Today's Date
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

//Populate Countdown & Complete UI
updateDOM = () => {
	countdownActive = setInterval(() => {
		const now = new Date().getTime();
		const d = countdownValue - now;

		const days = Math.floor(d / day);
		const hours = Math.floor((d % day) / hour);
		const minutes = Math.floor((d % hour) / minute);
		const seconds = Math.floor((d % minute) / second);

		//Hide Input
		inputContainer.hidden = true;

		//If the countdown has ended & show completion
		if (d < 0) {
			countdownEl.hidden = true;
			clearInterval(countdownActive);
			completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
			completeEl.hidden = false;
		} else {
			//Else, show countdown in progress
			//Populating Countdown
			countdownElTitle.textContent = `${countdownTitle}`;
			timeEl[0].textContent = `${days}`;
			timeEl[1].textContent = `${hours}`;
			timeEl[2].textContent = `${minutes}`;
			timeEl[3].textContent = `${seconds}`;
			completeEl.hidden = true;
			countdownEl.hidden = false;
		}
	}, second);
}

//Take Values from Form Input
updateCountdown = (e) => {
	e.preventDefault();
	countdownTitle = e.srcElement[0].value;
	countdownDate = e.srcElement[1].value;
	savedCountdown = {
		title: countdownTitle,
		date: countdownDate,
	};
	localStorage.setItem('countdown', JSON.stringify(savedCountdown));
	//Get number version of current Date & updating DOM
	countdownValue = new Date(countdownDate).getTime();
	updateDOM();
}

//Reset All Values
reset = () => {
	//Hide Countdowns & Show Input
	countdownEl.hidden = true;
	completeEl.hidden = true;
	inputContainer.hidden = false;

	//Stop Countdown
	clearInterval(countdownActive);

	//Reset Values
	countdownTitle = '';
	countdownDate = '';
	localStorage.removeItem('countdown');
}

restorePreviousCountdown = () => {

	//Get countdown from localStorage if available
	if (localStorage.getItem('countdown')) {
		inputContainer.hidden = true;
		savedCountdown = JSON.parse(localStorage.getItem('countdown'));
		countdownTitle = savedCountdown.title;
		countdownDate = savedCountdown.date;
		countdownValue = new Date(countdownDate).getTime();
		updateDOM();
	}
}

//Event Listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

//On Load, check localStorage
restorePreviousCountdown();