import type {FieldError, Path, RegisterOptions, UseFormRegister} from "react-hook-form";
import type {SignUpFormValues} from "../../App.tsx";
import "./Input.css"

interface InputProps {
    name: Path<SignUpFormValues> // match a valid key within the Type (utility type provided by react-hook-form)
    label: string
    register: UseFormRegister<SignUpFormValues> // Include register Type from react-hook-form
    rules?: RegisterOptions<SignUpFormValues> // validatieregels: hetzelfde object als het 2de argument van register()
    error?: FieldError
    type?: string
}

export const Input = ({name, label, register, rules, error, type = "text"}: InputProps) => {
    return (
        <div className="form-control">
            <label>{label}</label>
            <input {...register(name, rules)} type={type}/>
            {/* We put the error message here: */}
            {error && <div className="error-message">{error.message}</div>}
        </div>
    )
}
