import UserProfileView from '../view/user-profile.js';
import {render, replace, remove} from "../utils/render.js";

export default class UserProfile {
  constructor(profileContainer, moviesModel) {
    this._moviesModel = moviesModel;
    this._profileContainer = profileContainer;
    this._userProfileComponent = null;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._moviesModel.addObserver(this._handleModelEvent);
  }

  init() {
    const quantityOfWatched = ([...this._moviesModel.getMovies()].filter((movie)=>movie.isWatched)).length;
    const prevUserProfileComponent = this._userProfileComponent;

    this._userProfileComponent = new UserProfileView(quantityOfWatched);

    if (prevUserProfileComponent === null) {
      render(this._profileContainer, this._userProfileComponent);
      return;
    }

    replace(this._userProfileComponent, prevUserProfileComponent);
    remove(prevUserProfileComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
