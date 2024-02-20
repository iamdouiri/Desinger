import { MAX_PAGES, PageRecordType, TLPageId, track, useEditor } from '@tldraw/editor'
import { useCallback } from 'react'
import { useTranslation } from '../../hooks/useTranslation/useTranslation'
import { TldrawUiButton } from '../primitives/Button/TldrawUiButton'
import { TldrawUiButtonIcon } from '../primitives/Button/TldrawUiButtonIcon'
import {
	TldrawUiDropdownMenuContent,
	TldrawUiDropdownMenuRoot,
	TldrawUiDropdownMenuTrigger,
} from '../primitives/TldrawUiDropdownMenu'
import { TldrawUiMenuContextProvider } from '../primitives/menus/TldrawUiMenuContext'
import { TldrawUiMenuGroup } from '../primitives/menus/TldrawUiMenuGroup'
import { TldrawUiMenuItem } from '../primitives/menus/TldrawUiMenuItem'
import { onMovePage } from './edit-pages-shared'

export interface PageItemSubmenuProps {
	index: number
	item: { id: string; name: string }
	listSize: number
	onRename?: () => void
}

export const PageItemSubmenu = track(function PageItemSubmenu({
	index,
	listSize,
	item,
	onRename,
}: PageItemSubmenuProps) {
	const editor = useEditor()
	const msg = useTranslation()
	const pages = editor.getPages()

	const onDuplicate = useCallback(() => {
		editor.mark('creating page')
		const newId = PageRecordType.createId()
		editor.duplicatePage(item.id as TLPageId, newId)
	}, [editor, item])

	const onMoveUp = useCallback(() => {
		onMovePage(editor, item.id as TLPageId, index, index - 1)
	}, [editor, item, index])

	const onMoveDown = useCallback(() => {
		onMovePage(editor, item.id as TLPageId, index, index + 1)
	}, [editor, item, index])

	const onDelete = useCallback(() => {
		editor.mark('deleting page')
		editor.deletePage(item.id as TLPageId)
	}, [editor, item])

	return (
		<TldrawUiDropdownMenuRoot id={`page item submenu ${index}`}>
			<TldrawUiDropdownMenuTrigger>
				<TldrawUiButton type="icon" title={msg('page-menu.submenu.title')}>
					<TldrawUiButtonIcon icon="dots-vertical" />
				</TldrawUiButton>
			</TldrawUiDropdownMenuTrigger>
			<TldrawUiDropdownMenuContent alignOffset={0} side="right" sideOffset={-4}>
				<TldrawUiMenuContextProvider type="menu" sourceId="page-menu">
					<TldrawUiMenuGroup id="modify">
						{onRename && (
							<TldrawUiMenuItem id="rename" label="page-menu.submenu.rename" onSelect={onRename} />
						)}
						<TldrawUiMenuItem
							id="duplicate"
							label="page-menu.submenu.duplicate-page"
							onSelect={onDuplicate}
							disabled={pages.length >= MAX_PAGES}
						/>
						{index > 0 && (
							<TldrawUiMenuItem
								id="move-up"
								onSelect={onMoveUp}
								label="page-menu.submenu.move-up"
							/>
						)}
						{index < listSize - 1 && (
							<TldrawUiMenuItem
								id="move-down"
								label="page-menu.submenu.move-down"
								onSelect={onMoveDown}
							/>
						)}
					</TldrawUiMenuGroup>
					{listSize > 1 && (
						<TldrawUiMenuGroup id="delete">
							<TldrawUiMenuItem id="delete" onSelect={onDelete} label="page-menu.submenu.delete" />
						</TldrawUiMenuGroup>
					)}
				</TldrawUiMenuContextProvider>
			</TldrawUiDropdownMenuContent>
		</TldrawUiDropdownMenuRoot>
	)
})
