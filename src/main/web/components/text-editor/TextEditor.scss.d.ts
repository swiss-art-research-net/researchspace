declare namespace TextEditorScssNamespace {
  export interface ITextEditorScss {
    draggableGripper: string;
    dropdownMenuItem: string;
    dropdownMenuItemIcon: string;
    editorContainer: string;
    externalLink: string;
    externalLinkHolder: string;
    internalLink: string;
    linkPopover: string;
    narrativeHolder: string;
    resourceBlock: string;
    resourceBlockActive: string;
    sidebar: string;
    sidebarAndEditorHolder: string;
    sidebarContainer: string;
    sidebarDropdown: string;
    titleHolder: string;
    titleInput: string;
    toolbar: string;
    toolbarBtnGroup: string;
  }
}

declare const TextEditorScssModule: TextEditorScssNamespace.ITextEditorScss;

export = TextEditorScssModule;
