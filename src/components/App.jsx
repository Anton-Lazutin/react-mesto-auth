import Header from "./Header/Header.jsx";
import Main from './Main/Main.jsx';
import Footer from './Footer/Footer.jsx';
import PopupWithForm from "./PopupWithForm/PopupWithForm.jsx";
import ImagePopup from "./ImagePopup/ImagePopup.jsx";
import { useCallback, useState, useEffect } from "react";
import CurrentUserContext from '../contexts/CurrentUserContext.js'
import api from '../utils/api.js'
import EditProfilePopup from "./EditProfilePopup/EditProfilePopup.jsx";
import EditAvatarPopup from "./EditAvatarPopup/EditAvatarPopup.jsx";
import AddPlacePopup from "./AddPlacePopup/AddPlacePopup.jsx";

function App() {
// state popups
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
  const [isImagePopup, setImagePopup] = useState(false)
  const [selectedCard, setSelectedCard] = useState({})
  const [isLoaderMessage, setIsLoaderMessage] = useState(false)
// state context
  const [currentUser, setCurrentUser] = useState({})
//state cards
  const [cards, setCards] = useState([])
  const [isLoadingCards, setIsLoadingCards] = useState(true)
  const [deleteCardId, setDeleteCardId] =useState('')

  const setAllStatesForClosePopups = useCallback (() => {
    setIsEditProfilePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setImagePopup(false)
    setIsDeletePopupOpen(false)
  },[])

  const closePopupByEsc = useCallback ((evt) => { 
    if (evt.key === 'Escape') {
      setAllStatesForClosePopups()
      document.removeEventListener('keydown', closePopupByEsc)
    }
  },[setAllStatesForClosePopups])

  const closeAllPopups = useCallback (() => {
    setAllStatesForClosePopups()
    document.removeEventListener('keydown', closePopupByEsc)
  },[setAllStatesForClosePopups, closePopupByEsc])

  function setEventListenerForDocument() {
    document.addEventListener('keydown', closePopupByEsc)
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
    setEventListenerForDocument()
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
    setEventListenerForDocument()
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
    setEventListenerForDocument()
  }

  function handleCardClick(card) {
    setSelectedCard(card)
    setImagePopup(true)
    setEventListenerForDocument()
  }

  function handleDeleteCardClick(cardId) {
    setDeleteCardId(cardId)
    setIsDeletePopupOpen(true)
    setEventListenerForDocument()
  }

  useEffect(() => {
    setIsLoadingCards(true)
    Promise.all([api.getInfo(), api.getCards()])
      .then(([dataUser, dataCard]) => {
        setCurrentUser(dataUser)
        setCards(dataCard)
        setIsLoadingCards(false)
      })
      .catch((error) => console.error(`Ошибка: ${error}`))
  },[])

  function handleDeleteSubmit(evt) {
    evt.preventDefault()
    setIsLoaderMessage(true)
    api.deleteCard(deleteCardId)
      .then(() => {
        setCards(cards.filter(card => {
          return card._id !== deleteCardId
        }))
        closeAllPopups()
        setIsLoaderMessage(false)
      })
      .catch((error) => console.error(`Ошибка: ${error}`))
      .finally(() => setIsLoaderMessage(false))
  }

  function handleUpdateUser(dataUser, reset) {
    setIsLoaderMessage(true)
    api.setUserInfo(dataUser)
      .then(res => {
        setCurrentUser(res)
        closeAllPopups()
        reset()
        setIsLoaderMessage(false)
      })
      .catch((error) => console.error(`Ошибка: ${error}`))
      .finally(() => setIsLoaderMessage(false))
  } 

  function handleUpdateAvatar(dataUser, reset) {
    setIsLoaderMessage(true)
    api.setUserAvatar(dataUser)
      .then(res => {
        setCurrentUser(res)
        closeAllPopups()
        reset()
        setIsLoaderMessage(false)
      })
      .catch((error) => console.error(`Ошибка: ${error}`))
      .finally(() => setIsLoaderMessage(false))
  }

  function handleAddPlaceSubmit(dataCard, reset) {
    setIsLoaderMessage(true)
    api.addCard(dataCard)
      .then(res => {
        setCards([res, ...cards])
        closeAllPopups()
        reset()
        setIsLoaderMessage(false)
      })
      .catch((error) => console.error(`Ошибка: ${error}`))
      .finally(() => setIsLoaderMessage(false))
  }

  return (
  <CurrentUserContext.Provider value={currentUser}>

    <div className="page__content">
    <div className="page">

    <Header/>

    <Main
      onEditProfile = {handleEditProfileClick}
      onEditAvatar = {handleEditAvatarClick}
      onAddPlace = {handleAddPlaceClick}
      onCardClick = {handleCardClick}
      onDelete = {handleDeleteCardClick}
      cards = {cards}
      isLoading = {isLoadingCards}
    />

    <Footer/>

    <EditProfilePopup
      isOpen = {isEditProfilePopupOpen}
      onClose = {closeAllPopups}
      onUpdateUser = {handleUpdateUser}
      isLoaderMessage = {isLoaderMessage}
    />

    <AddPlacePopup
      isOpen = {isAddPlacePopupOpen}
      onClose = {closeAllPopups}
      isLoaderMessage = {isLoaderMessage}
      onAddPlace = {handleAddPlaceSubmit}
    />

    <EditAvatarPopup
      isOpen = {isEditAvatarPopupOpen}
      onClose = {closeAllPopups}
      isLoaderMessage = {isLoaderMessage}
      onUpdateAvatar = {handleUpdateAvatar}
    />

    <PopupWithForm 
      name = 'delete'
      title = 'Вы уверены?'
      titleButton = 'Да'
      loaderMessage = 'Удаление...'
      isOpen = {isDeletePopupOpen}
      onClose = {closeAllPopups}
      onSubmit = {handleDeleteSubmit}
      isLoaderMessage = {isLoaderMessage}
    />

    <ImagePopup
    card = {selectedCard}
    isOpen = {isImagePopup}
    onClose = {closeAllPopups}
    />

    </div>
    </div>
  </CurrentUserContext.Provider>
  );
}

export default App;
