import he from "he";
import {EMOJIS} from "../const.js";
import {formatCommentDate} from "../utils/film-card.js";

const createCommentItems = (items) => {
  return items.reduce((result, item) => {
    const {id, emoji, text, author, day} = item;

    result += `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${formatCommentDate(day)}</span>
          <button class="film-details__comment-delete" data-comment-id = "${id}">Delete</button>
        </p>
        </div>
    </li>`;

    return result;
  }, ``);
};

const createEmojiListTemplate = (emotion) => {

  return EMOJIS.map((emoji) => (
    `<input class="film-details__emoji-item visually-hidden"
            name="comment-emoji"
            type="radio"
            id="emoji-${emoji}"
            value="${emoji}"
            ${emoji === emotion ? `checked` : ``}>
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label>`
  )).join(``);
};

export const createCommentsTemplate = (comments, emoji, text) => {
  const commentMarkup = createCommentItems(comments);
  const emojiListMarkup = createEmojiListTemplate();

  return (
    `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
    <ul class="film-details__comments-list">
    ${commentMarkup}
  </ul>
  <div class="film-details__new-comment">
    <div for="add-emoji" class="film-details__add-emoji-label">
    ${emoji ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">` : ``}</div>
    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(text)}</textarea>
    </label>
    <div class="film-details__emoji-list">
    ${emojiListMarkup}
    </div>
  </div>
  </section>`
  );
};
