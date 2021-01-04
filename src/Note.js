/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {format} from 'date-fns';
import NoteEditor from './NoteEditor';
import NotePreview from './NotePreview';
import EditButton from './EditButton';

export default function Note({noteId, notes, setEditing, isEditing, isSaving, saveNote, deleteNote}) {
  if (noteId === null && !isEditing) {
    return (
      <div className="note--empty-state">
        <span className="note-text--empty-state">
          Click a note on the left to view something! 🥺
        </span>
      </div>
    );
  }

  const note = notes.find((n) => n.id === noteId);

  let {id, title, body, body_html, updated_at} = note || {};
  const updatedAt = updated_at ? new Date(updated_at) : new Date();

  if (isEditing) {
    return <NoteEditor
      noteId={id}
      initialTitle={title}
      initialBody={body || ''}
      isSaving={isSaving}
      saveNote={saveNote}
      deleteNote={deleteNote}
    />;
  }
  
  return (
    <div className="note">
      <div className="note-header">
        <h1 className="note-title">{title}</h1>
        <div className="note-menu" role="menubar">
          <small className="note-updated-at" role="status">
            Last updated on {format(updatedAt, "d MMM yyyy 'at' h:mm bb")}
          </small>
          <EditButton noteId={id} setEditing={setEditing}>Edit</EditButton>
        </div>
      </div>
      <NotePreview body={body || ''} body_html={body_html}/>
    </div>
  );
}
