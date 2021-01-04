import {useState, useEffect} from 'react';
import SearchField from './SearchField';
import NoteList from './NoteList';
import Note from './Note';
import EditButton from './EditButton';

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

async function saveNote(noteId, note, afterSaving) {
  try {
    const create = noteId === null;
    const path = create ? '/notes' : `/notes/${noteId}`;
    const method = create ? 'POST' : 'PUT';
    const result = await fetch(path, {
      method,
      body: JSON.stringify(note),
      headers: {"Content-Type": "application/json"}
    });
    const newNote = await result.json();
    afterSaving(null, newNote.id)
  } catch(err) {
    afterSaving(err)
  }
}

async function deleteNote(noteId, afterSaving) {
  try {
    await fetch(`/notes/${noteId}`, {
      method: 'DELETE',
      body: ""
    })
    afterSaving(null, null)
  } catch(err) {
    afterSaving(err)
  }
}

function App() {
  const [notes, setNotes] = useState([])
  const [noteId, setNoteId] = useState(null)
  const [isEditing, setEditing] = useState(false)
  const [loadingState, setLoadingState] = useState({state: "loading", error: null})

  const afterSaving = (err, noteId) => {
    if (err) {
      return setLoadingState({error: err.toString()});
    }

    setEditing(false)
    setNoteId(noteId)
    fetchNotes(setLoadingState, setNotes)
  }

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
          <EditButton noteId={null} setEditing={() => { setEditing(true); setNoteId(null) }}>New</EditButton>
        </section>
        <nav>
          <NoteList noteId={noteId} notes={notes} loadingState={loadingState} setNoteId={(id) => {setEditing(false); setNoteId(id)}}/>
        </nav>
      </section>
      <section className="col note-viewer">
        <Note
          noteId={noteId}
          notes={notes}
          isEditing={isEditing}
          setEditing={setEditing}
          isSaving={loadingState.state === 'saving'}
          saveNote={(note) => {setLoadingState({state: "saving"}); saveNote(noteId, note, afterSaving)}}
          deleteNote={() => {setLoadingState({state: "saving"}); deleteNote(noteId, afterSaving)}}
        />
      </section>
    </div>
  );
}

export default App;
