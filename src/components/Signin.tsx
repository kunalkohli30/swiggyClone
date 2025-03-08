import { signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import { auth, provider } from '../config/firebaseAuth'
const Signin = () => {

    async function handleAuth() {
        const data = await signInWithPopup(auth, provider);
        console.log(data);
    }
    async function handlePassAuth() {

        signInWithEmailAndPassword(auth, 'vk@gmail.com', 'password')
            .then((userCredential) => {
                console.log('inside then', userCredential);
                // Signed in 
                // const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                console.log('inside catch', error);
                // const errorCode = error.code;
                // const errorMessage = error.message;
            });

        // const data = await signInWithEmailAndPassword(auth, provider)
        // console.log(data);
    }

    async function handleSignOut() {
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log('signout succesful')
        }).catch(() => {
            console.log('signout error');
            // An error happened.
        });
    }

    async function getCurrentUser() {
        console.log(await auth.currentUser?.getIdToken());
    }

    return (
        <div className='flex flex-col gap-6'>

            {/* <SignupForm /> */}
            <p>Login</p>
            <button onClick={handleAuth} className='p-2 bg-gray-400'>
                Google Login
            </button>
            <button onClick={handlePassAuth} className='p-2 bg-gray-400'>
                username and password Login
            </button>
            <button onClick={handleSignOut} className='p-2 bg-gray-400'>
                Signout
            </button>
            <button onClick={() => getCurrentUser()} className='p-2 bg-gray-400'>
                get user
            </button>



        </div>
    )
}

export default Signin