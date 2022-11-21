const fs = require('fs');

// CRUDL : CREATE, READ, UPDATE, DELETE, LIST

const gToys = require('../data/toy.json');

const PAGE_SIZE = 3;

function query(filterBy) {
  var toys = _filterToys(filterBy);

  // if (filterBy.page) {
  //   startIdx = filterBy.page * PAGE_SIZE;
  //   toys = toys.slice(startIdx, startIdx + PAGE_SIZE);
  // }
  return Promise.resolve(toys);
}

function getById(toyId) {
  const toy = gToys.find((toy) => toy._id === toyId);
  if (!toy) return Promise.reject('No Such Toy');
  return Promise.resolve(toy);
}

function remove(toyId) {
  const idx = gToys.findIndex((toy) => toy._id === toyId);
  if (idx === -1) return Promise.reject('No such toy');
  gToys.splice(idx, 1);
  return _saveToysToFile();
}

function save(toyToSave) {
  //   const toyToSave = {
  //     _id,
  //     vendor,
  //     maxSpeed,
  //     owner,
  //   };

  if (toyToSave._id) {
    //update
    const idx = gToys.findIndex((toy) => toy._id === toyToSave._id);
    if (idx === -1) return Promise.reject('No such toy');
    gToys[idx] = toyToSave;
  } else {
    // CREATE
    toyToSave._id = _makeId();
    toyToSave.createdAt = Date.now(); //new Date(Date.now()).toLocaleString();
    gToys.unshift(toyToSave);
  }
  return _saveToysToFile().then(() => toyToSave);
}

function _saveToysToFile() {
  return new Promise((resolve, reject) => {
    fs.writeFile('data/toy.json', JSON.stringify(gToys, null, 2), (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function _makeId(length = 5) {
  var txt = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return txt;
}

function _filterToys(filterBy) {
  var toys = gToys;
  let filteredToys = [];

  const regex = new RegExp(filterBy.name, 'i');

  // filter by name
  filteredToys = toys.filter((toy) => regex.test(toy.name));

  // filter by inStock
  if (filterBy.inStock) {
    filteredToys = filteredToys.filter(
      (toy) => JSON.parse(toy.inStock) === JSON.parse(filterBy.inStock)
    );
  }

  // filter by lables
  if (filterBy.lable) {
    filteredToys = filteredToys.filter((toy) =>
      toy.labels.includes(filterBy.lable)
    );
  }

  // Sorting
  if (filterBy.sortBy) {
    if (filterBy.sortBy === 'time')
      filteredToys = filteredToys.sort((t1, t2) => t1.createdAt - t2.createdAt);
    else if (filterBy.sortBy === 'price')
      filteredToys = filteredToys.sort((t1, t2) => t1.price - t2.price);
    else if (filterBy.sortBy === 'name')
      filteredToys = filteredToys.sort((t1, t2) =>
        t1.name.toLowerCase() > t2.name.toLowerCase() ? 1 : -1
      );
  }

  return filteredToys;
}

module.exports = {
  query,
  getById,
  remove,
  save,
};
