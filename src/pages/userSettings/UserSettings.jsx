import './UserSettings.css';
import edit from './../../assets/edit-icon-01.svg';

function UserSettings({user, setUser}) {

    return (
        <>
            <main className="user-settings-outer-container">
                <section className="user-settings-container">
                    <h3 className="user-settings-header">Account</h3>
                    <ul className="user-settings-list">

                        <li className="user-settings-item">
                            <p><label>Voornaam : </label>{user.firstname}</p>
                            <img className="icon-edit" src={edit} alt="wijzig"/>
                        </li>
                        <li className="user-settings-item">
                            <p><label>Achternaam : </label>{user.lastname}</p>
                            <img className="icon-edit" src={edit} alt="wijzig"/>
                        </li>
                        <li className="user-settings-item">
                            <p><label>Email : </label>{user.email}</p>
                            <img className="icon-edit" src={edit} alt="wijzig"/>
                        </li>
                        <li className="user-settings-item">
                            <p><label>Password : </label>{  "*".repeat(user.password.length)}</p>
                            <img className="icon-edit" src={edit} alt="wijzig"/>
                        </li>
                        <li className="user-settings-item">
                            <label>Standaard les moment : </label>
                            <select
                                name="Default-class" id="Default-class" value={user.defaultClassTime}>
                                <option value="Woensdag Avond">Woensdag Avond</option>
                                <option value="Vrijdag Avond">Vrijdag Avond</option>
                                <option value="Zaterdag Ochtend">Zaterdag Ochtend</option>
                            </select>
                        </li>
                    </ul>

                </section>
            </main>

        </>
    );
}

export default UserSettings;