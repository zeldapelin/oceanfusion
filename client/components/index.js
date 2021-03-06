/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */
export {default as Navbar} from './navbar'
export {Login, Signup} from './auth-form'
export {default as Main} from './main'
export {default as Game} from './game'
export {default as GameOver} from './gameOver'
export {default as Victory} from './victory'
export {default as UserHome} from './user-home'
