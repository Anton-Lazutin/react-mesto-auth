import React from "react";
import './Login.css'


export default function Login({title, name, handleLogin}) {
    const [inputValues, setInputValues] = React.useState({
        email: '',
        password: ''
    })

    function handleSubmit(evt) {
        evt.preventDefault()
        handleLogin(inputValues)
    }

    function handleChange(evt) {
        const {name, value} = evt.target
        setInputValues({
            ...inputValues,
            [name]: value
        })
    }

    return (
        <section className="auth">
            <div className="auth__container">
                <h2 className="auth__title">{title}</h2>
                <form className="auth__form" name={name} onSubmit={handleSubmit}>
                    <fieldset className="auth__fieldset">
                        <div className="auth__error-container">
                            <input
                                className="auth__input"
                                name="email"
                                id="login-email"
                                placeholder="Email"
                                type="text"
                                minLength="2"
                                maxLength="40"
                                onChange={handleChange}
                                required
                            ></input>
                        </div>
                        <div className="auth__error-container">
                            <input
                                className="auth__input"
                                name="password"
                                id="login-password"
                                placeholder="Password"
                                type="password"
                                minLength="2"
                                maxLength="200"
                                onChange={handleChange}
                                required
                            ></input>
                        </div>
                        <button className="auth__save-btn">Войти</button>
                    </fieldset>
                </form>
            </div>
        </section>
    )
}

