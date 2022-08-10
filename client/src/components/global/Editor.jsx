import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { uploadFile } from './../../utils/imageHelper';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const container = [
  [{ font: [] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown

  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript

  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction
  [{ align: [] }],

  ['clean', 'link', 'image', 'video'],
];

const Editor = ({ content, setContent }) => {
  const dispatch = useDispatch();
  const quillRef = useRef(null);

  const modules = { toolbar: { container } };

  const handleChangeImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = async () => {
      const files = input.files;
      if (!files)
        return dispatch({
          type: 'alert/alert',
          payload: { errors: 'File does not exist.' },
        });

      const file = files[0];

      dispatch({ type: 'alert/alert', payload: { loading: true } });
      const photo = await uploadFile([file], 'newsletter');

      const quill = quillRef.current;
      const range = quill?.getEditor().getSelection()?.index;
      if (range !== undefined) {
        quill?.getEditor().insertEmbed(range, 'image', `${photo[0]}`);
      }

      dispatch({ type: 'alert/alert', payload: { loading: false } });
    };
  }, [dispatch]);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    let toolbar = quill.getEditor().getModule('toolbar');
    toolbar.addHandler('image', handleChangeImage);
  }, [handleChangeImage]);

  return (
    <div className="mt-3">
      <ReactQuill
        theme="snow"
        modules={modules}
        placeholder="Write somethings..."
        onChange={(e) => setContent(e)}
        value={content}
        ref={quillRef}
      />
    </div>
  );
};

export default Editor;
