// src/App.tsx
import {useState} from "react";
import {useForm, useWatch} from "react-hook-form";
import type {SubmitHandler} from "react-hook-form";
import "./App.css"

/** 1) Interface voor form data */
export interface SignUpFormValues {
    firstName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function App() {
    // useForm<SignUpFormValues>() geeft typed helpers — TS waarschuwt bij verkeerd gebruik van veldnamen.
    const {
        register,
        handleSubmit,
        control,
        formState: {errors}
    } = useForm<SignUpFormValues>();

    const [user, setUser] = useState<{ firstName: string; email: string } | null>(null);

    const onSubmit: SubmitHandler<SignUpFormValues> = (data) => {
        console.log("submitted:", data);
        setUser({firstName: data.firstName, email: data.email});
    };

    // useWatch volgt de waarde van één veld adhv de name prop
    const email = useWatch({control, name: "email"})
    console.log(email)


    return (
        <div style={{maxWidth: 700, margin: "2rem auto", padding: 20}}>
            <h2>{user ? "User data" : "Sign up"}</h2>

            {/*We tonen de submitted data hier: */}
            {user && <pre>{JSON.stringify(user, null, 2)}</pre>}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div>
                    <label>First name</label><br/>
                    <input {...register("firstName", {required: "First name is required"})} />
                    {errors.firstName && <div style={{color: "crimson"}}>{errors.firstName.message}</div>}
                </div>

                <div>
                    <label>Email</label><br/>
                    <input {...register("email", {
                        required: "Email is required",
                        pattern: {value: /\S+@\S+\.\S+/, message: "Invalid email"}
                    })} />
                    {errors.email && <div style={{color: "crimson"}}>{errors.email.message}</div>}
                </div>

                <div>
                    <label>Password</label><br/>
                    <input type="password" {...register("password", {
                        required: "Password required",
                        minLength: {value: 3, message: "At least 3 chars"}
                    })} />
                    {errors.password && <div style={{color: "crimson"}}>{errors.password.message}</div>}
                </div>

                <div>
                    <label>Confirm password</label><br/>
                    <input type="password" {...register("confirmPassword", {required: "Confirm password"})} />
                    {errors.confirmPassword && <div style={{color: "crimson"}}>{errors.confirmPassword.message}</div>}
                </div>

                <div style={{marginTop: 12}}>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}

