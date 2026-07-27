'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

function ToolbarButton({
  onClick,
  isActive,
  label,
  children,
}: {
  onClick: () => void;
  isActive: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`rounded-sm border px-2.5 py-1.5 text-xs font-medium transition-colors ${
        isActive
          ? 'border-primary bg-primary text-white'
          : 'border-slate-200 text-primary hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 p-2">
      <ToolbarButton
        label="Heading 1"
        isActive={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </ToolbarButton>
      <ToolbarButton
        label="Heading 2"
        isActive={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        isActive={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>
      <ToolbarButton
        label="Heading 4"
        isActive={editor.isActive('heading', { level: 4 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      >
        H4
      </ToolbarButton>

      <div className="mx-1 w-px bg-slate-200" />

      <ToolbarButton
        label="Paragraph"
        isActive={editor.isActive('paragraph')}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        P
      </ToolbarButton>

      <div className="mx-1 w-px bg-slate-200" />

      <ToolbarButton
        label="Bold"
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <span className="font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        isActive={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <span className="underline">U</span>
      </ToolbarButton>

      <div className="mx-1 w-px bg-slate-200" />

      <ToolbarButton
        label="Bullet List"
        isActive={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • List
      </ToolbarButton>
    </div>
  );
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        orderedList: false,
        strike: false,
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'rich-content px-3 py-2',
        'data-placeholder': placeholder || '',
      },
    },
    onUpdate: ({ editor: updatedEditor }) => {
      onChange(updatedEditor.getHTML());
    },
  });

  return (
    <div className="rich-content-editor overflow-hidden rounded-sm border border-slate-200 bg-white">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
