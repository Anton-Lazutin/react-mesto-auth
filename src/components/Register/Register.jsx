import React from "react";
import {Link} from 'react-router-dom'

export default function Register({title, name, handleRegister}) {
    const [inputValues, setInputValues] = React.useState({
        email: '',
        password: ''
    })

    function handleSubmit(evt) {
        evt.preventDefault()
        handleRegister(inputValues)
    }

    function handleChange(evt) {
        const {name, value} = evt.target
        setInputValues({
            ...inputValues,
            [name]: value
        })
    }

    return(
        <section className="auth">
            <div className="auth__container">
                <h2 className="auth__title">{title}</h2>
                <form className="auth__form" name={name} onSubmit={handleSubmit}>
                    <fieldset className="auth__fieldset">
                        <div className="auth__error-container">
                            <input
                                className="auth__input"
                                name="email"
                                id="register-email"
                                placeholder="Email"
                                type="text"
                                minLength="2"
                                maxLength="40"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="auth__error-container">
                            <input
                                className="auth__input"
                                name="password"
                                id="register-password"
                                placeholder="Password"
                                type="password"
                                minLength="2"
                                maxLength="200"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button className="auth__save-btn">Зарегистрироваться</button>
                    </fieldset>
                </form>
                <Link to="/sign-in" className="auth__redirect">
                    Уже зарегистрированы? Войти
                </Link>
            </div>
        </section>
    )
}

