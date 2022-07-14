/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {EditorState, LexicalEditor} from 'lexical';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import useLayoutEffect from 'shared/useLayoutEffect';

export function OnChangePlugin({
  ignoreInitialChange = true,
  ignoreSelectionChange = false,
  onChange,
}: {
  ignoreInitialChange?: boolean;
  ignoreSelectionChange?: boolean;
  onChange: (
    editorState: EditorState,
    editor: LexicalEditor,
    details: {isInitialChange: boolean; isSelectionChange: boolean},
  ) => void;
}): null {
  const [editor] = useLexicalComposerContext();

  useLayoutEffect(() => {
    if (onChange) {
      return editor.registerUpdateListener(
        ({editorState, dirtyElements, dirtyLeaves, prevEditorState}) => {
          const isInitialChange = prevEditorState.isEmpty();
          const isSelectionChange =
            dirtyElements.size === 0 && dirtyLeaves.size === 0;

          if (isSelectionChange && ignoreSelectionChange) {
            return;
          }

          if (isInitialChange && ignoreInitialChange) {
            return;
          }

          onChange(editorState, editor, {isInitialChange, isSelectionChange});
        },
      );
    }
  }, [editor, ignoreInitialChange, ignoreSelectionChange, onChange]);

  return null;
}
