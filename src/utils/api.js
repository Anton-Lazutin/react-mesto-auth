class Api {
    constructor(options) {
        this._url = options.baseUrl;
        this._headers = options.headers;
        this._authorization = options.headers.authorization;
    }

    _checkResponse(res) {
        return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
    }

    getInfo() {
        return fetch(`${this._url}/users/me`, {
        headers: {
            authorization: this._authorization,
        }
        })
        .then(this._checkResponse)
    }

    getCards() {
        return fetch(`${this._url}/cards`, {
        headers: {
            authorization: this._authorization,
        }
        })
        .then(this._checkResponse)
    }

    setUserInfo(data) {
        return fetch(`${this._url}/users/me`, {
        method: "PATCH",
        headers: this._headers,
        body: JSON.stringify({
            name: data.username,
            about: data.hobby,
        })
        })
        .then(this._checkResponse)
    }

    setUserAvatar(data) {
        return fetch(`${this._url}/users/me/avatar`, {
        method: "PATCH",
        headers: this._headers,
        body: JSON.stringify({
        avatar: data.avatar,
        })
        })
        .then(this._checkResponse)
    }

    addCard(data) {
        return fetch(`${this._url}/cards`, {
        method: "POST",
        headers: this._headers,
        body: JSON.stringify({
            name: data.place,
            link: data.link,
        })
        })
        .then(this._checkResponse)
    }

    addLike(cardId) {
        return fetch(`${this._url}/cards/${cardId}/likes`, {
        method: "PUT",
        headers: {
            authorization: this._authorization,
        }
        })
        .then(this._checkResponse)
    }

    deleteLike(cardId) {
        return fetch(`${this._url}/cards/${cardId}/likes`, {
        method: "DELETE",
        headers: {
        authorization: this._authorization,
        }
        })
        .then(this._checkResponse)
    }

    deleteCard(cardId) {
        return fetch(`${this._url}/cards/${cardId}`, {
        method: "DELETE",
        headers: {
        authorization: this._authorization,
        }
        })
        .then(this._checkResponse)
        }
    }

const api = new Api({
    baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-70',
    headers: {
    authorization: 'd6ad4e70-bf86-454e-9e8a-e2958c4059f4',
    'Content-Type': 'application/json'
    }
})

export default api;