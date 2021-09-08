/**
 * This file was generated from WebViewer.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { CSSProperties } from "react";
import { ActionValue, EditableValue } from "mendix";

export interface WebViewerContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex: number;
    urlAttribute: EditableValue<string>;
    codeAction?: ActionValue;
    annotationAttribute: EditableValue<string>;
}

export interface WebViewerPreviewProps {
    class: string;
    style: string;
    urlAttribute: string;
    codeAction: {} | null;
    annotationAttribute: string;
}
