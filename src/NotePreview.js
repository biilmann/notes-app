/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, {Suspense} from 'react'

const TextWithMarkdown = React.lazy(() => import('./TextWithMarkdown'));

export default function NotePreview({body, body_html}) {
  return (
    <div className="note-preview">
      {body_html ? <div
      className="text-with-markdown"
      dangerouslySetInnerHTML={{__html: body_html}}></div> : <Suspense fallback="..."><TextWithMarkdown text={body} /></Suspense>} 
    </div>
  );
}
