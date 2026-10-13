// src/App.tsx
import {useState} from "react";
import {useForm, useWatch} from "react-hook-form";
import type {SubmitHandler} from "react-hook-form";
import "./App.css"

import {Input} from "./components/Input";

/** 1) Interface voor form data */
export interface SignUpFormValues {
    firstName: string
    email: string
    password: string
    confirmPassword: string
}

export default function App() {
    // useForm<SignUpFormValues>() geeft typed helpers — TS waarschuwt bij verkeerd gebruik van veldnamen.
    const {
        register,
        handleSubmit,
        control,
        formState: {errors}
    } = useForm<SignUpFormValues>();

    const [user, setUser] = useState<{ firstName: string; email: string } | null>(null)

    const onSubmit: SubmitHandler<SignUpFormValues> = (data) => {
        console.log("submitted:", data);
        setUser({firstName: data.firstName, email: data.email});
    }

    // useWatch volgt de waarde van één veld adhv de name prop
    const email = useWatch({control, name: "email"})
    console.log(email)


    return (
        <div style={{maxWidth: 700, margin: "2rem auto", padding: 20}}>
            <h2>{user ? "User data" : "Sign up"}</h2>

            {/*We tonen de submitted data hier: */}
            {user && <pre>{JSON.stringify(user, null, 2)}</pre>}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* De validatieregels van stap 1 geven we mee via de `rules` prop */}
                <Input name="firstName" label="First name" register={register} error={errors.firstName}
                       rules={{required: "First name is required"}}/>
                <Input name="email" label="Email" register={register} error={errors.email}
                       rules={{
                           required: "Email is required",
                           pattern: {value: /\S+@\S+\.\S+/, message: "Invalid email"}
                       }}/>
                <Input name="password" label="Password" register={register} error={errors.password} type="password"
                       rules={{
                           required: "Password is required",
                           minLength: {value: 3, message: "Password must be at least 3 characters long"}
                       }}/>
                <Input name="confirmPassword" label="Confirm password" register={register}
                       error={errors.confirmPassword} type="password"
                       rules={{required: "Please confirm your password"}}/>

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

