export default function StartScreen({ dispatch }) {
    return (
    <div>
      <h1>kapitel 5</h1>
      <p>
      <h2>30 sekunder per fråga</h2>
      <h2>Rätt svar visas i blått</h2>
      <h2>Lycka till!</h2>
      </p>
      <btn className="btn btn-ui" onClick={() => dispatch({type: 'start'})}>Börja här!</btn>
    </div>
    );
}