
import * as React from 'react';

export const Login : React.StatelessComponent<{}> = (props) => (

<html>
    <head>
        <link href='/app.css' rel='stylesheet' />
         <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' />
    </head>
    <body>
        <section className='loginform'>
            <h1>Login:</h1>
            <form name='login' action='/login' method='post' accept-charset='utf-8'>
                <ul>
                    <li><label htmlFor='username'>Username</label>
                    <input type='text' name='username' placeholder='username' required /></li>
                    <li><label htmlFor='password'>Password</label>
                    <input type='password' name='password' placeholder='password' required /></li>
                    <li>
                    <input type='submit' value='Login' /></li>
                </ul>
            </form>
        </section>
    </body>
</html>

);
