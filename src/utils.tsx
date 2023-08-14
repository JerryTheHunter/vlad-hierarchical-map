import * as go from "gojs";

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

export function transformData1(
    data: JSONDataObject[] | go.ObjectData[],
    nodeDataArray: go.ObjectData[] = [],
    linkDataArray: go.ObjectData[] = [],
    shouldUnshift?: boolean
): { nodeDataArray: go.ObjectData[], linkDataArray: go.ObjectData[] } {
    nodeDataArray.push({name: "Hierarchy map", isGroup: true, key: "main", category: "mapGroup"})
    data.forEach(item => {
        const node: go.ObjectData = {...item, key: item.sys_id}
        if (shouldUnshift) {
            nodeDataArray.unshift({...node, isUpstream: true})
        } else {
            nodeDataArray.push(node)
        }

        if (node.children?.length) {
            node.isGroup = true;
            node.group = "main"
            node.children.forEach((child: JSONDataObject) => {
                const childNode = {...child, group: node.key, key: child.sys_id}

                if (child.children?.length) {
                    transformData1(child.children, nodeDataArray, linkDataArray)
                }
                if (child.referrers?.length) {
                    child.referrers.forEach(subChild => {
                        linkDataArray.push({
                            to: childNode.key,
                            from: subChild.element.sys_id,
                            text: subChild.relationship.typeName,
                            curviness: -10
                        })
                    })
                    transformData1(child.referrers.map(subChild => ({
                        ...subChild.element,
                        group: "main"
                    })), nodeDataArray, linkDataArray, true)
                }
                nodeDataArray.push(childNode)

            })
        }

        if (node.referrers?.length) {
            node.referrers.forEach((referrer: ReferrerObject) => {
                nodeDataArray.unshift({
                    ...referrer.element,
                    key: referrer.element.sys_id,
                    group: "main",
                    isUpstream: true
                })
                linkDataArray.push({
                    from: referrer.element.sys_id,
                    to: node.key,
                    text: referrer.relationship.typeName,
                    curviness: -10
                })

            })
        }
    })

    const trimmedArray = removeDuplicates(nodeDataArray);

    const filterByGroup: go.ObjectData[] = trimmedArray.map(item => {
        if (item.isUpstream && item.group === "main") {
            return {...item, group: "upstreamGroup"}
        }
        if (!item.isUpstream && item.group === "main") {
            return {...item, group: "nodesGroup"}
        }
        return item;

    })

    filterByGroup.push({
        name: "Upstream group",
        isGroup: true,
        key: "upstreamGroup",
        category: "upstreamGroup",
        group: "main"
    })
    filterByGroup.push({name: "Nodes group", isGroup: true, key: "nodesGroup", category: "nodesGroup", group: "main"})

    return {nodeDataArray: filterByGroup, linkDataArray};
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








