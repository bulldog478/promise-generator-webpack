window.onload = function() {
	function * genFn() {
		var ret1 = yield "something";
		var ret2 = yield new Promise((resolve, reject)=>{
			resolve(ret1);
		});
		yield console.log(ret2); //2. get Promise
		return "done";
	}

	var gener = genFn();
	var g1 = gener.next();
	console.log(g1.value);   //1. something
	var g2 = gener.next("success");
	g2.value.then(result=>{
		console.log(result); //4.success
	});
	var g3 = gener.next("get Promise")
	var g4 = gener.next()
	console.log(g4.value) //3. done
}