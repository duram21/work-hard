import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Error, Form, Input, Switcher, Title, Wrapper } from "../components/auth-components";



export default function CreateAccount() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value } } = e;
        if (name === "name") {
            setName(value);
        }
        else if (name === "email") {
            setEmail(value);
        }
        else if (name === "password") {
            setPassword(value);
        }
    }

    const onSubmit = async (e : React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        setError("");
        if(isLoading || name === "" || email === "" || password === "") return;
        try {
            setLoading(true);
            // create an account
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            console.log(credentials.user);
            // set the name of the user
            await updateProfile(credentials.user, {
                displayName: name,
            
            });
            // redirect to the home page
            navigate("/");

        } catch(e){
            //setError
            if(e instanceof FirebaseError){
                console.log(e.code, e.message);
                setError(e.message);
            }
            console.log(e);
        }
        finally {
            setLoading(false);
        }
        console.log(name, email, password);
    }

    return (
        <Wrapper>
            <Title>Join With Us</Title>
        <Form onSubmit={onSubmit}>
            <Input
                onChange={onChange}
                name="name"
                value={name}
                placeholder="Name"
                type="text"
                required />
            <Input
                onChange={onChange}
                name="email"
                value={email}
                placeholder="Email"
                type="email"
                required />
            <Input
                onChange={onChange}
                name="password"
                value={password}
                placeholder="Password"
                type="password"
                required />
            <Input type="submit" value={isLoading ? "Loading..." : "Create Account"} />
        </Form>
        {error !== "" ? <Error>{error}</Error> : null}
        <Switcher>
            Already have an account? <Link to="/login">Log In!</Link>  
        </Switcher>
    </Wrapper>
    );
}