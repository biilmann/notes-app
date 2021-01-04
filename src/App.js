import {useEffect, useReducer} from 'react';
import SearchField from './SearchField';
import NoteList from './NoteList';
import Note from './Note';
import EditButton from './EditButton';

const initialState = {
  allNotes: [],
  notes: [],
  fetchState: 'loading',
  error: null,
  noteId: null,
  searchText: null,
  isEditing: false
}

function filterNotes(notes, searchText) {
  if (!searchText) { return notes }
  const string = searchText.toLowerCase();

  return notes.filter((note) => note.title.toLowerCase().indexOf(string) >= 0)
}

const reducer = (state, action) => {
  switch(action.type) {
    case 'fetching': {
      return {...state, fetchState: 'loading', error: null};
    }
    case 'saving': {
      return {...state, fetchState: 'saving', error: null};
    }
    case 'fetchedNotes': {
      const {notes} = action.payload;
      return {...state, fetchState: null, error: null, isEditing: false, allNotes: notes, notes: filterNotes(notes, state.searchText)}
    }
    case 'error': {
      return {...state, fetchState: null, error: action.payload.error}
    }
    case 'search': {
      const {searchText} = action.payload;
      return {...state, searchText, notes: filterNotes(state.allNotes, searchText)}
    }
    case 'delete': {
      const {id} = action.payload;
      const notes = state.allNotes.filter((note) => note.id !== id)
      return {...state, noteId: null, isEditing: false, fetchState: null, error: null, allNotes: notes, notes: filterNotes(notes, state.searchText)}
    }
    case 'select': {
      const {id} = action.payload;
      return {...state, noteId: id, isEditing: false}
    }
    case 'edit': {
      return {...state, isEditing: true, noteId: action.payload.id}
    }
    default:
      return state;
  }
}


async function fetchNotes(dispatch) {
  dispatch({type: 'fetching'})
  try {
    const response = await fetch("/notes")
    const notes = await response.json()
    dispatch({type: 'fetchedNotes', payload: {notes}})
  } catch (error) {
    dispatch({type: 'error', payload: {error}})
  }
}

async function saveNote(noteId, note, dispatch) {
  dispatch({type: 'saving'})
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
    await fetchNotes(dispatch)
    dispatch({type: 'select', payload: {id: create ? newNote.id : noteId}})
  } catch(error) {
    dispatch({type: 'error', payload: {error}})
  }
}

async function deleteNote(noteId, dispatch) {
  dispatch({type: 'saving'})
  try {
    await fetch(`/notes/${noteId}`, {
      method: 'DELETE',
      body: ""
    })
    dispatch({type: 'delete', payload: {id: noteId}})
  } catch(error) {
    dispatch({type: 'error', payload: {error}})
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  useEffect(() => {
    fetchNotes(dispatch);
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
          <SearchField setSearch={(searchText) => dispatch({type: 'search', payload: {searchText}})}/>
          <EditButton noteId={null} setEditing={() => { dispatch({type: 'edit', payload: {id: null}}) }}>New</EditButton>
        </section>
        <nav>
          <NoteList noteId={state.noteId} notes={state.notes} loadingState={state.fetchState} setNoteId={(id) => {dispatch({type: 'select', payload: {id}})}}/>
        </nav>
      </section>
      <section className="col note-viewer">
        <Note
          noteId={state.noteId}
          notes={state.notes}
          isEditing={state.isEditing}
          setEditing={() => dispatch({type: 'edit', payload: {id: state.noteId}})}
          isSaving={state.fetchState === 'saving'}
          saveNote={(note) => {saveNote(state.noteId, note, dispatch)}}
          deleteNote={() => {deleteNote(state.noteId, dispatch)}}
        />
      </section>
    </div>
  );
}

export default App;
