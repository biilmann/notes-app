/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {format} from 'date-fns';
import NotePreview from './NotePreview';
import EditButton from './EditButton';

export default function Note({noteId, notes}) {
  if (noteId === null) {
    return (
      <div className="note--empty-state">
        <span className="note-text--empty-state">
          Click a note on the left to view something! 🥺
        </span>
      </div>
    );
  }

  const note = notes.find((n) => n.id === noteId);

  let {id, title, body, updated_at} = note;
  const updatedAt = new Date(updated_at);

  return (
    <div className="note">
      <div className="note-header">
        <h1 className="note-title">{title}</h1>
        <div className="note-menu" role="menubar">
          <small className="note-updated-at" role="status">
            Last updated on {format(updatedAt, "d MMM yyyy 'at' h:mm bb")}
          </small>
          <EditButton noteId={id}>Edit</EditButton>
        </div>
      </div>
      <NotePreview body={body} />
    </div>
  );
}
