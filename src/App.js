// import logo from './logo.svg';
import './App.css';
import { useState, createRef, useMemo, useEffect, useRef } from 'react'
import {dynamic} from 'next/dynamic'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { EditorProps } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import styled from 'styled-components'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

/* eslint-disable */
const htmlToDraft =
  typeof window === 'object' && require('html-to-draftjs').default

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
)

function App() {
  const openPageFirstTime = useRef(true)
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [showEditorCode, setShowEditorCode] = useState(false)
  const [editorHTML, setEditorHTML] = useState('')

  useEffect(() => {
    if (openPageFirstTime.current && value) {
      const contentBlock = htmlToDraft(value)
      let editor
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        )
        editor = EditorState.createWithContent(contentState)
      } else {
        editor = EditorState.createEmpty()
      }
      setEditorHTML(unescape(value))
      setEditorState(editor)
      openPageFirstTime.current = false
    }
  }, [value, openPageFirstTime.current])

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
    onChangeController(unescape(html))
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
    setEditorHTML(_editorHTML)
    setEditorState(editor)
    onChangeController(_editorHTML)
  }

  const convertHTMLtoBlock = () => {
    if (html) {
      const blocksFromHtml = htmlToDraft(html)
      setEditorHTML(html)
      const { contentBlocks, entityMap } = blocksFromHtml
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      )
      setEditorState(EditorState.createWithContent(contentState))
    }
  }

  useMemo(() => {
    convertHTMLtoBlock()
  }, [html])

  const toggleEditorCode = () => {
    setShowEditorCode(!showEditorCode)
  }

  return (
    <div>
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
                  // uploadCallback: uploadCallback,
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
              readOnly={readOnly}
            />
    </div>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
