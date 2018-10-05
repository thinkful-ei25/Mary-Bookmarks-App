// eslint-disable-next-line no-unused-vars
const store = (function () {

  const addItem = function (item) {
    this.items.push(item);
    item.expanded = false;
  };

  const findById = function (id) {
    return this.items.find(item => item.id === id);
  };

  const findAndDelete = function (id) {
    this.items = this.items.filter(item => item.id !== id);
  };
  const toggleExpandedKey = function (id) {
    const obj = this.items.find(item => item.id === id);
    obj.expanded = !obj.expanded;
  };

  const toggleAddingItem = function () {
    this.addingItem = !this.addingItem
  };
  const setError = function (error) {
    this.error = error;
  };

  return {
    items: [],
    addingItem: false,
    currentRatingSelection: null,
    error: null,

    toggleExpandedKey,
    addItem,
    setError,
    findById,
    findAndDelete,
    toggleAddingItem,
  };
}())
