import React, { lazy } from 'react';
import { components, utils } from 'shared';
import ProtectedRoute from '../../../../host/shared/src/components/ProtectedRoute';


function EditAvatarPopup() {

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen]   = React.useState(false);

  const inputRef = React.useRef();

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function onUpdateAvatar(avatarUpdate) {
    api
      .setUserAvatar(avatarUpdate)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar: inputRef.current.value,
    });
  }

  return (
    <div>
      <PopupWithForm
        isOpen={isOpen} onSubmit={handleSubmit} onClose={onClose} title="Обновить аватар" name="edit-avatar"
      />

      <label className="popup__label">
        <input type="url" name="avatar" id="owner-avatar"
              className="popup__input popup__input_type_description" placeholder="Ссылка на изображение"
              required ref={inputRef} />
        <span className="popup__error" id="owner-avatar-error"></span>
      </label>

      <ProtectedRoute
            onEditAvatar={handleEditAvatarClick}
      />

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        // onClose={closeAllPopups}
      />
    </div>
  );
}

export default EditAvatarPopup;
