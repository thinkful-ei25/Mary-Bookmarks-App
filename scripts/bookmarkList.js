/* global store, api, $ */

// eslint-disable-next-line no-unused-vars
const bookmarklist = (function () {

  const btn = document.getElementById('showhide');

  function generateError(err) {
    let message = '';
    if (err.responseJSON && err.responseJSON.message) {
      message = err.responseJSON.message;
    } else {
      message = `${err.code} Server Error`;
    }

    return `
      <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `;
  }

  function generateItemElement(item) {
    if (!item.expanded) {
      return `
    <li class="bookmark-id" data-item-id="${item.id}">
    <p id="title">${item.title}</p>
    <p>Rating: ${item.rating}</p>
    </li>`
    }
    else {
      return `<li class="bookmark-id" data-item-id="${item.id}">
    <p id="title">${item.title}</p>
    <p>Rating: ${item.rating}</p>
    <p>Link to Site: <a href="${item.url}">${item.url}</a></p>
    <p>Long Description: <br>
    ${item.desc}</p>
    <button class="delete-bookmark-button"><span class="button-label">
    DELETE</span></button>
    </li>`;
    }
  };

  function generateBookmarkItemsString(bookmarklist) {
    const items = bookmarklist.map((item) => generateItemElement(item));
    return items.join('');
  }
  /////////////////////////////////////////////////////////////////
  function render() {
    console.log('render ran');

    if (store.error) {
      const el = generateError(store.error);
      $('.error-container').html(el);
    } else {
      $('.error-container').empty();
    }

    let items = store.items;

    if (store.currentRatingSelection >= 1) {
      items = store.items.filter(bookmark => bookmark.rating >= store.currentRatingSelection);
    }

    btn.innerText = 'ADD BOOKMARK+';

    if (store.addingItem) {
      btn.innerText = 'CANCEL'
      $('#bookmark-form').show();
    }
    else {
      btn.innerText = 'ADD BOOKMARK+'
      $('#bookmark-form').hide();
    }
    const bookmarklistItemsString = generateBookmarkItemsString(items);
    $('.bookmark-list').html(bookmarklistItemsString);
  }

  function getItemIdFromElement(item) {
    return $(item).closest('.bookmark-id').data('item-id');
  }

  function handleAddBookmarkClicked() {
    $('#showhide').on('click', function () {
      store.addingItem = !store.addingItem;
      render();
    });
  };

  function handleDeleteItemClicked() {
    $('.bookmark-list').on('click', '.delete-bookmark-button', event => {
      const id = getItemIdFromElement(event.target);
      console.log(id);
      api.deleteItem(id, () => {
        store.findAndDelete(id);
        render();
      });
    });
  }
  function handleCloseError() {
    $('.error-container').on('click', '#cancel-error', () => {
      store.setError(null);
      render();
    })
  };

  function handleBookmarkSubmit() {
    $('#bookmark-form').submit(function (event) {
      event.preventDefault();
      const bookmarkTitle = $('.bookmark-title-input').val();
      $('.bookmark-title-input').val('');
      const bookmarkURL = $('.bookmark-url-input').val();
      $('.bookmark-url-input').val('');
      const bookmarkDesc = $('.bookmark-desc-input').val();
      $('.bookmark-desc-input').val('');
      const bookmarkRating = parseInt($('.bookmark-rating-input').val(), 10);
      $('.bookmark-rating-input').val('');
      api.createItem(bookmarkTitle, bookmarkURL, bookmarkDesc, bookmarkRating, response => {
        store.addItem(response);
        render();
      },
        err => {
          console.log(err)
          store.setError(err);
          render();
        })
    })
  };

  function toggleExpandBookmark(title) {
    const foundBookmark = store.items.find(bookmark => bookmark.title === title);

    foundBookmark.expanded = !foundBookmark.expanded;
    render();
  };

  function handleBookmarkClicked() {
    $('.bookmark-list').on('click', 'li', function (event) {

      const title = $(this).find('#title').text()

      toggleExpandBookmark(title);
      render();
    }
    )
  };

  function handleRatingFilterClicked() {
    $('.min-rating').on('click', function () {
      const selection = parseInt($(this).val(), 10);
      store.currentRatingSelection = selection;
      render();
    });
  }

  function bindEventListeners() {
    handleDeleteItemClicked();
    handleCloseError();
    handleBookmarkClicked();
    handleAddBookmarkClicked()
    handleBookmarkSubmit();
    handleRatingFilterClicked();
  }

  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
}());
