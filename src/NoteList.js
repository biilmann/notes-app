/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import NoteListSkeleton from './NoteListSkeleton';
import SidebarNote from './SidebarNote';

export default function NoteList({noteId, notes, setNoteId, searchText, loadingState}) {
  if (loadingState.state === "loading") {
      return <NoteListSkeleton/>
  }

  return notes.length > 0 ? (
    <ul className="notes-list">
      {notes.map((note) => (
        <li key={note.id}>
          <SidebarNote note={note} setNoteId={setNoteId}/>
        </li>
      ))}
    </ul>
  ) : (
    <div className="notes-empty">
      {searchText
        ? `Couldn't find any notes titled "${searchText}".`
        : 'No notes created yet!'}{' '}
    </div>
  );
}
