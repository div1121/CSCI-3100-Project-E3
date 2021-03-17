import React from "react";
import SignIn from "./SignIn"
import "./styles.css";

// Import the MongoDB Realm Web SDK
import * as Realm from "realm-web";

// Connect to your MongoDB Realm app
const REALM_APP_ID = "application-0-exwhb"; // e.g. myapp-abcde
const app = new Realm.App({ id: REALM_APP_ID });
	
// Create a component that displays the given user's details
function UserDetail({ user }) {
  return (
    <div>
      <h1>Logged in with anonymous id: {user.id}</h1>
    </div>
  );
}

// Create a component that lets an anonymous user log in
function Login({ setUser }) {
  const loginAnonymous = async () => {
    const user = await app.logIn(Realm.Credentials.anonymous());
    setUser(user);
  };
  return <button onClick={loginAnonymous}>Log In</button>;
}
// Create a component that lets an anonymous user log in
function Logout({ setUser }) {
  const logout = async () => {
	await app.currentUser.logOut();
  };
  return <button onClick={logout}>Log out</button>;
}

/* Register({ setUser }) {
	const register = async () = > {
		const email = "arxkjp@gmail.com";
		const password = "12345678";
		await app.emailPasswordAuth.registerUser(email, password);
	}
	return <button onClick={register}>Register</button>
}*/

function App() {
  // Keep the logged in Realm user in local state. This lets the app re-render
  // whenever the current user changes (e.g. logs in or logs out).
  const [user, setUser] = React.useState(app.currentUser);

  // If a user is logged in, show their details.
  // Otherwise, show the login screen.
  return (
    <div className="App">
      <div className="App-header">
        {user ? <UserDetail user={user} /> : <Login setUser={setUser} />}
      </div>
	  <Logout />
	  <SignIn />
    </div>
  );
};

export default App;
