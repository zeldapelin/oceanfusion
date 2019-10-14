/* eslint-disable max-statements */
/* eslint-disable react/no-unused-state */
/* eslint-disable complexity */
import React from 'react'
import * as posenet from '@tensorflow-models/posenet'
import 'p5/lib/addons/p5.dom'
import Loading from './loading'
import {connect} from 'react-redux'
import {gotQuestion, scoreIsSet} from '../store'
import {Redirect} from 'react-router-dom'
import {ToastsContainer, ToastsStore} from 'react-toasts'

class Camera extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cameraSet: false,
      videoHeight: window.innerHeight * 0.8,
      videoWidth: window.innerWidth * 0.5,
      answer: '',
      score: 0,
      gameEnded: false
    }
  }
  async componentDidMount() {
    this.props.getQuestion()
    this.posenet = await posenet.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: 193,
      multiplier: 0.75
    })

    await this.setupCamera()
    this.setupTimer()
  }

  setupTimer() {
    this.elapsedTime = 0
    this.timer = setInterval(() => {
      if (this.elapsedTime > 60) {
        this.setState({gameEnded: true})
      }
      this.elapsedTime = this.elapsedTime + 1
    }, 1000)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.score !== prevState.score) {
      this.props.getScore(this.state.score)
      this.props.getQuestion()
    }
  }

  async setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available'
      )
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'user',
          width: this.state.videoWidth,
          height: this.state.videoHeight
        }
      })
      this.setState({cameraSet: true})
      this.video.srcObject = stream
    } catch (err) {
      console.error(err)
    } finally {
      this.detectPose()
    }
  }

  async detectPose() {
    const poses = await this.posenet.estimateSinglePose(this.video, {
      flipHorizontal: false
    })
    this.gotPoses(poses)

    setTimeout(() => {
      this.detectPose()
    }, 100)
  }

  gotPoses(poses) {
    let width = this.state.videoWidth
    let height = this.state.videoHeight
    let rightWX = poses.keypoints[10].position.x
    let rightWY = poses.keypoints[10].position.y
    let leftWX = poses.keypoints[9].position.x
    let leftWY = poses.keypoints[9].position.y
    let points = this.props.question.pointValue
    let correctAnswer = this.props.question.answer
    let userAnswer = this.state.answer
    if (
      leftWX > 0 &&
      leftWX < width * 0.3 &&
      (leftWY > 0 && leftWY < height * 0.3)
    ) {
      this.setState({answer: 'B'})
      if (correctAnswer === userAnswer) {
        this.setState({score: this.state.score + points})
        ToastsStore.success('GREAT JOB! B is the correct answer.')
      } else {
        ToastsStore.error('OOPS! WRONG ANSWER!')
      }
    }
    if (
      rightWX > width * 0.7 &&
      rightWX < width &&
      (rightWY > 0 && rightWY < height * 0.3)
    ) {
      this.setState({answer: 'A'})
      if (correctAnswer === userAnswer) {
        this.setState({score: this.state.score + points})
        ToastsStore.success('AWESOME! A is the correct answer.')
      } else {
        ToastsStore.error('OOPS! WRONG ANSWER!')
      }
    }
    if (
      leftWX > 0 &&
      leftWX < width * 0.3 &&
      (leftWY > height * 0.7 && leftWY < height)
    ) {
      this.setState({answer: 'D'})
      if (correctAnswer === userAnswer) {
        this.setState({score: this.state.score + points})
        ToastsStore.success('GREAT JOB! D is the correct answer.')
      } else {
        ToastsStore.error('OOPS! WRONG ANSWER!')
      }
    }
    if (
      rightWX > width * 0.7 &&
      rightWX < width &&
      (rightWY > height * 0.7 && rightWY < height)
    ) {
      this.setState({answer: 'C'})
      if (correctAnswer === userAnswer) {
        this.setState({score: this.state.score + points})
        ToastsStore.success('YOU GOT IT! C is the correct answer.')
      } else {
        ToastsStore.error('OOPS! WRONG ANSWER!')
      }
    }
  }
  getVideo = element => {
    this.video = element
  }

  getCanvas = element => {
    this.canvas = element
  }

  render() {
    const {cameraSet, gameEnded} = this.state
    if (gameEnded) {
      if (this.state.score >= 25) {
        return <Redirect to="/victory" />
      } else {
        return <Redirect to="/gameover" />
      }
    }
    return (
      <div className="camera">
        <ToastsContainer className="toasts" store={ToastsStore} />
        {cameraSet ? (
          <div id="answer-circle-container">
            <div className="answer-circle" id="answer-circle-a">
              <h1>A</h1>
            </div>
            <div className="answer-circle" id="answer-circle-b">
              <h1>B</h1>
            </div>
            <div className="answer-circle" id="answer-circle-c">
              <h1>C</h1>
            </div>
            <div className="answer-circle" id="answer-circle-d">
              <h1>D</h1>
            </div>
          </div>
        ) : (
          <Loading />
        )}
        <video
          playsInline
          id="webcam"
          width={this.state.videoWidth}
          height={this.state.videoHeight}
          autoPlay={true}
          ref={this.getVideo}
        />
        <canvas className="canvas" ref={this.getCanvas} />
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    question: state.question
  }
}

const mapDispatchToProps = dispatch => ({
  getQuestion: () => dispatch(gotQuestion()),
  getScore: score => dispatch(scoreIsSet(score))
})

export default connect(mapStateToProps, mapDispatchToProps)(Camera)
