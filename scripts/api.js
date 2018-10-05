const api = (function () {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/mary';

  const getItems = function (callback) {
    $.getJSON(`${BASE_URL}/bookmarks`, callback);
  };

  const createItem = function (title, url, desc, rating, uponSuccess, uponError) { //rich's api mentions "onSuccess/onError"
    const newItem = JSON.stringify({ title, url, desc, rating });
    $.ajax({
      url: `${BASE_URL}/bookmarks`,
      method: 'POST',
      contentType: 'application/json',
      data: newItem,
      success: uponSuccess,
      error: uponError
    });
  };
  const updateItem = function (id, updateData, callback) {
    $.ajax({
      url: BASE_URL + '/bookmarks/' + id,
      method: 'PATCH',
      contentType: 'application/json',
      data: JSON.stringify(updateData),
      success: callback
    });
  };
  const deleteItem = function (id, callback) {
    $.ajax({
      url: BASE_URL + '/bookmarks/' + id,
      method: 'DELETE',
      success: callback
    });
  };
  return {
    getItems,
    createItem,
    updateItem,
    deleteItem,
  };
}());