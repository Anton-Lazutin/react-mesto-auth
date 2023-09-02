import { useEffect, useState } from "react"
import api from "../../utils/api"

export default function ButtonLike({likes, myId, cardId}) {
    const [isLike, setIsLike] = useState(false)
    const [count, setCount] = useState(likes.length)

    useEffect(() => {
        setIsLike(likes.some(element => myId === element._id))
    }, [likes, myId])

    function handleLike() {
        if (isLike) {
            api.deleteLike(cardId)
            .then(res => {
                setIsLike(false)
                setCount(res.likes.length)
            })
            .catch((error) => console.error(`Ошибка: ${error}`))
        } else {
            api.addLike(cardId)
            .then(res => {
                setIsLike(true)
                setCount(res.likes.length)
            })
            .catch((error) => console.error(`Ошибка: ${error}`))
        }
    }

    return (
        <>
            <button className={`card__like-btn ${isLike ? 'card__like-btn_active' : ''}`} type="button" onClick={handleLike}/>
            <span className="card__like-nmbr">{count}</span>
        </>
    )
}