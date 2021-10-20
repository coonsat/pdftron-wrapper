import { createElement, useRef, useEffect, useState } from "react";
import viewer, { CoreControls, WebViewerInstance } from "@pdftron/webviewer";

export interface InputProps {    
    mendixProps: any
}

const PDFViewer: React.FC<InputProps> = ({ mendixProps }) => {    
    const viewerRef = useRef<HTMLDivElement>(null);    
    const [instance, setInstance] = useState<null | WebViewerInstance>(null);
    const [annotationManager, setAnnotationManager] = useState<null | CoreControls.AnnotationManager>(null);
    const [docViewer, setDocViewer] = useState<null | CoreControls.DocumentViewer>(null);

useEffect(() => {    
        console.log('Hello Christoph!');    
        viewer({                
            path: "/resources/lib",            
        }, viewerRef.current as HTMLDivElement).then(instance => {
            const { docViewer } = instance; 
            setInstance(instance);
            setDocViewer(docViewer);
            // const annMan = docViewer.getAnnotationManager();
            setAnnotationManager(docViewer.getAnnotationManager());

            docViewer.on('documentLoaded', () => {
                console.log(annotationManager ? 'NOT EMPTY' : 'EMPTY')
                if (annotationManager) {
                    console.log(annotationManager ? 'NOT EMPTY' : 'EMPTY')
                    annotationManager.importAnnotations(mendixProps.annotationAttribute.value);
                }
            });
            
        });    
    }, []);
    
    // load document coming from the URL attribute 
    useEffect(() => {
        console.log('Hello second useEffect');
            if (mendixProps.urlAttribute.status !== 'unavailable') {
                if(instance && mendixProps.urlAttribute.value !== '') {
                    instance.loadDocument(mendixProps.urlAttribute.value);
                    //sme change
                } 
    
                // if(instance && mendixProps.annotationAttribute.value !== '') {
                //     instance.loadDocument(mendixProps.urlAttribute.value);
                // } 
    
                if (docViewer && annotationManager) {
                    docViewer.on('documentLoaded', () => {
                        console.log(mendixProps.annotationAttribute);
                        if (mendixProps.annotationAttribute.status !== 'unavailable') {
                            annotationManager.importAnnotations(mendixProps.annotationAttribute.value);
                            const test = annotationManager.canModifyContents(mendixProps.annotationAttribute.value);
                            console.log(test);
                            const user = annotationManager.getCurrentUser();
                            console.log(user)
                        }
                    });
                }
            }
    }, [instance, mendixProps.annotationAttribute.value]);

    // save annotation data to the annotation attribute
    useEffect(() => {

        const callNanoflow = ()=> {
            const { codeAction } = mendixProps;
            codeAction.execute();
        }

        const updateAnnotation = async () => {
            console.log(annotationManager ? 'Is not empty' : 'is empy');
            if (annotationManager) {
                const xfdf = await annotationManager.exportAnnotations({ links: false, widgets: false });
                mendixProps.annotationAttribute.setValue(xfdf);
                callNanoflow();
            }
        }

        if (instance && annotationManager) {
            instance.setHeaderItems(header => {
                header.push({
                    type: 'actionButton',
                    img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>', onClick: updateAnnotation
                });
            });
        }
    }, [instance, annotationManager]);

    // useEffect(() => {
    //     if (annotationManager) {
    //         console.log(mendixProps);
    //         console.log("space between")
    //         console.log(mendixProps.annotationAttribute)
    //         annotationManager.importAnnotations(mendixProps.annotationAttribute.value)
    //     }
    // })

    return <div className="webviewer" ref={viewerRef}></div>;
};

export default PDFViewer;