import React from 'react'
import { Editor } from '../editor/Editor'

/** @internal */
export const EditorContext = React.createContext({} as Editor)

/** @public */
export function useEditor(): Editor {
	return React.useContext(EditorContext)
}
