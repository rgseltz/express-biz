function todayDate() {
	let date = new Date();
	let month = date.getMonth();
	let day = date.getDay();
	let year = date.getFullYear();
	return `${month}-${day}-${year}`;
}

module.exports = todayDate;
