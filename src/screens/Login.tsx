import {Field, Fieldset, Input, Label} from "@headlessui/react";

export default function Login() {

    return <div className={'h-screen'}>
        <form>
            <Fieldset>
                <Field>
                    <Label>Email</Label>
                    <Input/>
                </Field>
                <Field>
                    <Label>Password</Label>
                    <Input type="password"/>
                </Field>
                <Field>
                    <button className={'py-2 px-3 bg-primary text-white hover:ring-2 hover:ring-primary'}>
                        Login
                    </button>
                </Field>
            </Fieldset>
        </form>
    </div>
}