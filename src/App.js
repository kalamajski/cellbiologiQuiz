import { useEffect, useReducer } from 'react';
import './App.css';
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import FinishScreen from './FinishScreen';
import Question from "./Question";
import NextButton from './NextButton';
import Progress from './Progress';
import Footer from './Footer';
import Timer from './Timer';

const SECS_PER_QUESTION = 30;

const initialState = { questions: [], 
  // 'loading' 'error' 'ready' 'active' 'finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch(action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case 'dataFailed':
      return {
        ...state,
        status: "error",
      };
    case 'dataLoading':
      return {
        ...state,
        status: 'loading'
      };
    case 'start':
      return {...state, status: "active", secondsRemaining: state.questions.length * SECS_PER_QUESTION};
    case 'newAnswer':
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption ? state.points + question.points : state.points,
      };
    case 'nextQuestion':
      return {...state, index: state.index+1, answer: null};
    case 'finish':
      return {...state, status: "finished"};
    case 'restart':
      return {...initialState, questions: state.questions, status: "ready"};
    case 'tick':
      return {
        ...state, secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action unknown");
  }
}

function App() {
  const [{ questions, status, index, answer, points, secondsRemaining }, dispatch] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points, 0
  );

  useEffect( function() {
    async function fetchQuestions() {
      try {
        const res = await fetch('/questions.json');
        if (!res.ok) 
           throw new Error("Some error when fetching questions!");
        const data = await res.json();
        dispatch({type: 'dataReceived', payload: data });
       } catch(error) {
        console.log(error.message)
       }
      }
       fetchQuestions();
  }, []);

  return (
    <div className="app">
      <Header />
      {status === 'active' && <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />}
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
        {status === "active" && (
          <>
          <Progress
          index={index}
          numQuestions={numQuestions}
          points={points}
          maxPossiblePoints={maxPossiblePoints}
          answer={answer}
          />
          <Question 
          question={questions[index]} 
          dispatch={dispatch} 
          answer={answer} 
          />
          <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions} />
          </>
        )}
        {status === 'finished' && <FinishScreen dispatch={dispatch} points={points} maxPossiblePoints={maxPossiblePoints} />}
      </Main>
      <Footer>
      </Footer>
    </div>
  );
}

export default App;
