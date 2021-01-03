/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {useState} from 'react';
import {format, isToday} from 'date-fns';
import excerpts from 'excerpts';
import marked from 'marked';

export default function SidebarNote({note, noteId, setNoteId}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isActive = noteId === note.id;
  const isPending = false;

  const updatedAt = new Date(note.updated_at);
  const lastUpdatedAt = isToday(updatedAt)
    ? format(updatedAt, 'h:mm bb')
    : format(updatedAt, 'M/d/yy');
  const summary = excerpts(marked(note.body), {words: 20});
  return (<div
        className={[
          'sidebar-note-list-item',
          isExpanded ? 'note-expanded' : '',
        ].join(' ')}>
        <header className="sidebar-note-header">
          <strong>{note.title}</strong>
          <small>{lastUpdatedAt}</small>
        </header>
        <button
          className="sidebar-note-open"
          style={{
            backgroundColor: isPending
              ? 'var(--gray-80)'
              : isActive
              ? 'var(--tertiary-blue)'
              : '',
            border: isActive
              ? '1px solid var(--primary-border)'
              : '1px solid transparent',
          }}
          onClick={() => { setNoteId(note.id) }}>
          Open note for preview
        </button>
        <button
          className="sidebar-note-toggle-expand"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}>
          {isExpanded ? (
            <img
              src="chevron-down.svg"
              width="10px"
              height="10px"
              alt="Collapse"
            />
          ) : (
            <img src="chevron-up.svg" width="10px" height="10px" alt="Expand" />
          )}
        </button>
        {isExpanded && <p className="sidebar-note-excerpt">{summary || <i>(No content)</i>}</p>}
      </div>

  );
}