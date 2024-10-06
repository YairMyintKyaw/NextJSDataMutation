"use client"

import {useFormState, useFormStatus} from "react-dom";
import { createPost } from "@/lib/action";

export default function Form({ children }) {
  const [state, formAction] = useFormState(createPost, {});
  return <form action={formAction}>
    {children}
    
    <p className="form-actions">
      <button type="reset">Reset</button>
      <ActionBtn/>
    </p>
    {state?.errors && <ul className="form-errors">
      {state?.errors.map(error => <li key={error}>{error}</li>)}
    </ul>}
  </form>
}


function ActionBtn(){
  const {pending} = useFormStatus();
  return <button disabled={pending}>{pending?"Creating":"Create Post"}</button>
}