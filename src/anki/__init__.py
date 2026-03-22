from __future__ import annotations

import sys

from aqt import gui_hooks
from aqt.editor import Editor
from aqt.utils import showInfo

NOTE_TYPE_NAME = "@Paul (Beschriftetes Bild)"
DEBUG = False



class BrowserInjector:
    def __init__(self) -> None:
        self.custom_editor_loaded = False

    def register(self) -> None:
        gui_hooks.editor_did_load_note.append(self.on_editor_did_load_note)

    def on_editor_did_load_note(self, editor: Editor) -> None:
        if not editor.note:
            return

        if editor.note.note_type()["name"] == NOTE_TYPE_NAME:
            self.load_custom_editor(editor)
        else:
            self.load_default_editor(editor)

    def load_custom_editor(self, editor: Editor) -> None:
        if self.custom_editor_loaded:
            return

        js_code = """
            const container = document.querySelector('.note-editor');
            if (container) {
                const toolbar = container.querySelector('.editor-toolbar');
                const editor = container.querySelector('.scroll-area-relative');
                if (toolbar) { toolbar.remove(); }
                if (editor) { editor.remove(); }

                const imageAnnotator = document.createElement('div');
                imageAnnotator.id = 'image-annotator';
                imageAnnotator.innerText = 'Loading Image Annotator …';
                container.prepend(imageAnnotator);
            }
        """
        editor.web.eval(js_code)

        self.custom_editor_loaded = True
        if DEBUG:
            showInfo("loaded custom editor")

    def load_default_editor(self, editor: Editor) -> None:
        if not self.custom_editor_loaded:
            return

        editor.setupWeb()
        editor.loadNoteKeepingFocus()

        self.custom_editor_loaded = False
        if DEBUG:
            showInfo("loaded default editor")


if "pytest" not in sys.modules:
    browser_injector = BrowserInjector()
    browser_injector.register()
