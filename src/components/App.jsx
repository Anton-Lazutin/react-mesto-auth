//здравствуйте, это промежуточная проверка, еще не все ошибки исправил, просто хочу убедиться что иду в правильном направлении =)


import Header from "./Header/Header.jsx";
import Main from "./Main/Main.jsx";
import Footer from "./Footer/Footer.jsx";
import PopupWithForm from "./PopupWithForm/PopupWithForm.jsx";
import ImagePopup from "./ImagePopup/ImagePopup.jsx";
import { useCallback, useState, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import api from "../utils/api.js";
import EditProfilePopup from "./EditProfilePopup/EditProfilePopup.jsx";
import EditAvatarPopup from "./EditAvatarPopup/EditAvatarPopup.jsx";
import AddPlacePopup from "./AddPlacePopup/AddPlacePopup.jsx";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import { authorize, register, checkToken } from "../utils/auth.js";

import Register from "./Register/Register.jsx";
import Login from "./Login/Login.jsx";
import InfoTooltip from "./InfoTooltip/InfoTooltip.jsx";

function App() {
  const navigate = useNavigate();
  // state popups
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isImagePopup, setImagePopup] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isLoaderMessage, setIsLoaderMessage] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);

  // state context
  const [currentUser, setCurrentUser] = useState({});
  //state cards
  const [cards, setCards] = useState([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [deleteCardId, setDeleteCardId] = useState("");
  // state login and registration
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [answer, setAnswer] = useState({
    status: false,
    text: "",
  });

  const setAllStatesForClosePopups = useCallback(() => {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setImagePopup(false);
    setIsDeletePopupOpen(false);
    setIsInfoTooltipOpen(false);
  }, []);

  const closePopupByEsc = useCallback(
    (evt) => {
      if (evt.key === "Escape") {
        setAllStatesForClosePopups();
        document.removeEventListener("keydown", closePopupByEsc);
      }
    },
    [setAllStatesForClosePopups]
  );

  const closeAllPopups = useCallback(() => {
    setAllStatesForClosePopups();
    document.removeEventListener("keydown", closePopupByEsc);
  }, [setAllStatesForClosePopups, closePopupByEsc]);

  function setEventListenerForDocument() {
    document.addEventListener("keydown", closePopupByEsc);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
    setEventListenerForDocument();
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
    setEventListenerForDocument();
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
    setEventListenerForDocument();
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setImagePopup(true);
    setEventListenerForDocument();
  }

  function handleDeleteCardClick(cardId) {
    setDeleteCardId(cardId);
    setIsDeletePopupOpen(true);
    setEventListenerForDocument();
  }

  useEffect(() => {
    setIsLoadingCards(true);
    Promise.all([api.getInfo(), api.getCards()])
      .then(([dataUser, dataCard]) => {
        setCurrentUser(dataUser);
        setCards(dataCard);
        setIsLoadingCards(false);
      })
      .catch((error) => console.error(`Ошибка: ${error}`));
  }, []);

  function handleDeleteSubmit(evt) {
    evt.preventDefault();
    setIsLoaderMessage(true);
    api
      .deleteCard(deleteCardId)
      .then(() => {
        setCards(
          cards.filter((card) => {
            return card._id !== deleteCardId;
          })
        );
        closeAllPopups();
        setIsLoaderMessage(false);
      })
      .catch((error) => console.error(`Ошибка: ${error}`))
      .finally(() => setIsLoaderMessage(false));
  }

  function handleUpdateUser(dataUser, reset) {
    setIsLoaderMessage(true);
    api
      .setUserInfo(dataUser)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
        reset();
        setIsLoaderMessage(false);
      })
      .catch((error) => console.error(`Ошибка: ${error}`))
      .finally(() => setIsLoaderMessage(false));
  }

  function handleUpdateAvatar(dataUser, reset) {
    setIsLoaderMessage(true);
    api
      .setUserAvatar(dataUser)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
        reset();
        setIsLoaderMessage(false);
      })
      .catch((error) => console.error(`Ошибка: ${error}`))
      .finally(() => setIsLoaderMessage(false));
  }

  function handleAddPlaceSubmit(dataCard, reset) {
    setIsLoaderMessage(true);
    api
      .addCard(dataCard)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups();
        reset();
        setIsLoaderMessage(false);
      })
      .catch((error) => console.error(`Ошибка: ${error}`))
      .finally(() => setIsLoaderMessage(false));
  }

  function handleLogin(data) {
    authorize(data.email, data.password)
      .then((res) => {
        setAnswer({
          status: true,
          text: "Вы успешно авторизовались!",
        });
        localStorage.setItem("jwt", res.token);
        setLoggedIn(true);
        setUserEmail(data.email);
        navigate("/", { replace: true });
        setIsInfoTooltipOpen(true);
      })
      .catch(() => {
        setAnswer({
          status: false,
          text: "Что-то пошло не так! Попробуйте еще раз.",
        });
        setIsInfoTooltipOpen(true);
      });
  }

  function handleRegister(data) {
    register(data.email, data.password)
      .then(() => {
        setIsInfoTooltipOpen(true);
        setAnswer({
          status: true,
          text: "Вы успешно зарегистрировались!",
        });
        navigate("/sign-in", { replace: true });
      })
      .catch(() => {
        setAnswer({
          status: false,
          text: "Что-то пошло не так! Попробуйте еще раз.",
        });
        setIsInfoTooltipOpen(true);
      });
  }

  function handleLogout() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    setUserEmail("");
    navigate("/sign-in");
  }

  useEffect(() => {
    handleTokenCheck();
  });

  function handleTokenCheck() {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      checkToken(jwt)
        .then((res) => {
          setLoggedIn(true);
          setUserEmail(res.data.email);
          navigate("/", { replace: true });
        })
        .catch((err) => console.log(err));
    }
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__content">
        <div className="page">
          <Header logout={handleLogout} userEmail={userEmail} />

          <Routes>
            <Route
              path="/sign-up"
              element={
                <Register
                  title="Регистрация"
                  name="register"
                  handleRegister={handleRegister}
                />
              }
            />
            <Route
              path="/sign-in"
              element={
                <Login title="Вход" name="login" handleLogin={handleLogin} />
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute
                  component={Main}
                  loggedIn={loggedIn}
                  cards={cards}
                  onEditProfile={handleEditProfileClick}
                  onEditAvatar={handleEditAvatarClick}
                  onAddPlace={handleAddPlaceClick}
                  onCardClick={handleCardClick}
                  onDelete={handleDeleteCardClick}
                  isLoading={isLoadingCards}
                />
              }
            />
            <Route path="*" element={<Navigate to="/sign-in" replace />} />
          </Routes>

          <Footer />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            isLoaderMessage={isLoaderMessage}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            isLoaderMessage={isLoaderMessage}
            onAddPlace={handleAddPlaceSubmit}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            isLoaderMessage={isLoaderMessage}
            onUpdateAvatar={handleUpdateAvatar}
          />

          <PopupWithForm
            name="delete"
            title="Вы уверены?"
            titleButton="Да"
            loaderMessage="Удаление..."
            isOpen={isDeletePopupOpen}
            onClose={closeAllPopups}
            onSubmit={handleDeleteSubmit}
            isLoaderMessage={isLoaderMessage}
          />

          <ImagePopup
            card={selectedCard}
            isOpen={isImagePopup}
            onClose={closeAllPopups}
          />

          <InfoTooltip
            isOpen={isInfoTooltipOpen}
            onClose={closeAllPopups}
            answer={answer}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
