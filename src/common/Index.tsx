
import * as React from 'react';

export const Index : React.StatelessComponent<{}> = (props) => (

<html>
    <head>
        <title>Imperial Entanglements</title>
        <script src='https://unpkg.com/react@15.3.2/dist/react.js'></script>
        <script src='https://unpkg.com/react-dom@15.3.2/dist/react-dom.js'></script>
        <script src='https://cdn.jsdelivr.net/lodash/4.16.1/lodash.js'></script>
        <script
        src='https://code.jquery.com/jquery-3.1.1.slim.min.js'
        integrity='sha256-/SIrNqv8h6QGKDuNoLGA4iret+kyesCkHGzVUUV0shc='
        crossOrigin='anonymous'></script>

         <link href='/app.css' rel='stylesheet' />
    </head>
    <body className='flex-fill'>

        <div id='falcon-container' className='flex-fill'>
          {props.children}
        </div>

        <script src='/mobx.bundle.js'></script>
        <script src='/utility.bundle.js'></script>
        <script src='/ui.bundle.js'></script>
        <script src='/react.bundle.js'></script>

        <script src='/vendor.dist.js'></script>
        <script src='/main.dist.js'></script>
    </body>
</html>);
