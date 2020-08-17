export const createCommentItems = (items) => {
  return items.reduce((result, item) => {
    const {emoji, text, author, day} = item;

    const commentDayFormat = day.toLocaleString(`en-ZA`, {year: `numeric`, month: `numeric`, day: `numeric`, hour: `numeric`, minute: `numeric`});

    result += `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${commentDayFormat}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
        </div>
    </li>`;

    return result;
  }, ``);
};
