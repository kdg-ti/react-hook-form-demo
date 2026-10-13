// src/App.tsx
import "./App.css"

// Startpunt: een gewoon HTML-formulier, nog zonder react-hook-form.
// In stap 1 voegen we useForm, register, handleSubmit en validatie toe.

export default function App() {
    return (
        <div style={{maxWidth: 700, margin: "2rem auto", padding: 20}}>
            <h2>Sign up</h2>

            <form>
                <div>
                    <label>First name</label><br/>
                    <input/>
                </div>

                <div>
                    <label>Email</label><br/>
                    <input/>
                </div>

                <div>
                    <label>Password</label><br/>
                    <input type="password"/>
                </div>

                <div>
                    <label>Confirm password</label><br/>
                    <input type="password"/>
                </div>

                <div style={{marginTop: 12}}>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}
