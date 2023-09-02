import { useCallback, useState } from "react"


export default function UseFormValidation() {
    const [values, setValues] = useState({})
    const [errors, setErrors] = useState({})
    const [isValid, setIsValid] = useState(false)

    function handleChange(evt) {
        const name = evt.target.name
        const value = evt.target.value
        const validationMessage = evt.target.validationMessage
        const form = evt.target.form

        setValues((oldValues) => {
            return {...oldValues, [name]: value}
        })

        setErrors((oldErrors) => {
            return {...oldErrors, [name]: validationMessage}
        })

        setIsValid(form.checkValidity())
    }

    function reset(data = {}) {
        setValues(data)
        setErrors({})
        setIsValid(false)
    }

    const setValue = useCallback((name, value) => {
        setValues((oldValues) => {
            return {...oldValues, [name]: value}
        })
    },[])

    return {values, errors, isValid, handleChange, reset, setValue}
}