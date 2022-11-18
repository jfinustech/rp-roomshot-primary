import { useContext } from "react";
import { MainContext } from "../MainContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";

export async function CheckLogin() {
    const { setUserLoggedIn } = useContext(MainContext);

    await onAuthStateChanged(auth, (currentUser) => {
        console.log(currentUser);
        if (currentUser) {
            setUserLoggedIn(true);
            return true;
        }
    });
    return false;
}
