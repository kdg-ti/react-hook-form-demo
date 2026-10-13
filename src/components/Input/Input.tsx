import type {FieldError, Path, UseFormRegister} from "react-hook-form";
import type {SignUpFormValues} from "../../App.tsx";
import "./Input.css"

interface InputProps {
    name: Path<SignUpFormValues> // match a valid key within the Type (utility type provided by react-hook-form)
    label: string
    register: UseFormRegister<SignUpFormValues> // Include register Type from react-hook-form
    error?: FieldError
    type?: string
}

// Geen `rules` meer: de validatie zit nu in het zod schema (zie App.tsx)
export const Input = ({name, label, register, error, type = "text"}: InputProps) => {
    return (
        <div className="form-control">
            <label>{label}</label>
            <input {...register(name)} type={type}/>
            {/* We put the error message here: */}
            {error && <div className="error-message">{error.message}</div>}
        </div>
    )
}
