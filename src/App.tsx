// src/App.tsx
import type {SubmitHandler} from "react-hook-form";

import {useState} from "react";
import {useForm, useWatch} from "react-hook-form";
import {z} from "zod";
import "./App.css"

import {Input} from "./components/Input";
import {ControlledSelect} from "./components/ControlledSelect";
import {zodResolver} from "@hookform/resolvers/zod";

/* 1) Interface voor form data  mag weg want we gebruiken zod */

// Niet exporteren: React Fast Refresh wil dat App.tsx enkel componenten exporteert
const signUpSchema = z
    .object({
        firstName: z.string().min(1, "First name is required").min(5, "First name must be at least 5 characters long"),
        // eerst lege string afvangen, dan via .pipe() het e-mailformaat checken (z.email() is de zod 4 manier)
        email: z.string().trim().toLowerCase().min(1, "Email is required").pipe(z.email("Invalid email")),
        password: z.string().min(1, "Password is required").min(3, "Password must be at least 3 characters long"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
        country: z.string().optional(),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "The passwords do not match", path: ["confirmPassword"]
    });

// Het type wordt afgeleid uit het schema: één bron van waarheid voor validatie én types
export type SignUpFormValues = z.infer<typeof signUpSchema>


export default function App() {
    // useForm<SignUpFormValues>() geeft typed helpers — TS waarschuwt bij verkeerd gebruik van veldnamen.
    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
        reset
    } = useForm<SignUpFormValues>({
        mode: "onBlur", //valideert per veld bij blur (minder “noisy” UX).
        resolver: zodResolver(signUpSchema),
        defaultValues: {firstName: "", email: "", password: "", confirmPassword: "", country: ""}
    });

    const [user, setUser] = useState<{ firstName: string; email: string } | null>(null)

    const onSubmit: SubmitHandler<SignUpFormValues> = (data) => {
        console.log("submitted:", data);
        setUser({firstName: data.firstName, email: data.email});
    }

    // useWatch volgt de waarde van één veld adhv de name prop
    const email = useWatch({control, name: "email"})
    console.log(email)

    return (
        <div style={{maxWidth: 700, padding: 20}}>
            <h2>{user ? "User data" : "Sign up"}</h2>

            {/*We tonen de submitted data hier: */}
            {user && <pre>{JSON.stringify(user, null, 2)}</pre>}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Geen rules meer: zod valideert alles */}
                <Input name="firstName" label="First name" register={register} error={errors.firstName}/>
                <Input name="email" label="Email" register={register} error={errors.email}/>
                <Input name="password" label="Password" register={register} error={errors.password} type="password"/>
                <Input name="confirmPassword" label="Confirm password" register={register}
                       error={errors.confirmPassword} type="password"/>

                <ControlledSelect control={control} name="country" label="Country"/>

                <button type="submit">Submit</button>
                <button type="button" onClick={() => reset()}>Reset</button>

            </form>
        </div>
    )
}

