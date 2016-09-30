window.onload = function() {
	new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve('success')
		}, 1000)
	})
	.then(result => {
		alert(result)
	})
}