import * as go from "gojs";

import suitCase from "./assets/Suitcase-work-icon-by-marco.livolsi2014-580x386.jpg"
import human from "./assets/color-human.jpeg"

interface ReferrerObject {
    element: {
        name: string;
        sys_id: string;
        tableName: string;
        tableLabel: string;
        data: {};
    };
    relationship: {
        typeName: string;
        baseType: string;
        sys_id: string;
        isParent: boolean;
        additionalFields: [];
        style: null;
        data: {};
    };
}

interface JSONDataObject {
    name: string;
    sys_id: string;
    tableName: string;
    tableLabel: string;
    referrers: ReferrerObject[];
    children: JSONDataObject[];
    descendantsCount: number;
    data: {};
    renderThisBranch: boolean;
}

export enum OrientationEnum {
    vertical = "nodesGroupVertical",
    horizontal = "nodesGroupHorizontal",
    auto = "nodesGroupDefault",
}

export enum LayoutEnum {
    compact = "compactNodeTemplate",
    traditional = "defaultNodeTemplate",
    text = "textOnlyNodeTemplate",

}

function removeDuplicates(data: Array<go.ObjectData>): go.ObjectData[] {
    return data.map((item, index, self) => {
        const array = [...self]
        const duplicateItem = array.find((subItem, subIndex) => {
            if (subIndex === index) {
                return null
            }
            return subItem.key === item.key
        })

        return duplicateItem ? {...duplicateItem, sys__id: Math.random()*1000 + "blablabla"} : item;
    });

}

export const transformData = (
    data: any,
    parentObject?: go.ObjectData,
    maxNestingLevel: number = Infinity,
    currentNestingLevel: number = 0
) => {
    const initialData = [
        { name: "Nodes group", isGroup: true, key: "nodesGroup", category: "nodesGroup", group: "main" },
        { name: "Hierarchy map", isGroup: true, key: "main", category: "mapGroup" },
        { name: "Upstream group", isGroup: true, key: "upstreamGroup", category: "upstreamGroup", group: "main" },
    ];

    let nodeDataArray: Array<go.ObjectData> = parentObject ? [] : [...initialData];
    let linkDataArray: Array<go.ObjectData> = [];

    data?.forEach((obj: JSONDataObject) => {
        const updatedObject: go.ObjectData = {
            ...obj,
            group: parentObject?.key || "nodesGroup",
            key: obj.sys_id,
            image: suitCase
        };

        if (currentNestingLevel < maxNestingLevel && updatedObject.children?.length) {
            updatedObject.isGroup = true;
            const newData = transformData(updatedObject.children, updatedObject, maxNestingLevel, currentNestingLevel + 1);
            nodeDataArray.push(...newData.nodeDataArray);
            linkDataArray.push(...newData.linkDataArray);
        }

        updatedObject.referrers?.forEach((referrer: ReferrerObject) => {
            linkDataArray.push({
                to: updatedObject.key,
                from: referrer.element.sys_id,
                text: referrer.relationship.typeName,
                curviness: -10,
            });

            nodeDataArray.push({
                ...referrer.element,
                key: referrer.element.sys_id,
                group: "upstreamGroup",
                isUpstream: true,
                image: human
            });
        });

        nodeDataArray.push(updatedObject);
    });

    nodeDataArray = removeDuplicates(nodeDataArray);

    return { nodeDataArray: nodeDataArray, linkDataArray: linkDataArray };
};

export const findMaxNestingLevel = (data: any): number => {
    let maxLevel = 0;

    const findMaxLevelRecursive = (data: any, currentLevel: number) => {
        if (data && Array.isArray(data) && data.length > 0) {
            maxLevel = Math.max(maxLevel, currentLevel);

            data.forEach((obj: JSONDataObject) => {
                if (obj.children && Array.isArray(obj.children)) {
                    findMaxLevelRecursive(obj.children, currentLevel + 1);
                }
            });
        }
    };

    findMaxLevelRecursive(data, 0);

    return maxLevel;
};








