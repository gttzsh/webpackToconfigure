import React from 'react'
import {sum} from './math'
//热更新
if(module.hot) {
  module.hot.accept(['./math'], () => {
    const sumRes = sum(10, 20)
  })
}

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        1111
      </div>
    );
  }

}


export default App;
