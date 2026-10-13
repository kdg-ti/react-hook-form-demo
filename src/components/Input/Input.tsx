import type {FieldError, Path, UseFormRegister} from "react-hook-form";
import type {TSignupSchema} from "../../App.tsx";
import "./Input.css"

type InputProps = {
    name: Path<TSignupSchema> // match a valid key within the Type (utility type provided by react-hook-form)
    label: string
    register: UseFormRegister<TSignupSchema> // Include register Type from react-hook-form
    error?: FieldError
    required: boolean
}

export const Input = ({name, label, register, error, required}: InputProps) => {
    return (
        <div className="form-control">
            <label>{label}</label>
            <input {...register(name)} required={required} placeholder=""/>
            {error && <div className="error-message">{error?.message}</div>}
        </div>
    )
}