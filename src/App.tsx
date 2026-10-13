import {useState} from 'react'
import './App.css'
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "./components/Input";

// Niet exporteren: React Fast Refresh wil dat App.tsx enkel componenten exporteert
const signUpSchema = z
    .object({
        name: z
            .string()
            .min(1, 'Name is required')
            .min(6, 'Name must be at least 6 characters long'),
        email: z
            .string()
            .min(1, 'Email is required')
            .pipe(z.email('Email must be valid')),
        password: z
            .string()
            .min(1, 'Password is required')
            .min(3, 'Password must be at least 3 characters long'),
        confirmPassword: z.string().min(1, 'Password is required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'The passwords did not match',
        path: ['confirmPassword'],
    });

export type TSignupSchema = z.infer<typeof signUpSchema>; // infer type from zod schema

function App() {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm<TSignupSchema>({
        mode: 'onBlur', // default is onSubmit
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const [user, setUser] = useState<{ name: string; email: string }>();

    const onSubmitHandler = (data: TSignupSchema) => {
        console.log(data) //Tobe replaced with React Query call
        setUser(data);
    };

    return (
        <>
            <h2>{!user ? 'Sign up' : 'User Data : '}</h2>
            {user && <pre>user: {JSON.stringify(user, null, 4)}</pre>}
            <form onSubmit={handleSubmit(onSubmitHandler)} noValidate>

                <Input label="Name" name="name" register={register} error={errors.name} required/>
                <Input label="Email" name="email" register={register} error={errors.email} required/>
                <Input label="Password" name="password" register={register} error={errors.password} required/>
                <Input label="Confirm Password" name="confirmPassword" register={register}
                       error={errors.confirmPassword} required/>
                <button type="reset" onClick={() => reset()}>Clear</button>
                <button type="submit">Verzend</button>
            </form>
        </>
    )
}

export default App
