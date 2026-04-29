declare namespace LazyTreeScssNamespace {
  export interface ILazyTreeScss {
    alignedTerm: string;
    alignmentNodeRow: string;
    alignmentTree: string;
    alignmentTreeContainer: string;
    baseTerm: string;
    cancelScrollingTo: string;
    component: string;
    componentSpinner: string;
    decorateHighlightLeaf: string;
    decorateHighlightParent: string;
    decoratedNodeBody: string;
    findAlignedButton: string;
    highlighted: string;
    legacySearchField: string;
    legacySearchInput: string;
    nodeInfoButton: string;
    nodeInfoPopup: string;
    scrollNotification: string;
    scrollSpinner: string;
    scrollToName: string;
    searchMessage: string;
    searchSpinner: string;
    unalignButton: string;
  }
}

declare const LazyTreeScssModule: LazyTreeScssNamespace.ILazyTreeScss;

export = LazyTreeScssModule;
