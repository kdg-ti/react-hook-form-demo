// src/App.tsx
import {type SubmitHandler, useFieldArray} from "react-hook-form";
import "./App.css"
import {useState} from "react";
import {useForm, useWatch} from "react-hook-form";
import {z} from "zod";

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
        addresses: z.array(
            z.object({
                street: z.string().min(1, "Street required"),
                city: z.string().min(1, "City required"),
            })
        ).optional(),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "The passwords do not match", path: ["confirmPassword"]
    });

// Het type wordt afgeleid uit het schema: één bron van waarheid voor validatie én types
export type SignUpFormValues = z.infer<typeof signUpSchema>


// Simulatie van een server-call: dit e-mailadres is "al in gebruik"
const fakeSignUp = async (data: SignUpFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    if (data.email === "taken@example.com") throw new Error("Email already taken")
}

export default function App() {
    // useForm<SignUpFormValues>() geeft typed helpers — TS waarschuwt bij verkeerd gebruik van veldnamen.
    const {
        register,
        handleSubmit,
        control,
        formState: {errors, isSubmitting},
        reset,
        setError
    } = useForm<SignUpFormValues>({
        mode: "onBlur", //valideert per veld bij blur (minder “noisy” UX).
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: "",
            email: "",
            password: "",
            confirmPassword: "",
            country: "",
            addresses: [{street: "", city: ""}],
        }
    });

    const [user, setUser] = useState<{ firstName: string; email: string } | null>(null)
    const {fields, append, remove} = useFieldArray({control, name: "addresses"});

    const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
        try {
            await fakeSignUp(data)
            console.log("Zod-validated data:", data);
            setUser({firstName: data.firstName, email: data.email});
            // reset(); // indien gewenst
        } catch (err) {
            // server-fout tonen bij het juiste veld:
            setError("email", {type: "server", message: err instanceof Error ? err.message : "Something went wrong"});
        }
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

                <div style={{marginTop: 12}}>
                    <h3>Addresses</h3>
                    {fields.map((f, idx) => (
                        <div key={f.id} className="address-group">
                            {/* Ook geneste paden zoals addresses.0.street zijn een geldig Path<SignUpFormValues> */}
                            <Input name={`addresses.${idx}.street`} label="Street" register={register}
                                   error={errors.addresses?.[idx]?.street}/>
                            <Input name={`addresses.${idx}.city`} label="City" register={register}
                                   error={errors.addresses?.[idx]?.city}/>

                            <button type="button" onClick={() => remove(idx)}>Remove</button>
                        </div>
                    ))}

                    <button type="button" onClick={() => append({street: "", city: ""})}>Add address</button>
                </div>

                <ControlledSelect control={control} name="country" label="Country"/>

                <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</button>
                <button type="button" onClick={() => reset()}>Reset</button>

            </form>
        </div>
    )
}

