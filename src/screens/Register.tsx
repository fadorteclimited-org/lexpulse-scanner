import {Field, Fieldset, Input, Label} from "@headlessui/react";

export default function RegisterScreen() {

    return <div>
        <form>
            <Fieldset>
                <h3>email</h3>
                <Field>
                    <Label>Password</Label>
                    <Input type="password"/>
                </Field>
                <Field>
                    <Label>Confirm Password</Label>
                    <Input type="password"/>
                </Field>
                <Field>
                    <button>Set Password</button>
                </Field>
            </Fieldset>
        </form>
    </div>
}