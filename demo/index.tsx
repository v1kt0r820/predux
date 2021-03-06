import createStore, { Connect } from '../src/predux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
const h = React.createElement

const { connect, dispatch, getState } = createStore()({
    name: 'world',
    time: new Date()
})

let states = getState()

console.log(states)

interface AppProps { words?: string }
const AppComponent = ({ words }: AppProps) => <h2>{words}</h2>

const connectApp: Connect<AppProps> = connect

const App = connectApp(() => ({
    words: `hello ${getState().name}!`
}))(AppComponent)

let i = 0
setInterval(function () {
    const list = ['prect', 'immutable', 'world', 'ipreact']
     i = (i + 1) % list.length
    dispatch(state => ({name: list[i]}))
}, 1000)

export default ({ el }: { el: HTMLElement }) => {
    ReactDOM.render(<App />, el)
}
