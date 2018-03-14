const find = () => new Promise(resolve) resolve([{name: "Test", password: "test"}])
const findOneById = () => new Promise(resolve) resolve({name: "Test", password: "test"})

export { find, findOneById }