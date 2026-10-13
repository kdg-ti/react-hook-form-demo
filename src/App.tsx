// src/App.tsx
import {useState} from "react";
import "./App.scss"

/** 1) Interface voor form data */


export default function App() {
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [user, setUser] = useState<{ firstName: string; email: string } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setUser({ firstName, email });
    };

    return (
        <div style={{maxWidth: 700, margin: "2rem auto", padding: 20}}>
            <h2>{user ? "User data" : "Sign up"}</h2>

            {/*We tonen de submitted data hier: */}
            {user && <pre>{JSON.stringify(user, null, 2)}</pre>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>First name</label><br/>
                    <input
                        name="firstname"
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>

                <div>
                    <label>Email</label><br/>
                    <input
                        name="email"
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label>Password</label><br/>
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div>
                    <label>Confirm password</label><br/>
                    <input
                        name="password_confirmation"
                        type="password"
                        placeholder="Confirm password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                    />
                </div>

                <div style={{marginTop: 12}}>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}

