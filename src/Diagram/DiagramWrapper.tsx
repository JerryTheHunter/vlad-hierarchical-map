import * as go from 'gojs';

import {useEffect, useState, useCallback} from 'react';
import {useImmer} from 'use-immer';

//components
import {Diagram} from './Diagram'
import {SelectionInspector} from '../Inspector/SelectionInspector';

//helpers
import {transformData} from "../utils";
import {data1} from "../mock";


export type DiagramData = {
    nodeDataArray: Array<go.ObjectData>;
    linkDataArray: Array<go.ObjectData>;
    modelData: go.ObjectData;
    selectedData: go.ObjectData | null;
    skipsDiagramUpdate: boolean;
}

export default function DiagramWrapper() {
    // Maps to store key -> arr index for quick lookups
    const [mapNodeKeyIdx, setMapNodeKeyIdx] = useState<Map<go.Key, number>>(new Map<go.Key, number>());
    const [mapLinkKeyIdx, setMapLinkKeyIdx] = useState<Map<go.Key, number>>(new Map<go.Key, number>());
    const [inspector, setInspector] = useState<JSX.Element>();

    const transformedData = transformData(data1, undefined, 3);

    const [diagramData, updateDiagram] = useImmer<DiagramData>({
        modelData: {
            canRelink: true
        },
        selectedData: null,
        skipsDiagramUpdate: false,
        ...transformedData
    });


    // Update map of node keys to their index in the array.
    const refreshNodeIndex = useCallback((nodeArr: Array<go.ObjectData>) => {
        const newMapNodeKeyIdx: Map<go.Key, number> = new Map<go.Key, number>();
        nodeArr.forEach((n: go.ObjectData, idx: number) => {
            newMapNodeKeyIdx.set(n.key, idx);
        });
        setMapNodeKeyIdx(newMapNodeKeyIdx);
    }, []);

    //Update map of link keys to their index in the array.
    const refreshLinkIndex = useCallback((linkArr: Array<go.ObjectData>) => {
        const newMapLinkKeyIdx: Map<go.Key, number> = new Map<go.Key, number>();
        linkArr.forEach((l: go.ObjectData, idx: number) => {
            newMapLinkKeyIdx.set(l.key, idx);
        });
        setMapLinkKeyIdx(newMapLinkKeyIdx);
    }, []);

    const handleDiagramEvent = (e: go.DiagramEvent) => {
        const name = e.name;
        switch (name) {
            case 'ChangedSelection': {
                const sel = e.subject.first();
                updateDiagram((draft: DiagramData) => {
                    if (sel) {
                        if (sel instanceof go.Node) {
                            const idx = mapNodeKeyIdx.get(sel.key);
                            if (idx !== undefined && idx >= 0) {
                                draft.selectedData = draft.nodeDataArray[idx];
                            }
                        } else if (sel instanceof go.Link) {
                            const idx = mapLinkKeyIdx.get(sel.key);
                            if (idx !== undefined && idx >= 0) {
                                draft.selectedData = draft.linkDataArray[idx];
                            }
                        }
                    } else {
                        draft.selectedData = null;
                    }
                });
                break;
            }
            default:
                break;
        }
    };

    const handleModelChange = (obj: go.IncrementalData) => {
        const insertedNodeKeys = obj.insertedNodeKeys;
        const modifiedNodeData = obj.modifiedNodeData;
        const removedNodeKeys = obj.removedNodeKeys;
        const insertedLinkKeys = obj.insertedLinkKeys;
        const modifiedLinkData = obj.modifiedLinkData;
        const removedLinkKeys = obj.removedLinkKeys;
        const modifiedModelData = obj.modelData;

        // maintain maps of modified data so insertions don't need slow lookups
        const modifiedNodeMap = new Map<go.Key, go.ObjectData>();
        const modifiedLinkMap = new Map<go.Key, go.ObjectData>();

        updateDiagram((draft: DiagramData) => {
            let narr = draft.nodeDataArray;
            if (modifiedNodeData) {
                modifiedNodeData.forEach((nd: go.ObjectData) => {
                    modifiedNodeMap.set(nd.key, nd);
                    const idx = mapNodeKeyIdx.get(nd.key);
                    if (idx !== undefined && idx >= 0) {
                        narr[idx] = nd;
                        if (draft.selectedData && draft.selectedData.key === nd.key) {
                            draft.selectedData = nd;
                        }
                    }
                });
            }
            if (insertedNodeKeys) {
                insertedNodeKeys.forEach((key: go.Key) => {
                    const nd = modifiedNodeMap.get(key);
                    const idx = mapNodeKeyIdx.get(key);
                    if (nd && idx === undefined) {  // nodes won't be added if they already exist
                        mapNodeKeyIdx.set(nd.key, narr.length);
                        narr.push(nd);
                    }
                });
            }
            if (removedNodeKeys) {
                narr = narr.filter((nd: go.ObjectData) => {
                    return !removedNodeKeys.includes(nd.key);

                });
                draft.nodeDataArray = narr;
                refreshNodeIndex(narr);
            }

            let larr = draft.linkDataArray;
            if (modifiedLinkData) {
                modifiedLinkData.forEach((ld: go.ObjectData) => {
                    modifiedLinkMap.set(ld.key, ld);
                    const idx = mapLinkKeyIdx.get(ld.key);
                    if (idx !== undefined && idx >= 0) {
                        larr[idx] = ld;
                        if (draft.selectedData && draft.selectedData.key === ld.key) {
                            draft.selectedData = ld;
                        }
                    }
                });
            }
            if (insertedLinkKeys) {
                insertedLinkKeys.forEach((key: go.Key) => {
                    const ld = modifiedLinkMap.get(key);
                    const idx = mapLinkKeyIdx.get(key);
                    if (ld && idx === undefined) {  // links won't be added if they already exist
                        mapLinkKeyIdx.set(ld.key, larr.length);
                        larr.push(ld);
                    }
                });
            }
            if (removedLinkKeys) {
                larr = larr.filter((ld: go.ObjectData) => {
                    return !removedLinkKeys.includes(ld.key);

                });
                draft.linkDataArray = larr;
                refreshLinkIndex(larr);
            }
            // handle model data changes, for now just replacing with the supplied object
            if (modifiedModelData) {
                draft.modelData = modifiedModelData;
            }
            draft.skipsDiagramUpdate = true;  // the GoJS model already knows about these updates
        });
    };

    /**
     * Handle changes to the checkbox on whether to allow relinking.
     * @param e a change event from the checkbox
     */

    useEffect(() => {
        refreshNodeIndex(diagramData.nodeDataArray);
        refreshLinkIndex(diagramData.linkDataArray);
    }, [refreshNodeIndex, refreshLinkIndex, diagramData.nodeDataArray, diagramData.linkDataArray]);

    // Handle selections
    useEffect(() => {
        /**
         * Handle inspector changes, and on input field blurs, update node/link data state.
         * @param path the path to the property being modified
         * @param value the new value of that property
         * @param isBlur whether the input event was a blur, indicating the edit is complete
         */
        const handleInputChange = (path: string, value: string, isBlur: boolean) => {
            updateDiagram((draft: DiagramData) => {
                const data = draft.selectedData as go.ObjectData;  // only reached if selectedData isn't null
                data[path] = value;
                if (isBlur) {
                    const key = data.key;
                    if (key < 0) {  // negative keys are links
                        const idx = mapLinkKeyIdx.get(key);
                        if (idx !== undefined && idx >= 0) {
                            draft.linkDataArray[idx] = data;
                            draft.skipsDiagramUpdate = false;
                        }
                    } else {
                        const idx = mapNodeKeyIdx.get(key);
                        if (idx !== undefined && idx >= 0) {
                            draft.nodeDataArray[idx] = data;
                            draft.skipsDiagramUpdate = false;
                        }
                    }
                }
            });
        };

        const selectedData = diagramData.selectedData;
        let inspector;
        if (selectedData !== null) {
            inspector = <SelectionInspector
                selectedData={diagramData.selectedData}
                onInputChange={handleInputChange}
            />;
            setInspector(inspector);
        }
    }, [diagramData.selectedData, mapLinkKeyIdx, mapNodeKeyIdx, updateDiagram]);

    return (
        <div>
            <Diagram
                originalData={data1}
                diagramData={diagramData}
                onDiagramEvent={handleDiagramEvent}
                onModelChange={handleModelChange}
            />
            {inspector}
        </div>
    );
};
