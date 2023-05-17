// import logo from './logo.svg';
import './App.css';
import { useState } from 'react'
import { EditorState, convertToRaw, ContentState} from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

/* eslint-disable */
const htmlToDraft =
  typeof window === 'object' && require('html-to-draftjs').default

function App() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [editorHTML, setEditorHTML] = useState('')

  const unescape = (escaped) => {
    return escaped
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
  }

  const onEditorStateChange = (contentState) => {
    setEditorState(contentState)
    let html = draftToHtml(convertToRaw(contentState.getCurrentContent()))
    setEditorHTML(unescape(html))
    // // store value to react-hook-form
    // onChangeController(unescape(html))
  }

  const onEditEditorHTML = (e) => {
    const _editorHTML = e.target.value
    let editor
    const contentBlock = htmlToDraft(_editorHTML)
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      )
      editor = EditorState.createWithContent(contentState)
    } else {
      editor = EditorState.createEmpty()
    }

    // onchange(editorHTML)
    setEditorHTML(_editorHTML)
    setEditorState(editor)
    // store value to react-hook-form
    onChangeController(_editorHTML)
  }

  return (
    <>
    <div className="border border-pcgLightGrey">
            <Editor
              toolbar={{
                options: [
                  'inline',
                  'blockType',
                  'fontSize',
                  'list',
                  'textAlign',
                  'colorPicker',
                  'link',
                  'emoji',
                  'image',
                  'remove',
                  'history',
                ],
                image: {
                  previewImage: true,
                  alt: { present: true, mandatory: false },
                  inputAccept: 'image/gif,image/jpeg,image/jpg,image/png',
                },
                inline: {
                  options: ['bold', 'italic', 'underline', 'strikethrough'],
                },
                colorPicker: {
                  colors: [
                    '#415A87',
                    '#B2861A',
                    '#EECE80',
                    '#ECCB1D',
                    '#555555',
                    '#7B7B7B',
                    '#D9D9D9',
                    '#F9F9F9',
                    '#EC5254',
                    '#4CB080',
                    '#1C3259',
                    '#FFFFFF',
                    '#000000',
                  ],
                },
              }}
              editorState={editorState}
              wrapperClassName="text-editor-wrapper pb-5"
              editorClassName="mx-3 mt-5 min-h-[200px] bg-white"
              onEditorStateChange={onEditorStateChange}
            />
       
            <div className="w-full px-3 pt-5 pb-3 h-[120px]">
              <textarea
                className="w-full h-[272px] focus:outline-0"
                // // @ts-ignore
                // ref={textareaEditor}
                value={editorHTML}
                onChange={onEditEditorHTML}
                placeholder="Code Editor"
              />
            </div>
        </div>
    </>
  );
}

export default App;
