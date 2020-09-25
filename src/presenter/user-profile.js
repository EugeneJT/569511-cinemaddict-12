import UserProfileView from '../view/user-profile.js';
import {render, replace, remove} from '../utils/render.js';
import {getUserRank} from '../utils/user-profile.js';
import {userGradeSettings} from '../const.js';

export default class UserProfilePresenter {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._activeRank = null;
    this._userProfileComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._activeRank = getUserRank(this._moviesModel.getMovies(), userGradeSettings);

    const prevUserProfileComponent = this._userProfileComponent;

    this._userProfileComponent = new UserProfileView(this._activeRank);

    if (prevUserProfileComponent) {
      replace(this._userProfileComponent, prevUserProfileComponent);
      remove(prevUserProfileComponent);
    } else {
      render(this._container, this._userProfileComponent);
    }
  }

  _handleModelEvent() {
    this.init();
  }
}


