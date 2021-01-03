import {useState, useEffect} from 'react';
import SearchField from './SearchField';
import NoteList from './NoteList';
import Note from './Note';

async function fetchNotes(setLoadingState, setNotes) {
  setLoadingState({state: "loading"})
  try {
    const response = await fetch("/notes")
    const notes = await response.json()
    setNotes(notes)
    setLoadingState({})
  } catch (err) {
    setLoadingState({error: err.toString()})
  }

}

function App() {
  const [notes, setNotes] = useState([])
  const [noteId, setNoteId] = useState(null)
  const [loadingState, setLoadingState] = useState({state: "loading", error: null})

  useEffect(() => {
    fetchNotes(setLoadingState, setNotes);
  }, [])

  return (
    <div className="main">
      <section className="col sidebar">
        <section className="sidebar-header">
          <img
            className="logo"
            src="logo.svg"
            width="22px"
            height="20px"
            alt=""
            role="presentation"
          />
          <strong>React Notes</strong>
        </section>
        <section className="sidebar-menu" role="menubar">
          <SearchField/>
        </section>
        <nav>
          <NoteList noteId={noteId} notes={notes} loadingState={loadingState} setNoteId={setNoteId}/>
        </nav>
      </section>
      <section className="col note-viewer">
        <Note noteId={noteId} notes={notes}/>
      </section>
    </div>
  );
}

export default App;
