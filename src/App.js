import { useEffect, useReducer } from 'react';
import './App.css';
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import FinishScreen from './FinishScreen';
import Question from "./Question";
import NextButton from './NextButton';
import Progress from './Progress';
import Footer from './Footer';
import Timer from './Timer';

function StartScreen({ dispatch, numQuestions, selectedChapter }) {
  // If no chapter is selected yet, show chapter selection
  if (selectedChapter === null) {
    return (
      <div className="start">
        <h2>Välj kapitel från Essential Cell Biology</h2>
        <div className="chapter-buttons">
          <button className="btn btn-kapitel" onClick={() => dispatch({type: 'selectChapter', payload: 1})}>
            Kapitel 1 - Cells: The Fundamental Units of Life
          </button>
          <button className="btn btn-kapitel" onClick={() => dispatch({type: 'selectChapter', payload: 2})}>
            Kapitel 2 - Chemical Components of Cells
          </button>
          <button className="btn btn-kapitel" onClick={() => dispatch({type: 'selectChapter', payload: 3})}>
            Kapitel 3 - Energy, Catalysis, and Biosynthesis
          </button>
          <button className="btn btn-kapitel" onClick={() => dispatch({type: 'selectChapter', payload: 4})}>
            Kapitel 4 - Protein Structure and Function
          </button>
          <button className="btn btn-kapitel" onClick={() => dispatch({type: 'selectChapter', payload: 5})}>
            Kapitel 5 - DNA and Chromosomes
          </button>
          <button className="btn btn-kapitel" onClick={() => dispatch({type: 'selectChapter', payload: 6})}>
            Kapitel 6 - DNA Replication, Repair, and Recombination
          </button>
          <button className="btn btn-kapitel" onClick={() => dispatch({type: 'selectChapter', payload: 7})}>
            Kapitel 7 - From DNA to Protein: How Cells Read The Genome
          </button>
          <button className="btn btn-kapitel" onClick={() => dispatch({type: 'selectChapter', payload: 8})}>
            Kapitel 8 - Control of Gene Expression
          </button>
          <button className="btn btn-kapitel" onClick={() => dispatch({type: 'selectChapter', payload: 9})}>
            Kapitel 9 - How Genes and Genomes Evolve
          </button>
          <button className="btn btn-kapitel" onClick={() => dispatch({type: 'selectChapter', payload: 11})}>
            Kapitel 11 - Membrane Structure
          </button>
          <button className="btn btn-kapitel" onClick={() => dispatch({type: 'selectChapter', payload: 12})}>
            Kapitel 12 - Transport Across Cell Membranes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="start">
      {selectedChapter !== 'All' ? <h3 style={{color: '#FF9013'}}>Quiz för kapitel {selectedChapter} innehåller {numQuestions} frågor</h3> : <h3>Quiz för alla kapitel redo!</h3> }
      <h4 style={{color: '#F5F1DC'}}>Den första hälften av frågorna är mestadels faktafrågor och ger 5 poäng per fråga</h4>
      <h4 style={{color: '#F5F1DC'}}>Den andra hälften av frågorna är svårare och ger 10 poäng per fråga</h4>
      <h4 style={{color: '#73C8D2'}}>Tiden för varje quiz är (antal frågor * 60 sekunder)</h4>
      <h4 style={{color: '#73C8D2'}}>Rätt svar visas i blått</h4>
      <h4>Du kan närsomhelst avbryta genom att ladda om (reload) hela sidan i webbrowsern</h4>
      <h4>Skicka gärna feedback på frågorna till mig: &#115;&#101;&#98;&#97;&#115;&#116;&#105;&#97;&#110;&#46;&#107;&#97;&#108;&#97;&#109;&#97;&#106;&#115;&#107;&#105;&#64;&#104;&#107;&#114;&#46;&#115;&#101;</h4>
      <div className="chapter-buttons">
      <button className="btn btn-ui" onClick={() => dispatch({type: 'start'})}>
        Börja quiz!
      </button>
      <button className="btn btn-ui" onClick={() => dispatch({type: 'backToChapterSelect'})}>
        Välj annat kapitel
      </button>
      </div>
    </div>
  );
}

const SECS_PER_QUESTION = 60;

const initialState = { 
  questions: [], 
  status: 'selectingChapter',
  index: 0,
  answer: null,
  points: 0,
  secondsRemaining: null,
  selectedChapter: null,
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
    case 'selectChapter':
      return {
        ...state,
        selectedChapter: action.payload,
        status: 'loading',
      };
    case 'start':
      return {
        ...state, 
        status: "active", 
        secondsRemaining: state.questions.length * SECS_PER_QUESTION
      };
    case 'newAnswer':
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption ? state.points + question.points : state.points,
      };
    case 'nextQuestion':
      return {
        ...state, 
        index: state.index+1, 
        answer: null
      };
    case 'finish':
      return {
        ...state, 
        status: "finished"
      };
    case 'restart':
      return {
        ...initialState, 
        questions: state.questions, 
        status: "ready",
        selectedChapter: state.selectedChapter,
      };
    case 'backToChapterSelect':
      return {
        ...initialState,
        status: 'selectingChapter',
        selectedChapter: null,
      };
    case 'tick':
      return {
        ...state, 
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action unknown");
  }
}

function App() {
  const [{ questions, status, index, answer, points, secondsRemaining, selectedChapter }, dispatch] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints = numQuestions > 0 
    ? questions.reduce((prev, cur) => prev + cur.points, 0)
    : 0;

  useEffect(function() {
    if (selectedChapter === null) {
      return;
    }

    async function fetchQuestions() {
      try {
        dispatch({type: 'dataLoading'});
        const res = await fetch(`/questionsChapter${selectedChapter}.json`); 
        if (!res.ok) 
           throw new Error("Some error when fetching questions!");
        const data = await res.json();
        dispatch({type: 'dataReceived', payload: data.questions });
       } catch(error) {
        console.log(error.message);
        dispatch({type: 'dataFailed'});
       }
      }
       fetchQuestions();
  }, [selectedChapter]);

  return (
    <div className="app">
      <Header />
      {status === "active" && <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />}
      <Main>
        {status === "selectingChapter" && <StartScreen dispatch={dispatch} selectedChapter={selectedChapter} />}
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen numQuestions={numQuestions} dispatch={dispatch} selectedChapter={selectedChapter} />}
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
      <Footer />
    </div>
  );
}

export default App;