import logo from "../../images/logo-mesto.svg";

export default function Header() {
    return (
        <header className="header">
        <img
          className="header__logo"
          alt="лого Место Россия"
          src={logo}
        />
        </header>
    )
}