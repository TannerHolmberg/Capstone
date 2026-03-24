// RequireTeacher.js
import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import LoadingPage from "./Components/LoadingPage";

const RequireTeacher = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                navigate("/"); // not logged in
                return;
            }

            try {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    navigate("/");
                    return;
                }

                const data = userSnap.data();

                if (!data.isTeacher) {
                    navigate("/isdsearch"); // redirect parents
                    return;
                }

                setLoading(false);

            } catch (err) {
                console.error(err);
                navigate("/");
            }
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <LoadingPage />;

    return children;
};

export default RequireTeacher;