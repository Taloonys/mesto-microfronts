import React, {lazy, Suspence} from "react";
import { Route, useHistory, Switch } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext, PopupWithForm, api } from 'shared'
import AddPlacePopup from "./AddPlacePopup";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip.js";

const Catalog = lazy(() => import('catalog/Catalog')
  .catch(() => { 
    return { 
      default:() => <div> Catalog load failed </div>}
    }
  )
);


const Login = lazy(() => import('auth/Login')
  .catch(() => { 
    return { 
      default:() => <div> Login load failed </div>}
    }
  )
);


const Register = lazy(() => import('auth/Register')
  .catch(() => {
    return {
      default: () => <div> Register load failed </div>
    }
  })
);


const EditProfilePopup = lazy(() => import('profile/EditProfilePopup')
  .catch(() => { 
    return { 
      default:() => <div> EditProfilePopup load failed </div>}
    }
  )
);


const EditAvatarPopup = lazy(() => import('profile/EditAvatarPopup')
  .catch(() => { 
    return { 
      default:() => <div> EditAvatarPopup load failed </div>}
    }
  )
);


function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen]       = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen]   = React.useState(false);

  const [cards, setCards] = React.useState([]);

  // В корневом компоненте App создана стейт-переменная currentUser. Она используется в качестве значения для провайдера контекста.
  const [currentUser, setCurrentUser] = React.useState({});

  const [tooltipStatus, setTooltipStatus] = React.useState("");
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  //В компоненты добавлены новые стейт-переменные: email — в компонент App
  const [email, setEmail] = React.useState("");

  const history = useHistory();


  // при монтировании App описан эффект, проверяющий наличие токена и его валидности
  React.useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          setEmail(res.data.email);
          setIsLoggedIn(true);
          history.push("/");
        })
        .catch((err) => {
          localStorage.removeItem("jwt");
          console.log(err);
        });
    }
  }, [history]);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsInfoToolTipOpen(false);
    setSelectedCard(null);
  }

  function handleAddPlaceSubmit(newCard) {
    api
      .addCard(newCard)
      .then((newCardFull) => {
        setCards([newCardFull, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function onSignOut() {
    // при вызове обработчика onSignOut происходит удаление jwt
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    // После успешного вызова обработчика onSignOut происходит редирект на /signin
    history.push("/signin");
  }

  return (
    // В компонент App внедрён контекст через CurrentUserContext.Provider
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__content">
        <Header email={email} onSignOut={onSignOut} />
        <Switch>

          <ProtectedRoute
            exact
            path="/"
            component={Main}
            cards={cards}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            loggedIn={isLoggedIn}
          />

          <Route path="/signup">
            <Register />
          </Route>

          <Route path="/signin">
            <Login />
          </Route>

        </Switch>
        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onAddPlace={handleAddPlaceSubmit}
          onClose={closeAllPopups}
        />

        <PopupWithForm title="Вы уверены?" name="remove-card" buttonText="Да" />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
        />

        <InfoTooltip
          isOpen={isInfoToolTipOpen}
          onClose={closeAllPopups}
          status={tooltipStatus}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
