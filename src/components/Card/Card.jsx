import { useContext } from "react"
import CurrentUserContext from '../../contexts/CurrentUserContext'
import ButtonLike from '../ButtonLike/ButtonLike.jsx'

export default function Card({card, onCardClick, onDelete}) {
    const currentUser = useContext(CurrentUserContext)
    return (
        <article className="card">
            <img 
                src={card.link} 
                alt={`фото ${card.name}`} 
                className="card__pic" 
                onClick = {() => onCardClick({link: card.link, name: card.name})}
                />
            {currentUser._id === card.owner._id && <button className="card__dlt-btn" type="button" onClick={() => onDelete(card._id)}/>}
            <div className="card__info">
                <h2 className="card__title" >{card.name}</h2>
                <div className="card__likes">
                    <ButtonLike likes={card.likes} myId={currentUser._id} cardId={card._id}/>
                </div>
            </div>
        </article>
    )
}