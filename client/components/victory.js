import React from 'react'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'
import {connect} from 'react-redux'
import {scoreReset, saveScore} from '../store'

class Victory extends React.Component {
  componentDidMount() {
    this.props.saveScore(this.props.score, this.props.user.id)
    this.props.resetScore()
  }

  render() {
    return (
      <div className="victory">
        <div className="victory-text">
          <h1 className="t">YOU WON!</h1>
          <h4>Want to try again? Click the button below.</h4>
        </div>
        <Button className="button" id="mainPageBtn">
          <Link to="/game">Play Again</Link>
        </Button>
        <div id="background-wrap">
          <div className="bubble x1" />
          <div className="bubble x2" />
          <div className="bubble x3" />
          <div className="bubble x4" />
          <div className="bubble x5" />
          <div className="bubble x6" />
          <div className="bubble x7" />
          <div className="bubble x8" />
          <div className="bubble x9" />
          <div className="bubble x10" />
          <div className="bubble x11" />
          <div className="bubble x12" />
          <div className="bubble x13" />
          <div className="bubble x14" />
          <div className="bubble x15" />
          <div className="bubble x16" />
          <div className="bubble x17" />
          <div className="bubble x18" />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  score: state.score
})

const mapDispatchToProps = dispatch => ({
  saveScore: (score, id) => dispatch(saveScore(score, id)),
  resetScore: () => dispatch(scoreReset())
})

export default connect(mapStateToProps, mapDispatchToProps)(Victory)
