import {Controller} from "react-hook-form";
import type {Control} from "react-hook-form";
import type {SignUpFormValues} from "../../App.tsx";

interface Props {
    control: Control<SignUpFormValues>;
    name: "country";
    label: string;
}

// Controller koppelt een component dat geen `ref` doorgeeft (bv. een UI-library select) aan react-hook-form.
// `field` bevat value, onChange, onBlur, name en ref.
export const ControlledSelect = ({control, name, label}: Props) => (
    <Controller control={control}
                name={name}
                render={({field}) => (
                    <div style={{marginBottom: 10}}>
                        <label>{label}</label><br/>
                        <select {...field}>
                            <option value="">Choose</option>
                            <option value="nl">Netherlands</option>
                            <option value="be">Belgium</option>
                            <option value="de">Germany</option>
                        </select>
                    </div>
                )}
    />
);
