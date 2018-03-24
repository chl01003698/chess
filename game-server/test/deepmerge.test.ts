import * as deepmerge from 'deepmerge'

var x = {
	foo: { bar: 3 },
	array: [1, 2, 3]
}

var y = {
	foo: { baz: 4 },
	quux: 5,
	array: [3, 4, 5]
}

console.log(deepmerge(x, y))