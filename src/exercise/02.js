// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorage(key, defaultValue, {serialze = JSON.stringify, deserialize = JSON.parse} = {}){

  const [state, setState] = React.useState(() => {
    const valueInlocalStorage = window.localStorage.getItem(key)

    if (valueInlocalStorage) {
      try {
        return deserialize(valueInlocalStorage)
      } catch (error) {
        window.localStorage.removeItem(key)
      }
    }
    
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  //we want to be able to change the key without re-rendering the component
  const prevKeyRef = React.useRef(key) 

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }

    prevKeyRef.current = key
    window.localStorage.setItem(key, serialze(state))
  }, [key, state, serialze])


  return [state, setState]
}

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') || initialName
  const [name, setName] = useLocalStorage('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
