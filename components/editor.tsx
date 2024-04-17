// "use client";
// import { useEffect } from "react";

// import { useCreateBlockNote, BlockNoteView } from "@blocknote/react";
// import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
// import { useTheme } from "next-themes";

// interface EditorProps {
//     onChange: (value: string) => void;
//     initialContent?: string;
// }

// export const Editor = ({
//     onChange,
//     initialContent,
// }: EditorProps) => {

//     const { resolvedTheme } = useTheme();
//     // Initialize BlockNote editor
//     const editor: BlockNoteEditor = useCreateBlockNote({
//         initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined
//     });

//     // Subscribe to editor content changes
//     useEffect(() => {
//         const handleEditorChange = () => {
//             onChange(JSON.stringify(editor.document, null, 2));
//         };

//         // Subscribe to editor content changes using BlockNoteView's onChange event
//         editor.onChange(handleEditorChange);

//         // Unsubscribe when component unmounts
//         return () => {
//             editor.onChange(handleEditorChange);
//         };
//     }, [editor, onChange]);

//     return (
//         <div>
//             <BlockNoteView
//                 editor={editor}
//                 theme={resolvedTheme === "dark" ? "dark" : "light"}
//             />
//         </div>
//     );
// };

"use client";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";

import "@blocknote/react/style.css";
import { useTheme } from "next-themes";

import { useState, useEffect } from "react";


interface EditorProps {
    onChange: (value: string) => void;
    initialContent?: string;
}

export const Editor = ({
    onChange,
    initialContent,
}: EditorProps) => {

    const { resolvedTheme } = useTheme();

    const [editorContent, setEditorContent] = useState<string>("");

    // Initialise BlockNote editor
    const editor: BlockNoteEditor = useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined
    });
    // Subscribe to editor content changes
    useEffect(() => {
        const handleEditorChange = () => {
            const content = JSON.stringify(editor.document, null, 2);
            setEditorContent(content);
            onChange(content);
        };

    editor.onChange(handleEditorChange);

    // Clean up the subscription when the component unmounts
    return () => {
        editor.onChange(handleEditorChange);
    };
}, [editor, onChange]);

    // Renders the editor instance using a React component.
    return (
        <div>
            <BlockNoteView 
                editor={editor}
                theme={resolvedTheme === "dark" ? "dark" : "light"}
                //onChange={onChange}
            />
        </div>
    );
};
 