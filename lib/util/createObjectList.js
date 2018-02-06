// A list which holds ThreeJS "components"
module.exports = function (mainContainer) {
  const items = [];

  return {
    add,
    remove,
    update,
    clear,
    items
  };

  function add (item) {
    if (!item) throw new TypeError('must provide item');
    items.push(item);

    if (item.object3d) {
      mainContainer.add(item.object3d);
    }
    if (typeof item.onAdd === 'function') {
      item.onAdd();
    }
    return item;
  }

  function remove (item) {
    var idx = items.indexOf(item);
    if (idx === -1) return;
    items.splice(idx, 1);
    if (item.object3d) {
      mainContainer.remove(item.object3d);
    }
    if (typeof item.onRemove === 'function') {
      item.onRemove();
    }
    return item;
  }

  function update (dt, state) {
    items.forEach(function (item) {
      if (typeof item.update === 'function') {
        item.update(dt, state);
      }
    });
  }

  function clear () {
    for (var i = items.length - 1; i >= 0; i--) {
      remove(items[i]);
    }
  }
};
