import UseFormValidation from "../../utils/UseFormValidation";
import PopupWithForm from "../PopupWithForm/PopupWithForm";


export default function AddPlacePopup({isOpen, onClose, onAddPlace, isLoaderMessage}) {

    const { values, errors, isValid, handleChange, reset} = UseFormValidation()

    function resetForClose() {
        onClose()
        reset()
    }

    function handleSubmit(evt) {
        evt.preventDefault()
        onAddPlace({place: values.place, link: values.link}, reset)
    }

    return (
        <PopupWithForm 
        name = 'add-form'
        title = 'Новое место'
        titleButton = 'Создать'
        loaderMessage = 'Создание...'
        isOpen = {isOpen}
        onClose = {resetForClose}
        isValid = {isValid}
        isLoaderMessage = {isLoaderMessage}
        onSubmit = {handleSubmit}
        >
        <input
            type="text"
            required
            minLength={2}
            maxLength={30}
            className="popup__input popup__input_type_place"
            name="place"
            placeholder="Введите название"
            id="place"
            value={values.place ? values.place : ''}
            disabled={isLoaderMessage}
            onChange={handleChange}
        />
        <span id="error-place" className="popup__error-message">{errors.place}</span>
        <input
            type="url"
            required
            className="popup__input popup__input_type_link"
            name="link"
            placeholder="Введите ссылку на картинку"
            id="link"
            value={values.link ? values.link : ''}
            disabled={isLoaderMessage}
            onChange={handleChange}
        />
        <span id="error-link" className="popup__error-message">{errors.link}</span>
        </PopupWithForm>
    )
}